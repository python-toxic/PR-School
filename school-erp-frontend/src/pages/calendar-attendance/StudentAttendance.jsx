import { useState } from "react";
import { Calendar, Users, BarChart3, Download, Search, Edit2, Save, X, Check, AlertCircle } from "lucide-react";

const sampleStudents = [
  { id: "s1", name: "Aarav Kumar", rollNo: 1, classId: "1", section: "A" },
  { id: "s2", name: "Priya Sharma", rollNo: 2, classId: "1", section: "A" },
  { id: "s3", name: "Rohan Singh", rollNo: 3, classId: "1", section: "A" },
  { id: "s4", name: "Ananya Patel", rollNo: 4, classId: "1", section: "A" },
  { id: "s5", name: "Arjun Mehta", rollNo: 5, classId: "1", section: "A" },
  { id: "s6", name: "Diya Gupta", rollNo: 1, classId: "2", section: "A" },
  { id: "s7", name: "Kabir Reddy", rollNo: 2, classId: "2", section: "A" },
  { id: "s8", name: "Sana Khan", rollNo: 3, classId: "2", section: "A" },
];

const sampleAttendanceHistory = [
  { date: "2026-01-24", classId: "1", section: "A", presentCount: 4, absentCount: 1, totalCount: 5 },
  { date: "2026-01-23", classId: "1", section: "A", presentCount: 5, absentCount: 0, totalCount: 5 },
  { date: "2026-01-22", classId: "1", section: "A", presentCount: 4, absentCount: 1, totalCount: 5 },
  { date: "2026-01-24", classId: "2", section: "A", presentCount: 2, absentCount: 1, totalCount: 3 },
  { date: "2026-01-23", classId: "2", section: "A", presentCount: 3, absentCount: 0, totalCount: 3 },
];

// Generate all students with roll numbers 1-50 across classes
const generateAllStudents = () => {
  const students = [];
  let studentId = 1;
  for (let classNum = 1; classNum <= 10; classNum++) {
    for (let section = 0; section < 3; section++) {
      for (let roll = 1; roll <= 5; roll++) {
        students.push({
          id: `s${studentId}`,
          name: `Student ${studentId}`,
          rollNo: roll,
          classId: classNum.toString(),
          section: String.fromCharCode(65 + section),
        });
        studentId++;
      }
    }
  }
  return students;
};

const allStudents = generateAllStudents();

