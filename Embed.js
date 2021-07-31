const Discord = require('discord.js');

class Embed {

    constructor(color, title, message) {
        this.embed = new Discord.MessageEmbed()

        this.embed.setColor(color)
        this.embed.setTitle(title)

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