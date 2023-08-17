const bcrypt = require('bcryptjs');
const User = require('../models/UserModel.js');
const UserCredential = require('../models/HW_UserCredentialDataModel.js');
const Attendance = require('../models/AttendanceModel.js');
const HW_UserCredential = require('../models/HW_UserCredentialDataModel');
const Joi = require('joi');
const uuid4 = require("uuid4");
const jwt = require('jsonwebtoken');
const secret_key = require('../config/index.js').auth.jwtSecretKey;
const { verify } = require("jsonwebtoken");
const express = require('express');

// Validation schema for update rfid
const updateRfidSchema = Joi.object({
    user_id: Joi.string().required().messages({"string.empty": "Please provide user_id"}),
    rfid_data: Joi.string().required().messages({"string.empty": "Please provide rfid"}),
});

//Update rfid for user
const updateRfid = async (req, res) => {
    try {
        const currentUser = req.user;
        const { user_id, rfid_data } = req.body;
        // Check if the current user is an admin
        if (currentUser.role !== 'admin') {
            return res.status(403).send('You are not authorized to update rfid for user');
        }
        // Validate the request body against the updateRfidSchema
        const { error, value } = updateRfidSchema.validate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        // Check if the user exists in the database
        const user = await User.findOne({user_id : value.user_id});
        if (!user) {
            return res.status(404).send('User not found');
        }
        // Check if the rfid exists in the database
        const userRfid = await HW_UserCredential.findOne({ rfid_data : value.rfid_data });
        if (userRfid) {
            return res.status(409).send('Rfid already exists');
        }
        // Update the rfid for the user
        const updatedUser = await HW_UserCredential.findOneAndUpdate({ user_id }, { rfid_data }, { new: true });
        return res.status(200).send(updatedUser);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error' + error);
    }
}

module.exports = { updateRfid };