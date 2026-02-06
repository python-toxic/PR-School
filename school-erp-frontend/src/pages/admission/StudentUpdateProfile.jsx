import { useState, useEffect } from "react";
import { Save, X, Edit2, AlertCircle, CheckCircle2, Upload } from "lucide-react";
import { useUser } from "../../context/UserContext.jsx";

const genderOptions = ["Male", "Female", "Other"];
const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const religions = ["Hindu", "Muslim", "Christian", "Sikh", "Jain", "Buddhist", "Other"];
const socialCategories = ["General", "OBC", "SC", "ST", "EWS", "Other"];
const motherTongues = ["Hindi", "English", "Bengali", "Tamil", "Telugu", "Marathi", "Gujarati", "Punjabi", "Kannada", "Malayalam", "Odia", "Other"];

const inputCls = "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm";

// Sample admitted students data
const admittedStudents = [
  {
    id: "s1",
    firstName: "Aarav",
    lastName: "Kumar",
    rollNo: 1,
    class: "Nursery - A",
    dob: "2020-06-15",
    gender: "Male",
    bloodGroup: "O+",
    aadhar: "123456789012",
    nationality: "Indian",
    religion: "Hindu",
    socialCategory: "General",
    motherTongue: "Hindi",
    photoUrl: "https://via.placeholder.com/150",
    admissionDate: "2024-04-01",
    previousSchool: "",
    previousClass: "",
    tcNumber: ""
  },
  {
    id: "s2",
    firstName: "Priya",
    lastName: "Sharma",
    rollNo: 2,
    class: "Class 1 - A",
    dob: "2019-03-20",
    gender: "Female",
    bloodGroup: "B+",
    aadhar: "234567890123",
    nationality: "Indian",
    religion: "Hindu",
    socialCategory: "OBC",
    motherTongue: "Hindi",
    photoUrl: "https://via.placeholder.com/150",
    admissionDate: "2024-05-01",
    previousSchool: "St. Mary's Academy",
    previousClass: "KG",
    tcNumber: "TN/2024/001"
  },
];

