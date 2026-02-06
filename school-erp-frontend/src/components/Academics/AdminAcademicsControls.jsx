import { useState, useEffect } from "react";
import { useAcademicsService } from "../../hooks/useRoleServices.js";
import WeeklyTimetable from "./WeeklyTimetable";

export default function AdminAcademicsControls() {
  const academicsService = useAcademicsService();

  const [mode, setMode] = useState("CLASS"); // CLASS | TEACHER
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState("");
  const [timetable, setTimetable] = useState([]);

  useEffect(() => {
    if (mode === "CLASS") {
      academicsService.getClasses().then(setOptions);
    } else {
      academicsService.getTeachers().then(setOptions);
    }
  }, [mode]);

  const handleSearch = () => {
    if (mode === "CLASS") {
      academicsService.getClassTimetable(selected).then(setTimetable);
    } else {
      academicsService.getTeacherTimetable(selected).then(setTimetable);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode("CLASS")}
          className={`px-4 py-2 rounded ${
            mode === "CLASS" ? "bg-blue-600 text-white" : "bg-gray-100"
          }`}
        >
          Class Timetable
        </button>
        <button
          onClick={() => setMode("TEACHER")}
          className={`px-4 py-2 rounded ${
            mode === "TEACHER" ? "bg-blue-600 text-white" : "bg-gray-100"
          }`}
        >
          Teacher Timetable
        </button>
      </div>

      {/* Dropdown */}
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="border rounded p-2"
      >
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>

      <button
        onClick={handleSearch}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Search
      </button>

      {/* Timetable */}
      {timetable.length > 0 && (
        <WeeklyTimetable timetable={timetable} mode="admin" />
      )}
    </div>
  );
}
