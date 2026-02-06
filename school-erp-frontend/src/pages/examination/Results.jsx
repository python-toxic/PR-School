import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  BarChart3,
  Search,
  Filter,
  FileSpreadsheet,
  Upload,
  Download,
  ChevronRight,
  CheckCircle2,
  XCircle,
  User,
  Calendar,
  Percent,
  FileText,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

const inputCls =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm";

const statusColors = {
  Pass: "bg-green-100 text-green-800",
  Fail: "bg-red-100 text-red-800",
};

const seedResults = [
  {
    id: "res-1",
    studentName: "Arjun Mehta",
    studentId: "greenField_C10_015",
    examTitle: "FA",
    percentage: 92,
    status: "Pass",
    durationFrom: "2025-12-17",
    durationTo: "2025-12-31",
    className: "10th – A",
    year: 2025,
    subjects: [
      { name: "Science", theory: 45, practical: 20, internal: 10, max: 80 },
      { name: "Maths", theory: 48, practical: 22, internal: 10, max: 80 },
    ],
  },
  {
    id: "res-2",
    studentName: "Reva Iyer",
    studentId: "greenField_PRE_002",
    examTitle: "FA2",
    percentage: 68,
    status: "Pass",
    durationFrom: "2026-01-05",
    durationTo: "2026-01-06",
    className: "Pre Nursery – A",
    year: 2026,
    subjects: [
      { name: "EVS", theory: 30, practical: 10, internal: 10, max: 60 },
    ],
  },
];

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function getPercentageColor(percentage) {
  if (percentage >= 90) return "from-green-400 to-emerald-500";
  if (percentage >= 75) return "from-blue-400 to-cyan-500";
  if (percentage >= 60) return "from-amber-400 to-orange-500";
  if (percentage >= 45) return "from-orange-400 to-red-400";
  return "from-red-500 to-pink-600";
}

