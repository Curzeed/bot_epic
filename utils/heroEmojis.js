const ATTRIBUTE_TO_EMOJI = {
    fire: 'Fire',
    feu: 'Fire',
    ice: 'Ice',
    eau: 'Ice',
    wind: 'Earth',
    terre: 'Earth',
    light: 'Light',
    dark: 'Dark',
    ombre: 'Dark',
};

function elementEmoji(client, attribute) {
    if (!attribute) return '—';
    const key = ATTRIBUTE_TO_EMOJI[attribute.toLowerCase()] ?? attribute;
    const emoji = client.emojis.cache.find(e => e.name === key);
    return emoji ? String(emoji) : attribute;
}

module.exports = {elementEmoji};