export default function StudentUpdateProfile() {
  const { user } = useUser();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [savedMessage, setSavedMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Load from localStorage or use sample data
    const saved = localStorage.getItem("admitted-students");
    if (saved) {
      setStudents(JSON.parse(saved));
    } else {
      setStudents(admittedStudents);
      localStorage.setItem("admitted-students", JSON.stringify(admittedStudents));
    }
  }, []);

  const filteredStudents = students.filter(
    (s) =>
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.toString().includes(searchQuery) ||
      s.class.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setEditedData({ ...student });
    setIsEditing(false);
    setSavedMessage("");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleInputChange = (field, value) => {
    setEditedData({
      ...editedData,
      [field]: value
    });
  };

  const handleSave = () => {
    if (!editedData.firstName || !editedData.lastName) {
      alert("Please fill all required fields");
      return;
    }

    const updatedStudents = students.map((s) =>
      s.id === editedData.id ? editedData : s
    );
    setStudents(updatedStudents);
    localStorage.setItem("admitted-students", JSON.stringify(updatedStudents));

    setSelectedStudent(editedData);
    setIsEditing(false);
    setSavedMessage("Profile updated successfully!");
    setTimeout(() => setSavedMessage(""), 3000);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Student Profile Update</h1>
          <p className="text-gray-600 mt-1">Manage and update your student's profile information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Students List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900 mb-3">Admitted Students</h2>
              <input
                type="text"
                placeholder="Search by name or class..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${inputCls} mb-2`}
              />
            </div>

            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {filteredStudents.map((student) => (
                <button
                  key={student.id}
                  onClick={() => handleSelectStudent(student)}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition ${
                    selectedStudent?.id === student.id ? "bg-blue-50 border-l-4 border-l-blue-600" : ""
                  }`}
                >
                  <p className="font-semibold text-gray-900">
                    {student.firstName} {student.lastName}
                  </p>
                  <p className="text-sm text-gray-600">Roll No: {student.rollNo}</p>
                  <p className="text-sm text-gray-500">{student.class}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Student Details */}
          <div className="lg:col-span-2">
            {selectedStudent ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editedData?.firstName} {editedData?.lastName}
                  </h2>
                  <button
                    onClick={handleEdit}
                    disabled={isEditing}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                      isEditing
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                        : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                    }`}
                  >
                    <Edit2 size={18} />
                    Edit Profile
                  </button>
                </div>

                {savedMessage && (
                  <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                    <CheckCircle2 size={20} className="text-green-600" />
                    <p className="text-green-700">{savedMessage}</p>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                        <input
                          type="text"
                          value={editedData?.firstName || ""}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          disabled={!isEditing}
                          className={`${inputCls} disabled:bg-gray-50`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                        <input
                          type="text"
                          value={editedData?.lastName || ""}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          disabled={!isEditing}
                          className={`${inputCls} disabled:bg-gray-50`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                        <input
                          type="date"
                          value={editedData?.dob || ""}
                          onChange={(e) => handleInputChange("dob", e.target.value)}
                          disabled={!isEditing}
                          className={`${inputCls} disabled:bg-gray-50`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                        <select
                          value={editedData?.gender || ""}
                          onChange={(e) => handleInputChange("gender", e.target.value)}
                          disabled={!isEditing}
                          className={`${inputCls} disabled:bg-gray-50`}
                        >
                          <option value="">Select Gender</option>
                          {genderOptions.map((g) => (
                            <option key={g} value={g}>
                              {g}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
                        <select
                          value={editedData?.bloodGroup || ""}
                          onChange={(e) => handleInputChange("bloodGroup", e.target.value)}
                          disabled={!isEditing}
                          className={`${inputCls} disabled:bg-gray-50`}
                        >
                          <option value="">Select Blood Group</option>
                          {bloodGroups.map((bg) => (
                            <option key={bg} value={bg}>
                              {bg}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Aadhar Number</label>
                        <input
                          type="text"
                          value={editedData?.aadhar || ""}
                          onChange={(e) => handleInputChange("aadhar", e.target.value)}
                          disabled={!isEditing}
                          className={`${inputCls} disabled:bg-gray-50`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
                        <select
                          value={editedData?.religion || ""}
                          onChange={(e) => handleInputChange("religion", e.target.value)}
                          disabled={!isEditing}
                          className={`${inputCls} disabled:bg-gray-50`}
                        >
                          <option value="">Select Religion</option>
                          {religions.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Social Category</label>
                        <select
                          value={editedData?.socialCategory || ""}
                          onChange={(e) => handleInputChange("socialCategory", e.target.value)}
                          disabled={!isEditing}
                          className={`${inputCls} disabled:bg-gray-50`}
                        >
                          <option value="">Select Category</option>
                          {socialCategories.map((sc) => (
                            <option key={sc} value={sc}>
                              {sc}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mother Tongue</label>
                        <select
                          value={editedData?.motherTongue || ""}
                          onChange={(e) => handleInputChange("motherTongue", e.target.value)}
                          disabled={!isEditing}
                          className={`${inputCls} disabled:bg-gray-50`}
                        >
                          <option value="">Select Mother Tongue</option>
                          {motherTongues.map((mt) => (
                            <option key={mt} value={mt}>
                              {mt}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Roll Number</label>
                        <input
                          type="text"
                          value={editedData?.rollNo || ""}
                          disabled
                          className={`${inputCls} disabled:bg-gray-50`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                        <input
                          type="text"
                          value={editedData?.class || ""}
                          disabled
                          className={`${inputCls} disabled:bg-gray-50`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Admission Date</label>
                        <input
                          type="date"
                          value={editedData?.admissionDate || ""}
                          disabled
                          className={`${inputCls} disabled:bg-gray-50`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Previous School</label>
                        <input
                          type="text"
                          value={editedData?.previousSchool || ""}
                          onChange={(e) => handleInputChange("previousSchool", e.target.value)}
                          disabled={!isEditing}
                          className={`${inputCls} disabled:bg-gray-50`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Previous Class</label>
                        <input
                          type="text"
                          value={editedData?.previousClass || ""}
                          onChange={(e) => handleInputChange("previousClass", e.target.value)}
                          disabled={!isEditing}
                          className={`${inputCls} disabled:bg-gray-50`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">TC Number</label>
                        <input
                          type="text"
                          value={editedData?.tcNumber || ""}
                          onChange={(e) => handleInputChange("tcNumber", e.target.value)}
                          disabled={!isEditing}
                          className={`${inputCls} disabled:bg-gray-50`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {isEditing && (
                    <div className="flex gap-3 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => {
                          setEditedData(selectedStudent);
                          setIsEditing(false);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                      >
                        <X size={18} />
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        <Save size={18} />
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">Select a student to view and edit profile</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
