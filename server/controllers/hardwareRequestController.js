const mongoose = require('mongoose');
const HW_UserCredential = require('../models/HW_UserCredentialDataModel');
const Attendance = require('../models/AttendanceModel');
process.env.TZ = 'Asia/Ho_Chi_Minh';

//check for rfid data or pin code in the database
const checkForL1SecureLevel = async (req, res, next) => {
    try {
        const currentUser = req.user;
        const { rfid_data, pin_code } = req.body;

        //Check if both rfid data and pin code are existed in the request body
        if (rfid_data && pin_code) {
            return res.status(400).send('Please provide only rfid or pin code');
        }
        // Check if rfid_data is existed in the request body, if not, check for pin code
        if (!rfid_data) {
            if (!pin_code) {
                return res.status(400).send('Please provide rfid or pin code');
            }
            else {
                const userPinCode = await HW_UserCredential.findOne({ pin_code: pin_code });
                if (!userPinCode) {
                    return res.status(404).send('No pin code found');
                }
                if (userPinCode) {
                    const userId = userPinCode.user_id;
                    const response = {
                        message: 'Check for L1 is successful',
                        status: true,
                        userId,
                    };
                    res.status(200).send(response);
                    if (userId) {
                        const user_id = userId; // Assuming you have the user_id for whom to update the attendance
                        const access_in = true; // Set access_in to true
                        await updateAttendance(user_id, access_in);
                    }
                }
            }

        }

        //Check if pin code is existed in the request body, if not, check for rfid data
        if (!pin_code) {
            if (!rfid_data) {
                return res.status(400).send('Please provide rfid or pin code');
            }
            else {
                const userRfid = await HW_UserCredential.findOne({ rfid_data: rfid_data });
                if (!userRfid) {
                    return res.status(404).send('No rfid found');
                }
                if (userRfid) {
                    const userId = userRfid.user_id;
                    const response = {
                        message: 'Check for L1 is successful',
                        status: true,
                        userId,
                    };
                    res.status(200).send(response);
                    if (userId) {
                        const user_id = userId; // Assuming you have the user_id for whom to update the attendance
                        const access_in = true; // Set access_in to true
                        await updateAttendance(user_id, access_in);
                    }
                }
            }
        }


    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error' + error);

    }
}

// Define the updateAttendance function
const updateAttendance = async (user_id, access_in) => {
    try {
        // Find the attendance record for the user and date
        const attendance = await Attendance.findOne({ user_id });

        if (!attendance) {

            // Create a new attendance record if not found
            await Attendance.create({
                user_id,
                date: new Date(),
                access_in,
                status: 'Present', // Assuming 'Present' status when access_in is true
            });
        } else if (access_in) {
            // Update the clock_in_time or clock_out_time based on your logic
            attendance.access_in = access_in;
            if (!attendance.clock_in_time) {
                attendance.clock_in_time = new Date();
            } else if (attendance.clock_in_time && !attendance.clock_out_time) {
                let currentTime = new Date();
                if (currentTime > attendance.clock_in_time) {
                    attendance.clock_out_time = currentTime;
                }
            }
            else if (attendance.clock_in_time && attendance.clock_out_time) {
                let currentTime = new Date();
                if (currentTime > attendance.clock_out_time) {
                    attendance.clock_out_time = currentTime;
                }
            }
        }

        // Save the updated attendance record
        await attendance.save();
    } catch (error) {
        console.error(error);
        // Handle the error as needed
    }
};

module.exports = { checkForL1SecureLevel };