const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const DeleteAll = require('../utils/DeleteAll');
const userCredentialController = require('../controllers/userCredentialController');
const resetAttendanceWithoutSaving = require('../utils/StoreAndResetAttendance');
const getAttendance = require('../controllers/attendanceController');
const { authenticate } = require('../middleware');
// Route for creating a new user
// router.post('/users', userController.createUser);
router.post('/register', adminController.registerForNewUser);
router.post('/deactive-user', authenticate, adminController.DeactivateUser);
router.post('/activate-user', authenticate, adminController.ActivateUser);
router.post('/change-role', authenticate, adminController.changeUserRole);
router.post('/get-all-user', authenticate, adminController.getAllUsers);

router.post('/test-upload-image', authenticate, adminController.uploadImage);
// Update user authentication information
router.post('/update-rifd', authenticate, userCredentialController.updateRfid);
router.post('/get-user-hardware-credential-by-user-id', userCredentialController.getUserHardwareCredentialbyUserId);
router.post('/get-all-rfid-data', authenticate, userCredentialController.getAllUserHardwareCredential);

//Delete data, for testing purpose
router.post('/delete-user', authenticate, DeleteAll.deleteAllUser);
router.post('/delete-user-credential', authenticate, DeleteAll.deleteAllUserCredential);
router.post('/delete-attendance', authenticate, DeleteAll.deleteAllAttendance);
router.post('/delete-user-by-id', authenticate, adminController.deleteUserByUserId);

router.post('/reset-attendance', authenticate, resetAttendanceWithoutSaving.resetAttendanceWithoutSaving);
router.post('/get-attendance', getAttendance.getAttendance);

// Update user information
router.put('/update-user/:user_id', authenticate, adminController.updateUserInfo);
module.exports = router;
