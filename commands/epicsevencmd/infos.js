const {SlashCommandBuilder} = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
module.exports = {
 
    data : new SlashCommandBuilder()
    .setName('infos')
    .setDescription('infos')
    .addStringOption(option => option.setName('user').setDescription('te').setAutocomplete(true)),
 
    async execute (interaction) {
        let user = interaction.options.getString('user');
        const APIURL = `https://epic7.gg.onstove.com/gameApi/getUserInfo?nick_no=${user}&world_code=world_eu&lang=en`;
        const heroesListApi = "https://static.smilegatemegaport.com/gameRecord/epic7/epic7_hero.json?_=1698936107249";
        //const ListFightApi = `https://epic7.gg.onstove.com/gameApi/getBattleList?nick_no=${user}&world_code=world_eu&lang=en&season_code=`;
        // changer la saison rta quand ça change
        const statSeasonAPI = `https://epic7.gg.onstove.com/gameApi/getUserInfoSeason?nick_no=${user}&world_code=world_eu&lang=en&search_type=2&season_code=pvp_rta_ss12`
        const opt = {
            method : "POST",
        }
        //const respFight = await fetch(ListFightApi,opt);
        //const listFight = await respFight.json();
        //console.log(listFight.result_body.battle_list[0])
        const respStats = await fetch(statSeasonAPI,opt);
        const resStats = await respStats.json();
        console.log(resStats.result_body.hero_list)
        const respHeroes = await fetch(heroesListApi);
        const listHeroes = await respHeroes.json();
        const listHeroesFr = listHeroes.fr;
        
        const response = await fetch(APIURL, opt)
        const result = await response.json();
        let text = `Les héros préférés de **${result.result_body.nickname}** cette saison de rta sont : \n\n`;
        //return console.log(listHeroesFr[0]);
        resStats.result_body.hero_list.forEach((hero) => {
            let heroName = listHeroesFr.filter(heroDb => heroDb.code.includes(hero.hero_code));
            text += `**${heroName[0].name}** Winrate : ${hero.win_rate}% - Nombre de matchs (W/L) : (${hero.win_score}/${hero.lose_score})\n`
        })
        return await interaction.reply(text);
    }
}