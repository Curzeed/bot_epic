const {SlashCommandBuilder} = require('@discordjs/builders');
const dbFunctions = require('../../database/dbFunctions'); 
const { createCanvas, loadImage, Canvas, Image } = require('@napi-rs/canvas');
const { MessageAttachment, MessageEmbed, MessageActionRow  } = require('discord.js');
const fs = require('fs');
const { readFile } = require('fs/promises');
const { request } = require('undici');
const embeds = []
module.exports = {
 
    data : new SlashCommandBuilder()
    .setName('defense')
    .setDescription('defense')
    .addStringOption(option => option.setName('char_1').setDescription('Premier personnage').setAutocomplete(true))
    .addStringOption(option => option.setName('char_2').setDescription('Deuxième personnage').setAutocomplete(true))
    .addStringOption(option => option.setName('char_3').setDescription('Troisième personnage').setAutocomplete(true)),
 
    async execute (interaction) {
        let char_1 = interaction.options.getString('char_1');
        let char_2 = interaction.options.getString('char_2');
        let char_3 = interaction.options.getString('char_3');
        let tabChars = [char_1, char_2, char_3]
        let tabCharsDef = []

        const embed = new MessageEmbed();
        const urlDef = "https://krivpfvxi0.execute-api.us-west-2.amazonaws.com/dev/getDef"
        for (let element of tabChars) {
            let elemFromDb = await dbFunctions.getHeroDbFromName(element)
            tabCharsDef.push(elemFromDb.code)
        }
        const dataSend = tabCharsDef.join(",");
        const response = await fetch(urlDef, {
            method: 'POST',
            body: dataSend,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        let arr = [];

        if(data.data == null) return interaction.reply({content : "Aucune données trouvées"})
        for (const [key, value] of Object.entries(data.data)) {
            arr.push({ids: key, stats: value});
        }
        arr.sort((a, b) => b.stats.w - a.stats.w);
        
        const top15 = arr.slice(0,6)
        for(let i = 0; i < top15.length; i++){
            let ids = arr[i].ids.split(",")
            var heroes = []
            for(let j = 0; j < ids.length; j++){
                const hero = await dbFunctions.getHeroDbFromCode(ids[j])
                heroes.push(hero)
            }
            const calcPercentage = ((top15[i].stats.w / (top15[i].stats.w + top15[i].stats.l)) * 100).toFixed(2);
            embed.setDescription('\u200B')
            embed.setTitle('Différentes offenses pour contrer  ' + '**'+ char_1 + '**'+', ' +'** '+ char_2 + '**'+ ' et ' + '**'+char_3+ '**')
            embed.setColor('#0099ff')
            embed.addFields(
                {name : i + 1 + '. ' +heroes[0].name, value : '\u200B', inline : true},
                {name : heroes[1].name, value : '\u200B', inline : true},
                {name : heroes[2].name, value : String(calcPercentage) +'%' + ' ('+top15[i].stats.w+"W/"+top15[i].stats.l+"L)", inline : true},
            )
            embed.addFields(
                {name : '\u200B', value : '\u200B', inline : false},
            )
        }
        await interaction.reply({embeds : [embed]});
    }
}