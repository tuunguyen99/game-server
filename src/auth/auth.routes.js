const express = require('express');
const router = express.Router();
const authController = require('./auth.controllers');

router.post('/loginGuest', authController.loginGuest);

module.exports = router;
