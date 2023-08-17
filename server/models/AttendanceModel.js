const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    event_id: { type: String },
    access_in: { type: Boolean},
    date: { type: Date },
    clock_in_time: { type: Date },
    clock_out_time: { type: Date },
    status: { type: String, required: true, default: "Absent" },
    note: { type: String},
},
{
    timestamps: true,
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;