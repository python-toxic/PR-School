import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Calendar, Users, BarChart3, Download, Search, Edit2, Save, X, Check, AlertCircle } from "lucide-react";

// Sample employees for attendance tracking
const sampleEmployees = [
  { id: "fa", name: "Farhana", designation: "Vice Principal", department: "Administration", empId: "EMP001" },
  { id: "sd", name: "Sukhdev driver", designation: "Driver", department: "Transport", empId: "EMP002" },
  { id: "am", name: "Atul Manager", designation: "Finance Manager", department: "Finance", empId: "EMP003" },
  { id: "kd", name: "Kanchan Das", designation: "Teacher", department: "Academics", empId: "EMP004" },
  { id: "fl", name: "Flintoff", designation: "Teacher", department: "Academics", empId: "EMP005" },
  { id: "vk", name: "Vinod Kumar", designation: "Teacher", department: "Academics", empId: "EMP006" },
  { id: "kp", name: "Kamlesh Pawar", designation: "Teacher", department: "Academics", empId: "EMP007" },
];

const sampleEmployeeAttendanceHistory = [
  { date: "2026-01-24", department: "Administration", presentCount: 3, absentCount: 0, halfDayCount: 0, medicalCount: 0, totalCount: 3 },
  { date: "2026-01-23", department: "Administration", presentCount: 3, absentCount: 0, halfDayCount: 0, medicalCount: 0, totalCount: 3 },
  { date: "2026-01-22", department: "Administration", presentCount: 2, absentCount: 1, halfDayCount: 0, medicalCount: 0, totalCount: 3 },
  { date: "2026-01-24", department: "Academics", presentCount: 4, absentCount: 1, halfDayCount: 0, medicalCount: 0, totalCount: 5 },
  { date: "2026-01-23", department: "Academics", presentCount: 5, absentCount: 0, halfDayCount: 0, medicalCount: 0, totalCount: 5 },
  { date: "2026-01-22", department: "Academics", presentCount: 4, absentCount: 0, halfDayCount: 1, medicalCount: 0, totalCount: 5 },
  { date: "2026-01-24", department: "Finance", presentCount: 1, absentCount: 0, halfDayCount: 0, medicalCount: 0, totalCount: 1 },
  { date: "2026-01-23", department: "Finance", presentCount: 1, absentCount: 0, halfDayCount: 0, medicalCount: 0, totalCount: 1 },
  { date: "2026-01-24", department: "Library", presentCount: 1, absentCount: 0, halfDayCount: 0, medicalCount: 0, totalCount: 1 },
  { date: "2026-01-23", department: "Library", presentCount: 1, absentCount: 0, halfDayCount: 0, medicalCount: 0, totalCount: 1 },
  { date: "2026-01-24", department: "Student Services", presentCount: 1, absentCount: 0, halfDayCount: 0, medicalCount: 0, totalCount: 1 },
  { date: "2026-01-23", department: "Student Services", presentCount: 0, absentCount: 1, halfDayCount: 0, medicalCount: 0, totalCount: 1 },
];

