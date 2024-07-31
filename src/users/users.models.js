const mongoose = require("mongoose");
const User = mongoose.model(
	"User",
	new mongoose.Schema({
		deviceId: String,
		name: String,
		highscore: Number,
	}));

module.exports = User;