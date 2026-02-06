import { useState, useEffect, useMemo } from "react";
import {
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Heart,
  Save,
  Info,
} from "lucide-react";
import StudentListForAttendance from "./TeacherAttendance_StudentList.jsx";

const API_BASE = "http://localhost:4000";

export default function TeacherAttendancePage() {
  const today = new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedClass, setSelectedClass] = useState("Class 3");
  const [selectedSection, setSelectedSection] = useState("A");
  const [presentRolls, setPresentRolls] = useState("");
  const [students, setStudents] = useState([]);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch students from backend when class/section changes
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedClass || !selectedSection) return;
      
      setLoading(true);
      try {
        const response = await fetch(
          `${API_BASE}/api/students?classId=${encodeURIComponent(selectedClass)}&section=${encodeURIComponent(selectedSection)}`
        );
        if (response.ok) {
          const data = await response.json();
          const fetchedStudents = data.students || [];
          
          // Initialize attendance status for all students as absent
          const initialStatus = {};
          fetchedStudents.forEach((student) => {
            initialStatus[student._id] = "Absent";
          });
          setAttendanceStatus(initialStatus);
          setStudents(fetchedStudents);
        } else {
          console.error("Failed to fetch students");
          setStudents([]);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [selectedClass, selectedSection]);

  // Handle quick roll number input
  const handleQuickMarkPresent = () => {
    if (!presentRolls.trim()) return;

    const rollList = presentRolls
      .split(",")
      .map((r) => r.trim())
      .filter((r) => r);

    const newStatus = { ...attendanceStatus };
    students.forEach((student) => {
      const rollStr = String(student.rollNumber);
      if (rollList.includes(rollStr)) {
        newStatus[student._id] = "Present";
      } else {
        newStatus[student._id] = "Absent";
      }
    });

    setAttendanceStatus(newStatus);
  };

  // Toggle individual student status
  const handleToggleStatus = (studentId, status) => {
    setAttendanceStatus((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  // Calculate stats
  const stats = useMemo(() => {
    const total = students.length;
    const present = Object.values(attendanceStatus).filter((s) => s === "Present").length;
    const absent = Object.values(attendanceStatus).filter((s) => s === "Absent").length;
    const halfday = Object.values(attendanceStatus).filter((s) => s === "Halfday").length;
    const medical = Object.values(attendanceStatus).filter((s) => s === "Medical").length;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : "0.0";

    return { total, present, absent, halfday, medical, percentage };
  }, [students, attendanceStatus]);

  // Save attendance to backend
  const handleSaveAttendance = async () => {
    const attendanceRecords = students.map((student) => ({
      studentId: student._id,
      date: selectedDate,
      status: attendanceStatus[student._id]?.toLowerCase() || "absent",
      classId: selectedClass,
      schoolId: student.schoolId || "",
    }));

    try {
      const response = await fetch(`${API_BASE}/api/attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ records: attendanceRecords }),
      });

      if (response.ok) {
        alert(`Attendance saved successfully for ${selectedClass}-${selectedSection} on ${selectedDate}`);
      } else {
        alert("Failed to save attendance. Please try again.");
      }
    } catch (error) {
      console.error("Error saving attendance:", error);
      alert("Error saving attendance.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="text-blue-600" size={32} />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Student Attendance</h1>
              <p className="text-gray-600 text-sm">Manage and track student attendance</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button className="flex-1 px-6 py-4 font-medium text-blue-600 border-b-2 border-blue-600">
              Take Attendance
            </button>
            <button className="flex-1 px-6 py-4 font-medium text-gray-600 hover:text-gray-900">
              View/Update Attendance
            </button>
            <button className="flex-1 px-6 py-4 font-medium text-gray-600 hover:text-gray-900">
              Attendance History
            </button>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Choose Date & Class</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option>Class 1</option>
                <option>Class 2</option>
                <option>Class 3</option>
                <option>Class 4</option>
                <option>Class 5</option>
                <option>Class 6</option>
                <option>Class 7</option>
                <option>Class 8</option>
                <option>Class 9</option>
                <option>Class 10</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option>A</option>
                <option>B</option>
                <option>C</option>
                <option>D</option>
              </select>
            </div>
          </div>

          {/* Quick Input */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Roll Numbers of Present Students (comma-separated)
            </label>
            <p className="text-xs text-gray-600 mb-3">
              Example: 1, 2, 4, 5 (students not listed will be marked absent)
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={presentRolls}
                onChange={(e) => setPresentRolls(e.target.value)}
                placeholder="e.g. 1, 2, 3, 5, 8"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleQuickMarkPresent}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Apply
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-2 flex items-center gap-1">
              <Info size={14} />
              💡 Tip: Type roll numbers separated by commas. Students you don't list will automatically be marked as absent.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-xs text-gray-500 uppercase font-medium mb-1">Total Students</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-green-50 rounded-lg shadow-sm border border-green-200 p-4">
            <p className="text-xs text-green-600 uppercase font-medium mb-1">Present</p>
            <p className="text-3xl font-bold text-green-600">{stats.present}</p>
          </div>
          <div className="bg-red-50 rounded-lg shadow-sm border border-red-200 p-4">
            <p className="text-xs text-red-600 uppercase font-medium mb-1">Absent</p>
            <p className="text-3xl font-bold text-red-600">{stats.absent}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow-sm border border-yellow-200 p-4">
            <p className="text-xs text-yellow-600 uppercase font-medium mb-1">Halfday</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.halfday}</p>
          </div>
          <div className="bg-purple-50 rounded-lg shadow-sm border border-purple-200 p-4">
            <p className="text-xs text-purple-600 uppercase font-medium mb-1">Medical</p>
            <p className="text-3xl font-bold text-purple-600">{stats.medical}</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-sm border border-blue-300 p-4 mb-6">
          <p className="text-white text-sm font-medium">Attendance Percentage</p>
          <p className="text-4xl font-bold text-white">{stats.percentage}%</p>
        </div>

        {/* Save Button */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <button
            onClick={handleSaveAttendance}
            disabled={students.length === 0}
            className="w-full px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-bold text-lg flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Save size={24} />
            Save Attendance
          </button>
        </div>

        {/* How to Guide */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">📋 How to mark attendance:</h3>
          <ol className="space-y-2 text-sm text-gray-700">
            <li>1. Select the date, class, and section</li>
            <li>2. Use the quick input above OR click buttons for each student below</li>
            <li>3. Choose status: Present, Absent, Halfday, or Medical</li>
            <li>4. Click Save Attendance to store the record</li>
          </ol>
        </div>

        {/* Student Stats Header */}
        <div className="bg-white rounded-t-xl shadow-sm border border-gray-200 p-4">
          <h2 className="text-xl font-bold text-gray-900">Mark Attendance by Student</h2>
          <div className="grid grid-cols-4 gap-4 mt-4">
            <div className="text-center">
              <p className="text-xs text-gray-500 uppercase">Present</p>
              <p className="text-2xl font-bold text-green-600">{stats.present}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 uppercase">Absent</p>
              <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 uppercase">Halfday</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.halfday}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 uppercase">Medical</p>
              <p className="text-2xl font-bold text-purple-600">{stats.medical}</p>
            </div>
          </div>
        </div>

        {/* Student List */}
        <StudentListForAttendance
          students={students}
          attendanceStatus={attendanceStatus}
          onToggleStatus={handleToggleStatus}
          loading={loading}
        />
      </div>
    </div>
  );
}
