
import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext.jsx";
import { useAcademicsService } from "../../hooks/useRoleServices.js";
import WeeklyTimetable from "../../components/Academics/WeeklyTimetable.jsx";
import AdminAcademicsControls from "../../components/Academics/AdminAcademicsControls.jsx";
import AdminTimetableEditor from "../../components/Academics/AdminTimetableEditor.jsx";

export default function Academics() {
  const { user } = useUser();
  const academicsService = useAcademicsService();

  const [timetable, setTimetable] = useState([]);
  const [mode, setMode] = useState("VIEW"); // VIEW | EDIT

  useEffect(() => {
    if (user.role === "STUDENT" || user.role === "TEACHER") {
      academicsService.getTimetable().then(setTimetable);
    }
  }, [user.role]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Academics</h2>

      {/* 🔹 ADMIN MODE SWITCH */}
      {user.role === "ADMIN" && (
        <div className="flex gap-2">
          <button
            onClick={() => setMode("VIEW")}
            className={`px-4 py-2 rounded ${
              mode === "VIEW" ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            View Timetable
          </button>

          <button
            onClick={() => setMode("EDIT")}
            className={`px-4 py-2 rounded ${
              mode === "EDIT" ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            Design Timetable
          </button>
        </div>
      )}

      {/* 🔹 ADMIN VIEW MODE */}
      {user.role === "ADMIN" && mode === "VIEW" && (
        <AdminAcademicsControls setTimetable={setTimetable} />
      )}

      {/* 🔹 ADMIN EDIT MODE */}
      {user.role === "ADMIN" && mode === "EDIT" && (
        <AdminTimetableEditor />
      )}

      {/* 🔹 TIMETABLE DISPLAY */}
      {timetable.length > 0 && mode === "VIEW" && (
        <WeeklyTimetable
          timetable={timetable}
          mode={
            user.role === "TEACHER"
              ? "teacher"
              : user.role === "ADMIN"
              ? "admin"
              : "student"
          }
        />
      )}
    </div>
  );
}
