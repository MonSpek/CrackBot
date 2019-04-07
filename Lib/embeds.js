const Discord = require('discord.js');
const colors = require('../colors.json');

const welcomeEmb = function (member) {
    const embed = new Discord.RichEmbed()
        .setAuthor(member)
        .setColor(colors.main)
        .setDescription("Welcome to the Official Rapper Viper Discord Server!")
        .addField("Make sure to read the rules and enjoy your time coward.");

    member.send(embed);
}

exports.welcomeEmb = welcomeEmb;