const { EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'tweet',
    description: 'Tweet sistemi menüsünü açın',
    execute: async (message, args, client) => {
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('tweet_menu')
            .setPlaceholder('Tweet sistemi seçenekleri')
            .addOptions([
                {
                    label: 'Tweet Oluştur',
                    description: 'Yeni bir tweet görseli oluştur',
                    value: 'create_tweet',
                    emoji: '🐦'
                },
                {
                    label: 'Bilgi',
                    description: 'Tweet sistemi hakkında bilgi al',
                    value: 'tweet_info',
                    emoji: 'ℹ️'
                }
            ]);
        
        const row = new ActionRowBuilder().addComponents(selectMenu);
        
        const embed = new EmbedBuilder()
            .setColor(client.config.colors.tweet)
            .setTitle('🐦 Tweet Sistemi')
            .setDescription('Aşağıdaki menüden bir seçenek seçin:')
            .setTimestamp();
        
        await message.reply({ embeds: [embed], components: [row] });
    }
};

// Tweet modal oluşturma fonksiyonu
function createTweetModal() {
    const modal = new ModalBuilder()
        .setCustomId('tweet_modal')
        .setTitle('Tweet Oluştur');
    
    const usernameInput = new TextInputBuilder()
        .setCustomId('username')
        .setLabel('Kullanıcı Adı')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('Kullanıcı adınızı girin')
        .setRequired(true);
    
    const messageInput = new TextInputBuilder()
        .setCustomId('message')
        .setLabel('Tweet Mesajı')
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder('Tweet mesajınızı girin')
        .setRequired(true)
        .setMaxLength(280);
    
    const firstActionRow = new ActionRowBuilder().addComponents(usernameInput);
    const secondActionRow = new ActionRowBuilder().addComponents(messageInput);
    
    modal.addComponents(firstActionRow, secondActionRow);
    return modal;
}

// Tweet oluşturma fonksiyonu
async function createTweet(interaction, username, message) {
    try {
        const avatarUrl = interaction.user.displayAvatarURL({ extension: 'png' });
        const encodedUsername = encodeURIComponent(username);
        const encodedMessage = encodeURIComponent(message);
        
        const apiUrl = `${interaction.client.config.apis.tweet}?avatar=${avatarUrl}&username=${encodedUsername}&username2=yeninesiltv&message=${encodedMessage}&theme=dark`;
        
        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data);
        
        const attachment = new AttachmentBuilder(buffer, { name: 'tweet.png' });
        
        const tweetEmbed = new EmbedBuilder()
            .setColor(interaction.client.config.colors.tweet)
            .setTitle('🐦 Tweet Oluşturuldu!')
            .setDescription(`**@${username}** tarafından oluşturuldu`)
            .setImage('attachment://tweet.png')
            .setTimestamp();
        
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('tweet_like')
                    .setLabel('❤️ Like')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('tweet_regenerate')
                    .setLabel('🔄 Yeniden Oluştur')
                    .setStyle(ButtonStyle.Primary)
            );
        
        await interaction.reply({ 
            embeds: [tweetEmbed], 
            files: [attachment],
            components: [row]
        });
    } catch (error) {
        console.error('Tweet oluşturma hatası:', error);
        const errorEmbed = new EmbedBuilder()
            .setColor(interaction.client.config.colors.error)
            .setTitle('Hata!')
            .setDescription('Tweet oluşturulurken bir hata oluştu.')
            .setTimestamp();
        
        await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
}

// Tweet bilgi embed'i
function createTweetInfoEmbed(client) {
    return new EmbedBuilder()
        .setColor(client.config.colors.tweet)
        .setTitle('🐦 Tweet Sistemi Hakkında')
        .setDescription('Bu sistem ile Twitter benzeri tweet görselleri oluşturabilirsiniz.')
        .addFields(
            { name: '📝 Tweet Oluştur', value: 'Kendi tweet görselinizi oluşturun', inline: false },
            { name: '❤️ Beğeni', value: 'Oluşturulan tweetleri beğenebilirsiniz', inline: false },
            { name: '🔄 Yeniden Oluştur', value: 'Tweetleri farklı içerikle yeniden oluşturun', inline: false }
        )
        .setFooter({ text: 'Tweet sistemi aktif!' })
        .setTimestamp();
}

// Like buton etkileşimi
async function handleTweetLike(interaction, client) {
    const likeEmbed = new EmbedBuilder()
        .setColor(client.config.colors.tweet)
        .setTitle('❤️ Beğenildi!')
        .setDescription('Tweet beğenildi!')
        .setTimestamp();
    
    await interaction.reply({ embeds: [likeEmbed], ephemeral: true });
}

// Yeniden oluştur buton etkileşimi
async function handleTweetRegenerate(interaction) {
    const modal = createTweetModal();
    await interaction.showModal(modal);
}

// Menü seçimi etkileşimi
async function handleTweetMenu(interaction, client) {
    if (interaction.values[0] === 'create_tweet') {
        const modal = createTweetModal();
        await interaction.showModal(modal);
    } else if (interaction.values[0] === 'tweet_info') {
        const infoEmbed = createTweetInfoEmbed(client);
        await interaction.reply({ embeds: [infoEmbed], ephemeral: true });
    }
}

// Modal gönderimi etkileşimi
async function handleTweetModal(interaction) {
    const username = interaction.fields.getTextInputValue('username');
    const message = interaction.fields.getTextInputValue('message');
    await createTweet(interaction, username, message);
}

// Etkileşim işleyicilerini export et
module.exports.handleTweetLike = handleTweetLike;
module.exports.handleTweetRegenerate = handleTweetRegenerate;
module.exports.handleTweetMenu = handleTweetMenu;
module.exports.handleTweetModal = handleTweetModal;
module.exports.createTweetModal = createTweetModal;