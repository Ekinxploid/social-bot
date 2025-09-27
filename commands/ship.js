const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'ship',
    description: 'İki kullanıcı arasında ship kartı oluşturun',
    execute: async (message, args, client) => {
        if (args.length < 2) {
            const embed = new EmbedBuilder()
                .setColor(client.config.colors.error)
                .setTitle('❌ Hata!')
                .setDescription(`Kullanım: \`${client.config.bot.prefix}ship @kullanıcı1 @kullanıcı2\``)
                .setTimestamp();
            
            return message.reply({ embeds: [embed] });
        }
        
        const user1 = message.mentions.users.first();
        // Düzeltme: Array.from'dan gelen tuple'dan kullanıcıyı al
        const user2Tuple = Array.from(message.mentions.users)[1];
        const user2 = user2Tuple ? user2Tuple[1] : null;
        
        if (!user1 || !user2) {
            const embed = new EmbedBuilder()
                .setColor(client.config.colors.error)
                .setTitle('❌ Hata!')
                .setDescription('İki farklı kullanıcı etiketleyin!')
                .setTimestamp();
            
            return message.reply({ embeds: [embed] });
        }
        
        if (user1.id === user2.id) {
            const embed = new EmbedBuilder()
                .setColor(client.config.colors.error)
                .setTitle('❌ Hata!')
                .setDescription('Aynı kullanıcıyı iki kez etiketleyemezsiniz!')
                .setTimestamp();
            
            return message.reply({ embeds: [embed] });
        }
        
        try {
            const avatar1 = user1.displayAvatarURL({ extension: 'png' });
            const avatar2 = user2.displayAvatarURL({ extension: 'png' });
            const level = Math.floor(Math.random() * 100) + 1;
            
            const apiUrl = `${client.config.apis.ship}?avatar=${avatar1}&avatar2=${avatar2}&background=${client.config.apis.shipBackground}&name=${encodeURIComponent(user1.username)}&name2=${encodeURIComponent(user2.username)}&level=${level}&shape=circle`;
            
            const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data);
            
            const attachment = new AttachmentBuilder(buffer, { name: 'ship.png' });
            
            const shipEmbed = new EmbedBuilder()
                .setColor(client.config.colors.ship)
                .setTitle('💕 Ship Kartı')
                .setDescription(`**${user1.username}** ❤️ **${user2.username}**`)
                .addFields(
                    { name: '💖 Uyumluluk', value: `${level}%`, inline: true },
                    { name: '🎯 Seviye', value: `${level}`, inline: true }
                )
                .setImage('attachment://ship.png')
                .setTimestamp();
            
            await message.reply({ embeds: [shipEmbed], files: [attachment] });
        } catch (error) {
            console.error('Ship kartı oluşturma hatası:', error);
            const errorEmbed = new EmbedBuilder()
                .setColor(client.config.colors.error)
                .setTitle('Hata!')
                .setDescription('Ship kartı oluşturulurken bir hata oluştu.')
                .setTimestamp();
            
            await message.reply({ embeds: [errorEmbed] });
        }
    }
};