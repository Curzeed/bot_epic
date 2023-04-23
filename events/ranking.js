const dbFunc = require('../database/dbFunctions')
module.exports = async function (client,message) {
        var userDb
        if(message.author.bot) return;
        await dbFunc.getUserDb(message.author.id,message.createdTimestamp,message.author.username, (value) => {
            userDb = value[0]
            const userLastMessage = userDb.lastMessage
            const userLevel = userDb.level
            if((message.createdTimestamp - userLastMessage) < 60000){
                return
			} 
            const xpNeeded =  Math.floor(+100 * userLevel / 0.75 * 0.75) 
            const xpGiven = Math.round(Math.random()*11)
            dbFunc.giveXp(userDb.id,xpGiven,message.createdTimestamp,xpNeeded, async function (value) {
                let finalUser = value
                if(finalUser.currentXp >= xpNeeded){
                    await dbFunc.levelUp(finalUser.id,finalUser.level)
                    const channel = await client.channels.cache.get('1059241154606018611')
		            const user =  message.author
                    channel.send(`Bravo à ${user}, qui est passé au niveau ${finalUser.level + 1} ! `)
                }
            })
        })  
}
