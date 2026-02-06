import { AlertCircle, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

export function withFormerStudentCheck(Component) {
  return function ProtectedComponent() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const studentId = searchParams.get("studentId");
    const [removedStudents, setRemovedStudents] = useState([]);

    useEffect(() => {
      const removed = JSON.parse(localStorage.getItem("removedStudents") || "[]");
      setRemovedStudents(removed);
    }, []);

    if (studentId && removedStudents.some(s => s.id === studentId)) {
      const student = removedStudents.find(s => s.id === studentId);
      
      return (
        <div className="p-6 bg-gray-50 min-h-screen">
          <div className="max-w-2xl mx-auto bg-white rounded-xl border border-red-200 shadow-lg overflow-hidden">
            <div className="bg-red-50 px-6 py-8 border-b border-red-200 text-center">
              <Lock className="mx-auto text-red-600 mb-4" size={48} />
              <h1 className="text-2xl font-bold text-red-900 mb-2">Access Denied</h1>
              <p className="text-red-700">
                This student has been removed from the school
              </p>
            </div>

            <div className="p-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex gap-3">
                  <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />
                  <div>
                    <h3 className="font-semibold text-yellow-900 mb-2">
                      {student.name} • Class {student.classId}
                    </h3>
                    <div className="text-sm text-yellow-800 space-y-1">
                      <p><span className="font-semibold">Removed Date:</span> {student.leavingDate}</p>
                      <p><span className="font-semibold">Reason:</span> {student.reason}</p>
                      {student.remarks !== "No remarks" && (
                        <p><span className="font-semibold">Remarks:</span> {student.remarks}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Restrictions:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                    Cannot take or view attendance
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                    Cannot participate in exams
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                    Cannot access any school features
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                    View-only access in Past Students section
                  </li>
                </ul>
              </div>

              <button
                onClick={() => navigate("/students")}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Back to Students
              </button>
            </div>
          </div>
        </div>
      );
    }

    return <Component />;
  };
}
