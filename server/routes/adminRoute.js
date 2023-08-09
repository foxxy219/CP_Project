const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate } = require('../middleware');
// Route for creating a new user
// router.post('/users', userController.createUser);
router.post('/register',authenticate,  adminController.registerForNewUser);
router.post('/deactive-user', authenticate, adminController.DeactivateUser);
router.post('/active-user', authenticate, adminController.ActivateUser);
router.post('/change-role', authenticate, adminController.changeUserRole);

module.exports = router;