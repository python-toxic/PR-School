import { useEffect, useMemo, useState } from "react";

export default function CurrentHomeworkList() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const savedClasses = localStorage.getItem("classes-list");
    if (savedClasses) setClasses(JSON.parse(savedClasses));
    const savedStudents = localStorage.getItem("admitted-students");
    if (savedStudents) setStudents(JSON.parse(savedStudents));
  }, []);

  // Determine current assignment for the class (from class-homeworks)
  const assignmentInfo = useMemo(() => {
    const raw = localStorage.getItem("class-homeworks");
    if (!raw || !selectedClass) return null;
    const map = JSON.parse(raw);
    const list = map[selectedClass] || [];
    if (list.length === 0) return null;
    const latest = list[0];
    return {
      title: latest.title,
      startDate: latest.startDate,
      endDate: latest.endDate,
      status: "Pending",
    };
  }, [selectedClass]);

  const classStudents = useMemo(() => {
    return students.filter((s) => (s.class || "") === selectedClass);
  }, [students, selectedClass]);

  const totalPages = Math.max(1, Math.ceil(classStudents.length / pageSize));
  const pagedStudents = useMemo(() => {
    const start = (page - 1) * pageSize;
    return classStudents.slice(start, start + pageSize);
  }, [classStudents, page]);

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-4">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Select Class</label>
          <select
            value={selectedClass}
            onChange={(e) => { setSelectedClass(e.target.value); setPage(1); }}
            className="w-full rounded-lg border border-blue-300 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          >
            <option value="">Choose a class</option>
            {classes.map((c) => (
              <option key={`${c.name}-${c.section}`} value={`${c.name} - ${c.section}`}>
                {c.name} - {c.section}
              </option>
            ))}
          </select>
        </div>
        {assignmentInfo && (
          <div className="px-4 py-3 rounded-xl bg-blue-50 border border-blue-200 text-sm text-blue-800">
            <span className="font-semibold">Current Assignment:</span> {assignmentInfo.title} • {assignmentInfo.startDate} - {assignmentInfo.endDate}
          </div>
        )}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pagedStudents.map((s) => (
          <div key={s.rollNo || s.id}
               className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 shadow hover:shadow-lg transition-all p-4">
            <div className="text-xs text-blue-700 font-semibold">Check homework</div>
            <div className="mt-2 space-y-1">
              <div className="text-sm">
                <span className="font-semibold">Assigned To</span><br/>
                {s.firstName} {s.lastName} ({s.rollNo || s.admissionNo || s.id})
              </div>
              <div className="text-sm">
                <span className="font-semibold">Class</span><br/>
                {selectedClass || (s.class || "-")}
              </div>
              <div className="text-sm">
                <span className="font-semibold">Status</span><br/>
                <span className="inline-block px-2 py-0.5 rounded bg-green-100 text-green-800 border border-green-200">Pending</span>
              </div>
              <div className="text-sm">
                <span className="font-semibold">Duration</span><br/>
                {assignmentInfo ? (
                  <span>
                    {new Date(assignmentInfo.startDate).toLocaleString("en-US", { month: "short" })} {new Date(assignmentInfo.startDate).getDate()} -
                    {" "}
                    {new Date(assignmentInfo.endDate).toLocaleString("en-US", { month: "short" })} {new Date(assignmentInfo.endDate).getDate()}, {new Date(assignmentInfo.endDate).getFullYear()}
                  </span>
                ) : (
                  <span>—</span>
                )}
              </div>
            </div>
            <div className="mt-3">
              <button className="w-full px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-semibold">
                View & Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`w-8 h-8 rounded-md border ${
                n === page ? "bg-blue-600 text-white border-blue-600" : "bg-white text-blue-700 border-blue-300"
              } shadow hover:shadow-md transition`}
            >
              {n}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}