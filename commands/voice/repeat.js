const {SlashCommandBuilder} = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js') 
module.exports = {
 
    data : new SlashCommandBuilder()
    .setName('repeat')
    .setDescription('Répète la musique actuelle')
    .addStringOption( opt => opt.setDescription('Queue ou song').setName('type').addChoices([["File d'attente", 'queue'],['Musique actuelle', 'song']]).setRequired(true)),
 
    async execute (interaction,client) {
        const type = interaction.options.getString('type')
        if(!interaction.member.voice.channel) return interaction.reply({content : 'Vous devez être dans un salon vocal pour utiliser cette commande', ephemeral : true})
        const queue = client.player.getQueue(interaction.guild)
        if(!queue) return interaction.reply({content : 'Il n\'y a pas de musique en cours de lecture', ephemeral : true})
        

        if(type === 'queue'){
            if(queue.repeatMode === 1){
                queue.setRepeatMode(0)
                await interaction.reply({content : 'La queue n\'est plus répétée'})
            } else {
                queue.setRepeatMode(1)
                await interaction.reply({content : 'La queue est désormais répétée'})
            }
        } else if(type === 'song'){
            if(queue.repeatMode === 2){
                queue.setRepeatMode(0)
                await interaction.reply({content : 'La musique n\'est plus répétée'})
            } else {
                queue.setRepeatMode(2)
                await interaction.reply({content : 'La musique est désormais répétée'})
            }
        } else {
            await interaction.reply({content : 'Vous devez spécifier un type (queue ou song)', ephemeral : true})
        }
    }
}