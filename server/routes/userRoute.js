const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');
const { authenticate } = require('../middleware');
// Route for creating a new user
// router.post('/users', userController.createUser);
router.post('/login', userController.login);
router.post('/change-password', authenticate, userController.changePassword);
router.post('/logout', userController.logout);
router.post('/signup', userController.Test_signup);
router.get('/get-current-user', authenticate, userController.getCurrentUser);
router.post('/get-user-by-object-id/', authenticate, userController.getUserByObjectId);


module.exports = router;
