/** Nom de salon texte Discord (minuscules, tirets, caractères autorisés). */
function formatChannelName(name) {
    if (!name) return null;
    return name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-_]/g, '')
        .slice(0, 100) || null;
}

function memberChannelName(member) {
    return formatChannelName(member.nickname) ?? formatChannelName(member.user.username);
}

module.exports = {formatChannelName, memberChannelName};
