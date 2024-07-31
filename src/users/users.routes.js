const express = require('express');
const router = express.Router();
const usersControllers=require('./users.controllers')

router.get('/profile', usersControllers.profile);
router.post('/updateProfile', usersControllers.updateProfile);
router.post('/updateHighScore', usersControllers.updateHighScore);

module.exports = router;
