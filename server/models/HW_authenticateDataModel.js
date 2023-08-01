const mongoose = require("mongoose");

const AuthData = new mongoose.Schema({
    user_id: { type: String, required: true },
    pin_authenticated: { type: Boolean, required: true },
    rfid_authenticated: { type: Boolean, required: true },
    face_authenticated: { type: Boolean, required: true },
},
{
    timestamps: true,
});

const HW_AuthData = mongoose.model("HW_AuthData", AuthData);
module.exports = HW_AuthData;