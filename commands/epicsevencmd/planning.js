const {SlashCommandBuilder} = require('@discordjs/builders');
const dbFunctions = require('../../database')
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