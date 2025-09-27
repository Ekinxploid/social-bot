const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'coin-gönder',
    description: 'Başka bir kullanıcıya coin gönderin',
    execute: async (message, args, client) => {
        if (args.length < 2) {
            const embed = new EmbedBuilder()
                .setColor(client.config.colors.error)
                .setTitle('❌ Hata!')
                .setDescription(`Kullanım: \`${client.config.bot.prefix}coin-gönder @kullanıcı miktar\``)
                .setTimestamp();
            
            return message.reply({ embeds: [embed] });
        }
        
        const targetUser = message.mentions.users.first();
        if (!targetUser) {
            const embed = new EmbedBuilder()
                .setColor(client.config.colors.error)
                .setTitle('❌ Hata!')
                .setDescription('Geçerli bir kullanıcı etiketleyin!')
                .setTimestamp();
            
            return message.reply({ embeds: [embed] });
        }
        
        if (targetUser.id === message.author.id) {
            const embed = new EmbedBuilder()
                .setColor(client.config.colors.error)
                .setTitle('❌ Hata!')
                .setDescription('Kendinize coin gönderemezsiniz!')
                .setTimestamp();
            
            return message.reply({ embeds: [embed] });
        }
        
        const amount = parseInt(args[1]);
        if (isNaN(amount) || amount <= 0) {
            const embed = new EmbedBuilder()
                .setColor(client.config.colors.error)
                .setTitle('❌ Hata!')
                .setDescription('Geçerli bir miktar girin!')
                .setTimestamp();
            
            return message.reply({ embeds: [embed] });
        }
        
        const senderId = message.author.id;
        const senderCoins = client.coins.get(senderId) || 0;
        
        if (senderCoins < amount) {
            const embed = new EmbedBuilder()
                .setColor(client.config.colors.error)
                .setTitle('❌ Yetersiz Bakiye!')
                .setDescription(`Yeterli coininiz yok! Mevcut: **${senderCoins.toLocaleString()}**`)
                .setTimestamp();
            
            return message.reply({ embeds: [embed] });
        }
        
        // Coin transferi
        const targetCoins = client.coins.get(targetUser.id) || 0;
        client.coins.set(senderId, senderCoins - amount);
        client.coins.set(targetUser.id, targetCoins + amount);
        
        // Coin verilerini kaydet
        const coinsData = Object.fromEntries(client.coins);
        require('fs').writeFileSync('./coins.json', JSON.stringify(coinsData, null, 2));
        
        const embed = new EmbedBuilder()
            .setColor(client.config.colors.success)
            .setTitle('✅ Transfer Başarılı!')
            .setDescription(`**${amount.toLocaleString()}** coin **${targetUser.username}**'e gönderildi!`)
            .addFields(
                { name: '💰 Kalan Coin', value: `${(senderCoins - amount).toLocaleString()}`, inline: true },
                { name: '🎯 Alıcının Yeni Bakiyesi', value: `${(targetCoins + amount).toLocaleString()}`, inline: true }
            )
            .setTimestamp();
        
        await message.reply({ embeds: [embed] });
    }
};
