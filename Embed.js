const Discord = require('discord.js');

class Embed {
    constructor(color, title, author, fieltitle, fieldmsg, ThumbnailURL, footer) {
        this.myEmbed = new Discord.MessageEmbed()
        switch (color, title, author, fieltitle, fieldmsg, ThumbnailURL, footer) {
            case !undefined || null:
                this.embed.setColor(color);
                this.embed.setTitle(title);
                this.embed.setAuthor(author);
                this.embed.addField(fieltitle, fieldmsg);
                this.embed.setThumbnail(ThumbnailURL);
                this.embed.setFooter(footer);
            break;
        }
        return this.myEmbed;
    }
}

class Annonces extends Embed {
    constructor(message) {
        super(moi, meme, message)
    }
}

export default Embed