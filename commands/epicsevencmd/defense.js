const {SlashCommandBuilder} = require('@discordjs/builders');
const dbFunctions = require('../../database/dbFunctions'); 
const nodeHtmlToImage = require('node-html-to-image')
module.exports = {
 
    data : new SlashCommandBuilder()
    .setName('defense')
    .setDescription('defense')
    .addStringOption(option => option.setName('char_1').setDescription('Premier personnage').setAutocomplete(true))
    .addStringOption(option => option.setName('char_2').setDescription('Deuxième personnage').setAutocomplete(true))
    .addStringOption(option => option.setName('char_3').setDescription('Troisième personnage').setAutocomplete(true)),
 
    async execute (interaction) {
        let char_1 = interaction.options.getString('char_1');
        let char_2 = interaction.options.getString('char_2');
        let char_3 = interaction.options.getString('char_3');
        let tabChars = [char_1, char_2, char_3]
        let tabCharsDef = []
        await interaction.deferReply();    
        const urlDef = "https://krivpfvxi0.execute-api.us-west-2.amazonaws.com/dev/getDef"
        for (let element of tabChars) {
            let elemFromDb = await dbFunctions.getHeroDbFromName(element)
            tabCharsDef.push(elemFromDb.code)
        }
        const dataSend = tabCharsDef.join(",");
        const response = await fetch(urlDef, {
            method: 'POST',
            body: dataSend,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        let arr = [];

        if(data.data == null) return interaction.reply({content : "Aucune données trouvées"})
        for (const [key, value] of Object.entries(data.data)) {
            arr.push({ids: key, stats: value});
        }
        arr.sort((a, b) => b.stats.w - a.stats.w);
        
        const top15 = arr.slice(0,6)
        const images = await nodeHtmlToImage({
            html: await renderPage(top15),
            quality: 100,
            type: 'jpeg',
            puppeteerArgs: {
            args: ['--no-sandbox'],
            },
            encoding: 'buffer',
        })
        await interaction.followUp({ files: [images], content : `Voici les différentes offenses pour la défense : ${char_1}, ${char_2}, ${char_3}`});
    }
}
async function generateCardHtml(top15) {
    let cardsLeft = '';
    let cardsRight = '';

    for (let i = 0; i < top15.length; i++) {
        let ids = top15[i].ids.split(",");
        let heroes = [];

        for (let j = 0; j < ids.length; j++) {
            const hero = `https://static.smilegatemegaport.com/event/live/epic7/guide/images/hero/${ids[j]}_s.png`
            heroes.push(hero);
        }

        const calcPercentage = ((top15[i].stats.w / (top15[i].stats.w + top15[i].stats.l)) * 100).toFixed(2);

        let cardHtml = `
            <div class="card">
                <div class="img"><img src="${heroes[0]}" /></div>
                <div class="img"><img src="${heroes[1]}" /></div>
                <div class="img"><img src="${heroes[2]}" /></div>
                <div class="age">${calcPercentage}% (${top15[i].stats.w}W/${top15[i].stats.l}L)</div>
            </div>
        `;

        if (i < 3) {
            cardsLeft += cardHtml;
        } else {
            cardsRight += cardHtml;
        }
    }

    return { cardsLeft, cardsRight };
}
async function renderPage(top15) {
    const { cardsLeft, cardsRight } = await generateCardHtml(top15);
    const pageHtml = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            .container{
                display: flex;
                justify-content: center;
                align-items: center;
                background-image: url(https://cdn.discordapp.com/attachments/1050435795481268345/1057025878326001704/IMG_20221226_210314.jpg);
                background-repeat: round;
                width: 700px;
            }
            .card{
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 3px;
                border-radius: 10px;
                background-color: hsla(0, 0%, 0%, 0.35);
            }
            .img{
                width: 50px;
                height: 50px;
                border: solid white 1px;
                border-radius: 25px;
                margin: 2px;
            }
            .img> img{
                width: 50px;
                height: 50px;
            }
            .container-left + .container-right{
                margin: 10px;
            }
            .age{
                color: white;
                font-weight: bold;
                font-size: 12px;
            }
            body{
                width: fit-content;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="container-left">
                ${cardsLeft}
            </div>
            <div class="container-right">
                ${cardsRight}
            </div>
        </div>
    </body>
    </html>
`;

    // Vous pouvez maintenant utiliser 'pageHtml' pour afficher le contenu sur votre page ou le manipuler comme vous le souhaitez.
    return pageHtml;
}