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
