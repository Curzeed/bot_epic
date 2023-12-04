const {SlashCommandBuilder} = require('@discordjs/builders');
const db = require('../../database/dbFunctions')
const canva = require('canvacord')
const {MessageAttachment} = require('discord.js')

function strUcFirst(a) {
    return (a + '').charAt(0).toUpperCase() + a.substr(1);
}

module.exports = {

    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('display rank card')
        .addMentionableOption(option => option.setName('utilisateur').setDescription("Donne le rang d'un utilisateur").setRequired(false)),

    async execute(interaction) {
        var user;
        if (interaction.options.getMentionable('utilisateur')) {
            user = interaction.options.getMentionable('utilisateur').user
        } else {
            user = interaction.user
        }
        db.singleRank(user.id, (userDb) => {
            const background = 'https://cdn.discordapp.com/attachments/1050435795481268345/1057025878326001704/IMG_20221226_210314.jpg'
            const rankCard = new canva.Rank()
                .setAvatar(user.displayAvatarURL({format: "png", size: 1024}))
                .setCurrentXP(Number(userDb.currentXp))
                .setRequiredXP(Number(userDb.xpNeeded))
                .setProgressBar("#FFFFFF", "COLOR")
                .setUsername(strUcFirst(user.username))
                .setStatus("online")
                .setLevel(Number(userDb.level))
                .setBackground('IMAGE', background)
                .setDiscriminator(user.discriminator);
            db.getRank((users) => {
                const rank = users.map(x => x.id).indexOf(user.id) + 1
                rankCard.setRank(rank)
            })
            const img = rankCard.build().then(
                data => {
                    const attachement = new MessageAttachment(data, "RankCard.png")
                    interaction.reply({files: [attachement]})
                })
        })
    }
}