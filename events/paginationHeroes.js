const dbFunc = require('../database/dbFunctions')
const {MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton} = require("discord.js");
const MAX_HEROES = async () => {return await dbFunc.getHeroCount()};

module.exports = async function (client,interaction,type) {
    try{
        const MENU = await interaction.message.resolveComponent('select_hero');
        var index = Number(MENU.options[0].value.split('_')[1]);
        if(type === 'next'){
            index = index + 25;
        }
        if(type === 'previous'){
            if(index !== 0){
                index -= 25;
            }
        }
        const max_heroes = await MAX_HEROES();
        if(index > max_heroes){
            return;
        }
        if(index < 0){
            index = 0;
        }
        const heroes = await dbFunc.getHeroes(index);
        const choices = heroes.map(hero => {
            return { label: hero.name,value: hero.name + '_' + index };
        });
        const pages = Math.ceil(max_heroes / 25);
        const page = Math.ceil(index / 25) + 1;
        const currentPage = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Liste des héros')
            .setDescription('Sélectionnez un héros')
            .setFooter(`Page ${page}/${pages}`)
            .setTimestamp()
            ;
        const selectMenuRow = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                .setCustomId('select_hero')
                .setPlaceholder('Sélectionnez un héros')
                .addOptions(choices)
            );
        const paginationRow = new MessageActionRow()
            .addComponents(
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
            );
        return await interaction.update({embeds : [currentPage] ,components: [selectMenuRow,paginationRow] });

    }catch(e){
        console.error(e)
        await interaction.reply({ content: 'Une erreur est survenue lors de la modification du message.', ephemeral: true });
    }
}