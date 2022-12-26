const {Client} = require('discord.js')
const cron = require('cron')
const dbFunctions = require('./database')
/**
 * 
 * @param {Client} client 
 */
module.exports = async function (client) {
    const jobs = []
    
    //jobs.push(new cron.CronJob('0 10 * * *', () => {
    //    const idChan = "1050434819626119230"
    //    const channel = client.channels.cache.get(idChan)
    //    channel.send("Bonjour à tous !")
    //}))
    //jobs.push(new cron.CronJob('0 10 * * *'), () => {
    //    const idChan = "1050434819626119230"
    //    const channel = client.channels.cache.get(idChan)
    //   channel.send("Bonjour à tous !")
    //})
    //jobs.forEach((job) => {
    //    job.start()
    //})
}