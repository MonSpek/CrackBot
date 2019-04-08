const fs = require('fs'),
    Discord = require('discord.js');
const config = require('../config.json'),
    colors = require('../colors.json'),
    XP = require('../models/xp.js'),
    errors = require('../Lib/errors.js'),
    emb = require('../Lib/embeds.js');

module.exports = async (client, message) => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    let xpToAdd = Math.floor(Math.random() * 5) + 20;

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
                    .setDescription(`Good job Hustla, ${message.author} hs ranked up`)
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

    if (message.content.includes(client.user.toString())) {
        message.channel.send(`${message.author}\nWhat up busta?`)
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