const {SlashCommandBuilder} = require('@discordjs/builders');
const dbFunctions = require('../../database/dbFunctions');
function strUcFirst(a){return (a+'').charAt(0).toUpperCase()+a.substr(1);}
module.exports = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription("Ajout d'un membre dans la liste des gdg")
        .addMentionableOption(option => option.setName('membre').setDescription('Ajouter un membre').setRequired(true))
        .addStringOption(option=> option.setName('guilde').setDescription('Guilde du membre').addChoices({name : 'Dark', value : '1'},{name : 'Light', value : '2'},{name : 'Wilda', value : '3'}).setRequired(true)),
    async execute(interaction) {
        let resGuilde = interaction.options.getString('guilde');
        let resUser = interaction.options.getMentionable('membre').user.username.toLowerCase();
        if (dbFunctions.isAdmin(interaction.member)) {
        dbFunctions.getUsers(resUser, (member) => {
                if (!member) {
                    try{
                        dbFunctions.addMember(resGuilde, resUser)
                        return interaction.reply(`Le membre ${strUcFirst(resUser)} a bien été ajouté ! `)
                    }catch (err){
                        console.log(err)
                        return interaction.reply({content : "Une erreur a été détectée ! \n" + err, ephemeral : true})
                    }
                    
                } else {
                    return interaction.reply("Le membre est déjà dans la liste des membres ! ")
                }
        });
        }else{
            dbFunctions.isNotAdmin(interaction);
        }
            
    }
};
