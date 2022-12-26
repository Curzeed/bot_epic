const {SlashCommandBuilder} = require('@discordjs/builders');
 
module.exports = {
 
    data : new SlashCommandBuilder()
    .setName('birthday')
    .setDescription('birthday')
    .addStringOption(opt => opt.setName('anniv')),
 
    async execute (interaction) {
 
    }
}