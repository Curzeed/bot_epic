const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    ChannelType,
    PermissionFlagsBits,
    MessageFlags,
} = require('discord.js');

module.exports = async function (client, interaction) {
    await interaction.deferReply({flags: MessageFlags.Ephemeral});
    const category = interaction.guild.channels.cache.find(
        c => c.name === '🔖 Ticket 🔖' && c.type === ChannelType.GuildCategory,
    );
    if (!category) {
        return interaction.followUp({
            content: 'La catégorie des tickets n\'existe pas !',
            flags: MessageFlags.Ephemeral,
        });
    }
    const roleMod = '858044765715169348';
    const channel = await interaction.guild.channels.create({
        name: `ticket-${interaction.user.username}`,
        type: ChannelType.GuildText,
        parent: category.id,
        permissionOverwrites: [
            {
                id: interaction.guild.id,
                deny: [PermissionFlagsBits.ViewChannel],
            },
            {
                id: interaction.user.id,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
            },
            {
                id: roleMod,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
            },
        ],
    });
    const embed = new EmbedBuilder()
        .setColor(0x800303)
        .setTitle('Ticket')
        .setDescription('Votre ticket a été créé avec succès !')
        .setTimestamp()
        .setFooter({text: 'Ticket créé par ' + interaction.user.username});

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('ticket_close')
            .setLabel('Fermer le ticket')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🔒'),
    );
    await interaction.editReply({
        content: 'Votre ticket a été créé avec succès !',
        flags: MessageFlags.Ephemeral,
    });
    return channel.send({embeds: [embed], components: [row], content: `<@${interaction.user.id}>`});
};
