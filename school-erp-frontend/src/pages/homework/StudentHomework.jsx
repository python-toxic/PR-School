import { useEffect, useMemo, useState } from "react";
import HomeworkCard from "../../components/Students/HomeworkCard.jsx";
// Inline add form for class-specific homework
import { fakeHomework } from "../../data/Student/homework.data.js";
import { useUser } from "../../context/UserContext.jsx";
import { useNotifications } from "../../context/NotificationContext.jsx";

const role = "student";

export default function StudentHomework() {
  const { user } = useUser();
  const { addNotification } = useNotifications();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [teacherDrafts, setTeacherDrafts] = useState([]);
  const [newHw, setNewHw] = useState({
    title: "",
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
    description: "",
  });

  useEffect(() => {
    const savedClasses = localStorage.getItem("classes-list");
    if (savedClasses) setClasses(JSON.parse(savedClasses));
  }, []);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  // Load class-specific homeworks from localStorage for the current student
  const studentClass = (user?.class || user?.className || "").trim();
  const classHomeworks = useMemo(() => {
    const raw = localStorage.getItem("class-homeworks");
    if (!raw) return [];
    const map = JSON.parse(raw);
    const list = map[studentClass] || [];
    return list.map((hw) => ({
      id: hw.id,
      subject: hw.subject || "",
      title: hw.title,
      description: hw.description,
      // Map to HomeworkCard fields
      dueDate: hw.endDate,
      fileUrl: hw.fileUrl || "",
      submitted: false,
    }));
  }, [user]);

  const allHomeworks = useMemo(() => [...classHomeworks, ...fakeHomework], [classHomeworks]);

  const currentHomeworks = useMemo(
    () => allHomeworks.filter((hw) => hw.dueDate && hw.dueDate >= today),
    [allHomeworks, today]
  );

  const historyHomeworks = useMemo(
    () => allHomeworks.filter((hw) => hw.dueDate && hw.dueDate < today),
    [allHomeworks, today]
  );

  const canAddHomework = ["TEACHER", "ADMIN", "SUPER_ADMIN"].includes(
    (user?.role || "").toUpperCase()
  );

  const handleAddHomework = (e) => {
    e.preventDefault();
    if (!selectedClass || !newHw.title || !newHw.startDate || !newHw.endDate || !newHw.description) {
      alert("Please select class and fill all fields");
      return;
    }
    const raw = localStorage.getItem("class-homeworks");
    const map = raw ? JSON.parse(raw) : {};
    const entry = {
      id: Date.now(),
      class: selectedClass,
      title: newHw.title,
      description: newHw.description,
      startDate: newHw.startDate,
      endDate: newHw.endDate,
    };
    const list = map[selectedClass] || [];
    map[selectedClass] = [entry, ...list];
    localStorage.setItem("class-homeworks", JSON.stringify(map));

    // Notify all students in the selected class
    const savedStudents = localStorage.getItem("admitted-students");
    if (savedStudents) {
      try {
        const parsed = JSON.parse(savedStudents);
        const recipients = parsed.filter((s) => (s.class || "") === selectedClass);
        const senderName = user?.name || "Teacher";
        recipients.forEach((s) => {
          addNotification({
            type: "homework",
            title: `New Homework: ${newHw.title}`,
            message: `${selectedClass} | ${newHw.startDate} → ${newHw.endDate}\n${newHw.description}`,
            sender: senderName,
            recipientId: s.rollNo || s.id || s.email || s.phone || Math.random().toString(36).slice(2),
            recipientRole: "student",
            persistent: true,
          });
        });
      } catch {}
    }

    setShowAddModal(false);
    setNewHw({ title: "", startDate: newHw.startDate, endDate: newHw.endDate, description: "" });
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="transform transition-all duration-300 hover:scale-105">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-2 rounded-xl shadow-lg">📘</span>
            <span className="bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
              Student Homework
            </span>
          </h1>
          <p className="text-gray-600 mt-2 ml-1">Manage and view homework</p>
        </div>
      </div>

      {/* Three Beautiful Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Add Homework */}
        <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
          <div className="relative h-28 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="absolute bottom-3 left-4 text-white font-bold text-lg">Add Homework</div>
          </div>
          <div className="p-5 space-y-3">
            <p className="text-gray-700 text-sm">Click & select class to add homeworks</p>
            <button
              onClick={() => canAddHomework && setShowAddModal(true)}
              className={`w-full px-4 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2 ${
                canAddHomework
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
                  : "bg-gray-100 text-gray-500 cursor-not-allowed"
              }`}
            >
              {canAddHomework ? "Select Class" : "Teachers Only"}
            </button>
          </div>
        </div>

        {/* Current Homeworks */}
        <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
          <div className="relative h-28 bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="absolute bottom-3 left-4 text-white font-bold text-lg">Current Homeworks</div>
          </div>
          <div className="p-5 space-y-3">
            <p className="text-gray-700 text-sm">View active and upcoming assignments</p>
            <button
              onClick={() => setShowCurrent((s) => !s)}
              className="w-full px-4 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
            >
              {showCurrent ? "Hide" : "View"}
            </button>
          </div>
        </div>

        {/* Homework History */}
        <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
          <div className="relative h-28 bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-600">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="absolute bottom-3 left-4 text-white font-bold text-lg">Homework History</div>
          </div>
          <div className="p-5 space-y-3">
            <p className="text-gray-700 text-sm">View submitted and past-due work</p>
            <button
              onClick={() => setShowHistory((s) => !s)}
              className="w-full px-4 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700"
            >
              {showHistory ? "Hide" : "View"}
            </button>
          </div>
        </div>
      </div>

      {/* Sections */}
      {showCurrent && (
        <div className="space-y-4 animate-fade-in">
          <h2 className="text-xl font-bold text-gray-800">Active Assignments</h2>
          <div className="grid gap-4">
            {currentHomeworks.map((hw) => (
              <HomeworkCard key={hw.id} homework={hw} role={role} />
            ))}
          </div>
        </div>
      )}

      {showHistory && (
        <div className="space-y-4 animate-fade-in">
          <h2 className="text-xl font-bold text-gray-800">Previous Assignments</h2>
          <div className="grid gap-4">
            {historyHomeworks.map((hw) => (
              <HomeworkCard key={hw.id} homework={hw} role={role} />
            ))}
          </div>
        </div>
      )}

      {/* Add Homework Modal (Teachers/Admins only) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform animate-slide-up">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-xl">
              <h2 className="text-xl font-bold">Select Class to Add Homework</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200"
              >
                ✖
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                >
                  <option value="">Select a class</option>
                  {classes.map((c) => (
                    <option key={`${c.name}-${c.section}`} value={`${c.name} - ${c.section}`}>
                      {c.name} - {c.section}
                    </option>
                  ))}
                </select>
              </div>

              {selectedClass && (
                <form onSubmit={handleAddHomework} className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-800">Add Homework for {selectedClass}</h3>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={newHw.title}
                      onChange={(e) => setNewHw({ ...newHw, title: e.target.value })}
                      placeholder="Maths homework etc"
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                      <input
                        type="date"
                        value={newHw.startDate}
                        onChange={(e) => setNewHw({ ...newHw, startDate: e.target.value })}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                      <input
                        type="date"
                        value={newHw.endDate}
                        onChange={(e) => setNewHw({ ...newHw, endDate: e.target.value })}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    <textarea
                      value={newHw.description}
                      onChange={(e) => setNewHw({ ...newHw, description: e.target.value })}
                      rows={5}
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                      required
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium">Cancel</button>
                    <button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition font-medium">Add Homework</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
