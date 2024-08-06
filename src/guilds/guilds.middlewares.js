const jwt = require('jsonwebtoken');

// TODO: Implement Auth for game server
exports.isGameServerAuth = async (req, res, next) => {
  return next();
  // let token = req.headers.authorization;
  // token = token != undefined && token.startsWith("Bearer ") ? token.substring(7, token.length) : null;
  // try {
	// 	if (token === process.env.GAME_SERVER_AUTH_TOKEN) {
  //     return next();
  //   }
  //   return res.status(401).send('Unauthorized!');
	// } catch (err) {
	// 	return res.status(401).send('Unauthorized!');
	// }
}
