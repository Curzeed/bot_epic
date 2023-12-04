const {SlashCommandBuilder} = require('@discordjs/builders');
const {MessageActionRow, MessageButton, MessageEmbed} = require('discord.js');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('setbutton')
        .setDescription('set'),

    async execute(interaction) {
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('ticket_create')
                    .setLabel('Créer un ticket')
                    .setStyle('PRIMARY')
                    .setEmoji('🎫')
                ,
            );
        const embed = new MessageEmbed()
            .setColor("#800303")
            .setTitle("Créer un ticket")
            .setDescription("Pour créer un ticket cliquez sur le bouton ci dessous !");
        interaction.channel.send({embeds: [embed], components: [row]});
    }
}