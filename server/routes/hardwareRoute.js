const express = require('express');
const router = express.Router();
const hardwareRequestController = require('../controllers/hardwareRequestController.js');
const { authenticate } = require('../middleware');

router.post('/check-for-l1', hardwareRequestController.checkForL1SecureLevel);
router.post('/check-for-l1-backup', hardwareRequestController.checkForL1SecureLevelBackup);
router.get('/get-all-rfid-data', authenticate, hardwareRequestController.getAllRFIDData);


module.exports = router;
