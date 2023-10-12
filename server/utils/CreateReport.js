const fs = require('fs');
const { date } = require('joi');
const PDFDocument = require('pdfkit');
const createPDF = require('csv-writer').createObjectCsvWriter;
const createCsvWriter = require('csv-writer').createObjectCsvWriter;



function isoDate(userAttendance) {
    const date = new Date(userAttendance);
    const isoDate = date.toISOString().split('T')[0];
    return isoDate;
}

function isoTime(userAttendance) {
    const date = new Date(userAttendance);
    const isoTime = date.toISOString().split('T')[1].split('.')[0];
    return isoTime;
}

// Function to generate a PDF file for a user's attendance
async function generatePDF(userAttendance) {
    const doc = new PDFDocument();
    const isoDateValue = isoDate(userAttendance.clock_out_time);
    const pdfFileName = `a_${userAttendance.user_id}_${isoDateValue}.pdf`;

    doc.pipe(fs.createWriteStream(pdfFileName));

    doc.text(`User ID: ${userAttendance.user_id}`);
    doc.text(`Clock In Time: ${userAttendance.clock_in_time}`);
    doc.text(`Clock Out Time: ${userAttendance.clock_out_time}`);
    doc.text(`Date: ${userAttendance.date}`);
    doc.text(`Working Hours: ${userAttendance.working_hours} hours`);
    doc.text(`Status: ${userAttendance.status}`);

    doc.end();

    // Create a buffer to store the PDF content
    return new Promise((resolve) => {
        const buffers = [];
        doc.on('data', (buffer) => buffers.push(buffer));
        doc.on('end', () => {
            const pdfBuffer = Buffer.concat(buffers);
            resolve(pdfBuffer);
        });
    });


}

// Function to generate a CSV file for a user's attendance
async function generateCSV(userAttendance) {
    const isoClockoutDateValue = isoDate(userAttendance.clock_out_time);
    const isoClockinDateValue = isoDate(userAttendance.clock_in_time);
    const isoClockoutTimeValue = isoTime(userAttendance.clock_out_time);
    const isoClockinTimeValue = isoTime(userAttendance.clock_in_time);
    const csvFileName = `attendance_${userAttendance.user_id}.csv`;

    const dataToAppend = [
        userAttendance.user_id,
        isoClockinTimeValue,
        isoClockoutTimeValue,
        isoClockinDateValue,
        isoClockoutDateValue,
        userAttendance.working_hours,
        userAttendance.status,
    ].join(','); // Create a comma-separated string

    if (fs.existsSync(csvFileName)) {
        // File exists, read existing data
        const existingData = fs.readFileSync(csvFileName, 'utf-8');

        // Append the new data to the existing data
        const newData = `${existingData}\n${dataToAppend}`;

        // Write the combined data back to the file
        fs.writeFileSync(csvFileName, newData);
        console.log('CSV file updated successfully');
    } else {
        // Create a new CSV file
        const header = 'User ID,Clock In Time,Clock Out Time,Clock In Date,Clock Out Date,Working Hours,Status\n';
        const newData = `${header}${dataToAppend}`;

        fs.writeFileSync(csvFileName, newData);
        console.log('CSV file created successfully');
    }
}


module.exports = { generatePDF, generateCSV };