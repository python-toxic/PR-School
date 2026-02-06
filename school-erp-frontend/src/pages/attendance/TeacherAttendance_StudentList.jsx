// Student list component for attendance marking
export default function StudentListForAttendance({ students, attendanceStatus, onToggleStatus, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-gray-600">Loading students...</p>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-gray-600">No students found in this class/section.</p>
      </div>
    );
  }

  const statusColors = {
    Present: "bg-green-100 text-green-700 border-green-300",
    Absent: "bg-red-100 text-red-700 border-red-300",
    Halfday: "bg-yellow-100 text-yellow-700 border-yellow-300",
    Medical: "bg-purple-100 text-purple-700 border-purple-300",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Full Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attendance Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {students.map((student) => {
              const initials = student.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase();
              const currentStatus = attendanceStatus[student._id] || "Absent";

              return (
                <tr key={student._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-semibold text-sm">
                      {initials}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{student.name}</div>
                    <div className="text-sm text-gray-500">Roll No: {student.rollNumber}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {["Present", "Absent", "Halfday", "Medical"].map((status) => (
                        <button
                          key={status}
                          onClick={() => onToggleStatus(student._id, status)}
                          className={`px-3 py-1 rounded-lg border-2 font-medium text-sm transition ${
                            currentStatus === status
                              ? statusColors[status]
                              : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
