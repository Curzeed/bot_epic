const {SlashCommandBuilder} = require('@discordjs/builders');
const dbFunctions = require('../../database')
function strUcFirst(a){return (a+'').charAt(0).toUpperCase()+a.substr(1);}
module.exports = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription("Ajout d'un membre dans la liste des gdg")
        .addStringOption(option => option.setName('membre').setDescription('Ajouter un membre').setRequired(true))
        .addStringOption(option=> option.setName('guilde').setDescription('Guilde du membre').addChoices([['Dark',"1"],["Light","2"], ["Wilda", "3"]]).setRequired(true)),
    async execute(interaction) {
        let resGuilde = interaction.options.getString('guilde');
        let resUser = interaction.options.getString('membre').toLowerCase();
        if (dbFunctions.isAdmin(interaction.member)) {
        dbFunctions.getUsers(resUser, (member) => {
                if (!member) {
                    dbFunctions.addMember(resGuilde, resUser)
                    interaction.reply(`Le membre ${strUcFirst(resUser)} a bien été ajouté ! `)
                } else {
                    console.log("User already exist")
                    interaction.reply("Le membre est déjà dans la liste des membres ! ")
                    return;
                }
        });
        }else{
            dbFunctions.isNotAdmin(interaction);
        }
            
    }
};
