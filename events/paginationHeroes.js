const dbFunc = require('../database/dbFunctions');
const {
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    ButtonBuilder,
    ButtonStyle,
    MessageFlags,
} = require('discord.js');

const MAX_HEROES = async () => dbFunc.getHeroCount();

module.exports = async function (client, interaction, type) {
    try {
        const menu = interaction.message.components[0]?.components[0];
        let index = 0;
        if (menu?.options?.[0]?.value) {
            index = Number(menu.options[0].value.split('_')[1]);
        }
        if (type === 'next') {
            index += 25;
        }
        if (type === 'previous' && index !== 0) {
            index -= 25;
        }
        const max_heroes = await MAX_HEROES();
        if (index > max_heroes) {
            return;
        }
        if (index < 0) {
            index = 0;
        }
        const heroes = await dbFunc.getHeroes(index);
        const choices = heroes.map(hero => ({label: hero.name, value: hero.name + '_' + index}));
        const pages = Math.ceil(max_heroes / 25);
        const page = Math.ceil(index / 25) + 1;
        const currentPage = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('Liste des héros')
            .setDescription('Sélectionnez un héros')
            .setFooter({text: `Page ${page}/${pages}`})
            .setTimestamp();
        const selectMenuRow = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('select_hero')
                .setPlaceholder('Sélectionnez un héros')
                .addOptions(choices),
        );
        const paginationRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('previous')
                .setLabel('\u200B')
                .setStyle(ButtonStyle.Primary)
                .setEmoji('⬅️'),
            new ButtonBuilder()
                .setCustomId('next')
                .setLabel('\u200B')
                .setStyle(ButtonStyle.Primary)
                .setEmoji('➡️'),
        );
        return await interaction.update({embeds: [currentPage], components: [selectMenuRow, paginationRow]});
    } catch (e) {
        console.error(e);
        await interaction.reply({
            content: 'Une erreur est survenue lors de la modification du message.',
            flags: MessageFlags.Ephemeral,
        });
    }
};
