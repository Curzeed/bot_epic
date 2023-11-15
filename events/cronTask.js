const {Client} = require('discord.js')
const cron = require('cron')
const dbFunctions = require('../database/dbFunctions')
const {general_channel} = require("../config.json")
/**
 * 
 * @param {Client} client 
 */
module.exports = async function (client) {
let bdayCron = new cron.CronJob('03 1 * * *',()=>{
  dbFunctions.getBirthdays(async (birthdays) => { 
    if(!birthdays) return;
    birthdays.forEach(async (birthday) => {
      if(isNaN(new Date(birthday.birthday).getTime())) return;
      let atmDate = new Date();
      let bdate = new Date(birthday.birthday);
      if(bdate.getDate() == atmDate.getDate() && bdate.getMonth() == atmDate.getMonth()){
        const user = await client.users.fetch(birthday.id);
        const channel = await client.channels.fetch(general_channel)
        channel.send(`C'est l'anniversaire de : ${user} ! \nJoyeux anniversaire !`);
      }
    });
  });
});
    bdayCron.start();
    const helloCron = new cron.CronJob('0 8 * * *', async () => {
        const channel = await client.channels.fetch(general_channel)
        channel.send("Bienvenue dans cette nouvelle journée ! \n N'oubliez pas vive l'amour et vive l'amitié !!")
    })
    helloCron.start()
}
