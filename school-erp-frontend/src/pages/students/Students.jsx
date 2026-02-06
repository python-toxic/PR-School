import { useState, useMemo, useEffect } from "react";
import { Search, Filter, Download, UserPlus, Trash2, Calendar, AlertCircle, X, Eye, User, Phone, MapPin, BookOpen, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import teacherData from "../../data/Teacher/attendance.data.js";
import students from "../../data/Teacher/studentRecord.data.js";
import { getStudentsForClass } from "../../services/Teachers/student.service.js";
import { useUser } from "../../context/UserContext.jsx";

export default function StudentsPage() {
  const { user } = useUser();
  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || 'http://localhost:4000';
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [activeTab, setActiveTab] = useState("current");
  const [removedStudents, setRemovedStudents] = useState([]);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [removingStudent, setRemovingStudent] = useState(null);
  const [removeReason, setRemoveReason] = useState("");
  const [removeRemarks, setRemoveRemarks] = useState("");

  const isAdmin = ["ADMIN", "SUPER-ADMIN"].includes(user?.role?.toUpperCase());
  const classId = teacherData.classTeacherOf;
  
  const [studentsList, setStudentsList] = useState([]);
  
  // Load students from backend, fallback to localStorage
  useEffect(() => {
    const loadStudents = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/students`, {
          headers: {
            Authorization: `Bearer ${user?.token || localStorage.getItem('token') || ''}`
          }
        });
        const json = await res.json();
        if (json?.success && Array.isArray(json.students)) {
          const adapted = json.students.map((s, idx) => ({
            id: s._id,
            rollNo: idx + 1,
            name: s.name,
            age: s.dob ? new Date().getFullYear() - new Date(s.dob).getFullYear() : 0,
            classId: s.classId || 'Unassigned',
            parentName: s.parentId?.name || 'N/A',
            parentMobile: s.mobile || s.parentId?.mobile || 'N/A',
            address: [s.address, s.city].filter(Boolean).join(' ') || 'N/A',
            gender: s.gender || 'N/A',
            caste: s.socialCategory || 'N/A',
            attendancePercentage: 0,
            admissionNumber: s.studentId || 'N/A',
            username: '',
            password: '',
            dob: s.dob,
            bloodGroup: s.bloodGroup,
            email: s.parentId?.email || '',
            status: s.status || 'active'
          }));
          setStudentsList(adapted);
        } else {
          const savedStudents = JSON.parse(localStorage.getItem("students-list") || "null");
          setStudentsList(savedStudents || students);
        }
      } catch (err) {
        console.error('Failed to load students from backend:', err);
        const savedStudents = JSON.parse(localStorage.getItem("students-list") || "null");
        setStudentsList(savedStudents || students);
      }

      const removed = JSON.parse(localStorage.getItem("removedStudents") || "[]");
      setRemovedStudents(removed);
    };
    loadStudents();
  }, [API_BASE, user?.token]);

  // Save students to localStorage whenever it changes
  useEffect(() => {
    if (studentsList.length > 0) {
      localStorage.setItem("students-list", JSON.stringify(studentsList));
    }
  }, [studentsList]);

  // Update student data with status
  const allStudents = useMemo(() => {
    const baseStudents = isAdmin ? studentsList : getStudentsForClass(studentsList, classId);
    return baseStudents.map(student => ({
      ...student,
      status: removedStudents.some(r => r.id === student.id) ? 'former' : 'active'
    }));
  }, [isAdmin, classId, removedStudents, studentsList]);
  
  const classes = useMemo(() => {
    const uniqueClasses = [...new Set(allStudents.map(s => s.classId))];
    return uniqueClasses.sort();
  }, [allStudents]);

  const filteredStudents = useMemo(() => {
    const tabFilter = activeTab === 'current' 
      ? s => s.status === 'active'
      : s => s.status === 'former';

    return allStudents.filter(student => {
      const matchesSearch = 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.rollNo.toString().includes(searchQuery) ||
        student.parentMobile.includes(searchQuery);
      
      const matchesClass = selectedClass === "all" || student.classId === selectedClass;
      const matchesGender = selectedGender === "all" || student.gender === selectedGender;
      
      return matchesSearch && matchesClass && matchesGender && tabFilter(student);
    });
  }, [allStudents, searchQuery, selectedClass, selectedGender, activeTab]);

  const studentsByClass = useMemo(() => {
    return filteredStudents.reduce((acc, student) => {
      const cls = student.classId || "Unassigned";
      if (!acc[cls]) acc[cls] = [];
      acc[cls].push(student);
      return acc;
    }, {});
  }, [filteredStudents]);

  // Handle removing a student (archive to past students)
  const handleRemoveStudent = () => {
    if (!removingStudent || !removeReason.trim()) {
      alert("Please select a reason for removal");
      return;
    }

    const archivedStudent = {
      ...removingStudent,
      leavingDate: new Date().toLocaleDateString('en-GB'),
      reason: removeReason,
      remarks: removeRemarks,
      removedAt: new Date().toISOString(),
      status: 'former'
    };

    setRemovedStudents(prev => [...prev, archivedStudent]);
    localStorage.setItem("removedStudents", JSON.stringify([...removedStudents, archivedStudent]));
    
    // Remove from current students list
    const updatedStudents = studentsList.filter(s => s.id !== removingStudent.id);
    setStudentsList(updatedStudents);
    localStorage.setItem("students-list", JSON.stringify(updatedStudents));

    setShowRemoveModal(false);
    setRemovingStudent(null);
    setRemoveReason("");
    setRemoveRemarks("");
  };

  // Handle restoring a student from past students
  const handleRestoreStudent = (student) => {
    if (window.confirm(`Restore ${student.name} to current students?`)) {
      const restoredStudent = { ...student };
      delete restoredStudent.leavingDate;
      delete restoredStudent.reason;
      delete restoredStudent.remarks;
      delete restoredStudent.removedAt;
      delete restoredStudent.status;

      setStudentsList(prev => [...prev, restoredStudent]);
      localStorage.setItem("students-list", JSON.stringify([...studentsList, restoredStudent]));

      setRemovedStudents(prev => prev.filter(s => s.id !== student.id));
      localStorage.setItem("removedStudents", JSON.stringify(removedStudents.filter(s => s.id !== student.id)));
    }
  };

  // View Modal Component
  const ViewStudentModal = () => {
    if (!viewingStudent) return null;

    const initials = viewingStudent.name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-xl font-bold text-blue-600">
                {initials}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{viewingStudent.name}</h2>
                <p className="text-blue-100">Roll No: {viewingStudent.rollNo}</p>
              </div>
            </div>
            <button
              onClick={() => setViewingStudent(null)}
              className="text-white hover:bg-blue-700 p-2 rounded-lg transition"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Personal Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <User size={18} className="text-blue-600" />
                  Personal Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-500">Age</p>
                    <p className="font-medium text-gray-900">{viewingStudent.age} years</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Gender</p>
                    <p className="font-medium text-gray-900">{viewingStudent.gender || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Caste</p>
                    <p className="font-medium text-gray-900">{viewingStudent.caste || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Date of Birth</p>
                    <p className="font-medium text-gray-900">{viewingStudent.dob || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Blood Group</p>
                    <p className="font-medium text-gray-900">{viewingStudent.bloodGroup || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Phone size={18} className="text-green-600" />
                  Contact Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-500">Parent Name</p>
                    <p className="font-medium text-gray-900">{viewingStudent.parentName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Parent Mobile</p>
                    <p className="font-medium text-gray-900">{viewingStudent.parentMobile}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{viewingStudent.email || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Admission Number</p>
                    <p className="font-medium text-gray-900">{viewingStudent.admissionNumber || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <BookOpen size={18} className="text-purple-600" />
                  Academic Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-500">Class</p>
                    <p className="font-medium text-gray-900">{viewingStudent.classId}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Admission Date</p>
                    <p className="font-medium text-gray-900">{viewingStudent.admissionDate || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status</p>
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                      {viewingStudent.status === "active" ? "Active" : "Former"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Attendance */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Award size={18} className="text-orange-600" />
                  Performance
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-500">Attendance</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            viewingStudent.attendancePercentage >= 75
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                          style={{
                            width: `${viewingStudent.attendancePercentage}%`
                          }}
                        />
                      </div>
                      <span className="font-medium text-gray-900 w-12 text-right">
                        {viewingStudent.attendancePercentage}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            {viewingStudent.address && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin size={18} className="text-red-600" />
                  Address
                </h3>
                <p className="text-sm text-gray-700">{viewingStudent.address}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3 justify-end">
            <button
              onClick={() => setViewingStudent(null)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Remove Student Modal Component
  const RemoveStudentModal = () => {
    if (!showRemoveModal || !removingStudent) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Remove Student</h2>
            <button
              onClick={() => {
                setShowRemoveModal(false);
                setRemovingStudent(null);
                setRemoveReason("");
                setRemoveRemarks("");
              }}
              className="text-white hover:bg-red-700 p-1 rounded transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                <strong>Student:</strong> {removingStudent.name} (Roll No: {removingStudent.rollNo})
              </p>
              <p className="text-sm text-red-700 mt-2">
                This student will be moved to "Past Students" archive.
              </p>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Reason for Removal <span className="text-red-500">*</span>
              </label>
              <select
                value={removeReason}
                onChange={(e) => setRemoveReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select a reason</option>
                <option value="Promotion">Promotion to Higher Class</option>
                <option value="Transfer">Transfer to Another School</option>
                <option value="Dropout">Dropout</option>
                <option value="Medical Leave">Medical Leave</option>
                <option value="Relocation">Relocation</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Remarks */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Remarks (Optional)
              </label>
              <textarea
                value={removeRemarks}
                onChange={(e) => setRemoveRemarks(e.target.value)}
                placeholder="Add any additional notes..."
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3 justify-end">
            <button
              onClick={() => {
                setShowRemoveModal(false);
                setRemovingStudent(null);
                setRemoveReason("");
                setRemoveRemarks("");
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleRemoveStudent}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
            >
              Remove Student
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filteredStudents.length} {activeTab === 'current' ? 'current' : 'past'} students found
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            <Download size={18} />
            Export
          </button>
          {isAdmin && activeTab === 'current' && (
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              <UserPlus size={18} />
              Add Student
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("current")}
            className={`flex-1 px-6 py-4 font-medium transition ${
              activeTab === "current"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Current Students
            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {allStudents.filter(s => s.status === 'active').length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("former")}
            className={`flex-1 px-6 py-4 font-medium transition ${
              activeTab === "former"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Past Students
            <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
              {removedStudents.length}
            </span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, roll no, or mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {(isAdmin || activeTab === 'current') && (
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Classes</option>
              {[...new Set(allStudents.map(s => s.classId))].sort().map(cls => (
                <option key={cls} value={cls}>Class {cls}</option>
              ))}
            </select>
          )}

          {activeTab === 'current' && (
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {activeTab === 'current' ? (
          Object.keys(studentsByClass).sort().map(classId => (
            <div key={classId} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3">
                <h2 className="text-lg font-semibold text-white">
                  Class {classId} • {studentsByClass[classId].length} Students
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {studentsByClass[classId].map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                          {student.rollNo}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="font-medium text-gray-900">{student.name}</div>
                          <div className="text-gray-500 text-xs">{student.caste}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{student.age}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{student.parentName}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{student.parentMobile}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            student.attendancePercentage >= 75
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {student.attendancePercentage}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm space-x-2">
                          <button
                            onClick={() => setViewingStudent(student)}
                            className="inline-flex items-center gap-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition font-medium"
                          >
                            <Eye size={16} />
                            View
                          </button>
                          <button
                            onClick={() => {
                              setRemovingStudent(student);
                              setShowRemoveModal(true);
                            }}
                            className="ml-2 inline-flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                          >
                            <Trash2 size={14} />
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        ) : (
          // Past Students View
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-3">
              <h2 className="text-lg font-semibold text-white">
                Past Students • {filteredStudents.length} Students
              </h2>
            </div>

            {filteredStudents.length === 0 ? (
              <div className="p-12 text-center">
                <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600">No past students found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leaving Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredStudents.map((student) => {
                      const pastRecord = removedStudents.find(r => r.id === student.id);
                      return (
                        <tr key={student.id} className="hover:bg-red-50 transition border-l-4 border-l-red-500">
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                            {student.rollNo}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="font-medium text-gray-900">{student.name}</div>
                            <div className="text-gray-500 text-xs">View Only</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{student.classId}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            <div className="flex items-center gap-2">
                              <Calendar size={14} className="text-gray-400" />
                              {pastRecord?.leavingDate}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{pastRecord?.reason}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{pastRecord?.remarks}</td>
                          <td className="px-6 py-4 text-sm space-x-2">
                            <button
                              onClick={() => setViewingStudent(student)}
                              className="inline-flex items-center gap-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition font-medium"
                            >
                              <Eye size={16} />
                              View
                            </button>
                            {isAdmin && (
                              <button
                                onClick={() => handleRestoreStudent(student)}
                                className="inline-flex items-center gap-1 px-3 py-1 text-green-600 hover:bg-green-50 rounded-lg transition font-medium"
                              >
                                <UserPlus size={16} />
                                Restore
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {filteredStudents.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Filter size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Modals */}
      <ViewStudentModal />
      <RemoveStudentModal />
    </div>
  );
}
