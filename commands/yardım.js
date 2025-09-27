const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'yardım',
    description: 'Tüm komutları listeler',
    execute: async (message, args, client) => {
        const embed = new EmbedBuilder()
            .setColor(client.config.colors.primary)
            .setTitle('🤖 Bot Komutları')
            .setDescription('Kullanılabilir komutlar:')
            .addFields(
                { 
                    name: '💰 Coin Sistemi', 
                    value: `\`${client.config.bot.prefix}coin\` - Coin durumunuzu görüntüleyin\n\`${client.config.bot.prefix}profil\` - Profil bilgilerinizi görüntüleyin\n\`${client.config.bot.prefix}coin-gönder @kullanıcı miktar\` - Coin gönderin\n\`${client.config.bot.prefix}liderlik\` - Liderlik tablosunu görüntüleyin\n\`${client.config.bot.prefix}günlük\` - Günlük ödülünüzü alın`, 
                    inline: false 
                },
                { 
                    name: '🎮 Eğlence', 
                    value: `\`${client.config.bot.prefix}ship @kullanıcı1 @kullanıcı2\` - Ship kartı oluşturun\n\`${client.config.bot.prefix}tweet\` - Tweet sistemi menüsünü açın`, 
                    inline: false 
                },
                { 
                    name: '🎰 Coin Oyunları', 
                    value: `\`${client.config.bot.prefix}cf <miktar>\` - Coin flip (%50 şans)\n\`${client.config.bot.prefix}cw <miktar> <sayı>\` - Coin wheel (1-10 arası, 10x ödül)\n\`${client.config.bot.prefix}slot <miktar>\` - Slot makinesi`, 
                    inline: false 
                },
                { 
                    name: '🎁 Etkinlikler', 
                    value: `Her ${client.config.coin.chestInterval / 1000 / 60} dakikada sandık etkinliği çıkar!`, 
                    inline: false 
                }
            )
            .setFooter({ text: `Prefix: ${client.config.bot.prefix} | ${client.config.embeds.footer}` })
            .setTimestamp();
        
        await message.reply({ embeds: [embed] });
    }
};
