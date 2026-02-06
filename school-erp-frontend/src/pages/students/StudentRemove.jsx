import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle, Trash2 } from "lucide-react";
import students from "../../data/Teacher/studentRecord.data.js";

export default function StudentRemove() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const studentId = searchParams.get("studentId");

  const student = students.find((s) => s.id === studentId);

  const [formData, setFormData] = useState({
    leavingDate: "",
    reason: "",
    remarks: ""
  });

  const [error, setError] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);

  const validateForm = () => {
    if (!formData.leavingDate) {
      setError("Leaving date is required");
      return false;
    }
    if (!formData.reason) {
      setError("Reason for leaving is required");
      return false;
    }
    setError("");
    return true;
  };

  const confirmRemoval = () => {
    if (!validateForm()) return;

    const removedStudents = JSON.parse(localStorage.getItem("removedStudents") || "[]");
    const newRemoval = {
      id: student.id,
      name: student.name,
      classId: student.classId,
      rollNo: student.rollNo,
      leavingDate: formData.leavingDate,
      reason: formData.reason,
      remarks: formData.remarks || "No remarks",
      removedAt: new Date().toISOString()
    };

    removedStudents.push(newRemoval);
    localStorage.setItem("removedStudents", JSON.stringify(removedStudents));

    alert(`Student "${student.name}" has been removed from school successfully.`);
    navigate("/students");
  };

  if (!student) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <p className="text-red-600">Student not found</p>
          <button
            onClick={() => navigate("/students")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Students
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
          onClick={() => navigate("/students")}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-4 transition"
        >
          <ArrowLeft size={20} />
          Back to Students
        </button>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Remove Student
              </h1>
              <p className="text-sm text-gray-600">
                Remove "{student.name}" from Class {student.classId}
              </p>
            </div>
            <div className="bg-red-100 border border-red-300 rounded-lg p-3">
              <AlertCircle className="text-red-600" size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Student Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Student Name</p>
          <p className="text-lg font-semibold text-gray-900">{student.name}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Roll No</p>
          <p className="text-lg font-semibold text-gray-900">{student.rollNo}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Class</p>
          <p className="text-lg font-semibold text-gray-900">{student.classId}</p>
        </div>
      </div>

      {/* Removal Form */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 pb-4 border-b border-gray-200">
          Removal Details
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Leaving Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.leavingDate}
              onChange={(e) => setFormData({ ...formData, leavingDate: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Removal <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select reason</option>
              <option value="Transferred to another school">Transferred to another school</option>
              <option value="Left school">Left school</option>
              <option value="Dropped out">Dropped out</option>
              <option value="Expelled">Expelled</option>
              <option value="Medical/Personal reasons">Medical/Personal reasons</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Remarks
            </label>
            <textarea
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add any additional notes..."
            />
          </div>
        </div>
      </div>

      {/* Warning Message */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
        <div className="flex gap-3">
          <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />
          <div>
            <h3 className="font-semibold text-yellow-900 mb-1">Important Notice</h3>
            <p className="text-sm text-yellow-800">
              Once a student is removed, they will:
            </p>
            <ul className="text-sm text-yellow-800 mt-2 ml-4 list-disc">
              <li>Be moved to "Past Students" section</li>
              <li>Not appear in class lists or attendance</li>
              <li>Not be able to access any school operations</li>
              <li>Only be viewable in the Past Students tab</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <button
          onClick={() => navigate("/students")}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
        >
          Cancel
        </button>
        <button
          onClick={() => setIsConfirming(true)}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium inline-flex items-center gap-2"
        >
          <Trash2 size={18} />
          Remove Student
        </button>
      </div>

      {/* Confirmation Modal */}
      {isConfirming && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Removal</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove <span className="font-semibold">"{student.name}"</span> from the school? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setIsConfirming(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoval}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Yes, Remove Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
