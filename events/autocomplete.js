const dbFunctions = require('../database/dbFunctions');
const herodata = require('../utils/herodataService');

function heroAutocomplete(focusedValue) {
    const query = String(focusedValue ?? '');
    if (query.length < 2) return [];
    return herodata.searchNames(query, 25).map(name => ({name, value: name}));
}

module.exports = async function (client, interaction) {
    const name = interaction.commandName;

    if (name === 'heroes' || name === 'fiche' || name === 'compare') {
        return interaction.respond(heroAutocomplete(interaction.options.getFocused()));
    }

    if (name === 'defense' || name === 'canvas') {
        const focusedValue = interaction.options.getFocused();
        if (focusedValue.length < 2) return;
        return interaction.respond(heroAutocomplete(focusedValue));
    }

    if (name === 'remove') {
        const guild = interaction.options.getString('guilde');
        const result = await dbFunctions.getListMembers(guild);
        const focusedValue = interaction.options.getFocused().toLowerCase();
        const mapped = result
            .filter(member => member.name.toLowerCase().includes(focusedValue))
            .slice(0, 25)
            .map(member => ({name: member.name, value: member.name}));
        return interaction.respond(mapped);
    }

    if (name === 'infos') {
        const focusedValue = interaction.options.getFocused();
        if (focusedValue.length < 4) return;
        const APIUsers = 'https://static.smilegatemegaport.com/gameRecord/epic7/epic7_user_world_eu.json?_=1698934868027';
        const response = await fetch(APIUsers);
        const result = await response.json();
        const mapped = result.users
            .filter(user => user.nick_nm.toLowerCase().includes(focusedValue.toLowerCase()))
            .slice(0, 25)
            .map(user => ({name: user.nick_nm, value: user.nick_no}));
        return interaction.respond(mapped);
    }
};
