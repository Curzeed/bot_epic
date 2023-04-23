const {SlashCommandBuilder} = require('@discordjs/builders');
const dbFunctions = require('../../database/dbFunctions') 
module.exports = {
 
    data : new SlashCommandBuilder()
    .setName('deletehero')
    .setDescription('delete Hero')
    .addStringOption(option => option.setName('name').setDescription('Name of the hero').setRequired(true)),
 
    async execute (interaction) {
        if(dbFunctions.isAdmin(interaction.member)){
            const name = interaction.options.getString('name');
            await dbFunctions.deleteHero(name);
            await interaction.reply(`Hero ${name} deleted !`);
        }else{
            dbFunctions.isNotAdmin(interaction);
        }
    }
}