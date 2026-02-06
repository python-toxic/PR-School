import { useState } from "react";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const sampleStudents = [
  { id: "s1", name: "Aarav Sharma", rollNo: 1, classId: "1", section: "A" },
  { id: "s2", name: "Ananya Patel", rollNo: 2, classId: "1", section: "A" },
  { id: "s3", name: "Arjun Verma", rollNo: 3, classId: "1", section: "A" },
  { id: "s4", name: "Diya Gupta", rollNo: 4, classId: "1", section: "A" },
  { id: "s5", name: "Kabir Singh", rollNo: 5, classId: "1", section: "A" },
  { id: "s6", name: "Ishaan Reddy", rollNo: 6, classId: "1", section: "A" },
  { id: "s7", name: "Myra Nair", rollNo: 7, classId: "1", section: "A" },
  { id: "s8", name: "Vivaan Malhotra", rollNo: 8, classId: "1", section: "A" },
  { id: "s9", name: "Sara Khan", rollNo: 9, classId: "1", section: "A" },
  { id: "s10", name: "Aditya Joshi", rollNo: 10, classId: "1", section: "A" },
  { id: "s11", name: "Kiara Desai", rollNo: 11, classId: "1", section: "A" },
  { id: "s12", name: "Reyansh Mehta", rollNo: 12, classId: "1", section: "A" },
  { id: "s13", name: "Aisha Rao", rollNo: 13, classId: "1", section: "A" },
  { id: "s14", name: "Vihaan Kumar", rollNo: 14, classId: "1", section: "A" },
  { id: "s15", name: "Navya Iyer", rollNo: 15, classId: "1", section: "A" },
  { id: "s16", name: "Ayaan Thakur", rollNo: 16, classId: "1", section: "A" },
  { id: "s17", name: "Zara Bhatia", rollNo: 17, classId: "1", section: "A" },
  { id: "s18", name: "Aryan Saxena", rollNo: 18, classId: "1", section: "A" },
  { id: "s19", name: "Anvi Kapoor", rollNo: 19, classId: "1", section: "A" },
  { id: "s20", name: "Rudra Agarwal", rollNo: 20, classId: "1", section: "A" },
];

// Generate mock attendance data
const generateAttendanceData = () => {
  const data = {};
  sampleStudents.forEach(student => {
    data[student.id] = {};
    for (let day = 1; day <= 31; day++) {
      const key = day.toString().padStart(2, '0');
      const dayOfWeek = new Date(2026, 0, day).getDay();
      
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        data[student.id][key] = 'W'; // Weekend
      } else if ([4, 5].includes(day)) {
        data[student.id][key] = 'D'; // Holiday
      } else if (day === 26) {
        data[student.id][key] = 'R'; // Restricted/Leave
      } else if ([14, 22].includes(day)) {
        data[student.id][key] = 'P'; // Present
      } else if ([22].includes(day) && [16, 17, 18].includes(student.rollNo)) {
        data[student.id][key] = 'A'; // Absent
      } else {
        data[student.id][key] = '--'; // Not marked
      }
    }
  });
  return data;
};

