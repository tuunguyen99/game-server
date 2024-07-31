const mongoose = require("mongoose");

const Guild = mongoose.model(
    "Guild",
    new mongoose.Schema({
        name: String,
        guildId: String,
        guildAddress: String,
        owner: String,
        users: [String]
    })
);

module.exports = Guild;