import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext.jsx";
import { attendanceData } from "../../data/Student/attendance.data.js";
import AttendanceViewer from "../../components/common/AttendanceViewer.jsx";

export default function StudentAttendance() {
  const { user } = useUser();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [removedStudents, setRemovedStudents] = useState([]);

  useEffect(() => {
    const removed = JSON.parse(localStorage.getItem("removedStudents") || "[]");
    setRemovedStudents(removed);
  }, []);

  // Check if current student is removed
  const isFormerStudent = removedStudents.some(s => s.id === user.id);

  if (isFormerStudent) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-2xl mx-auto bg-white rounded-lg border border-red-200 p-8 text-center">
          <p className="text-red-600 font-semibold mb-2">Access Restricted</p>
          <p className="text-gray-600">
            This account has been removed from the school and cannot access attendance records.
          </p>
        </div>
      </div>
    );
  }

  const attendance =
    fromDate && toDate
      ? attendanceData.filter(
          (rec) =>
            rec.studentId === user.id &&
            new Date(rec.date) >= new Date(fromDate) &&
            new Date(rec.date) <= new Date(toDate)
        )
      : [];

  return (
    <AttendanceViewer
      title="📘 My Attendance"
      attendance={attendance}
      fromDate={fromDate}
      toDate={toDate}
      setFromDate={setFromDate}
      setToDate={setToDate}
    />
  );
}
