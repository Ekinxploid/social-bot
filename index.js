const { Client, GatewayIntentBits, Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Config dosyasını yükle
const config = require('./config.json');

// Bot client oluştur
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Config'i client'a ekle
client.config = config;

// Komutlar ve coin sistemi için koleksiyonlar
client.commands = new Collection();
client.coins = new Map();
client.messageCounts = new Map();
client.chestTimers = new Map();
client.dailyRewards = new Map();

// Coin verilerini yükle
const coinsFile = './coins.json';
if (fs.existsSync(coinsFile)) {
    const data = fs.readFileSync(coinsFile, 'utf8');
    const coinsData = JSON.parse(data);
    client.coins = new Map(Object.entries(coinsData));
}

// Günlük ödül verilerini yükle
const dailyFile = './daily.json';
if (fs.existsSync(dailyFile)) {
    const data = fs.readFileSync(dailyFile, 'utf8');
    const dailyData = JSON.parse(data);
    client.dailyRewards = new Map(Object.entries(dailyData));
}

// Coin verilerini kaydet
function saveCoins() {
    const coinsData = Object.fromEntries(client.coins);
    fs.writeFileSync(coinsFile, JSON.stringify(coinsData, null, 2));
}

// Günlük ödül verilerini kaydet
function saveDailyRewards() {
    const dailyData = Object.fromEntries(client.dailyRewards);
    fs.writeFileSync(dailyFile, JSON.stringify(dailyData, null, 2));
}

// Komutları yükle
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        
        if ('name' in command && 'execute' in command) {
            client.commands.set(command.name, command);
        }
    }
}

// Event dosyalarını yükle
const eventsPath = path.join(__dirname, 'events');
if (fs.existsSync(eventsPath)) {
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
    
    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
        
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    }
}

// Sandık etkinliği fonksiyonu
async function createChestEvent(channel, client) {
    const correctButton = Math.floor(Math.random() * 5) + 1;
    
    const embed = new EmbedBuilder()
        .setColor(client.config.colors.coin)
        .setTitle('🎁 Sandık Etkinliği!')
        .setDescription(`Aşağıdaki butonlardan doğru olanı seç ve ${client.config.coin.chestReward.toLocaleString()} coin kazan!`)
        .addFields(
            { name: '1️⃣', value: 'Seçenek 1', inline: true },
            { name: '2️⃣', value: 'Seçenek 2', inline: true },
            { name: '3️⃣', value: 'Seçenek 3', inline: true },
            { name: '4️⃣', value: 'Seçenek 4', inline: true },
            { name: '5️⃣', value: 'Seçenek 5', inline: true }
        )
        .setImage(client.config.coin.chestImage)
        .setFooter({ text: 'Sadece bir kez deneyebilirsin!' })
        .setTimestamp();
    
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('chest_1')
                .setLabel('1')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('chest_2')
                .setLabel('2')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('chest_3')
                .setLabel('3')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('chest_4')
                .setLabel('4')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('chest_5')
                .setLabel('5')
                .setStyle(ButtonStyle.Primary)
        );
    
    const chestMessage = await channel.send({ 
        embeds: [embed], 
        components: [row] 
    });
    
    // Buton etkileşimlerini dinle
    const filter = i => i.isButton() && i.customId.startsWith('chest_');
    const collector = chestMessage.createMessageComponentCollector({ 
        filter, 
        time: client.config.coin.chestTimeout,
        max: 1 
    });
    
    collector.on('collect', async i => {
        const selectedButton = parseInt(i.customId.split('_')[1]);
        
        if (selectedButton === correctButton) {
            // Doğru seçim - coin ver
            const userId = i.user.id;
            const currentCoins = client.coins.get(userId) || 0;
            client.coins.set(userId, currentCoins + client.config.coin.chestReward);
            
            // Coin verilerini kaydet
            const coinsData = Object.fromEntries(client.coins);
            fs.writeFileSync('./coins.json', JSON.stringify(coinsData, null, 2));
            
            const winEmbed = new EmbedBuilder()
                .setColor(client.config.colors.success)
                .setTitle('🎉 Tebrikler!')
                .setDescription(`${i.user} doğru seçimi yaptı ve **${client.config.coin.chestReward.toLocaleString()} coin** kazandı!`)
                .setFooter({ text: 'Sandık etkinliği tamamlandı!' })
                .setTimestamp();
            
            await i.update({ embeds: [winEmbed], components: [] });
        } else {
            // Yanlış seçim
            const loseEmbed = new EmbedBuilder()
                .setColor(client.config.colors.error)
                .setTitle('❌ Yanlış Seçim!')
                .setDescription(`${i.user} yanlış seçimi yaptı. Doğru cevap **${correctButton}** idi.`)
                .setFooter({ text: 'Sandık etkinliği tamamlandı!' })
                .setTimestamp();
            
            await i.update({ embeds: [loseEmbed], components: [] });
        }
    });
    
    collector.on('end', async () => {
        // Zaman aşımı durumunda butonları devre dışı bırak
        const timeoutEmbed = new EmbedBuilder()
            .setColor(client.config.colors.warning)
            .setTitle('⏰ Zaman Aşımı!')
            .setDescription('Sandık etkinliği süresi doldu. Doğru cevap **' + correctButton + '** idi.')
            .setTimestamp();
        
        try {
            await chestMessage.edit({ embeds: [timeoutEmbed], components: [] });
        } catch (error) {
            console.error('Sandık mesajı güncellenemedi:', error);
        }
    });
}

