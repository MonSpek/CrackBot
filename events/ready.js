const clc = require('cli-colors');

module.exports = async (client) => {
    //*vars
    let pNonPSer = (client.guilds.size > 1) ? 'Servers' : 'Server';
    let pNonPUsr = (client.users.size > 1) ? 'Users' : 'User';
    console.log(clc.yellow(`\n\n${client.user.username} is online\nOperating on ${client.guilds.size} ${pNonPSer}. \nUsed by ${client.users.size} ${pNonPUsr}.\n\n`)); //* logs on activity to console
    client.setInterval(() => {
        client.user.setActivity(`${client.users.size} hustlas`, { type: "WATCHING" }) //Sets a status
    }, 60000);
}