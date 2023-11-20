const mongoose = require('mongoose');
const Attendance = require('../models/AttendanceModel');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

console.log(process.cwd());

const getAttendance = async (req, res) => {
    try {
        const user_id = req.body.user_id;

        if (!user_id) {
            return res.status(400).send('Please provide user_id');
        }

        // Check if the user exists in the database
        const user = await Attendance.findOne({ user_id: user_id });

        if (!user) {
            return res.status(404).send('User not found');
        }

        const fileName = `attendance_${user_id}_`;
        const folderPath = process.cwd(); // or provide the actual folder path
        const matchingFiles = fs.readdirSync(folderPath).filter(fn => fn.startsWith(fileName));
        console.log(matchingFiles);

        if (matchingFiles.length === 0) {
            return res.status(404).send('Attendance files not found');
        }

        // Read and parse data from all matching files
        let combinedJsonData = [];

        for (const file of matchingFiles) {
            const filePath = path.join(folderPath, file);

            const jsonData = await new Promise((resolve, reject) => {
                const data = [];
                fs.createReadStream(filePath)
                    .pipe(csv())
                    .on('data', (row) => {
                        data.push(row);
                    })
                    .on('end', () => {
                        resolve(data);
                    })
                    .on('error', (error) => {
                        reject(error);
                    });
            });

            combinedJsonData = combinedJsonData.concat(jsonData);
        }

        return res.status(200).json({
            attendanceData: combinedJsonData,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error: ' + error);
    }
};

module.exports = { getAttendance };