export default function StudentAttendance() {
  const [activeTab, setActiveTab] = useState("take");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState("1");
  const [selectedSection, setSelectedSection] = useState("A");
  const [presentRollNumbers, setPresentRollNumbers] = useState("");
  const [message, setMessage] = useState("");
  
  // Attendance status object: { rollNo: 'Present' | 'Absent' | 'Halfday' | 'Medical' | '' }
  const [attendanceStatus, setAttendanceStatus] = useState({});
  
  // User role: 'admin' | 'teacher' | 'parent'
  const [userRole] = useState("admin"); // Default to admin for demo, should come from auth
  
  // View/Update states
  const [editingRecord, setEditingRecord] = useState(null);
  const [editAttendance, setEditAttendance] = useState({});
  const [editingStatusMap, setEditingStatusMap] = useState({});
  
  // History states
  const [searchDate, setSearchDate] = useState("");
  const [searchClass, setSearchClass] = useState("");
  const [filteredHistory, setFilteredHistory] = useState(sampleAttendanceHistory);

  const classes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const sections = ["A", "B", "C"];

  const classStudents = allStudents.filter(
    s => s.classId === selectedClass && s.section === selectedSection
  );

  const presentList = presentRollNumbers
    .split(',')
    .map(r => r.trim())
    .filter(r => r !== '')
    .map(Number);
  
  const presentCount = presentList.length;
  const absentCount = classStudents.length - presentCount;
  const attendancePercentage = classStudents.length > 0 ? ((presentCount / classStudents.length) * 100).toFixed(1) : 0;

  // Handle attendance status change (Present, Absent, Halfday, Medical)
  const handleAttendanceStatusChange = (rollNo, status) => {
    setAttendanceStatus(prev => ({
      ...prev,
      [rollNo]: prev[rollNo] === status ? '' : status
    }));
  };

  // Get counts for detailed view
  const statusCounts = {
    present: Object.values(attendanceStatus).filter(s => s === 'Present').length,
    absent: Object.values(attendanceStatus).filter(s => s === 'Absent').length,
    halfday: Object.values(attendanceStatus).filter(s => s === 'Halfday').length,
    medical: Object.values(attendanceStatus).filter(s => s === 'Medical').length,
  };

  const handleSaveAttendance = () => {
    if (classStudents.length === 0) {
      setMessage("❌ No students found for this class and section");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    
    if (presentRollNumbers.trim() === "" && Object.keys(attendanceStatus).length === 0) {
      setMessage("❌ Please mark attendance for students");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    
    setMessage(`✓ Attendance saved for Class ${selectedClass}-${selectedSection} on ${selectedDate} (${presentCount} present, ${absentCount} absent)`);
    setTimeout(() => {
      setMessage("");
      setPresentRollNumbers("");
    }, 3000);
    console.log("Attendance Data:", { date: selectedDate, class: selectedClass, section: selectedSection, presentRolls: presentList, detailedStatus: attendanceStatus });
  };

  // Check if date is within 3 days (for teachers)
  const canEditRecord = (recordDate) => {
    if (userRole === "admin") return true;
    if (userRole !== "teacher") return false;
    
    const recordDateObj = new Date(recordDate);
    const today = new Date();
    const diffTime = Math.abs(today - recordDateObj);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  };

  const handleEditStart = (record) => {
    if (!canEditRecord(record.date)) {
      setMessage(`❌ Teachers can only edit attendance from the last 3 days`);
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    setEditingRecord(record);
    setEditingStatusMap({});
    setEditAttendance({ presentCount: record.presentCount, absentCount: record.absentCount });
  };

  const handleEditSave = () => {
    setMessage("✓ Attendance updated successfully");
    setTimeout(() => setMessage(""), 3000);
    setEditingRecord(null);
    setEditingStatusMap({});
  };

  const handleStatusEdit = (rollNo, status) => {
    setEditingStatusMap(prev => ({
      ...prev,
      [rollNo]: prev[rollNo] === status ? '' : status
    }));
  };

  const handleSearch = () => {
    if (attendanceType === "student") {
      let filtered = sampleAttendanceHistory;
      
      if (searchDate) {
        filtered = filtered.filter(r => r.date.includes(searchDate));
      }
      
      if (searchClass) {
        filtered = filtered.filter(r => r.classId === searchClass);
      }
      
      setFilteredHistory(filtered);
    } else {
      let filtered = sampleEmployeeAttendanceHistory;
      
      if (searchDate) {
        filtered = filtered.filter(r => r.date.includes(searchDate));
      }
      
      if (searchDepartment) {
        filtered = filtered.filter(r => r.department === searchDepartment);
      }
      
      setFilteredEmployeeHistory(filtered);
    }
  };

  const handleExport = () => {
    if (attendanceType === "student") {
      let csv = "Date,Class,Section,Present,Absent,Total,Percentage\n";
      
      filteredHistory.forEach(record => {
        const percentage = ((record.presentCount / record.totalCount) * 100).toFixed(1);
        csv += `${record.date},${record.classId},${record.section},${record.presentCount},${record.absentCount},${record.totalCount},${percentage}%\n`;
      });

      const element = document.createElement("a");
      element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv));
      element.setAttribute("download", "student-attendance-history.csv");
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } else {
      let csv = "Date,Department,Present,Absent,Total,Percentage\n";
      
      filteredEmployeeHistory.forEach(record => {
        const percentage = ((record.presentCount / record.totalCount) * 100).toFixed(1);
        csv += `${record.date},${record.department},${record.presentCount},${record.absentCount},${record.totalCount},${percentage}%\n`;
      });

      const element = document.createElement("a");
      element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv));
      element.setAttribute("download", "employee-attendance-history.csv");
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Users size={28} className="text-blue-600" />
          Student Attendance
        </h1>
        <p className="text-sm text-gray-500 mt-1">Manage and track student attendance</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("take")}
            className={`flex-1 px-4 py-3 font-medium transition ${
              activeTab === "take"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Calendar size={18} className="inline mr-2" />
            Take Attendance
          </button>
          <button
            onClick={() => setActiveTab("view")}
            className={`flex-1 px-4 py-3 font-medium transition ${
              activeTab === "view"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Edit2 size={18} className="inline mr-2" />
            View/Update Attendance
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 px-4 py-3 font-medium transition ${
              activeTab === "history"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <BarChart3 size={18} className="inline mr-2" />
            Attendance History
          </button>
        </div>
      </div>

      {/* Take Attendance Tab */}
      {activeTab === "take" && (
        <div className="space-y-6">
          {/* Selection Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Choose Date & Class</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {classes.map(cls => (
                    <option key={cls} value={cls}>Class {cls}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {sections.map(sec => (
                    <option key={sec} value={sec}>{sec}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Input Section */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Enter Roll Numbers of Present Students (comma-separated)
            </label>
            <input
              type="text"
              value={presentRollNumbers}
              onChange={(e) => setPresentRollNumbers(e.target.value)}
              placeholder="Example: 1, 2, 4, 5 (students not listed will be marked absent)"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 font-mono text-base"
            />
            <p className="text-xs text-gray-500 mt-2">💡 Tip: Type roll numbers separated by commas. Students you don't list will automatically be marked as absent.</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
              <div className="text-xs text-blue-600 font-semibold">TOTAL STUDENTS</div>
              <div className="text-2xl font-bold text-blue-900 mt-1">{classStudents.length}</div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg p-4">
              <div className="text-xs text-emerald-600 font-semibold">PRESENT</div>
              <div className="text-2xl font-bold text-emerald-900 mt-1">{presentCount}</div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
              <div className="text-xs text-red-600 font-semibold">ABSENT</div>
              <div className="text-2xl font-bold text-red-900 mt-1">{absentCount}</div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
              <div className="text-xs text-purple-600 font-semibold">PERCENTAGE</div>
              <div className="text-2xl font-bold text-purple-900 mt-1">{attendancePercentage}%</div>
            </div>
              </div>

          {/* Save Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSaveAttendance}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-lg inline-flex items-center gap-2"
            >
              <Check size={20} />
              Save Attendance
            </button>
          </div>

          {/* Message */}
          {message && (
            <div className={`p-4 rounded-lg text-sm font-medium ${
              message.includes('✓') 
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' 
                : 'bg-red-100 text-red-700 border border-red-300'
            }`}>
              {message}
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <p className="font-semibold mb-2">📋 How to mark attendance:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Select the <strong>date</strong>, <strong>class</strong>, and <strong>section</strong></li>
              <li>Use the quick input above OR click buttons for each student below</li>
              <li>Choose status: <strong>Present, Absent, Halfday, or Medical</strong></li>
              <li>Click <strong>Save Attendance</strong> to store the record</li>
            </ol>
          </div>

          {/* Detailed Attendance Table */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users size={20} className="text-blue-600" />
              Mark Attendance by Student
            </h3>

            {/* Status Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center">
                <div className="text-xs text-emerald-600 font-semibold">PRESENT</div>
                <div className="text-2xl font-bold text-emerald-900">{statusCounts.present}</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                <div className="text-xs text-red-600 font-semibold">ABSENT</div>
                <div className="text-2xl font-bold text-red-900">{statusCounts.absent}</div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                <div className="text-xs text-yellow-600 font-semibold">HALFDAY</div>
                <div className="text-2xl font-bold text-yellow-900">{statusCounts.halfday}</div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
                <div className="text-xs text-orange-600 font-semibold">MEDICAL</div>
                <div className="text-2xl font-bold text-orange-900">{statusCounts.medical}</div>
              </div>
            </div>

            {/* Student Attendance Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-300 bg-gray-50">
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Image</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Full Name</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700">Attendance Status</th>
                  </tr>
                </thead>
                <tbody>
                  {classStudents.map((student) => (
                    <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                      {/* Avatar */}
                      <td className="px-4 py-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-sm">{student.name.charAt(0)}</span>
                        </div>
                      </td>

                      {/* Student Name & Roll */}
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-900">{student.name}</div>
                        <div className="text-xs text-gray-500">Roll No: {student.rollNo}</div>
                      </td>

                      {/* Status Buttons */}
                      <td className="px-4 py-3">
                        <div className="flex gap-2 justify-center flex-wrap">
                          <button
                            onClick={() => handleAttendanceStatusChange(student.rollNo, 'Present')}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                              attendanceStatus[student.rollNo] === 'Present'
                                ? 'bg-emerald-500 text-white'
                                : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            }`}
                          >
                            Present
                          </button>
                          <button
                            onClick={() => handleAttendanceStatusChange(student.rollNo, 'Absent')}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                              attendanceStatus[student.rollNo] === 'Absent'
                                ? 'bg-red-500 text-white'
                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }`}
                          >
                            Absent
                          </button>
                          <button
                            onClick={() => handleAttendanceStatusChange(student.rollNo, 'Halfday')}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                              attendanceStatus[student.rollNo] === 'Halfday'
                                ? 'bg-yellow-500 text-white'
                                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            }`}
                          >
                            Halfday
                          </button>
                          <button
                            onClick={() => handleAttendanceStatusChange(student.rollNo, 'Medical')}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                              attendanceStatus[student.rollNo] === 'Medical'
                                ? 'bg-orange-500 text-white'
                                : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                            }`}
                          >
                            Medical
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* View/Update Attendance Tab */}
      {activeTab === "view" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">View/Update Attendance Records</h2>
          
          {!editingRecord ? (
            <div className="space-y-4">
              {sampleAttendanceHistory.map((record, idx) => {
                const canEdit = canEditRecord(record.date);
                const isLocked = userRole === "teacher" && !canEdit;
                
                return (
                  <div
                    key={idx}
                    className={`border rounded-lg p-4 hover:shadow-md transition flex justify-between items-center ${
                      isLocked ? 'border-gray-200 bg-gray-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex gap-6 flex-wrap items-center">
                        <div>
                          <p className="text-xs text-gray-500 font-medium">DATE</p>
                          <p className="text-sm font-semibold text-gray-900 mt-1">{record.date}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">CLASS</p>
                          <p className="text-sm font-semibold text-gray-900 mt-1">Class {record.classId}-{record.section}</p>
                        </div>
                        <div className="flex gap-3">
                          <div>
                            <p className="text-xs text-gray-500 font-medium">PRESENT</p>
                            <p className="text-sm font-semibold text-emerald-600 mt-1">{record.presentCount}/{record.totalCount}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">ABSENT</p>
                            <p className="text-sm font-semibold text-red-600 mt-1">{record.absentCount}</p>
                          </div>
                        </div>
                        {isLocked && (
                          <div className="text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded">
                            🔒 Edit window closed (3 days max)
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {canEdit && (
                      <button
                        onClick={() => handleEditStart(record)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm inline-flex items-center gap-2 ml-4"
                      >
                        <Edit2 size={16} />
                        Edit
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Edit: Class {editingRecord.classId}-{editingRecord.section} • {editingRecord.date}
                </h3>
                <p className="text-sm text-gray-500 mt-1">Update attendance status for each student</p>
              </div>

              {/* Status Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center">
                  <div className="text-xs text-emerald-600 font-semibold">PRESENT</div>
                  <div className="text-2xl font-bold text-emerald-900">{Object.values(editingStatusMap).filter(s => s === 'Present').length}</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                  <div className="text-xs text-red-600 font-semibold">ABSENT</div>
                  <div className="text-2xl font-bold text-red-900">{Object.values(editingStatusMap).filter(s => s === 'Absent').length}</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                  <div className="text-xs text-yellow-600 font-semibold">HALFDAY</div>
                  <div className="text-2xl font-bold text-yellow-900">{Object.values(editingStatusMap).filter(s => s === 'Halfday').length}</div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
                  <div className="text-xs text-orange-600 font-semibold">MEDICAL</div>
                  <div className="text-2xl font-bold text-orange-900">{Object.values(editingStatusMap).filter(s => s === 'Medical').length}</div>
                </div>
              </div>

              {/* Student Status Buttons */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 overflow-x-auto">
                <h4 className="font-semibold text-gray-900 mb-4">Student Attendance Status</h4>
                <div className="space-y-3">
                  {classStudents.map((student) => (
                    <div key={student.id} className="flex items-center gap-4 pb-3 border-b border-gray-200 last:border-b-0">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm">{student.name}</p>
                        <p className="text-xs text-gray-500">Roll No: {student.rollNo}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatusEdit(student.rollNo, 'Present')}
                          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                            editingStatusMap[student.rollNo] === 'Present'
                              ? 'bg-emerald-500 text-white'
                              : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                          }`}
                        >
                          P
                        </button>
                        <button
                          onClick={() => handleStatusEdit(student.rollNo, 'Absent')}
                          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                            editingStatusMap[student.rollNo] === 'Absent'
                              ? 'bg-red-500 text-white'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          A
                        </button>
                        <button
                          onClick={() => handleStatusEdit(student.rollNo, 'Halfday')}
                          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                            editingStatusMap[student.rollNo] === 'Halfday'
                              ? 'bg-yellow-500 text-white'
                              : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          }`}
                        >
                          H
                        </button>
                        <button
                          onClick={() => handleStatusEdit(student.rollNo, 'Medical')}
                          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                            editingStatusMap[student.rollNo] === 'Medical'
                              ? 'bg-orange-500 text-white'
                              : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                          }`}
                        >
                          M
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2 justify-end">
                <button
                  onClick={handleEditSave}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium inline-flex items-center gap-2"
                >
                  <Save size={18} />
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setEditingRecord(null);
                    setEditingStatusMap({});
                  }}
                  className="px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition font-medium inline-flex items-center gap-2"
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            </div>
          )}

          {message && (
            <div className="mt-4 p-4 rounded-lg text-sm font-medium bg-emerald-100 text-emerald-700 border border-emerald-300">
              {message}
            </div>
          )}
        </div>
      )}

      {/* Attendance History Tab */}
      {activeTab === "history" && (
        <div className="space-y-6">
          {/* Search Controls */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Search & Filter</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                placeholder="Search by date"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={searchClass}
                onChange={(e) => setSearchClass(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Classes</option>
                {classes.map(cls => (
                  <option key={cls} value={cls}>Class {cls}</option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  onClick={handleSearch}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition inline-flex items-center justify-center gap-2"
                >
                  <Search size={18} />
                  Search
                </button>
                <button
                  onClick={handleExport}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition inline-flex items-center justify-center gap-2"
                >
                  <Download size={18} />
                  Export CSV
                </button>
              </div>
            </div>
          </div>

          {/* Results Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {filteredHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Date</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Class</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-900">Present</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-900">Absent</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-900">Total</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-900">Percentage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredHistory.map((record, idx) => {
                      const percentage = ((record.presentCount / record.totalCount) * 100).toFixed(1);
                      const percentageColor = percentage >= 75 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700';
                      
                      return (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-900">{record.date}</td>
                          <td className="px-4 py-3 text-gray-900">
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded font-medium text-xs">
                              Class {record.classId}-{record.section}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center text-emerald-600 font-bold">{record.presentCount}</td>
                          <td className="px-4 py-3 text-center text-red-600 font-bold">{record.absentCount}</td>
                          <td className="px-4 py-3 text-center text-gray-900 font-bold">{record.totalCount}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-3 py-1 rounded font-bold ${percentageColor}`}>
                              {percentage}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="mx-auto mb-2" size={32} />
                <p>No attendance records found</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
