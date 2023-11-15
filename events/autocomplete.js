const dbFunctions = require('../database/dbFunctions')
module.exports = 
    async function (client,interaction) {
        if(interaction.commandName === 'defense'){
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
        if(interaction.commandName === 'remove'){
            const focusedValue = interaction.options.getFocused();
            const guild = interaction.options.getString('guilde');
            const result = await dbFunctions.getListMembers(guild);
            const resultFiltered = result.filter(member => member.name.toLowerCase().includes(interaction.options.getFocused().toLowerCase()));
            const resultFilteredSlicedMapped = resultFiltered.map(member => {
                return {
                    name: member.name,
                    value: member.name
                }
            }
            );
            await interaction.respond(resultFilteredSlicedMapped);
        }
        if(interaction.commandName === 'infos'){
            const focusedValue = interaction.options.getFocused();
            if(focusedValue.length < 4) {
                return;
            }
            const APIUsers = "https://static.smilegatemegaport.com/gameRecord/epic7/epic7_user_world_eu.json?_=1698934868027";
            const response = await fetch(APIUsers);
            const result = await response.json();
            const resultFiltered = result.users.filter(user => user.nick_nm.toLowerCase().includes(interaction.options.getFocused().toLowerCase()));
            const resultFilteredSlicedMapped = resultFiltered.map(user => {
                return {
                    name: user.nick_nm,
                    value: user.nick_no
                }
            }
            );
            await interaction.respond(resultFilteredSlicedMapped);
        }
}