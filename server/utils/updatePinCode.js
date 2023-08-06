

const UserCredential = require('../models/HW_UserCredentialDataModel.js');

function updatePinCode() {
  setInterval(async () => {
    try {
      const users = await UserCredential.find({});

      users.forEach(async (userCredential) => {
        const pinCode = Math.floor(100000 + Math.random() * 900000);
        userCredential.pin_code = pinCode;
        await userCredential.save();
      });

      console.log('Pin codes updated successfully');
    } catch (error) {
      console.error('Error updating pin codes:', error);
    }
  }, 60000); // Update pin code every minute (60000 milliseconds)
}

module.exports = { updatePinCode };
