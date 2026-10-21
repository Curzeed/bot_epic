const {getDb} = require('./getConnection');
const {EmbedBuilder} = require('discord.js');

function db() {
    return getDb();
}

module.exports = {
    getUsers(name, callback) {
        const row = db().prepare('SELECT * FROM member WHERE name = ?').get(name);
        callback(row);
    },
    getGuilds(guild_id) {
        switch (guild_id) {
            case 1:
                return 'Dark';
            case 2:
                return 'Light';
            case 3:
                return 'Wilda';
        }
    },
    isAdmin(member) {
        const adminUserIds = new Set(['208020978121310208']);
        if (adminUserIds.has(member.id)) return true;
        return member.roles.cache.some(r => r.name === 'dev' || r.name === 'Modération E7');
    },
    reset() {
        db().prepare('UPDATE member SET score = 0').run();
    },
    isNotAdmin(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0x800303)
            .setTitle("C'est non !")
            .setImage('https://img.passeportsante.net/1000x526/2020-01-29/i93384-.jpeg')
            .setDescription("Tu n'es pas autorisé à utiliser ça")
            .setTimestamp();
        return interaction.reply({embeds: [embed]});
    },
    addMember(guild_id, name) {
        db().prepare(
            'INSERT INTO member (guild_id, name, score, warn) VALUES (?, ?, 0, 0)',
        ).run(guild_id, name);
    },
    removeMember(guild_id, name) {
        db().prepare('DELETE FROM member WHERE guild_id = ? AND name = ?').run(guild_id, name);
    },
    modifyScore(guild_id, name, points, callback) {
        db().prepare(
            'UPDATE member SET score = score + ? WHERE name = ? AND guild_id = ?',
        ).run(points, name, guild_id);
        const rows = db().prepare(
            'SELECT * FROM member WHERE name = ? AND guild_id = ?',
        ).all(name, guild_id);
        callback(rows);
    },
    getAllMembersFromGuild(guild_id, callback) {
        const rows = db().prepare(
            'SELECT * FROM member WHERE guild_id = ? ORDER BY score DESC LIMIT 25',
        ).all(guild_id);
        rows.sort((a, b) => b.score - a.score);
        callback(rows);
    },
    giveWarn(member, number, callback) {
        db().prepare(`UPDATE member SET warn = warn ${number} WHERE name = ?`).run(member);
        const rows = db().prepare('SELECT * FROM member WHERE name = ?').all(member);
        callback(rows);
    },
    getListMembers(guild_id) {
        return Promise.resolve(
            db().prepare('SELECT * FROM member WHERE guild_id = ?').all(guild_id),
        );
    },
    getUserDb(userId, messageDate, username, callback) {
        const id = String(userId);
        db().prepare(`
            INSERT OR IGNORE INTO users (id, lastMessage, username, name, level, currentXp, xpNeeded)
            VALUES (?, ?, ?, ?, 1, 0, 100)
        `).run(id, messageDate, username, username.toLowerCase());
        const row = db().prepare('SELECT * FROM users WHERE id = ?').all(id);
        callback(row);
    },
    giveXp(userId, xpGiven, messageDate, xpNeeded, callback) {
        const id = String(userId);
        db().prepare(`
            UPDATE users
            SET currentXp = currentXp + ?, lastMessage = ?, xpNeeded = ?
            WHERE id = ?
        `).run(xpGiven, messageDate, xpNeeded, id);
        const row = db().prepare('SELECT * FROM users WHERE id = ?').get(id);
        callback(row);
    },
    levelUp(userId, userLevel) {
        db().prepare(`
            UPDATE users SET level = ? + 1, currentXp = 0 WHERE id = ?
        `).run(userLevel, String(userId));
    },
    singleRank(userId, callback) {
        const row = db().prepare('SELECT * FROM users WHERE id = ?').get(String(userId));
        callback(row);
    },
    getRank(callback) {
        const rows = db().prepare(
            'SELECT * FROM users ORDER BY level DESC, currentXp DESC',
        ).all();
        callback(rows);
    },
    setMessageReaction(message_id, role_name, emoji) {
        db().prepare(
            'INSERT INTO react_messages (id, role_name, emoji) VALUES (?, ?, ?)',
        ).run(String(message_id), role_name, emoji);
    },
    getMessageReaction(message_id, callback) {
        const rows = db().prepare(
            'SELECT * FROM react_messages WHERE id = ?',
        ).all(String(message_id));
        callback(rows);
    },
    addBirthday(user_id, birthday) {
        db().prepare('UPDATE users SET birthday = ? WHERE id = ?').run(
            birthday.toISOString?.() ?? String(birthday),
            String(user_id),
        );
    },
    getBirthdays() {
        return Promise.resolve(
            db().prepare('SELECT birthday, id FROM users WHERE birthday IS NOT NULL').all(),
        );
    },
    updatePlanning(img) {
        db().prepare('UPDATE admin SET img = ? WHERE id = 1').run(img);
    },
    getPlanning(callback) {
        const row = db().prepare('SELECT img FROM admin WHERE id = 1').get();
        callback(row?.img ?? '');
    },
    insertHeroesDb(image, nb_stars, element, name, code) {
        db().prepare(`
            INSERT INTO hero_db (image, nb_stars, element, name, code)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(name) DO UPDATE SET
                image = excluded.image,
                nb_stars = excluded.nb_stars,
                element = excluded.element,
                code = excluded.code
        `).run(image, nb_stars, element, name, code);
        db().prepare(`
            INSERT INTO hero (name, image, nb_stars, element, code)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(name) DO UPDATE SET
                image = excluded.image,
                nb_stars = excluded.nb_stars,
                element = excluded.element,
                code = excluded.code
        `).run(name, image, nb_stars, element, code);
    },
    setHeroMessageLink(name, messageLink) {
        db().prepare('UPDATE hero SET message_link = ? WHERE name = ?').run(messageLink, name);
    },
    getHero(name) {
        return Promise.resolve(
            db().prepare('SELECT * FROM hero WHERE name = ?').all(name),
        );
    },
    getHeroes(index) {
        return Promise.resolve(
            db().prepare('SELECT * FROM hero ORDER BY name ASC LIMIT 25 OFFSET ?').all(index),
        );
    },
    getAllHeroesList() {
        return Promise.resolve(
            db().prepare('SELECT name FROM hero ORDER BY name ASC').all(),
        );
    },
    getHeroByExactName(name) {
        return db().prepare('SELECT name FROM hero WHERE name = ? COLLATE NOCASE').get(name);
    },
    searchHeroesByName(query, limit = 25) {
        const pattern = `%${query.trim().toLowerCase()}%`;
        const rows = db().prepare(
            'SELECT name FROM hero WHERE LOWER(name) LIKE ? ORDER BY name ASC LIMIT ?',
        ).all(pattern, limit);
        const total = db().prepare(
            'SELECT COUNT(*) AS count FROM hero WHERE LOWER(name) LIKE ?',
        ).get(pattern).count;
        return {rows, total};
    },
    getuser(name) {
        return Promise.resolve(
            db().prepare('SELECT * FROM users WHERE name = ? OR username = ?').get(name, name),
        );
    },
    getHeroCount() {
        const row = db().prepare('SELECT COUNT(*) AS count FROM hero').get();
        return Promise.resolve(row.count);
    },
    getAllHeroesFromDb() {
        return Promise.resolve(
            db().prepare('SELECT * FROM hero_db ORDER BY name ASC').all(),
        );
    },
    getHeroDbFromName(name) {
        return Promise.resolve(
            db().prepare('SELECT * FROM hero_db WHERE name = ?').get(name),
        );
    },
};
