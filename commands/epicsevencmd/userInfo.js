const {SlashCommandBuilder} = require('@discordjs/builders');
const { Client, Intents, Collection } = require('discord.js');
const {MessageEmbed} = require("discord.js");
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uinfo')
        .setDescription('Replies with user infos')
        .addStringOption(opt => opt.setName('member').setDescription('membre').setRequired(false)),

    async execute(interaction) {
        
        
        console.log()
        interaction.reply('oui')
    }
}
