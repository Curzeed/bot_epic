const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = async function (client,interaction) {
    await interaction.deferReply({ephemeral: true});
    const category = interaction.guild.channels.cache.find(c => c.name == "🔖 Ticket 🔖" && c.type == "GUILD_CATEGORY");
    if (!category) return interaction.followUp({content: "La catégorie des tickets n'existe pas !", ephemeral: true});
    const channel = await interaction.guild.channels.create(`ticket-${interaction.user.username}`, {
        type: 'GUILD_TEXT',
        parent: category,
        permissionOverwrites: [
            {
                id: interaction.guild.roles.everyone,
                deny: ['VIEW_CHANNEL'],
            },
            {
                id: interaction.user.id,
                allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
            },
        ],
    });
    const embed = new MessageEmbed()
        .setColor("#800303")
        .setTitle("Ticket")
        .setDescription("Votre ticket a été créé avec succès !")
        .setTimestamp()
        .setFooter("Ticket créé par " + interaction.user.username);
        
    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('ticket_close')
                .setLabel('Fermer le ticket')
                .setStyle('DANGER')
                .setEmoji('🔒')
        );
    interaction.editReply({content : "Votre ticket a été créé avec succès !", ephemeral : true});
    return await channel.send({embeds : [embed], components : [row], content : `<@${interaction.user.id}>`});    
}