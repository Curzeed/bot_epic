const {SlashCommandBuilder} = require('@discordjs/builders');
 
module.exports = {
 
    data : new SlashCommandBuilder()
    .setName('playlist')
    .setDescription('Affiche la playlist'),
 
    async execute (interaction) {
        const queue = interaction.client.player.getQueue(interaction.guild)
        if(!queue) return interaction.reply({content : 'Il n\'y a pas de musique en cours de lecture', ephemeral : true})
        if(queue.songs.length === 1) return interaction.reply({content : 'Il n\'y a pas de musique suivante', ephemeral : true})
        
        const embed = new messageEmbed({
            color : '#0099ff',
            title : 'Playlist',
            fields : [
                {
                    name : 'Musique actuelle',
                    value : queue.songs[0].name
                },
                {
                    name : 'Musiques suivantes',
                    value : queue.songs.slice(1).map((song,index) => `${index + 1} - ${song.name}`).join('\n')
                }
            ]
        })
        await interaction.reply({embeds : [embed]})
    }
}