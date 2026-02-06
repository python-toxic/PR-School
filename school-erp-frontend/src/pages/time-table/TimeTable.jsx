import { useState } from "react";
import { Clock, Edit2, Save, X, Eye } from "lucide-react";
import { useUser } from "../../context/UserContext.jsx";
import { ROLES } from "../../constants/roles.js";

// Generate time table for a class
const generateTimeTable = (classId) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const subjects = ["English", "Mathematics", "Science", "Social Studies", "Computer Science", "Physical Education", "Art & Craft", "Music", "Hindi"];
  const teachers = ["Ms. Sarah", "Mr. Amit", "Dr. Neha", "Mr. Vikram", "Mr. Rohan", "Mr. Arjun", "Ms. Priya", "Mr. Suresh"];
  const timeSlots = ["09:00-10:00", "10:00-11:00", "11:00-11:30", "11:30-12:30", "12:30-01:30"];
  
  const schedule = [];
  days.forEach(day => {
    timeSlots.forEach((time, index) => {
      if (time === "11:00-11:30") {
        schedule.push({ day, time, subject: "Break", teacher: "-" });
      } else if (time === "11:30-12:30" && day === "Friday") {
        schedule.push({ day, time, subject: "Assembly", teacher: "-" });
      } else {
        const subjectIndex = (days.indexOf(day) + index) % subjects.length;
        const teacherIndex = (days.indexOf(day) + index) % teachers.length;
        schedule.push({
          day,
          time,
          subject: subjects[subjectIndex],
          teacher: teachers[teacherIndex]
        });
      }
    });
  });
  
  return schedule;
};

// Generate all classes with time tables
const generateAllTimeTable = () => {
  const timeTable = {};
  for (let classNum = 1; classNum <= 10; classNum++) {
    for (let sectionIndex = 0; sectionIndex < 3; sectionIndex++) {
      const section = String.fromCharCode(65 + sectionIndex); // A, B, C
      const classId = `${classNum}-${section}`;
      timeTable[classId] = generateTimeTable(classId);
    }
  }
  return timeTable;
};

const sampleTimeTable = generateAllTimeTable();

