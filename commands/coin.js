const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'coin',
    description: 'Coin durumunuzu görüntüleyin',
    execute: async (message, args, client) => {
        const userId = message.author.id;
        const currentCoins = client.coins.get(userId) || 0;
        
        const embed = new EmbedBuilder()
            .setColor(client.config.colors.coin)
            .setTitle('💰 Coin Durumu')
            .setDescription(`**${message.author.username}**'in coin durumu:`)
            .addFields(
                { name: '💎 Toplam Coin', value: `${currentCoins.toLocaleString()}`, inline: true },
                { name: '🏆 Sıralama', value: 'Hesaplanıyor...', inline: true }
            )
            .setThumbnail(message.author.displayAvatarURL())
            .setTimestamp();
        
        await message.reply({ embeds: [embed] });
    }
};
