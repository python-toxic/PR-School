import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle, Trash2 } from "lucide-react";
// Helper: find parent from localStorage admissions list
function findParentInLocalStorage(parentId) {
  try {
    const saved = localStorage.getItem("admissions-parents");
    if (!saved) return null;
    const list = JSON.parse(saved);
    return list.find((p) => String(p.id) === String(parentId)) || null;
  } catch {
    return null;
  }
}

export default function ParentRemove() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const parentId = searchParams.get("parentId");

  const [parent, setParent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadParent = async () => {
      if (!parentId) {
        setParent(null);
        setLoading(false);
        return;
      }
      // Try backend first
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:4000/api/parents/${parentId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const data = await res.json();
          const backendParent = data?.data?.parent || data?.parent;
          if (backendParent) {
            // Normalize shape used by list
            setParent({
              id: backendParent._id || backendParent.id || parentId,
              name: backendParent.name,
              username: backendParent.username || backendParent.mobile || "",
              studentName: backendParent.linkedStudents?.[0]?.studentName || "",
              relation: backendParent.relation || "",
              phone: backendParent.mobile || "",
              email: backendParent.email || ""
            });
            setLoading(false);
            return;
          }
        }
      } catch {}

      // Fallback to localStorage admissions-parents
      const localParent = findParentInLocalStorage(parentId);
      setParent(localParent);
      setLoading(false);
    };

    loadParent();
  }, [parentId]);

  const [formData, setFormData] = useState({
    removedDate: "",
    reason: "",
    remarks: ""
  });

  const [error, setError] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const validateForm = () => {
    if (!formData.removedDate) {
      setError("Removal date is required");
      return false;
    }
    if (!formData.reason) {
      setError("Reason for removal is required");
      return false;
    }
    setError("");
    return true;
  };

  const confirmRemoval = async () => {
    if (!validateForm() || !parent) return;

    // Soft-delete on backend (deactivate), non-blocking
    try {
      await fetch(`http://localhost:4000/api/parents/${parent.id}`, {
        method: "DELETE"
      });
    } catch {}

    // Record in localStorage for Past Parents tab
    const removedParents = JSON.parse(localStorage.getItem("removedParents") || "[]");
    const newRemoval = {
      id: parent.id,
      name: parent.name,
      username: parent.username,
      studentName: parent.studentName,
      relation: parent.relation,
      removedDate: formData.removedDate,
      reason: formData.reason,
      remarks: formData.remarks || "No remarks",
      removedAt: new Date().toISOString()
    };

    removedParents.push(newRemoval);
    localStorage.setItem("removedParents", JSON.stringify(removedParents));

    alert(`Parent "${parent.name}" has been removed successfully.`);
    navigate("/parent-guardian");
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <p className="text-gray-600">Loading parent...</p>
        </div>
      </div>
    );
  }

  if (!parent) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <p className="text-red-600">Parent not found</p>
          <button
            onClick={() => navigate("/parent-guardian")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Parents
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
          onClick={() => navigate("/parent-guardian")}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-4 transition"
        >
          <ArrowLeft size={20} />
          Back to Parents
        </button>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Remove Parent/Guardian
              </h1>
              <p className="text-sm text-gray-600">
                Remove "{parent.name}" ({parent.relation})
              </p>
            </div>
            <div className="bg-red-100 border border-red-300 rounded-lg p-3">
              <AlertCircle className="text-red-600" size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Parent Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Parent Name</p>
          <p className="text-lg font-semibold text-gray-900">{parent.name}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Student Name</p>
          <p className="text-lg font-semibold text-gray-900">{parent.studentName}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Relation</p>
          <p className="text-lg font-semibold text-gray-900">{parent.relation}</p>
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
              Removal Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.removedDate}
              onChange={(e) => setFormData({ ...formData, removedDate: e.target.value })}
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
              <option value="Child moved to another school">Child moved to another school</option>
              <option value="Student withdrawn">Student withdrawn</option>
              <option value="Account closure">Account closure</option>
              <option value="No longer guardian">No longer guardian</option>
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
              Once a parent/guardian is removed, they will:
            </p>
            <ul className="text-sm text-yellow-800 mt-2 ml-4 list-disc">
              <li>Be moved to "Past Parents" section</li>
              <li>Not have access to their account</li>
              <li>Not receive notifications or updates</li>
              <li>Only be viewable in the Past Parents tab</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <button
          onClick={() => navigate("/parent-guardian")}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
        >
          Cancel
        </button>
        <button
          onClick={() => { if (validateForm()) setIsConfirming(true); }}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium inline-flex items-center gap-2"
        >
          <Trash2 size={18} />
          Remove Parent
        </button>
      </div>

      {/* Confirmation Modal */}
      {isConfirming && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Removal</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove <span className="font-semibold">"{parent.name}"</span> from the system? This action cannot be undone.
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
                disabled={deleting}
                className={`px-4 py-2 rounded-lg transition ${deleting ? "bg-red-400 text-white cursor-not-allowed" : "bg-red-600 text-white hover:bg-red-700"}`}
              >
                {deleting ? "Removing..." : "Yes, Remove Parent"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
