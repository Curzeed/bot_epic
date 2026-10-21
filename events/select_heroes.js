const {
    MessageFlags,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require('discord.js');
const {buildHeroEmbed} = require('./heroEmbed');

module.exports = async function (client, interaction) {
    if (!interaction.customId.startsWith('select_hero')) return;

    try {
        const heroName = interaction.values[0];
        await interaction.deferUpdate();
        const embed = await buildHeroEmbed(client, heroName);
        const filterRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('hero_open_search')
                .setLabel('Filtrer')
                .setStyle(ButtonStyle.Primary)
                .setEmoji('🔍'),
        );
        await interaction.message.edit({
            embeds: [embed],
            components: [filterRow],
        });
    } catch (error) {
        console.error(error);
        const payload = {
            content: 'Une erreur est survenue lors de la modification du message.',
            flags: MessageFlags.Ephemeral,
        };
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(payload);
        } else {
            await interaction.reply(payload);
        }
    }
};
