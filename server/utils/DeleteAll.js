const mongoose = require("mongoose");
const User = require("../models/UserModel");
const HW_UserCredential = require("../models/HW_UserCredentialDataModel");
const Attendance = require("../models/AttendanceModel");
//Delete all date from user collection
const deleteAllUser = async () => {
    try {
        const result = await User.deleteMany({});
        console.log(result);
    } catch (error) {
        console.error(error);
    }
};

//Delete all date from user credential collection
const deleteAllUserCredential = async () => {
    try {
        const result = await HW_UserCredential.deleteMany({});
        console.log(result);
    } catch (error) {
        console.error(error);
    }
};

//Delete all date from attendance collection
const deleteAllAttendance = async () => {
    try {
        const result = await Attendance.deleteMany({});
        console.log(result);
    } catch (error) {
        console.error(error);
    }
};

module.exports = { deleteAllUser, deleteAllUserCredential, deleteAllAttendance };
