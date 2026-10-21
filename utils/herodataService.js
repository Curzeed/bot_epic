const path = require('path');

let cache;

function load() {
    if (!cache) {
        cache = require(path.join(__dirname, '../herodata.json'));
    }
    return cache;
}

function findByName(name) {
    if (!name) return null;
    const data = load();
    if (data[name]) return data[name];
    const key = Object.keys(data).find(k => k.toLowerCase() === name.toLowerCase());
    return key ? data[key] : null;
}

function allHeroes() {
    return Object.values(load());
}

function searchNames(query, limit = 25) {
    const q = String(query ?? '').trim().toLowerCase();
    if (q.length < 2) return [];
    return Object.keys(load())
        .filter(name => name.toLowerCase().includes(q))
        .sort((a, b) => a.localeCompare(b, 'fr'))
        .slice(0, limit);
}

function filterHeroes({element, rarity, role} = {}) {
    return allHeroes().filter(hero => {
        if (element && hero.attribute !== element) return false;
        if (rarity && hero.rarity !== rarity) return false;
        if (role && hero.role !== role) return false;
        return true;
    });
}

const ELEMENT_FR = {
    fire: 'Feu',
    ice: 'Glace',
    wind: 'Vent',
    light: 'Lumière',
    dark: 'Ténèbres',
};

const ROLE_FR = {
    warrior: 'Guerrier',
    knight: 'Chevalier',
    mage: 'Mage',
    ranger: 'Ranger',
    soul_weaver: 'Soigneur',
    assassin: 'Assassin',
    manauser: 'Mage',
};

function formatStatsBlock(hero) {
    const s = hero.calculatedStatus?.lv60SixStarFullyAwakened;
    if (!s) return '*Stats non disponibles*';
    return [
        `**CP** ${s.cp.toLocaleString('fr-FR')}`,
        `**ATK** ${s.atk} · **HP** ${s.hp} · **DEF** ${s.def}`,
        `**VIT** ${s.spd} · **TC** ${Math.round(s.chc * 100)}% · **DC** ${Math.round(s.chd * 100)}%`,
        `**Eff** ${Math.round(s.eff * 100)}% · **Rés** ${Math.round(s.efr * 100)}%`,
    ].join('\n');
}

function formatSkillsSummary(hero) {
    const lines = [];
    for (const id of ['S1', 'S2', 'S3']) {
        const skill = hero.skills?.[id];
        if (!skill?.rate) continue;
        const parts = [`×${skill.rate}`];
        if (skill.pow) parts.push(`pow ${skill.pow}`);
        if (skill.targets > 1) parts.push(`${skill.targets} cibles`);
        lines.push(`**${id}** ${parts.join(' · ')}`);
    }
    return lines.length ? lines.join('\n') : '*Multiplicateurs non renseignés*';
}

function formatDevotion(hero) {
    const d = hero.self_devotion;
    if (!d?.grades) return null;
    const best = d.grades.SSS ?? d.grades.SS ?? d.grades.S;
    const pct = best != null ? `${(best * 100).toFixed(1)}%` : '?';
    return `${d.type?.toUpperCase() ?? 'Imprint'} (max ~${pct})`;
}

module.exports = {
    findByName,
    allHeroes,
    searchNames,
    filterHeroes,
    ELEMENT_FR,
    ROLE_FR,
    formatStatsBlock,
    formatSkillsSummary,
    formatDevotion,
};
