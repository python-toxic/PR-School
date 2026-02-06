import { useState, useEffect, useMemo } from "react";
import { useUser } from "../../context/UserContext";
import {
  Video,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Search,
  Calendar,
  Clock,
  User as UserIcon,
  Link as LinkIcon,
  FileText,
  Download,
  X,
} from "lucide-react";

const inputCls = "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm";

const platforms = ["Google Meet", "Zoom", "Microsoft Teams", "WebEx", "Other"];

const statusColors = {
  Scheduled: "bg-blue-100 text-blue-800 border-blue-300",
  Live: "bg-green-100 text-green-800 border-green-300",
  Completed: "bg-gray-100 text-gray-800 border-gray-300",
  Cancelled: "bg-red-100 text-red-800 border-red-300",
};

export default function OnlineClasses() {
  const { user } = useUser();
  const [classes, setClasses] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    platform: "Google Meet",
    meetingUrl: "",
    meetingId: "",
    password: "",
    date: "",
    time: "",
    class: "",
    subject: "",
    teacher: "",
    status: "Scheduled",
    materials: [],
  });

  const [materialForm, setMaterialForm] = useState({
    title: "",
    type: "Document",
    description: "",
    filePath: "",
  });

  const canManage = ["ADMIN", "SUPER_ADMIN", "TEACHER"].includes(user?.role?.toUpperCase());

  useEffect(() => {
    const saved = localStorage.getItem("online-classes");
    if (saved) {
      setClasses(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (classes.length > 0) {
      localStorage.setItem("online-classes", JSON.stringify(classes));
    }
  }, [classes]);

  const filteredClasses = useMemo(() => {
    return classes
      .filter((cls) => {
        const query = searchQuery.toLowerCase();
        return (
          cls.title.toLowerCase().includes(query) ||
          cls.platform.toLowerCase().includes(query) ||
          cls.teacher.toLowerCase().includes(query) ||
          cls.class.toLowerCase().includes(query) ||
          cls.subject.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => new Date(`${b.date} ${b.time}`) - new Date(`${a.date} ${a.time}`));
  }, [classes, searchQuery]);

  const handleAddClass = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.time) {
      alert("Please fill in required fields");
      return;
    }

    const newClass = {
      id: Date.now().toString(),
      ...formData,
      teacher: formData.teacher || user?.name || "Unknown",
      createdAt: new Date().toISOString(),
    };

    setClasses([newClass, ...classes]);
    resetForm();
    setShowAddModal(false);
  };

  const handleDeleteClass = (id) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      setClasses(classes.filter((c) => c.id !== id));
    }
  };

  const handleAddMaterial = () => {
    if (!materialForm.title || !materialForm.filePath) {
      alert("Please fill in material title and file path");
      return;
    }

    setFormData({
      ...formData,
      materials: [
        ...formData.materials,
        { ...materialForm, id: Date.now().toString() },
      ],
    });

    setMaterialForm({
      title: "",
      type: "Document",
      description: "",
      filePath: "",
    });
  };

  const handleRemoveMaterial = (materialId) => {
    setFormData({
      ...formData,
      materials: formData.materials.filter((m) => m.id !== materialId),
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      platform: "Google Meet",
      meetingUrl: "",
      meetingId: "",
      password: "",
      date: "",
      time: "",
      class: "",
      subject: "",
      teacher: "",
      status: "Scheduled",
      materials: [],
    });
    setMaterialForm({
      title: "",
      type: "Document",
      description: "",
      filePath: "",
    });
  };

  const handleViewClass = (cls) => {
    setSelectedClass(cls);
    setShowViewModal(true);
  };

  const formatDateTime = (date, time) => {
    return `${new Date(date).toLocaleDateString("en-GB")} | ${time}`;
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-xl shadow-lg">
              <Video className="text-white" size={32} />
            </div>
            <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              Online Classes
            </span>
          </h1>
          <p className="text-gray-600 mt-2">
            This page shows all online classes in your school that you have permission to manage.
          </p>
        </div>
        {canManage && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus size={20} />
            <span className="font-semibold">Create Online Class</span>
          </button>
        )}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by title, platform, teacher, class, or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold">{filteredClasses.length}</span> of{" "}
          <span className="font-semibold">{classes.length}</span> items.
        </p>
      </div>

      {/* Classes Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-50 to-purple-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Class Title
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Platform
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Teacher/Presenter
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredClasses.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <Video size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 text-lg">No online classes found</p>
                  </td>
                </tr>
              ) : (
                filteredClasses.map((cls) => (
                  <tr key={cls.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{cls.title}</p>
                      {cls.class && (
                        <p className="text-xs text-gray-500 mt-1">Class: {cls.class}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                        <Video size={14} />
                        {cls.platform}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDateTime(cls.date, cls.time)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${
                          statusColors[cls.status] || statusColors.Scheduled
                        }`}
                      >
                        {cls.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{cls.teacher}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewClass(cls)}
                          className="p-2 hover:bg-blue-100 rounded-lg transition text-blue-600"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        {canManage && (
                          <button
                            onClick={() => handleDeleteClass(cls.id)}
                            className="p-2 hover:bg-red-100 rounded-lg transition text-red-600"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Class Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-t-xl flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Video size={24} />
                Create Online Class
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-white/20 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddClass} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Class Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Fundamentals of Electro Magnetics"
                    className={inputCls}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the class..."
                    rows={3}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Platform *
                  </label>
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    className={inputCls}
                  >
                    {platforms.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Meeting URL *
                  </label>
                  <input
                    type="url"
                    value={formData.meetingUrl}
                    onChange={(e) => setFormData({ ...formData, meetingUrl: e.target.value })}
                    placeholder="https://meet.google.com/..."
                    className={inputCls}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Meeting ID
                  </label>
                  <input
                    type="text"
                    value={formData.meetingId}
                    onChange={(e) => setFormData({ ...formData, meetingId: e.target.value })}
                    placeholder="Optional"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="text"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="No password required"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={inputCls}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className={inputCls}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Class/Section
                  </label>
                  <input
                    type="text"
                    value={formData.class}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                    placeholder="e.g., Class 12 - PCM - A"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g., Science"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Teacher/Presenter
                  </label>
                  <input
                    type="text"
                    value={formData.teacher}
                    onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                    placeholder={user?.name || "Your name"}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className={inputCls}
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Live">Live</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Class Materials */}
              <div className="border-t pt-5">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Class Materials</h3>
                
                {formData.materials.length > 0 && (
                  <div className="mb-4 space-y-2">
                    {formData.materials.map((material) => (
                      <div
                        key={material.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center gap-3">
                          <FileText size={18} className="text-purple-600" />
                          <div>
                            <p className="font-semibold text-sm text-gray-900">{material.title}</p>
                            <p className="text-xs text-gray-500">{material.type}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveMaterial(material.id)}
                          className="p-2 hover:bg-red-100 rounded-lg text-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      value={materialForm.title}
                      onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                      placeholder="Material title"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <select
                      value={materialForm.type}
                      onChange={(e) => setMaterialForm({ ...materialForm, type: e.target.value })}
                      className={inputCls}
                    >
                      <option value="Document">Document</option>
                      <option value="Video">Video</option>
                      <option value="PDF">PDF</option>
                      <option value="Link">Link</option>
                    </select>
                  </div>
                  <div>
                    <input
                      type="text"
                      value={materialForm.description}
                      onChange={(e) =>
                        setMaterialForm({ ...materialForm, description: e.target.value })
                      }
                      placeholder="Description (optional)"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={materialForm.filePath}
                      onChange={(e) =>
                        setMaterialForm({ ...materialForm, filePath: e.target.value })
                      }
                      placeholder="File path or URL"
                      className={inputCls}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <button
                      type="button"
                      onClick={handleAddMaterial}
                      className="w-full px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition font-semibold"
                    >
                      Add Material
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-3 rounded-lg hover:from-purple-600 hover:to-purple-700 transition font-medium flex items-center justify-center gap-2 shadow-lg"
                >
                  <Plus size={20} />
                  Create Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Class Modal */}
      {showViewModal && selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-t-xl flex items-center justify-between">
              <h2 className="text-xl font-bold">{selectedClass.title}</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Class Title
                  </label>
                  <p className="text-gray-900 font-semibold mt-1">{selectedClass.title}</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Platform
                  </label>
                  <p className="text-gray-900 font-semibold mt-1 flex items-center gap-2">
                    <Video size={16} className="text-purple-600" />
                    {selectedClass.platform}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Description
                  </label>
                  <p className="text-gray-700 mt-1">
                    {selectedClass.description || "No description provided"}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Meeting URL
                  </label>
                  <a
                    href={selectedClass.meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-700 font-semibold mt-1 flex items-center gap-2"
                  >
                    <LinkIcon size={16} />
                    {selectedClass.meetingUrl}
                  </a>
                </div>

                {selectedClass.meetingId && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Meeting ID
                    </label>
                    <p className="text-gray-900 font-semibold mt-1">{selectedClass.meetingId}</p>
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Password
                  </label>
                  <p className="text-gray-900 font-semibold mt-1">
                    {selectedClass.password || "No password required"}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Date & Time
                  </label>
                  <p className="text-gray-900 font-semibold mt-1 flex items-center gap-2">
                    <Calendar size={16} className="text-gray-600" />
                    {formatDateTime(selectedClass.date, selectedClass.time)}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Class
                  </label>
                  <p className="text-gray-900 font-semibold mt-1">
                    {selectedClass.class || "Not specified"}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Subject
                  </label>
                  <p className="text-gray-900 font-semibold mt-1">
                    {selectedClass.subject || "Not specified"}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Status
                  </label>
                  <p className="mt-1">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${
                        statusColors[selectedClass.status] || statusColors.Scheduled
                      }`}
                    >
                      {selectedClass.status}
                    </span>
                  </p>
                </div>
              </div>

              {/* Class Materials */}
              {selectedClass.materials && selectedClass.materials.length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Class Materials</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                            Title
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                            Type
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                            Description
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase">
                            File Path
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedClass.materials.map((material) => (
                          <tr key={material.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                              {material.title}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">{material.type}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {material.description || "-"}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <a
                                href={material.filePath}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 font-semibold"
                              >
                                <Download size={16} />
                                Download File
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Close Button */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
