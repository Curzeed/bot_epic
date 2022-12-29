const {SlashCommandBuilder} = require('@discordjs/builders');
const dbFunctions = require('../../database')
module.exports = {
 
    data : new SlashCommandBuilder()
    .setName('birthday')
    .setDescription('birthday')
    .addStringOption(opt => opt.setName('birthday').setRequired(true).setDescription('yyyy-mm-jj (1999-07-27)')),
 
    async execute (interaction) {
        let birthday = Date.parse(interaction.options.getString('birthday').toLowerCase().trim())
        console.log(birthday)
        if(isNaN(birthday)){
            return interaction.reply({content : "Le format de date n'est pas bon ! \n Voici un exemple : 2000-12-28 (yyyy-mm-jj)", ephemeral : true})
        }
        const user = interaction.user.id
        await dbFunctions.addBirthday(user, birthday)
        let birthdayRet = new Date(birthday)
        return interaction.reply(`Votre anniversaire a bien été ajouté au : ${birthdayRet.getDate()} / ${birthdayRet.getMonth() + 1} / ${birthdayRet.getFullYear()}`)
    }
}