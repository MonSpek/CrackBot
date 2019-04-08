const path = require('path');
const fs = require ('fs');
const Discord = require('discord.js');
const colors = require('../../colors.json');

module.exports.run = async (message, arg, client, errors, emb) => {
    let dirPath = path.join(__dirname, '../../assets/covers');

    fs.readdir(dirPath, function (err, files) {
        if (err) return console.log('Unable to scan directory: ' + err);

        let file = files[Math.floor(Math.random()*files.length)];
        let fileInEmb = new Discord.Attachment(`./assets/covers/${file}`);
        const embed = new Discord.RichEmbed()
            .setTitle('Sick Cover Mayne')
            .setColor(colors.main)
            .setFooter(`Done by ${message.author.username}`)
            .attachFile(fileInEmb)
            .setImage(`attachment://${file}`);

        message.channel.send(embed);
    });
}

module.exports.help = {
    name: "cover",
    aliases: ['covers'],
    description: "Sends a random Viper cover"
}