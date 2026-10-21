const {SlashCommandBuilder} = require('@discordjs/builders');
const {ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder} = require('discord.js');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('setbutton')
        .setDescription('set'),

    async execute(interaction) {
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('ticket_create')
                .setLabel('Créer un ticket')
                .setStyle(ButtonStyle.Primary)
                .setEmoji('🎫'),
        );
        const embed = new EmbedBuilder()
            .setColor(0x800303)
            .setTitle('Créer un ticket')
            .setDescription('Pour créer un ticket cliquez sur le bouton ci dessous !');
        await interaction.channel.send({embeds: [embed], components: [row]});
    },
};
