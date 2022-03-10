const Discord = require('discord.js');
const axios = require('axios');
const colors = require('colors');
const config = require('./config.json');
var MyFollowers = null;

class DiscordBot {
    constructor() {
        this.events = [
            {
                type : 'ready',
                cb : () => {
                    this.ready()
                }
            },
            {
                type : 'message',
                cb : (message) => {       
                    this.message(message)
                }
            },
            {
                type : 'clickButton',
                isAsync: true,
                cb : (button) => {
                    this.clickButton(button)
                }
            },
            {
                type : 'channelCreate',
                isAsync: true,
                cb : (channel) => {
                    console.log('Channel ' +channel.name + ' crée par ...')
                }
            },
            {
                type : 'channelDelete',
                isAsync: true,
                cb : (channel) => {
                    console.log('Channel ' +channel.name + ' supprimer par ...')
                }
            },
            {
                type : 'guildBanAdd',
                cb : (guild, user) => {
                    console.log(colors.red(user.tag + ' (' + user.id+ ') a été banni'))
                }
            },
            {
                type : 'guildBanRemove',
                cb : (guild, user) => {
                    console.log(colors.red(user.tag + ' (' + user.id+ ') a été débanni'))
                }
            },
            {
                type : 'guildMemberAdd',
                cb : (memberGuild) => {
                    memberGuild.addRole(memberGuild.guild.roles.get(role => role.id === "871468845725007943"));
                    console.log('Quelqu\'un a rejoins le discord (' +memberGuild.user.tag + ')')
                }
            },
            {
                type : 'guildMemberRemove',
                cb : (member) => {
                    console.log('Quelqu\'un a quitter le discord (' +member.user.tag + ')')
                }
            },
            {
                type : 'messageDelete',
                cb : (message) => {
                    console.log(`${message} a été supprimer`);
                }
            },
            {
                type : 'guildMemberUpdate',
                cb : (oldMember, newMember) => {
                    console.log(`a guild member changes - i.e. new role, removed role, nickname.`);
                }
            },
            {
                type : 'inviteCreate',
                isAsync: true,
                cb : async (invite) => {
                    this.invitEmbed(invite)
                }
            },
            {
                type : 'presenceUpdate',
                isAsync: true,
                cb : (oldMember, newMember) => {
                    console.log(`${oldMember.author} has changed status to ${oldMember.status}`)
                }
            },
        ]

        this.token = config.token;
        this.client = new Discord.Client();
        this.interval = undefined;
        this.prefix = config.prefix;
        this.ColorEmbed = '#35393c';

        this.threshold = {
            current : 0,
            max : 60,
            github : 30
        }

        this.embeds = {
            sondage : undefined,
            infosPerso : undefined,
            gitHub : undefined,
            invitation : undefined
        }

        this.init();
    }

    init = () => {
        require("discord-buttons")(this.client);
        this.events.map(action => {
        console.log(colors.blue(`[${action.type}]`), colors.green('events success load')) 
        !action.isAsync ? 
                this.client.on(action.type, (obj, args2, args3) => action.cb(obj, args2, args3)) 
            :
                this.client.on(action.type, async (obj, args2, args3) => action.cb(obj, args2, args3))
        });
        this.client.login(this.token);
        
        // this.startThread()
    }

    startThread = () => {
        this.interval = setInterval(this.thread, 1000)
    }

    errorCommand = (args, message) => {
        return `<@${message.author.id}> ${args.content}`;
    }

    thread = () => {
        if (Math.ceil(this.threshold.current / 60) % this.threshold.github === 0) {
            this.gitHubRepos()
        }
        if (this.threshold.current == this.threshold.max)
            this.threshold.current = 0
        
        this.threshold.current++
    }

    ready = () => {
        this.setActivity("Work on Perfectly bot", "PLAYING")
        console.log(`${this.client.user.tag} Is Online on Discord and activity has been updated !`)
    }

    setActivity = (args, type) => {
        this.client.user.setActivity(args, {type: type})
    }

    TypeError = (message) => {
        return console.log(colors.red(message.content)) && false
    }

    sendToChannelID = (channelId) => {
        return this.client.channels.cache.find(channel => channel.id === channelId);
    }

    invitEmbed = (invite) => {
        this.embeds.invitation = new Discord.MessageEmbed()
        this.embeds.invitation.setColor(this.ColorEmbed)
        this.embeds.invitation.setTitle('🔗 Invitation crée')
        this.embeds.invitation.setDescription(`Crée par: <@${invite.inviter.id}>\nLien: ${invite.url}\nUtilisation maximum: **${invite.maxUses}**\nExpire a: **${invite.expiresAt}**`)
        this.embeds.invitation.setFooter(this.getTime() + ' discord.gg/'+invite.code)
        this.embeds.invitation.setThumbnail(invite.inviter.displayAvatarURL({dynamic: true}))
        this.sendToChannelID(config.LogsChannel).send(this.embeds.invitation);
    }

