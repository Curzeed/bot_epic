const {SlashCommandBuilder} = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js')
module.exports = {
 
    data : new SlashCommandBuilder()
    .setName('play')
    .setDescription('Joue une musique')
    .addStringOption( opt => opt.setDescription('url de la musique ou nom de la musique').setName('music').setRequired(true))
    ,
 
    async execute(interaction, client) {
        const music = interaction.options.getString('music')
        if (!interaction.member.voice.channel) {
            return interaction.reply({
                content: 'Vous devez être dans un salon vocal pour utiliser cette commande',
                ephemeral: true
            })
        }
        if (!music) {
            return interaction.reply({
                content: 'Vous devez spécifier une musique',
                ephemeral: true
            })
        }
    
        let guildQueue = client.player.getQueue(interaction.guild)
        let queue = client.player.createQueue(interaction.guild)
    
        if (!guildQueue) {
            guildQueue = queue
        }
    
        if (music.includes('list=')) {
            await queue.join(interaction.member.voice.channel)
            song = await queue.playlist(music).catch(err => {
                console.log(err)
                return interaction.reply({
                    content: 'Une erreur est survenue lors de la lecture de la playlist',
                    ephemeral: true
                })
            })
        } else {
            await queue.join(interaction.member.voice.channel)
            song = await queue.play(music).catch(err => {
                console.log(err)
                return interaction.reply({
                    content: 'Une erreur est survenue lors de la lecture de la musique',
                    ephemeral: true
                })
            })
        }
    
        const embed = new MessageEmbed({
            color: '#0099ff',
            title: `**${song.name}**`,
            thumbnail: {
                url: song.thumbnail
            },
            url: song.url,
            fields: [
                {
                    name: 'Durée',
                    value: `${song.duration}`
                },
                {
                    name: 'Demandé par',
                    value: interaction.user.username
                }
            ]
        })
    
        await interaction.reply({ embeds: [embed] })
    }
}