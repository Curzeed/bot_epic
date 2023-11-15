const {SlashCommandBuilder} = require('@discordjs/builders');
const dbFunctions = require('../../database/dbFunctions');
const heroData = require('../../herodata.json');
module.exports = {
 
    data : new SlashCommandBuilder()
    .setName('sync')
    .setDescription('sync'),
 
    async execute (interaction) {
        Object.keys(heroData).forEach(async key => {
            await dbFunctions.insertHeroesDb(heroData[key].assets.thumbnail, heroData[key].rarity, heroData[key].attribute, heroData[key].name, heroData[key].code)
        });
        //data.forEach(async hero => {
        //    await dbFunctions.insertHeroesDb(hero.assets.thumbnail, hero.rarity, hero.attribute, hero.name)
        //})
        await interaction.reply({content : "Sync done !", ephemeral : true});
    }
}
