const {SlashCommandBuilder} = require('@discordjs/builders');
const dbFunctions = require('../../database/dbFunctions')
module.exports = {

    data: new SlashCommandBuilder()
        .setName('inserthero')
        .setDescription('hero')
        .addStringOption(option => option.setName('name').setDescription('Name of the hero').setRequired(true))
        .addStringOption(option => option.setName('element').setDescription('Element of the hero').setRequired(true))
        .addStringOption(option => option.setName('nb_stars').setDescription('Stars of the hero').setRequired(true))
        .addStringOption(option => option.setName('image').setDescription('Image of the hero').setRequired(true))
        .addStringOption(option => option.setName('message_link').setDescription('Message link of the hero').setRequired(true)),

    async execute(interaction) {
        const name = interaction.options.getString('name');
        const element = interaction.options.getString('element');
        const nb_stars = interaction.options.getString('nb_stars');
        const image = interaction.options.getString('image');
        const message_link = interaction.options.getString('message_link');
        await dbFunctions.insertHeroes(image, nb_stars, element, name, message_link);
        await interaction.reply(`Hero ${name} added !`);
    }
}