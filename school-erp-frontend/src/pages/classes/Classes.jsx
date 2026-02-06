import { useEffect, useMemo, useState } from "react";
import { Plus, Users, Hash, Calendar, ClipboardList, BookOpen, X, Clock, Edit2, Trash2, ChevronRight } from "lucide-react";
import { useUser } from "../../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";
import studentsData from "../../data/Teacher/studentRecord.data.js";

// Sample student data for testing
const sampleStudents = [
  { id: "s1", name: "Aarav Kumar", rollNo: 1, classId: "Nursery", section: "A", parentName: "Rajesh Kumar", parentMobile: "9876543210", age: 4, admissionDate: "2024-04-01" },
  { id: "s2", name: "Priya Sharma", rollNo: 2, classId: "Nursery", section: "A", parentName: "Amit Sharma", parentMobile: "9876543211", age: 4, admissionDate: "2024-04-02" },
  { id: "s3", name: "Rohan Singh", rollNo: 1, classId: "KG", section: "A", parentName: "Vikram Singh", parentMobile: "9876543212", age: 5, admissionDate: "2024-04-03" },
  { id: "s4", name: "Ananya Patel", rollNo: 2, classId: "KG", section: "A", parentName: "Suresh Patel", parentMobile: "9876543213", age: 5, admissionDate: "2024-04-04" },
  { id: "s5", name: "Arjun Mehta", rollNo: 1, classId: "1", section: "A", parentName: "Nikhil Mehta", parentMobile: "9876543214", age: 6, admissionDate: "2024-04-05" },
  { id: "s6", name: "Diya Gupta", rollNo: 2, classId: "1", section: "A", parentName: "Ramesh Gupta", parentMobile: "9876543215", age: 6, admissionDate: "2024-04-06" },
  { id: "s7", name: "Kabir Reddy", rollNo: 1, classId: "2", section: "A", parentName: "Mohan Reddy", parentMobile: "9876543216", age: 7, admissionDate: "2024-04-07" },
  { id: "s8", name: "Sana Khan", rollNo: 2, classId: "2", section: "A", parentName: "Salim Khan", parentMobile: "9876543217", age: 7, admissionDate: "2024-04-08" },
  { id: "s9", name: "Vivaan Joshi", rollNo: 1, classId: "3", section: "A", parentName: "Anil Joshi", parentMobile: "9876543218", age: 8, admissionDate: "2024-04-09" },
  { id: "s10", name: "Isha Verma", rollNo: 2, classId: "3", section: "A", parentName: "Deepak Verma", parentMobile: "9876543219", age: 8, admissionDate: "2024-04-10" },
  { id: "s11", name: "Aditya Das", rollNo: 1, classId: "4", section: "A", parentName: "Ravi Das", parentMobile: "9876543220", age: 9, admissionDate: "2024-04-11" },
  { id: "s12", name: "Myra Sen", rollNo: 2, classId: "4", section: "A", parentName: "Soumya Sen", parentMobile: "9876543221", age: 9, admissionDate: "2024-04-12" },
  { id: "s13", name: "Reyansh Bose", rollNo: 1, classId: "5", section: "A", parentName: "Partha Bose", parentMobile: "9876543222", age: 10, admissionDate: "2024-04-13" },
  { id: "s14", name: "Kiara Nair", rollNo: 2, classId: "5", section: "A", parentName: "Sunil Nair", parentMobile: "9876543223", age: 10, admissionDate: "2024-04-14" },
  { id: "s15", name: "Ayaan Iyer", rollNo: 1, classId: "6", section: "A", parentName: "Raman Iyer", parentMobile: "9876543224", age: 11, admissionDate: "2024-04-15" },
  { id: "s16", name: "Sara Ahmed", rollNo: 2, classId: "6", section: "A", parentName: "Imran Ahmed", parentMobile: "9876543225", age: 11, admissionDate: "2024-04-16" },
  { id: "s17", name: "Karan Rao", rollNo: 1, classId: "7", section: "A", parentName: "Krishna Rao", parentMobile: "9876543226", age: 12, admissionDate: "2024-04-17" },
  { id: "s18", name: "Tara Pillai", rollNo: 2, classId: "7", section: "A", parentName: "Gopal Pillai", parentMobile: "9876543227", age: 12, admissionDate: "2024-04-18" },
  { id: "s19", name: "Shaan Desai", rollNo: 1, classId: "8", section: "A", parentName: "Manoj Desai", parentMobile: "9876543228", age: 13, admissionDate: "2024-04-19" },
  { id: "s20", name: "Zara Sinha", rollNo: 2, classId: "8", section: "A", parentName: "Amit Sinha", parentMobile: "9876543229", age: 13, admissionDate: "2024-04-20" },
  { id: "s21", name: "Arnav Ghosh", rollNo: 1, classId: "9", section: "A", parentName: "Tapan Ghosh", parentMobile: "9876543230", age: 14, admissionDate: "2024-04-21" },
  { id: "s22", name: "Naina Roy", rollNo: 2, classId: "9", section: "A", parentName: "Siddharth Roy", parentMobile: "9876543231", age: 14, admissionDate: "2024-04-22" },
  { id: "s23", name: "Vihaan Mishra", rollNo: 1, classId: "10", section: "A", parentName: "Rajesh Mishra", parentMobile: "9876543232", age: 15, admissionDate: "2024-04-23" },
  { id: "s24", name: "Aanya Kapoor", rollNo: 2, classId: "10", section: "A", parentName: "Vinay Kapoor", parentMobile: "9876543233", age: 15, admissionDate: "2024-04-24" },
];

