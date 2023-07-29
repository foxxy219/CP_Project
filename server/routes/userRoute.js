const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');
const { authenticate } = require('../middleware');
// Route for creating a new user
// router.post('/users', userController.createUser);
router.post('/login', userController.login);
router.post('/change-password', authenticate, userController.changePassword);

module.exports = router;
