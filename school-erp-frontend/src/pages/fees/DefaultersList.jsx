import { useState, useMemo, useEffect } from "react";
import { Search, Filter, Download, AlertCircle, ChevronLeft, ChevronRight, Eye, Send, DollarSign, Calendar, Users, X, Mail, MessageCircle, Bell, Check } from "lucide-react";
import { useNotifications } from "../../context/NotificationContext.jsx";

const mockDefaulters = [
  {
    id: 1,
    name: "Harper Patel",
    username: "greenField_L015",
    class: "UKG - A",
    pendingFees: [
      { type: "Transportation", amount: 20000, months: ["Apr 2025", "May 2025", "Jun 2025", "Jul 2025", "Aug 2025", "Sep 2025", "Oct 2025", "Nov 2025", "Dec 2025", "Jan 2026"] },
      { type: "Tuition", amount: 50000, months: ["Apr 2025", "May 2025", "Jun 2025", "Jul 2025", "Aug 2025", "Sep 2025", "Oct 2025", "Nov 2025", "Dec 2025", "Jan 2026"] }
    ],
    totalOverdue: 70000,
    oldestDue: "Jan 7, 2026",
    daysOverdue: 17
  },
  {
    id: 2,
    name: "Olivia Martinez",
    username: "greenField_L001",
    class: "UKG - A",
    pendingFees: [
      { type: "Transportation", amount: 20000, months: ["Apr 2025", "May 2025", "Jun 2025", "Jul 2025", "Aug 2025", "Sep 2025", "Oct 2025", "Nov 2025", "Dec 2025", "Jan 2026"] },
      { type: "Tuition", amount: 50000, months: ["Apr 2025", "May 2025", "Jun 2025", "Jul 2025", "Aug 2025", "Sep 2025", "Oct 2025", "Nov 2025", "Dec 2025", "Jan 2026"] }
    ],
    totalOverdue: 70000,
    oldestDue: "Jan 7, 2026",
    daysOverdue: 17
  },
  {
    id: 3,
    name: "Liam Anderson",
    username: "greenField_L002",
    class: "UKG - A",
    pendingFees: [
      { type: "Transportation", amount: 20000, months: ["Apr 2025", "May 2025", "Jun 2025", "Jul 2025", "Aug 2025", "Sep 2025", "Oct 2025", "Nov 2025", "Dec 2025", "Jan 2026"] },
      { type: "Tuition", amount: 50000, months: ["Apr 2025", "May 2025", "Jun 2025", "Jul 2025", "Aug 2025", "Sep 2025", "Oct 2025", "Nov 2025", "Dec 2025", "Jan 2026"] }
    ],
    totalOverdue: 70000,
    oldestDue: "Jan 7, 2026",
    daysOverdue: 17
  },
  {
    id: 16,
    name: "Darsh Agarwal",
    username: "greenField_N053",
    class: "Nursery - A",
    pendingFees: [
      { type: "Activity", amount: 5000, months: ["Apr 2025", "May 2025", "Jun 2025", "Jul 2025", "Aug 2025", "Sep 2025", "Oct 2025", "Nov 2025", "Dec 2025", "Jan 2026"] },
      { type: "Admission", amount: 10, months: ["Apr 2025", "May 2025", "Jun 2025", "Jul 2025", "Aug 2025", "Sep 2025", "Oct 2025", "Nov 2025", "Dec 2025", "Jan 2026"] },
      { type: "Exam", amount: 8000, months: ["Apr 2025", "May 2025", "Jun 2025", "Jul 2025", "Aug 2025", "Sep 2025", "Oct 2025", "Nov 2025", "Dec 2025", "Jan 2026"] },
      { type: "Transportation", amount: 18000, months: ["Apr 2025", "May 2025", "Jun 2025"] },
      { type: "Tuition", amount: 21000, months: ["Apr 2025", "May 2025", "Jun 2025"] }
    ],
    totalOverdue: 52010,
    oldestDue: "Oct 4, 2025",
    daysOverdue: 113
  }
];

