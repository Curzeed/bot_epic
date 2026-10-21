const {SlashCommandBuilder} = require('@discordjs/builders');
const {EmbedBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription("Permet d'afficher les informations de la guilde"),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('Informations de la guilde')
            .addFields(
                {name: 'Création du discord', value: interaction.guild.createdAt.toLocaleDateString('fr-FR'), inline: true},
                {name: 'Nombre de membres', value: interaction.guild.memberCount.toString(), inline: true},
                {name: 'Anniversaire de guilde', value: '\u200b', inline: false},
                {name: 'Dark', value: '16 octobre 2020', inline: true},
                {name: 'Light', value: '25 juin 2021', inline: true},
                {name: 'Wilda', value: '16 juin 2019', inline: true},
            )
            .setAuthor({name: interaction.guild.name, iconURL: interaction.guild.iconURL()})
            .setImage(interaction.guild.bannerURL());
        return interaction.reply({embeds: [embed]});
    },
};
