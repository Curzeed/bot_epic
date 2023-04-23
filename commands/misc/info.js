const {SlashCommandBuilder} = require('@discordjs/builders');
const {MessageEmbed} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription("Permet d'afficher les informations de la guilde"),
    async execute(interaction) {
        const embed = new MessageEmbed()
        .setTitle("Informations de la guilde")
        .addField("Création du discord",interaction.guild.createdAt.toLocaleDateString('fr-FR'))
        .addField("Nombre de membres",interaction.guild.memberCount.toString())
        .addField("Anniversaire de guilde", "\u200b")
	.addField("Dark", "16 octobre 2020")
	.addField("Light", "25 juin 2021")
	.addField("Wilda", "16 juin 2019")
        .setAuthor(interaction.guild.name, interaction.guild.iconURL())
        .setImage(interaction.guild.bannerURL())
        return interaction.reply({ embeds : [embed]});
    }
}
