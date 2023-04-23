const {SlashCommandBuilder} = require('@discordjs/builders');
const dbFunctions = require('../../database/dbFunctions')
module.exports = {
    data: new SlashCommandBuilder()
    .setName("reset")
    .setDescription("Permet de reset tous les scores des deux guildes (à faire en début de semaine)"),
    async execute(interaction){
        if(dbFunctions.isAdmin(interaction.member)){
            await dbFunctions.reset(); 
            interaction.reply('Le score de tous les membres sont repassés à 0 !');
        }else{
            dbFunctions.isNotAdmin(interaction);
        }
        
    }
}
