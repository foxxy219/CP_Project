const mongoose = require('mongoose');
const Attendance = require('../models/AttendanceModel');


// This Function store the attendance data to the backlog collection then reset the attendance of the user to default value at the end of the day (00:00:00)
// This function will stop the updateAttendance function from running at 10:00 PM and store current data, and will run again at 00:00 AM to reset the attendance of the user to default value
var stopUpdateAttendance = false;

const storeAndResetAttendance = async () => {
    try {
        const now = new Date();
        const localNow = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
        const localNowTimestamp = Math.floor(localNow.getTime() / 1000);


        const attendanceRecords = await Attendance.find();

        // Calculate working hours for each user
        for (const attendance of attendanceRecords) {
            if (attendance.clock_in_time && attendance.clock_out_time && attendance.status === 'Present') {
                const workingHoursInSeconds = Math.abs(attendance.clock_out_time - attendance.clock_in_time) / 1000;
                // Convert working hours to hours and minutes
                const hours = Math.floor(workingHoursInSeconds / 3600);
                const minutes = Math.floor((workingHoursInSeconds % 3600) / 60);
                attendance.working_hours = hours + minutes / 60;
                console.log(`User ${attendance.user_id} worked for ${hours} hours and ${minutes} minutes.`);
                await attendance.save(); // Save the updated attendance record
            }
        }

        // Reset attendance for the next day

    } catch (error) {
        console.error(error);
        // Handle the error as needed
    }
};

module.exports = storeAndResetAttendance;
