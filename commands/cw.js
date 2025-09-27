const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'cw',
    description: 'Coin wheel oyunu - 1-10 arası sayı tahmin et',
    execute: async (message, args, client) => {
        if (args.length < 2) {
            const embed = new EmbedBuilder()
                .setColor(client.config.colors.error)
                .setTitle('❌ Hata!')
                .setDescription(`Kullanım: \`${client.config.bot.prefix}cw <miktar> <sayı>\``)
                .setTimestamp();
            
            return message.reply({ embeds: [embed] });
        }
        
        const amount = parseInt(args[0]);
        const guess = parseInt(args[1]);
        
        if (isNaN(amount) || amount <= 0) {
            const embed = new EmbedBuilder()
                .setColor(client.config.colors.error)
                .setTitle('❌ Hata!')
                .setDescription('Geçerli bir miktar girin!')
                .setTimestamp();
            
            return message.reply({ embeds: [embed] });
        }
        
        if (isNaN(guess) || guess < 1 || guess > 10) {
            const embed = new EmbedBuilder()
                .setColor(client.config.colors.error)
                .setTitle('❌ Hata!')
                .setDescription('Sayı 1-10 arasında olmalı!')
                .setTimestamp();
            
            return message.reply({ embeds: [embed] });
        }
        
        const userId = message.author.id;
        const currentCoins = client.coins.get(userId) || 0;
        
        if (currentCoins < amount) {
            const embed = new EmbedBuilder()
                .setColor(client.config.colors.error)
                .setTitle('❌ Yetersiz Bakiye!')
                .setDescription(`Yeterli coininiz yok! Mevcut: **${currentCoins.toLocaleString()}**`)
                .setTimestamp();
            
            return message.reply({ embeds: [embed] });
        }
        
        // 1-10 arası rastgele sayı
        const randomNumber = Math.floor(Math.random() * 10) + 1;
        
        if (guess === randomNumber) {
            // Kazandı - 10x ödül
            const winAmount = amount * 10;
            client.coins.set(userId, currentCoins + winAmount);
            
            const embed = new EmbedBuilder()
                .setColor(client.config.colors.success)
                .setTitle('🎉 Tebrikler!')
                .setDescription(`**${message.author.username}** coin wheel kazandı!`)
                .addFields(
                    { name: '🎯 Tahmin', value: `${guess}`, inline: true },
                    { name: '🎲 Çıkan Sayı', value: `${randomNumber}`, inline: true },
                    { name: '💰 Kazanılan', value: `${winAmount.toLocaleString()} coin`, inline: true },
                    { name: '💎 Yeni Bakiye', value: `${(currentCoins + winAmount).toLocaleString()} coin`, inline: true }
                )
                .setTimestamp();
            
            await message.reply({ embeds: [embed] });
        } else {
            // Kaybetti
            client.coins.set(userId, currentCoins - amount);
            
            const embed = new EmbedBuilder()
                .setColor(client.config.colors.error)
                .setTitle('💸 Kaybettiniz!')
                .setDescription(`**${message.author.username}** coin wheel kaybetti!`)
                .addFields(
                    { name: '🎯 Tahmin', value: `${guess}`, inline: true },
                    { name: '🎲 Çıkan Sayı', value: `${randomNumber}`, inline: true },
                    { name: '💸 Kaybedilen', value: `${amount.toLocaleString()} coin`, inline: true },
                    { name: '💎 Yeni Bakiye', value: `${(currentCoins - amount).toLocaleString()} coin`, inline: true }
                )
                .setTimestamp();
            
            await message.reply({ embeds: [embed] });
        }
        
        // Coin verilerini kaydet
        const coinsData = Object.fromEntries(client.coins);
        require('fs').writeFileSync('./coins.json', JSON.stringify(coinsData, null, 2));
    }
};
