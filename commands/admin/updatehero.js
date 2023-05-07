const {SlashCommandBuilder} = require('@discordjs/builders');
const dbFunctions = require('../../database/dbFunctions');
module.exports = {
 
    data : new SlashCommandBuilder()
    .setName('updatehero')
    .setDescription('updatehero in database')
    .addStringOption(option => option.setName('name').setDescription('Name of the hero').setRequired(true))
    
    .addStringOption(option => option.setName('option').setDescription('Champ à modifier').addChoices({name : 'Nom', value : 'name'},{name : 'Elément', value : 'element'},{name : 'Nombre d\'étoiles', value : 'nb_stars'},{name : 'Lien du message', value : 'message_link'},{name : 'image', value : 'image'}).setRequired(true))
    .addStringOption(option => option.setName('value').setDescription('Nouvelle valeur').setRequired(true)),

    async execute (interaction) {
        const name = interaction.options.getString('name');
        const option = interaction.options.getString('option');
        const value = interaction.options.getString('value');
        if(option == "nb_stars" && (value < 1 || value > 6)) {
            return interaction.reply(`Le nombre d'étoiles doit être compris entre 1 et 6 !`);
        }
        if(option == "element" && !["terre", "feu", "eau", "light", "ombre"].includes(value.toLowerCase())) {
            return interaction.reply(`L'élément doit être compris entre terre, feu, eau, light ou ombre !`);
        }
        if(dbFunctions.isAdmin(interaction.member) == false) {
            return dbFunctions.isNotAdmin(interaction);
        }
        try{
            dbFunctions.getHero(name, (hero) => {
                if(hero.length == 0) {
                    return interaction.reply(`Hero ${name} not found !`);
                }
            });
            await dbFunctions.updateHero(option, name,value);
            await interaction.reply(`Le champ ${option} du héro ${name} a été modifié !`);
        }catch(e) {
            console.log(e);
            await interaction.reply(`Une erreur est survenue !`);
        }
    }
}