const Discord = require('discord.js'),
    fs = require('fs');
const colors = require('../../colors.json');

module.exports.run = async (message, arg, client, errors, emb) => {
    let pages = [
        "**Buy**:\nA place to buy Viper's items\n\n**Covers**:\nSends a random Viper cover\n\n**leaderboard**:\nA dope leaderboard of bustas who have smoked crack\n\n**Smoke**:\nAllows to smoke some of Viper's crack\n\n**Stats**\nShows your stats",
        '**Help**:\nProvides a list of commands'
    ];
    let page = 1;

    const embed = new Discord.RichEmbed()
        .setColor(colors.main)
        .setTitle('**Commands**:')
        .setThumbnail(message.author.avatarURL)
        .setDescription("**Buy**:\nA place to buy Viper's items\n\n**Covers**:\nSends a random Viper cover\n\n**leaderboard**:\nA dope leaderboard of bustas who have smoked crack\n\n**Smoke**:\nAllows to smoke some of Viper's crack\n\n**Stats**\nShows your stats")
        .setFooter(`Page 1 of ${pages.length}`)
        .setImage('https://i.imgur.com/vXRfAd6.gif')

    await message.channel.send(embed).then(async msg => {
        msg.react('⬅').then(r => {
            msg.react('➡')

            const backwardsFilter = (reaction, user) => reaction.emoji.name === '⬅' && user.id === message.author.id;
            const forwardsFilter = (reaction, user) => reaction.emoji.name === '➡' && user.id === message.author.id;

            const backwards = msg.createReactionCollector(backwardsFilter, { timer: 6000 });
            const forwards = msg.createReactionCollector(forwardsFilter, { timer: 6000 });

            backwards.on('collect', r => {
                if (page === 1) return;
                r.remove(r.users.filter(u => u === message.author).first());
                page--;
                embed.setDescription(pages[page - 1]);
                embed.setFooter(`Page ${page} of ${pages.length}`);
                msg.edit(embed)
            })

            forwards.on('collect', r => {
                if (page === pages.length) return;
                r.remove(r.users.filter(u => u === message.author).first());
                page++;
                embed.setDescription(pages[page - 1]);
                embed.setFooter(`Page ${page} of ${pages.length}`);
                msg.edit(embed)
            })
        })
    });
}

module.exports.help = {
    name: "help",
    aliases: ['h'],
    description: "Provides a list of commands"
}