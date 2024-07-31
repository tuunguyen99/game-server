const User = require('../users/users.models');
const jwt = require('jsonwebtoken');
async function verifyJwt(token) {
	return await new Promise((resolve, reject) => jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => err ? reject(err) : resolve(decoded)));
}
exports.isAuth = async (req, res, next) => {
	let token = req.headers.authorization;
	token = token != undefined && token.startsWith("Bearer ") ? token.substring(7, token.length) : null;
	try {
		const verified = await verifyJwt(token);
		console.log(verified);
		const user = await User.findById(verified.id);
		console.log(user);
		req.user = user;
		return next();
	} catch (err) {
		return res.status(401).send('Unauthorized!');
	}
};

