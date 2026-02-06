import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, AlertTriangle } from "lucide-react";
import { withFormerEmployeeCheck } from "../../components/common/withFormerEmployeeCheck";

const employeeDirectory = [
  { id: "fa", name: "Farhana", username: "greenField_farhana", role: "Vice Principal", currentRole: "Employee" },
  { id: "sd", name: "Sukhdev Driver", username: "greenField_sukhdev", role: "Driver", currentRole: "Employee" },
  { id: "am", name: "Atul Manager", username: "greenField_atul", role: "Finance Manager", currentRole: "Employee" },
  { id: "kd", name: "Kanchan Das", username: "greenField_kanchan", role: "Teacher", currentRole: "Employee" },
  { id: "fl", name: "Flintoff", username: "greenField_flintoff", role: "Teacher", currentRole: "Employee" },
  { id: "vk", name: "Vinod Kumar", username: "greenField_vinod", role: "Teacher", currentRole: "Employee" },
  { id: "kp", name: "Kamlesh Pawar", username: "greenField_kamlesh", role: "Teacher", currentRole: "Employee" }
];

const departmentOptions = [
  { value: "Academic", label: "Academic Department" },
  { value: "Administration", label: "Administration" },
  { value: "Finance", label: "Finance Department" },
  { value: "Transport", label: "Transport Department" },
  { value: "Library", label: "Library" },
  { value: "Laboratory", label: "Laboratory" },
  { value: "Sports", label: "Sports Department" },
  { value: "Security", label: "Security" },
  { value: "Maintenance", label: "Maintenance" },
  { value: "Other", label: "Other" }
];

const designationOptions = [
  "Principal",
  "Vice Principal",
  "Head Teacher",
  "Senior Teacher",
  "Teacher",
  "Assistant Teacher",
  "PGT (Post Graduate Teacher)",
  "TGT (Trained Graduate Teacher)",
  "PRT (Primary Teacher)",
  "NTT (Nursery Teacher)",
  "Finance Manager",
  "Accountant",
  "Cashier",
  "Librarian",
  "Assistant Librarian",
  "Lab Assistant",
  "Lab Technician",
  "Sports Coordinator",
  "Sports Teacher",
  "Counselor",
  "Career Counselor",
  "Driver",
  "Bus Conductor",
  "Security Guard",
  "Receptionist",
  "Office Assistant",
  "Peon",
  "Cleaner",
  "Gardener",
  "Other"
];

function EmployeeChangeRole() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const employeeId = searchParams.get("employeeId");

  const employee = employeeDirectory.find((e) => e.id === employeeId);

  const [formData, setFormData] = useState({
    department: "Academic",
    designation: employee?.role || ""
  });

  const [showWarning, setShowWarning] = useState(false);

  const handleSave = () => {
    setShowWarning(true);
  };

  const confirmSave = () => {
    alert(`Department & Designation updated successfully for ${employee.username}\nNew Department: ${formData.department}\nDesignation: ${formData.designation}`);
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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
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
            Change Department & Designation for {employee.username}
          </h1>
          <p className="text-sm text-gray-600">
            Update department and job title for {employee.name}
          </p>
        </div>
      </div>

      {/* Warning Notice */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6 rounded-lg shadow-sm">
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-blue-600 flex-shrink-0 mt-0.5" size={24} />
          <div>
            <h3 className="text-lg font-bold text-blue-900 mb-2">Note</h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>• This will update the employee's department and job designation</li>
              <li>• Changes will reflect in all employee records and reports</li>
              <li>• Ensure the new department and designation are accurate</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm max-w-2xl">
        <div className="space-y-6">
          {/* Department Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {departmentOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">Select the department this employee belongs to</p>
          </div>

          {/* Designation Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Designation <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Designation</option>
              {designationOptions.map((designation) => (
                <option key={designation} value={designation}>
                  {designation}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">Job title or position in the organization</p>
          </div>

          {/* Current Details Display */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Current Details:</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Current Department:</span>
                <p className="font-medium text-gray-900">{employee.accessType || "Not Set"}</p>
              </div>
              <div>
                <span className="text-gray-600">Current Designation:</span>
                <p className="font-medium text-gray-900">{employee.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end gap-3">
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
            Update Department & Designation
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <AlertTriangle className="text-yellow-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Confirm Role Change</h3>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to change the department and designation for <strong>{employee.username}</strong>?
              This will update their employee profile and records.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowWarning(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default withFormerEmployeeCheck(EmployeeChangeRole);
