import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Upload, User } from "lucide-react";
import { withFormerEmployeeCheck } from "../../components/common/withFormerEmployeeCheck";

const employeeDirectory = [
  { id: "fa", name: "Farhana", username: "greenField_farhana", role: "Vice Principal", phone: "+91 98765 43210", email: "farhana@greenfield.edu", address: "123 Main Street, Delhi", dateOfBirth: "1985-05-15", gender: "Female", qualification: "M.Ed", experience: "10 years" },
  { id: "sd", name: "Sukhdev Driver", username: "greenField_sukhdev", role: "Driver", phone: "+91 90000 00001", email: "sukhdev@greenfield.edu", address: "456 Park Road, Delhi", dateOfBirth: "1980-08-20", gender: "Male", qualification: "10th Pass", experience: "5 years" },
  { id: "am", name: "Atul Manager", username: "greenField_atul", role: "Finance Manager", phone: "+91 90000 00002", email: "atul@greenfield.edu", address: "789 Finance Lane, Delhi", dateOfBirth: "1978-03-10", gender: "Male", qualification: "MBA", experience: "12 years" },
  { id: "kd", name: "Kanchan Das", username: "greenField_kanchan", role: "Teacher", phone: "+91 90000 00003", email: "kanchan@greenfield.edu", address: "321 Teacher Colony, Delhi", dateOfBirth: "1990-07-25", gender: "Female", qualification: "B.Ed", experience: "6 years" },
  { id: "fl", name: "Flintoff", username: "greenField_flintoff", role: "Teacher", phone: "+91 90000 00004", email: "flintoff@greenfield.edu", address: "654 Sports Avenue, Delhi", dateOfBirth: "1988-12-01", gender: "Male", qualification: "B.Ed", experience: "8 years" },
  { id: "vk", name: "Vinod Kumar", username: "greenField_vinod", role: "Teacher", phone: "+91 90000 00005", email: "vinod@greenfield.edu", address: "987 Academic Street, Delhi", dateOfBirth: "1992-04-18", gender: "Male", qualification: "M.Sc, B.Ed", experience: "4 years" },
  { id: "kp", name: "Kamlesh Pawar", username: "greenField_kamlesh", role: "Teacher", phone: "+91 90000 00006", email: "kamlesh@greenfield.edu", address: "147 School Road, Delhi", dateOfBirth: "1991-09-30", gender: "Male", qualification: "B.Ed", experience: "5 years" }
];

function EmployeeChangeDetails() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const employeeId = searchParams.get("employeeId");

  const employee = employeeDirectory.find((e) => e.id === employeeId);

  const [formData, setFormData] = useState({
    name: employee?.name || "",
    phone: employee?.phone || "",
    email: employee?.email || "",
    address: employee?.address || "",
    dateOfBirth: employee?.dateOfBirth || "",
    gender: employee?.gender || "",
    qualification: employee?.qualification || "",
    experience: employee?.experience || "",
    profileImage: null
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors({ ...errors, profileImage: "Image size should be less than 2MB" });
        return;
      }
      setFormData({ ...formData, profileImage: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setErrors({ ...errors, profileImage: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      alert(`Employee details updated successfully for ${employee.username}\n\nUpdated Information:\n- Name: ${formData.name}\n- Phone: ${formData.phone}\n- Email: ${formData.email}\n- Address: ${formData.address}\n- Date of Birth: ${formData.dateOfBirth}\n- Gender: ${formData.gender}\n- Qualification: ${formData.qualification}\n- Experience: ${formData.experience}`);
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
            <User size={28} className="text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Change Employee Details</h1>
          </div>
          <p className="text-sm text-gray-600">
            Update profile information for {employee.name} ({employee.username})
          </p>
        </div>
      </div>

      {/* Info Notice */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6 rounded-lg shadow-sm">
        <div className="flex items-start gap-3">
          <div className="text-blue-600 flex-shrink-0 mt-0.5">ℹ️</div>
          <div>
            <h3 className="text-lg font-bold text-blue-900 mb-2">What You Can Change</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Profile picture and contact information</li>
              <li>• Personal details like name, address, and date of birth</li>
              <li>• Qualification and experience information</li>
            </ul>
            <p className="text-sm text-blue-900 font-medium mt-3">⚠️ For security reasons, username and password cannot be changed here. Use "Change Password" for password updates.</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm max-w-4xl">
        <form className="space-y-8">
          {/* Profile Picture */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Profile Picture
            </h2>
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg overflow-hidden">
                  {imagePreview || employee.profileImage ? (
                    <img src={imagePreview || employee.profileImage} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    employee.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
                  )}
                </div>
              </div>
              <div className="flex-1">
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer">
                  <Upload size={18} />
                  Upload New Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">Max size: 2MB • Formats: JPG, PNG</p>
                {errors.profileImage && (
                  <p className="text-sm text-red-600 mt-1">{errors.profileImage}</p>
                )}
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+91 98765 43210"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="email@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter complete address"
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Professional Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qualification
                </label>
                <input
                  type="text"
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., B.Ed, M.Ed, MBA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Experience
                </label>
                <input
                  type="text"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 5 years"
                />
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">🔒 Security Information (Cannot be changed here):</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Username:</span>
                <p className="font-medium text-gray-900">{employee.username}</p>
              </div>
              <div>
                <span className="text-gray-600">Designation:</span>
                <p className="font-medium text-gray-900">{employee.role}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Use "Change Password" option to update password, and "Change User Role" to update designation.</p>
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
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default withFormerEmployeeCheck(EmployeeChangeDetails);
