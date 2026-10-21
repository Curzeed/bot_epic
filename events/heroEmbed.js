const dbFunctions = require('../database/dbFunctions');
const {EmbedBuilder} = require('discord.js');
const {
    findByName: findHeroMeta,
    ROLE_FR,
    formatStatsBlock,
    formatSkillsSummary,
    formatDevotion,
} = require('../utils/herodataService');
const {elementEmoji} = require('../utils/heroEmojis');

async function buildHeroEmbed(client, heroName) {
    const meta = findHeroMeta(heroName);
    let dbRow;
    try {
        const rows = await dbFunctions.getHero(meta?.name ?? heroName);
        dbRow = rows[0];
    } catch {
        dbRow = null;
    }

    const name = meta?.name ?? dbRow?.name ?? heroName;
    const stars = '⭐'.repeat(Number(meta?.rarity ?? dbRow?.nb_stars ?? 0));
    const thumb = meta?.assets?.thumbnail ?? dbRow?.image;
    const element = meta?.attribute ?? dbRow?.element;
    const devotion = meta ? formatDevotion(meta) : null;

    const embed = new EmbedBuilder()
        .setColor(elementColor(element))
        .setTitle(name)
        .setThumbnail(thumb ?? null)
        .addFields(
            {name: 'Élément', value: elementEmoji(client, element), inline: true},
            {name: 'Classe', value: ROLE_FR[meta?.role] ?? meta?.role ?? '—', inline: true},
            {name: 'Rareté', value: stars || '—', inline: true},
        );

    if (meta) {
        embed.addFields(
            {name: 'Stats (60★ éveillé)', value: formatStatsBlock(meta), inline: false},
            {name: 'Skills (multi)', value: formatSkillsSummary(meta), inline: false},
        );
        if (devotion) {
            embed.addFields({name: 'Imprint', value: devotion, inline: true});
        }
        if (meta.zodiac) {
            embed.addFields({name: 'Zodiac', value: meta.zodiac, inline: true});
        }
    }

    const guideLink = dbRow?.message_link;
    embed.setDescription(
        guideLink
            ? String(guideLink)
            : meta
                ? `*Données [Fribbels E7 Optimizer](https://github.com/fribbels/Fribbels-Epic-7-Optimizer)*`
                : '*Héros absent de herodata.json — lance `/sync`.*',
    );

    return embed;
}

function elementColor(attribute) {
    switch (attribute?.toLowerCase()) {
        case 'fire': return 0xe74c3c;
        case 'ice': return 0x3498db;
        case 'wind': return 0x2ecc71;
        case 'light': return 0xf1c40f;
        case 'dark': return 0x9b59b6;
        default: return 0x0099ff;
    }
}

module.exports = {buildHeroEmbed};
