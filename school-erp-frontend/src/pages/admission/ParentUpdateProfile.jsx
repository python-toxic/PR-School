import { useState, useEffect } from "react";
import { Save, X, Edit2, AlertCircle, CheckCircle2, Users } from "lucide-react";
import { useUser } from "../../context/UserContext.jsx";

const inputCls = "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm";

// Sample admitted parents data
const admittedParents = [
  {
    id: "p1",
    studentId: "s1",
    studentName: "Aarav Kumar",
    fatherName: "Rajesh Kumar",
    fatherPhone: "+91 98765 43210",
    fatherEmail: "rajesh.kumar@email.com",
    fatherOccupation: "Engineer",
    motherName: "Priya Kumar",
    motherPhone: "+91 98765 43211",
    motherEmail: "priya.kumar@email.com",
    motherOccupation: "Teacher",
    addressLine1: "123 Main Street",
    addressLine2: "Apartment 4B",
    city: "Delhi",
    state: "Delhi",
    pincode: "110001",
    admissionDate: "2024-04-01"
  },
  {
    id: "p2",
    studentId: "s2",
    studentName: "Priya Sharma",
    fatherName: "Vikram Sharma",
    fatherPhone: "+91 98765 43212",
    fatherEmail: "vikram.sharma@email.com",
    fatherOccupation: "Doctor",
    motherName: "Anjali Sharma",
    motherPhone: "+91 98765 43213",
    motherEmail: "anjali.sharma@email.com",
    motherOccupation: "Lawyer",
    addressLine1: "456 Oak Avenue",
    addressLine2: "House No. 10",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    admissionDate: "2024-05-01"
  },
];

export default function ParentUpdateProfile() {
  const { user } = useUser();
  const [parents, setParents] = useState([]);
  const [selectedParent, setSelectedParent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [savedMessage, setSavedMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Load from localStorage or use sample data
    const saved = localStorage.getItem("admitted-parents");
    if (saved) {
      setParents(JSON.parse(saved));
    } else {
      setParents(admittedParents);
      localStorage.setItem("admitted-parents", JSON.stringify(admittedParents));
    }
  }, []);

  const filteredParents = parents.filter(
    (p) =>
      `${p.fatherName} ${p.motherName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.fatherPhone.includes(searchQuery)
  );

  const handleSelectParent = (parent) => {
    setSelectedParent(parent);
    setEditedData({ ...parent });
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
    if (!editedData.fatherName && !editedData.motherName) {
      alert("Please fill at least one parent's name");
      return;
    }

    const updatedParents = parents.map((p) =>
      p.id === editedData.id ? editedData : p
    );
    setParents(updatedParents);
    localStorage.setItem("admitted-parents", JSON.stringify(updatedParents));

    setSelectedParent(editedData);
    setIsEditing(false);
    setSavedMessage("Profile updated successfully!");
    setTimeout(() => setSavedMessage(""), 3000);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Parent/Guardian Profile Update</h1>
          <p className="text-gray-600 mt-1">Manage and update parent and guardian information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Parents List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900 mb-3">Parents & Guardians</h2>
              <input
                type="text"
                placeholder="Search by name, student..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${inputCls} mb-2`}
              />
            </div>

            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {filteredParents.map((parent) => (
                <button
                  key={parent.id}
                  onClick={() => handleSelectParent(parent)}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition ${
                    selectedParent?.id === parent.id ? "bg-blue-50 border-l-4 border-l-blue-600" : ""
                  }`}
                >
                  <p className="font-semibold text-gray-900 text-sm">{parent.fatherName}</p>
                  <p className="text-xs text-gray-600 mt-1">{parent.motherName}</p>
                  <p className="text-xs text-gray-500 mt-1">Child: {parent.studentName}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Parent Details */}
          <div className="lg:col-span-2">
            {selectedParent ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <Users size={24} className="text-blue-600" />
                      {editedData?.fatherName || editedData?.motherName}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">Student: {editedData?.studentName}</p>
                  </div>
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
                  {/* Father Information */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="px-2 py-1 bg-blue-600 text-white rounded text-xs font-bold">Father</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={editedData?.fatherName || ""}
                          onChange={(e) => handleInputChange("fatherName", e.target.value)}
                          disabled={!isEditing}
                          className={`${inputCls} disabled:bg-gray-50`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                        <input
                          type="text"
                          value={editedData?.fatherOccupation || ""}
                          onChange={(e) => handleInputChange("fatherOccupation", e.target.value)}
                          disabled={!isEditing}
                          className={`${inputCls} disabled:bg-gray-50`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          value={editedData?.fatherPhone || ""}
                          onChange={(e) => handleInputChange("fatherPhone", e.target.value)}
                          disabled={!isEditing}
                          className={`${inputCls} disabled:bg-gray-50`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                          type="email"
                          value={editedData?.fatherEmail || ""}
                          onChange={(e) => handleInputChange("fatherEmail", e.target.value)}
                          disabled={!isEditing}
                          className={`${inputCls} disabled:bg-gray-50`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mother Information */}
                  <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="px-2 py-1 bg-pink-600 text-white rounded text-xs font-bold">Mother</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={editedData?.motherName || ""}
                          onChange={(e) => handleInputChange("motherName", e.target.value)}
                          disabled={!isEditing}
                          className={`${inputCls} disabled:bg-gray-50`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                        <input
                          type="text"
                          value={editedData?.motherOccupation || ""}
                          onChange={(e) => handleInputChange("motherOccupation", e.target.value)}
                          disabled={!isEditing}
                          className={`${inputCls} disabled:bg-gray-50`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          value={editedData?.motherPhone || ""}
                          onChange={(e) => handleInputChange("motherPhone", e.target.value)}
                          disabled={!isEditing}
                          className={`${inputCls} disabled:bg-gray-50`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                          type="email"
                          value={editedData?.motherEmail || ""}
                          onChange={(e) => handleInputChange("motherEmail", e.target.value)}
                          disabled={!isEditing}
                          className={`${inputCls} disabled:bg-gray-50`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1</label>
                        <input
                          type="text"
                          value={editedData?.addressLine1 || ""}
                          onChange={(e) => handleInputChange("addressLine1", e.target.value)}
                          disabled={!isEditing}
                          className={`${inputCls} disabled:bg-gray-50`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
                        <input
                          type="text"
                          value={editedData?.addressLine2 || ""}
                          onChange={(e) => handleInputChange("addressLine2", e.target.value)}
                          disabled={!isEditing}
                          className={`${inputCls} disabled:bg-gray-50`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          value={editedData?.city || ""}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          disabled={!isEditing}
                          className={`${inputCls} disabled:bg-gray-50`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                        <input
                          type="text"
                          value={editedData?.state || ""}
                          onChange={(e) => handleInputChange("state", e.target.value)}
                          disabled={!isEditing}
                          className={`${inputCls} disabled:bg-gray-50`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                        <input
                          type="text"
                          value={editedData?.pincode || ""}
                          onChange={(e) => handleInputChange("pincode", e.target.value)}
                          disabled={!isEditing}
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
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {isEditing && (
                    <div className="flex gap-3 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => {
                          setEditedData(selectedParent);
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
                <p className="text-gray-500 font-medium">Select a parent/guardian to view and edit profile</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
