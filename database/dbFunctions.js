const db = require('./getConnection');
const pool = db.getPool();
const {MessageEmbed} = require('discord.js');
module.exports = {
    getUsers: async function (name, callback) {
        await pool.query(`SELECT * FROM member AS m WHERE m.name = "${name}"`, (err, res) => {
            if (err) throw err;
            callback(res[0])
        })
    },
    getGuilds: function (guild_id) {
        switch (guild_id) {
            case 1 :
                return "Dark";
            case 2 :
                return "Light";
            case 3 :
                return "Wilda";
        }
    },
    isAdmin: function (member) {
        return member.roles.cache.some(r => r.name === 'dev' || r.name === 'Modération E7')
    },
    reset: async function () {
        await pool.query(`UPDATE member SET score = 0 WHERE 1 = 1 `, (err, res) => {
            if (err) throw res;
        })
    },
    isNotAdmin: function (interaction) {
        const embed = new MessageEmbed()
            .setColor("#800303")
            .setTitle("C'est non !")
            .setImage("https://img.passeportsante.net/1000x526/2020-01-29/i93384-.jpeg")
            .setDescription("Tu n'es pas autorisé à utiliser ça")
            .setTimestamp();
        return interaction.reply({embeds: [embed]});
    },
    addMember: async function (guild_id, name) {
        pool.query(`INSERT INTO member (guild_id, name, score,warn) VALUES(${guild_id},"${name}", 0,0)`, (err) => {
            if (err) throw err;

        })
    },
    removeMember: async function (guild_id, name) {
        pool.query(`DELETE FROM member WHERE guild_id= ${guild_id} AND name = "${name}"`, (err) => {
            if (err) throw err;
        })
    },
    modifyScore: async function (guild_id, name, points, callback) {
        pool.query(`UPDATE member SET score = score + ${points} WHERE name = "${name}" AND guild_id = ${guild_id}`, (err) => {
            if (err) throw err;
        })
        pool.query(`SELECT * FROM member WHERE name= "${name}" AND guild_id = ${guild_id}`, (err, res) => {
            callback(res);
        })
    },
    getAllMembersFromGuild: function (guild_id, callback) {
        pool.query(`SELECT * FROM member WHERE guild_id =${guild_id} ORDER BY score DESC LIMIT 25`, (err, res) => {
            if (err) throw err;
            res.sort(function (a, b) {
                return b.score - a.score;
            })
            callback(res)
        })
    },
    giveWarn: function (member, number, callback) {
        pool.query(`UPDATE member SET warn = warn ${number} WHERE name = "${member}"`, (err) => {
            if (err) throw err;
        })
        pool.query(`SELECT * FROM member WHERE name = "${member}"`, (err, res) => {
            if (err) throw err;
            callback(res)
        })
    },
    getListMembers: function (guild_id) {
        return new Promise((resolve) => {
            pool.query(`SELECT * FROM member WHERE guild_id = ${guild_id}`, (err, rows) => {
                if (err) throw err;
                resolve(rows)
            })
        })
    },
    /**
     * To insert or retrieve the user who wrote a message
     * @param {Number} userId (interaction user id)
     * @param {Date} messageDate (interaction timestamp message)
     * @param {String} username (Interaction username)
     * @param {(user) => user.} callback (user => user.id...)
     */
    getUserDb: async function (userId, messageDate, username, callback) {
        // TO DO : Requete a chaque message a regler
        pool.query(
            `INSERT INTO users (id,lastMessage, username, level, currentXp, xpNeeded) VALUES ('${userId}',${messageDate},"${username}",1,0,100);`
            , (err) => {
                // SQL CONSTRAINT UNIQUE
                if (err) {
                    if (err.errno === 1062) {
                        pool.query(
                            `SELECT * FROM users WHERE id = ${userId}`,
                            (err, row) => {
                                if (err) {
                                    console.error("Error on select during GetUserDb : \n" + err)
                                }
                                return row
                            })
                    }
                }
            })
        pool.query(
            `SELECT * FROM users WHERE id = ${userId}`,
            (err, row) => {
                if (err) {
                    console.error("Error on select during GetUserDb : \n" + err)
                }
                return callback(row)
            })
    },
    /**
     * Permit to give xp and update the result in db
     * @param {*} userId (interaction user id)
     * @param {*} xpGiven (random number generated)
     * @param {*} messageDate (interaction timestamp message)
     * @param {*} xpNeeded (xp for lvl up)
     * @param {callback} callback ( user => user.id... After the update )
     */
    giveXp: async function (userId, xpGiven, messageDate, xpNeeded, callback) {
        pool.query(
            `UPDATE users SET currentXp = ${xpGiven} + currentXp, lastMessage = ${messageDate} ,xpNeeded = ${xpNeeded} WHERE id = ${userId}`, (err) => {
                if (err) {
                    console.log("Error on Update during GiveXp : \n" + err)
                }
                pool.query(
                    `SELECT * FROM users WHERE id = ${userId}`, (err, row) => {
                        if (err) throw err;
                        callback(row[0])
                    }
                )
            }
        )
    },
    /**
     * just an update for the user to level up
     * @param {*} userId
     * @param {*} userLevel
     */
    levelUp: async function (userId, userLevel) {
        pool.query(
            `UPDATE users SET level = ${userLevel} + 1, currentXp = 0 WHERE id = ${userId}`, (err) => {
                if (err) {
                    console.log("Error on Update during GiveXp : \n" + err)
                }
            }
        )
    },
    /**
     *
     * @param {Number} userId
     * @param {CallableFunction} callback
     */
    singleRank: async function (userId, callback) {
        pool.query(
            `SELECT * FROM users WHERE id = ${userId}`, (err, row) => {
                if (err) {
                    console.log("Error on Select during rank : \n" + err)
                }
                callback(row[0])
            }
        )
    },
    /**
     * Return all the users from the db and sort them
     * @param callback
     */
    getRank: async function (callback) {
        pool.query(
            `SELECT * FROM users ORDER BY level DESC,currentXp DESC`
            , (err, rows) => {
                if (err) {
                    console.log("Error on Select during rank : \n" + err)
                }
                callback(rows)
            })
    },
    setMessageReaction: async function (message_id, role_name, emoji) {
        pool.query(
            `INSERT INTO react_messages VALUES (${message_id}, "${role_name}", "${emoji}")`, (err) => {
                if (err) throw err
            })
    },
    getMessageReaction: async function (message_id, callback) {
        pool.query(
            `SELECT * from react_messages WHERE id = ${message_id}`, (err, rows) => {
                if (err) throw err
                callback(rows)
            }
        )
    },
    addBirthday: async function (user_id, birthday) {
        pool.query(`
        UPDATE users SET birthday = '${birthday}' WHERE id = '${user_id}'
      `, (err) => {
            if (err) throw err;
        })
    },
    getBirthdays: async function () {
        return new Promise((resolve, reject) => {
            pool.query(`SELECT birthday, id FROM users`, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    },
    updatePlanning: async function (img) {
        await pool.query(
            `UPDATE admin SET img = '${img}' WHERE id=1`, (err) => {
                if (err) throw err;
            }
        )
    },
    getPlanning: async function (callback) {
        await pool.query(
            `SELECT img FROM admin WHERE id=1`, (err, row) => {
                if (err) throw err;
                callback(row[0].img)
            }
        )
    },
    insertHeroesDb: async function (image, nb_stars, element, name, code) {
        await pool.query(
            `INSERT INTO hero_db (image,nb_stars,element, name, code) VALUES ('${image}', ${nb_stars}, '${element}', "${name}", '${code}')`, (err) => {
                if (err) throw err;
            }
        )
    },
    getHero: async function (name) {
        return new Promise((resolve, reject) => {
            pool.query(`SELECT * FROM hero where name = '${name}'`, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    },
    getHeroes: async function (index) {
        return new Promise((resolve, reject) => {
            pool.query(`SELECT * FROM hero ORDER BY name ASC LIMIT 25 OFFSET ${index} `, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    },
    getuser: async function (name) {
        return new Promise((resolve, reject) => {
            pool.query(`SELECT * FROM users WHERE name = '${name}'`, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    },
    getHeroCount: async function () {
        return new Promise((resolve, reject) => {
            pool.query(`SELECT COUNT(*) FROM hero`, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows[0]['COUNT(*)']);
                }
            });
        });
    },
    getAllHeroesFromDb: async function () {
        return new Promise((resolve, reject) => {
            pool.query(`SELECT * FROM hero_db ORDER BY name ASC`, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    },
    getHeroDbFromName: async function (name) {
        return new Promise((resolve, reject) => {
            pool.query(`SELECT * FROM hero_db WHERE name = "${name}"`, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows[0]);
                }
            });
        });
    },
}
