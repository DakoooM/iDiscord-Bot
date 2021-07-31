const Discord = require('discord.js');

class Embed {
    constructor(color, title, author, fieltitle, fieldmsg, ThumbnailURL) {
        this.embed = new Discord.MessageEmbed()
        if (this.embed.setColor(color)) {
            this.embed.setColor(color)
        }
        this.embed.setTitle(title)
        this.embed.setAuthor(author)
        this.embed.addField(fieltitle, fieldmsg)
        this.embed.setThumbnail(ThumbnailURL)
        this.embed.setTimestamp()
        this.embed.setFooter(`Sondage Crée par MOI`)
    }
}

class Annonces extends Embed {

    constructor(message) {
        super(moi, meme, message)
    }

}

class Twitch extends Embed {

}

export default Embed