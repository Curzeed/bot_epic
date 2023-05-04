const {SlashCommandBuilder} = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const dbFunctions  = require('../../database/dbFunctions')

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
            .setImage('https://cdn.discordapp.com/attachments/1046429356332949514/1059149153835421816/4.png');       
            channel.send({
                content : `||${users}||`,
                embeds : [embed]
            })
            await interaction.reply({content:`Le message a bien été envoyé dans le channel : ${channel}`, ephemeral: true})
        }else{
            dbFunctions.isNotAdmin(interaction);
        }
    },
};