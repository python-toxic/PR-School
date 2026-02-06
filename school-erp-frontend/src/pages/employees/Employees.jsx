import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  MessageSquare,
  Eye,
  Pencil,
  CalendarCheck,
  Users,
  Info,
  ShieldCheck,
  Phone,
  Mail,
  UserCircle,
  BarChart3,
  CheckCircle2,
  XCircle,
  Clock3,
  AlertCircle,
  Filter,
  X
} from "lucide-react";
import { useUser } from "../../context/UserContext.jsx";
import { ROLES } from "../../constants/roles.js";

const employeeDirectory = [
  {
    id: "fa",
    name: "Farhana",
    username: "greenField_farhana",
    role: "Vice Principal",
    joined: "2025-10-04",
    accessType: "Employee",
    phone: "+91 98765 43210",
    email: "farhana@greenfield.edu",
    status: "active",
    profileImage: null // Will be populated when user uploads image
  },
  { id: "sd", name: "Sukhdev Driver", username: "greenField_sukhdev", role: "Driver", joined: "2025-11-18", accessType: "Transport", phone: "+91 90000 00001", email: "sukhdev@greenfield.edu", status: "active", profileImage: null },
  { id: "am", name: "Atul Manager", username: "greenField_atul", role: "Finance Manager", joined: "2025-08-12", accessType: "Employee", phone: "+91 90000 00002", email: "atul@greenfield.edu", status: "active", profileImage: null },
  { id: "kd", name: "Kanchan Das", username: "greenField_kanchan", role: "Teacher", joined: "2025-06-02", accessType: "Academic", phone: "+91 90000 00003", email: "kanchan@greenfield.edu", status: "active", profileImage: null },
  { id: "fl", name: "Flintoff", username: "greenField_flintoff", role: "Teacher", joined: "2025-06-02", accessType: "Academic", phone: "+91 90000 00004", email: "flintoff@greenfield.edu", status: "active", profileImage: null },
  { id: "vk", name: "Vinod Kumar", username: "greenField_vinod", role: "Teacher", joined: "2025-06-02", accessType: "Academic", phone: "+91 90000 00005", email: "vinod@greenfield.edu", status: "active", profileImage: null },
  { id: "kp", name: "Kamlesh Pawar", username: "greenField_kamlesh", role: "Teacher", joined: "2025-06-02", accessType: "Academic", phone: "+91 90000 00006", email: "kamlesh@greenfield.edu", status: "active", profileImage: null }
];

const attendanceSnapshot = {
  fa: {
    present: 15,
    absent: 1,
    halfDay: 0,
    medical: 0,
    total: 16,
    recent: [
      { day: "Sun", date: "18", status: "Weekend" },
      { day: "Mon", date: "19", status: "Present" },
      { day: "Tue", date: "20", status: "Present" },
      { day: "Wed", date: "21", status: "Present" },
      { day: "Thu", date: "22", status: "Present" },
      { day: "Fri", date: "23", status: "Not Marked" },
      { day: "Sat", date: "24", status: "Not Marked" }
    ],
    classes: ["Class 11 - Arts", "Class 12 - Arts"],
    attendanceRate: 93.75
  }
};

const classCatalog = [
  "PlayGroup A",
  "Pre Nursery - A",
  "Nursery - A",
  "LKG - A",
  "UKG - A",
  "Class 1 - A",
  "Class 2 - A",
  "Class 3 - A",
  "Class 4 - A",
  "Class 5 - A",
  "Class 6 - A",
  "Class 7 - A",
  "Class 8 - A",
  "Class 9 - A",
  "Class 10 - A",
  "Class 11 - PCM - A",
  "Class 11 - PCB - A",
  "Class 11 - Commerce - A",
  "Class 11 - Arts - A",
  "Class 12 - PCM - A",
  "Class 12 - PCB - A",
  "Class 12 - Commerce - A",
  "Class 12 - Arts - A"
];

