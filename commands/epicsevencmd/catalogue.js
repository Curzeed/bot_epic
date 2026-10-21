const {SlashCommandBuilder} = require('@discordjs/builders');
const {EmbedBuilder} = require('discord.js');
const herodata = require('../../utils/herodataService');
const {ELEMENT_FR, ROLE_FR} = require('../../utils/herodataService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('catalogue')
        .setDescription('Liste les héros par filtre (herodata Fribbels)')
        .addStringOption(o =>
            o.setName('element').setDescription('Élément').setRequired(false).addChoices(
                {name: 'Feu', value: 'fire'},
                {name: 'Glace', value: 'ice'},
                {name: 'Vent', value: 'wind'},
                {name: 'Lumière', value: 'light'},
                {name: 'Ténèbres', value: 'dark'},
            ),
        )
        .addIntegerOption(o =>
            o.setName('rarete').setDescription('Nombre d\'étoiles').setRequired(false).addChoices(
                {name: '5★', value: 5},
                {name: '4★', value: 4},
                {name: '3★', value: 3},
            ),
        )
        .addStringOption(o =>
            o.setName('classe').setDescription('Rôle').setRequired(false).addChoices(
                {name: 'Guerrier', value: 'warrior'},
                {name: 'Chevalier', value: 'knight'},
                {name: 'Mage', value: 'mage'},
                {name: 'Ranger', value: 'ranger'},
                {name: 'Soigneur', value: 'soul_weaver'},
                {name: 'Assassin', value: 'assassin'},
            ),
        ),

    async execute(interaction) {
        const element = interaction.options.getString('element');
        const rarity = interaction.options.getInteger('rarete');
        const role = interaction.options.getString('classe');

        if (!element && !rarity && !role) {
            return interaction.reply({
                content: 'Choisis au moins un filtre (élément, rareté ou classe).',
                ephemeral: true,
            });
        }

        const list = herodata
            .filterHeroes({element, rarity, role})
            .map(h => h.name)
            .sort((a, b) => a.localeCompare(b, 'fr'));

        if (!list.length) {
            return interaction.reply({content: 'Aucun héros pour ces filtres.', ephemeral: true});
        }

        const labels = [];
        if (element) labels.push(ELEMENT_FR[element] ?? element);
        if (rarity) labels.push(`${rarity}★`);
        if (role) labels.push(ROLE_FR[role] ?? role);

        const maxInEmbed = 60;
        const shown = list.slice(0, maxInEmbed);
        const rest = list.length - shown.length;

        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(`Catalogue — ${labels.join(' · ')}`)
            .setDescription(`**${list.length}** héros\n\n${shown.join(' · ')}${rest > 0 ? `\n\n*… et ${rest} autres (affine avec /heroes).*` : ''}`)
            .setFooter({text: 'Source: herodata.json (Fribbels)'});

        await interaction.reply({embeds: [embed]});
    },
};