// Zaman tabanlı sandık etkinliği sistemi
function startChestTimer(guildId, client) {
    // Eğer zaten bir timer varsa, onu temizle
    if (client.chestTimers.has(guildId)) {
        clearInterval(client.chestTimers.get(guildId));
    }
    
    // Yeni timer başlat
    const timer = setInterval(async () => {
        try {
            const guild = client.guilds.cache.get(guildId);
            if (!guild) {
                clearInterval(timer);
                client.chestTimers.delete(guildId);
                return;
            }
            
            // Belirtilen kanal ID'sini bul veya rastgele kanal seç
            let targetChannel = null;
            
            // Önce config'de belirtilen kanal ID'sini ara
            if (client.config.coin.targetChannelId && client.config.coin.targetChannelId !== "1234567890123456789") {
                targetChannel = guild.channels.cache.get(client.config.coin.targetChannelId);
                
                // Kanal bulundu mu ve izinler var mı kontrol et
                if (targetChannel && targetChannel.type === 0 && 
                    targetChannel.permissionsFor(guild.members.me).has(['SendMessages', 'EmbedLinks'])) {
                    // Kanal uygun
                } else {
                    targetChannel = null; // Kanal uygun değil
                }
            }
            
            // Eğer belirtilen kanal bulunamazsa, rastgele kanal seç
            if (!targetChannel) {
                const channels = guild.channels.cache.filter(channel => 
                    channel.type === 0 && // TEXT_CHANNEL
                    channel.permissionsFor(guild.members.me).has(['SendMessages', 'EmbedLinks'])
                );
                
                if (channels.size === 0) return;
                targetChannel = channels.random();
            }
            
            await createChestEvent(targetChannel, client);
        } catch (error) {
            console.error('Sandık etkinliği hatası:', error);
        }
    }, client.config.coin.chestInterval);
    
    client.chestTimers.set(guildId, timer);
}

// Bot hazır olduğunda tüm sunucularda timer'ları başlat
client.once('ready', () => {
    console.log(`Bot ${client.user.tag} olarak giriş yaptı!`);
    client.user.setActivity(client.config.bot.activity.name, { type: client.config.bot.activity.type });
    
    // Tüm sunucularda sandık timer'larını başlat
    client.guilds.cache.forEach(guild => {
        startChestTimer(guild.id, client);
    });
});

// Yeni sunucuya katıldığında timer başlat
client.on('guildCreate', (guild) => {
    startChestTimer(guild.id, client);
});

// Sunucudan ayrıldığında timer'ı temizle
client.on('guildDelete', (guild) => {
    if (client.chestTimers.has(guild.id)) {
        clearInterval(client.chestTimers.get(guild.id));
        client.chestTimers.delete(guild.id);
    }
});

// Bot token'ını al ve başlat
const token = config.bot.token;

if (token === 'YOUR_BOT_TOKEN_HERE') {
    console.log('Lütfen bot token\'ınızı config.json dosyasında ayarlayın.');
    process.exit(1);
}

client.login(token);