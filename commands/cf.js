const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'cf',
    description: 'Coin flip oyunu - %50 şans',
    execute: async (message, args, client) => {
        if (args.length < 1) {
            const embed = new EmbedBuilder()
                .setColor(client.config.colors.error)
                .setTitle('❌ Hata!')
                .setDescription(`Kullanım: \`${client.config.bot.prefix}cf <miktar>\``)
                .setTimestamp();
            
            return message.reply({ embeds: [embed] });
        }
        
        const amount = parseInt(args[0]);
        if (isNaN(amount) || amount <= 0) {
            const embed = new EmbedBuilder()
                .setColor(client.config.colors.error)
                .setTitle('❌ Hata!')
                .setDescription('Geçerli bir miktar girin!')
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
        
        // %50 şans
        const win = Math.random() < 0.5;
        
        if (win) {
            // Kazandı
            client.coins.set(userId, currentCoins + amount);
            
            const embed = new EmbedBuilder()
                .setColor(client.config.colors.success)
                .setTitle('🎉 Tebrikler!')
                .setDescription(`**${message.author.username}** coin flip kazandı!`)
                .addFields(
                    { name: '💰 Kazanılan', value: `${amount.toLocaleString()} coin`, inline: true },
                    { name: '💎 Yeni Bakiye', value: `${(currentCoins + amount).toLocaleString()} coin`, inline: true }
                )
                .setTimestamp();
            
            await message.reply({ embeds: [embed] });
        } else {
            // Kaybetti
            client.coins.set(userId, currentCoins - amount);
            
            const embed = new EmbedBuilder()
                .setColor(client.config.colors.error)
                .setTitle('💸 Kaybettiniz!')
                .setDescription(`**${message.author.username}** coin flip kaybetti!`)
                .addFields(
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
