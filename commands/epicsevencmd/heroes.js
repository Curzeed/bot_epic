const {SlashCommandBuilder} = require('@discordjs/builders');
const dbFunctions = require('../../database/dbFunctions')
const {MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton} = require("discord.js");
const MAX_HEROES = async () => {return await dbFunctions.getHeroCount()};

module.exports = {
    data : new SlashCommandBuilder()
        .setName('heroes')
        .setDescription('Affiche une liste d\'héros'),
    async execute (interaction,client) {
        // Récupère la liste des héros depuis la base de données
        const max_heroes = await MAX_HEROES();
        var index = 0;
        const heroes = await dbFunctions.getHeroes(0);
        // Crée le tableau de choix pour le menu déroulant
        const choices = heroes.map(hero => {
            return { label: hero.name,value: hero.name + '_' + index };
        });
        //await interaction.deferReply();
        // Crée le message d'embed 
        const currentPage = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Liste des héros')
            .setDescription('Sélectionnez un héros')
            .setFooter(`Page 1/${Math.ceil(max_heroes / 25)}`)
            .setTimestamp()
            ;

        // Crée les boutons de pagination
        const selectMenuRow = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                .setCustomId('select_hero')
                .setPlaceholder('Sélectionnez un héros')
                .addOptions(choices)
            );
        const paginationRow = new MessageActionRow({
            components: [
                new MessageButton()
                    .setCustomId('previous')
                    .setLabel('\u200B')
                    .setStyle('PRIMARY')
                    .setEmoji('⬅️')
                    ,
                new MessageButton()
                    .setCustomId('next')
                    .setLabel('\u200B')
                    .setStyle('PRIMARY')
                    .setEmoji('➡️') 
            ],
        }       
        );
        // Envoie le message avec le menu déroulant et les boutons de pagination
        await interaction.reply({embeds : [currentPage],components: [selectMenuRow,paginationRow] });
        }
    
}