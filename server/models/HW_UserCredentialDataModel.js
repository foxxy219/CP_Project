const mongoose = require("mongoose");

const UserAuthCredentialSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    pin_code : { type: String, required: true },
    rfid_data : { type: String },
    secret_key : { type: String , required: true},
},
{
    timestamps: true,
});

const HW_UserCredential = mongoose.model("HW_UserCredential", UserAuthCredentialSchema);
module.exports = HW_UserCredential;