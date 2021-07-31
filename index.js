const Discord = require('discord.js');
const axios = require('axios');

let on = [
    {
        type : "ready",
        cb : client => {
            client.user.setActivity("1 Membres", {type: 'WATCHING'})
            console.log(`${DakoM.client.user.tag} Is Online on Discord and activity 1 Members has been updated !`)
        }
    },
    {
        type : "message",
        cb : message => {
            
        }
    },
]

let tableau = [];
axios.get('https://restcountries.eu/rest/v2/all')
    .then(response => {
        response.data.map(pays => {
            tableau.push({name : pays.name, pays : pays.capital})
        });
    })
  .catch(error => {
    console.log(error);
})

class DiscordBot {

    constructor(token) {
        
        this.client = new Discord.Client();
        this.prefix = "/";
        this.DakoM = [];
        this.ColorEmbed = "PURPLE";
        this.token = token;
        this.MessageButtons = require("discord-buttons");
        this.init();
    }

    init() {
        on.map(action => { 
            this.client.on(action.type, c => action.cb(this.client))
        })

        this.client.login(this.token)
    }
}

let DakoM = new DiscordBot("ODAwODMyMTIxODQ0NzkzMzQ0.YAX3CA.mqSgmzGJ9rGAsMFbFpzOHJ4LbPI")

require('discord-buttons')(DakoM.client);

getTime = function() {
    var today = new Date();
    var date = today.getDate()+'/'+ (today.getMonth()+1)+ "/" +today.getFullYear();
    var time = today.getHours() + " heures " + today.getMinutes() + " minutes";
    return dateTime = date+' - '+time;
}


DakoM.client.on('message', message => {
	if (!message.content.startsWith(DakoM.prefix) || message.author.bot) return;

	const args = message.content.slice(DakoM.prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

    let locales ={

        infos : {
            fields : [
                {
                    title : "__I -__",
                    message : "Je m\'appel Giovani et j\'ai actuellement 18 ans (19 le 2 septembre)"
                }
            ]
        }
    }

	if (command === 'infos') {
        setTimeout(() => message.delete(), 800);

        let InfosEmbed = new DakoM.Discord.MessageEmbed()
            .setColor('PURPLE')
            .setTitle('Qui suis-je ?')
            .setAuthor('Informations')
            .setThumbnail("https://media1.tenor.com/images/54cc77830f82ef67471d8d868d09ad2f/tenor.gif")
            .addField('__I -__', 'Je m\'appel Giovani et j\'ai actuellement 18 ans (19 le 2 septembre)')
            .addField('__II -__', 'J\'aime particulièrement apprendre de nouvelle chose dans le développement depuis 1 an')
            .addField('__III -__', 'J\'aime utiliser __**Lua**/**Javascript**/**HTML**/**CSS**__ comme language de proggramation étant donner que je ne suis pas fullstack')
            .addField('__IV -__', 'Je code la pluspart du temps pour faire des ressources (scripts) pour le launcher FiveM')
            .addField('────────────────────────────────────', ' ឵ ឵   ឵ ឵ ')
            .setTimestamp()
            .setFooter("Created By DakoM#6583")

        message.channel.send(InfosEmbed)
    } else if (command === 'github') {
        // new Promise(function() {
        //     DakoM.Request.get({
        //         url: "https://api.github.com/users/DakoooM/repos",
        //         headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'}
        //     }, function(err, res, body) {
        //         let repos = JSON.parse(body);
        //         let reposName = [];
        //         for (let i = 0; i < repos.length; i++) {
        //             reposName.push(repos[i].name);
        //         }
        //         let gitHubRepo = new DakoM.Discord.MessageEmbed()
        //         .setColor("GREEN")
        //         .setTitle('[**__DakooM__**](https://github.com/DakoooM)')
        //         .setAuthor('Github')
        //         .addField(reposName, "")
        //         .setThumbnail(message.author.displayAvatarURL())
        //         .setTimestamp()
        //         .setFooter(`Sondage Crée par MOI`)   
        //         message.channel.send(gitHubRepo)
        //     });
        // });
	} else if (command === 'sondage') {
        if (args[0] !== undefined) {
            SondageEmbed = new DakoM.Discord.MessageEmbed()
            .setColor(ColorEmbed)
            .setAuthor('Sondage')
            .addField('__Question:__', ...args)
            .setThumbnail(message.author.displayAvatarURL())
            .setTimestamp()
            .setFooter(`Sondage Crée par ${message.author.name}`)   
            let buttonYes = new DakoM.MessageButtons()
            .setLabel("Oui")
            .setID("ClickOnYes")
            .setStyle("green")
            let buttonNo = new DakoM.MessageButtons()
            .setLabel("Non")
            .setID("ClickOnNo")
            .setStyle("red")
            message.channel.send("Sondage", {
                buttons: [buttonYes, buttonNo],
                embed: SondageEmbed,
            });
        } else {
            let ErrorArgsSondage = new DakoM.Discord.MessageEmbed()
            .setColor('RED')
            .setAuthor('Attention')
            .setThumbnail(message.author.displayAvatarURL())
            .addField('Erreur', 'Veuillez rentrez les 3 arguments demandez !')
            .setTimestamp()
            .setFooter("Created By DakoM#6583")
            message.channel.send(ErrorArgsSondage);
            setTimeout(function() {
                message.delete()
                // ErrorArgsSondage.delete()
            }, 1500);
        };
	}
});

DakoM.client.on('clickButton', async (button) => {
    if (button.id == "ClickOnYes") {
        ColorEmbed = "GREEN";
        let AfterYes = new DakoM.MessageButtons()
        .setLabel("Vote: Oui")
        .setID("NoneYes")
        .setStyle("green")
        .setDisabled(true)
        button.message.edit({
            button: AfterYes,
            embed: SondageEmbed
        });
    } else if (button.id == "ClickOnNo") {
        ColorEmbed = "RED";
        let AfterNo = new DakoM.MessageButtons()
        .setLabel("Vote: Non")
        .setID("NoneNo")
        .setStyle("red")
        .setDisabled(true)
        button.message.edit({
            button: AfterNo,
            embed: SondageEmbed
        });
    }
})