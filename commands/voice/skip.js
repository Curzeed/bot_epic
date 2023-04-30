const {SlashCommandBuilder} = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js') 
module.exports = {
 
    data : new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip la musique actuelle'),
 
    async execute (interaction,client) {
        if(!interaction.member.voice.channel) return interaction.reply({content : 'Vous devez être dans un salon vocal pour utiliser cette commande', ephemeral : true})
        const queue = client.player.getQueue(interaction.guild)
        if(!queue) return interaction.reply({content : 'Il n\'y a pas de musique en cours de lecture', ephemeral : true})
        console.log(queue)
        queue.skip();
        if(queue.repeatMode === 2){
            return await interaction.reply({content : 'La musique est répétée, skip la musique ne sert à rien', ephemeral : true})
        }
        if(!queue.songs[1]) return interaction.reply({content : 'Il n\'y a pas de musique suivante', ephemeral : true})
        const embed = new MessageEmbed({
        color : '#0099ff',
        title :`**${queue.songs[1].name}**`,
        thumbnail : {
        url : queue.songs[1].thumbnail
        },
        url : queue.songs[1].url,
        fields : [
        {
            name : String('Durée'),
            value : String(queue.songs[1].duration)
        },
        {
            name : 'Demandé par',
            value : interaction.user.username
        },
    ]
    });
        await interaction.reply({embeds : [embed]})
    }
}