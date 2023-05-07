const {SlashCommandBuilder} = require('@discordjs/builders');
const dbFunctions = require('../../database/dbFunctions')
function strUcFirst(a){return (a+'').charAt(0).toUpperCase()+a.substr(1);}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('score')
        .setDescription("Ajouter du score à une personne ! (Pour retirer juste rajouter - devant la valeur)")
        .addMentionableOption(option => option.setName('membre').setDescription('Pseudo du membre').setRequired(true))
        .addStringOption(option => option.setName('guilde').setDescription('Guilde du membre').addChoices({name : 'Dark', value : '1'},{name : 'Light', value : '2'},{name : 'Wilda', value : '3'}).setRequired(true))
        .addNumberOption(option => option.setName('points').setDescription('Entrez les points à ajouter').setRequired(true)),
    async execute(interaction) {
        let resGuilde = interaction.options.getString('guilde');
        let resUser = interaction.options.getMentionable('membre').user.username.toLowerCase();
        let points = interaction.options.getNumber('points');
            if (dbFunctions.isAdmin(interaction.member)) {
                dbFunctions.getUsers(resUser, (member) => {
                    if (member) {
                        try{
                            dbFunctions.modifyScore(Number(resGuilde),resUser, points, (member) => {
                                interaction.reply(`${strUcFirst(resUser)} a désormais ${member[0].score} points ! `)
                            })
                        }catch (err){
                            console.log(err)
                            interaction.reply({content : "Une erreur a été détectée ! \n" + err, ephemeral : true})
                        }
                    } else {
                        interaction.reply("Qui est donc ce bougre ?")
                        return;
                    }
                })
            } else {
                dbFunctions.isNotAdmin(interaction)
            }
    }
}
