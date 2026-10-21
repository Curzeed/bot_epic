const {Client} = require('discord.js');
const cron = require('cron');
const dbFunctions = require('../database/dbFunctions');
const {general_channel} = require('../config.json');

/**
 * @param {Client} client
 */
module.exports = async function (client) {
    const bdayCron = new cron.CronJob('03 1 * * *', async () => {
        try {
            const birthdays = await dbFunctions.getBirthdays();
            if (!birthdays?.length) return;
            for (const birthday of birthdays) {
                if (isNaN(new Date(birthday.birthday).getTime())) continue;
                const atmDate = new Date();
                const bdate = new Date(birthday.birthday);
                if (bdate.getDate() === atmDate.getDate() && bdate.getMonth() === atmDate.getMonth()) {
                    const user = await client.users.fetch(birthday.id);
                    const channel = await client.channels.fetch(general_channel);
                    channel.send(`C'est l'anniversaire de : ${user} ! \nJoyeux anniversaire !`);
                }
            }
        } catch (err) {
            console.error('Birthday cron:', err);
        }
    });
    bdayCron.start();

    const helloCron = new cron.CronJob('0 8 * * *', async () => {
        const channel = await client.channels.fetch(general_channel);
        channel.send("Bienvenue dans cette nouvelle journée ! \n N'oubliez pas vive l'amour et vive l'amitié !!");
    });
    helloCron.start();
};
