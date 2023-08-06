const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate } = require('../middleware');
// Route for creating a new user
// router.post('/users', userController.createUser);
router.post('/register',authenticate,  adminController.registerForNewUser);
// router.post('/delete-user', authenticate, adminController.deleteUser);
// router.post('/check-user-information', authenticate, adminController.checkUserInformation);

module.exports = router;