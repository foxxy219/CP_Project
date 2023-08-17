const express = require('express');
const router = express.Router();
const hardwareRequestController = require('../controllers/hardwareRequestController.js');
const { authenticate } = require('../middleware');

router.post('/check-for-l1', authenticate, hardwareRequestController.checkForL1SecureLevel);


module.exports = router;
