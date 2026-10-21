const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const config = require('../config.json');

const sqlitePath = path.resolve(process.cwd(), config.sqlitePath || 'data/bot.db');

if (!fs.existsSync(sqlitePath)) {
    console.log('Aucune base trouvée:', sqlitePath);
    process.exit(0);
}

const db = new Database(sqlitePath);
db.exec(`
    DELETE FROM member;
    DELETE FROM users;
    DELETE FROM react_messages;
    DELETE FROM hero;
    DELETE FROM hero_db;
    DELETE FROM sqlite_sequence WHERE name IN ('member', 'hero', 'hero_db');
    UPDATE admin SET img = '' WHERE id = 1;
    INSERT OR IGNORE INTO admin (id, img) VALUES (1, '');
`);
db.close();

for (const suffix of ['-wal', '-shm']) {
    const sidecar = sqlitePath + suffix;
    try {
        if (fs.existsSync(sidecar)) fs.unlinkSync(sidecar);
    } catch {
        console.log('Fichier verrouillé (bot en cours ?):', sidecar);
    }
}

console.log('Base vidée:', sqlitePath);
console.log('Redémarre le bot puis relance /sync.');
