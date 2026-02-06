import { useState, useMemo } from "react";
import { Search, Edit2, Save, X } from "lucide-react";

const defaultClassFees = {
  "PlayGroup A": { tuition: 6000, annual: 15000, admission: 12000, transport: 5000, activity: 500, exam: 1000, books: 2500 },
  "Pre Nursery - A": { tuition: 6000, annual: 15000, admission: 13000, transport: 5500, activity: 500, exam: 1000, books: 0 },
  "Nursery - A": { tuition: 7000, annual: 15000, admission: 13000, transport: 6000, activity: 500, exam: 800, books: 0 },
  "LKG - A": { tuition: 5000, annual: 0, admission: 15000, transport: 2000, activity: 0, exam: 0, books: 0 },
  "UKG - A": { tuition: 5000, annual: 0, admission: 15000, transport: 2000, activity: 0, exam: 0, books: 0 },
  "Class 1 - A": { tuition: 5000, annual: 10000, admission: 15000, transport: 2000, activity: 0, exam: 0, books: 0 },
  "Class 2 - A": { tuition: 5000, annual: 9090, admission: 15000, transport: 2000, activity: 0, exam: 0, books: 0 },
  "Class 3 - A": { tuition: 5000, annual: 15000, admission: 15000, transport: 2000, activity: 600, exam: 0, books: 0 },
  "Class 4 - A": { tuition: 5000, annual: 0, admission: 15000, transport: 2000, activity: 0, exam: 0, books: 0 },
  "Class 5 - A": { tuition: 5000, annual: 0, admission: 15000, transport: 2000, activity: 0, exam: 0, books: 0 },
  "Class 6 - A": { tuition: 5000, annual: 0, admission: 15000, transport: 2000, activity: 0, exam: 0, books: 0 },
  "Class 7 - A": { tuition: 5000, annual: 0, admission: 15000, transport: 2000, activity: 0, exam: 0, books: 0 },
  "Class 8 - A": { tuition: 5000, annual: 0, admission: 15000, transport: 2000, activity: 0, exam: 0, books: 0 },
  "Class 9 - A": { tuition: 5000, annual: 0, admission: 15000, transport: 2000, activity: 0, exam: 0, books: 0 },
  "Class 10 - A": { tuition: 5000, annual: 0, admission: 15000, transport: 2000, activity: 0, exam: 0, books: 0 },
  "Class 11 - PCM - A": { tuition: 5000, annual: 0, admission: 15000, transport: 2000, activity: 0, exam: 0, books: 0 },
  "Class 11 - PCB - A": { tuition: 5000, annual: 0, admission: 15000, transport: 2000, activity: 0, exam: 0, books: 0 },
  "Class 11 - Commerce - A": { tuition: 5000, annual: 0, admission: 15000, transport: 2000, activity: 0, exam: 0, books: 0 },
  "Class 11 - Arts - A": { tuition: 9000, annual: 0, admission: 12000, transport: 2000, activity: 0, exam: 0, books: 0 },
  "Class 12 - PCM - A": { tuition: 9000, annual: 0, admission: 20000, transport: 2000, activity: 0, exam: 0, books: 0 },
  "Class 12 - PCB - A": { tuition: 12000, annual: 0, admission: 15000, transport: 2000, activity: 0, exam: 0, books: 0 },
  "Class 12 - Commerce - A": { tuition: 10000, annual: 0, admission: 15000, transport: 2000, activity: 0, exam: 0, books: 0 },
  "Class 12 - Arts - A": { tuition: 10000, annual: 0, admission: 15000, transport: 2000, activity: 0, exam: 0, books: 0 },
};

const feeTypes = [
  { key: "tuition", label: "Tuition Fees", color: "from-blue-500 to-cyan-500" },
  { key: "annual", label: "Annual Fees", color: "from-purple-500 to-fuchsia-500" },
  { key: "admission", label: "Admission Fee", color: "from-emerald-500 to-teal-500" },
  { key: "transport", label: "Transportation Fees", color: "from-amber-500 to-orange-500" },
  { key: "activity", label: "Activity Fees", color: "from-pink-500 to-rose-500" },
  { key: "exam", label: "Exam Fees", color: "from-indigo-500 to-blue-500" },
  { key: "books", label: "Books Fees", color: "from-lime-500 to-green-500" },
];

export default function ClassFees() {
  const [classFees, setClassFees] = useState(() => {
    const saved = localStorage.getItem("class-fees-data");
    return saved ? JSON.parse(saved) : defaultClassFees;
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [editingClass, setEditingClass] = useState(null);
  const [editForm, setEditForm] = useState({});

  const filteredClasses = useMemo(() => {
    return Object.keys(classFees).filter((className) =>
      className.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [classFees, searchTerm]);

  const handleEdit = (className) => {
    setEditingClass(className);
    setEditForm(classFees[className]);
  };

  const handleSave = () => {
    const updated = {
      ...classFees,
      [editingClass]: editForm,
    };
    setClassFees(updated);
    localStorage.setItem("class-fees-data", JSON.stringify(updated));
    setEditingClass(null);
  };

  const handleCancel = () => {
    setEditingClass(null);
    setEditForm({});
  };

  const calculateTotal = (fees) => {
    return Object.values(fees).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Class Fee Structure</h1>
          <p className="text-sm text-slate-500">View and edit default fee structure for each class</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search classes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredClasses.map((className) => {
          const fees = classFees[className];
          const isEditing = editingClass === className;
          const displayFees = isEditing ? editForm : fees;
          const total = calculateTotal(displayFees);

          return (
            <div
              key={className}
              className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-4 text-white">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg">{className}</h3>
                  {!isEditing && (
                    <button
                      onClick={() => handleEdit(className)}
                      className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition"
                    >
                      <Edit2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Fee Items */}
              <div className="p-4 space-y-3">
                {feeTypes.map(({ key, label, color }) => {
                  const value = displayFees[key] || 0;
                  const isSet = value > 0;

                  return (
                    <div key={key} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700">{label}</span>
                        {isEditing ? (
                          <input
                            type="number"
                            value={editForm[key] || ""}
                            onChange={(e) =>
                              setEditForm({ ...editForm, [key]: e.target.value })
                            }
                            className="w-24 px-2 py-1 border border-slate-300 rounded text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0"
                          />
                        ) : (
                          <span className={`font-semibold ${isSet ? "text-slate-900" : "text-slate-400"}`}>
                            {isSet ? `₹ ${value.toLocaleString()}` : "(not set)"}
                          </span>
                        )}
                      </div>
                      {!isEditing && (
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${color} transition-all duration-300`}
                            style={{ width: isSet ? "100%" : "0%" }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Total */}
                <div className="pt-3 mt-3 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Total Fees</span>
                    <span className="font-bold text-blue-600 text-lg">
                      ₹ {total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Edit Actions */}
                {isEditing && (
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-200">
                    <button
                      onClick={handleSave}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium text-sm"
                    >
                      <Save size={16} />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition font-medium text-sm"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredClasses.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <p>No classes found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
}
