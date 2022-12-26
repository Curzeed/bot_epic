const {SlashCommandBuilder} = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const dbFunctions  = require('../../database')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replieses with Pong ! ')
        .addChannelOption(opt => opt.setName('channel').setDescription('channel').setRequired(true))
        .addStringOption(opt => opt.setName('users').setDescription('users').setRequired(true))
        .addStringOption(opt => opt.setName('text').setDescription('Message envoyé à la suite des pings').setRequired(false)),
    async execute(interaction) {
        if(dbFunctions.isAdmin(interaction.member)){
            const users = interaction.options.getString('users')
            const channel = interaction.options.getChannel('channel')
            const text = interaction.options.getString('text')
            let embed = new MessageEmbed()
            .setTimestamp()
            .setColor('RED')
            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL({format : 'png'}))
            .setTitle('Rappel GW ')
            .setDescription( text ? text : `Bonsoir, n'oubliez pas de faire vos gw ainsi que vos attaques restantes ! \n Bon courage à tous !`)
            .setImage('https://epic7x.com/wp-content/uploads/2019/01/guild-wars-1.png');       
            channel.send({
                content : `||${users}||`,
                embeds : [embed]
            })
            await interaction.reply(`Le message a bien été envoyé dans le channel : ${channel}`)
        }else{
            dbFunctions.isNotAdmin(interaction);
        }
    },
};