const {SlashCommandBuilder} = require('@discordjs/builders');
const dbFunctions = require('../../database/dbFunctions')
function strUcFirst(a){return (a+'').charAt(0).toUpperCase()+a.substr(1);}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription("Supprimer un membre de la liste ")
        .addMentionableOption(option => option.setName('membre').setDescription('Pseudo du membre').setRequired(true))
        .addStringOption(option=> option.setName('guilde').setDescription('Guilde du membre').addChoices([['Dark',"1"],["Light","2"],['Wilda', "3"]]).setRequired(true)),
    async execute(interaction) {
        let resGuilde = interaction.options.getString('guilde');
        let resUser = interaction.options.getMentionable('membre').user.username.toLowerCase();
            if (dbFunctions.isAdmin(interaction.member)) {
                dbFunctions.getUsers(resUser, (member) => {
                    if(member){
                        dbFunctions.removeMember(resGuilde, resUser).then(
                            interaction.reply(`${strUcFirst(resUser)} a bien été supprimé !`)
                        )
                    }else{
                        interaction.reply("Qui est donc ce bougre ?")
                    }
                })
            }else{
                dbFunctions.isNotAdmin(interaction);
            }
    }
};