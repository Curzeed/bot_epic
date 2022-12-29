const {SlashCommandBuilder} = require('@discordjs/builders');
const {MessageEmbed} = require("discord.js");
const jokes = require('blagues-api');
const jokess = new jokes("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMjA4MDIwOTc4MTIxMzEwMjA4IiwibGltaXQiOjEwMCwia2V5IjoiV0psOUgzMDNrbThEQ3g2MnZYUlhGaGEzcTluWktOTXRaMGw1REhJaDJ1SlJyNTdvVTAiLCJjcmVhdGVkX2F0IjoiMjAyMS0xMS0yMlQyMjo0NjowMSswMDowMCIsImlhdCI6MTYzNzYyMTE2MX0.fjo5ZPJth8lSLzXz4_1aG3thA1gS8D8kwOEMh1VX6Hk");
module.exports = {
    data: 
        new SlashCommandBuilder()
            .setName('joke')
            .setDescription("Balancer une blague au hasard"),
            async execute(interaction){
                const embed = new MessageEmbed()
                .setAuthor("Poti clown","https://risibank.fr/cache/medias/0/14/1425/142566/full.jpeg", "https://risibank.fr/cache/medias/0/14/1425/142566/full.jpeg")
                .setColor('RANDOM')
                .setThumbnail('https://risibank.fr/cache/medias/0/14/1425/142566/full.jpeg')
                await jokess.random().then(data => {
                    embed.setTitle(data.joke),
                    embed.setDescription(data.answer)
                });
                await interaction.reply({embeds: [embed]});
            }
}
