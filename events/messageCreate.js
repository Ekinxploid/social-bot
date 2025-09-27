const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'messageCreate',
    execute: async (message, client) => {
        // Bot mesajlarını yok say
        if (message.author.bot) return;
        
        // Prefix kontrolü
        if (!message.content.startsWith('.')) return;
        
        // Komut işleme
        const args = message.content.slice(1).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        
        const command = client.commands.get(commandName);
        
        if (!command) return;
        
        try {
            await command.execute(message, args, client);
        } catch (error) {
            console.error(error);
            const errorEmbed = new EmbedBuilder()
                .setColor(client.config.colors.error)
                .setTitle('Hata!')
                .setDescription('Komut çalıştırılırken bir hata oluştu.')
                .setTimestamp();
            
            await message.reply({ embeds: [errorEmbed] });
        }
    }
};
