import MyClassesCard from "../../layouts/cards/MyClassesCard";
import AttendanceCard from "../../layouts/cards/AttendanceCard";
import AssignmentCard from "../../layouts/cards/AssignmentCard";
import ExamCard from "../../layouts/cards/ExamCard";
import NoticeCard from "../../layouts/cards/NoticeCard";
import AttendanceChartCard from "../../layouts/cards/AttendanceChartCard.jsx";

export default function TeacherDashboard({ data }) {
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <MyClassesCard classes={data.classes} />
      <AttendanceCard attendance={data.attendance} />

      <AssignmentCard assignments={data.assignments} />
      <ExamCard exams={data.exams} />
      {/* <AttendanceChartCard data={data.weeklyAttendance} /> */}
      <NoticeCard notices={data.notices} />
    </div>
  );
}
