import { useMemo, useState } from "react";
import { Download, Filter, Calendar, FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";

const currency = (val) => "Rs " + Number(val).toLocaleString();

// Sample payments (can be replaced with live data)
const samplePayments = [
  { student: "Tabitha Cameron", username: "greenField_C12ART_014", cls: "Class 12 - Arts - A", type: "Tuition Fees", amount: 10000, mode: "Online", ref: "-", status: "Approved", date: "Jan 23, 2026" },
  { student: "Dashiell Blackwood", username: "greenField_C12ART_015", cls: "Class 12 - Arts - A", type: "Exam Fees", amount: 900, mode: "Online", ref: "-", status: "Approved", date: "Jan 23, 2026" },
  { student: "Dashiell Blackwood", username: "greenField_C12ART_015", cls: "Class 12 - Arts - A", type: "Tuition Fees", amount: 1000, mode: "Online", ref: "-", status: "Approved", date: "Jan 23, 2026" },
  { student: "Gourav Singh", username: "Gourav92", cls: "Class 12 - PCM - A", type: "Activity Fees", amount: 750, mode: "Online", ref: "-", status: "Approved", date: "Jan 23, 2026" },
  { student: "Oscar Lewis", username: "greenField_C2_011", cls: "Class 2 - A", type: "Transportation Fees", amount: 2000, mode: "Online", ref: "-", status: "Approved", date: "Jan 22, 2026" },
  { student: "Freya White", username: "greenField_C2_012", cls: "Class 2 - A", type: "Tuition Fees", amount: 5000, mode: "Online", ref: "-", status: "Approved", date: "Jan 22, 2026" },
  { student: "Evie Hughes", username: "greenField_C2_014", cls: "Class 2 - A", type: "Tuition Fees", amount: 5000, mode: "Online", ref: "-", status: "Approved", date: "Jan 22, 2026" },
  { student: "Evie Hughes", username: "greenField_C2_014", cls: "Class 2 - A", type: "Annual Fees", amount: 9090, mode: "Online", ref: "-", status: "Approved", date: "Jan 22, 2026" },
  { student: "Arthur King", username: "greenField_C2_015", cls: "Class 2 - A", type: "Annual Fees", amount: 9090, mode: "Online", ref: "-", status: "Approved", date: "Jan 22, 2026" },
  { student: "Gourav Singh", username: "Gourav92", cls: "Class 12 - PCM - A", type: "Admission Fee", amount: 20000, mode: "Online", ref: "-", status: "Approved", date: "Jan 22, 2026" },
  { student: "Gourav Singh", username: "Gourav92", cls: "Class 12 - PCM - A", type: "Tuition Fees", amount: 10000, mode: "Cash Deposit", ref: "1314GHIK2", status: "Approved", date: "Jan 22, 2026" },
  { student: "Dashiell Blackwood", username: "greenField_C12ART_015", cls: "Class 12 - Arts - A", type: "Admission Fees", amount: 15000, mode: "Online", ref: "988676134", status: "Approved", date: "Jan 22, 2026" },
];

const monthFromDate = (dateStr) => {
  const m = dateStr.match(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s\d{1,2},\s(\d{4})$/);
  if (!m) return "Unknown";
  return `${m[1]} ${m[2]}`; // e.g., Jan 2026
};

export default function AuditTaxReports() {
  const [classFilter, setClassFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "01 Apr 2025", end: "22 Dec 2025" });

  const payments = useMemo(() => {
    // Later: merge localStorage data if available
    return samplePayments;
  }, []);

  const filtered = useMemo(() => {
    return payments.filter(p => {
      const classOk = classFilter === "all" || p.cls.toLowerCase().includes(classFilter.toLowerCase());
      const statusOk = statusFilter === "all" || p.status.toLowerCase() === statusFilter.toLowerCase();
      return classOk && statusOk;
    });
  }, [payments, classFilter, statusFilter]);

  // Class-wise: grouped by student, monthly breakdown
  const classWiseRows = useMemo(() => {
    const months = Array.from(new Set(filtered.map(p => monthFromDate(p.date)))).filter(m => m !== "Unknown");
    const byStudent = {};
    filtered.forEach(p => {
      const key = p.username || p.student;
      if (!byStudent[key]) {
        byStudent[key] = { student: p.student, username: p.username || "-", cls: p.cls };
        months.forEach(m => { byStudent[key][m] = 0; });
      }
      const mKey = monthFromDate(p.date);
      if (months.includes(mKey)) byStudent[key][mKey] += Number(p.amount);
    });
    const rows = Object.values(byStudent).map(r => ({ ...r, total: months.reduce((sum, m) => sum + (r[m] || 0), 0) }));
    return { months, rows };
  }, [filtered]);

  // Day-by-day: raw transactional log
  const dayByDayRows = useMemo(() => {
    return filtered.map(p => ({
      date: p.date,
      student: p.student,
      username: p.username || "-",
      cls: p.cls,
      type: p.type,
      amount: p.amount,
      mode: p.mode,
      ref: p.ref,
      status: p.status,
    }));
  }, [filtered]);

  // Month-by-month: per student per month totals
  const monthByMonthRows = useMemo(() => {
    const agg = {};
    filtered.forEach(p => {
      const month = monthFromDate(p.date);
      const key = `${p.username || p.student}__${month}`;
      if (!agg[key]) {
        agg[key] = { month, student: p.student, username: p.username || "-", cls: p.cls, total: 0 };
      }
      agg[key].total += Number(p.amount);
    });
    return Object.values(agg);
  }, [filtered]);

  const exportToExcel = (sheets) => {
    const wb = XLSX.utils.book_new();
    sheets.forEach(({ name, data }) => {
      const ws = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, name);
    });
    const ts = new Date().toISOString().slice(0,19).replace(/[:T]/g, "-");
    XLSX.writeFile(wb, `fees-audit-export-${ts}.xlsx`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Audit & Tax Reports</h1>
          <p className="text-sm text-slate-600">Generate detailed fees reports for audit and tax purposes</p>
        </div>
        <div className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full shadow-inner">Excel exports included</div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2">
          <Filter size={16} className="text-slate-500"/>
          <select value={classFilter} onChange={(e)=>setClassFilter(e.target.value)} className="flex-1 bg-transparent text-sm outline-none">
            <option value="all">All Classes</option>
            <option value="Class 12">Class 12</option>
            <option value="Class 2">Class 2</option>
          </select>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2">
          <Filter size={16} className="text-slate-500"/>
          <select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)} className="flex-1 bg-transparent text-sm outline-none">
            <option value="all">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2">
          <Calendar size={16} className="text-slate-500"/>
          <span className="text-sm text-slate-600">{dateRange.start} - {dateRange.end}</span>
        </div>
      </div>

      {/* Class-wise Report */}
      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <FileSpreadsheet size={18} className="text-slate-500"/>
            <h3 className="font-semibold text-slate-900">Class-wise Report</h3>
          </div>
          <button
            onClick={() => {
              const cols = classWiseRows.months;
              const data = classWiseRows.rows.map(r => {
                const row = { Student: r.student, Username: r.username, Class: r.cls };
                cols.forEach(m => { row[m] = r[m] ? r[m] : 0; });
                row.Total = cols.reduce((sum, m) => sum + (r[m] || 0), 0);
                return row;
              });
              exportToExcel([{ name: "Class-wise", data }]);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            <Download size={16} />
            Generate Excel
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-700">
                <th className="px-4 py-2 text-left">Student</th>
                <th className="px-4 py-2 text-left">Username</th>
                <th className="px-4 py-2 text-left">Class</th>
                {classWiseRows.months.map(m => (<th key={m} className="px-4 py-2 text-left">{m}</th>))}
                <th className="px-4 py-2 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              {classWiseRows.rows.slice(0, 10).map((r, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="px-4 py-2 font-medium text-slate-900">{r.student}</td>
                  <td className="px-4 py-2 text-slate-700">{r.username}</td>
                  <td className="px-4 py-2 text-slate-700">{r.cls}</td>
                  {classWiseRows.months.map(m => (<td key={m} className="px-4 py-2 text-slate-700">{currency(r[m] || 0)}</td>))}
                  <td className="px-4 py-2 font-semibold text-slate-900">{currency(r.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Day-by-Day Report */}
      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <FileSpreadsheet size={18} className="text-slate-500"/>
            <h3 className="font-semibold text-slate-900">Day-by-Day Report</h3>
          </div>
          <button
            onClick={() => {
              const data = dayByDayRows.map(p => ({
                Date: p.date,
                Student: p.student,
                Username: p.username,
                Class: p.cls,
                "Fees Type": p.type,
                Amount: p.amount,
                "Payment Mode": p.mode,
                Reference: p.ref,
                Status: p.status,
              }));
              exportToExcel([{ name: "Day-by-Day", data }]);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            <Download size={16} />
            Generate Excel
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-700">
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Student</th>
                <th className="px-4 py-2 text-left">Username</th>
                <th className="px-4 py-2 text-left">Class</th>
                <th className="px-4 py-2 text-left">Fees Type</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Payment Mode</th>
                <th className="px-4 py-2 text-left">Reference</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {dayByDayRows.slice(0, 10).map((p, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="px-4 py-2 text-slate-700">{p.date}</td>
                  <td className="px-4 py-2 font-medium text-slate-900">{p.student}</td>
                  <td className="px-4 py-2 text-slate-700">{p.username}</td>
                  <td className="px-4 py-2 text-slate-700">{p.cls}</td>
                  <td className="px-4 py-2 text-slate-700">{p.type}</td>
                  <td className="px-4 py-2 font-semibold text-slate-900">{currency(p.amount)}</td>
                  <td className="px-4 py-2 text-slate-700">{p.mode}</td>
                  <td className="px-4 py-2 text-slate-700">{p.ref}</td>
                  <td className="px-4 py-2">
                    <span className={`text-xs px-2 py-1 rounded-full border ${p.status === "Approved" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : p.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-red-50 text-red-700 border-red-200"}`}>{p.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Month-by-Month Report */}
      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <FileSpreadsheet size={18} className="text-slate-500"/>
            <h3 className="font-semibold text-slate-900">Month-by-Month Report</h3>
          </div>
          <button
            onClick={() => {
              const data = monthByMonthRows.map(r => ({
                Month: r.month,
                Student: r.student,
                Username: r.username,
                Class: r.cls,
                Total: r.total,
              }));
              exportToExcel([{ name: "Month-by-Month", data }]);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            <Download size={16} />
            Generate Excel
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-700">
                <th className="px-4 py-2 text-left">Month</th>
                <th className="px-4 py-2 text-left">Student</th>
                <th className="px-4 py-2 text-left">Username</th>
                <th className="px-4 py-2 text-left">Class</th>
                <th className="px-4 py-2 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              {monthByMonthRows.slice(0, 10).map((r, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="px-4 py-2 text-slate-700">{r.month}</td>
                  <td className="px-4 py-2 font-medium text-slate-900">{r.student}</td>
                  <td className="px-4 py-2 text-slate-700">{r.username}</td>
                  <td className="px-4 py-2 text-slate-700">{r.cls}</td>
                  <td className="px-4 py-2 font-semibold text-slate-900">{currency(r.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Export History */}
      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900">Recent Export History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-700">
                <th className="px-4 py-2 text-left">Report Type</th>
                <th className="px-4 py-2 text-left">Date Range</th>
                <th className="px-4 py-2 text-left">Class</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Records</th>
                <th className="px-4 py-2 text-left">Generated At</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { type: "Class-wise Report", range: "01 Apr 2025 - 22 Dec 2025", cls: "All Classes", status: "Completed", records: 367, generated: "5 weeks ago" },
                { type: "Day-by-Day Report", range: "01 Apr 2025 - 22 Dec 2025", cls: "All Classes", status: "Completed", records: 5516, generated: "5 weeks ago" },
              ].map((h, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="px-4 py-2 font-medium text-slate-900">{h.type}</td>
                  <td className="px-4 py-2 text-slate-700">{h.range}</td>
                  <td className="px-4 py-2 text-slate-700">{h.cls}</td>
                  <td className="px-4 py-2 text-slate-700">{h.status}</td>
                  <td className="px-4 py-2 text-slate-700">{h.records}</td>
                  <td className="px-4 py-2 text-slate-700">{h.generated}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => {
                        if (h.type.includes("Class-wise")) {
                          const cols = classWiseRows.months;
                          const data = classWiseRows.rows.map(r => {
                            const row = { Student: r.student, Username: r.username, Class: r.cls };
                            cols.forEach(m => { row[m] = r[m] ? r[m] : 0; });
                            row.Total = cols.reduce((sum, m) => sum + (r[m] || 0), 0);
                            return row;
                          });
                          exportToExcel([{ name: "Class-wise", data }]);
                        } else {
                          const data = dayByDayRows.map(p => ({ Date: p.date, Student: p.student, Username: p.username, Class: p.cls, "Fees Type": p.type, Amount: p.amount, "Payment Mode": p.mode, Reference: p.ref, Status: p.status }));
                          exportToExcel([{ name: "Day-by-Day", data }]);
                        }
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-xs"
                    >
                      <Download size={14} />
                      Download Excel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
