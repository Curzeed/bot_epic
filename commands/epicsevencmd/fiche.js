const {SlashCommandBuilder} = require('@discordjs/builders');
const {buildHeroEmbed} = require('../../events/heroEmbed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fiche')
        .setDescription('Fiche détaillée (stats Fribbels + guide)')
        .addStringOption(o =>
            o.setName('heros').setDescription('Nom du héros').setAutocomplete(true).setRequired(true),
        ),

    async execute(interaction, client) {
        const name = interaction.options.getString('heros');
        const herodata = require('../../utils/herodataService');
        if (!herodata.findByName(name)) {
            return interaction.reply({content: `« ${name} » introuvable dans herodata.json.`, ephemeral: true});
        }
        const embed = await buildHeroEmbed(client, name);
        await interaction.reply({embeds: [embed]});
    },
};
