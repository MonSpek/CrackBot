const Discord = require('discord.js');
const CRACK = require('../../models/crack.js'),
    colors = require('../../colors.json');

module.exports.run = async (message, arg, client, errors, emb) => {
    await message.delete();

    const embed = new Discord.RichEmbed()
        .setColor(colors.main)
        .setTitle('Smoke')
        .setThumbnail(message.author.avatarURL)
        .setDescription("Would you like to smoke crack?")
        .setImage('https://i.imgur.com/vXRfAd6.gif')

    CRACK.findOne({
        userID: message.author.id,
        serverID: message.guild.id
    }, async (err, crack) => {
        if (err) console.error(err);

        if (crack.crackAmt <= 0) {
            embed.setDescription("You don't have any crack to smoke!")
            embed.setColor(colors.err)
            return message.channel.send(embed).then(msg => { msg.delete(5000) });
        } else if (crack.crackAmt === 1) {
            embed.setFooter(`You have ${crack.crackAmt} crack rock`)
        } else {
            embed.setFooter(`You have ${crack.crackAmt} crack rocks`)
        }

        await message.channel.send(embed).then(async msg => {
            msg.react('👍').then(r => {
                msg.react('👎')

                const checkFilter = (reaction, user) => reaction.emoji.name === '👍' && user.id === message.author.id;
                const crossFilter = (reaction, user) => reaction.emoji.name === '👎' && user.id === message.author.id;

                const check = msg.createReactionCollector(checkFilter, { timer: 10000 });
                const cross = msg.createReactionCollector(crossFilter, { timer: 10000 });

                check.on('collect', r => {
                    r.remove(r.users.filter(u => u === message.author).first());
                    CRACK.findOne({
                        userID: message.author.id,
                        serverID: message.guild.id
                    }, (err, crack) => {
                        if (err) console.error(err);

                        if (!crack || !crack.crackAmt) {
                            embed.setDescription("Go buy some crack coward")
                            msg.edit(embed).then(msg => { msg.delete(3000) });
                            return;
                        } else {
                            let curCrackSmokedAmt = crack.crackSmoked;

                            crack.crackAmt = crack.crackAmt - 1;
                            crack.crackSmoked = crack.crackSmoked + 1;
                            crack.save().catch(err => console.log(err));

                            embed.setTitle("Crack Smoked!")
                            embed.setDescription(`Dope busta, ${message.author} has smoked some crack`)
                            if (crack.crackSmoked === 0) {
                                embed.setFooter('You have now smoked 1 crack rock');
                            } else {
                                embed.setFooter(`You have now smoked ${curCrackSmokedAmt + 1} crack rocks`)
                            }
                            msg.edit(embed).then(msg => { msg.delete(5000) });
                        }
                    })
                })

                cross.on('collect', r => {
                    r.remove(r.users.filter(u => u === message.author).first());
                    embed.setDescription("Coward")
                    embed.setColor(colors.err)
                    msg.edit(embed).then(msg => { msg.delete(3000) });
                })
            })
        });
    })
}

module.exports.help = {
    name: "smoke",
    aliases: ['smokes'],
    description: "Allows to smoke some of Viper's crack"
}