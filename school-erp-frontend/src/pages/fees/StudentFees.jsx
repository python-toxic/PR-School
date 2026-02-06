import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

// Mock student fees data
const seedStudentFees = [
  {
    id: 1,
    name: "Gourav Singh",
    username: "Gourav92",
    class: "Class 12 - PCM - A",
    initials: "GS",
    fees: [
      { type: "Tuition Fees", paid: 88000, total: 120000, status: "Last paid: January 2026" },
      { type: "Annual Fees", paid: 0, total: 9000, status: "Due: April 2025", pending: 9000 },
      { type: "Admission Fee", paid: 20000, total: 20000, status: "Last paid: April 2025" },
      { type: "Transportation Fees", paid: 50000, total: 50000, status: "Last paid: April 2025" },
      { type: "Activity Fees", paid: 2250, total: 3000, status: "Due: January 2026", pending: 750 },
      { type: "Exam Fees", paid: 0, total: 1000, status: "Due: April 2025", pending: 1000 },
      { type: "Admission Fees", paid: 0, total: 15000, status: "Due: April 2025", pending: 15000 },
    ],
  },
  {
    id: 2,
    name: "Dashiell Blackwood",
    username: "greenField_C12ART_015",
    class: "Class 12 - Arts - A",
    initials: "DB",
    fees: [
      { type: "Tuition Fees", paid: 111000, total: 120000, status: "Last paid: March 2026" },
      { type: "Annual Fees", paid: 6000, total: 6000, status: "Last paid: April 2025" },
      { type: "Admission Fee", paid: 15000, total: 15000, status: "Last paid: April 2025" },
      { type: "Transportation Fees", paid: 22000, total: 24000, status: "Last paid: February 2026" },
      { type: "Activity Fees", paid: 1500, total: 3000, status: "Due: October 2025", pending: 1500 },
      { type: "Exam Fees", paid: 900, total: 900, status: "Last paid: April 2025" },
      { type: "Admission Fees", paid: 15000, total: 15000, status: "Last paid: April 2025" },
    ],
  },
  {
    id: 3,
    name: "Tabitha Cameron",
    username: "greenField_C12ART_014",
    class: "Class 12 - Arts - A",
    initials: "TC",
    fees: [
      { type: "Tuition Fees", paid: 90000, total: 120000, status: "Due: January 2026", pending: 10000 },
      { type: "Annual Fees", paid: 8000, total: 8000, status: "Last paid: April 2025" },
      { type: "Admission Fee", paid: 15000, total: 15000, status: "Last paid: April 2025" },
      { type: "Transportation Fees", paid: 18000, total: 24000, status: "Due: January 2026", pending: 2000 },
      { type: "Activity Fees", paid: 0, total: 3000, status: "Due: April 2025", pending: 3000 },
      { type: "Exam Fees", paid: 0, total: 1000, status: "Due: April 2025", pending: 1000 },
      { type: "Admission Fees", paid: 0, total: 15000, status: "Due: April 2025", pending: 15000 },
    ],
  },
  {
    id: 4,
    name: "Bartholomew Kingsley",
    username: "kingsley_b",
    class: "Class 12 - Arts - A",
    initials: "BK",
    fees: [
      { type: "Tuition Fees", paid: 80000, total: 120000, status: "Due: December 2025", pending: 20000 },
      { type: "Admission Fee", paid: 15000, total: 15000, status: "Last paid: April 2025" },
      { type: "Transportation Fees", paid: 16000, total: 24000, status: "Due: December 2025", pending: 4000 },
    ],
  },
];

const getInitialsColor = (initials) => {
  const colors = [
    "from-rose-500 to-pink-500",
    "from-blue-500 to-cyan-500",
    "from-purple-500 to-fuchsia-500",
    "from-amber-500 to-orange-500",
    "from-emerald-500 to-teal-500",
    "from-indigo-500 to-violet-500",
  ];
  const index = initials.charCodeAt(0) % colors.length;
  return colors[index];
};

export default function StudentFees() {
  const [students] = useState(seedStudentFees);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const classes = useMemo(() => {
    const uniqueClasses = [...new Set(students.map((s) => s.class))];
    return uniqueClasses;
  }, [students]);

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.username.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClass = selectedClass ? s.class === selectedClass : true;
      return matchesSearch && matchesClass;
    });
  }, [students, searchTerm, selectedClass]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const currentItems = filtered.slice(startIdx, endIdx);

  const calculateTotals = (fees) => {
    const totalPaid = fees.reduce((sum, f) => sum + f.paid, 0);
    const totalAmount = fees.reduce((sum, f) => sum + f.total, 0);
    return { totalPaid, totalAmount };
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Student Fees</h1>
          <p className="text-sm text-slate-500">
            Showing {startIdx + 1}-{Math.min(endIdx, filtered.length)} of {filtered.length}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or username"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Classes</option>
            {classes.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Student Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {currentItems.map((student) => {
          const { totalPaid, totalAmount } = calculateTotals(student.fees);
          const totalPercentage = totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 0;

          return (
            <div
              key={student.id}
              className="group relative bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
            >
              {/* Header with gradient */}
              <div className={`bg-gradient-to-r ${getInitialsColor(student.initials)} p-4`}>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {student.initials}
                  </div>
                  <div className="text-white">
                    <h3 className="font-semibold text-lg leading-tight">{student.name}</h3>
                    <p className="text-sm text-white/90">{student.class}</p>
                  </div>
                </div>
              </div>

              {/* Fee Details */}
              <div className="p-4 space-y-3">
                {student.fees.map((fee, idx) => {
                  const percentage = fee.total > 0 ? (fee.paid / fee.total) * 100 : 0;
                  const isPending = fee.pending && fee.pending > 0;

                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700">{fee.type}</span>
                        <span className="text-xs font-semibold text-slate-900">
                          ₹{fee.paid.toLocaleString()} / ₹{fee.total.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            percentage >= 100
                              ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                              : percentage >= 50
                              ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                              : "bg-gradient-to-r from-amber-500 to-orange-500"
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span
                          className={
                            fee.status.includes("Last paid")
                              ? "text-emerald-600"
                              : "text-amber-600"
                          }
                        >
                          {fee.status}
                        </span>
                        {isPending && (
                          <span className="font-semibold text-red-600">
                            ₹{fee.pending.toLocaleString()} pending
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Total Summary */}
                <div className="pt-3 mt-3 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900">Total Progress</span>
                    <span className="text-sm font-bold text-slate-900">
                      ₹{totalPaid.toLocaleString()} / ₹{totalAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-2 h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-500"
                      style={{ width: `${Math.min(totalPercentage, 100)}%` }}
                    />
                  </div>
                  <div className="mt-1 text-center text-xs font-medium text-slate-600">
                    {totalPercentage.toFixed(1)}% Complete
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-600">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {[...Array(Math.min(10, totalPages))].map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-2 rounded-lg border transition-colors ${
                  currentPage === pageNum
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