function Avatar({ name, image }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold flex items-center justify-center shadow-sm overflow-hidden">
      {image ? (
        <img src={image} alt={name} className="h-full w-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
}

export default function Employees() {
  const { user } = useUser();
  const navigate = useNavigate();
  const normalizedRole = String(user?.role ?? "").toLowerCase();
  const isAllowed = [ROLES.ADMIN, ROLES.SUPER_ADMIN]
    .map((r) => String(r).toLowerCase())
    .includes(normalizedRole);

  const [nameSearch, setNameSearch] = useState("");
  const [usernameSearch, setUsernameSearch] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageRecipient, setMessageRecipient] = useState(null);
  const [classFilter, setClassFilter] = useState("");
  const [activeTab, setActiveTab] = useState("current"); // current or former
  const [employees, setEmployees] = useState(employeeDirectory);

  // Load removed employees from localStorage and update status
  useEffect(() => {
    const removedEmployees = JSON.parse(localStorage.getItem('removedEmployees') || '[]');
    if (removedEmployees.length > 0) {
      setEmployees(prevEmployees => 
        prevEmployees.map(emp => {
          const removed = removedEmployees.find(r => r.id === emp.id);
          if (removed) {
            return { 
              ...emp, 
              status: 'former',
              leavingDate: removed.leavingDate,
              leavingReason: removed.reason,
              leavingRemarks: removed.remarks
            };
          }
          return emp;
        })
      );
    }
  }, []);

  const [messageForm, setMessageForm] = useState({
    title: "",
    message: "",
    inAppMessage: true
  });

  const [formState, setFormState] = useState({
    fullName: "",
    username: "",
    phone: "",
    email: "",
    designation: "Teacher",
    dlNumber: "",
    password: "",
    passwordRepeat: "",
    canNotify: true,
    canExam: false,
    canStudentAttendance: false,
    canEmployeeAttendance: false,
    canStudents: false,
    canParents: false,
    canGallery: false,
    canCalendar: false,
    canTimeTable: false,
    canHomework: false,
    canNotice: false,
    canFees: false,
    canOnlineClass: false,
    canTransport: false,
    isTransportStaff: false,
    canExpenses: false,
    canApproveExpenses: false,
    isExpenseManager: false,
    classes: []
  });

  const filteredEmployees = useMemo(() => {
    const statusFilter = activeTab === "current" ? "active" : "former";
    return employees.filter((emp) => {
      const matchesName = emp.name.toLowerCase().includes(nameSearch.toLowerCase());
      const matchesUsername = emp.username.toLowerCase().includes(usernameSearch.toLowerCase());
      const matchesStatus = emp.status === statusFilter;
      return matchesName && matchesUsername && matchesStatus;
    });
  }, [nameSearch, usernameSearch, activeTab, employees]);

  const selectedEmployee = selectedEmployeeId 
    ? filteredEmployees.find((e) => e.id === selectedEmployeeId) 
    : null;

  const visibleClasses = useMemo(() => {
    if (formState.isTransportStaff) return [];
    return classCatalog.filter((c) => c.toLowerCase().includes(classFilter.toLowerCase()));
  }, [classFilter, formState.isTransportStaff]);

  const togglePermission = (key) => {
    setFormState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleClass = (cls) => {
    setFormState((prev) => {
      const exists = prev.classes.includes(cls);
      const classes = exists ? prev.classes.filter((c) => c !== cls) : [...prev.classes, cls];
      return { ...prev, classes };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Employee created (demo only)");
    setShowAddEmployeeModal(false);
  };

  const openEmployeeDetails = (empId) => {
    setSelectedEmployeeId(empId);
    setShowEmployeeModal(true);
  };

  const openMessageModal = (emp) => {
    setMessageRecipient(emp);
    setMessageForm({ title: "", message: "", inAppMessage: true });
    setShowMessageModal(true);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    alert(`Message sent to ${messageRecipient.name}\nTitle: ${messageForm.title}\nMessage: ${messageForm.message}\nIn-App: ${messageForm.inAppMessage}`);
    setShowMessageModal(false);
  };

  if (!user) {
    return <div className="p-4 text-sm text-gray-600">Loading user…</div>;
  }

  if (!isAllowed) {
    return (
      <div className="p-6 bg-white border rounded-xl text-sm text-red-600">
        You do not have access to the Employees section.
      </div>
    );
  }

  const attendance = selectedEmployee 
    ? (attendanceSnapshot[selectedEmployee.id] || {
        present: 0,
        absent: 0,
        halfDay: 0,
        medical: 0,
        total: 0,
        recent: [],
        classes: [],
        attendanceRate: 0
      })
    : {
        present: 0,
        absent: 0,
        halfDay: 0,
        medical: 0,
        total: 0,
        recent: [],
        classes: [],
        attendanceRate: 0
      };

  const summaryTiles = [
    { label: "Present", value: attendance.present, color: "text-emerald-600", icon: CheckCircle2 },
    { label: "Absent", value: attendance.absent, color: "text-red-600", icon: XCircle },
    { label: "Half Day", value: attendance.halfDay, color: "text-amber-600", icon: Clock3 },
    { label: "Medical", value: attendance.medical, color: "text-blue-600", icon: AlertCircle }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Users className="text-blue-600" size={28} />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
            <p className="text-sm text-gray-600">Manage current and former employees</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("current")}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === "current"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Current Employees ({employees.filter(e => e.status === "active").length})
          </button>
          <button
            onClick={() => setActiveTab("former")}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === "former"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Former Employees ({employees.filter(e => e.status === "former").length})
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[220px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              placeholder="Search by full name"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1 min-w-[220px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={usernameSearch}
              onChange={(e) => setUsernameSearch(e.target.value)}
              placeholder="Search by username"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {activeTab === "current" && (
            <button 
              onClick={() => setShowAddEmployeeModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
            >
              <Plus size={16} />
              Add New User
            </button>
          )}
        </div>
        <p className="text-sm text-gray-600">Showing 1 - {filteredEmployees.length} of {employees.filter(e => e.status === (activeTab === "current" ? "active" : "former")).length}</p>
      </header>

      {/* Directory cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {filteredEmployees.map((emp) => (
          <div
            key={emp.id}
            onClick={() => openEmployeeDetails(emp.id)}
            className={`bg-white border rounded-xl p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer ${
              emp.status === 'former' ? 'border-red-200 bg-red-50' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <Avatar name={emp.name} image={emp.profileImage} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-900 truncate">{emp.name}</div>
                <div className="text-xs text-gray-500 truncate">{emp.username}</div>
                <div className="text-xs text-blue-600 mt-1 font-medium">{emp.role}</div>
                {emp.status === 'former' && emp.leavingDate && (
                  <div className="text-xs text-red-600 mt-1 font-medium">
                    Left: {new Date(emp.leavingDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-sm font-medium">
              <button 
                className="px-2 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center gap-1 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  openEmployeeDetails(emp.id);
                }}
              >
                <Eye size={14} />
                View
              </button>
              {emp.status !== 'former' && (
                <>
                  <button 
                    className="px-2 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center gap-1 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      openMessageModal(emp);
                    }}
                  >
                    <MessageSquare size={14} />
                  </button>
                  <button 
                    className="px-2 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center gap-1 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/employees/edit?employeeId=${emp.id}`);
                    }}
                  >
                    <Pencil size={14} />
                  </button>
                </>
              )}
              {emp.status === 'former' && (
                <div className="col-span-2 text-center py-2 text-xs text-red-600 font-medium bg-red-100 rounded-lg">
                  🔒 Former Employee - View Only
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Employee Details Modal */}
      {showEmployeeModal && selectedEmployee && (
        <Modal onClose={() => setShowEmployeeModal(false)} title="Employee Details">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Avatar name={selectedEmployee.name} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-gray-900">{selectedEmployee.name}</h2>
                  <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">{selectedEmployee.role}</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">Joined {selectedEmployee.joined}</div>
                <div className="flex flex-wrap gap-3 text-xs text-gray-600 mt-2">
                  <span className="inline-flex items-center gap-1"><UserCircle size={14} /> {selectedEmployee.username}</span>
                  <span className="inline-flex items-center gap-1"><Phone size={14} /> {selectedEmployee.phone}</span>
                  <span className="inline-flex items-center gap-1"><Mail size={14} /> {selectedEmployee.email}</span>
                  <span className="inline-flex items-center gap-1"><ShieldCheck size={14} /> Access: {selectedEmployee.accessType}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-600">{attendance.attendanceRate}%</div>
                <div className="text-xs text-gray-500">Attendance Rate</div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {summaryTiles.map((tile) => {
                const Icon = tile.icon;
                return (
                  <div key={tile.label} className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-3 flex items-center gap-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                    <div className={`${tile.color} bg-white border border-gray-200 rounded-md p-2 shadow-sm`}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-gray-900">{tile.value}</div>
                      <div className="text-xs text-gray-500">{tile.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                  <BarChart3 size={16} />
                  Attendance Summary
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-gray-700">
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">Present: {attendance.present}</span>
                  <span className="px-3 py-1 rounded-full bg-red-50 text-red-700">Absent: {attendance.absent}</span>
                  <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700">Half Day: {attendance.halfDay}</span>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700">Medical: {attendance.medical}</span>
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700">Total Days: {attendance.total}</span>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                  <Info size={16} />
                  Recent Attendance
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  {attendance.recent.map((item, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-white border border-gray-200 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                      <div className="text-gray-900 font-semibold">{item.date}</div>
                      <div className="text-gray-500">{item.day}</div>
                      <div className="text-[11px] mt-1 text-blue-600">{item.status}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                <Filter size={16} />
                Classes Accessed
              </div>
              <div className="flex flex-wrap gap-2">
                {attendance.classes.length === 0 ? (
                  <span className="text-xs text-gray-500">No classes assigned</span>
                ) : (
                  attendance.classes.map((c) => (
                    <span key={c} className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs border border-blue-100">
                      {c}
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Link
                to={`/calendar-attendance/employee-attendance?employeeId=${selectedEmployee.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow-sm"
              >
                <CalendarCheck size={16} />
                View & Mark Attendance
              </Link>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Employee Modal */}
      {showAddEmployeeModal && (
        <Modal onClose={() => setShowAddEmployeeModal(false)} title="Add New Employee" wide>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Full Name" value={formState.fullName} onChange={(v) => setFormState((p) => ({ ...p, fullName: v }))} required />
              <Input label="Username (is used to login)" value={formState.username} onChange={(v) => setFormState((p) => ({ ...p, username: v }))} required />
              <Input label="Phone" value={formState.phone} onChange={(v) => setFormState((p) => ({ ...p, phone: v }))} />
              <Input label="Email" value={formState.email} onChange={(v) => setFormState((p) => ({ ...p, email: v }))} />
              <Input label="Designation" value={formState.designation} onChange={(v) => setFormState((p) => ({ ...p, designation: v }))} />
              <Input label="DL Number" value={formState.dlNumber} onChange={(v) => setFormState((p) => ({ ...p, dlNumber: v }))} placeholder="Required for drivers" />
              <Input type="password" label="Password" value={formState.password} onChange={(v) => setFormState((p) => ({ ...p, password: v }))} required />
              <Input type="password" label="Password Repeat" value={formState.passwordRepeat} onChange={(v) => setFormState((p) => ({ ...p, passwordRepeat: v }))} required />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <Toggle label="Can Send Notifications" value={formState.canNotify} onChange={() => togglePermission("canNotify")} />
              <Toggle label="Can Manage Exam & Result" value={formState.canExam} onChange={() => togglePermission("canExam")} />
              <Toggle label="Can Manage Student Attendance" value={formState.canStudentAttendance} onChange={() => togglePermission("canStudentAttendance")} />
              <Toggle label="Can Manage Employee Attendance" value={formState.canEmployeeAttendance} onChange={() => togglePermission("canEmployeeAttendance")} />
              <Toggle label="Can Manage Students" value={formState.canStudents} onChange={() => togglePermission("canStudents")} />
              <Toggle label="Can Manage Parent/Guardian" value={formState.canParents} onChange={() => togglePermission("canParents")} />
              <Toggle label="Can Manage Gallery" value={formState.canGallery} onChange={() => togglePermission("canGallery")} />
              <Toggle label="Can Manage Calendar" value={formState.canCalendar} onChange={() => togglePermission("canCalendar")} />
              <Toggle label="Can Manage Time Table" value={formState.canTimeTable} onChange={() => togglePermission("canTimeTable")} />
              <Toggle label="Can Manage Homework" value={formState.canHomework} onChange={() => togglePermission("canHomework")} />
              <Toggle label="Can Manage Notice Board" value={formState.canNotice} onChange={() => togglePermission("canNotice")} />
              <Toggle label="Can Manage Fees" value={formState.canFees} onChange={() => togglePermission("canFees")} />
              <Toggle label="Can Create & Manage Online Classes" value={formState.canOnlineClass} onChange={() => togglePermission("canOnlineClass")} />
              <Toggle label="Can Manage Transport" value={formState.canTransport} onChange={() => togglePermission("canTransport")} />
              <Toggle label="Is Transport Staff (only driver should have this)" value={formState.isTransportStaff} onChange={() => togglePermission("isTransportStaff")} />
              <Toggle label="Can Create & Manage Expenses" value={formState.canExpenses} onChange={() => togglePermission("canExpenses")} />
              <Toggle label="Can Approve/Reject Expenses" value={formState.canApproveExpenses} onChange={() => togglePermission("canApproveExpenses")} />
              <Toggle label="Is Expense Manager" value={formState.isExpenseManager} onChange={() => togglePermission("isExpenseManager")} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-800">Select Classes</label>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Filter size={14} />
                  Showing all {classCatalog.length}
                </div>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  placeholder="Filter classes"
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={formState.isTransportStaff}
                />
              </div>
              {formState.isTransportStaff ? (
                <div className="text-xs text-amber-600">Class assignment disabled for transport staff.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2 bg-gray-50">
                  {visibleClasses.map((cls) => (
                    <label key={cls} className="flex items-center gap-2 text-sm bg-white border border-gray-200 rounded-md px-2 py-1 hover:border-blue-400 transition">
                      <input
                        type="checkbox"
                        checked={formState.classes.includes(cls)}
                        onChange={() => toggleClass(cls)}
                      />
                      <span className="truncate">{cls}</span>
                    </label>
                  ))}
                  {visibleClasses.length === 0 && (
                    <div className="text-xs text-gray-500">Empty list</div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddEmployeeModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition shadow-sm"
              >
                Create Account
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Message Modal */}
      {showMessageModal && messageRecipient && (
        <Modal onClose={() => setShowMessageModal(false)} title="Send Message">
          <form className="space-y-4" onSubmit={handleSendMessage}>
            <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Avatar name={messageRecipient.name} />
              <div>
                <div className="font-semibold text-gray-900">{messageRecipient.name}</div>
                <div className="text-sm text-gray-600">{messageRecipient.role}</div>
                <div className="text-xs text-gray-500 mt-1">
                  <span className="inline-flex items-center gap-1"><Phone size={12} /> {messageRecipient.phone}</span>
                  <span className="inline-flex items-center gap-1 ml-3"><Mail size={12} /> {messageRecipient.email}</span>
                </div>
              </div>
            </div>

            <Input 
              label="Enter a title or subject" 
              value={messageForm.title} 
              onChange={(v) => setMessageForm((p) => ({ ...p, title: v }))} 
              required 
            />

            <div>
              <label className="text-sm text-gray-700 flex flex-col gap-1">
                Enter your message
                <textarea
                  value={messageForm.message}
                  onChange={(e) => setMessageForm((p) => ({ ...p, message: e.target.value }))}
                  required
                  rows={5}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Type your message here..."
                />
              </label>
            </div>

            <div className="flex items-center justify-between gap-3 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50">
              <span className="text-sm font-medium text-gray-800">IN APP MESSAGE</span>
              <input 
                type="checkbox" 
                checked={messageForm.inAppMessage} 
                onChange={(e) => setMessageForm((p) => ({ ...p, inAppMessage: e.target.checked }))} 
                className="h-4 w-4"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowMessageModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition shadow-sm inline-flex items-center gap-2"
              >
                <MessageSquare size={16} />
                Send Message
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function Input({ label, value, onChange, type = "text", required = false, placeholder }) {
  return (
    <label className="text-sm text-gray-700 flex flex-col gap-1">
      {label}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </label>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <label className="flex items-center justify-between gap-3 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 cursor-pointer hover:border-blue-300 transition">
      <span className="text-gray-800">{label}</span>
      <input type="checkbox" checked={value} onChange={onChange} />
    </label>
  );
}

function Modal({ title, children, onClose, wide = false }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className={`bg-white rounded-xl shadow-2xl ${wide ? "max-w-4xl" : "max-w-2xl"} w-full max-h-[90vh] overflow-hidden flex flex-col`}>
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
