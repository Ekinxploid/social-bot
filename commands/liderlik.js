const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'liderlik',
    description: 'Coin liderlik tablosunu görüntüleyin',
    execute: async (message, args, client) => {
        const sortedCoins = Array.from(client.coins.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
        
        if (sortedCoins.length === 0) {
            const embed = new EmbedBuilder()
                .setColor('#ffaa00')
                .setTitle('🏆 Liderlik Tablosu')
                .setDescription('Henüz kimse coin kazanmamış!')
                .setTimestamp();
            
            return message.reply({ embeds: [embed] });
        }
        
        const embed = new EmbedBuilder()
            .setColor('#ffd700')
            .setTitle('🏆 Coin Liderlik Tablosu')
            .setDescription('En zengin 10 kullanıcı:')
            .setTimestamp();
        
        for (let i = 0; i < sortedCoins.length; i++) {
            const [userId, coins] = sortedCoins[i];
            const user = await client.users.fetch(userId).catch(() => null);
            const username = user ? user.username : 'Bilinmeyen Kullanıcı';
            
            const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '🔸';
            embed.addFields({
                name: `${medal} #${i + 1} ${username}`,
                value: `${coins.toLocaleString()} coin`,
                inline: false
            });
        }
        
        await message.reply({ embeds: [embed] });
    }
};
