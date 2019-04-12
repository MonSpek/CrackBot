const mongoose = require('mongoose');

const crackSchema = mongoose.Schema({
    userID: String,
    UserName: String,
    serverID: String,
    crackAmt: Number,
    crackSmoked: Number
})

module.exports = mongoose.model("crack", crackSchema);