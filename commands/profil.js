const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'profil',
    description: 'Profil bilgilerinizi görüntüleyin',
    execute: async (message, args, client) => {
        const userId = message.author.id;
        const currentCoins = client.coins.get(userId) || 0;
        
        // Sıralama hesapla
        const sortedCoins = Array.from(client.coins.entries())
            .sort((a, b) => b[1] - a[1]);
        const rank = sortedCoins.findIndex(entry => entry[0] === userId) + 1;
        
        const embed = new EmbedBuilder()
            .setColor(client.config.colors.success)
            .setTitle('👤 Profil Bilgileri')
            .setDescription(`**${message.author.username}**'in profili:`)
            .addFields(
                { name: '🆔 Kullanıcı ID', value: userId, inline: true },
                { name: '💎 Toplam Coin', value: `${currentCoins.toLocaleString()}`, inline: true },
                { name: '🏆 Sıralama', value: `#${rank}`, inline: true },
                { name: '📅 Hesap Oluşturma', value: `<t:${Math.floor(message.author.createdTimestamp / 1000)}:R>`, inline: false }
            )
            .setThumbnail(message.author.displayAvatarURL())
            .setTimestamp();
        
        await message.reply({ embeds: [embed] });
    }
};
