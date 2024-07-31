const express = require('express');
const router = express.Router();
const guildsController = require('./guilds.controller');
router.post('/webhook', guildsController.webHook);
module.exports = router;