function ResultCard({ result, onView }) {
  const gradientClass = getPercentageColor(result.percentage);
  const statusBgColor = result.status === "Pass" ? "bg-green-50" : "bg-red-50";
  const statusTextColor = result.status === "Pass" ? "text-green-700" : "text-red-700";

  return (
    <div
      className={`bg-gradient-to-br ${gradientClass} rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 p-5 flex flex-col gap-4 cursor-pointer group`}
      onClick={() => onView(result)}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between">
        {/* Circular Percentage Badge */}
        <div className="w-24 h-24 rounded-full bg-white/95 shadow-lg flex flex-col items-center justify-center group-hover:scale-110 transition-transform">
          <div className="text-3xl font-black text-gray-900">{result.percentage}</div>
          <div className="text-xs font-semibold text-gray-600">%</div>
        </div>
        {/* Status Badge */}
        <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${statusBgColor} ${statusTextColor}`}>
          {result.status}
        </div>
      </div>

      {/* Card Body */}
      <div className="bg-white/95 rounded-xl p-4 space-y-2">
        <p className="text-sm font-semibold text-gray-700">Student</p>
        <p className="text-lg font-bold text-gray-900 truncate">{result.studentName}</p>
        <p className="text-xs text-gray-600">{result.studentId}</p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-200">
          <div>
            <p className="text-xs text-gray-600 font-semibold">Exam</p>
            <p className="text-sm font-bold text-gray-800">{result.examTitle}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 font-semibold">Class</p>
            <p className="text-sm font-bold text-gray-800">{result.className}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 font-semibold">Duration</p>
            <p className="text-xs font-bold text-gray-800">{formatDate(result.durationFrom)} – {formatDate(result.durationTo)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 font-semibold">Year</p>
            <p className="text-sm font-bold text-gray-800">{result.year}</p>
          </div>
        </div>
      </div>

      {/* Action Link */}
      <div className="flex items-center gap-2 text-white font-semibold text-sm group-hover:gap-3 transition-all">
        <span>View Details</span>
        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
}

export default function Results() {
  const [results, setResults] = useState([]);
  const [datesheets, setDatesheets] = useState([]);
  const [classes, setClasses] = useState([]);
  const [filters, setFilters] = useState({ user: "", title: "", className: "" });
  const [showViewModal, setShowViewModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [selectedExam, setSelectedExam] = useState("");

  // Manual entry form state
  const [manualForm, setManualForm] = useState({
    studentName: "",
    studentId: "",
    examTitle: "",
    percentage: "",
    status: "Pass",
    className: "",
    year: new Date().getFullYear(),
  });

  // Upload states (simulation)
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);

  const defaultClasses = ["Nursery", "KG", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

  // Compute valid exams
  const validExamsForResults = Array.isArray(datesheets)
    ? datesheets.filter((d) => d.subjects && d.subjects.length > 0 && !d.resultUploaded)
    : [];

  useEffect(() => {
    const saved = localStorage.getItem("results-data");
    if (saved) {
      setResults(JSON.parse(saved));
    } else {
      setResults(seedResults);
    }

    const savedSheets = localStorage.getItem("datesheets-data");
    if (savedSheets) {
      setDatesheets(JSON.parse(savedSheets));
    }

    // Load classes from localStorage or use defaults
    const savedClasses = localStorage.getItem("classes-list");
    if (savedClasses) {
      const classList = JSON.parse(savedClasses);
      setClasses(classList.map((c) => c.name || c));
    } else {
      setClasses(defaultClasses);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("results-data", JSON.stringify(results));
  }, [results]);

  useEffect(() => {
    localStorage.setItem("datesheets-data", JSON.stringify(datesheets));
  }, [datesheets]);

  const filtered = useMemo(() => {
    return results
      .filter((r) =>
        r.studentName.toLowerCase().includes(filters.user.toLowerCase()) ||
        r.studentId.toLowerCase().includes(filters.user.toLowerCase())
      )
      .filter((r) => r.examTitle.toLowerCase().includes(filters.title.toLowerCase()))
      .filter((r) =>
        filters.className ? r.className.toLowerCase().includes(filters.className.toLowerCase()) : true
      )
      .sort((a, b) => b.percentage - a.percentage);
  }, [results, filters]);


  const handleGenerateTemplate = useCallback(() => {
    try {
      if (!selectedExam) {
        alert("Please select an exam first.");
        return;
      }
      if (!datesheets || datesheets.length === 0) {
        alert("No datasheets available. Please create an exam datesheet first.");
        return;
      }
      const exam = datesheets.find((d) => d.id === selectedExam);
      if (!exam) {
        alert("Selected exam not found. Please try again.");
        return;
      }
      const classNumber = exam.className?.match?.(/\d+/)?.[0] || "All";
      alert(`✅ Excel template for ${exam.title} (Class ${classNumber}) generated!\n\nColumns:\n• Student ID\n• Student Name\n• Subject 1 (Theory/Practical/Internal)\n• Subject 2\n• ...\n\nDownload and fill marks, then upload back.`);
    } catch (error) {
      console.error("Error generating template:", error);
      alert("Error generating template. Please try again.");
    }
  }, [selectedExam, datesheets]);

  const handleAddManualResult = () => {
    try {
      if (!manualForm.studentName || !manualForm.studentId || !manualForm.examTitle || !manualForm.percentage) {
        alert("Please fill all required fields.");
        return;
      }

      const percentage = parseFloat(manualForm.percentage);
      if (isNaN(percentage) || percentage < 0 || percentage > 100) {
        alert("Percentage must be a valid number between 0-100.");
        return;
      }

      const newResult = {
        id: `res-${Date.now()}`,
        studentName: manualForm.studentName,
        studentId: manualForm.studentId,
        examTitle: manualForm.examTitle,
        percentage: percentage,
        status: percentage >= 40 ? "Pass" : "Fail",
        durationFrom: new Date().toISOString(),
        durationTo: new Date().toISOString(),
        className: manualForm.className || "N/A",
        year: manualForm.year,
        subjects: [],
      };

      setResults((prev) => [...prev, newResult]);
      setShowManualModal(false);
      setManualForm({
        studentName: "",
        studentId: "",
        examTitle: "",
        percentage: "",
        status: "Pass",
        className: "",
        year: new Date().getFullYear(),
      });
      alert("✅ Result added successfully!");
    } catch (error) {
      console.error("Error adding manual result:", error);
      alert("Error adding result. Please try again.");
    }
  };

  const handleUpload = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError("");
    if (!file.name.endsWith(".xlsx")) {
      setUploadError("Only .xlsx files are allowed.");
      fileInputRef.current.value = "";
      return;
    }
    if (!selectedExam) {
      setUploadError("Please select an exam first.");
      return;
    }
    if (!datesheets || datesheets.length === 0) {
      setUploadError("No datasheets available. Please create an exam datesheet first.");
      return;
    }
    
    const currentExam = datesheets.find((d) => d.id === selectedExam);
    if (!currentExam) {
      setUploadError("Selected exam not found. Please try again.");
      return;
    }
    
    setUploading(true);
    // Simulate validation
    setTimeout(() => {
      try {
        // Mark datesheet as resultUploaded
        setDatesheets((prev) =>
          prev.map((d) => (d.id === selectedExam ? { ...d, resultUploaded: true } : d))
        );
        // Add mock results
        const newResults = [
          {
            id: `res-${Date.now()}`,
            studentName: "Test Student",
            studentId: "TEST_001",
            examTitle: currentExam.title,
            percentage: 85,
            status: "Pass",
            durationFrom: currentExam.startDate,
            durationTo: currentExam.endDate,
            className: currentExam.className,
            year: currentExam.academicYear,
            subjects: currentExam.subjects.map((s) => ({
              name: s.subject,
              theory: 40,
              practical: 18,
              internal: 9,
              max: s.maxMarks,
            })),
          },
        ];
        setResults((prev) => [...prev, ...newResults]);
        setUploading(false);
        alert("Results uploaded successfully. Datesheet locked.");
        fileInputRef.current.value = "";
        setShowUploadModal(false);
        setSelectedExam("");
      } catch (error) {
        console.error("Upload error:", error);
        setUploadError("Error processing upload. Please try again.");
        setUploading(false);
      }
    }, 1200);
  }, [selectedExam, datesheets]);

  const showingStart = filtered.length ? 1 : 0;
  const showingEnd = filtered.length;

  const handleView = (result) => {
    setSelectedResult(result);
    setShowViewModal(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BarChart3 className="text-blue-600" size={28} />
            <span>Results</span>
          </h1>
          <p className="text-gray-600 mt-1">View and upload exam results (Excel).</p>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 space-y-2">
        <h3 className="font-semibold text-blue-900 flex items-center gap-2">
          <AlertCircle size={18} />
          How It Works
        </h3>
        <div className="text-sm text-blue-800 space-y-1">
          <p><span className="font-semibold">Results are generated based on Exam Date Sheets.</span> To upload results, you must first generate and then upload the exam result Excel file.</p>
          <p className="font-semibold mt-2">Steps to Add Results:</p>
          <ol className="list-decimal list-inside space-y-0.5 ml-2">
            <li>Click <span className="font-semibold">Upload Results</span>.</li>
            <li>Select the Exam from the dropdown.</li>
            <li>Click <span className="font-semibold">Generate Results Excel</span> to download the template.</li>
            <li>Fill in student marks in the downloaded file (do not change column names or file name).</li>
            <li>Go to <span className="font-semibold">Upload Result</span>.</li>
            <li>Select the same Exam again.</li>
            <li>Upload the filled Excel file.</li>
          </ol>
          <p className="font-semibold mt-2">Important Notes:</p>
          <ul className="list-disc list-inside space-y-0.5 ml-2">
            <li>Choose the same exam while generating and uploading.</li>
            <li>Uploading a different or modified file will fail.</li>
            <li>Results can be uploaded only once per exam.</li>
            <li>After results are uploaded, the related exam date sheet is locked and cannot be edited.</li>
            <li>Only exams with subjects are eligible for result upload.</li>
          </ul>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by student name or ID"
            value={filters.user}
            onChange={(e) => setFilters({ ...filters, user: e.target.value })}
            className="w-full pl-10 pr-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="relative">
          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by Exam Title"
            value={filters.title}
            onChange={(e) => setFilters({ ...filters, title: e.target.value })}
            className="w-full pl-10 pr-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          <span className="font-semibold">Showing {showingStart} – {showingEnd} of {filtered.length}</span>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Add Exam Results</h3>
            <p className="text-sm text-gray-600">Upload Excel file or manually add student results.</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 font-semibold text-sm flex items-center gap-2"
            >
              <Upload size={16} />
              Upload Excel
            </button>
            <button
              onClick={() => setShowManualModal(true)}
              className="px-4 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-sm flex items-center gap-2"
            >
              <FileText size={16} />
              Add Manually
            </button>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-blue-600" size={20} />
          <h2 className="text-lg font-semibold text-gray-900">Student Results - Sorted by Performance</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((result) => (
            <ResultCard key={result.id} result={result} onView={handleView} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center text-gray-600">
              <FileText size={48} className="mx-auto text-gray-400 mb-3" />
              <p className="text-lg">No results match the current filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Manual Entry Modal */}
      {showManualModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h3 className="text-lg font-semibold">Add Student Result Manually</h3>
              <button onClick={() => setShowManualModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <XCircle size={20} />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Student Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Arjun Mehta"
                  value={manualForm.studentName}
                  onChange={(e) => setManualForm({ ...manualForm, studentName: e.target.value })}
                  className={inputCls}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Student ID *</label>
                <input
                  type="text"
                  placeholder="e.g., greenField_C10_015"
                  value={manualForm.studentId}
                  onChange={(e) => setManualForm({ ...manualForm, studentId: e.target.value })}
                  className={inputCls}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Exam Title *</label>
                <input
                  type="text"
                  placeholder="e.g., FA, FA2, Annual"
                  value={manualForm.examTitle}
                  onChange={(e) => setManualForm({ ...manualForm, examTitle: e.target.value })}
                  className={inputCls}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Percentage (0-100) *</label>
                  <input
                    type="number"
                    placeholder="e.g., 85"
                    min="0"
                    max="100"
                    value={manualForm.percentage}
                    onChange={(e) => setManualForm({ ...manualForm, percentage: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Class</label>
                  <select
                    value={manualForm.className}
                    onChange={(e) => setManualForm({ ...manualForm, className: e.target.value })}
                    className={inputCls}
                  >
                    <option value="">Select a class...</option>
                    {classes.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Year</label>
                  <input
                    type="number"
                    value={manualForm.year}
                    onChange={(e) => setManualForm({ ...manualForm, year: parseInt(e.target.value) })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Status</label>
                  <select
                    value={manualForm.status}
                    onChange={(e) => setManualForm({ ...manualForm, status: e.target.value })}
                    className={inputCls}
                  >
                    <option value="Pass">Pass</option>
                    <option value="Fail">Fail</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleAddManualResult}
                className="w-full mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold text-sm"
              >
                Add Result
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h3 className="text-lg font-semibold">Upload Exam Results</h3>
              <button onClick={() => { setShowUploadModal(false); setSelectedExam(""); }} className="p-2 hover:bg-gray-100 rounded-lg">
                <XCircle size={20} />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="text-sm font-semibold text-gray-700">Step 1: Select Exam DateSheet</label>
                <select
                  value={selectedExam}
                  onChange={(e) => setSelectedExam(e.target.value)}
                  className={inputCls}
                >
                  <option value="">Choose an exam...</option>
                  {validExamsForResults.map((exam) => (
                    <option key={exam.id} value={exam.id}>
                      {exam.title} ({exam.className})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-600 mt-1">Only exams with subjects and no results shown.</p>
              </div>

              {validExamsForResults.length === 0 && (
                <div className="bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg flex gap-2 text-sm text-amber-800">
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                  <span>No exams available. Create a datesheet with subjects first.</span>
                </div>
              )}

              <div>
                <label className="text-sm font-semibold text-gray-700">Step 2: Download & Fill Template</label>
                <button
                  onClick={handleGenerateTemplate}
                  disabled={!selectedExam}
                  className="w-full mt-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 font-semibold text-sm flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  Generate Excel Template
                </button>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">Step 3: Upload Completed Excel</label>
                <label className="block mt-2 px-4 py-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 font-semibold text-sm text-center cursor-pointer">
                  <Upload size={16} className="inline mr-2" />
                  Choose File
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx"
                    onChange={handleUpload}
                    className="hidden"
                    disabled={!selectedExam}
                  />
                </label>
              </div>

              {uploading && <p className="text-sm text-blue-600 text-center">Validating & uploading...</p>}
              {uploadError && <p className="text-sm text-red-600 text-center">{uploadError}</p>}
            </div>
          </div>
        </div>
      )}
      {showViewModal && selectedResult && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div>
                <h3 className="text-lg font-semibold">{selectedResult.studentName}</h3>
                <p className="text-sm text-gray-600">{selectedResult.studentId}</p>
              </div>
              <button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <XCircle size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-gray-700">
                <div className="flex items-center gap-2"><FileText size={14}/> <span>{selectedResult.examTitle}</span></div>
                <div className="flex items-center gap-2"><Percent size={14}/> <span>{selectedResult.percentage}%</span></div>
                <div className="flex items-center gap-2"><User size={14}/> <span>{selectedResult.className} · {selectedResult.year}</span></div>
                <div className="flex items-center gap-2"><Calendar size={14}/> <span>{formatDate(selectedResult.durationFrom)} – {formatDate(selectedResult.durationTo)}</span></div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[selectedResult.status] || "bg-gray-100 text-gray-700"}`}>
                    {selectedResult.status}
                  </span>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 font-semibold text-sm text-gray-700">Subject-wise Marks</div>
                {selectedResult.subjects && selectedResult.subjects.length > 0 ? (
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-600">
                      <tr>
                        <th className="p-3">Subject</th>
                        <th className="p-3">Theory</th>
                        <th className="p-3">Practical</th>
                        <th className="p-3">Internal</th>
                        <th className="p-3">Max</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedResult.subjects.map((subj) => (
                        <tr key={subj.name} className="border-b last:border-b-0">
                          <td className="p-3 font-semibold text-gray-800">{subj.name}</td>
                          <td className="p-3">{subj.theory ?? "-"}</td>
                          <td className="p-3">{subj.practical ?? "-"}</td>
                          <td className="p-3">{subj.internal ?? "-"}</td>
                          <td className="p-3">{subj.max ?? "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-600">No subject marks available.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
