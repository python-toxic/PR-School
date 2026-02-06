import { useSearchParams, useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

/**
 * Higher Order Component to protect routes from former employees
 * Wraps a component and checks if the employee is removed/former
 * If so, shows an access denied message
 */
export function withFormerEmployeeCheck(Component) {
  return function ProtectedComponent(props) {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const employeeId = searchParams.get("employeeId");

    // Check if employee is removed/former
    const removedEmployees = JSON.parse(localStorage.getItem('removedEmployees') || '[]');
    const isFormerEmployee = removedEmployees.some(emp => emp.id === employeeId);

    if (isFormerEmployee) {
      return (
        <div className="p-6 bg-gray-50 min-h-screen">
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center shadow-lg">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-red-100 rounded-full">
                  <AlertTriangle className="text-red-600" size={48} />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-red-900 mb-3">
                🔒 Access Denied - Former Employee
              </h2>
              <p className="text-red-700 mb-4 text-lg">
                This employee has been removed from the school.
              </p>
              <div className="bg-white border border-red-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Restricted Actions:</h3>
                <ul className="text-sm text-gray-700 space-y-1 text-left">
                  <li>❌ Cannot take or view attendance</li>
                  <li>❌ Cannot participate in exams or evaluations</li>
                  <li>❌ Cannot edit employee details</li>
                  <li>❌ Cannot access classes or permissions</li>
                  <li>❌ Cannot generate certificates or letters</li>
                  <li>❌ Cannot perform any school operations</li>
                </ul>
              </div>
              <p className="text-sm text-red-600 mb-6">
                Former employees are <strong>view-only</strong> in the system for record-keeping purposes.
              </p>
              <button
                onClick={() => navigate("/employees")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Go to Employees List
              </button>
            </div>
          </div>
        </div>
      );
    }

    // If not former employee, render the component normally
    return <Component {...props} />;
  };
}

export default withFormerEmployeeCheck;
