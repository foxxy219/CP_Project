
const otplib = require('otplib');
const UserCredential = require('../models/HW_UserCredentialDataModel.js');

function generateTOTP(secretKey) {
  return otplib.authenticator.generate(secretKey);
}

async function updatePinCode() {
  try {
    const users = await UserCredential.find({});
    
    // Parallelize the database update operations using Promise.all
    await Promise.all(users.map(async (userCredential) => {
      const secretKey = userCredential.secret_key;
      const pinCode = generateTOTP(secretKey);
      console.log(`User ${userCredential.user_id} pin code: ${pinCode}`);
      userCredential.pin_code = pinCode;
      await userCredential.save();
    }));

    console.log('Pin codes updated successfully');
  } catch (error) {
    console.error('Error updating pin codes:', error);
  }
}

// Update pin code every minute (60000 milliseconds)
setInterval(updatePinCode, 60000);

module.exports = { updatePinCode };