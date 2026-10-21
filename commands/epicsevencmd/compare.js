const {SlashCommandBuilder} = require('@discordjs/builders');
const {EmbedBuilder} = require('discord.js');
const herodata = require('../../utils/herodataService');
const {elementEmoji} = require('../../utils/heroEmojis');
const {ELEMENT_FR, ROLE_FR, formatStatsBlock} = require('../../utils/herodataService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('compare')
        .setDescription('Compare les stats de deux héros (60★)')
        .addStringOption(o =>
            o.setName('heros_a').setDescription('Premier héros').setAutocomplete(true).setRequired(true),
        )
        .addStringOption(o =>
            o.setName('heros_b').setDescription('Second héros').setAutocomplete(true).setRequired(true),
        ),

    async execute(interaction, client) {
        const a = herodata.findByName(interaction.options.getString('heros_a'));
        const b = herodata.findByName(interaction.options.getString('heros_b'));
        if (!a || !b) {
            return interaction.reply({content: 'Un des héros est introuvable dans herodata.json.', ephemeral: true});
        }

        const sa = a.calculatedStatus?.lv60SixStarFullyAwakened;
        const sb = b.calculatedStatus?.lv60SixStarFullyAwakened;
        if (!sa || !sb) {
            return interaction.reply({content: 'Stats 60★ manquantes pour la comparaison.', ephemeral: true});
        }

        const diff = (va, vb, suffix = '') => {
            const d = va - vb;
            if (d === 0) return '`0`';
            const sign = d > 0 ? '+' : '';
            return `\`${sign}${d}${suffix}\``;
        };

        const embed = new EmbedBuilder()
            .setColor(0x5865f2)
            .setTitle(`${a.name} vs ${b.name}`)
            .setDescription('Base 60★ fully awakened (Fribbels)')
            .addFields(
                {
                    name: a.name,
                    value: [
                        elementEmoji(client, a.attribute) + ' ' + (ROLE_FR[a.role] ?? a.role),
                        formatStatsBlock(a),
                    ].join('\n'),
                    inline: true,
                },
                {
                    name: b.name,
                    value: [
                        elementEmoji(client, b.attribute) + ' ' + (ROLE_FR[b.role] ?? b.role),
                        formatStatsBlock(b),
                    ].join('\n'),
                    inline: true,
                },
                {
                    name: 'Δ (A − B)',
                    value: [
                        `CP ${diff(sa.cp, sb.cp)}`,
                        `ATK ${diff(sa.atk, sb.atk)} · HP ${diff(sa.hp, sb.hp)} · DEF ${diff(sa.def, sb.def)}`,
                        `VIT ${diff(sa.spd, sb.spd)} · TC ${diff(Math.round(sa.chc * 100), Math.round(sb.chc * 100))}%`,
                    ].join('\n'),
                    inline: false,
                },
            );

        await interaction.reply({embeds: [embed]});
    },
};
