const Discord = require('discord.js');
const colors = require('../colors.json'),
    XP = require('../models/xp.js'),
    CRACK = require('../models/crack.js'),
    errors = require('../Lib/errors.js'),
    emb = require('../Lib/embeds.js');

module.exports = async (client, message) => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    let xpToAdd = Math.floor(Math.random() * 5) + 20;

    if (!message.content.includes('c!')) {
        XP.findOne({
            userID: message.author.id,
            serverID: message.guild.id
        }, (err, xp) => {
            if (err) console.error(err);
            if (!xp) {
                const newXp = new XP({
                    userID: message.author.id,
                    userName: message.author.username,
                    serverID: message.guild.id,
                    xp: xpToAdd,
                    level: 1
                })

                newXp.save().catch(err => console.error(err));
            } else {
                let curLvl = xp.level;
                let nextLvl = xp.level * 5000;

                xp.xp = xp.xp + xpToAdd;

                if (nextLvl <= xp.xp) {
                    xp.level = curLvl + 1;

                    let lvlUpEmb = new Discord.RichEmbed()
                        .setTitle("Level Up!")
                        .setColor(colors.main)
                        .setDescription(`Good job Hustla, ${message.author} has ranked up`)
                        .setFooter(`You are now rank ${curLvl + 1}`);

                    message.channel.send(lvlUpEmb).then(msg => { msg.delete(5000) });

                    if (xp.level === 3) {
                        let memberRole = message.member.guild.roles.find(r => r.name === 'Bustas');
                        message.member.addRole(memberRole);
                    }
                    if (xp.level === 6) {
                        let memberRole = message.member.guild.roles.find(r => r.name === 'Hustlas');
                        message.member.addRole(memberRole);
                    }
                    if (xp.level === 10) {
                        let memberRole = message.member.guild.roles.find(r => r.name === 'Dealas');
                        message.member.addRole(memberRole);
                    }
                }

                xp.save().catch(err => console.log(err));
            }
        })
    }

    let base0 = Math.floor(Math.random() * 12) + 1;
    let base1 = Math.floor(Math.random() * 12) + 1;

    if (base0 === base1) {
        const filter = m => m.author.id === message.author.id;

        await message.reply('*Walks out of the allies*\nHey Busta, want some crack?');
        message.channel.awaitMessages(filter, { max: 1, time: 20000 }).then(collected => {
            if (collected.first().content.toLowerCase() === "no" || collected.first().content.toLowerCase() === "n") {
                message.reply('You coward');
                return;
            } else if (collected.first().content.toLowerCase() === "yes" || collected.first().content.toLowerCase() === "y" || collected.first().content.toLowerCase() === "ye") {
                message.reply("You are a dope boy busta\nIt'll cost you 1000 points though busta.\nIs that ok? (Y/N)");
                message.channel.awaitMessages(filter, { max: 1, time: 30000 }).then(col => {
                    if (col.first().content.toLowerCase() === "no" || col.first().content.toLowerCase() === "n") {
                        message.reply("Go get some points then coward!");
                        return;
                    } else if (col.first().content.toLowerCase() === "yes" || col.first().content.toLowerCase() === "y" || col.first().content.toLowerCase() === "ye") {
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
                                            .setDescription(`Good job busta, ${message.author} has bought some crack!`)
                                            .setFooter('You now have 1 crack rock');

                                        message.channel.send(crackEmb);
                                    } else {
                                        let curCrackLvl = crack.crackAmt;
                                        crack.crackAmt = crack.crackAmt + 1;
                                        crack.save().catch(err => console.log(err));

                                        const crackEmb = new Discord.RichEmbed()
                                            .setTitle("Crack Acquired!")
                                            .setColor(colors.main)
                                            .setDescription(`Good job busta, ${message.author} has bought some crack!`)
                                            .setFooter(`You now have ${curCrackLvl + 1} crack rocks`);

                                        message.channel.send(crackEmb);
                                    }
                                })
                                xp.save().catch(err => console.log(err));
                            }
                        })
                    }
                })
            }
        }).catch(err => console.error(err))
    }

    if (message.content.includes(client.user.toString())) {
        if (message.content.includes('yo')) {
            message.reply('What up busta?');
        } else {
            message.reply("Coward what do you want?");
        }
    }

    //* vars
    let prefix = client.prefix;
    let msgArray = message.content.split(' ');
    let command = msgArray[0].toLowerCase();
    let arg = msgArray.slice(1);
    let cmd = client.commands.get(command.slice(client.prefix.length)) || client.commands.get(client.commands.aliases.get(command.slice(client.prefix.length)));
    let input = message.content.toLowerCase();

    if (!input.startsWith(prefix)) return; //If prefix is not present then exit

    if (cmd) {
        cmd.run(message, arg, client, errors, emb);
    }
}