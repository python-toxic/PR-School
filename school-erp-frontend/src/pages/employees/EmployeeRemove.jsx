import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, UserX, AlertTriangle } from "lucide-react";

const employeeDirectory = [
  { id: "fa", name: "Farhana", username: "greenField_farhana", role: "Vice Principal" },
  { id: "sd", name: "Sukhdev Driver", username: "greenField_sukhdev", role: "Driver" },
  { id: "am", name: "Atul Manager", username: "greenField_atul", role: "Finance Manager" },
  { id: "kd", name: "Kanchan Das", username: "greenField_kanchan", role: "Teacher" },
  { id: "fl", name: "Flintoff", username: "greenField_flintoff", role: "Teacher" },
  { id: "vk", name: "Vinod Kumar", username: "greenField_vinod", role: "Teacher" },
  { id: "kp", name: "Kamlesh Pawar", username: "greenField_kamlesh", role: "Teacher" }
];

export default function EmployeeRemove() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const employeeId = searchParams.get("employeeId");

  const employee = employeeDirectory.find((e) => e.id === employeeId);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState({
    leavingDate: new Date().toISOString().split('T')[0],
    reason: "",
    remarks: ""
  });

  const handleRemove = () => {
    setShowConfirmModal(true);
  };

  const confirmRemoval = () => {
    // In a real application, this would make an API call to update the employee status
    // For now, we'll store the removal in localStorage to persist across navigation
    const removedEmployees = JSON.parse(localStorage.getItem('removedEmployees') || '[]');
    const removalRecord = {
      id: employee.id,
      username: employee.username,
      name: employee.name,
      role: employee.role,
      leavingDate: formData.leavingDate,
      reason: formData.reason,
      remarks: formData.remarks,
      removedAt: new Date().toISOString(),
      status: 'former'
    };
    
    removedEmployees.push(removalRecord);
    localStorage.setItem('removedEmployees', JSON.stringify(removedEmployees));
    
    // Show success message
    alert(`✅ ${employee.name} has been successfully removed from the school.\n\nDetails:\n• Leaving Date: ${formData.leavingDate}\n• Reason: ${formData.reason || 'Not specified'}\n• Status: Moved to Former Employees\n\nThis employee will no longer have access to the school system, but their data is preserved in the Former Employees section.`);
    
    // Navigate back to employees page
    navigate("/employees");
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
          <div className="flex items-center gap-3 mb-2">
            <UserX size={28} className="text-red-600" />
            <h1 className="text-2xl font-bold text-gray-900">Remove Employee from School</h1>
          </div>
          <p className="text-sm text-gray-600">
            Remove {employee.name} ({employee.username}) from active employees
          </p>
        </div>
      </div>

      {/* Warning Notice */}
      <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-6 rounded-lg shadow-sm">
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={24} />
          <div>
            <h3 className="text-lg font-bold text-red-900 mb-2">Warning</h3>
            <ul className="text-sm text-red-800 space-y-2">
              <li>• This user will lose access to your school immediately</li>
              <li>• The employee will be moved to "Former Employees" section</li>
              <li>• All employee data will be preserved in the database for records</li>
              <li>• You can restore access from the Former Employees section if needed</li>
              <li>• This action is reversible - the employee can be re-activated</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm max-w-2xl">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Removal Details</h2>

        <div className="space-y-6">
          {/* Employee Info Display */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Employee Information:</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Name:</span>
                <p className="font-medium text-gray-900">{employee.name}</p>
              </div>
              <div>
                <span className="text-gray-600">Username:</span>
                <p className="font-medium text-gray-900">{employee.username}</p>
              </div>
              <div>
                <span className="text-gray-600">Role:</span>
                <p className="font-medium text-gray-900">{employee.role}</p>
              </div>
            </div>
          </div>

          {/* Leaving Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Leaving Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.leavingDate}
              onChange={(e) => setFormData({ ...formData, leavingDate: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
            <p className="mt-1 text-xs text-gray-500">Official last day of employment</p>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Leaving
            </label>
            <select
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">Select Reason</option>
              <option value="Resignation">Resignation</option>
              <option value="Retirement">Retirement</option>
              <option value="Contract End">Contract End</option>
              <option value="Transfer">Transfer to Another School</option>
              <option value="Termination">Termination</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Remarks / Notes
            </label>
            <textarea
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Add any additional notes or comments..."
            />
            <p className="mt-1 text-xs text-gray-500">Optional notes for HR records</p>
          </div>

          {/* Copyright Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-xs text-blue-800">
            <p>© 2017 - 2026 Schoolites. All employee data is retained securely for compliance and records purposes.</p>
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
            onClick={handleRemove}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition inline-flex items-center gap-2"
          >
            <UserX size={18} />
            Remove from School
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Confirm Removal</h3>
            </div>
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to remove this user?
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-gray-900 mb-1">{employee.name}</p>
                <p className="text-xs text-gray-600">{employee.username}</p>
              </div>
              <p className="text-sm text-red-700 font-medium">
                ⚠️ This user will lose access to your school immediately
              </p>
              <p className="text-xs text-gray-600 mt-2">
                The employee will be moved to "Former Employees" and can be restored later if needed.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoval}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
