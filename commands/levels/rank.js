const {SlashCommandBuilder} = require('@discordjs/builders');
const db = require('../../database')
const canva = require('canvacord')
const {MessageAttachment} = require('discord.js')
module.exports = {
 
    data : new SlashCommandBuilder()
    .setName('rank')
    .setDescription('display rank card')
    .addMentionableOption(option => option.setName('utilisateur').setDescription("Donne le rang d'un utilisateur").setRequired(false)),
 
    async execute (interaction) {
        var user;
        if(interaction.options.getMentionable('utilisateur')){
            user = interaction.options.getMentionable('utilisateur').user
        }else{
            user = interaction.user
        }
        db.singleRank(user.id,(userDb)=>{
            const background = 'https://cdn.discordapp.com/attachments/1050435795481268345/1053707653982994442/IMG_3780.png'
            const rankCard = new canva.Rank()
            .setAvatar(user.displayAvatarURL({format : "png", size : 1024}))   
            .setCurrentXP(Number(userDb.currentXp))
            .setRequiredXP(Number(userDb.xpNeeded))
            .setProgressBar("#FFFFFF", "COLOR")
            .setUsername(user.username)
            .setStatus("online")
            .setLevel(Number(userDb.level))
            .setRankColor('#800303')
            .setBackground('IMAGE', background)
            .setDiscriminator(user.discriminator);
            db.getRank((users)=>{
                const rank = users.map(x => x.id).indexOf(user.id)+1
                rankCard.setRank(rank)
            })
            const img =  rankCard.build().then(
                data => {
                    const attachement = new MessageAttachment(data,"RankCard.png")
                    interaction.reply({files : [attachement]})
                })
        })
    }
}