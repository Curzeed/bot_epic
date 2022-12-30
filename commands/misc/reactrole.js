const {SlashCommandBuilder} = require('@discordjs/builders');
const dbFunc = require('../../database/dbFunctions')
const hash = require('object-hash')
module.exports = {
 
    data : new SlashCommandBuilder()
    .setName('reactrole')
    .setDescription('reactrole')
    .addRoleOption( opt => opt.setDescription('role').setName('role').setRequired(true))
    .addChannelOption(opt => opt.setDescription('channel du message voulu').setName('channel').setRequired(true))
    .addStringOption( opt => opt.setDescription('id du message').setName('idmsg').setRequired(true))
    .addStringOption( opt => opt.setDescription('emoji').setName('emoji').setRequired(true))
    ,
 
    async execute (interaction) {
        const role = interaction.options.getRole('role')
        const channelResolvable = interaction.options.getChannel('channel')
        const msgId = interaction.options.getString('idmsg')
        const emoji = interaction.options.getString('emoji')
        try{
            const messageResolvable = await channelResolvable.messages.fetch(msgId)
            await dbFunc.setMessageReaction(messageResolvable.id, role.name, hash(emoji))
            messageResolvable.react(emoji)
        }catch (error){
            return interaction.reply({content :"L'id du message n'est pas bon ou ne concorde pas avec le channel donné", ephemeral : true})
        }
        return interaction.reply(`La réaction a été ajoutée !`)
    }
}