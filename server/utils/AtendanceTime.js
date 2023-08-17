const mongoose = require('mongoose');
const Attendance = require('../models/AttendanceModel');

const updateAttendance = async (req, res) => {
    try {
        const currentUser = req.user;
        
        // Find the attendance record for the user and date
        const attendance = await Attendance.findOne({ currentUser, date: new Date() });

        if (!attendance) {
            return res.status(404).json({ error: 'Attendance record not found' });
        }

        if (access_in) {
            // If access_in is true, update the clock_in_time or clock_out_time
            if (!attendance.clock_in_time) {
                attendance.clock_in_time = new Date();
            } else if (attendance.clock_in_time && !attendance.clock_out_time) {
                const currentTime = new Date();
                if (currentTime > attendance.clock_in_time) {
                    attendance.clock_out_time = currentTime;
                }
            }
        }

        // Save the updated attendance record
        await attendance.save();

        return res.status(200).json({ message: 'Attendance record updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
