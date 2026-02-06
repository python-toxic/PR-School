import { useEffect, useState } from "react";
import { useAcademicsService } from "../../hooks/useRoleServices";

const PERIODS = [
  "09:00 - 09:45",
  "09:50 - 10:35",
  "10:40 - 11:25",
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function AdminTimetableEditor() {
  const academicsService = useAcademicsService();

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [timetable, setTimetable] = useState({});

  // Load dropdown data
  useEffect(() => {
    academicsService.getClasses?.().then(setClasses);
    academicsService.getSubjects?.().then(setSubjects);
    academicsService.getTeachers?.().then(setTeachers);
  }, []);

  // Initialize empty timetable when class changes
  useEffect(() => {
    if (!selectedClass) return;

    const initial = {};
    DAYS.forEach((day) => {
      initial[day] = PERIODS.map(() => ({
        subject: "",
        teacher: "",
      }));
    });

    setTimetable(initial);
  }, [selectedClass]);

  const updateCell = (day, periodIndex, field, value) => {
    setTimetable((prev) => ({
      ...prev,
      [day]: prev[day].map((p, i) =>
        i === periodIndex ? { ...p, [field]: value } : p
      ),
    }));
  };

  const handleSave = async () => {
    if (!selectedClass) return;

    await academicsService.saveTimetable({
      classId: selectedClass,
      timetable,
    });

    alert("Timetable saved successfully!");
  };

  return (
    <div className="border rounded-lg p-4 space-y-4 bg-white">
      <h3 className="text-lg font-semibold">Design Timetable</h3>

      {/* Class Selector */}
      <select
        value={selectedClass}
        onChange={(e) => setSelectedClass(e.target.value)}
        className="border rounded p-2 w-64"
      >
        <option value="">Select Class</option>
        {classes.map((cls) => (
          <option key={cls.id} value={cls.id}>
            {cls.name}
          </option>
        ))}
      </select>

      {/* Editable Grid */}
      {selectedClass && (
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-2 text-left">Day</th>
                {PERIODS.map((p) => (
                  <th key={p} className="p-2 text-center">
                    {p}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {DAYS.map((day) => (
                <tr key={day} className="border-t">
                  <td className="p-2 font-medium">{day}</td>

                  {timetable[day]?.map((cell, idx) => (
                    <td key={idx} className="p-2 space-y-1">
                      {/* Subject */}
                      <select
                        value={cell.subject}
                        onChange={(e) =>
                          updateCell(day, idx, "subject", e.target.value)
                        }
                        className="border rounded p-1 w-full"
                      >
                        <option value="">Subject</option>
                        {subjects.map((s) => (
                          <option key={s.id} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                      </select>

                      {/* Teacher */}
                      <select
                        value={cell.teacher}
                        onChange={(e) =>
                          updateCell(day, idx, "teacher", e.target.value)
                        }
                        className="border rounded p-1 w-full"
                      >
                        <option value="">Teacher</option>
                        {teachers.map((t) => (
                          <option key={t.id} value={t.name}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Save Button */}
      {selectedClass && (
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Save Timetable
        </button>
      )}
    </div>
  );
}
