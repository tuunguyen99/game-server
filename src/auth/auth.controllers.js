const User = require('../users/users.models');
const jwt = require("jsonwebtoken");

exports.loginGuest = async (req, res) => {
	const deviceId = req.body.deviceId;
	let user = await User.findOne({ deviceId });
	if (!user) {
		user = new User({
			deviceId: deviceId,
			name: 'Username',
			highscore: 0,
		})
		user.name+=(' '+user.id)
		await user.save();
	}
	const accessToken = jwt.sign(
		{
			id: user._id
		},
		process.env.ACCESS_TOKEN_SECRET,
		{
			algorithm: 'HS256',
			expiresIn: '7d',
		});
	res.send({
		accessToken,
		user
	});
};