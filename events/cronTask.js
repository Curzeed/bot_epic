const {Client} = require('discord.js')
const cron = require('cron')
const dbFunctions = require('../database/dbFunctions')
const {general_test} = require("../config.json")
/**
 * 
 * @param {Client} client 
 */
module.exports = async function (client) {
    let bdayCron = new cron.CronJob('0 10 * * *',()=>{
        dbFunctions.getBirthdays(( birthdays => {
            if(!birthdays) return
            birthdays.forEach(async (birthday) => {
                if(new Date(Number(birthday.birthday) == "Invalid Date")) return;
                if(new Date(Number(birthday.birthday)).getDate() === new Date().getDate() && new Date(Number(birthday.birthday)).getMonth() === new Date().getMonth()){
                    const user = await client.users.fetch(birthday.id)
                    const channel_general = await client.channels.fetch(general_test)
                    channel_general.send(`C'est l'anniversaire de : ${user} ! \nJoyeux anniversaire !`)
                }
            })
        }))
    })
    bdayCron.start()
    const helloCron = new cron.CronJob('0 10 * * *', () => {
        const idChan = "1050434819626119230"
        const channel = client.channels.cache.get(idChan)
        channel.send("Bonjour à tous !")
    })
    helloCron.start()
}