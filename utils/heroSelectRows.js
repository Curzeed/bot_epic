const {ActionRowBuilder, StringSelectMenuBuilder} = require('discord.js');

const OPTIONS_PER_MENU = 25;

function buildFilteredSelectRows(heroes, placeholder = 'Choisis un héros') {
    if (!heroes.length) return [];
    const slice = heroes.slice(0, OPTIONS_PER_MENU);
    return [
        new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('select_hero_0')
                .setPlaceholder(placeholder.slice(0, 150))
                .addOptions(
                    slice.map(hero => {
                        const name = typeof hero === 'string' ? hero : hero.name;
                        return {label: name.slice(0, 100), value: name.slice(0, 100)};
                    }),
                ),
        ),
    ];
}

module.exports = {buildFilteredSelectRows, OPTIONS_PER_MENU};
