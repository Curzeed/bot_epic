const {SlashCommandBuilder} = require('@discordjs/builders');
const dbFunctions = require('../../database/dbFunctions')
const {MessageEmbed} = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('uinfo')
        .setDescription('Replies with user infos')
        .addMentionableOption(opt => opt.setName('member').setDescription('membre').setRequired(false)),

    async execute(interaction) {
        const member = interaction.options.getMentionable('member').user.username.toLowerCase();
        if (member) {
            const user = await dbFunctions.getuser(member);
            const guild = () => {
                switch (user.guild) {
                    case 1:
                        return 'Dark';
                    case 2:
                        return 'Light';
                    case 3:
                        return 'Wilda';
                    default:
                        return 'Aucune';
                }
            }
            if (user) {
                const embed = new MessageEmbed()
                    .setTitle(`Informations de ${user.username}`)
                    .setColor('#0099ff')
                    .addFields(
                        {name: 'warns', value: user.warns, inline: true},
                        {name: 'guild', value: guild(), inline: true},
                    )
            }
        }
    }
}

