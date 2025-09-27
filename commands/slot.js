const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'slot',
    description: 'Slot makinesi oyunu',
    execute: async (message, args, client) => {
        if (args.length < 1) {
            const embed = new EmbedBuilder()
                .setColor(client.config.colors.error)
                .setTitle('❌ Hata!')
                .setDescription(`Kullanım: \`${client.config.bot.prefix}slot <miktar>\``)
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
        
        // Slot sembolleri
        const symbols = ['🍒', '🍋', '🍊', '🍇', '⭐', '💎'];
        
        // 3 rastgele sembol
        const slot1 = symbols[Math.floor(Math.random() * symbols.length)];
        const slot2 = symbols[Math.floor(Math.random() * symbols.length)];
        const slot3 = symbols[Math.floor(Math.random() * symbols.length)];
        
        const slots = `${slot1} | ${slot2} | ${slot3}`;
        
        // Kazanma koşulları
        let winMultiplier = 0;
        let winMessage = '';
        
        if (slot1 === slot2 && slot2 === slot3) {
            // 3 aynı sembol - 50x
            winMultiplier = 50;
            winMessage = '🎉 JACKPOT! 3 aynı sembol!';
        } else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
            // 2 aynı sembol - 5x
            winMultiplier = 5;
            winMessage = '🎊 Tebrikler! 2 aynı sembol!';
        } else if (slot1 === '💎' || slot2 === '💎' || slot3 === '💎') {
            // Elmas var - 2x
            winMultiplier = 2;
            winMessage = '✨ Elmas buldunuz!';
        }
        
        if (winMultiplier > 0) {
            // Kazandı
            const winAmount = amount * winMultiplier;
            client.coins.set(userId, currentCoins + winAmount);
            
            const embed = new EmbedBuilder()
                .setColor(client.config.colors.success)
                .setTitle('🎰 Slot Makinesi')
                .setDescription(`**${message.author.username}** slot makinesi kazandı!`)
                .addFields(
                    { name: '🎰 Sonuç', value: slots, inline: false },
                    { name: '💰 Kazanılan', value: `${winAmount.toLocaleString()} coin`, inline: true },
                    { name: '💎 Yeni Bakiye', value: `${(currentCoins + winAmount).toLocaleString()} coin`, inline: true }
                )
                .setFooter({ text: winMessage })
                .setTimestamp();
            
            await message.reply({ embeds: [embed] });
        } else {
            // Kaybetti
            client.coins.set(userId, currentCoins - amount);
            
            const embed = new EmbedBuilder()
                .setColor(client.config.colors.error)
                .setTitle('🎰 Slot Makinesi')
                .setDescription(`**${message.author.username}** slot makinesi kaybetti!`)
                .addFields(
                    { name: '🎰 Sonuç', value: slots, inline: false },
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
