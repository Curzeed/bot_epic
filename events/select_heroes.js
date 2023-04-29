const dbFunctions = require('../database/dbFunctions')
const {MessageEmbed} = require("discord.js");
const MAX_HEROES = async () => {return await dbFunctions.getHeroCount()};
module.exports = async function (client,interaction) {
  try {
    const value = interaction.values[0].split('_')[0];
    const index = Number(interaction.values[0].split('_')[1]);
    interaction.deferUpdate();
    var hero = await dbFunctions.getHero(value);
    hero = hero[0]
    const stars = '⭐'.repeat(Number(hero.nb_stars));
    const elements = {
      'terre': client.emojis.cache.find(emoji => emoji.name === "Earth"),
      'feu': client.emojis.cache.find(emoji => emoji.name === "Fire"),
      'eau': client.emojis.cache.find(emoji => emoji.name === "Ice"),
      'light': client.emojis.cache.find(emoji => emoji.name === "Light"),
      'ombre': client.emojis.cache.find(emoji => emoji.name === "Dark")
    }
    
    const embed = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle(String(hero.name))
    .setDescription(String(hero.message_link))
    .setFooter(' Page ' + String(Math.ceil(index / 25) + 1) + '/' + String(Math.ceil(await MAX_HEROES() / 25)))
    .setThumbnail(hero.image)
    .addFields(
        { name: 'Élément', value: String(elements[hero.element.toLowerCase()]), inline: true },
        { name: 'Étoiles', value: String(stars), inline: true },
    );
    await interaction.message.edit({embeds : [embed]});
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'Une erreur est survenue lors de la modification du message.', ephemeral: true });
  }
}