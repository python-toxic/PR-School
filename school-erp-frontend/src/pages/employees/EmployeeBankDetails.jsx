import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Building2, AlertCircle, CheckCircle } from "lucide-react";
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

function EmployeeBankDetails() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const employeeId = searchParams.get("employeeId");

  const employee = employeeDirectory.find((e) => e.id === employeeId);

  const [formData, setFormData] = useState({
    accountHolderName: employee?.name || "",
    bankName: "",
    branchName: "",
    bankAddress: "",
    accountNumber: "",
    accountType: "",
    ifscCode: "",
    swiftCode: "",
    isPrimary: true,
    status: "Active",
    isVerified: false
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.accountHolderName) newErrors.accountHolderName = "Account holder name is required";
    if (!formData.bankName) newErrors.bankName = "Bank name is required";
    if (!formData.branchName) newErrors.branchName = "Branch name is required";
    if (!formData.accountNumber) newErrors.accountNumber = "Account number is required";
    if (!formData.accountType) newErrors.accountType = "Account type is required";
    
    if (!formData.ifscCode) {
      newErrors.ifscCode = "IFSC code is required";
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode)) {
      newErrors.ifscCode = "Invalid IFSC code format (e.g., SBIN0001234)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      alert(`Bank details saved successfully for ${employee.username}`);
      navigate(`/employees/edit?employeeId=${employeeId}`);
    }
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
            <Building2 size={28} className="text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Bank Account Details</h1>
          </div>
          <p className="text-sm text-gray-600">
            Manage banking information for salary payments and financial transactions
          </p>
        </div>
      </div>

      {/* Important Information */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6 rounded-lg shadow-sm">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={24} />
          <div>
            <h3 className="text-lg font-bold text-blue-900 mb-2">Important Information</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Ensure all bank details are accurate to avoid payment delays</li>
              <li>• IFSC code format: First 4 characters are bank code, 5th is '0', followed by 6-character branch code</li>
              <li>• Bank details will be verified by administration before activation</li>
              <li>• Keep your bank account active and in good standing</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm max-w-4xl">
        <form className="space-y-8">
          {/* Account Holder Information */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Account Holder Information
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Holder Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.accountHolderName}
                  onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.accountHolderName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Farhana"
                />
                {errors.accountHolderName && (
                  <p className="mt-1 text-sm text-red-600">{errors.accountHolderName}</p>
                )}
              </div>
            </div>
          </div>

          {/* Bank Information */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Bank Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.bankName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., State Bank of India"
                />
                {errors.bankName && (
                  <p className="mt-1 text-sm text-red-600">{errors.bankName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Branch Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.branchName}
                  onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.branchName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., New Delhi Main Branch"
                />
                {errors.branchName && (
                  <p className="mt-1 text-sm text-red-600">{errors.branchName}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Address
                </label>
                <textarea
                  value={formData.bankAddress}
                  onChange={(e) => setFormData({ ...formData, bankAddress: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter complete bank branch address"
                />
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Account Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.accountNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter bank account number"
                />
                {errors.accountNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.accountNumber}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.accountType}
                  onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.accountType ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Account Type</option>
                  <option value="Savings">Savings Account</option>
                  <option value="Current">Current Account</option>
                  <option value="Salary">Salary Account</option>
                </select>
                {errors.accountType && (
                  <p className="mt-1 text-sm text-red-600">{errors.accountType}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IFSC Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.ifscCode}
                  onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.ifscCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., SBIN0001234"
                  maxLength={11}
                />
                {errors.ifscCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.ifscCode}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  📋 Format: 4 letter bank code + 0 + 6 digit branch code
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SWIFT Code
                </label>
                <input
                  type="text"
                  value={formData.swiftCode}
                  onChange={(e) => setFormData({ ...formData, swiftCode: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="For international transfers (optional)"
                />
                <p className="mt-1 text-xs text-gray-500">Required only for international transactions</p>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Account Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <input
                    type="checkbox"
                    checked={formData.isPrimary}
                    onChange={(e) => setFormData({ ...formData, isPrimary: e.target.checked })}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">Set as Primary Account</span>
                    <p className="text-xs text-gray-500 mt-0.5">Use for salary payments</p>
                  </div>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending Verification</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <input
                    type="checkbox"
                    checked={formData.isVerified}
                    onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                    className="h-5 w-5 text-green-600 focus:ring-green-500"
                  />
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-600" />
                    <span className="text-sm font-medium text-gray-900">Verified</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </form>

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-3">
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
            Save Bank Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default withFormerEmployeeCheck(EmployeeBankDetails);
