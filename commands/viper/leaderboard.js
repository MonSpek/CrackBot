const Discord = require('discord.js');
const CRACK = require('../../models/crack.js'),
    colors = require('../../colors.json');

module.exports.run = async (message, arg, client, errors, emb) => {
    CRACK.find({ 
        serverID: message.guild.id 
    }).sort([
        ['crackSmoked', 'descending']
    ]).exec((err, res) => {
        if (err) console.error(err);

        let embed = new Discord.RichEmbed()
            .setTitle("Crack smoked Leaderboard")

        if (res.length === 0) {
            embed.setColor("RED");
            embed.addField("No data found", "Please smoke some crack coward!")
        } else if (res.length < 10) {
            embed.setColor(colors.main);
            for (i = 0; i < res.length; i++) {
                let member = message.guild.members.get(res[i].userID) || "User Left"

                if (member === "User Left") {
                    embed.addField(`${i + 1}. ${member}`, `**Crack Smoked**: ${res[i].crackSmoked}`);
                } else {
                    embed.addField(`${i + 1}. ${member.user.username}`, `**Crack Smoked**: ${res[i].crackSmoked}`);
                }
            }
        } else {
            embed.setColor(colors.main);
            for (i = 0; i < 10; i++) {
                let member = message.guild.members.get(res[i].userID) || "User Left"

                if (member === "User Left") {
                    embed.addField(`${i + 1}. ${member}`, `**Crack Smoked**: ${res[i].crackSmoked}`);
                } else {
                    embed.addField(`${i + 1}. ${member.user.username}`, `**Crack Smoked**: ${res[i].crackSmoked}`);
                }
            }
        }

        message.channel.send(embed);
    })
}

module.exports.help = {
    name: "leaderboard",
    aliases: ['leader'],
    description: "A dope leaderboard of bustas who have smoked crack"
}