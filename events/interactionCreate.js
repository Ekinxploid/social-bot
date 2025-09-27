const { EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios');
const tweetCommand = require('../commands/tweet');

module.exports = {
    name: 'interactionCreate',
    execute: async (interaction, client) => {
        try {
            if (interaction.isButton()) {
                if (interaction.customId === 'tweet_like') {
                    await tweetCommand.handleTweetLike(interaction, client);
                } else if (interaction.customId === 'tweet_regenerate') {
                    await tweetCommand.handleTweetRegenerate(interaction, client);
                }
            } else if (interaction.isModalSubmit()) {
                if (interaction.customId === 'tweet_modal') {
                    await tweetCommand.handleTweetModal(interaction, client); // client parametresi eklendi
                }
            } else if (interaction.isStringSelectMenu()) {
                if (interaction.customId === 'tweet_menu') {
                    await tweetCommand.handleTweetMenu(interaction, client);
                }
            }
        } catch (error) {
            console.error('InteractionCreate hatası:', error);
            
            // Hata durumunda kullanıcıya bilgi ver
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: 'Bir hata oluştu! Lütfen daha sonra tekrar deneyin.',
                    ephemeral: true
                });
            }
        }
    }
};