const {SlashCommandBuilder} = require('@discordjs/builders');
const {MessageFlags} = require('discord.js');
const dbFunctions = require('../../database/dbFunctions');
const heroData = require('../../herodata.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sync')
        .setDescription('Synchronise les héros depuis herodata.json (Fribbels)'),

    async execute(interaction) {
        if (!dbFunctions.isAdmin(interaction.member)) {
            return dbFunctions.isNotAdmin(interaction);
        }
        await interaction.deferReply({flags: MessageFlags.Ephemeral});
        let count = 0;
        try {
            for (const key of Object.keys(heroData)) {
                const hero = heroData[key];
                if (!hero?.name || !hero?.assets?.thumbnail) continue;
                dbFunctions.insertHeroesDb(
                    hero.assets.thumbnail,
                    hero.rarity,
                    hero.attribute,
                    hero.name,
                    hero.code,
                );
                count++;
            }
            await interaction.editReply(
                `Sync terminé : ${count} héros (images/stats). Les liens de guide Discord (message_link) ne viennent pas de ce fichier.`,
            );
        } catch (error) {
            console.error(error);
            await interaction.editReply(`Erreur sync : ${error.message}`);
        }
    },
};
