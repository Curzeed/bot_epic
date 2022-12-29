const {SlashCommandBuilder} = require('@discordjs/builders');
const dbFunctions = require('../../database')
module.exports = {
 
    data : new SlashCommandBuilder()
    .setName('updateplan')
    .setDescription('updateplan')
    .addStringOption(opt => opt.setName('image_link').setDescription("lien de l'image")),
 
    async execute (interaction) {
        if(dbFunctions.isAdmin(interaction.member)){
            dbFunctions.updatePlanning(interaction.options.getString('image_link'))
            return interaction.reply("Le planning a bien été modifié !")
        }else{
            dbFunctions.isNotAdmin(interaction);
        }
    }
}