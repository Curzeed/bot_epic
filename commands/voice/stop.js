const {SlashCommandBuilder} = require('@discordjs/builders');
 
module.exports = {
 
    data : new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Arrête la musique'),
 
    async execute (interaction,client) {
        if(!interaction.member.voice.channel) return interaction.reply({content : 'Vous devez être dans un salon vocal pour utiliser cette commande', ephemeral : true})
        const queue = client.player.getQueue(interaction.guild)
        if(!queue) return interaction.reply({content : 'Il n\'y a pas de musique en cours de lecture', ephemeral : true})
        queue.stop();
        await interaction.reply({content : 'La musique a été arrêtée'})
    }
}