export default function TimeTable() {
  const { user } = useUser();
  const userRole = user?.role;
  const isAdminOrSuperAdmin = userRole === ROLES.ADMIN || userRole === ROLES.SUPER_ADMIN;

  const [activeTab, setActiveTab] = useState("view");
  const [selectedClass, setSelectedClass] = useState("1-A");
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [editingCell, setEditingCell] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [message, setMessage] = useState("");

  const classes = Object.keys(sampleTimeTable);
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlots = ["09:00-10:00", "10:00-11:00", "11:00-11:30", "11:30-12:30", "12:30-01:30"];

  const currentTimeTable = sampleTimeTable[selectedClass] || [];

  // Get unique time slots for the selected class
  const getTimeSlots = () => {
    const slots = new Set();
    currentTimeTable.forEach(item => slots.add(item.time));
    return Array.from(slots).sort();
  };

  // Get schedule for a specific day and time
  const getScheduleItem = (day, time) => {
    return currentTimeTable.find(item => item.day === day && item.time === time);
  };

  const handleEditStart = () => {
    setEditingSchedule(JSON.parse(JSON.stringify(currentTimeTable)));
  };

  const handleEditCell = (day, time, field) => {
    const item = editingSchedule.find(s => s.day === day && s.time === time);
    if (item) {
      setEditingCell({ day, time, field });
      setTempValue(item[field]);
    }
  };

  const handleSaveCell = () => {
    if (editingCell) {
      const item = editingSchedule.find(
        s => s.day === editingCell.day && s.time === editingCell.time
      );
      if (item) {
        item[editingCell.field] = tempValue;
      }
      setEditingCell(null);
    }
  };

  const handleSaveSchedule = () => {
    setMessage("✅ Time table updated successfully!");
    setTimeout(() => {
      setMessage("");
      setEditingSchedule(null);
    }, 2000);
  };

  const handleCancel = () => {
    setEditingSchedule(null);
    setEditingCell(null);
  };

  const slots = getTimeSlots();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Clock size={28} className="text-blue-600" />
          Time Table
        </h1>
        <p className="text-sm text-gray-500 mt-1">View and manage class schedules</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("view")}
            className={`flex-1 px-4 py-3 font-medium transition ${
              activeTab === "view"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Eye size={18} className="inline mr-2" />
            View Time Table
          </button>
          {isAdminOrSuperAdmin && (
            <button
              onClick={() => setActiveTab("update")}
              className={`flex-1 px-4 py-3 font-medium transition ${
                activeTab === "update"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Edit2 size={18} className="inline mr-2" />
              Update Time Table
            </button>
          )}
        </div>
      </div>

      {/* Class Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Click & Select Class
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {classes.map(cls => (
            <button
              key={cls}
              onClick={() => {
                setSelectedClass(cls);
                setEditingSchedule(null);
                setEditingCell(null);
              }}
              className={`px-3 py-2 rounded-lg font-medium transition text-sm ${
                selectedClass === cls
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cls}
            </button>
          ))}
        </div>
      </div>

      {/* View Time Table Tab */}
      {activeTab === "view" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Class {selectedClass} - Schedule
          </h2>

          {/* Time Table Grid */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="border border-gray-300 px-4 py-3 text-left font-bold">Time</th>
                  {days.map(day => (
                    <th key={day} className="border border-gray-300 px-4 py-3 text-center font-bold">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {slots.map(time => (
                  <tr key={time} className="hover:bg-blue-50">
                    <td className="border border-gray-300 px-4 py-3 font-semibold bg-gray-100 text-gray-900">
                      {time}
                    </td>
                    {days.map(day => {
                      const item = getScheduleItem(day, time);
                      const isBreak = item?.subject === "Break";
                      const isAssembly = item?.subject === "Assembly";

                      return (
                        <td
                          key={`${day}-${time}`}
                          className={`border border-gray-300 px-4 py-3 text-center ${
                            isBreak
                              ? "bg-amber-100"
                              : isAssembly
                              ? "bg-purple-100"
                              : "bg-white"
                          }`}
                        >
                          {item ? (
                            <div>
                              <div className="font-bold text-gray-900">{item.subject}</div>
                              <div className="text-xs text-gray-600">{item.teacher}</div>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Update Time Table Tab */}
      {activeTab === "update" && (
        <>
          {isAdminOrSuperAdmin ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Edit Class {selectedClass} - Schedule
              </h2>

              {!editingSchedule ? (
                <button
                  onClick={handleEditStart}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium inline-flex items-center gap-2"
                >
                  <Edit2 size={18} />
                  Click & Select to Edit Schedule
                </button>
              ) : (
                <div className="space-y-4">
                  {/* Edit Grid */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-blue-600 text-white">
                          <th className="border border-gray-300 px-4 py-3 text-left font-bold">Time</th>
                          {days.map(day => (
                            <th key={day} className="border border-gray-300 px-4 py-3 text-center font-bold">
                              {day}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {slots.map(time => (
                          <tr key={time} className="hover:bg-blue-50">
                            <td className="border border-gray-300 px-4 py-3 font-semibold bg-gray-100 text-gray-900">
                              {time}
                            </td>
                            {days.map(day => {
                              const item = editingSchedule.find(s => s.day === day && s.time === time);
                              const isEditing =
                                editingCell?.day === day && editingCell?.time === time;

                              return (
                                <td
                                  key={`${day}-${time}`}
                                  className="border border-gray-300 px-2 py-2 text-center"
                                >
                                  {item ? (
                                    <div className="space-y-1">
                                      {/* Subject */}
                                      <div className="relative">
                                        {isEditing && editingCell.field === "subject" ? (
                                          <div className="flex gap-1">
                                            <input
                                              type="text"
                                              value={tempValue}
                                              onChange={(e) => setTempValue(e.target.value)}
                                              className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                                            />
                                            <button
                                              onClick={handleSaveCell}
                                              className="px-2 py-1 bg-green-600 text-white rounded text-xs"
                                            >
                                              ✓
                                            </button>
                                          </div>
                                        ) : (
                                          <div
                                            onClick={() => handleEditCell(day, time, "subject")}
                                            className="cursor-pointer p-2 bg-blue-50 rounded text-xs font-bold text-gray-900 hover:bg-blue-100"
                                          >
                                            {item.subject}
                                          </div>
                                        )}
                                      </div>

                                      {/* Teacher */}
                                      <div className="relative">
                                        {isEditing && editingCell.field === "teacher" ? (
                                          <div className="flex gap-1">
                                            <input
                                              type="text"
                                              value={tempValue}
                                              onChange={(e) => setTempValue(e.target.value)}
                                              className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                                            />
                                            <button
                                              onClick={handleSaveCell}
                                              className="px-2 py-1 bg-green-600 text-white rounded text-xs"
                                            >
                                              ✓
                                            </button>
                                          </div>
                                        ) : (
                                          <div
                                            onClick={() => handleEditCell(day, time, "teacher")}
                                            className="cursor-pointer p-2 bg-gray-100 rounded text-xs text-gray-600 hover:bg-gray-200"
                                          >
                                            {item.teacher}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-gray-400">-</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={handleSaveSchedule}
                      className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium inline-flex items-center gap-2"
                    >
                      <Save size={18} />
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition font-medium inline-flex items-center gap-2"
                    >
                      <X size={18} />
                      Cancel
                    </button>
                  </div>

                  {message && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                      {message}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <div className="text-6xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Access Restricted</h3>
              <p className="text-gray-600">
                Only Admin and Super Admin can update the time table. <br />
                You can view the time table using the "View Time Table" tab.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
