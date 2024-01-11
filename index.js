// Require the necessary discord.js classes
const {Client, Intents, Collection, MessageEmbed, MessageReaction, Permissions} = require('discord.js');
const {token} = require('./config.json');
const fs = require('fs');
const ranking = require('./events/ranking');
const dbFunc = require('./database/dbFunctions')
const cronTask = require('./events/cronTask')
const hash = require('object-hash');
const tickets_create = require('./events/tickets_create');
const select_heroes = require('./events/select_heroes');
const paginationHeroes = require('./events/paginationHeroes');
const autocomplete = require('./events/autocomplete');
const regex_twitter = /http[s]?:\/\/twitter\.com\/([A-Za-z0-9_]+)\/status\/([0-9]+)/g;
const regex_x = /http[s]?:\/\/x\.com\/([A-Za-z0-9_]+)/g;
// You can define the Player as *client.player* to easly access it.

// Create a new client instance
const client = new Client({
    intents:
        [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_MEMBERS,
            Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
            Intents.FLAGS.GUILD_VOICE_STATES,
            Intents.FLAGS.DIRECT_MESSAGES
        ],
    partials:
        [
            'MESSAGE', 'CHANNEL', 'REACTION'
        ],
});
// Création d'une collection à l'instance du client
client.commands = new Collection();
// cron task
cronTask(client)
const commandFolders = fs.readdirSync('./commands');
for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.data.name, command);
    }
}

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Je suis lancé!');
});

client.on('interactionCreate', async interaction => {
    if (interaction.isSelectMenu()) {
        await select_heroes(client, interaction)
    }
    if (interaction.isAutocomplete()) {
        await autocomplete(client, interaction)
    }
    if (interaction.isButton()) {
        if (interaction.customId === 'next' || interaction.customId === 'previous') {
            await paginationHeroes(client, interaction, interaction.customId)
        }
        if (interaction.customId === 'ticket_create') {
            tickets_create(client, interaction);
        }
        if (interaction.customId === 'ticket_close') {
            interaction.channel.delete();
        }

    }
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;
    try {
        await command.execute(interaction, client);
    } catch (error) {
        console.error(error);
        await interaction.reply({content: 'Une erreur a été détectée lors de la commande', ephemeral: true});
    }
});
client.on('messageCreate', async (message) => {
    if(!message.guild){
        channelSend = client.channels.cache.get("857672927083757619");
        let allMessages = [];
        let lastId;
        while(true){
            const options = {limit : 1};
            if(lastId){
                options.before = lastId
            }
            const messages = await message.channel.messages.fetch(options);
            allMessages = allMessages.concat(Array.from(messages.values()))
            lastId = messages.last().id;
            if (messages.size != 1) {
                break;
            }
        }
        const userMessages = allMessages.filter(message => !message.author.bot);
        console.log(userMessages[0].author)
        return await channelSend.send(`${userMessages[0].author.username} m'a envoyé :  ${userMessages[0]}`)
    }
    if (!message.author.bot) {
        console.log(message.channel.name + " \n " + "Auteur : " + message.author.globalName + "\n" + message.content)
        ranking(client, message)
        let prefixe = "https://";
        if(message.content.match(regex_twitter)){
            let index = message.content.indexOf(prefixe) + prefixe.length;
            let editedMessage = message.content.slice(0, index) + "fx" + message.content.slice(index);
            await message.delete();
            message.channel.send({content: editedMessage})
        }
        if(message.content.match(regex_x)){
            let index = message.content.indexOf(prefixe) + prefixe.length;
            let editedMessage = message.content.slice(0, index) + "fixup" + message.content.slice(index);
            await message.delete();
            message.channel.send({content: editedMessage})
        }
        if (message.content.toLocaleLowerCase().endsWith("stickers")) {
            message.reply({stickers: ['980607299636822027']});
        }
    } else {
        return
    }

})
client.on('guildMemberAdd', async (member) => {
    // Channel arrivée
    const channel = client.channels.cache.get('765203678482661407');
    const role = member.guild.roles.cache.find(role => role.name === "En cours d'adhésion");
    const emoteOrbis = client.emojis.cache.find(emoji => emoji.name === "orbis");
    const emoteRoana = client.emojis.cache.find(emoji => emoji.name === "roa_yay");
    const embed = new MessageEmbed()
    embed.setThumbnail('https://cdn-longterm.mee6.xyz/plugins/welcome/images/765197397860024350/184b2cd1ff10af51ea51aa0e493410467cc1b47f74172ccf3f6b70a27a21b39f.png')
    let text = `Hey ${member}, Bienvenue dans la communauté DLW !${emoteRoana} \n \n ${emoteOrbis}N'hésites pas à te présenter et à nous annoncer la raison de ta venue... \n \n ${emoteOrbis}Nos modos te donneront accès au serveur ensuite !`
    embed.setDescription(text)
    embed.setColor('DARK_BLUE');
    member.roles.add(role);
    channel.send({embeds: [embed]})
})

