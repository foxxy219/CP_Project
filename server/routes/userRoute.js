const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');

// Route for creating a new user
// router.post('/users', userController.createUser);
router.post('/sign-up', userController.signUp);
router.post('/login', userController.login);
// router.post('/loginWithGoogle', userController.loginWithGoogle);
// router.post('/updateUser ', authenticate, userController.updateProfile);
module.exports = router;
