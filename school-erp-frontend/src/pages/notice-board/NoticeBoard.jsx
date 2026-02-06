import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useNotifications } from "../../context/NotificationContext";
import { Bell, Plus, X, Calendar, User, Trash2, Edit2, Pin, Search } from "lucide-react";

const inputCls = "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm";

export default function NoticeBoard() {
  const { user } = useUser();
  const { addNotification, markByReference } = useNotifications();
  const { noticeId } = useParams();
  const [notices, setNotices] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPinned, setFilterPinned] = useState(false);
  const [focusedId, setFocusedId] = useState(noticeId || "");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "normal",
    imageUrl: "",
  });

  // Check if user can add/edit notices (Admin, Teacher with permission)
  const canManageNotices = 
    user?.role?.toUpperCase() === "ADMIN" || 
    user?.role?.toUpperCase() === "SUPER_ADMIN" ||
    (user?.role?.toUpperCase() === "TEACHER" && user?.permissions?.canNotice);

  // Load notices from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("notice-board");
    if (saved) {
      setNotices(JSON.parse(saved));
    }
  }, []);

  // Save notices to localStorage
  useEffect(() => {
    if (notices.length > 0) {
      localStorage.setItem("notice-board", JSON.stringify(notices));
    }
  }, [notices]);

  // When navigated with a noticeId, highlight and scroll that card and mark related notifications
  useEffect(() => {
    if (!noticeId) return;
    setFocusedId(noticeId);
    markByReference(noticeId, "notice");
    const timer = setTimeout(() => {
      const target = document.getElementById(`notice-${noticeId}`);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [noticeId, markByReference]);

  const handleAddNotice = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      alert("Please fill in all fields");
      return;
    }

    const newNotice = {
      id: Date.now().toString(),
      title: formData.title,
      content: formData.content,
      priority: formData.priority,
      imageUrl: formData.imageUrl,
      author: user?.name || "Admin",
      authorRole: user?.role || "admin",
      date: new Date().toISOString(),
      pinned: false,
    };

    setNotices([newNotice, ...notices]);
    setFormData({ title: "", content: "", priority: "normal", imageUrl: "" });
    setShowAddModal(false);

    // Surface this notice in the global notification bell
    addNotification({
      type: "notice",
      title: formData.title,
      message: formData.content,
      sender: newNotice.author,
      priority: formData.priority,
      referenceId: newNotice.id,
      persistent: true,
    });
  };

  const handleDeleteNotice = (id) => {
    if (window.confirm("Are you sure you want to delete this notice?")) {
      setNotices(notices.filter((n) => n.id !== id));
    }
  };

  const handleTogglePin = (id) => {
    setNotices(
      notices.map((n) =>
        n.id === id ? { ...n, pinned: !n.pinned } : n
      )
    );
  };

  // Filter and sort notices
  const filteredNotices = notices
    .filter((notice) => {
      const matchesSearch =
        notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notice.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notice.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPinned = filterPinned ? notice.pinned : true;
      return matchesSearch && matchesPinned;
    })
    .sort((a, b) => {
      // Pinned notices first
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      // Then by date
      return new Date(b.date) - new Date(a.date);
    });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-blue-100 text-blue-800 border-blue-300";
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="transform transition-all duration-300 hover:scale-105">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
              <Bell className="text-white animate-pulse" size={32} />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Notice Board
            </span>
          </h1>
          <p className="text-gray-600 mt-2 ml-1">
            Important announcements and updates
          </p>
        </div>
        {canManageNotices && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1"
          >
            <Plus size={20} />
            <span className="font-semibold">Add New Notice</span>
          </button>
        )}
      </div>

      {/* Search and Filter */}
      <div className="bg-gradient-to-r from-white to-gray-50 rounded-xl shadow-lg p-5 space-y-4 border border-gray-200 transform transition-all duration-300 hover:shadow-xl">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"
            />
            <input
              type="text"
              placeholder="Search notices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
            />
          </div>
          <button
            onClick={() => setFilterPinned(!filterPinned)}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105 ${
              filterPinned
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                : "bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-400"
            }`}
          >
            <Pin size={18} className={filterPinned ? "animate-bounce" : ""} />
            {filterPinned ? "Show All" : "Pinned Only"}
          </button>
        </div>
      </div>

      {/* Notices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotices.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-md animate-fade-in">
            <Bell size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">
              {searchQuery || filterPinned
                ? "No notices found matching your criteria"
                : "No notices posted yet"}
            </p>
          </div>
        ) : (
          filteredNotices.map((notice, index) => (
            <div
              key={notice.id}
              id={`notice-${notice.id}`}
              className={`bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-3 animate-slide-up relative ${
                notice.pinned ? "ring-4 ring-yellow-300" : ""
              } ${focusedId === notice.id ? "ring-2 ring-blue-400" : ""}`}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Priority Badge - Top Right Corner */}
              <div className="absolute top-4 right-4 z-10">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm ${getPriorityColor(
                    notice.priority
                  )}`}
                >
                  {notice.priority.charAt(0).toUpperCase() + notice.priority.slice(1)}
                </span>
              </div>

              {/* Image Section */}
              <div className="relative h-48 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 overflow-hidden">
                {notice.imageUrl ? (
                  <img
                    src={notice.imageUrl}
                    alt={notice.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Bell size={64} className="text-white opacity-30" />
                  </div>
                )}
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                
                {/* Pinned Badge */}
                {notice.pinned && (
                  <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full flex items-center gap-1 font-bold text-xs shadow-lg animate-bounce">
                    <Pin size={14} className="fill-yellow-900" />
                    Pinned
                  </div>
                )}
              </div>

              {/* Notice Header */}
              <div className="p-5 bg-gradient-to-b from-gray-50 to-white">
                <h3 className="font-bold text-gray-800 text-xl mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {notice.title}
                </h3>
                <div className="flex flex-wrap gap-2 items-center text-xs">
                  <span className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                    <User size={14} />
                    {notice.author}
                  </span>
                  <span className="flex items-center gap-1 bg-gray-200 text-gray-700 px-3 py-1 rounded-full font-medium">
                    <Calendar size={14} />
                    {formatDate(notice.date)}
                  </span>
                </div>
              </div>

              {/* Notice Content */}
              <div className="px-5 pb-5">
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap line-clamp-4">
                  {notice.content}
                </p>
              </div>

              {/* White Bottom Rectangle - Actions */}
              {canManageNotices && (
                <div className="bg-white border-t-2 border-gray-100 p-5 mt-2">
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleTogglePin(notice.id)}
                      className={`flex-1 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105 shadow-md hover:shadow-lg ${
                        notice.pinned
                          ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white"
                          : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-yellow-100 hover:to-yellow-200 hover:text-yellow-700"
                      }`}
                    >
                      <Pin size={18} className={notice.pinned ? "animate-pulse" : ""} />
                      {notice.pinned ? "Unpin" : "Pin This"}
                    </button>
                    <button
                      onClick={() => handleDeleteNotice(notice.id)}
                      className="px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-semibold"
                    >
                      <Trash2 size={18} />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Notice Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform animate-slide-up">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-xl">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Bell size={24} />
                Add New Notice
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({ title: "", content: "", priority: "normal", imageUrl: "" });
                }}
                className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleAddNotice} className="p-6 space-y-5">
              {/* Title */}
              <div className="transform transition-all duration-200 hover:scale-[1.01]">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notice Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter notice title..."
                  className={`${inputCls} transition-all duration-200 focus:scale-[1.01]`}
                  required
                />
              </div>

              {/* Image URL */}
              <div className="transform transition-all duration-200 hover:scale-[1.01]">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Image URL (Optional)
                </label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                  className={`${inputCls} transition-all duration-200 focus:scale-[1.01]`}
                />
                <p className="text-xs text-gray-500 mt-1">Add an image to make your notice stand out!</p>
              </div>

              {/* Priority */}
              <div className="transform transition-all duration-200 hover:scale-[1.01]">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Priority Level
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                  className={`${inputCls} transition-all duration-200 focus:scale-[1.01]`}
                >
                  <option value="normal">Normal 📘</option>
                  <option value="medium">Medium ⚠️</option>
                  <option value="high">High 🚨</option>
                </select>
              </div>

              {/* Content */}
              <div className="transform transition-all duration-200 hover:scale-[1.01]">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notice Content *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Enter notice details..."
                  rows={6}
                  className={`${inputCls} transition-all duration-200 focus:scale-[1.01]`}
                  required
                />
                <p className="text-xs text-gray-500 mt-2 flex items-center justify-between">
                  <span>{formData.content.length} characters</span>
                  <span className="text-blue-600 font-medium">
                    {formData.content.length > 100 ? "Great detail! 🎯" : ""}
                  </span>
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({ title: "", content: "", priority: "normal", imageUrl: "" });
                  }}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium transform hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Plus size={20} />
                  Add Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
