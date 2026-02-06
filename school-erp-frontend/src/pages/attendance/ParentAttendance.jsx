import { useState } from "react";
import { useUser } from "../../context/UserContext.jsx";
import { attendanceData } from "../../data/Parent/attendance.data.js";
import AttendanceViewer from "../../components/common/AttendanceViewer.jsx";

export default function ParentAttendance() {
  const { user } = useUser();
  const childId = user.childId; // 👈 important

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const attendance =
    fromDate && toDate
      ? attendanceData.filter(
          (rec) =>
            rec.studentId === childId &&
            new Date(rec.date) >= new Date(fromDate) &&
            new Date(rec.date) <= new Date(toDate)
        )
      : [];

  return (
    <AttendanceViewer
      title="👨‍👩‍👦 Child Attendance"
      attendance={attendance}
      fromDate={fromDate}
      toDate={toDate}
      setFromDate={setFromDate}
      setToDate={setToDate}
    />
  );
}
