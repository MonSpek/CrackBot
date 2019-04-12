const mongoose = require('mongoose');
const CRACK = require('../../models/crack.js')

module.exports.run = async (message, arg, client, errors, emb) => {
    await message.reply('Busta, would you like to smoke crack?');
    //message.channel.awaitMessages
}

module.exports.help = {
    name: "smoke",
    aliases: ['smokes'],
    description: "Allows to smoke some of Viper's crack"
}