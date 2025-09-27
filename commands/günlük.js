const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'günlük',
    description: 'Günlük ödülünüzü alın',
    execute: async (message, args, client) => {
        const userId = message.author.id;
        const currentCoins = client.coins.get(userId) || 0;
        
        // Günlük ödül verilerini kontrol et
        if (!client.dailyRewards) client.dailyRewards = new Map();
        const lastDaily = client.dailyRewards.get(userId);
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000; // 24 saat
        
        // Eğer son günlük ödül 24 saatten az ise
        if (lastDaily && (now - lastDaily) < oneDay) {
            const timeLeft = oneDay - (now - lastDaily);
            const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            
            const embed = new EmbedBuilder()
                .setColor(client.config.colors.warning)
                .setTitle('⏰ Günlük Ödül Beklemede!')
                .setDescription(`Günlük ödülünüzü zaten aldınız!`)
                .addFields(
                    { name: '⏳ Kalan Süre', value: `${hoursLeft} saat ${minutesLeft} dakika`, inline: true },
                    { name: '💰 Mevcut Coin', value: `${currentCoins.toLocaleString()}`, inline: true }
                )
                .setTimestamp();
            
            return message.reply({ embeds: [embed] });
        }
        
        // Günlük ödül miktarı (rastgele 1000-5000 arası)
        const dailyReward = Math.floor(Math.random() * 4000) + 1000;
        const newBalance = currentCoins + dailyReward;
        
        // Coin ver
        client.coins.set(userId, newBalance);
        
        // Günlük ödül zamanını kaydet
        client.dailyRewards.set(userId, now);
        
        // Verileri dosyaya kaydetmek için fonksiyon
        const saveData = (data, filename) => {
            try {
                const fs = require('fs');
                const dataObj = Object.fromEntries(data);
                fs.writeFileSync(`./${filename}.json`, JSON.stringify(dataObj, null, 2));
            } catch (error) {
                console.error(`Veri kaydedilirken hata oluştu (${filename}):`, error);
            }
        };
        
        // Coin ve günlük ödül verilerini kaydet
        saveData(client.coins, 'coins');
        saveData(client.dailyRewards, 'daily');
        
        const embed = new EmbedBuilder()
            .setColor(client.config.colors.success)
            .setTitle('🎁 Günlük Ödül Alındı!')
            .setDescription(`**${message.author.username}** günlük ödülünü aldı!`)
            .addFields(
                { name: '💰 Kazanılan', value: `${dailyReward.toLocaleString()} coin`, inline: true },
                { name: '💎 Yeni Bakiye', value: `${newBalance.toLocaleString()} coin`, inline: true },
                { name: '⏰ Sonraki Ödül', value: '24 saat sonra', inline: true }
            )
            .setFooter({ text: 'Her gün günlük ödülünüzü alabilirsiniz!' })
            .setTimestamp();
        
        await message.reply({ embeds: [embed] });
    }
};