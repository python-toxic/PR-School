import { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Filter, Save } from "lucide-react";
import { withFormerEmployeeCheck } from "../../components/common/withFormerEmployeeCheck";

const employeeDirectory = [
  { id: "fa", name: "Farhana", username: "greenField_farhana", role: "Vice Principal", classes: ["Class 11 - Arts - A", "Class 12 - Arts - A"] },
  { id: "sd", name: "Sukhdev Driver", username: "greenField_sukhdev", role: "Driver", classes: [] },
  { id: "am", name: "Atul Manager", username: "greenField_atul", role: "Finance Manager", classes: [] },
  { id: "kd", name: "Kanchan Das", username: "greenField_kanchan", role: "Teacher", classes: ["Class 6 - A", "Class 7 - A"] },
  { id: "fl", name: "Flintoff", username: "greenField_flintoff", role: "Teacher", classes: ["Class 8 - A", "Class 9 - A"] },
  { id: "vk", name: "Vinod Kumar", username: "greenField_vinod", role: "Teacher", classes: ["Class 5 - A"] },
  { id: "kp", name: "Kamlesh Pawar", username: "greenField_kamlesh", role: "Teacher", classes: ["Class 10 - A"] }
];

const allClasses = [
  "PlayGroup A",
  "Pre Nursery - A",
  "Nursery - A",
  "LKG - A",
  "UKG - A",
  "Class 1 - A",
  "Class 2 - A",
  "Class 3 - A",
  "Class 4 - A",
  "Class 5 - A",
  "Class 6 - A",
  "Class 7 - A",
  "Class 8 - A",
  "Class 9 - A",
  "Class 10 - A",
  "Class 11 - PCM - A",
  "Class 11 - PCB - A",
  "Class 11 - Commerce - A",
  "Class 11 - Arts - A",
  "Class 12 - PCM - A",
  "Class 12 - PCB - A",
  "Class 12 - Commerce - A",
  "Class 12 - Arts - A"
];

function EmployeeAccessibleClass() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const employeeId = searchParams.get("employeeId");

  const employee = employeeDirectory.find((e) => e.id === employeeId);

  const [selectedClasses, setSelectedClasses] = useState(employee?.classes || []);
  const [filterText, setFilterText] = useState("");

  const filteredAllClasses = useMemo(() => {
    return allClasses.filter((cls) =>
      cls.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [filterText]);

  const filteredSelectedClasses = useMemo(() => {
    return selectedClasses.filter((cls) =>
      cls.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [filterText, selectedClasses]);

  const toggleClass = (cls) => {
    setSelectedClasses((prev) =>
      prev.includes(cls) ? prev.filter((c) => c !== cls) : [...prev, cls]
    );
  };

  const handleSave = () => {
    alert(`Classes updated for ${employee.username}:\n${selectedClasses.join("\n")}`);
    navigate(`/employees/edit?employeeId=${employeeId}`);
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Change Class for {employee.username}
          </h1>
          <p className="text-sm text-gray-600">
            Select classes that {employee.name} ({employee.role}) can access
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-6 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Filter classes..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* All Classes */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">All Classes</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Filter size={16} />
              Showing all {filteredAllClasses.length}
            </div>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredAllClasses.map((cls) => (
              <label
                key={cls}
                className={`flex items-center gap-3 px-4 py-3 border rounded-lg cursor-pointer transition ${
                  selectedClasses.includes(cls)
                    ? "bg-blue-50 border-blue-500"
                    : "bg-white border-gray-200 hover:border-blue-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedClasses.includes(cls)}
                  onChange={() => toggleClass(cls)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-900">{cls}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Selected Classes */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Selected Classes</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Filter size={16} />
              Showing all {filteredSelectedClasses.length}
            </div>
          </div>

          {filteredSelectedClasses.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No classes selected</p>
              <p className="text-sm mt-2">Select classes from the left panel</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredSelectedClasses.map((cls) => (
                <div
                  key={cls}
                  className="flex items-center justify-between px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <span className="text-sm font-medium text-gray-900">{cls}</span>
                  <button
                    onClick={() => toggleClass(cls)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end gap-3">
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
  );
}

export default withFormerEmployeeCheck(EmployeeAccessibleClass);
