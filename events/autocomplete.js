const dbFunctions = require('../database/dbFunctions')
module.exports = 
    async function (client,interaction) {
        const heroes = await dbFunctions.getAllHeroesFromDb();
        const focusedValue = interaction.options.getFocused();
        if(focusedValue.length < 3) {
            return;
        }
        const heroesList = heroes.map(hero => hero.name);
        const heroesListFiltered = heroesList.filter(hero => hero.toLowerCase().includes(focusedValue.toLowerCase()));
        const heroesListFilteredSlicedMapped = heroesListFiltered.map(hero => {
            return {
                name: hero,
                value: hero
            }
        }
        );  
        await interaction.respond(heroesListFilteredSlicedMapped)
        const command = interaction.client.commands.get(interaction.commandName);
        
}