const Discord = require('discord.js');
const colors = require('../../colors.json'),
    CRACK = require('../../models/crack.js'),
    XP = require('../../models/xp.js');

module.exports.run = async (message, arg, client, errors, emb) => {
    await message.delete();

    let embed = new Discord.RichEmbed()
        .setColor(colors.main)
        .setImage('https://i.imgur.com/vXRfAd6.gif')
        .setTitle("Viper's Store")
        .setDescription("What would you like to buy? (all sales are final)")
        .addField("**Crack**", "1000 points/xp");

    const filter = m => m.author.id === message.author.id;
    await message.channel.send(embed).then(async msg => {
        message.channel.awaitMessages(filter, { max: 1, time: 15000 }).then(collected => {
            if (collected.first().content.includes('crack')) {
                XP.findOne({
                    userID: message.author.id,
                    serverID: message.guild.id
                }, (err, xp) => {
                    if (err) console.error(err);
                    if (!xp || xp.xp < 1000) {
                        message.reply("Go get some points coward!");
                        return;
                    } else if (xp.xp >= 1000) {
                        xp.xp = xp.xp - 1000;
                        CRACK.findOne({
                            userID: message.author.id,
                            serverID: message.guild.id
                        }, (err, crack) => {
                            if (err) console.error(err);

                            if (!crack) {
                                const newCrack = new CRACK({
                                    userID: message.author.id,
                                    userName: message.author.username,
                                    serverID: message.guild.id,
                                    crackAmt: 1,
                                    crackSmoked: 0
                                })

                                newCrack.save().catch(err => console.error(err));

                                const crackEmb = new Discord.RichEmbed()
                                    .setTitle("Crack Acquired!")
                                    .setColor(colors.main)
                                    .setImage('https://i.imgur.com/vXRfAd6.gif')
                                    .setDescription(`Good job busta, ${message.author} has bought some crack!`)
                                    .setFooter('You now have 1 crack rock');

                                msg.edit(crackEmb);
                            } else {
                                let curCrackLvl = crack.crackAmt;
                                crack.crackAmt = crack.crackAmt + 1;
                                crack.save().catch(err => console.log(err));

                                const crackEmb = new Discord.RichEmbed()
                                    .setTitle("Crack Acquired!")
                                    .setColor(colors.main)
                                    .setImage('https://i.imgur.com/vXRfAd6.gif')
                                    .setDescription(`Good job busta, ${message.author} has bought some crack!`)
                                    .setFooter(`You now have ${curCrackLvl + 1} crack rocks`);

                                msg.edit(crackEmb);
                            }
                        })
                        xp.save().catch(err => console.log(err));
                    }
                })
            }
        }).catch(err => {
            return;
        })

        msg.delete(16000);
    });
}

module.exports.help = {
    name: "buy",
    aliases: ['store'],
    description: "A place to buy Viper's items"
}