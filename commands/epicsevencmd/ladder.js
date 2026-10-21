const {SlashCommandBuilder} = require('@discordjs/builders');
const {EmbedBuilder} = require('discord.js');
const firstPlace = "🥇 ";
const secondPlace = "🥈 ";
const thirdPlace = "🥉 ";
const dbFunctions = require('../../database/dbFunctions')

function strUcFirst(a) {
    return (a + '').charAt(0).toUpperCase() + a.substr(1);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ladder')
        .setDescription("Afficher le classement de la guilde")
        .addStringOption(option => option.setName('guilde').setDescription('Guilde du membre').addChoices({
            name: 'Dark',
            value: '1'
        }, {name: 'Light', value: '2'}, {name: 'Wilda', value: '3'}).setRequired(true)),
    async execute(interaction) {
        let resGuilde = dbFunctions.getGuilds(Number(interaction.options.getString('guilde')));
        try {
            dbFunctions.getAllMembersFromGuild(Number(interaction.options.getString('guilde')), (members) => {
                const embed = new EmbedBuilder()
                    .setTitle('Classement de ' + resGuilde)
                    .setDescription('Classements des membres en fonction de leur résultats en GW');
                for (let i = 0; i < members.length; i++) {
                    const score = members[i].score.toString();
                    if (members[i].id === members[0].id) {
                        embed.addFields({name: firstPlace + strUcFirst(members[i].name), value: score});
                    } else if (members[i].id === members[1].id) {
                        embed.addFields({name: secondPlace + strUcFirst(members[i].name), value: score});
                    } else if (members[i].id === members[2].id) {
                        embed.addFields({name: thirdPlace + strUcFirst(members[i].name), value: score});
                    } else {
                        embed.addFields({name: [i + 1] + '. ' + strUcFirst(members[i].name), value: score});
                    }
                }
                switch (resGuilde) {
                    case 'Dark':
                        embed.setImage('https://cdn.discordapp.com/attachments/1046429356332949514/1059149152824594453/1.png');
                        break;
                    case 'Light':
                        embed.setImage('https://cdn.discordapp.com/attachments/1046429356332949514/1059149153143378061/2.png');
                        break;
                    case 'Wilda' :
                        embed.setImage('https://cdn.discordapp.com/attachments/1046429356332949514/1059149153457938512/3.png');
                        break;
                }
                return interaction.reply({embeds: [embed]});
            })
        } catch (error) {
            interaction.reply('Une erreur est survenue ! Contactez Curze#0009')
            console.error(error.stack)
        }
    }
}