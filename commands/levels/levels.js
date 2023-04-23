const {SlashCommandBuilder} = require('@discordjs/builders');
const dbFunc = require('../../database/dbFunctions')
const {MessageEmbed} = require('discord.js')
const firstPlace ="🥇 ";
const secondPlace = "🥈 ";
const thirdPlace = "🥉 ";
function strUcFirst(a){return (a+'').charAt(0).toUpperCase()+a.substr(1);}
module.exports = {
    data : new SlashCommandBuilder()
    .setName('levels')
    .setDescription('Global classement'),
    
    async execute (interaction) {
        const embed = new MessageEmbed()
        .setImage("https://wesportfr.com/wp-content/uploads/2021/03/HoF2021.jpg")
        .setTitle('Classement du discord');
        if(interaction.user.bot) return;
        await dbFunc.getRank((users)=>{
            users.forEach((user, i)=>{
                    switch(i) {
                        case 0 : embed.addFields(
                            {name : firstPlace, value : strUcFirst(user.username), inline : true},
                            {name : "Niveau  ", value : user.level.toString(), inline : true},
                            {name : "xp  ", value : user.currentXp.toString() + "/" + user.xpNeeded.toString(), inline : true},
                            )
                        ;break;
                        case 1 : embed.addFields(
                            {name : secondPlace, value : strUcFirst(user.username), inline : true},
                            {name : "Niveau  ", value : user.level.toString(), inline : true},
                            {name : "xp  ", value : user.currentXp.toString() + "/" + user.xpNeeded.toString(), inline : true},
                            )
                        ;break;
                        case 2 : embed.addFields(
                            {name : thirdPlace , value : strUcFirst(user.username), inline : true},
                            {name : "Niveau  ", value : user.level.toString(), inline : true},
                            {name : "xp ", value : user.currentXp.toString() + "/" + user.xpNeeded.toString(), inline : true},
                            )
                        ;break;
                        default :embed.addFields(
                            {name : String(+i+1), value : strUcFirst(user.username), inline : true},
                            {name : "Niveau ", value : user.level.toString(), inline : true},
                            {name : "xp  ", value : user.currentXp.toString() + "/" + user.xpNeeded.toString(), inline : true},
                            )
                        ;break;
                    }
            })
            return interaction.reply({embeds : [embed]})
        })
        
    }
}