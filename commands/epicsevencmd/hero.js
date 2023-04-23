const {SlashCommandBuilder} = require('@discordjs/builders');
const dbFunctions = require('../../database/dbFunctions')
const {MessageEmbed} = require("discord.js");
module.exports = {
 
    data : new SlashCommandBuilder()
    .setName('hero')
    .setDescription('Affiche les informations d\'un héros')
    .addStringOption(option => option.setName('name').setDescription('Nom du héros').setRequired(true)),
 
    async execute (interaction,client) {
        const name = interaction.options.getString('name');
        dbFunctions.getHero(name, (hero) => {
            if(hero.length == 0) {
                return interaction.reply(`Hero ${name} not found !`);
            }
            const stars = '⭐'.repeat(Number(hero[0].nb_stars));
            const elements = {
                'terre': client.emojis.cache.find(emoji => emoji.name === "Earth"),
                'feu': client.emojis.cache.find(emoji => emoji.name === "Fire"),
                'eau': client.emojis.cache.find(emoji => emoji.name === "Ice"),
                'light': client.emojis.cache.find(emoji => emoji.name === "Light"),
                'ombre': client.emojis.cache.find(emoji => emoji.name === "Dark")
            }
            const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(hero[0].name)
            .setDescription(hero[0].message_link)
            .setThumbnail(hero[0].image)
            .addFields(
                { name: 'Élément', value: String(elements[hero[0].element.toLowerCase()]), inline: true },
                { name: 'Étoiles', value: String(stars), inline: true },
            )
            return interaction.reply({embeds: [embed]});
        });
    }
}