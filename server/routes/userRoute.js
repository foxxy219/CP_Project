const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');

// Route for creating a new user
router.post('/users', userController.createUser);

module.exports = router;
