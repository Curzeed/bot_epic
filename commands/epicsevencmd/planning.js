const {SlashCommandBuilder} = require('@discordjs/builders');
const dbFunctions = require('../../database/dbFunctions')
module.exports = {
 
    data : new SlashCommandBuilder()
    .setName('planning')
    .setDescription('planning'),
 
    async execute (interaction) {
        dbFunctions.getPlanning(planning => {
            return interaction.reply(planning)
        })
    }
}