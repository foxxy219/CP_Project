const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const DeleteAll = require('../utils/DeleteAll');
const userCredentialController = require('../controllers/userCredentialController');
const { authenticate } = require('../middleware');
// Route for creating a new user
// router.post('/users', userController.createUser);
router.post('/register',authenticate,  adminController.registerForNewUser);
router.post('/deactive-user', authenticate, adminController.DeactivateUser);
router.post('/activate-user', authenticate, adminController.ActivateUser);
router.post('/change-role', authenticate, adminController.changeUserRole);

router.post('/test-upload-image', authenticate, adminController.uploadImage);
// Update user authentication information
router.post('/update-rifd', authenticate, userCredentialController.updateRfid);

//Delete data, for testing purpose
router.post('/delete-user', authenticate, DeleteAll.deleteAllUser);
router.post('/delete-user-credential', authenticate, DeleteAll.deleteAllUserCredential);
router.post('/delete-attendance', authenticate, DeleteAll.deleteAllAttendance);

module.exports = router;
