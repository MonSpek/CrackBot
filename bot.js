const Discord = require('discord.js'),
    config = require('./config.json'),
    fs = require('fs'),
    clc = require('cli-colors');

//*core client
const client = new Discord.Client({
    disableEveryone: false,
    disabledEvents: [
        'TYPING_START',
        'USER_NOTE_UPDATE',
        'PRESENCE_UPDATE'
    ]
});

//* vars
client.commands = new Discord.Collection();
client.commands.aliases = new Discord.Collection();

fs.readdir('./events/', (err, files) => {
    if (err) console.error(err); //* logs error
    files.forEach(file => {
        if (!file.endsWith('.js')) return console.log(clc.red('[Error] Non-JS file found')) //* if  non js file is found inside the /events/ folder is found return an error
        const event = require(`./events/${file}`);
        let eventName = file.split('.')[0];
        client.on(eventName, event.bind(null, client));
    });
});

//*login
client.login(config.token);