export default function EmployeeAttendance() {
  const [searchParams] = useSearchParams();
  const employeeIdFromUrl = searchParams.get("employeeId");
  
  const [activeTab, setActiveTab] = useState("take");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [message, setMessage] = useState("");
  
  // Filter out removed/former employees
  const removedEmployees = JSON.parse(localStorage.getItem('removedEmployees') || '[]');
  const removedEmployeeIds = removedEmployees.map(emp => emp.id);
  const activeEmployees = sampleEmployees.filter(emp => !removedEmployeeIds.includes(emp.id));
  
  // Attendance status object: { empId: 'Present' | 'Absent' | 'Halfday' | 'Medical' | '' }
  const [attendanceStatus, setAttendanceStatus] = useState({});
  
  // User role: 'admin' | 'hr' | 'manager'
  const [userRole] = useState("admin"); // Default to admin for demo, should come from auth
  
  // View/Update states
  const [editingRecord, setEditingRecord] = useState(null);
  const [editingStatusMap, setEditingStatusMap] = useState({});
  
  // History states
  const [searchDate, setSearchDate] = useState("");
  const [searchDepartment, setSearchDepartment] = useState("");
  const [filteredHistory, setFilteredHistory] = useState(sampleEmployeeAttendanceHistory);

  const departments = ["All", "Administration", "Academics", "Finance", "Transport", "Library", "Student Services"];

  const departmentEmployees = selectedDepartment === "All" 
    ? activeEmployees 
    : activeEmployees.filter(e => e.department === selectedDepartment);

  // Get employee name if coming from employee section
  const selectedEmployee = employeeIdFromUrl 
    ? activeEmployees.find(e => e.id === employeeIdFromUrl) 
    : null;

  useEffect(() => {
    if (selectedEmployee) {
      setSelectedDepartment(selectedEmployee.department);
    }
  }, [selectedEmployee]);

  // Check if employee was removed
  useEffect(() => {
    if (employeeIdFromUrl && removedEmployeeIds.includes(employeeIdFromUrl)) {
      setMessage("⚠️ This employee has been removed from the school and cannot be marked for attendance.");
    }
  }, [employeeIdFromUrl, removedEmployeeIds]);

  // Handle attendance status change (Present, Absent, Halfday, Medical)
  const handleAttendanceStatusChange = (empId, status) => {
    setAttendanceStatus(prev => ({
      ...prev,
      [empId]: prev[empId] === status ? '' : status
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
    const totalMarked = Object.keys(attendanceStatus).length;
    const message = `Attendance saved for ${selectedDepartment} on ${selectedDate}. Total: ${totalMarked} employees marked.`;
    setMessage(message);
    setTimeout(() => setMessage(""), 3000);
  };

  const canEditRecord = (recordDate) => {
    if (userRole === "admin") return true;
    if (userRole !== "manager") return false;
    const recordDateObj = new Date(recordDate);
    const today = new Date();
    const diffTime = Math.abs(today - recordDateObj);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  };

  const handleEditStart = (record) => {
    const isLocked = !canEditRecord(record.date);
    if (isLocked && userRole !== "admin") {
      setMessage("❌ Cannot edit records older than 3 days");
      setTimeout(() => setMessage(""), 2000);
      return;
    }
    setEditingRecord(record);
    setEditingStatusMap({});
  };

  const handleEditSave = () => {
    setMessage("✅ Attendance updated successfully!");
    setTimeout(() => {
      setMessage("");
      setEditingRecord(null);
      setEditingStatusMap({});
    }, 2000);
  };

  const handleStatusEdit = (empId, status) => {
    setEditingStatusMap(prev => ({
      ...prev,
      [empId]: prev[empId] === status ? '' : status
    }));
  };

  const handleSearch = () => {
    let filtered = sampleEmployeeAttendanceHistory;
    
    if (searchDate) {
      filtered = filtered.filter(r => r.date.includes(searchDate));
    }
    
    if (searchDepartment) {
      filtered = filtered.filter(r => r.department === searchDepartment);
    }
    
    setFilteredHistory(filtered);
  };

  const handleExport = () => {
    let csv = "Date,Department,Present,Absent,Half Day,Medical,Total,Percentage\n";
    
    filteredHistory.forEach(record => {
      const percentage = ((record.presentCount / record.totalCount) * 100).toFixed(1);
      csv += `${record.date},${record.department},${record.presentCount},${record.absentCount},${record.halfDayCount},${record.medicalCount},${record.totalCount},${percentage}%\n`;
    });

    const element = document.createElement("a");
    element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv));
    element.setAttribute("download", "employee-attendance-report.csv");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Users size={28} className="text-purple-600" />
          Employee Attendance
        </h1>
        <p className="text-sm text-gray-500 mt-1">Manage and track employee attendance</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("take")}
            className={`flex-1 px-4 py-3 font-medium transition ${
              activeTab === "take"
                ? "text-purple-600 border-b-2 border-purple-600"
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
                ? "text-purple-600 border-b-2 border-purple-600"
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
                ? "text-purple-600 border-b-2 border-purple-600"
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                {selectedEmployee 
                  ? `Attendance for ${selectedEmployee.name} (${selectedEmployee.designation})`
                  : "Employee Attendance"}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Status Summary */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="text-3xl font-bold text-emerald-600">{statusCounts.present}</div>
              <p className="text-sm text-gray-600 mt-1">Present</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="text-3xl font-bold text-red-600">{statusCounts.absent}</div>
              <p className="text-sm text-gray-600 mt-1">Absent</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="text-3xl font-bold text-amber-600">{statusCounts.halfday}</div>
              <p className="text-sm text-gray-600 mt-1">Half Day</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="text-3xl font-bold text-blue-600">{statusCounts.medical}</div>
              <p className="text-sm text-gray-600 mt-1">Medical</p>
            </div>
          </div>

          {/* Employee Attendance Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Attendance for date: {selectedDate}
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border">Image</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border">FullName</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border">Present</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentEmployees.map(emp => {
                    const initials = emp.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                    return (
                      <tr key={emp.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 border">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-semibold flex items-center justify-center text-sm overflow-hidden">
                            {emp.profileImage ? (
                              <img src={emp.profileImage} alt={emp.name} className="h-full w-full object-cover" />
                            ) : (
                              initials
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 border">
                          <div className="font-medium text-gray-900">{emp.name}</div>
                          <div className="text-sm text-gray-500">({emp.designation})</div>
                          <div className="text-xs text-blue-600 mt-1">{emp.department}</div>
                        </td>
                        <td className="px-4 py-3 border">
                          <div className="flex flex-wrap gap-2">
                            <label className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-emerald-50 transition">
                              <input
                                type="radio"
                                name={`attendance-${emp.id}`}
                                checked={attendanceStatus[emp.id] === 'Present'}
                                onChange={() => handleAttendanceStatusChange(emp.id, 'Present')}
                                className="text-emerald-600 focus:ring-emerald-500"
                              />
                              <span className="text-sm font-medium text-emerald-700">Present</span>
                            </label>
                            <label className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-red-50 transition">
                              <input
                                type="radio"
                                name={`attendance-${emp.id}`}
                                checked={attendanceStatus[emp.id] === 'Absent'}
                                onChange={() => handleAttendanceStatusChange(emp.id, 'Absent')}
                                className="text-red-600 focus:ring-red-500"
                              />
                              <span className="text-sm font-medium text-red-700">Absent</span>
                            </label>
                            <label className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-amber-50 transition">
                              <input
                                type="radio"
                                name={`attendance-${emp.id}`}
                                checked={attendanceStatus[emp.id] === 'Halfday'}
                                onChange={() => handleAttendanceStatusChange(emp.id, 'Halfday')}
                                className="text-amber-600 focus:ring-amber-500"
                              />
                              <span className="text-sm font-medium text-amber-700">Halfday</span>
                            </label>
                            <label className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition">
                              <input
                                type="radio"
                                name={`attendance-${emp.id}`}
                                checked={attendanceStatus[emp.id] === 'Medical'}
                                onChange={() => handleAttendanceStatusChange(emp.id, 'Medical')}
                                className="text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm font-medium text-blue-700">Medical</span>
                            </label>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Save Button */}
            <div className="flex gap-2 justify-end mt-6">
              <button
                onClick={handleSaveAttendance}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium inline-flex items-center gap-2"
              >
                <Save size={18} />
                Save Attendance
              </button>
            </div>

            {message && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
                {message}
              </div>
            )}
          </div>
        </div>
      )}

      {/* View/Update Attendance Tab */}
      {activeTab === "view" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">View & Update Attendance</h2>
            
            {!editingRecord ? (
              <div className="space-y-4">
                {sampleEmployeeAttendanceHistory.slice(0, 5).map((record, idx) => {
                  const isLocked = !canEditRecord(record.date);
                  const canEdit = canEditRecord(record.date);
                  
                  return (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-semibold text-gray-900">{record.date}</div>
                          <div className="text-sm text-gray-600">{record.department} Department</div>
                        </div>
                        {isLocked && userRole === "manager" && (
                          <div className="text-sm text-amber-600 font-medium">🔒 Edit window closed (3 days max)</div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-4 gap-2 mb-3">
                        <div className="text-center">
                          <div className="text-sm font-semibold text-emerald-600">{record.presentCount}</div>
                          <div className="text-xs text-gray-500">Present</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-semibold text-red-600">{record.absentCount}</div>
                          <div className="text-xs text-gray-500">Absent</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-semibold text-amber-600">{record.halfDayCount}</div>
                          <div className="text-xs text-gray-500">Half Day</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-semibold text-blue-600">{record.medicalCount}</div>
                          <div className="text-xs text-gray-500">Medical</div>
                        </div>
                      </div>
                      
                      {canEdit && (
                        <button
                          onClick={() => handleEditStart(record)}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium inline-flex items-center gap-2"
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
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="font-semibold text-gray-900 mb-2">Editing: {editingRecord.date} - {editingRecord.department}</div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {departmentEmployees.map(emp => (
                      <div key={emp.id} className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                        <div>
                          <div className="font-medium text-gray-900">{emp.name}</div>
                          <div className="text-xs text-gray-500">{emp.designation}</div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleStatusEdit(emp.id, 'Present')}
                            className={`px-2 py-1 rounded text-xs font-medium transition ${
                              editingStatusMap[emp.id] === 'Present'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            P
                          </button>
                          <button
                            onClick={() => handleStatusEdit(emp.id, 'Absent')}
                            className={`px-2 py-1 rounded text-xs font-medium transition ${
                              editingStatusMap[emp.id] === 'Absent'
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            A
                          </button>
                          <button
                            onClick={() => handleStatusEdit(emp.id, 'Halfday')}
                            className={`px-2 py-1 rounded text-xs font-medium transition ${
                              editingStatusMap[emp.id] === 'Halfday'
                                ? 'bg-amber-600 text-white'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            H
                          </button>
                          <button
                            onClick={() => handleStatusEdit(emp.id, 'Medical')}
                            className={`px-2 py-1 rounded text-xs font-medium transition ${
                              editingStatusMap[emp.id] === 'Medical'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            M
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

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
          </div>
        </div>
      )}

      {/* Attendance History Tab */}
      {activeTab === "history" && (
        <div className="space-y-6">
          {/* Search Controls */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Search & Filter Employee Attendance</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                placeholder="Search by date"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <select
                value={searchDepartment}
                onChange={(e) => setSearchDepartment(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  onClick={handleSearch}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition inline-flex items-center justify-center gap-2"
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
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Department</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-900">Present</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-900">Absent</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-900">Half Day</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-900">Medical</th>
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
                            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded font-medium text-xs">
                              {record.department}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center text-emerald-600 font-bold">{record.presentCount}</td>
                          <td className="px-4 py-3 text-center text-red-600 font-bold">{record.absentCount}</td>
                          <td className="px-4 py-3 text-center text-amber-600 font-bold">{record.halfDayCount}</td>
                          <td className="px-4 py-3 text-center text-blue-600 font-bold">{record.medicalCount}</td>
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
                <p>No employee attendance records found</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
