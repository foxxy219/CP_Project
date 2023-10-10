const fs = require('fs');
const PDFDocument = require('pdfkit');
const createPDF = require('csv-writer').createObjectCsvWriter;
const createCsvWriter = require('csv-writer').createObjectCsvWriter;



function isoDate (userAttendance){
    const date = new Date(userAttendance);
    const isoDate = date.toISOString().split('T')[0];
    return isoDate;
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
    const isoDateValue = isoDate(userAttendance.clock_out_time);
    const csvFileName = `attendance_${userAttendance.user_id}_${isoDateValue}.csv`;
    const csvWriter = createCsvWriter({
        path: csvFileName,
        header: [
            { id: 'user_id', title: 'User ID' },
            { id: 'working_hours', title: 'Working Hours' },
            // Add more columns as needed
        ],
    });

    const records = [
        {
            user_id: userAttendance.user_id,
            working_hours: userAttendance.working_hours,
            // Add more columns as needed
        },
    ];

    await csvWriter.writeRecords(records);

    return csvFileName;
}

module.exports = { generatePDF, generateCSV };