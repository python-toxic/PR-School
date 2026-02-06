import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import { withFormerEmployeeCheck } from "../../components/common/withFormerEmployeeCheck";

const employeeDirectory = [
  { id: "fa", name: "Farhana", username: "greenField_farhana", role: "Vice Principal" },
  { id: "sd", name: "Sukhdev Driver", username: "greenField_sukhdev", role: "Driver" },
  { id: "am", name: "Atul Manager", username: "greenField_atul", role: "Finance Manager" },
  { id: "kd", name: "Kanchan Das", username: "greenField_kanchan", role: "Teacher" },
  { id: "fl", name: "Flintoff", username: "greenField_flintoff", role: "Teacher" },
  { id: "vk", name: "Vinod Kumar", username: "greenField_vinod", role: "Teacher" },
  { id: "kp", name: "Kamlesh Pawar", username: "greenField_kamlesh", role: "Teacher" }
];

function EmployeeChangePermissions() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const employeeId = searchParams.get("employeeId");

  const employee = employeeDirectory.find((e) => e.id === employeeId);

  const [permissions, setPermissions] = useState({
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
    isExpenseManager: false
  });

  const togglePermission = (key) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    const enabledPerms = Object.entries(permissions)
      .filter(([_, value]) => value)
      .map(([key]) => key);
    alert(`Permissions updated for ${employee.username}:\n${enabledPerms.join("\n")}`);
    navigate(`/employees/edit?employeeId=${employeeId}`);
  };

  if (!employee) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <p className="text-red-600">Employee not found</p>
          <button
            onClick={() => navigate("/employees")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Employees
          </button>
        </div>
      </div>
    );
  }

  const permissionGroups = [
    {
      title: "General Permissions",
      permissions: [
        { key: "canNotify", label: "Can Send Notifications" },
        { key: "canExam", label: "Can Manage Exam & Result" },
        { key: "canStudentAttendance", label: "Can Manage Student Attendance" },
        { key: "canEmployeeAttendance", label: "Can Manage Employee Attendance" },
        { key: "canStudents", label: "Can Manage Students" },
        { key: "canParents", label: "Can Manage Parent/Guardian" },
        { key: "canGallery", label: "Can Manage Gallery" },
        { key: "canCalendar", label: "Can Manage Calendar" },
        { key: "canTimeTable", label: "Can Manage Time Table" },
        { key: "canHomework", label: "Can Manage Homework" },
        { key: "canNotice", label: "Can Manage Notice Board" },
        { key: "canFees", label: "Can Manage Fees" },
        { key: "canOnlineClass", label: "Can Create & Manage Online Classes" }
      ]
    },
    {
      title: "Transport Permissions",
      permissions: [
        { key: "canTransport", label: "Can Manage Transport" },
        { key: "isTransportStaff", label: "Is Transport Staff", description: "Only driver should have this permissions" }
      ]
    },
    {
      title: "Expense Permissions",
      permissions: [
        { key: "canExpenses", label: "Can Create & Manage Expenses" },
        { key: "canApproveExpenses", label: "Can Approve/Reject Expenses" },
        { key: "isExpenseManager", label: "Is Expense Manager", description: "Full expense management role" }
      ]
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(`/employees/edit?employeeId=${employeeId}`)}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-4 transition"
        >
          <ArrowLeft size={20} />
          Back to Edit Options
        </button>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Change Permissions for {employee.username}
          </h1>
          <p className="text-sm text-gray-600">
            Manage access rights for {employee.name} ({employee.role})
          </p>
        </div>
      </div>

      {/* Permission Groups */}
      <div className="space-y-6">
        {permissionGroups.map((group) => (
          <div key={group.title} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">{group.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {group.permissions.map((perm) => (
                <label
                  key={perm.key}
                  className="flex items-start justify-between gap-3 px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 cursor-pointer hover:border-blue-300 transition"
                >
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-800 block">{perm.label}</span>
                    {perm.description && (
                      <span className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {perm.description}
                      </span>
                    )}
                  </div>
                  <input
                    type="checkbox"
                    checked={permissions[perm.key]}
                    onChange={() => togglePermission(perm.key)}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 mt-0.5"
                  />
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={() => navigate(`/employees/edit?employeeId=${employeeId}`)}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition inline-flex items-center gap-2"
        >
          <Save size={18} />
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default withFormerEmployeeCheck(EmployeeChangePermissions);
