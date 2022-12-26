const {SlashCommandBuilder} = require('@discordjs/builders');
const {MessageEmbed} = require("discord.js");
const firstPlace ="🥇 ";
const secondPlace = "🥈 ";
const thirdPlace = "🥉 ";
const dbFunctions = require('../../database')
function strUcFirst(a){return (a+'').charAt(0).toUpperCase()+a.substr(1);}

module.exports ={
    data: new SlashCommandBuilder()
        .setName('ladder')
        .setDescription("Afficher le classement de la guilde")
        .addStringOption(option => option.setName('guilde').setDescription('Guilde du membre').addChoices([['Dark', "1"], ["Light", "2"], ['Wilda', '3']]).setRequired(true)),
        async execute(interaction){      
            let resGuilde = dbFunctions.getGuilds(Number(interaction.options.getString('guilde')));
                try {
                    dbFunctions.getAllMembersFromGuild(Number(interaction.options.getString('guilde')), (members) => {
                        const embed = new MessageEmbed()
                        .setImage("https://wesportfr.com/wp-content/uploads/2021/03/HoF2021.jpg")
                        .setTitle('Classement de ' + resGuilde)
                        .setDescription('Classements des membres en fonction de leur résultats en GW');
                        for (i =0; i< members.length; i++){
                            if (members[i].id === members[0].id){
                                embed.addField(firstPlace+strUcFirst(members[i].name), members[i].score.toString())
                            }
                            else if(members[i].id === members[1].id){
                                embed.addField(secondPlace+strUcFirst(members[i].name), members[i].score.toString())
                            }
                            else if(members[i].id === members[2].id){
                                embed.addField(thirdPlace+strUcFirst(members[i].name), members[i].score.toString())
                            }
                            else{
                                embed.addField([i+1]+". "+strUcFirst(members[i].name), members[i].score.toString())
                            }
                        }
                        interaction.reply({embeds: [embed]});
                    })
                }
                catch (error) {
                    interaction.reply('Une erreur est survenue ! Contactez Curze#0009')
                    console.error(error.stack)
                }
    }
}