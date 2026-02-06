import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Printer, X } from "lucide-react";
import { withFormerEmployeeCheck } from "../../components/common/withFormerEmployeeCheck";

const employeeDirectory = [
  { id: "fa", name: "Farhana", username: "greenField_farhana", role: "Vice Principal", joined: "2025-10-04", father: "Mohammad Khan", department: "Administration" },
  { id: "sd", name: "Sukhdev Driver", username: "greenField_sukhdev", role: "Driver", joined: "2025-11-18", father: "Ram Singh", department: "Transport" },
  { id: "am", name: "Atul Manager", username: "greenField_atul", role: "Finance Manager", joined: "2025-08-12", father: "Rakesh Kumar", department: "Finance" },
  { id: "kd", name: "Kanchan Das", username: "greenField_kanchan", role: "Teacher", joined: "2025-06-02", father: "Dilip Das", department: "Academic" },
  { id: "fl", name: "Flintoff", username: "greenField_flintoff", role: "Teacher", joined: "2025-06-02", father: "Andrew Flintoff", department: "Academic" },
  { id: "vk", name: "Vinod Kumar", username: "greenField_vinod", role: "Teacher", joined: "2025-06-02", father: "Suresh Kumar", department: "Academic" },
  { id: "kp", name: "Kamlesh Pawar", username: "greenField_kamlesh", role: "Teacher", joined: "2025-06-02", father: "Vijay Pawar", department: "Academic" }
];

function EmployeeExperienceLetter() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const employeeId = searchParams.get("employeeId");

  const employee = employeeDirectory.find((e) => e.id === employeeId);

  const [formData, setFormData] = useState({
    refNo: "/EXP/0468/2026",
    dateOfLeaving: "24 January 2026",
    conduct: "Satisfactory"
  });

  const calculateExperience = (joiningDate, leavingDate) => {
    const start = new Date(joiningDate);
    const end = new Date(leavingDate);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return `${years} Year${years !== 1 ? 's' : ''} ${remainingMonths} Month${remainingMonths !== 1 ? 's' : ''}`;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    alert("PDF Download functionality will be implemented with a backend service");
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
      {/* Action Bar - Hidden in Print */}
      <div className="mb-6 print:hidden">
        <button
          onClick={() => navigate(`/employees/edit?employeeId=${employeeId}`)}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-4 transition"
        >
          <ArrowLeft size={20} />
          Back to Edit Options
        </button>
        <div className="flex gap-3 justify-end">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Printer size={18} />
            Print
          </button>
          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <Download size={18} />
            Download PDF
          </button>
          <button
            onClick={() => navigate(`/employees/edit?employeeId=${employeeId}`)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            <X size={18} />
            Close
          </button>
        </div>
      </div>

      {/* Experience Certificate */}
      <div className="bg-white border-2 border-gray-800 rounded-lg p-12 max-w-4xl mx-auto shadow-lg">
        {/* School Logo */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🏫</div>
          <h1 className="text-3xl font-bold text-gray-900">Green Field Public School</h1>
          <p className="text-sm text-gray-600 mt-2">
            Kiratpur 3rd Milestone road, Kiratpur, Uttar Pradesh
          </p>
          <p className="text-sm text-gray-600">
            Phone: 8279775240 | Email: cu.17bcs1934@gmail.com
          </p>
        </div>

        <hr className="border-gray-300 my-6" />

        {/* Reference Details */}
        <div className="flex justify-between mb-8 text-sm">
          <div>
            <span className="font-semibold">Ref No:</span> {formData.refNo}
          </div>
          <div>
            <span className="font-semibold">Date:</span> {formData.dateOfLeaving}
          </div>
        </div>

        {/* Certificate Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 underline">EXPERIENCE CERTIFICATE</h2>
        </div>

        {/* To Whomsoever */}
        <div className="mb-6">
          <p className="font-semibold text-lg">To Whomsoever It May Concern</p>
        </div>

        {/* Main Content */}
        <div className="mb-8 text-gray-800 leading-relaxed">
          <p className="mb-6">
            This is to certify that <span className="font-semibold">{employee.name}</span>, 
            son of <span className="font-semibold">{employee.father}</span>, has worked in our 
            institution as <span className="font-semibold">{employee.role}</span>.
          </p>

          {/* Employee Details Table */}
          <table className="w-full border border-gray-300 mb-6">
            <tbody>
              <tr className="border-b border-gray-300">
                <td className="py-3 px-4 font-semibold bg-gray-50 w-1/3">Employee Name</td>
                <td className="py-3 px-4">{employee.name}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-3 px-4 font-semibold bg-gray-50">Designation</td>
                <td className="py-3 px-4">{employee.role}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-3 px-4 font-semibold bg-gray-50">Department</td>
                <td className="py-3 px-4">{employee.department}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-3 px-4 font-semibold bg-gray-50">Date of Joining</td>
                <td className="py-3 px-4">{new Date(employee.joined).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-3 px-4 font-semibold bg-gray-50">Date of Leaving</td>
                <td className="py-3 px-4">{formData.dateOfLeaving}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold bg-gray-50">Total Experience</td>
                <td className="py-3 px-4">{calculateExperience(employee.joined, new Date())}</td>
              </tr>
            </tbody>
          </table>

          <p className="mb-6">
            During his tenure with us, he has performed his duties with utmost sincerity and dedication. 
            His conduct and character has been found to be <span className="font-semibold">{formData.conduct}</span>.
          </p>

          <p>We wish him all the best in his future endeavors.</p>
        </div>

        {/* Signature Section */}
        <div className="mt-12">
          <p className="mb-16">For Green Field Public School</p>
          <div className="border-t border-gray-400 w-64 pt-2">
            <p className="font-semibold">Principal / Director</p>
            <p className="text-sm text-gray-600">(Authorized Signatory)</p>
          </div>
        </div>
      </div>

      {/* Edit Form - Hidden in Print */}
      <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6 max-w-4xl mx-auto print:hidden">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Certificate Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reference Number</label>
            <input
              type="text"
              value={formData.refNo}
              onChange={(e) => setFormData({ ...formData, refNo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Leaving</label>
            <input
              type="text"
              value={formData.dateOfLeaving}
              onChange={(e) => setFormData({ ...formData, dateOfLeaving: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Conduct</label>
            <select
              value={formData.conduct}
              onChange={(e) => setFormData({ ...formData, conduct: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Excellent">Excellent</option>
              <option value="Very Good">Very Good</option>
              <option value="Good">Good</option>
              <option value="Satisfactory">Satisfactory</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withFormerEmployeeCheck(EmployeeExperienceLetter);
