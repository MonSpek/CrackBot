const mongoose = require('mongoose');

const crackSchema = mongoose.Schema({
    userID: String,
    serverID: String,
    crackAmt: Number,
    crackSmoked: Number
})

module.exports = mongoose.model("crack", crackSchema);