import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";

// Mock payment data - replace with API call
const seedPayments = [
  { id: 1, student: "Tabitha Cameron", studentId: "greenField_C12ART_014", class: "Class 12 - Arts - A", feeType: "Tuition Fees", amount: 10000, penalty: 0, status: "Approved", invoicedOn: "2026-01-22", month: "Dec, 2025" },
  { id: 2, student: "Dashiell Blackwood", studentId: "greenField_C12ART_015", class: "Class 12 - Arts - A", feeType: "Exam Fees", amount: 900, penalty: 2870, status: "Approved", invoicedOn: "2026-01-22", month: "Apr, 2025" },
  { id: 3, student: "Dashiell Blackwood", studentId: "greenField_C12ART_015", class: "Class 12 - Arts - A", feeType: "Tuition Fees", amount: 1000, penalty: 120, status: "Approved", invoicedOn: "2026-01-22", month: "Jan, 2026" },
  { id: 4, student: "Gourav Singh", studentId: "Gourav92", class: "Class 12 - PCM - A", feeType: "Activity Fees", amount: 750, penalty: 0, status: "Approved", invoicedOn: "2026-01-22", month: "Oct, 2025" },
  { id: 5, student: "Gourav Singh", studentId: "Gourav92", class: "Class 12 - PCM - A", feeType: "Activity Fees", amount: 750, penalty: 0, status: "Approved", invoicedOn: "2026-01-22", month: "Jul, 2025" },
  { id: 6, student: "Gourav Singh", studentId: "Gourav92", class: "Class 12 - PCM - A", feeType: "Activity Fees", amount: 750, penalty: 0, status: "Approved", invoicedOn: "2026-01-22", month: "Apr, 2025" },
  { id: 7, student: "Oscar Lewis", studentId: "greenField_C2_011", class: "Class 2 - A", feeType: "Transportation Fees", amount: 2000, penalty: 800, status: "Approved", invoicedOn: "2026-01-22", month: "Nov, 2025" },
  { id: 8, student: "Freya White", studentId: "greenField_C2_012", class: "Class 2 - A", feeType: "Tuition Fees", amount: 5000, penalty: 500, status: "Approved", invoicedOn: "2026-01-22", month: "Nov, 2025" },
  { id: 9, student: "Evie Hughes", studentId: "greenField_C2_014", class: "Class 2 - A", feeType: "Tuition Fees", amount: 5000, penalty: 200, status: "Approved", invoicedOn: "2026-01-22", month: "Jan, 2026" },
  { id: 10, student: "Evie Hughes", studentId: "greenField_C2_014", class: "Class 2 - A", feeType: "Tuition Fees", amount: 5000, penalty: 0, status: "Approved", invoicedOn: "2026-01-22", month: "Dec, 2025" },
  { id: 11, student: "Evie Hughes", studentId: "greenField_C2_014", class: "Class 2 - A", feeType: "Tuition Fees", amount: 5000, penalty: 0, status: "Approved", invoicedOn: "2026-01-22", month: "Nov, 2025" },
  { id: 12, student: "Evie Hughes", studentId: "greenField_C2_014", class: "Class 2 - A", feeType: "Annual Fees", amount: 9090, penalty: 0, status: "Approved", invoicedOn: "2026-01-22", month: "Apr, 2025" },
  { id: 13, student: "Arthur King", studentId: "greenField_C2_015", class: "Class 2 - A", feeType: "Annual Fees", amount: 9090, penalty: 0, status: "Approved", invoicedOn: "2026-01-22", month: "Oct, 2025" },
  { id: 14, student: "Arthur King", studentId: "greenField_C2_015", class: "Class 2 - A", feeType: "Tuition Fees", amount: 5000, penalty: 0, status: "Approved", invoicedOn: "2026-01-22", month: "Nov, 2025" },
  { id: 15, student: "Tanzila Ali", studentId: "tanzilaa", class: "UKG - A", feeType: "Admission Fee", amount: 15000, penalty: 0, status: "Approved", invoicedOn: "2026-01-22", month: "Apr, 2025" },
  { id: 16, student: "Tanzila Ali", studentId: "tanzilaa", class: "UKG - A", feeType: "Tuition Fees", amount: 5000, penalty: 0, status: "Approved", invoicedOn: "2026-01-22", month: "Apr, 2025" },
  { id: 17, student: "Gourav Singh", studentId: "Gourav92", class: "Class 12 - PCM - A", feeType: "Admission Fee", amount: 20000, penalty: 0, status: "Approved", invoicedOn: "2026-01-22", month: "Apr, 2025" },
  { id: 18, student: "Gourav Singh", studentId: "Gourav92", class: "Class 12 - PCM - A", feeType: "Tuition Fees", amount: 4500, penalty: 0, status: "Approved", invoicedOn: "2026-01-22", month: "Jun, 2025" },
  { id: 19, student: "Gourav Singh", studentId: "Gourav92", class: "Class 12 - PCM - A", feeType: "Tuition Fees", amount: 10000, penalty: 0, status: "Approved", invoicedOn: "2026-01-22", month: "Jul, 2025" },
  { id: 20, student: "Gourav Singh", studentId: "Gourav92", class: "Class 12 - PCM - A", feeType: "Tuition Fees", amount: 10000, penalty: 0, status: "Approved", invoicedOn: "2026-01-22", month: "Aug, 2025" },
];

export default function RecentPayments() {
  const [payments] = useState(seedPayments);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const filtered = useMemo(() => {
    return payments.filter((p) =>
      p.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.class.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [payments, searchTerm]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const currentItems = filtered.slice(startIdx, endIdx);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Recent Payments</h1>
          <p className="text-sm text-slate-500">
            Showing {startIdx + 1}-{Math.min(endIdx, filtered.length)} of {filtered.length} items
          </p>
        </div>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student, ID, or class..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Student</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Class</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Fee Type</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wide">Amount</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wide">Penalty</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Invoiced On</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Month</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentItems.map((payment, idx) => (
                <tr
                  key={payment.id}
                  className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-cyan-50/50 transition-colors duration-150"
                >
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-900">{payment.student}</span>
                      <span className="text-xs text-slate-500">({payment.studentId})</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">{payment.class}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {payment.feeType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
                    ₹ {payment.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-medium">
                    {payment.penalty > 0 ? (
                      <span className="text-red-600">₹ {payment.penalty.toLocaleString()}</span>
                    ) : (
                      <span className="text-slate-400">₹ 0</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center">
                      {payment.status === "Approved" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                          <CheckCircle2 className="h-3 w-3" />
                          Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                          <AlertCircle className="h-3 w-3" />
                          Pending
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{payment.invoicedOn}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{payment.month}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
