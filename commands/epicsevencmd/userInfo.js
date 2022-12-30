const {SlashCommandBuilder} = require('@discordjs/builders');
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uinfo')
        .setDescription('Replies with user infos')
        .addStringOption(opt => opt.setName('member').setDescription('membre').setRequired(false)),

    async execute(interaction) {
        interaction.reply('oui')
    }
}
