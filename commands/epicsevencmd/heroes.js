const {SlashCommandBuilder} = require('@discordjs/builders');
const {MessageFlags} = require('discord.js');
const dbFunctions = require('../../database/dbFunctions');
const {
    showHeroSearchPrompt,
    applyHeroSearch,
} = require('../../events/heroSearchFlow');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('heroes')
        .setDescription('Rechercher un héros (menu filtré)')
        .addStringOption(option =>
            option
                .setName('recherche')
                .setDescription('Filtrer par nom (autocomplétion)')
                .setAutocomplete(true),
        ),

    async execute(interaction, client) {
        const count = (await dbFunctions.getHeroCount()) ?? 0;
        if (!count) {
            return interaction.reply({
                content: 'Aucun héros en base. Lance `/sync` (admin) après avoir mis à jour `herodata.json`.',
                flags: MessageFlags.Ephemeral,
            });
        }

        const search = interaction.options.getString('recherche');
        if (!search) {
            return showHeroSearchPrompt(interaction);
        }
        return applyHeroSearch(interaction, client, search);
    },
};
