const mongoose = require('mongoose'),
    Discord = require('discord.js');
const CRACK = require('../../models/crack.js'),
    colors = require('../../colors.json');

module.exports.run = async (message, arg, client, errors, emb) => {
    const filter = m => m.author.id === message.author.id;

    await message.reply('Busta, would you like to smoke crack?');
    message.channel.awaitMessages(filter, { max: 1, time: 30000 }).then(collected => {
        if (collected.first().content.toLowerCase() === "no" || collected.first().content.toLowerCase() === "n") {
            message.reply("Coward");
            return;
        } else if (collected.first().content.toLowerCase() === "yes" || collected.first().content.toLowerCase() === "y" || collected.first().content.toLowerCase() === "ye") {
            CRACK.findOne({
                userID: message.author.id,
                serverID: message.guild.id
            }, (err, crack) => {
                if (err) console.error(err);

                if (!crack || !crack.crackAmt) {
                    message.reply("Go buy some crack coward!");
                    return;
                } else {
                    let curCrackSmokedAmt = crack.crackSmoked;

                    crack.crackAmt = crack.crackAmt - 1;
                    crack.crackSmoked = crack.crackSmoked + 1;
                    crack.save().catch(err => console.log(err));
                    
                    const embed = new Discord.RichEmbed()
                        .setTitle("Crack Smoked!")
                        .setColor(colors.main)
                        .setDescription(`Dope busta, ${message.author} has smoked some crack`)
                        .setFooter(`You have now smoked ${curCrackSmokedAmt + 1} crack rocks`);

                    message.channel.send(embed);
                }
            })
        }
    })
}

module.exports.help = {
    name: "smoke",
    aliases: ['smokes'],
    description: "Allows to smoke some of Viper's crack"
}