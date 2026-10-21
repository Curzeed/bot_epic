const {SlashCommandBuilder} = require('@discordjs/builders');
const {EmbedBuilder} = require('discord.js');
module.exports = {

    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription("Permet d'afficher une note d'aide pour les commandes"),

    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle('Menu help')
            .setTimestamp()
            .setDescription('Les commandes qui auront un * devant leur diminutif sont des commandes réservées aux admins. \n Les <...> sont les paramètres à donner à la commande. \n Les arguments sous ?..? sont des paramètres optionnels')
            .addFields(
                {name: '* reset', value: '__**Permet de mettre les scores de tout le monde à 0 !**__ \n'},
                {name: '* ping <channel> <@membres> ?texte? ', value: "Permet de faire un rappel gvg dans le channel que vous souhaitez. *Si vous ne donnez pas de texte, il y en a par défaut*\n"},
                {name: '* warn <@membre> < + ou - nombre_warn>', value: "Ajoute un warn au membre.\n"},
                {name: '* score <@membre> <guilde> <points>', value: "Ajoute des points à un membre en fonction de ses résultats.\n"},
                {name: '* reactrole <role> <channel> <idMsg> <emoji>', value: 'Ajoute une réaction sur message qui ajoutera un role lors du clic'},
                {name: 'rank ?user? ', value: 'Montre une carte qui montre le rang du joueur en experience chat'},
                {name: 'levels ', value: 'Affiche le classement des membres en fonction de leur experience'},
                {name: 'ladder <guilde>', value: "Affiche un classement des membres d'une guilde par rapport à leur points.\n"},
                {name: 'defense <Personnage1> <Personnage2> <Personnage3>.', value: "Les noms sont des personnages sont à donner en anglais(Un champ d'autocomplétion est disponible)."},
                {name: '\u200b', value: '\u200b', inline: true},
                {name: '__**Guides**__', value: '\u200b', inline: true},
                {name: '\u200b', value: '\u200b', inline: true},
                {name: 'Sommaire : ', value: client.channels.cache.get('1050435795481268345').toString()},
            )

        await interaction.reply({embeds: [embed]});
    }
}