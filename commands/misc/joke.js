const {SlashCommandBuilder} = require('@discordjs/builders');
const {MessageEmbed} = require("discord.js");
const jokes = require('blagues-api');
const jokess = new jokes("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMjA4MDIwOTc4MTIxMzEwMjA4IiwibGltaXQiOjEwMCwia2V5IjoiUWFFNVJrWnFJM3o2OThjbGc2c0ZwSGhuZXlETkthOWVCaDNtRTg4cE5TRDdqWkFHbGYiLCJjcmVhdGVkX2F0IjoiMjAyMy0wMS0yMlQxODoyMDoxNCswMDowMCIsImlhdCI6MTY3NDQxMTYxNH0.XlvVBrs_LYGjQq1gueqk_f2eTTDXJ5Cab4OgVndTKbk");
module.exports = {
    data:
        new SlashCommandBuilder()
            .setName('joke')
            .setDescription("Balancer une blague au hasard"),
    async execute(interaction) {
        const embed = new MessageEmbed()
            .setAuthor("Poti clown", "https://risibank.fr/cache/medias/0/14/1425/142566/full.jpeg", "https://risibank.fr/cache/medias/0/14/1425/142566/full.jpeg")
            .setColor('RANDOM')
            .setThumbnail('https://risibank.fr/cache/medias/0/14/1425/142566/full.jpeg')
        await jokess.random().then(data => {
            embed.setTitle(data.joke.toString()),
                embed.setDescription(data.answer)
        });
        await interaction.reply({embeds: [embed]});
    }
}
