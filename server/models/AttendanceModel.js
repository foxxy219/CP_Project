const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    event_id: { type: String, required: true },
    date: { type: Date.now, required: true },
    clock_in_time: { type: Date.now, required: true },
    clock_out_time: { type: Date.now, required: true },
    status: { type: String, required: true, default: "Absent" },
    note: { type: String, required: true },
},
{
    timestamps: true,
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;