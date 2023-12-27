const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const dbFunctions = require('../../database/dbFunctions')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replieses with Pong ! ')
        .addStringOption(opt => opt.setName('users').setDescription('users').setRequired(true))
        .addStringOption(opt => opt.setName('text').setDescription('Message envoyé à la suite des pings').setRequired(false)),
    async execute(interaction, client) {
        if (dbFunctions.isAdmin(interaction.member)) {
            await interaction.deferReply();
            const users = interaction.options.getString('users')
            const text = interaction.options.getString('text')
//            let embed = new MessageEmbed()
//                .setTimestamp()
//                .setColor('RED')
//                .setAuthor(interaction.user.globalName, interaction.user.displayAvatarURL({ format: 'png' }))
//                .setTitle('Rappel GW ')
//                .setDescription(text ? text : `Bonsoir, n'oubliez pas de faire vos gw ainsi que vos attaques restantes ! \n Bon courage à tous !`)
//                .setImage('https://cdn.discordapp.com/attachments/1046429356332949514/1059149153835421816/4.png');

            let embedDm = new MessageEmbed()
                .setTimestamp()
                .setColor('RED')
                .setAuthor(interaction.user.globalName, interaction.user.displayAvatarURL({ format: 'png' }))
                .setTitle('Rappel GW ')
                .setDescription(text ? text : `Bonsoir, n'oublies pas de faire tes gw ainsi que tes attaques restantes ! \n Bon courage à toi !`)
                .setImage('https://cdn.discordapp.com/attachments/1046429356332949514/1059149153835421816/4.png');
            users.split('>').filter(user => user !== '').forEach(async (use) => {
                let userId = use.trim().replace('<@', '')
                let user = await client.users.fetch(userId)
                await user.send({ content: "Hello l'ami ! Il te reste une ou plusieurs attaques, n'oublies pas de la/les finir !", embeds: [embedDm] })
            })
            await interaction.editReply({
                content: `Le message a bien été envoyé aux gueux !  : ${users}`,
                ephemeral: true
            })
        } else {
            dbFunctions.isNotAdmin(interaction);
        }
    },
};