const prefix = "/" /* My Prefix */
const DakoM = [] /* My Own Table */
const Discord = require('discord.js'); /* get Discord JS Librairy */
const client = new Discord.Client();
require('discord-buttons')(client); /* get Discord JS Buttons Librairy */

DakoM.MyToken = "ODAwODMyMTIxODQ0NzkzMzQ0.YAX3CA.AtFzloY2uAPLRD-eGot8mB82py8"

DakoM.getTime = function() {
    var today = new Date();
    var date = today.getDate()+'/'+ (today.getMonth()+1)+ "/" +today.getFullYear();
    var time = today.getHours() + " heures " + today.getMinutes() + " minutes";
    return dateTime = date+' - '+time;
}

client.on('ready', () => {
	console.log(`${client.user.tag} Is Online on Discord !`);
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === 'infos') {
        setTimeout(function(){message.delete()}, 800);
        let InfosEmbed = new Discord.MessageEmbed()
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
	} else if (command === 'sondage') {
        if (args[0] !== undefined && args[1] !== undefined && args[2] !== undefined) {
            const disbut = require("discord-buttons");
            let SondageEmbed = new Discord.MessageEmbed()
            .setColor('PURPLE')
            .setTitle('Question a mettre')
            .setAuthor('Sondage')
            // .setThumbnail("https://media1.tenor.com/images/54cc77830f82ef67471d8d868d09ad2f/tenor.gif")
            .addField('__I -__', 'Je m\'appel Giovani et j\'ai actuellement 18 ans (19 le 2 septembre)')
            .addField('__II -__', 'J\'aime particulièrement apprendre de nouvelle chose dans le développement depuis 1 an')
            .addField('────────────────────────────────────', ' ឵ ឵   ឵ ឵ ')
            .setTimestamp()
            .setFooter("Created By DakoM#6583")
            let buttonYes = new disbut.MessageButton()
            .setLabel("Oui")
            .setStyle("green")
            let buttonNo = new disbut.MessageButton()
            .setLabel("Non")
            .setStyle("red")
            message.channel.send("Votez", SondageEmbed, buttonYes, buttonNo);
        } else {
            let ErrorArgsSondage = new Discord.MessageEmbed()
            .setColor('RED')
            .setAuthor('Attention')
            .addField('Erreur', 'Veuillez rentrez les 3 arguments demandez !')
            .setTimestamp()
            .setFooter("Created By DakoM#6583")
            message.channel.send(ErrorArgsSondage);
            setTimeout(function() {
                message.delete()
                client.channels.cache.get(ErrorArgsSondage).delete()
            }, 1500);
        };
	}
});

client.login(DakoM.MyToken)