    message = message => {
        let toSend

        if (!message.content.startsWith(this.prefix) || message.author.bot) return;

        let args = message.content.slice(this.prefix.length).trim().split(/ +/);
        let commands = args.shift().toLowerCase();

        switch (commands) {
            case "sondage":
                // args.slice(this.prefix.length + commands.length)
                toSend = this.sondage(message, args[0], args.slice(this.prefix.length + commands.length))
                break;
            case "pause":
                clearInterval(this.interval)
                break
            default: 
                toSend = this.errorCommand({content: "Cette commande n'existe pas !"}, message)
                break
        }

        if (toSend !== undefined) {
            setTimeout(() => message.delete(), 800);
            message.channel.send(toSend)
        }
    }

    clickButton = (button) => {
        switch (button.id) {
            case "ClickOnPeutEtre":
                break;
        }
    }

    getFollowers = user => {
        axios.get(`https://api.github.com/users/${user}/followers`).then(follows => {
            while (MyFollowers === null || MyFollowers === undefined) {
                MyFollowers = follows.data.length;
            }
            console.log(colors.green('[getFollowers]'), colors.red(`(${user} has ${MyFollowers} followers)`))
        })
    }

    gitHubRepos = async () => {
        axios.get('https://api.github.com/users/DakoooM/repos')
            .then(async repos => {
                let excludeRepos = ["DakoooM", "TUTO-YTB"]
                this.getFollowers('DakoooM')
                
                setTimeout(() => {
                    this.embeds.gitHub = new Discord.MessageEmbed()
                    this.embeds.gitHub.setColor(this.ColorEmbed)
                    this.embeds.gitHub.setTitle(`Repositories`)
                    this.embeds.gitHub.setDescription(`[**DakoooM ・ ${MyFollowers} Followers**](https://github.com/DakoooM)`)
                    this.embeds.gitHub.addFields(repos.data.filter(data => !excludeRepos.includes(data.name))
                        .map(data => {
                            return({
                                name : `⭐ (${data.stargazers_count} star${(() => data.stargazers_count > 1 ? "s" : "")()})`,
                                value : `
                                    [**${data.name}**](${data.html_url})
                                `
                            })
                        })
                    )
                    this.embeds.gitHub.setThumbnail(config.myAvatar)
                    this.embeds.gitHub.setImage("https://www.faithful3d.team/image/home/github_banner.jpg")
                    this.embeds.gitHub.setFooter(`Dernière Modification ${this.getTime()}`)
                    
                    let githubchannel = this.sendToChannelID(config.gitHubChannel);
                    switch (githubchannel) {
                        case config.Channels.gitHub:
                            githubchannel.send(this.embeds.gitHub);
                            break;
                    default:
                        console.log(colors.red("Impossible de trouver le channel"));
                        break;
                    }
                }, 2500)

                this.client.channels.cache.get(config.Channels.gitHub).messages.fetch({limit: 10}).then(() => {githubchannel.bulkDelete(10)})
            })
        .catch(console.log(colors.red("Il y a une erreur dans l'API GitHub")))
    }

    sondage = (message, title, raison) => {
        let SondageContent = []
        SondageContent.push({name: title, reason: raison})

        switch (title !== undefined && raison !== undefined) {
            case title && raison:
                console.log(colors.red(`HELLOOO ${title} + ${raison}`))
                this.embeds.sondage = new Discord.MessageEmbed()
                this.embeds.sondage.setColor(this.ColorEmbed)
                this.embeds.sondage.setAuthor('Sondage')
                this.embeds.sondage.addField(`**__${title}__**`, SondageContent.map(data => {
                    return({
                        name: `${data.name} ${(() => data.name === "Discord Nitro" ? '👾' : '')()}`,
                        value: data.reason
                    })
                }))
                this.embeds.sondage.setThumbnail(message.author.displayAvatarURL())
                this.embeds.sondage.setFooter(`Crée par ${message.author.username} ${this.getTime()}`)
                message.channel.send({
                    embed: this.embeds.sondage,
                }).then(embedMessage => {
                    embedMessage.react("✅");
                    embedMessage.react("🤷");
                    embedMessage.react("🚫");
                });
                break;
            default:
            message.channel.send(this.errorCommand({
                content: "Veuillez rentrez le titre et la raison du sondage !"}, 
                message)
            );
            setTimeout(() => {message.delete()}, 1200);
            break;
        }
    }

    getTime = () => {
        let today = new Date();
        let date = today.getDate()+'/'+ (today.getMonth()+1)+ "/" +today.getFullYear();
        let time = today.getHours() + " heures " + today.getMinutes() + " minutes";
        return '・ ' +date+' - '+time+ ' ・';
    }
}

new DiscordBot();
