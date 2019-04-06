const fs = require('fs');
const config = require('../config.json'),
    XP = require('../models/xp.js'),
    errors = require('../Lib/errors.js'),
    emb = require('../Lib/embeds.js');

module.exports = async (client, message) => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    //* vars
    let prefix = client.prefix;
    let msgArray = message.content.split(' ');
    let command = msgArray[0].toLowerCase();
    let arg = msgArray.slice(1);
    let cmd = client.commands.get(command.slice(client.prefix.length)) || client.commands.get(client.commands.aliases.get(command.slice(client.prefix.length)));

	if (!message.content.startsWith(prefix)) return; //If prefix is not present then exit

	if (cmd) { 
		cmd.run(message, arg, client, errors, emb); 
	}
}