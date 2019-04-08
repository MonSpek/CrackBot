const Discord = require('discord.js'),
    config = require('./config.json'),
    fs = require('fs'),
    clc = require('cli-colors'),
    mongoose = require('mongoose');

//*core client
const client = new Discord.Client({
    disableEveryone: false,
    disabledEvents: [
        'TYPING_START',
        'USER_NOTE_UPDATE',
        'PRESENCE_UPDATE'
    ]
});

mongoose.connect(`mongodb+srv://CrackBot:${config.mPass}@crackbot-vjtvv.mongodb.net/crack?retryWrites=true`, {
    useNewUrlParser: true
});

client.on('guildMemberAdd', member => {
    let memberRole = member.guild.roles.find(r => r.name === 'Cowards');
    member.addRole(memberRole);
});

//* vars
client.commands = new Discord.Collection();
client.commands.aliases = new Discord.Collection();
client.prefix = 'c!';

//* Command handler
fs.readdirSync('./commands/').forEach(category => { //* Command Loader
    const commandFile = fs.readdirSync(`./commands/${category}`).filter(file => file.endsWith('.js'));
    for (const file of commandFile) {
        const props = require(`./commands/${category}/${file}`);
        let fileName = file.replace('.js', '');
        console.log(clc.cyan(`[${category}] `) + clc.magenta(`${fileName}`));
        client.commands.set(props.help.name, props);
        props.help.aliases.forEach(alias => {
            client.commands.aliases.set(alias, props.help.name);
        });
    }
});

//* Event handler
fs.readdir('./events/', (err, files) => {
    if (err) console.error(err); //* logs error
    files.forEach(file => {
        if (!file.endsWith('.js')) return console.log(clc.red('[Error] Non-JS file found')) //* if  non js file is found inside the /events/ folder is found return an error
        const event = require(`./events/${file}`);
        let eventName = file.split('.')[0];
        client.on(eventName, event.bind(null, client));
        delete require.cache[require.resolve(`./events/${file}`)];
    });
});

//*login
client.login(config.token);