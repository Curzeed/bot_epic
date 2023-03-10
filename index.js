// Require the necessary discord.js classes
const { Client, Intents, Collection, MessageEmbed, MessageReaction } = require('discord.js');
const { token } = require('./config.json');
const fs = require('fs');
const ranking = require('./events/ranking');
const dbFunc = require('./database/dbFunctions')
const cronTask = require('./events/cronTask')
const hash = require('object-hash')
// Create a new client instance
const client = new Client({ 
intents: 
	[
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS
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
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;
	try {
		await command.execute(interaction,client);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'Une erreur a été détectée lors de la commande', ephemeral: true });
	}
});
client.on('messageCreate', async (message) => {
	ranking(client,message)
	if(message.content.toLowerCase().endsWith('quoi') || message.content.toLowerCase().endsWith('quoi ?')){
		const ayy = client.emojis.cache.find(emoji => emoji.name === "EmoteAWaed");
		message.reply(`Feur ! ${ayy}`);
	}
	if(message.content.toLocaleLowerCase().endsWith("zia")){
		message.reply('Oui ?')
	}
})
client.on('guildMemberAdd', async (member) =>  {
	// Channel arrivée
	const channel = client.channels.cache.get('1051557258363945001');
	const role = member.guild.roles.cache.find(role => role.name === "En cours d'adhésion");
	const emoteOrbis = client.emojis.cache.find(emoji => emoji.name === "orbis");
	const emoteRoana = client.emojis.cache.find(emoji => emoji.name === "roa_yay");
	const embed = new MessageEmbed()
	embed.setThumbnail('https://cdn-longterm.mee6.xyz/plugins/welcome/images/765197397860024350/184b2cd1ff10af51ea51aa0e493410467cc1b47f74172ccf3f6b70a27a21b39f.png')
	let text= `Hey ${member}, Bienvenue dans la communauté DLW !${emoteRoana} \n \n ${emoteOrbis}N'hésites pas à te présenter et à nous annoncer la raison de ta venue... \n \n ${emoteOrbis}Nos modos te donneront accès au serveur ensuite !`
	embed.setDescription(text)
	embed.setColor('DARK_BLUE');
	member.roles.add(role);
	channel.send({embeds : [embed]})
})

client.on('messageReactionAdd', async (reaction, user) => {
	if (user.bot){ return ;}
	var msgReacDb
	console.log(reaction.emoji.name)
	var msgReaction
	if (reaction.partial){
		let oldMessage = await reaction.fetch()
		msgReaction = oldMessage.message.id
	}else{
		msgReaction = reaction.message.id
	}
	dbFunc.getMessageReaction(msgReaction, (msgs_reac) => {
		if(!msgs_reac){return}
		msgs_reac.forEach((msgReac) => {
			msgReacDb = {
				role : msgReac.role_name,
				id : Number(msgReac.id),
				emoji_name : msgReac.emoji
			}
			if(msgReacDb.emoji_name == hash(reaction.emoji.name)){
				const guild = reaction.message.guild;
				const member = guild.members.cache.get(user.id);
				const role = guild.roles.cache.find(r => r.name === msgReacDb.role);
				if(member.roles.cache.find(r => r.name === role.name)){return}
				member.roles.add(role);
				member.createDM().then( dmMessage => {
					dmMessage.send({content : "Je t'ai ajouté le rôle : " + role.name})
				})
			}
		})
	})
})

client.on('messageReactionRemove', async (reaction, user) => {
	if (user.bot){ return ;}
	var msgReacDb
	var msgReaction
	if (reaction.partial){
		let oldMessage = await reaction.fetch()
		msgReaction = oldMessage.message.id
	}else{
		msgReaction = reaction.message.id
	}
	dbFunc.getMessageReaction(msgReaction, async (msgs_reac) => {
		if(!msgs_reac){return}
		msgs_reac.forEach(async (msg_reac) => {
			msgReacDb = {
				role : msg_reac.role_name,
				id : Number(msg_reac.id),
				emoji_name : msg_reac.emoji
			}
			if(msgReacDb.emoji_name == hash(reaction.emoji.name)){
				const guild = reaction.message.guild;
				const member = guild.members.cache.get(user.id);
				const role = guild.roles.cache.find(role => role.name === msgReacDb.role);
				if(!member.roles.cache.find(r => r.name === role.name)){return}
				let nwMember = await member.roles.remove(role);
				nwMember.createDM().then( dmMessage => {
					dmMessage.send({content : "Je t'ai retiré le rôle : " + role.name})
				})
			}
		})
	})	
})

client.login(token);

client.once('ready',() => {
	client.user.setActivity('', {type: ''});
})
