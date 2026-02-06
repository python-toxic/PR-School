import { useState, useMemo } from "react";
import { MessageSquare, Users, BookOpen, AlertCircle, Calendar, Phone, Mail, Plus, Bell, Settings } from "lucide-react";
import ParentGuardianMessages from "./ParentGuardianMessages.jsx";

const sampleAnnouncements = [
  { id: 1, title: "Parents Meeting", date: "15th Feb 2025", priority: "high", message: "Quarterly parents meeting scheduled", time: "2:00 PM" },
  { id: 2, title: "Exam Schedule Released", date: "10th Feb 2025", priority: "normal", message: "Check academic calendar for exam dates", time: "11:00 AM" },
  { id: 3, title: "School Holiday", date: "26th Jan 2025", priority: "normal", message: "School closed for Republic Day", time: "9:00 AM" },
];

const sampleChildrenData = [
  { id: "c1", name: "Aarav Kumar", class: "Class 5 - A", rollNo: 15, attendance: 92, nextClass: "Math", teacher: "Ms. Priya Sharma" },
  { id: "c2", name: "Aanya Sharma", class: "Class 7 - B", rollNo: 8, attendance: 95, nextClass: "Science", teacher: "Mr. Vikram Singh" },
];

const emergencyContacts = [
  { type: "School", name: "Principal Office", phone: "9876543210" },
  { type: "Clinic", name: "School Clinic", phone: "9876543220" },
  { type: "Transport", name: "Bus In-Charge", phone: "9876543230" },
];

export default function ParentGuardianDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedChild, setSelectedChild] = useState(sampleChildrenData[0]);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  const overallStats = useMemo(() => {
    const avgAttendance =
      sampleChildrenData.reduce((sum, c) => sum + c.attendance, 0) /
      sampleChildrenData.length;
    return {
      totalChildren: sampleChildrenData.length,
      avgAttendance: Math.round(avgAttendance),
      unreadMessages: 4,
      upcomingEvents: sampleAnnouncements.length,
    };
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Parent/Guardian Portal</h1>
            <p className="text-gray-500 mt-1">Manage your child's education and stay connected</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition relative">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <Settings size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 flex gap-8">
          {[
            { id: "overview", label: "Overview", icon: Users },
            { id: "messages", label: "Messages", icon: MessageSquare },
            { id: "academics", label: "Academics", icon: BookOpen },
            { id: "events", label: "Events", icon: Calendar },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-4 py-4 font-medium flex items-center gap-2 border-b-2 transition ${
                activeTab === id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: "Children", value: overallStats.totalChildren, icon: Users, color: "blue" },
                { label: "Avg Attendance", value: `${overallStats.avgAttendance}%`, icon: AlertCircle, color: "green" },
                { label: "Unread Messages", value: overallStats.unreadMessages, icon: MessageSquare, color: "purple" },
                { label: "Upcoming Events", value: overallStats.upcomingEvents, icon: Calendar, color: "orange" },
              ].map(({ label, value, icon: Icon, color }) => (
                <div
                  key={label}
                  className={`bg-${color}-50 border border-${color}-200 rounded-lg p-4`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm text-${color}-600 font-medium`}>{label}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                    </div>
                    <Icon size={24} className={`text-${color}-500`} />
                  </div>
                </div>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Children Info */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Your Children</h2>
                <div className="space-y-3">
                  {sampleChildrenData.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => setSelectedChild(child)}
                      className={`w-full p-4 rounded-lg border-2 transition text-left ${
                        selectedChild?.id === child.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{child.name}</h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                          Roll No: {child.rollNo}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{child.class}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">Attendance</p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${child.attendance}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="font-semibold text-gray-900">{child.attendance}%</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Emergency Contacts */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Emergency Contacts</h2>
                <div className="space-y-3 mb-4">
                  {emergencyContacts.map((contact, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 font-medium uppercase">{contact.type}</p>
                      <p className="text-sm font-semibold text-gray-900 mt-1">{contact.name}</p>
                      <p className="text-sm text-blue-600 mt-1 flex items-center gap-1">
                        <Phone size={14} />
                        {contact.phone}
                      </p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setShowEmergencyModal(true)}
                  className="w-full py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Manage Contacts
                </button>
              </div>
            </div>

            {/* Announcements */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Latest Announcements</h2>
              <div className="space-y-3">
                {sampleAnnouncements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      announcement.priority === "high"
                        ? "border-red-500 bg-red-50"
                        : "border-blue-500 bg-blue-50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{announcement.message}</p>
                        <p className="text-xs text-gray-500 mt-2">{announcement.date} at {announcement.time}</p>
                      </div>
                      {announcement.priority === "high" && (
                        <span className="px-2 py-1 bg-red-200 text-red-700 rounded text-xs font-medium">
                          Important
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === "messages" && <ParentGuardianMessages />}

        {/* Academics Tab */}
        {activeTab === "academics" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Academic Information</h2>
            {selectedChild && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-500">Class</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">{selectedChild.class}</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-500">Class Teacher</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">{selectedChild.teacher}</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-500">Next Class</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">{selectedChild.nextClass}</p>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-3">Subject Performance</p>
                  <div className="space-y-2">
                    {["Mathematics", "English", "Science", "Social Studies"].map((subject, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">{subject}</p>
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${75 + Math.random() * 25}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Events Tab */}
        {activeTab === "events" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Upcoming Events</h2>
            <div className="space-y-4">
              {sampleAnnouncements.map((event) => (
                <div
                  key={event.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <Calendar size={20} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{event.message}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {event.date} at {event.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Emergency Contacts Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Emergency Contacts</h3>
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
              {emergencyContacts.map((contact, idx) => (
                <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                  <p className="text-sm font-semibold text-gray-900">{contact.type}</p>
                  <p className="text-sm text-gray-600 mt-1">{contact.name}</p>
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-sm text-blue-600 hover:text-blue-700 mt-1 block"
                  >
                    {contact.phone}
                  </a>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowEmergencyModal(false)}
              className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