const defaultClasses = [
  "Nursery",
  "KG",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
];

const defaultTimetable = [
  { day: "Monday", periods: ["Math", "English", "Science", "Hindi", "PT", "Art"] },
  { day: "Tuesday", periods: ["English", "Math", "Hindi", "Science", "Music", "Computers"] },
  { day: "Wednesday", periods: ["Science", "Math", "English", "Social", "PT", "Library"] },
  { day: "Thursday", periods: ["Hindi", "English", "Math", "Science", "Art", "Music"] },
  { day: "Friday", periods: ["Math", "Science", "English", "Social", "PT", "Activity"] },
];

export default function ClassesPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [deletingClass, setDeletingClass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newClassData, setNewClassData] = useState({
    name: defaultClasses[0],
    section: "A",
    teacher: "",
    room: "",
    capacity: 30,
    timetable: defaultTimetable
  });
  const isAdminOrTeacher = ["ADMIN", "TEACHER", "SUPER_ADMIN", "SUPER-ADMIN"].includes(user?.role?.toUpperCase());

  // Define proper academic class order (Pre-Nursery to Class 12)
  const classOrder = {
    "Toddler": 1,
    "Toddler B": 1,
    "Toddler C": 1,
    "Toddler D": 1,
    "PlayGroup": 2,
    "PlayGroup A": 2,
    "PlayGroup B": 2,
    "PlayGroup C": 2,
    "PlayGroup D": 2,
    "Pre Nursery": 3,
    "Nursery": 4,
    "Pre Primary (K.G.)": 5,
    "LKG": 6,
    "UKG": 7,
    "1st": 8,
    "Class 1": 8,
    "2nd": 9,
    "Class 2": 9,
    "3rd": 10,
    "Class 3": 10,
    "4th": 11,
    "Class 4": 11,
    "5th": 12,
    "Class 5": 12,
    "6th": 13,
    "Class 6": 13,
    "7th": 14,
    "Class 7": 14,
    "8th": 15,
    "Class 8": 15,
    "9th": 16,
    "Class 9": 16,
    "10th": 17,
    "Class 10": 17,
    "Class 11 - PCM": 18,
    "Class 11 - PCB": 18,
    "Class 11 - Commerce": 18,
    "Class 11 - Arts": 18,
    "Class 12 - PCM": 19,
    "Class 12 - PCB": 19,
    "Class 12 - Commerce": 19,
    "Class 12 - Arts": 19
  };

  // Fetch classes from backend
  const fetchClasses = async () => {
    try {
      setLoading(true);
      
      // Get selected classes from settings
      const savedSettings = localStorage.getItem("school-settings");
      let selectedClasses = [];
      
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings);
          selectedClasses = settings.selectedClasses || [];
        } catch (error) {
          console.error("Error parsing settings:", error);
        }
      }
      
      const response = await fetch("http://localhost:4000/api/classes?schoolId=school-001&isActive=true");
      const data = await response.json();
      
      if (data.success && data.classes.length > 0) {
        // Filter to only show selected classes
        let transformedClasses = data.classes
          .filter((cls) => {
            // Check if this class was selected in settings
            if (selectedClasses.length === 0) return true; // Show all if nothing selected
            return selectedClasses.includes(cls.fullName);
          })
          .map((cls) => ({
            id: cls._id,
            name: cls.name,
            section: cls.section,
            fullName: cls.fullName,
            capacity: cls.capacity,
            strength: 0, // Will be updated when we count students
            teacher: cls.teacher || "",
            room: cls.room || "",
            timetable: defaultTimetable
          }));
        
        setClasses(transformedClasses);
        localStorage.setItem("classes-list", JSON.stringify(transformedClasses));
      } else {
        // Fallback to localStorage if no classes in backend
        loadClassesFromLocalStorage();
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
      // Fallback to localStorage on error
      loadClassesFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  // Load classes from localStorage (fallback)
  const loadClassesFromLocalStorage = () => {
    const savedSettings = localStorage.getItem("school-settings");
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        if (settings.selectedClasses && settings.selectedClasses.length > 0) {
          // Create classes from selected classes in settings
          const classesFromSettings = settings.selectedClasses.map((cls, idx) => ({
            id: `cls-${idx}`,
            name: cls.split(" - ")[0] || cls,
            section: cls.includes(" - ") ? cls.split(" - ")[1] : "A",
            fullName: cls,
            capacity: 30,
            strength: 0,
            teacher: "",
            room: "",
            timetable: defaultTimetable
          }));
          setClasses(classesFromSettings);
          localStorage.setItem("classes-list", JSON.stringify(classesFromSettings));
          return;
        }
      } catch (error) {
        console.error("Error loading from settings:", error);
      }
    }
    
    // Final fallback to default classes
    const saved = localStorage.getItem("classes-list");
    if (saved) {
      setClasses(JSON.parse(saved));
    } else {
      const seeded = defaultClasses.map((c, idx) => ({
        id: `cls-${idx}`,
        name: c,
        section: "A",
        capacity: 30,
        strength: 2,
        teacher: "Ms. Teacher " + (idx + 1),
        room: "Room " + (101 + idx),
        timetable: defaultTimetable
      }));
      setClasses(seeded);
      localStorage.setItem("classes-list", JSON.stringify(seeded));
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    // Listen for updates from settings page
    const handleSettingsUpdate = () => {
      fetchClasses();
    };
    
    const handleClassesUpdate = () => {
      fetchClasses();
    };
    
    window.addEventListener("school-settings-updated", handleSettingsUpdate);
    window.addEventListener("classes-updated", handleClassesUpdate);
    
    return () => {
      window.removeEventListener("school-settings-updated", handleSettingsUpdate);
      window.removeEventListener("classes-updated", handleClassesUpdate);
    };
  }, []);

  useEffect(() => {
    // Only save to localStorage, not to backend here
    if (classes.length > 0 && !loading) {
      localStorage.setItem("classes-list", JSON.stringify(classes));
    }
  }, [classes, loading]);

  const nextSectionForClass = (className) => {
    const used = classes
      .filter((c) => c.name === className)
      .map((c) => c.section);
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    return alphabet.find((s) => !used.includes(s)) || "A";
  };

  const handleCreateClass = (e) => {
    e.preventDefault();
    if (!newClassData.name || !newClassData.section) return;
    
    const id = `${newClassData.name}-${newClassData.section}`;
    const exists = classes.some((c) => c.name === newClassData.name && c.section === newClassData.section);
    if (exists) {
      alert("This class and section already exists.");
      return;
    }
    
    const next = [
      ...classes,
      {
        id,
        ...newClassData,
        strength: 0,
      },
    ];
    setClasses(next);
    setShowCreateModal(false);
    setNewClassData({
      name: defaultClasses[0],
      section: "A",
      teacher: "",
      room: "",
      capacity: 30,
      timetable: defaultTimetable
    });
  };

  const handleEditClass = (cls, e) => {
    e.stopPropagation();
    setEditingClass({ ...cls });
    setShowEditModal(true);
  };

  const handleUpdateClass = (e) => {
    e.preventDefault();
    if (!editingClass) return;
    
    const updated = classes.map((c) => 
      c.id === editingClass.id ? { ...editingClass } : c
    );
    setClasses(updated);
    setShowEditModal(false);
    setEditingClass(null);
    if (selectedClass?.id === editingClass.id) {
      setSelectedClass({ ...editingClass });
    }
  };

  const handleDeleteClass = (cls, e) => {
    e.stopPropagation();
    setDeletingClass(cls);
    setShowDeleteModal(true);
  };

  const confirmDeleteClass = () => {
    if (!deletingClass) return;
    
    const updated = classes.filter((c) => c.id !== deletingClass.id);
    setClasses(updated);
    setShowDeleteModal(false);
    setDeletingClass(null);
    if (selectedClass?.id === deletingClass.id) {
      setSelectedClass(null);
    }
  };

  const sortedClasses = useMemo(() => {
    return [...classes].sort((a, b) => {
      // First sort by class order (Nursery to 10th)
      const orderA = classOrder[a.name] || 999;
      const orderB = classOrder[b.name] || 999;
      
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      
      // Then sort by section (A, B, C, D)
      return a.section.localeCompare(b.section);
    });
  }, [classes]);

  const studentsByClass = useMemo(() => {
    return sampleStudents.reduce((acc, s) => {
      const key = `${s.classId || ""}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(s);
      return acc;
    }, {});
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Classes</h1>
          <p className="text-sm text-gray-500 mt-1">Manage Nursery to 10th</p>
        </div>
        {isAdminOrTeacher && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={18} />
            Create New Class
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading classes...</p>
          </div>
        </div>
      ) : classes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-600 text-lg mb-2">No classes found</p>
          <p className="text-gray-500 text-sm mb-4">Go to Settings to select and create classes</p>
          {isAdminOrTeacher && (
            <button
              onClick={() => navigate("/super-admin/settings")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Go to Settings
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedClasses.map((cls) => (
            <div
              key={cls.id}
              onClick={() => {
                // Store selected class in localStorage and navigate to timetable
              localStorage.setItem("selected-class-timetable", JSON.stringify(cls));
              navigate("/classes/time-table");
            }}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 flex flex-col gap-3 hover:border-blue-400 hover:shadow-xl transition duration-300 transform hover:scale-105 cursor-pointer group relative"
          >
            {isAdminOrTeacher && (
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                  onClick={(e) => handleEditClass(cls, e)}
                  className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition"
                  title="Edit Class"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={(e) => handleDeleteClass(cls, e)}
                  className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition"
                  title="Delete Class"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Class</p>
                  <h2 className="text-xl font-semibold text-gray-900">{cls.name}</h2>
                </div>
                <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm font-medium">
                  <Hash size={16} /> Section {cls.section}
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Users size={16} className="text-gray-500" />
                <span>
                  Strength: <span className="font-semibold">{cls.strength}</span> / {cls.capacity}
                </span>
              </div>

              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-gray-500">
                  <div>Teacher: {cls.teacher || "Not assigned"}</div>
                  <div>Room: {cls.room || "-"}</div>
                </div>
                <div className="flex items-center gap-1 text-blue-600 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                  View Timetable <ChevronRight size={16} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Create Class Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-200 p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <X size={20} />
            </button>

            <h3 className="text-2xl font-bold text-gray-900 mb-6">Create New Class</h3>

            <form onSubmit={handleCreateClass} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                  <select
                    value={newClassData.name}
                    onChange={(e) => setNewClassData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {defaultClasses.map((c) => (
                      <option key={c} value={c}>Class {c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                  <input
                    value={newClassData.section}
                    onChange={(e) => setNewClassData(prev => ({ ...prev, section: e.target.value.toUpperCase() }))}
                    maxLength={1}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="A"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class Teacher</label>
                  <input
                    value={newClassData.teacher}
                    onChange={(e) => setNewClassData(prev => ({ ...prev, teacher: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Teacher Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                  <input
                    value={newClassData.room}
                    onChange={(e) => setNewClassData(prev => ({ ...prev, room: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Room 101"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    value={newClassData.capacity}
                    onChange={(e) => setNewClassData(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timetable (Default)</label>
                <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 text-sm text-gray-700">
                  {defaultTimetable.map((day, idx) => (
                    <div key={idx} className="mb-2">
                      <span className="font-semibold">{day.day}:</span> {day.periods.join(", ")}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Create Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Class Detail Modal */}
      {selectedClass && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-gray-200 p-6 relative max-h-[90vh] overflow-y-auto">
            <div className="absolute top-4 right-4 flex gap-2">
              {isAdminOrTeacher && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClass(selectedClass, e);
                    }}
                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                    title="Edit Class"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClass(selectedClass, e);
                    }}
                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                    title="Delete Class"
                  >
                    <Trash2 size={18} />
                  </button>
                </>
              )}
              <button
                onClick={() => setSelectedClass(null)}
                className="p-2 text-gray-500 hover:text-gray-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-6 flex flex-col gap-2">
              <p className="text-sm text-gray-500">Class Overview</p>
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                Class {selectedClass.name}
                <span className="px-3 py-1 text-sm rounded-full bg-blue-50 text-blue-700 border border-blue-100">Section {selectedClass.section}</span>
              </h3>
              <div className="flex gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-2"><Users size={16} className="text-blue-500"/> Strength: {studentsByClass[selectedClass.name]?.length || 0}/{selectedClass.capacity}</div>
                <div className="flex items-center gap-2"><Calendar size={16} className="text-amber-500"/> Academic Year: 2025-26</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                <p className="text-sm text-gray-500">Class Teacher</p>
                <h4 className="text-lg font-semibold text-gray-900">{selectedClass.teacher || "Not assigned"}</h4>
                <p className="text-sm text-gray-500">Room: {selectedClass.room || "-"}</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                <p className="text-sm text-gray-500">Attendance (avg)</p>
                <h4 className="text-lg font-semibold text-gray-900">{Math.min(100, 75 + Math.floor(Math.random()*15))}%</h4>
                <p className="text-sm text-gray-500">Last 30 days</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                <p className="text-sm text-gray-500">Homework pending</p>
                <h4 className="text-lg font-semibold text-gray-900">{Math.floor(Math.random()*6)} items</h4>
                <p className="text-sm text-gray-500">Based on latest submissions</p>
              </div>
            </div>

            <div className="mb-4 flex items-center gap-3">
              <Clock size={18} className="text-blue-600" />
              <h4 className="text-lg font-semibold text-gray-900">Weekly Timetable</h4>
            </div>
            <div className="mb-6 border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Day</th>
                    {[1,2,3,4,5,6].map(p => (
                      <th key={p} className="px-4 py-2 text-center font-medium text-gray-700">Period {p}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {(selectedClass.timetable || defaultTimetable).map((day, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium text-gray-900">{day.day}</td>
                      {day.periods.map((period, pidx) => (
                        <td key={pidx} className="px-4 py-2 text-center text-gray-700">{period}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mb-4 flex items-center gap-3">
              <ClipboardList size={18} className="text-emerald-600" />
              <h4 className="text-lg font-semibold text-gray-900">Students in Class {selectedClass.name}</h4>
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-xl">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Roll</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Parent</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Mobile</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Admission</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID Card</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(studentsByClass[selectedClass.name] || []).map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-900">{s.rollNo}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{s.name}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{s.parentName}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{s.parentMobile}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">{s.admissionDate || "N/A"}</td>
                      <td className="px-4 py-2 text-sm">
                        <button className="text-blue-600 hover:text-blue-800">Generate</button>
                      </td>
                    </tr>
                  ))}
                  {(studentsByClass[selectedClass.name] || []).length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500">No students found for this class.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Edit Class Modal */}
      {showEditModal && editingClass && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-200 p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setShowEditModal(false);
                setEditingClass(null);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <X size={20} />
            </button>

            <h3 className="text-2xl font-bold text-gray-900 mb-6">Edit Class</h3>

            <form onSubmit={handleUpdateClass} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                  <select
                    value={editingClass.name}
                    onChange={(e) => setEditingClass(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {defaultClasses.map((c) => (
                      <option key={c} value={c}>Class {c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                  <input
                    value={editingClass.section}
                    onChange={(e) => setEditingClass(prev => ({ ...prev, section: e.target.value.toUpperCase() }))}
                    maxLength={1}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="A"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class Teacher</label>
                  <input
                    value={editingClass.teacher}
                    onChange={(e) => setEditingClass(prev => ({ ...prev, teacher: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Teacher Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                  <input
                    value={editingClass.room}
                    onChange={(e) => setEditingClass(prev => ({ ...prev, room: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Room 101"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    value={editingClass.capacity}
                    onChange={(e) => setEditingClass(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Strength</label>
                  <input
                    type="number"
                    value={editingClass.strength}
                    onChange={(e) => setEditingClass(prev => ({ ...prev, strength: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingClass(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Update Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingClass && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 p-6 relative">
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setDeletingClass(null);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <Trash2 size={24} className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Delete Class</h3>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-semibold">Class {deletingClass.name} - Section {deletingClass.section}</span>? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingClass(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteClass}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
