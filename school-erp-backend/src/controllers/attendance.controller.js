const Attendance = require('../models/Attendance');

// @desc    Mark attendance (Single or Bulk)
// @route   POST /api/attendance
// @access  Private (Teacher/Admin)
const markAttendance = async (req, res) => {
    const { classId, date, records } = req.body;
    // records: [{ studentId, status, remarks }]

    try {
        const attendanceRecords = records.map(record => ({
            student: record.studentId,
            class: classId,
            date: new Date(date),
            status: record.status,
            remarks: record.remarks
        }));

        // Use bulkWrite for efficiency or simple create for small batches
        // For simplicity/validation, we'll loop or use insertMany, 
        // but dealing with upserts (updating if exists) is better.

        // Simple approach: Delete existing for that day/class matching students and insert new
        // logic: "If I'm submitting attendance for Class 10 on Date X, overwrite previous submission"

        // For this MVP, let's just use insertMany and assume the frontend handles non-duplicates or we catch errors
        const created = await Attendance.insertMany(attendanceRecords);

        res.status(201).json({ message: 'Attendance marked', count: created.length });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get attendance by Class and Date
// @route   GET /api/attendance/class/:classId
// @access  Private
const getClassAttendance = async (req, res) => {
    const { classId } = req.params;
    const { date } = req.query;

    try {
        const query = { class: classId };
        if (date) {
            // Logic to match exact date ignoring time, or assume date passed is midnight strings
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            query.date = { $gte: startOfDay, $lte: endOfDay };
        }

        const attendance = await Attendance.find(query)
            .populate('student', 'rollNumber studentId')
            .populate({
                path: 'student',
                populate: { path: 'user', select: 'name' }
            });

        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { markAttendance, getClassAttendance };
