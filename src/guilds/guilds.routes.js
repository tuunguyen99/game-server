const express = require('express');
const router = express.Router();
const guildsController = require('./guilds.controller');
const guildMiddleware = require('./guilds.middlewares');

router.post('/webhook', guildsController.webHook);
router.get(
  '/validate-kick-member',
  guildMiddleware.isGameServerAuth,
  guildsController.validateKickMember
);
module.exports = router;