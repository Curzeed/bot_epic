const {SlashCommandBuilder} = require('@discordjs/builders');
const db = require('../../getConnection');
const pool = db.getPool();
const dbFunctions = require('../../database')
module.exports = {
    data: new SlashCommandBuilder()
    .setName("reset")
    .setDescription("Permet de reset tous les scores des deux guildes (à faire en début de semaine)"),
    async execute(interaction){
        if(dbFunctions.isAdmin(interaction.member)){
            await pool.query('UPDATE members SET score = 0 WHERE 1 = 1');   
            interaction.reply('Le score de tous les membres sont repassés à 0 !');
        }else{
            dbFunctions.isNotAdmin(interaction);
        }
        
    }
}