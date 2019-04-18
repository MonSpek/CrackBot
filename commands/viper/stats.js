const Discord = require('discord.js');
const colors = require('../../colors.json'),
    XP = require('../../models/xp.js'),
    CRACK = require('../../models/crack.js')

module.exports.run = async (message, arg, client, errors, emb) => {
    await message.delete()

    let embed = new Discord.RichEmbed()
        .setColor(colors.main)
        .setThumbnail(message.author.avatarURL)
        .setTitle("Your stats")
        .setDescription(`stats for ${message.member} on ${message.guild.name}`)
        .setImage('https://i.imgur.com/vXRfAd6.gif')

    XP.findOne({
        userID: message.author.id,
        serverID: message.guild.id
    }, (err, xp) => {
        if (err) console.error(err);

        embed.addField('**points/xp**:', `*${xp.xp}*`);

        if (xp.level < 3 && xp.level <3) embed.addField('**level**:', '*Coward*');
        if (xp.level >= 3 && xp.level < 6) embed.addField('**level**:', '*Busta*');
        if (xp.level >= 6 && xp.level < 10) embed.addField('**level**:', '*Hustla*');
        if (xp.level >= 10) embed.addField('**level**:', '*Deala*');

        CRACK.findOne({
            userID: message.author.id,
            serverID: message.guild.id
        }, (err, crack) => {
            if (err) console.error(err);

            embed.addField('**Amount of crack owned**:', `*${crack.crackAmt}*`);
            embed.addField('**Crack smoked**:', `*${crack.crackSmoked}*`);

            message.channel.send(embed).then(msg => { msg.delete(15000) });
        })
    })
}

module.exports.help = {
    name: "stats",
    aliases: ['ustats'],
    description: "Shows your stats"
}