client.on('messageReactionAdd', async (reaction, user) => {
    if (user.bot) {
        return;
    }
    var msgReacDb
    var msgReaction
    if (reaction.partial) {
        let oldMessage = await reaction.fetch()
        msgReaction = oldMessage.message.id
    } else {
        msgReaction = reaction.message.id
    }
    dbFunc.getMessageReaction(msgReaction, (msgs_reac) => {
        if (!msgs_reac) {
            return
        }
        msgs_reac.forEach((msgReac) => {
            msgReacDb = {
                role: msgReac.role_name,
                id: Number(msgReac.id),
                emoji_name: msgReac.emoji
            }
            if (msgReacDb.emoji_name == hash(reaction.emoji.name)) {
                const guild = reaction.message.guild;
                const member = guild.members.cache.get(user.id);
                const role = guild.roles.cache.find(r => r.name === msgReacDb.role);
                if (member.roles.cache.find(r => r.name === role.name)) {
                    return
                }
                member.roles.add(role);
                member.createDM().then(dmMessage => {
                    dmMessage.send({content: "Je t'ai ajouté le rôle : " + role.name})
                })
            }
        })
    })
})

client.on('messageReactionRemove', async (reaction, user) => {
    if (user.bot) {
        return;
    }
    var msgReacDb
    var msgReaction
    if (reaction.partial) {
        let oldMessage = await reaction.fetch()
        msgReaction = oldMessage.message.id
    } else {
        msgReaction = reaction.message.id
    }
    dbFunc.getMessageReaction(msgReaction, async (msgs_reac) => {
        if (!msgs_reac) {
            return
        }
        msgs_reac.forEach(async (msg_reac) => {
            msgReacDb = {
                role: msg_reac.role_name,
                id: Number(msg_reac.id),
                emoji_name: msg_reac.emoji
            }
            if (msgReacDb.emoji_name == hash(reaction.emoji.name)) {
                const guild = reaction.message.guild;
                const member = guild.members.cache.get(user.id);
                const role = guild.roles.cache.find(role => role.name === msgReacDb.role);
                if (!member.roles.cache.find(r => r.name === role.name)) {
                    return
                }
                let nwMember = await member.roles.remove(role);
                nwMember.createDM().then(dmMessage => {
                    dmMessage.send({content: "Je t'ai retiré le rôle : " + role.name})
                })
            }
        })
    })
})
client.on('guildMemberUpdate', async (oldMember, newMember) => {
    const oldRoles = oldMember.roles.cache;
    const newRoles = newMember.roles.cache;
    const addedRoles = newRoles.filter(role => !oldRoles.has(role.id));
    const ids = {
        '857724947757662239': 1,
        '857726272242581546': 2,
        '895551091574452304': 3
    };
    if (addedRoles.size > 0) {
        const roleId = addedRoles.at(0).id;
        if (ids.hasOwnProperty(roleId)) {
            await dbFunc.addMember(ids[addedRoles.at(0).id], oldMember.user.username)
            await channelTrigger(oldMember,newMember,ids[addedRoles.at(0).id]);
        }
        console.log('Roles ajoutés sur ' + oldMember.user.username + ': ' + addedRoles.map(role => role.name).join(', '))
    }
    const removedRoles = oldRoles.filter(role => !newRoles.has(role.id))
    if (removedRoles.size > 0) {
        const roleId = removedRoles.at(0).id;
        if (ids.hasOwnProperty(roleId)) {
            await dbFunc.removeMember(ids[removedRoles.at(0).id], oldMember.user.username)
        }
        console.log('Roles retirés sur ' + oldMember.user.username + ': ' + removedRoles.map(role => role.name).join(', '))
    }
})
client.login(token);

client.once('ready', () => {
    client.user.setActivity('Les gens', {type: 'WATCHING'});
})
async function channelTrigger(oldMember,Newmember,id){
    let guildName = (id) => {
        switch(id){
            case 1 : return "dark";
            case 2 : return "light";
            case 3 : return "wilda";
        }
    };
    const categoryParent = await findCategory(Newmember.guild,guildName(id));
    let ifExistChannel = await checkIfChannelExist(oldMember)
    if(ifExistChannel !== false){
        await editChannelStuff(ifExistChannel,categoryParent);
    }else{
        await createChannelStuff(Newmember,categoryParent);
    }
}
async function createChannelStuff(member,categoryParent){
    const channel = await member.guild.channels.create(member.user.username, {
    type: 'GUILD_TEXT',
    parent: categoryParent,
    permissionOverwrites: [
            {
                id: member.guild.roles.everyone,
                deny: [Permissions.FLAGS.VIEW_CHANNEL,Permissions.FLAGS.SEND_MESSAGES],
            },
            {
                id: member.id,
                allow: [Permissions.FLAGS.VIEW_CHANNEL,Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.MANAGE_CHANNELS],
            },
            {
                id: "858044765715169348",
                allow: [Permissions.ALL]
            },
        ],
    });
    channel.send({content : "Ton channel personnalisé a été créé !" + `<@${member.id}>`})
}
async function checkIfChannelExist(member){
    let chan = await member.guild.channels.cache.find(channel => channel.name === member.user.username)
    return chan === undefined ? false : chan 
}

async function editChannelStuff(channelExist,categoryParent){
    channelExist.setParent(categoryParent);
    channelExist.send({content : "Ton channel personnalisé a été déplacé dans ta nouvelle guilde !"})
}
async function findCategory(guild,guildName){
    let categoryId;
    switch(guildName){
        case "dark" :  categoryId = "832683310869250048";break;
        case "light" : categoryId = "901526849459470397";break;
        case "wilda" : categoryId = "901527344089559060";break;
    }
    return guild.channels.cache.find(cat => cat.id === categoryId);
}