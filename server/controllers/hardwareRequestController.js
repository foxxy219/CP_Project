const mongoose = require('mongoose');
const HW_UserCredential = require('../models/HW_UserCredentialDataModel');
const Attendance = require('../models/AttendanceModel');
const { date, bool, boolean } = require('joi');
const { storeAttendance } = require('../utils/StoreAndResetAttendance');


const TimeNow = new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' });
const localNow = new Date(TimeNow);
const HourMinSecfromLocalNow = localNow.getHours() + ":" + localNow.getMinutes() + ":" + localNow.getSeconds();
console.log(HourMinSecfromLocalNow);

function checkInValidTime() {
    if (HourMinSecfromLocalNow > '22:00:00' && HourMinSecfromLocalNow < '23:59:59') {
        return false;
    }
    else {
        return true;
    }
}

// Function to check for L1 secure level (either RFID or PIN code)
const checkForL1SecureLevel = async (req, res, next) => {
    const inCheck = checkInValidTime();
    if (inCheck) {
        try {
            const { rfid_data, pin_code } = req.body;

            if (rfid_data && pin_code) {
                return res.status(400).send('Please provide either RFID or PIN code, not both.');
            }

            if (pin_code) {
                const result = await checkForPinCode(pin_code);
                return res.status(result.status).send({ userId: result.userId, message: result.message });
            }

            if (rfid_data) {
                const result = await checkForRFIDData(rfid_data);
                return res.status(result.status).send({ userId: result.userId, message: result.message });
            }

            return res.status(400).send('Please provide RFID or PIN code.');
        } catch (error) {
            console.error(error);
            return res.status(500).send('Internal Server Error: ' + error);
        }
    }
    else {
        return res.status(400).send('End of checkin or checkout time is 10PM, please try again after 12PM.');
    }
}

// Function to check for PIN code
const checkForPinCode = async (pin_code) => {
    const userPinCode = await HW_UserCredential.findOne({ pin_code: pin_code });

    if (!userPinCode) {
        return { status: 404, message: 'PIN code not found.' };
    }

    const userId = userPinCode.user_id;
    await updateAttendance(userId, true);

    return { status: 200, message: 'Check for L1 is successful', userId };
}

// Function to check for RFID data
const checkForRFIDData = async (rfid_data) => {
    const userRfid = await HW_UserCredential.findOne({ rfid_data: rfid_data });

    if (!userRfid) {
        return { status: 404, message: 'RFID data not found.' };
    }

    const userId = userRfid.user_id;
    await updateAttendance(userId, true);

    return { status: 200, message: 'Check for L1 is successful', userId };
}


// Define the updateAttendance function
const updateAttendance = async (user_id, access_in) => {
    const now = new Date();
    const localNow = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
    const localNowTimestamp = Math.floor(localNow.getTime() / 1000);
    try {
        // Find the attendance record for the user and date
        const attendance = await Attendance.findOne({ user_id });
        // Define the current date, use for timestamp in attendance, this is current date in UTC+7 in user's timezone
        if (!attendance) {

            // Create a new attendance record if not found
            await Attendance.create({
                user_id,
                date: localNow,
                access_in,
                status: 'Present', // Assuming 'Present' status when access_in is true
                clock_in_time: localNow,
            });
        } else if (access_in) {
            attendance.access_in = access_in;
            attendance.status = 'Present';
            if (!attendance.clock_in_time) {
                attendance.clock_in_time = localNow;
            } else if (attendance.clock_in_time && !attendance.clock_out_time) {
                let currentTime = localNow;
                if (currentTime > attendance.clock_in_time) {
                    attendance.clock_out_time = currentTime;
                }
            }
            else if (attendance.clock_in_time && attendance.clock_out_time) {
                let currentTime = localNow;
                if (currentTime > attendance.clock_out_time) {
                    attendance.clock_out_time = currentTime;
                }
            }
        }
        else if (attendance) {
            attendance.access_in = access_in;
            attendance.status = 'Present';
            if (!attendance.clock_in_time) {
                attendance.clock_in_time = localNow;
            } else if (attendance.clock_in_time && !attendance.clock_out_time) {
                let currentTime = localNow;
                if (currentTime > attendance.clock_in_time) {
                    attendance.clock_out_time = currentTime;
                }
            }
            else if (attendance.clock_in_time && attendance.clock_out_time) {
                let currentTime = localNow;
                if (currentTime > attendance.clock_out_time) {
                    attendance.clock_out_time = currentTime;
                }
            }
        }
        await attendance.save();
        console.log(attendance);
    } catch (error) {
        console.error(error);
        // Handle the error as needed
    }
};

module.exports = { checkForL1SecureLevel };