import { useEffect, useMemo, useState, useRef } from "react";
import {
  CalendarCheck,
  FileText,
  Search,
  Filter,
  Plus,
  X,
  Eye,
  Pencil,
  CheckCircle2,
  Clock3,
  Building2,
  ClipboardList,
  Trash2,
} from "lucide-react";

const defaultSubjects = [
  "Environmental Studies (EVS)",
  "English",
  "Hindi",
  "Mathematics",
  "General Activity",
  "Arts and Craft",
];

const examTypes = ["Formative", "Summative", "Unit Test", "Mid Term", "Final"];
const examPatterns = ["Default", "Objective", "Subjective", "Mixed"];

const inputCls =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm";

const chipCls = "px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700";

const seedData = [
  {
    id: "ds-1",
    title: "FA2",
    className: "Pre Nursery – A",
    classId: "CLASS_PRE_NUR_A",
    academicYear: "2026",
    startDate: "2026-01-05",
    endDate: "2026-01-06",
    examType: "Formative",
    examPattern: "Default",
    students: 2,
    subjects: [],
    resultUploaded: false,
  },
  {
    id: "ds-2",
    title: "FA",
    className: "Class 10 – A",
    classId: "CLASS_10_A",
    academicYear: "2025",
    startDate: "2025-12-17",
    endDate: "2025-12-31",
    examType: "Formative",
    examPattern: "Default",
    students: 15,
    subjects: [
      {
        subject: "Science",
        examDate: "2025-12-20",
        startTime: "10:00",
        duration: "3h",
        location: "Room 12",
        maxMarks: 100,
        pattern: "Default",
      },
    ],
    resultUploaded: true,
  },
];

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function SubjectRow({ row, onChange, disabled }) {
  return (
    <tr className="border-b last:border-b-0">
      <td className="p-2 text-sm font-semibold text-gray-800">{row.subject}</td>
      <td className="p-2">
        <input
          type="date"
          value={row.examDate}
          onChange={(e) => onChange({ ...row, examDate: e.target.value })}
          className={inputCls}
          disabled={disabled}
        />
      </td>
      <td className="p-2">
        <input
          type="time"
          value={row.startTime}
          onChange={(e) => onChange({ ...row, startTime: e.target.value })}
          className={inputCls}
          disabled={disabled}
        />
      </td>
      <td className="p-2">
        <input
          type="text"
          value={row.duration}
          onChange={(e) => onChange({ ...row, duration: e.target.value })}
          className={inputCls}
          disabled={disabled}
        />
      </td>
      <td className="p-2">
        <input
          type="text"
          value={row.location}
          onChange={(e) => onChange({ ...row, location: e.target.value })}
          className={inputCls}
          disabled={disabled}
        />
      </td>
      <td className="p-2">
        <input
          type="number"
          value={row.maxMarks}
          onChange={(e) => onChange({ ...row, maxMarks: Number(e.target.value) })}
          className={inputCls}
          disabled={disabled}
        />
      </td>
      <td className="p-2">
        <select
          value={row.pattern}
          onChange={(e) => onChange({ ...row, pattern: e.target.value })}
          className={inputCls}
          disabled={disabled}
        >
          {examPatterns.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </td>
      <td className="p-2 text-center">
        <button
          type="button"
          className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 justify-center w-full ${
            disabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-blue-50 text-blue-700 hover:bg-blue-100"
          }`}
          disabled={disabled}
        >
          <ClipboardList size={14} />
          Config
        </button>
      </td>
    </tr>
  );
}

export default function Datesheets() {
  const [datesheets, setDatesheets] = useState([]);
  const [showClassModal, setShowClassModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewSheet, setViewSheet] = useState(null);
  const [selectedClass, setSelectedClass] = useState("");
  const [classInput, setClassInput] = useState("");
  const [filters, setFilters] = useState({ title: "", from: "", to: "", className: "" });
  const [formSaved, setFormSaved] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const classInputRef = useRef(null);
  const [classSuggestions, setClassSuggestions] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    examType: "",
    examPattern: "Default",
    className: "",
    classId: "",
    subjects: defaultSubjects.map((s) => ({
      subject: s,
      examDate: "",
      startTime: "",
      duration: "3h",
      location: "",
      maxMarks: 100,
      pattern: "Default",
    })),
  });

  // Load data and class suggestions
  useEffect(() => {
    const saved = localStorage.getItem("datesheets-data");
    if (saved) {
      setDatesheets(JSON.parse(saved));
    } else {
      setDatesheets(seedData);
    }

    const savedClasses = localStorage.getItem("classes-list");
    if (savedClasses) {
      const parsed = JSON.parse(savedClasses);
      setClassSuggestions(
        parsed.map((c) => ({
          value: `${c.name} - ${c.section}`,
          id: c.id || `${c.name}-${c.section}`,
        }))
      );
    } else {
      setClassSuggestions([
        { value: "Pre Nursery – A", id: "CLASS_PRE_NUR_A" },
        { value: "Class 10 – A", id: "CLASS_10_A" },
        { value: "Class 8 – B", id: "CLASS_8_B" },
      ]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("datesheets-data", JSON.stringify(datesheets));
  }, [datesheets]);

  const filteredDatesheets = useMemo(() => {
    return datesheets
      .filter((d) =>
        d.title.toLowerCase().includes(filters.title.toLowerCase()) ||
        d.className.toLowerCase().includes(filters.title.toLowerCase())
      )
      .filter((d) =>
        filters.className
          ? d.className.toLowerCase().includes(filters.className.toLowerCase())
          : true
      )
      .filter((d) => {
        if (filters.from && new Date(d.startDate) < new Date(filters.from)) return false;
        if (filters.to && new Date(d.endDate) > new Date(filters.to)) return false;
        return true;
      })
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  }, [datesheets, filters]);

  const handleOpenAdd = () => {
    setClassInput("");
    setSelectedClass("");
    setShowClassModal(true);
    setFormSaved(false);
    setEditingId(null);
    setFormData((prev) => ({
      ...prev,
      title: "",
      startDate: "",
      endDate: "",
      examType: "",
      examPattern: "Default",
      subjects: defaultSubjects.map((s) => ({
        subject: s,
        examDate: "",
        startTime: "",
        duration: "3h",
        location: "",
        maxMarks: 100,
        pattern: "Default",
      })),
    }));
  };

  const handleOpenView = (sheet) => {
    setViewSheet(sheet);
    setShowViewModal(true);
  };

  const handleOpenEdit = (sheet) => {
    if (sheet.resultUploaded) {
      alert("This datesheet has results uploaded and cannot be edited.");
      return;
    }
    setEditingId(sheet.id);
    setFormData({
      title: sheet.title,
      startDate: sheet.startDate,
      endDate: sheet.endDate,
      examType: sheet.examType,
      examPattern: sheet.examPattern,
      className: sheet.className,
      classId: sheet.classId,
      subjects:
        sheet.subjects && sheet.subjects.length
          ? sheet.subjects
          : defaultSubjects.map((s) => ({
              subject: s,
              examDate: "",
              startTime: "",
              duration: "3h",
              location: "",
              maxMarks: 100,
              pattern: "Default",
            })),
    });
    setFormSaved(true);
    setShowFormModal(true);
    setShowClassModal(false);
    setTimeout(() => classInputRef.current?.focus(), 150);
  };

  const handleContinueClass = () => {
    if (!selectedClass) return;
    setFormData((prev) => ({ ...prev, className: selectedClass.value, classId: selectedClass.id }));
    setShowClassModal(false);
    setShowFormModal(true);
    setTimeout(() => classInputRef.current?.focus(), 150);
  };

  const handleSubjectChange = (index, updated) => {
    setFormData((prev) => {
      const next = [...prev.subjects];
      next[index] = updated;
      return { ...prev, subjects: next };
    });
  };

  const handleDeleteDatesheet = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      setDatesheets((prev) => prev.filter((d) => d.id !== id));
      alert("Datesheet deleted successfully.");
    }
  };

  const getCardGradient = (examType) => {
    const gradients = {
      Formative: "from-blue-400 to-cyan-500",
      Summative: "from-purple-400 to-pink-500",
      "Unit Test": "from-green-400 to-emerald-500",
      "Mid Term": "from-orange-400 to-red-500",
      Final: "from-red-500 to-pink-600",
    };
    return gradients[examType] || "from-indigo-400 to-blue-500";
  };

  const handleSaveDatesheet = () => {
    if (!formData.title || formData.title.length < 2) {
      alert("Title is required");
      return;
    }
    if (!formData.className) {
      alert("Class is required");
      return;
    }
    if (!formData.startDate || !formData.endDate) {
      alert("Start and End dates are required");
      return;
    }

    const chosenSubjects = formData.subjects
      .filter((s) => s.examDate)
      .sort((a, b) => new Date(a.examDate) - new Date(b.examDate));

    const academicYear = new Date(formData.startDate).getFullYear().toString();

    const newSheet = {
      id: editingId || `ds-${Date.now()}`,
      title: formData.title,
      className: formData.className,
      classId: formData.classId || formData.className,
      academicYear,
      startDate: formData.startDate,
      endDate: formData.endDate,
      examType: formData.examType || "Formative",
      examPattern: formData.examPattern || "Default",
      students: 0,
      subjects: chosenSubjects,
      resultUploaded: editingId ? datesheets.find((d) => d.id === editingId)?.resultUploaded : false,
    };

    setDatesheets((prev) => {
      if (editingId) {
        return prev.map((ds) => (ds.id === editingId ? newSheet : ds));
      }
      return [...prev, newSheet];
    });
    setFormSaved(true);
    alert("Exam date sheet saved successfully");
  };

  const showingStart = filteredDatesheets.length ? 1 : 0;
  const showingEnd = filteredDatesheets.length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
              <CalendarCheck className="text-white" size={28} />
            </div>
            <span>Exam Date Sheets</span>
          </h1>
          <p className="text-gray-600 mt-1">Create and manage exam schedules</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
        >
          <Plus size={18} />
          Add New
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by Exam Title"
            value={filters.title}
            onChange={(e) => setFilters({ ...filters, title: e.target.value })}
            className="w-full pl-10 pr-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex gap-3">
          <input
            type="date"
            value={filters.from}
            onChange={(e) => setFilters({ ...filters, from: e.target.value })}
            className="flex-1 border-2 border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="From"
          />
          <input
            type="date"
            value={filters.to}
            onChange={(e) => setFilters({ ...filters, to: e.target.value })}
            className="flex-1 border-2 border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="To"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Select Class"
            value={filters.className}
            onChange={(e) => setFilters({ ...filters, className: e.target.value })}
            className="w-full pl-10 pr-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex items-center text-sm text-gray-600 justify-between bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
          <span className="font-semibold">Showing {showingStart} – {showingEnd} of {filteredDatesheets.length}</span>
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDatesheets.map((sheet) => (
          <div
            key={sheet.id}
            className={`bg-gradient-to-br ${getCardGradient(sheet.examType)} rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden group animate-fade-in`}
          >
            {/* Card Header with Title */}
            <div className="bg-black/20 backdrop-blur-sm px-5 py-4 text-white">
              <h3 className="text-xl font-bold group-hover:scale-105 transition">{sheet.title}</h3>
              <p className="text-sm opacity-90 mt-1">{sheet.examType} Exam</p>
            </div>

            {/* Card Body */}
            <div className="bg-white/95 px-5 py-4 space-y-3">
              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-2 rounded-lg">
                  <span className="text-gray-600 text-xs font-semibold">Class</span>
                  <p className="font-bold text-gray-800">{sheet.className}</p>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-2 rounded-lg">
                  <span className="text-gray-600 text-xs font-semibold">Year</span>
                  <p className="font-bold text-gray-800">AY {sheet.academicYear}</p>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-2 rounded-lg">
                  <span className="text-gray-600 text-xs font-semibold">Students</span>
                  <p className="font-bold text-gray-800">{sheet.students || 0}</p>
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-2 rounded-lg">
                  <span className="text-gray-600 text-xs font-semibold">Subjects</span>
                  <p className="font-bold text-gray-800">{sheet.subjects.length || "N/A"}</p>
                </div>
              </div>

              {/* Dates */}
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 font-semibold mb-1">📅 Exam Duration</p>
                <p className="text-sm text-gray-800">
                  <strong>{formatDate(sheet.startDate)}</strong> to <strong>{formatDate(sheet.endDate)}</strong>
                </p>
              </div>

              {/* Status Badge */}
              {sheet.resultUploaded && (
                <div className="bg-red-50 border border-red-200 px-3 py-2 rounded-lg text-xs font-semibold text-red-700 flex items-center gap-1">
                  <CheckCircle2 size={14} /> Results Uploaded - Locked
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 flex-wrap">
                <button
                  onClick={() => handleOpenView(sheet)}
                  className="flex-1 px-3 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 font-semibold text-xs flex items-center justify-center gap-1 transition shadow-md hover:shadow-lg"
                >
                  <Eye size={14} />
                  View
                </button>
                <button
                  onClick={() => handleOpenEdit(sheet)}
                  disabled={sheet.resultUploaded}
                  className={`flex-1 px-3 py-2 rounded-lg font-semibold text-xs flex items-center justify-center gap-1 transition ${
                    sheet.resultUploaded
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-indigo-500 text-white hover:bg-indigo-600 shadow-md hover:shadow-lg"
                  }`}
                  title={sheet.resultUploaded ? "Locked: Results already uploaded" : ""}
                >
                  <Pencil size={14} />
                  {sheet.resultUploaded ? "Locked" : "Edit"}
                </button>
                <button
                  onClick={() => handleDeleteDatesheet(sheet.id, sheet.title)}
                  className="flex-1 px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 font-semibold text-xs flex items-center justify-center gap-1 transition shadow-md hover:shadow-lg"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredDatesheets.length === 0 && (
          <div className="col-span-full bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center text-gray-600">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-lg">No datesheets found for current filters.</p>
          </div>
        )}
      </div>

      {/* Class Selection Modal */}
      {showClassModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h3 className="text-lg font-semibold">Select Class</h3>
              <button onClick={() => setShowClassModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={classInput}
                  onChange={(e) => setClassInput(e.target.value)}
                  placeholder="Type class name (e.g., Class 10 – A)"
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  autoFocus
                />
              </div>
              <div className="max-h-52 overflow-y-auto border rounded-lg divide-y">
                {classSuggestions
                  .filter((c) => c.value.toLowerCase().includes(classInput.toLowerCase()))
                  .map((cls) => (
                    <button
                      key={cls.id}
                      type="button"
                      onClick={() => setSelectedClass(cls)}
                      className={`w-full text-left px-4 py-3 hover:bg-blue-50 flex items-center justify-between ${
                        selectedClass?.id === cls.id ? "bg-blue-50" : ""
                      }`}
                    >
                      <span className="text-sm text-gray-800">{cls.value}</span>
                      {selectedClass?.id === cls.id && <CheckCircle2 className="text-blue-600" size={18} />}
                    </button>
                  ))}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowClassModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleContinueClass}
                  disabled={!selectedClass}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h3 className="text-lg font-semibold">Add Exam Date Sheet</h3>
              <button
                onClick={() => {
                  setShowFormModal(false);
                  setFormSaved(false);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Title</label>
                  <input
                    ref={classInputRef}
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="FA 1, Final Exam DateSheet"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Class</label>
                  <input
                    type="text"
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Exam Type</label>
                  <select
                    value={formData.examType}
                    onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
                    className={inputCls}
                  >
                    <option value="">Select exam type</option>
                    {examTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Exam Pattern</label>
                  <select
                    value={formData.examPattern}
                    onChange={(e) => setFormData({ ...formData, examPattern: e.target.value })}
                    className={inputCls}
                  >
                    {examPatterns.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="rounded-lg border border-amber-200 bg-amber-50 text-amber-800 px-4 py-3 text-sm">
                {formSaved ? "Config buttons enabled. You can adjust mark categories per subject." : "Save first to enable subject configuration."}
              </div>

              <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full text-left">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-600">
                    <tr>
                      <th className="p-3">Subject</th>
                      <th className="p-3">Exam Date</th>
                      <th className="p-3">Start Time</th>
                      <th className="p-3">Duration</th>
                      <th className="p-3">Location</th>
                      <th className="p-3">Max Marks</th>
                      <th className="p-3">Pattern</th>
                      <th className="p-3 text-center">Config</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.subjects.map((row, idx) => (
                      <SubjectRow
                        key={row.subject}
                        row={row}
                        onChange={(updated) => handleSubjectChange(idx, updated)}
                        disabled={!formSaved}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    setShowFormModal(false);
                    setFormSaved(false);
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Close
                </button>
                <button
                  onClick={handleSaveDatesheet}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save DateSheet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && viewSheet && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div>
                <h3 className="text-lg font-semibold">{viewSheet.title}</h3>
                <p className="text-sm text-gray-600">{viewSheet.className} · AY {viewSheet.academicYear}</p>
              </div>
              <button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                <div>
                  <span className="font-semibold">Type:</span> {viewSheet.examType}
                </div>
                <div>
                  <span className="font-semibold">Pattern:</span> {viewSheet.examPattern}
                </div>
                <div>
                  <span className="font-semibold">From:</span> {formatDate(viewSheet.startDate)}
                </div>
                <div>
                  <span className="font-semibold">To:</span> {formatDate(viewSheet.endDate)}
                </div>
                <div>
                  <span className="font-semibold">Students:</span> {viewSheet.students || 0}
                </div>
                <div>
                  <span className="font-semibold">Subjects:</span> {viewSheet.subjects?.length || "N/A"}
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 font-semibold text-sm text-gray-700">Subjects</div>
                {viewSheet.subjects && viewSheet.subjects.length > 0 ? (
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-600">
                      <tr>
                        <th className="p-3">Subject</th>
                        <th className="p-3">Exam Date</th>
                        <th className="p-3">Start Time</th>
                        <th className="p-3">Duration</th>
                        <th className="p-3">Location</th>
                        <th className="p-3">Max Marks</th>
                        <th className="p-3">Pattern</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewSheet.subjects.map((subj) => (
                        <tr key={subj.subject} className="border-b last:border-b-0">
                          <td className="p-3 font-semibold text-gray-800">{subj.subject}</td>
                          <td className="p-3">{formatDate(subj.examDate)}</td>
                          <td className="p-3">{subj.startTime || "-"}</td>
                          <td className="p-3">{subj.duration || "-"}</td>
                          <td className="p-3">{subj.location || "-"}</td>
                          <td className="p-3">{subj.maxMarks ?? "-"}</td>
                          <td className="p-3">{subj.pattern || "Default"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-600">No subjects with dates were added.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
