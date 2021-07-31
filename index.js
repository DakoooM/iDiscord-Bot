const Discord = require('discord.js');
const axios = require('axios');
const config = require('./config.json');


class DiscordBot {
    
    constructor() {

        this.token = config.token;
        this.client = new Discord.Client();
        this.interval = undefined
        this.prefix = config.prefix;
        this.ColorEmbed = '#35393c';

        this.threshold = {
            current : 0,
            max : 60,
            github : 30
        }

        this.embeds = {
            sondage : new Discord.MessageEmbed(),
            vote : new Discord.MessageEmbed(),
            infosPerso : new Discord.MessageEmbed(),
            gitHub : new Discord.MessageEmbed()
        }

        this.events = [
            {
                type : 'ready',
                cb : () => {
                    this.ready()
                }
            },
            {
                type : 'message',
                cb : message => {       
                    this.message(message)
                }
            },
            {
                type : 'clickButton',
                isAsync: true,
                cb : button => {
                    this.clickButton(button)
                }
            }
        ]

        this.init();
    }

    init = () => {
        require("discord-buttons")(this.client);
        
        this.events.map(action =>
            !action.isAsync
            ?
                this.client.on(action.type, obj => action.cb(obj))
            :   
                this.client.on(action.type, async obj => action.cb(obj))
        );

        this.client.login(this.token)
        this.startThread()
    }

    startThread = () => {
        this.interval = setInterval(this.thread, 1000)
    }

    message = message => {
        let toSend

        if (!message.content.startsWith(this.prefix) || message.author.bot) return;
            let args = message.content.slice(this.prefix.length).trim().split(/ +/);
            let command = args.shift().toLowerCase();

            let locales = {
                
                infos : {
                    fields : [
                        {
                            title : "__I -__",
                            message : "Je m\'appel Giovani et j\'ai actuellement 18 ans (19 le 2 septembre)"
                        }
                    ]
                }
            }

            switch (command) {

                case "infos":
                    toSend = this.messageInfos(message)
                    break
                case "sondage":
                    toSend = this.sondage(args.slice(this.prefix.length + command.length))
                    break;
                case "pause":
                    clearInterval(this.interval)
                    break
                default:
                    toSend = this.errorCommandMessage()
                    break
            }

            if (toSend !== undefined) {
                setTimeout(() => message.delete(), 800);
                message.channel.send(toSend)
            }
        }

    thread = () => {
        this.threshold.current++

        if (this.threshold.current % this.threshold.github * 60 === 0) {
            //this.gitHubRepos()
            console.log("Appel de Github")
        }

        if (this.threshold.current == this.threshold.max)
            this.threshold.current = 0
        
    }

    ready = () => {
        // Afficher tes embeds dans les channels respectif (Messages, Sondage, etc...)   
        this.client.user.setActivity("1 Membres", {type: 'WATCHING'})
        console.log(`${this.client.user.tag} Is Online on Discord and activity 1 Members has been updated !`)
    }

    clickButton = button => {
        let disbut = require("discord-buttons")

        if (button.id == "ClickOnYes") {

            let AfterYes = new disbut.MessageButton()
                .setLabel("Vote: Oui")
                .setID("NoneYes")
                .setStyle("green")
                .setDisabled(true)
                
            button.message.edit({
                button: AfterYes,
                embed: this.embeds.sondage
            });

        } else if (button.id == "ClickOnNo") {
            let AfterNo = new disbut.MessageButton()
                .setLabel("Vote: Non")
                .setID("NoneNo")
                .setStyle("red")
                .setDisabled(true)
                
            button.message.edit({
                button: AfterNo,
                embed: this.embeds.sondage
            });
        }
    }

    messageInfos = message => {
        
        return this.embeds.infosPerso
            .setColor(this.ColorEmbed)
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
    }

    gitHubRepos = () => {

        axios.get('https://api.github.com/users/DakoooM/repos')
            .then(repos => {
                let excludeRepos = ["DakoooM", "TUTO-YTB"]

                this.embeds.gitHub
                    .setColor(this.ColorEmbed)
                    .setTitle(`Repositories`)
                    .setDescription('[**DakoooM**](https://github.com/DakoooM)')
                    .addFields(repos.data.filter(data => !excludeRepos.includes(data.name))

                        .map(data => {
                             ({
                                name : `⭐ (${data.stargazers_count} star${(() => data.stargazers_count > 1 ? "s" : "")()})`,
                                value : `
                                    [**${data.name}**](${data.html_url})
                                `
                            });
                        })
                    )
            })
            .catch(error => {
                console.log("Il y a une erreur");
            })
        
        let channel = this.client.channels.cache.find(channel => channel.id === "871158125460336690");

        if (channel) channel.send("TESTING", this.embeds.gitHub)
    }

    sondage = message => {
        let disbut = require("discord-buttons")

        if (message !== undefined) {

            this.embeds.sondage
                .setColor(this.ColorEmbed)
                .setAuthor('Sondage')
                .addField('__Question:__', )
                .setThumbnail(message.author.displayAvatarURL())
                .setTimestamp()
                .setFooter(`Sondage Crée par ${message.author.name}`) 

            let buttonYes = new disbut.MessageButton()
                .setLabel("Oui")
                .setID("ClickOnYes")
                .setStyle("green")
            let buttonNo = new disbut.MessageButton()
                .setLabel("Non")
                .setID("ClickOnNo")
                .setStyle("red")

            message.channel.send("Sondage", {
                buttons: [buttonYes, buttonNo],
                embed: this.embed.sondage,
            });

        } else {
            let ErrorArgsSondage = disbut.MessageButton()
            .setColor(this.ColorEmbed)
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
        }
    }
}

new DiscordBot();