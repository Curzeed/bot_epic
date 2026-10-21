const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const config = require('../config.json');

let db;

function initSchema(database) {
    database.exec(`
        CREATE TABLE IF NOT EXISTS member (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            guild_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            score INTEGER NOT NULL DEFAULT 0,
            warn INTEGER NOT NULL DEFAULT 0,
            UNIQUE (guild_id, name)
        );

        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            lastMessage INTEGER NOT NULL DEFAULT 0,
            username TEXT NOT NULL,
            name TEXT,
            level INTEGER NOT NULL DEFAULT 1,
            currentXp INTEGER NOT NULL DEFAULT 0,
            xpNeeded INTEGER NOT NULL DEFAULT 100,
            birthday TEXT
        );

        CREATE TABLE IF NOT EXISTS react_messages (
            id TEXT NOT NULL,
            role_name TEXT NOT NULL,
            emoji TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS admin (
            id INTEGER PRIMARY KEY,
            img TEXT NOT NULL DEFAULT ''
        );

        CREATE TABLE IF NOT EXISTS hero (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            image TEXT,
            nb_stars INTEGER,
            element TEXT,
            message_link TEXT,
            code TEXT
        );

        CREATE TABLE IF NOT EXISTS hero_db (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            image TEXT,
            nb_stars INTEGER,
            element TEXT,
            name TEXT NOT NULL UNIQUE,
            code TEXT
        );
    `);
    database.prepare('INSERT OR IGNORE INTO admin (id, img) VALUES (1, ?)').run('');
    migrateHeroDbUnique(database);
}

/** Anciennes BDD sans UNIQUE(name) sur hero_db — requis pour ON CONFLICT du sync. */
function migrateHeroDbUnique(database) {
    const row = database.prepare(
        "SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'hero_db'",
    ).get();
    if (!row?.sql || row.sql.includes('UNIQUE')) return;

    database.exec(`
        CREATE TABLE hero_db_migrated (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            image TEXT,
            nb_stars INTEGER,
            element TEXT,
            name TEXT NOT NULL UNIQUE,
            code TEXT
        );
        INSERT OR IGNORE INTO hero_db_migrated (image, nb_stars, element, name, code)
        SELECT image, nb_stars, element, name, code FROM hero_db;
        DROP TABLE hero_db;
        ALTER TABLE hero_db_migrated RENAME TO hero_db;
    `);
}

module.exports = {
    getDb() {
        if (db) return db;
        const sqlitePath = path.resolve(
            process.cwd(),
            config.sqlitePath || 'data/bot.db',
        );
        fs.mkdirSync(path.dirname(sqlitePath), {recursive: true});
        db = new Database(sqlitePath);
        db.pragma('journal_mode = WAL');
        initSchema(db);
        return db;
    },
};
