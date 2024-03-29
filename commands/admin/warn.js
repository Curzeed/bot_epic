const {SlashCommandBuilder} = require('@discordjs/builders');
const dbFunctions = require('../../database/dbFunctions')

function strUcFirst(a) {
    return (a + '').charAt(0).toUpperCase() + a.substr(1);
}

module.exports = {

    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Permet de mettre un avertissement à un Membre')
        .addMentionableOption(opt => opt.setName('membre').setDescription('Nom du membre').setRequired(true))
        .addStringOption(opt => opt.setName('nombre').setRequired(true).setDescription('Nombre de warns')),

    async execute(interaction,client) {
        const resUser = interaction.options.getMentionable('membre').user.username.toLowerCase();
        const number = interaction.options.getString('nombre');

        dbFunctions.getUsers(resUser, (memberUser) => {
            if (memberUser) {
                if (dbFunctions.isAdmin(interaction.member)) {
                    try {
                        dbFunctions.giveWarn(resUser, number, async (member) => {
                            let user = await client.users.cache.find(user => user.username === member[0].name)
                            if (member[0].score >= 2) {
                                return interaction.reply(`<@${user.id}> possède désormais ${member[0].warn++} warns ! \nPour rappel au troisième warn il sera banni de la guilde`)
                            }
                            return interaction.reply(`<@${user.id}> possède désormais ${member[0].warn++} warns !`)
                        })
                    } catch (error) {
                        console.error(error.stack)
                        interaction.reply("Une erreur s'est produite ! Veuillez contacter Curze#0009")
                    }
                } else {
                    dbFunctions.isNotAdmin(interaction)
                }
            } else {
                interaction.reply("Le membre n'existe pas dans la base")
            }
        })

    }
}