export default function ViewAttendance() {
  const [currentMonth, setCurrentMonth] = useState(0);
  const [currentYear, setCurrentYear] = useState(2026);
  const [selectedClass, setSelectedClass] = useState("1");
  const [selectedSection, setSelectedSection] = useState("A");
  const [attendanceData, setAttendanceData] = useState(generateAttendanceData());
  const [editingCell, setEditingCell] = useState(null);

  const classes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const sections = ["A", "B", "C"];
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const classStudents = sampleStudents.filter(
    s => s.classId === selectedClass && s.section === selectedSection
  );

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleCellClick = (studentId, day) => {
    const dayKey = day.toString().padStart(2, '0');
    const current = attendanceData[studentId][dayKey];
    
    // Cannot edit Weekend or Holiday
    if (current === 'W' || current === 'D' || current === 'R') {
      return;
    }
    
    setEditingCell({ studentId, day: dayKey });
  };

  const handleStatusChange = (status) => {
    if (editingCell) {
      const { studentId, day } = editingCell;
      setAttendanceData(prev => ({
        ...prev,
        [studentId]: {
          ...prev[studentId],
          [day]: status
        }
      }));
      setEditingCell(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'P':
        return 'bg-emerald-100 text-emerald-700 font-bold';
      case 'A':
        return 'bg-red-100 text-red-700 font-bold';
      case 'W':
        return 'bg-gray-100 text-gray-500';
      case 'D':
        return 'bg-blue-100 text-blue-700';
      case 'R':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-50 text-gray-400';
    }
  };

  const handleExport = () => {
    let csv = `Class ${selectedClass}-${selectedSection} Attendance - ${MONTHS[currentMonth]} ${currentYear}\n\n`;
    csv += `Name (Roll No),${Array.from({length: daysInMonth}, (_, i) => (i+1).toString().padStart(2, '0')).join(',')}\n`;
    
    classStudents.forEach(student => {
      csv += `${student.name} (${student.rollNo})`;
      for (let day = 1; day <= daysInMonth; day++) {
        const dayKey = day.toString().padStart(2, '0');
        csv += `,${attendanceData[student.id][dayKey]}`;
      }
      csv += '\n';
    });

    const element = document.createElement("a");
    element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv));
    element.setAttribute("download", `attendance-${selectedClass}-${selectedSection}-${MONTHS[currentMonth]}.csv`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">View Attendance</h1>
        <p className="text-sm text-gray-500 mt-1">Monthly attendance calendar view</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-4 items-center">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {classes.map(cls => (
                  <option key={cls} value={cls}>Class {cls}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Section</label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sections.map(sec => (
                  <option key={sec} value={sec}>{sec}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 mt-5">
              <button
                onClick={handlePrevMonth}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm font-semibold min-w-[150px] text-center">
                {MONTHS[currentMonth]} {currentYear}
              </span>
              <button
                onClick={handleNextMonth}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <button
            onClick={handleExport}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition inline-flex items-center gap-2"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded text-center text-xs font-bold">P</div>
            <span>Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-100 text-red-700 rounded text-center text-xs font-bold">A</div>
            <span>Absent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-100 text-blue-700 rounded text-center text-xs font-bold">D</div>
            <span>Holiday</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-100 text-gray-500 rounded text-center text-xs font-bold">W</div>
            <span>Weekend</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-amber-100 text-amber-700 rounded text-center text-xs font-bold">R</div>
            <span>Restricted</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-50 text-gray-400 rounded text-center text-xs">--</div>
            <span>Not Marked</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800">
        <p className="font-semibold mb-2">How to use:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>You cannot update holidays (D) or weekend (W) attendance.</li>
          <li>Click on any editable cell to update attendance status.</li>
          <li>Use the Export button to download attendance reports.</li>
        </ul>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b border-gray-200 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-gray-900 sticky left-0 bg-gray-100 z-10 min-w-[200px]">
                  Name (Roll No)
                </th>
                {Array.from({ length: daysInMonth }, (_, i) => (
                  <th key={i} className="px-2 py-2 text-center font-semibold text-gray-700 min-w-[40px]">
                    {(i + 1).toString().padStart(2, '0')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {classStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-left font-medium text-gray-900 sticky left-0 bg-white hover:bg-gray-50 z-10 min-w-[200px]">
                    {student.name}
                    <div className="text-xs text-gray-500">Roll No: {student.rollNo}</div>
                  </td>
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const dayKey = (i + 1).toString().padStart(2, '0');
                    const status = attendanceData[student.id][dayKey];
                    const isEditable = status !== 'W' && status !== 'D' && status !== 'R';
                    
                    return (
                      <td
                        key={dayKey}
                        onClick={() => isEditable && handleCellClick(student.id, i + 1)}
                        className={`px-2 py-2 text-center min-w-[40px] ${
                          isEditable ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed'
                        } ${getStatusColor(status)}`}
                      >
                        <div className="relative group">
                          {status}
                          
                          {editingCell?.studentId === student.id && editingCell?.day === dayKey && isEditable && (
                            <div className="absolute left-0 top-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-2 min-w-[150px]">
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  onClick={() => handleStatusChange('P')}
                                  className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 font-bold text-sm"
                                >
                                  Present
                                </button>
                                <button
                                  onClick={() => handleStatusChange('A')}
                                  className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 font-bold text-sm"
                                >
                                  Absent
                                </button>
                                <button
                                  onClick={() => handleStatusChange('--')}
                                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 text-sm"
                                >
                                  Clear
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
