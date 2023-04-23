const {SlashCommandBuilder} = require('@discordjs/builders');
 
module.exports = {
 
    data : new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Lance une pièce'),
 
    async execute (interaction) {
        let rdmInt  = Math.floor(Math.random() * 2) + 1;
        let answer;
        switch(rdmInt){
            case 1 : answer = "Pile !" ;break;
            case 2 : answer = "Face !" ;break;
            default : answer = "Tranche" ;break;
        }
        await interaction.reply({content : answer})
    }
}