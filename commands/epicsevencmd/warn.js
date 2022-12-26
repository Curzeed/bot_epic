const {SlashCommandBuilder} = require('@discordjs/builders');
const dbFunctions = require('../../database')
function strUcFirst(a){return (a+'').charAt(0).toUpperCase()+a.substr(1);}
module.exports = {
 
    data : new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Permet de mettre un avertissement à un Membre')
    .addStringOption(opt => opt.setName('membre').setDescription('Nom du membre').setRequired(true)),
 
    async execute (interaction) {
        const resUser = interaction.options.getString('membre').toLowerCase();
        dbFunctions.getUsers(resUser, (memberUser) => {
            if(memberUser){
                if (dbFunctions.isAdmin(interaction.member)){
                    try{
                        dbFunctions.giveWarn(resUser, (member) => {
                            if(member[0].score >= 2){
                                return interaction.reply(`${strUcFirst(member[0].name)} possède désormais ${member[0].warn++} warns ! \nPour rappel au troisième warn il sera banni de la guilde`)
                            }
                            return interaction.reply(`${strUcFirst(member[0].name)} possède désormais ${member[0].warn++} warns !`)
                        })
                    }
                    catch (error) {
                        console.error(error.stack)
                        interaction.reply("Une erreur s'est produite ! Veuillez contacter Curze#0009")  
                    }
                }else{
                   dbFunctions.isNotAdmin(interaction)
                }
            }else{
                interaction.reply("Le membre n'existe pas dans la base")
            }
        })
        
    }
}