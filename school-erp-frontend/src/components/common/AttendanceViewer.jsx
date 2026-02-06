import { Calendar, CheckCircle, XCircle } from "lucide-react";

export default function AttendanceViewer({
  title,
  attendance,
  fromDate,
  toDate,
  setFromDate,
  setToDate,
}) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <h2 className="text-2xl font-semibold mb-6">{title}</h2>

      {/* Date Range */}
      <div className="flex flex-wrap items-end gap-4 mb-6">
        {/* From */}
        <div className="flex flex-col">
          <label className="text-sm mb-1 text-gray-600">From</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="pl-10 pr-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        {/* To */}
        <div className="flex flex-col">
          <label className="text-sm mb-1 text-gray-600">To</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={toDate}
              min={fromDate}
              onChange={(e) => setToDate(e.target.value)}
              className="pl-10 pr-3 py-2 border rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      {fromDate && toDate ? (
        attendance.length > 0 ? (
          <table className="w-full border rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((rec) => (
                <tr key={rec.id} className="border-t">
                  <td className="px-4 py-2">{rec.date}</td>
                  <td className="px-4 py-2 flex items-center gap-2">
                    {rec.status === "Present" ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-green-600 font-medium">
                          Present
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-red-600" />
                        <span className="text-red-600 font-medium">
                          Absent
                        </span>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No records found.</p>
        )
      ) : (
        <p className="text-gray-500">
          Please select a date range to view attendance.
        </p>
      )}
    </div>
  );
}
