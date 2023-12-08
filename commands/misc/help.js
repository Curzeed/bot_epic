const {SlashCommandBuilder} = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js')
module.exports = {

    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription("Permet d'afficher une note d'aide pour les commandes"),

    async execute(interaction, client) {
        const embed = new MessageEmbed()
            .setColor('RED')
            .setTitle('Menu help')
            .setTimestamp()
            .setDescription('Les commandes qui auront un * devant leur diminutif sont des commandes réservées aux admins. \n Les <...> sont les paramètres à donner à la commande. \n Les arguments sous ?..? sont des paramètres optionnels')
            .addField('* reset', "__**Permet de mettre les scores de tout le monde à 0 !**__ \n")
            .addField('* ping <channel> <@membres> ?texte? ', "Permet de faire un rappel gvg dans le channel que vous souhaitez. *Si vous ne donnez pas de texte, il y en a par défaut*\n")
            .addField('* warn <@membre> < + ou - nombre_warn>', "Ajoute un warn au membre.\n")
            .addField('* score <@membre> <guilde> <points>', "Ajoute des points à un membre en fonction de ses résultats.\n")
            .addField('* reactrole <role> <channel> <idMsg> <emoji>', "Ajoute une réaction sur message qui ajoutera un role lors du clic")
            .addField('rank ?user? ', "Montre une carte qui montre le rang du joueur en experience chat")
            .addField('levels ', "Affiche le classement des membres en fonction de leur experience")
            .addField('ladder <guilde>', "Affiche un classement des membres d'une guilde par rapport à leur points.\n")
            .addField("defense <Personnage1> <Personnage2> <Personnage3>.", "Les noms sont des personnages sont à donner en anglais(Un champ d'autocomplétion est disponible).")
            .addField('')
            .addField('\u200b', '\u200b', true)
            .addField('__**Guides**__', '\u200b', true)
            .addField('\u200b', '\u200b', true)
            //.addField('Sommaire : ', client.channels.cache.get("935842421500157992"))
            .addField('Sommaire : ', client.channels.cache.get("1050435795481268345").toString())

        await interaction.reply({embeds: [embed]});
    }
}