export default function DefaultersList() {
  const { addNotification } = useNotifications();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [minAmount, setMinAmount] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState({});
  const [viewingStudent, setViewingStudent] = useState(null);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [reminderChannels, setReminderChannels] = useState({
    inApp: true,
    email: true,
    whatsapp: true
  });
  const [studentFeesData, setStudentFeesData] = useState([]);
  const [defaultersList, setDefaultersList] = useState([]);
  const itemsPerPage = 20;

  // Load student fees data from localStorage
  useEffect(() => {
    const savedFees = localStorage.getItem("student-fees-data");
    if (savedFees) {
      try {
        const feesData = JSON.parse(savedFees);
        setStudentFeesData(feesData);
        
        // Calculate defaulters from fees data
        const defaulters = feesData
          .filter(student => {
            // Check if student has any unpaid fees
            const hasUnpaid = student.fees.some(fee => fee.status === "Pending" || fee.paid < fee.total);
            return hasUnpaid;
          })
          .map(student => {
            // Calculate pending fees
            const pendingFees = student.fees
              .filter(fee => fee.status === "Pending" || fee.paid < fee.total)
              .map(fee => ({
                type: fee.type,
                amount: fee.total - fee.paid,
                months: ["Current"], // You can expand this based on your fee structure
                dueDate: fee.dueDate || new Date().toLocaleDateString('en-GB')
              }));

            const totalOverdue = pendingFees.reduce((sum, fee) => sum + fee.amount, 0);
            const oldestDue = pendingFees[0]?.dueDate || new Date().toLocaleDateString('en-GB');
            const daysOverdue = Math.floor((new Date() - new Date(oldestDue.split('/').reverse().join('-'))) / (1000 * 60 * 60 * 24));

            return {
              id: student.id,
              name: student.name,
              username: student.username,
              class: student.class,
              email: student.email || "",
              mobile: student.mobile || "",
              pendingFees,
              totalOverdue,
              oldestDue,
              daysOverdue: Math.max(0, daysOverdue)
            };
          });
        
        setDefaultersList(defaulters);
      } catch (error) {
        console.error("Error loading student fees:", error);
        // Use mock data as fallback
        setDefaultersList(mockDefaulters);
      }
    } else {
      // Use mock data if no saved data
      setDefaultersList(mockDefaulters);
    }
  }, []);

  // Handle sending reminders
  const handleSendReminder = async () => {
    if (!selectedStudent) return;

    const channels = [];
    if (reminderChannels.inApp) channels.push("in-app");
    if (reminderChannels.email) channels.push("email");
    if (reminderChannels.whatsapp) channels.push("WhatsApp");

    // Send in-app notification
    if (reminderChannels.inApp) {
      addNotification({
        id: Date.now(),
        type: "fee_reminder",
        priority: "high",
        title: "Fee Payment Reminder",
        message: `Dear ${selectedStudent.name}, you have pending fees of ₹${selectedStudent.totalOverdue.toLocaleString()}. Please clear your dues at the earliest.`,
        timestamp: new Date().toISOString(),
        read: false,
        userId: selectedStudent.username,
        actionUrl: "/fees/student-fees"
      });
    }

    // Send email (simulate - would connect to backend)
    if (reminderChannels.email && selectedStudent.email) {
      console.log(`Sending email to: ${selectedStudent.email}`);
      // TODO: Connect to backend email service
    }

    // Send WhatsApp (simulate - would connect to backend)
    if (reminderChannels.whatsapp && selectedStudent.mobile) {
      console.log(`Sending WhatsApp to: ${selectedStudent.mobile}`);
      // TODO: Connect to backend WhatsApp service
    }

    // Show success message
    alert(`Reminder sent successfully via ${channels.join(", ")}!\n\nStudent: ${selectedStudent.name}\nAmount Due: ₹${selectedStudent.totalOverdue.toLocaleString()}`);
    
    // Close modal and reset
    setShowReminderModal(false);
    setSelectedStudent(null);
    setReminderChannels({ inApp: true, email: true, whatsapp: true });
  };

  // Get unique classes
  const classes = useMemo(() => {
    const uniqueClasses = [...new Set(defaultersList.map(d => d.class))];
    return uniqueClasses.sort();
  }, [defaultersList]);

  // Filter students
  const filteredDefaulters = useMemo(() => {
    return defaultersList.filter(student => {
      const matchesSearch = 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.username.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesClass = selectedClass === "all" || student.class === selectedClass;
      const matchesAmount = !minAmount || student.totalOverdue >= parseFloat(minAmount);
      
      return matchesSearch && matchesClass && matchesAmount;
    });
  }, [searchQuery, selectedClass, minAmount, defaultersList]);

  // Pagination
  const totalPages = Math.ceil(filteredDefaulters.length / itemsPerPage);
  const paginatedDefaulters = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredDefaulters.slice(start, end);
  }, [filteredDefaulters, currentPage]);

  // Summary stats
  const stats = useMemo(() => {
    const totalDefaulters = filteredDefaulters.length;
    const totalPendingAmount = filteredDefaulters.reduce((sum, d) => sum + d.totalOverdue, 0);
    const totalInstallments = filteredDefaulters.reduce((sum, d) => 
      sum + d.pendingFees.reduce((feeSum, fee) => feeSum + fee.months.length, 0), 0
    );
    
    return { totalDefaulters, totalPendingAmount, totalInstallments };
  }, [filteredDefaulters]);

  const toggleRow = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getDaysOverdueColor = (days) => {
    if (days > 100) return "bg-red-100 text-red-800";
    if (days > 60) return "bg-orange-100 text-orange-800";
    if (days > 30) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  // Reminder Modal Component
  const ReminderModal = () => {
    if (!showReminderModal || !selectedStudent) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-xl max-w-md w-full shadow-2xl my-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-3 flex items-center justify-between rounded-t-xl">
            <div className="flex items-center gap-2">
              <Send className="text-white" size={20} />
              <h2 className="text-lg font-bold text-white">Send Reminder</h2>
            </div>
            <button
              onClick={() => {
                setShowReminderModal(false);
                setSelectedStudent(null);
              }}
              className="text-white hover:bg-green-600 p-1 rounded transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto">
            {/* Student Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">Student Details</h3>
              <div className="space-y-1 text-xs">
                <p><span className="text-gray-600">Name:</span> <span className="font-medium">{selectedStudent.name}</span></p>
                <p><span className="text-gray-600">Class:</span> <span className="font-medium">{selectedStudent.class}</span></p>
                <p><span className="text-gray-600">Username:</span> <span className="font-medium">{selectedStudent.username}</span></p>
                {selectedStudent.email && (
                  <p><span className="text-gray-600">Email:</span> <span className="font-medium">{selectedStudent.email}</span></p>
                )}
                {selectedStudent.mobile && (
                  <p><span className="text-gray-600">Mobile:</span> <span className="font-medium">{selectedStudent.mobile}</span></p>
                )}
              </div>
            </div>

            {/* Amount Due */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">Pending Amount</h3>
              <p className="text-2xl font-bold text-red-600">₹{selectedStudent.totalOverdue.toLocaleString()}</p>
              <p className="text-xs text-gray-600 mt-1">{selectedStudent.daysOverdue} days overdue</p>
            </div>

            {/* Reminder Channels */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">Select Channels</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={reminderChannels.inApp}
                    onChange={(e) => setReminderChannels({ ...reminderChannels, inApp: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <Bell className="text-blue-600" size={18} />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">In-App</p>
                    <p className="text-xs text-gray-500">Notify within app</p>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={reminderChannels.email}
                    onChange={(e) => setReminderChannels({ ...reminderChannels, email: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    disabled={!selectedStudent.email}
                  />
                  <Mail className={selectedStudent.email ? "text-purple-600" : "text-gray-400"} size={18} />
                  <div className="flex-1">
                    <p className={`font-medium text-sm ${selectedStudent.email ? "text-gray-900" : "text-gray-400"}`}>Email</p>
                    <p className="text-xs text-gray-500 truncate">
                      {selectedStudent.email ? selectedStudent.email : "Not available"}
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={reminderChannels.whatsapp}
                    onChange={(e) => setReminderChannels({ ...reminderChannels, whatsapp: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    disabled={!selectedStudent.mobile}
                  />
                  <MessageCircle className={selectedStudent.mobile ? "text-green-600" : "text-gray-400"} size={18} />
                  <div className="flex-1">
                    <p className={`font-medium text-sm ${selectedStudent.mobile ? "text-gray-900" : "text-gray-400"}`}>WhatsApp</p>
                    <p className="text-xs text-gray-500">
                      {selectedStudent.mobile ? selectedStudent.mobile : "Not available"}
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Message Preview */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">Message</h3>
              <p className="text-xs text-gray-700 leading-relaxed">
                Dear {selectedStudent.name}, you have pending fees of ₹{selectedStudent.totalOverdue.toLocaleString()}. 
                Please clear your dues at the earliest.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 flex gap-2 justify-end rounded-b-xl">
            <button
              onClick={() => {
                setShowReminderModal(false);
                setSelectedStudent(null);
              }}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSendReminder}
              disabled={!reminderChannels.inApp && !reminderChannels.email && !reminderChannels.whatsapp}
              className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
            >
              <Send size={14} />
              Send
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      {/* Reminder Modal */}
      <ReminderModal />

      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Defaulters List</h1>
            <p className="text-sm text-gray-600 mt-1">Students with pending fee payments</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium">
              <Download size={18} />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
              <Send size={18} />
              Send Reminders
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Total Defaulters</p>
              <p className="text-3xl font-bold text-red-900 mt-2">{stats.totalDefaulters}</p>
            </div>
            <Users className="text-red-400" size={32} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Total Pending Installments</p>
              <p className="text-3xl font-bold text-orange-900 mt-2">{stats.totalInstallments}</p>
            </div>
            <Calendar className="text-orange-400" size={32} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Total Overdue Amount</p>
              <p className="text-3xl font-bold text-purple-900 mt-2">₹{stats.totalPendingAmount.toLocaleString()}</p>
            </div>
            <DollarSign className="text-purple-400" size={32} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={18} className="text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search by Name or Username</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search student..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Classes</option>
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Min Amount (₹)</label>
            <input
              type="number"
              placeholder="Minimum overdue amount"
              value={minAmount}
              onChange={(e) => {
                setMinAmount(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Student Cards */}
      <div className="space-y-4">
        {paginatedDefaulters.length > 0 ? (
          <>
            <div className="text-sm text-gray-600 mb-4">
              Showing {filteredDefaulters.length} students with pending fees
            </div>
            
            <div className="grid gap-4">
              {paginatedDefaulters.map((student, idx) => (
                <div
                  key={student.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-red-500 to-rose-600 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-lg font-bold text-red-600">
                        #{(currentPage - 1) * itemsPerPage + idx + 1}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{student.name}</h3>
                        <p className="text-red-100 text-sm">{student.username}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-red-100 text-xs uppercase tracking-wider">Class</p>
                      <p className="text-white font-semibold text-lg">{student.class}</p>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4">
                    {/* Key Metrics */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-xs text-red-600 font-semibold uppercase mb-1">Total Overdue</p>
                        <p className="text-2xl font-bold text-red-900">₹{student.totalOverdue.toLocaleString()}</p>
                      </div>
                      
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <p className="text-xs text-orange-600 font-semibold uppercase mb-1">Oldest Due Date</p>
                        <p className="text-lg font-semibold text-orange-900">{student.oldestDue}</p>
                      </div>
                      
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-xs text-yellow-700 font-semibold uppercase mb-1">Days Overdue</p>
                        <span className={`inline-block px-4 py-2 rounded-full text-lg font-bold ${getDaysOverdueColor(student.daysOverdue)}`}>
                          {student.daysOverdue} days
                        </span>
                      </div>
                    </div>

                    {/* Pending Fees Breakdown */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900 text-base">Pending Fee Breakdown</h4>
                        <button
                          onClick={() => toggleRow(student.id)}
                          className="inline-flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition font-medium"
                        >
                          <Eye size={16} />
                          {expandedRows[student.id] ? "Hide Details" : "View Details"}
                        </button>
                      </div>

                      {/* Compact Fee List */}
                      {!expandedRows[student.id] && (
                        <div className="space-y-2">
                          {student.pendingFees.map((fee, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2 border border-gray-200">
                              <div className="flex items-center gap-3">
                                <DollarSign size={16} className="text-gray-400" />
                                <span className="font-medium text-gray-900">{fee.type} Fee</span>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-gray-900">₹{fee.amount.toLocaleString()}</p>
                                <p className="text-xs text-gray-600">{fee.months.length} months pending</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Expanded Fee Details */}
                      {expandedRows[student.id] && (
                        <div className="grid md:grid-cols-2 gap-4">
                          {student.pendingFees.map((fee, idx) => (
                            <div key={idx} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <DollarSign size={18} className="text-blue-600" />
                                  <span className="font-bold text-gray-900">{fee.type} Fee</span>
                                </div>
                                <span className="text-xl font-bold text-blue-600">₹{fee.amount.toLocaleString()}</span>
                              </div>
                              <div className="space-y-2">
                                <p className="text-xs text-gray-700 font-medium">
                                  {fee.months.length} pending months:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {fee.months.slice(0, 4).map((month, i) => (
                                    <span key={i} className="inline-block bg-white border border-blue-200 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                                      {month}
                                    </span>
                                  ))}
                                  {fee.months.length > 4 && (
                                    <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                                      +{fee.months.length - 4} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{student.pendingFees.length}</span> fee types pending
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setSelectedStudent(student);
                            setShowReminderModal(true);
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                        >
                          <Send size={16} />
                          Send Reminder
                        </button>
                        <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium">
                          <Eye size={16} />
                          View Full Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <AlertCircle className="mx-auto text-green-400 mb-4" size={64} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Defaulters Found!</h3>
            <p className="text-gray-600">All students have cleared their pending fees or no students match your filter criteria.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages} • Showing {paginatedDefaulters.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredDefaulters.length)} of {filteredDefaulters.length} students
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
              >
                <ChevronLeft size={18} />
                Previous
              </button>

              <div className="hidden md:flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-4 py-2 rounded-lg transition font-medium ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <span className="px-2 py-2 text-gray-600">...</span>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
              >
                Next
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Summary Footer */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600 font-medium">Total</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{filteredDefaulters.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Pending Installments</p>
            <p className="text-2xl font-bold text-orange-600 mt-1">{stats.totalInstallments}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Total Amount Due</p>
            <p className="text-2xl font-bold text-red-600 mt-1">₹{stats.totalPendingAmount.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
