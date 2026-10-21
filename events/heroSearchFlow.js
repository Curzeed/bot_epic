const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    MessageFlags,
} = require('discord.js');
const dbFunctions = require('../database/dbFunctions');
const {buildFilteredSelectRows, OPTIONS_PER_MENU} = require('../utils/heroSelectRows');
const {buildHeroEmbed} = require('./heroEmbed');

function listEmbed(query, total, shown) {
    let description = `**${shown}** résultat(s) pour « **${query}** ».`;
    if (total > shown) {
        description += `\nAffine la recherche (${total} correspondances, max ${OPTIONS_PER_MENU} affichés).`;
    }
    description += '\nChoisis un héros dans le menu, ou relance une recherche.';
    return new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle('Héros')
        .setDescription(description)
        .setTimestamp();
}

function searchPromptEmbed() {
    return new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle('Recherche de héros')
        .setDescription(
            '• Option **recherche** sur `/heroes` : autocomplétion pendant que tu tapes (min. 2 caractères).\n' +
            '• Ou clique **Filtrer** pour ouvrir une recherche, puis un menu filtré.',
        )
        .setTimestamp();
}

function filterButtonRow() {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('hero_open_search')
            .setLabel('Filtrer')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('🔍'),
    );
}

async function showHeroSearchPrompt(interaction) {
    return interaction.reply({
        embeds: [searchPromptEmbed()],
        components: [filterButtonRow()],
    });
}

async function showHeroSearchModal(interaction) {
    const modal = new ModalBuilder()
        .setCustomId('hero_search_modal')
        .setTitle('Filtrer les héros');
    modal.addComponents(
        new ActionRowBuilder().addComponents(
            new TextInputBuilder()
                .setCustomId('hero_query')
                .setLabel('Nom (partiel, min. 2 caractères)')
                .setStyle(TextInputStyle.Short)
                .setMinLength(2)
                .setMaxLength(80)
                .setRequired(true),
        ),
    );
    await interaction.showModal(modal);
}

/**
 * @param {import('discord.js').Interaction} interaction
 * @param {import('discord.js').Client} client
 * @param {string} query
 */
async function applyHeroSearch(interaction, client, query) {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
        const payload = {content: 'Entre au moins 2 caractères.', flags: MessageFlags.Ephemeral};
        if (interaction.deferred || interaction.replied) {
            return interaction.editReply(payload);
        }
        return interaction.reply(payload);
    }

    const exact = dbFunctions.getHeroByExactName(trimmed);
    if (exact) {
        const embed = await buildHeroEmbed(client, exact.name);
        const payload = {embeds: [embed], components: []};
        if (interaction.deferred || interaction.replied) {
            return interaction.editReply(payload);
        }
        return interaction.reply(payload);
    }

    const {rows, total} = dbFunctions.searchHeroesByName(trimmed, OPTIONS_PER_MENU);
    if (!total) {
        const payload = {
            content: `Aucun héros pour « ${trimmed} ».`,
            flags: MessageFlags.Ephemeral,
        };
        if (interaction.deferred || interaction.replied) {
            return interaction.editReply(payload);
        }
        return interaction.reply(payload);
    }

    const payload = {
        embeds: [listEmbed(trimmed, total, rows.length)],
        components: [...buildFilteredSelectRows(rows, `Résultats : ${trimmed}`), filterButtonRow()],
    };
    if (interaction.deferred || interaction.replied) {
        return interaction.editReply(payload);
    }
    return interaction.reply(payload);
}

async function handleHeroSearchModal(interaction, client) {
    const query = interaction.fields.getTextInputValue('hero_query');
    await interaction.deferReply();
    await applyHeroSearch(interaction, client, query);
}

module.exports = {
    showHeroSearchPrompt,
    showHeroSearchModal,
    applyHeroSearch,
    handleHeroSearchModal,
};
