import { useMemo, useState } from "react";
import { Download, TrendingUp, PieChart as PieIcon, Table as TableIcon, Calendar, Filter, Send, X, Bell, Mail, MessageCircle } from "lucide-react";
import { useNotifications } from "../../context/NotificationContext.jsx";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  AreaChart,
  Area
} from "recharts";

const currency = (val) => `₹${Number(val).toLocaleString()}`;

const COLORS = ["#22c55e", "#f59e0b", "#ef4444", "#06b6d4", "#8b5cf6"];

export default function FeesReports() {
  const { addNotification } = useNotifications();
  const [classFilter, setClassFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [reminderChannels, setReminderChannels] = useState({ inApp: true, email: false, whatsapp: false });

  // Summary metrics (static for now, can be computed from storage/API later)
  const summary = {
    totalAmount: 46003580,
    totalEntries: 1366,
    monthCollection: 448330,
    monthPayments: 60,
    overdueAmount: 2034490,
    overdueCount: 189,
    monthDue: 10436900,
    monthDueCount: 845,
  };

  // Collection trend (last 6 months)
  const collectionTrend = [
    { month: "Aug", collected: 690000, due: 250000 },
    { month: "Sep", collected: 740000, due: 300000 },
    { month: "Oct", collected: 820000, due: 350000 },
    { month: "Nov", collected: 910000, due: 400000 },
    { month: "Dec", collected: 980000, due: 450000 },
    { month: "Jan", collected: 448330, due: 500000 },
  ];

  // Payment status distribution
  const statusDistribution = [
    { name: "Approved", value: 76 },
    { name: "Pending", value: 18 },
    { name: "Rejected", value: 6 },
  ];

  // Paid vs Remaining (Pie)
  const paidRemaining = [
    { name: "Paid", value: 34000000 },
    { name: "Remaining", value: 12003580 },
  ];

  // Recent payments (20) — sample records provided
  const recentPayments = [
    { student: "Tabitha Cameron", username: "greenField_C12ART_014", cls: "Class 12 - Arts - A", type: "Tuition Fees", amount: 10000, mode: "Online", ref: "-", status: "Approved", date: "Jan 23, 2026" },
    { student: "Dashiell Blackwood", username: "greenField_C12ART_015", cls: "Class 12 - Arts - A", type: "Exam Fees", amount: 900, mode: "Online", ref: "-", status: "Approved", date: "Jan 23, 2026" },
    { student: "Dashiell Blackwood", username: "greenField_C12ART_015", cls: "Class 12 - Arts - A", type: "Tuition Fees", amount: 1000, mode: "Online", ref: "-", status: "Approved", date: "Jan 23, 2026" },
    { student: "Gourav Singh", username: "Gourav92", cls: "Class 12 - PCM - A", type: "Activity Fees", amount: 750, mode: "Online", ref: "-", status: "Approved", date: "Jan 23, 2026" },
    { student: "Gourav Singh", username: "Gourav92", cls: "Class 12 - PCM - A", type: "Activity Fees", amount: 750, mode: "Online", ref: "-", status: "Approved", date: "Jan 23, 2026" },
    { student: "Gourav Singh", username: "Gourav92", cls: "Class 12 - PCM - A", type: "Activity Fees", amount: 750, mode: "Online", ref: "-", status: "Approved", date: "Jan 23, 2026" },
    { student: "Oscar Lewis", username: "greenField_C2_011", cls: "Class 2 - A", type: "Transportation Fees", amount: 2000, mode: "Online", ref: "-", status: "Approved", date: "Jan 22, 2026" },
    { student: "Freya White", username: "greenField_C2_012", cls: "Class 2 - A", type: "Tuition Fees", amount: 5000, mode: "Online", ref: "-", status: "Approved", date: "Jan 22, 2026" },
    { student: "Evie Hughes", username: "greenField_C2_014", cls: "Class 2 - A", type: "Tuition Fees", amount: 5000, mode: "Online", ref: "-", status: "Approved", date: "Jan 22, 2026" },
    { student: "Evie Hughes", username: "greenField_C2_014", cls: "Class 2 - A", type: "Tuition Fees", amount: 5000, mode: "Online", ref: "-", status: "Approved", date: "Jan 22, 2026" },
    { student: "Evie Hughes", username: "greenField_C2_014", cls: "Class 2 - A", type: "Tuition Fees", amount: 5000, mode: "Online", ref: "-", status: "Approved", date: "Jan 22, 2026" },
    { student: "Evie Hughes", username: "greenField_C2_014", cls: "Class 2 - A", type: "Annual Fees", amount: 9090, mode: "Online", ref: "-", status: "Approved", date: "Jan 22, 2026" },
    { student: "Arthur King", username: "greenField_C2_015", cls: "Class 2 - A", type: "Annual Fees", amount: 9090, mode: "Online", ref: "-", status: "Approved", date: "Jan 22, 2026" },
    { student: "Arthur King", username: "greenField_C2_015", cls: "Class 2 - A", type: "Tuition Fees", amount: 5000, mode: "Online", ref: "-", status: "Approved", date: "Jan 22, 2026" },
    { student: "Gourav Singh", username: "Gourav92", cls: "Class 12 - PCM - A", type: "Admission Fee", amount: 20000, mode: "Online", ref: "-", status: "Approved", date: "Jan 22, 2026" },
    { student: "Gourav Singh", username: "Gourav92", cls: "Class 12 - PCM - A", type: "Tuition Fees", amount: 4500, mode: "Online", ref: "-", status: "Approved", date: "Jan 22, 2026" },
    { student: "Gourav Singh", username: "Gourav92", cls: "Class 12 - PCM - A", type: "Tuition Fees", amount: 10000, mode: "Cash Deposit", ref: "1314GHIK2", status: "Approved", date: "Jan 22, 2026" },
    { student: "Gourav Singh", username: "Gourav92", cls: "Class 12 - PCM - A", type: "Tuition Fees", amount: 10000, mode: "Cash Deposit", ref: "1314GHIK2", status: "Approved", date: "Jan 22, 2026" },
    { student: "Gourav Singh", username: "Gourav92", cls: "Class 12 - PCM - A", type: "Tuition Fees", amount: 10000, mode: "Cash Deposit", ref: "1314GHIK2", status: "Approved", date: "Jan 22, 2026" },
    { student: "Dashiell Blackwood", username: "greenField_C12ART_015", cls: "Class 12 - Arts - A", type: "Admission Fees", amount: 15000, mode: "Online", ref: "988676134", status: "Approved", date: "Jan 22, 2026" },
  ];

  const filteredPayments = useMemo(() => {
    return recentPayments.filter((p) => {
      const classOk = classFilter === "all" || p.cls.toLowerCase().includes(classFilter.toLowerCase());
      const typeOk = typeFilter === "all" || p.type.toLowerCase().includes(typeFilter.toLowerCase());
      return classOk && typeOk;
    });
  }, [classFilter, typeFilter, recentPayments]);

  const handleSendReminder = () => {
    if (!selectedRow) return;
    // In-app notification
    if (reminderChannels.inApp) {
      addNotification({
        type: "fee_reminder",
        priority: "high",
        title: "Fee Payment Reminder",
        message: `Dear ${selectedRow.student}, you have pending fees of ${currency(selectedRow.amount)}. Please clear your dues at the earliest.`,
        userId: selectedRow.username || null,
        actionUrl: "/fees/student-fees",
      });
    }
    // Email / WhatsApp placeholders
    if (reminderChannels.email) console.log("Email reminder queued for:", selectedRow.student);
    if (reminderChannels.whatsapp) console.log("WhatsApp reminder queued for:", selectedRow.student);

    setShowReminderModal(false);
    setSelectedRow(null);
    alert("Reminder sent successfully!");
  };

  const ReminderModal = () => {
    if (!showReminderModal || !selectedRow) return null;
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full shadow-2xl">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-3 flex items-center justify-between rounded-t-xl">
            <div className="flex items-center gap-2">
              <Send className="text-white" size={20} />
              <h2 className="text-lg font-bold text-white">Send Reminder</h2>
            </div>
            <button onClick={() => { setShowReminderModal(false); setSelectedRow(null); }} className="text-white hover:bg-green-600 p-1 rounded">
              <X size={18} />
            </button>
          </div>
          <div className="p-4 space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">Details</h3>
              <div className="space-y-1 text-xs">
                <p><span className="text-gray-600">Student:</span> <span className="font-medium">{selectedRow.student}</span></p>
                {selectedRow.username && <p><span className="text-gray-600">Username:</span> <span className="font-medium">{selectedRow.username}</span></p>}
                <p><span className="text-gray-600">Class:</span> <span className="font-medium">{selectedRow.cls}</span></p>
                {selectedRow.type && <p><span className="text-gray-600">Fee Type:</span> <span className="font-medium">{selectedRow.type}</span></p>}
              </div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">Pending Amount</h3>
              <p className="text-2xl font-bold text-red-600">{currency(selectedRow.amount)}</p>
              {selectedRow.dueDate && <p className="text-xs text-gray-600 mt-1">Due: {selectedRow.dueDate}{selectedRow.days ? ` - ${selectedRow.days} days overdue` : ""}</p>}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">Select Channels</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg">
                  <input type="checkbox" checked={reminderChannels.inApp} onChange={(e)=>setReminderChannels({ ...reminderChannels, inApp: e.target.checked })} className="w-4 h-4" />
                  <Bell className="text-blue-600" size={18} />
                  <span className="text-sm">In-App</span>
                </label>
                <label className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg">
                  <input type="checkbox" checked={reminderChannels.email} onChange={(e)=>setReminderChannels({ ...reminderChannels, email: e.target.checked })} className="w-4 h-4" />
                  <Mail className="text-purple-600" size={18} />
                  <span className="text-sm">Email</span>
                </label>
                <label className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg">
                  <input type="checkbox" checked={reminderChannels.whatsapp} onChange={(e)=>setReminderChannels({ ...reminderChannels, whatsapp: e.target.checked })} className="w-4 h-4" />
                  <MessageCircle className="text-green-600" size={18} />
                  <span className="text-sm">WhatsApp</span>
                </label>
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">Message</h3>
              <p className="text-xs text-gray-700">Dear {selectedRow.student}, you have pending fees of {currency(selectedRow.amount)}. Please clear your dues at the earliest.</p>
            </div>
          </div>
          <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 flex gap-2 justify-end rounded-b-xl">
            <button onClick={() => { setShowReminderModal(false); setSelectedRow(null); }} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-100">Cancel</button>
            <button onClick={handleSendReminder} className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 inline-flex items-center gap-1.5">
              <Send size={14} />
              Send
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Overdue Fees sample rows (subset of 50)
  const overdueFees = [
    { student: "Evie Hughes", username: "greenField_C2_014", cls: "Class 2 - A", type: "Tuition Fees", amount: 5000, dueDate: "Jan 10, 2026", days: 15 },
    { student: "Arthur King", username: "greenField_C2_015", cls: "Class 2 - A", type: "Annual Fees", amount: 9090, dueDate: "Jan 12, 2026", days: 13 },
    { student: "Gourav Singh", username: "Gourav92", cls: "Class 12 - PCM - A", type: "Tuition Fees", amount: 25000, dueDate: "Jan 07, 2026", days: 18 },
    { student: "Freya White", username: "greenField_C2_012", cls: "Class 2 - A", type: "Transportation Fees", amount: 2000, dueDate: "Jan 09, 2026", days: 16 },
    { student: "Tabitha Cameron", username: "greenField_C12ART_014", cls: "Class 12 - Arts - A", type: "Tuition Fees", amount: 10000, dueDate: "Jan 08, 2026", days: 17 },
  ];

  // Top Defaulters ranking (10) from user list
  const topDefaulters = [
    { rank: 1, student: "Harper Patel", username: "greenField_L015", cls: "UKG - A", count: 20, amount: 70000, oldest: "Jan 7, 2026" },
    { rank: 2, student: "Olivia Martinez", username: "greenField_L001", cls: "UKG - A", count: 20, amount: 70000, oldest: "Jan 7, 2026" },
    { rank: 3, student: "Liam Anderson", username: "greenField_L002", cls: "UKG - A", count: 20, amount: 70000, oldest: "Jan 7, 2026" },
    { rank: 4, student: "Sophia Williams", username: "greenField_L003", cls: "UKG - A", count: 20, amount: 70000, oldest: "Jan 7, 2026" },
    { rank: 5, student: "Noah Thompson", username: "greenField_L004", cls: "UKG - A", count: 20, amount: 70000, oldest: "Jan 7, 2026" },
    { rank: 6, student: "Ava Garcia", username: "greenField_L005", cls: "UKG - A", count: 20, amount: 70000, oldest: "Jan 7, 2026" },
    { rank: 7, student: "Ethan Rodriguez", username: "greenField_L006", cls: "UKG - A", count: 20, amount: 70000, oldest: "Jan 7, 2026" },
    { rank: 8, student: "Isabella Chen", username: "greenField_L007", cls: "UKG - A", count: 20, amount: 70000, oldest: "Jan 7, 2026" },
    { rank: 9, student: "Alexander Kim", username: "greenField_L014", cls: "UKG - A", count: 20, amount: 70000, oldest: "Jan 7, 2026" },
    { rank: 10, student: "Amelia Lee", username: "greenField_L013", cls: "UKG - A", count: 20, amount: 70000, oldest: "Jan 7, 2026" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Fees Reports</h1>
          <p className="text-sm text-slate-600">Analytics, charts, and tabular insights</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
            <Download size={16} />
            Export Report
          </button>
        </div>
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
          <select value={typeFilter} onChange={(e)=>setTypeFilter(e.target.value)} className="flex-1 bg-transparent text-sm outline-none">
            <option value="all">All Fee Types</option>
            <option value="Tuition Fees">Tuition Fees</option>
            <option value="Annual Fees">Annual Fees</option>
            <option value="Admission Fee">Admission Fee</option>
            <option value="Transportation Fees">Transportation Fees</option>
            <option value="Exam Fees">Exam Fees</option>
            <option value="Activity Fees">Activity Fees</option>
          </select>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2">
          <Calendar size={16} className="text-slate-500"/>
          <span className="text-sm text-slate-600">January 2026</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-600 font-medium">Total Fees Amount</p>
              <h3 className="text-2xl font-bold text-emerald-700">{currency(summary.totalAmount)}</h3>
              <p className="text-xs text-emerald-700/70 mt-1">{summary.totalEntries} fees entries</p>
            </div>
            <TrendingUp className="text-emerald-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">This Month Collection</p>
              <h3 className="text-2xl font-bold text-blue-700">{currency(summary.monthCollection)}</h3>
              <p className="text-xs text-blue-700/70 mt-1">{summary.monthPayments} payments</p>
            </div>
            <TrendingUp className="text-blue-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Overdue Amount</p>
              <h3 className="text-2xl font-bold text-red-700">{currency(summary.overdueAmount)}</h3>
              <p className="text-xs text-red-700/70 mt-1">{summary.overdueCount} overdue fees</p>
            </div>
            <TrendingUp className="text-red-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-600 font-medium">This Month Due</p>
              <h3 className="text-2xl font-bold text-amber-700">{currency(summary.monthDue)}</h3>
              <p className="text-xs text-amber-700/70 mt-1">{summary.monthDueCount} fees due</p>
            </div>
            <TrendingUp className="text-amber-600" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-slate-900">Collection Trend (Last 6 Months)</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={collectionTrend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(v)=>"Rs " + Math.round(v/1000) + "k"} />
                <Tooltip formatter={(value)=>currency(value)} />
                <Area type="monotone" dataKey="collected" stroke="#22c55e" fillOpacity={1} fill="url(#colorCollected)" />
                <Area type="monotone" dataKey="due" stroke="#f59e0b" fillOpacity={1} fill="url(#colorDue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-slate-900">Payment Status Distribution</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Paid vs Remaining */}
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-slate-900">Paid vs Remaining</h3>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={paidRemaining} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} label>
                {paidRemaining.map((entry, index) => (
                  <Cell key={`cell-pr-${index}`} fill={index === 0 ? "#22c55e" : "#ef4444"} />
                ))}
              </Pie>
              <Legend />
              <Tooltip formatter={(value)=>currency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Payments */}
      <ReminderModal />
      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <TableIcon size={18} className="text-slate-500"/>
            <h3 className="font-semibold text-slate-900">Recent Payments (20)</h3>
          </div>
          <button className="text-sm px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50">Export</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-700">
                <th className="px-4 py-2 text-left">Student</th>
                <th className="px-4 py-2 text-left">Class</th>
                <th className="px-4 py-2 text-left">Fees Type</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Payment Mode</th>
                <th className="px-4 py-2 text-left">Reference</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((p, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="px-4 py-2 font-medium text-slate-900">{p.student}</td>
                  <td className="px-4 py-2 text-slate-700">{p.cls}</td>
                  <td className="px-4 py-2 text-slate-700">{p.type}</td>
                  <td className="px-4 py-2 font-semibold text-slate-900">{currency(p.amount)}</td>
                  <td className="px-4 py-2 text-slate-700">{p.mode}</td>
                  <td className="px-4 py-2 text-slate-700">{p.ref}</td>
                  <td className="px-4 py-2">
                    <span className={`text-xs px-2 py-1 rounded-full border ${p.status === "Approved" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : p.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-red-50 text-red-700 border-red-200"}`}>{p.status}</span>
                  </td>
                  <td className="px-4 py-2 text-slate-700">{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Overdue & Top Defaulters */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Overdue Fees Table */}
        <div className="bg-white border border-slate-200 rounded-lg">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <TableIcon size={18} className="text-slate-500"/>
              <h3 className="font-semibold text-slate-900">Overdue Fees (50)</h3>
            </div>
          </div>
          <div className="overflow-x-auto max-h-80 overflow-y-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-700">
                  <th className="px-4 py-2 text-left">Student</th>
                  <th className="px-4 py-2 text-left">Class</th>
                  <th className="px-4 py-2 text-left">Fees Type</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Due Date</th>
                  <th className="px-4 py-2 text-left">Days Overdue</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {overdueFees.map((o, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <td className="px-4 py-2 font-medium text-slate-900">{o.student}</td>
                    <td className="px-4 py-2 text-slate-700">{o.cls}</td>
                    <td className="px-4 py-2 text-slate-700">{o.type}</td>
                    <td className="px-4 py-2 font-semibold text-slate-900">{currency(o.amount)}</td>
                    <td className="px-4 py-2 text-slate-700">{o.dueDate}</td>
                    <td className="px-4 py-2 text-slate-700">{o.days}</td>
                    <td className="px-4 py-2">
                      <button onClick={() => { setSelectedRow(o); setShowReminderModal(true); }} className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-xs">
                        <Send size={14} />
                        Send Reminder
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Defaulters Ranking Table */}
        <div className="bg-white border border-slate-200 rounded-lg">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <TableIcon size={18} className="text-slate-500"/>
              <h3 className="font-semibold text-slate-900">Top Defaulters (10)</h3>
            </div>
          </div>
          <div className="overflow-x-auto max-h-80 overflow-y-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-700">
                  <th className="px-4 py-2 text-left">Rank</th>
                  <th className="px-4 py-2 text-left">Student</th>
                  <th className="px-4 py-2 text-left">Class</th>
                  <th className="px-4 py-2 text-left">Overdue Count</th>
                  <th className="px-4 py-2 text-left">Total Overdue Amount</th>
                  <th className="px-4 py-2 text-left">Oldest Due Date</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {topDefaulters.map((d, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <td className="px-4 py-2 font-semibold text-slate-900">#{d.rank}</td>
                    <td className="px-4 py-2">
                      <p className="font-medium text-slate-900">{d.student}</p>
                      <p className="text-xs text-slate-600">{d.username}</p>
                    </td>
                    <td className="px-4 py-2 text-slate-700">{d.cls}</td>
                    <td className="px-4 py-2 text-slate-700">{d.count}</td>
                    <td className="px-4 py-2 font-semibold text-slate-900">{currency(d.amount)}</td>
                    <td className="px-4 py-2 text-slate-700">{d.oldest}</td>
                    <td className="px-4 py-2">
                      <button onClick={() => { setSelectedRow({ student: d.student, username: d.username, cls: d.cls, amount: d.amount, dueDate: d.oldest }); setShowReminderModal(true); }} className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-xs">
                        <Send size={14} />
                        Send Reminder
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
