import { useState, useEffect, useMemo, useRef } from "react";
import { useUser } from "../../context/UserContext";
import {
  FileText,
  Plus,
  Search,
  Eye,
  Download,
  Trash2,
  X,
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  Video as VideoIcon,
  FileIcon,
  Loader2,
  CheckCircle2,
} from "lucide-react";

const inputCls = "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm";

const materialTypes = [
  { value: "pdf", label: "PDF / Document", icon: FileText },
  { value: "image", label: "Image", icon: ImageIcon },
  { value: "video", label: "Video", icon: VideoIcon },
  { value: "link", label: "External Link (URL)", icon: LinkIcon },
];

const subjects = [
  "Mathematics",
  "Science",
  "English",
  "Hindi",
  "Social Studies",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "History",
  "Geography",
  "Economics",
];

export default function Materials() {
  const { user } = useUser();
  const [materials, setMaterials] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    type: "pdf",
    uploadMethod: "file",
    file: null,
    fileUrl: "",
    videoUrl: "",
    externalUrl: "",
    class: "",
    teacherId: "",
    teacherName: "",
    subject: "",
    description: "",
    visibleToStudents: true,
    visibleToTeachers: true,
  });

  const [classSuggestions, setClassSuggestions] = useState([]);
  const [teacherSuggestions, setTeacherSuggestions] = useState([]);
  const [showClassSuggestions, setShowClassSuggestions] = useState(false);
  const [showTeacherSuggestions, setShowTeacherSuggestions] = useState(false);
  const classInputRef = useRef(null);
  const teacherInputRef = useRef(null);

  const canManage = ["ADMIN", "SUPER_ADMIN", "TEACHER"].includes(user?.role?.toUpperCase());

  // Load materials from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("materials-library");
    if (saved) {
      setMaterials(JSON.parse(saved));
    }
  }, []);

  // Save materials to localStorage
  useEffect(() => {
    if (materials.length > 0) {
      localStorage.setItem("materials-library", JSON.stringify(materials));
    }
  }, [materials]);

  // Load classes for suggestions
  useEffect(() => {
    const savedClasses = localStorage.getItem("classes-list");
    if (savedClasses) {
      const classes = JSON.parse(savedClasses);
      setClassSuggestions(
        classes.map((c) => ({
          value: `${c.name} - ${c.section}`,
          label: `${c.name} - ${c.section}`,
        }))
      );
    }
  }, []);

  // Load teachers/employees for suggestions
  useEffect(() => {
    const savedEmployees = localStorage.getItem("employees-list");
    if (savedEmployees) {
      const employees = JSON.parse(savedEmployees);
      const teachers = employees.filter((e) => e.role === "Teacher" || e.designation === "Teacher");
      setTeacherSuggestions(
        teachers.map((t) => ({
          id: t.id || t.employeeId,
          name: t.name,
          label: t.name,
        }))
      );
    }
  }, []);

  const filteredMaterials = useMemo(() => {
    return materials
      .filter((material) => {
        const query = searchQuery.toLowerCase();
        return (
          material.title.toLowerCase().includes(query) ||
          material.class.toLowerCase().includes(query) ||
          material.subject?.toLowerCase().includes(query) ||
          material.teacherName?.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
  }, [materials, searchQuery]);

  const filteredClassSuggestions = useMemo(() => {
    if (!formData.class) return classSuggestions.slice(0, 10); // Show first 10 when empty
    return classSuggestions.filter((c) =>
      c.label.toLowerCase().includes(formData.class.toLowerCase())
    );
  }, [formData.class, classSuggestions]);

  const filteredTeacherSuggestions = useMemo(() => {
    if (!formData.teacherName) return teacherSuggestions.slice(0, 10); // Show first 10 when empty
    if (formData.teacherName.length < 2) return [];
    return teacherSuggestions.filter((t) =>
      t.name.toLowerCase().includes(formData.teacherName.toLowerCase())
    );
  }, [formData.teacherName, teacherSuggestions]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (50MB max)
      const maxSize = 50 * 1024 * 1024;
      if (file.size > maxSize) {
        alert("File size exceeds 50MB limit");
        e.target.value = "";
        return;
      }

      // Validate file type
      const allowedTypes = {
        pdf: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"],
        image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
        video: ["video/mp4", "video/webm", "video/ogg"],
      };

      const validTypes = allowedTypes[formData.type] || [];
      if (!validTypes.includes(file.type)) {
        alert(`Invalid file type for ${formData.type}`);
        e.target.value = "";
        return;
      }

      // Create a preview URL for images
      const previewUrl = formData.type === "image" ? URL.createObjectURL(file) : "";
      
      setFormData({ 
        ...formData, 
        file, 
        fileUrl: `uploads/materials/${file.name}` // Simulated upload path
      });
    }
  };

  const simulateUpload = () => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          resolve();
        }
      }, 200);
    });
  };

  const handleUploadMaterial = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title || formData.title.length < 3) {
      alert("Material title is required (minimum 3 characters)");
      return;
    }

    if (!formData.class) {
      alert("Class selection is required");
      return;
    }

    // Validate based on type
    if (formData.type === "link") {
      if (!formData.externalUrl || !formData.externalUrl.startsWith("http")) {
        alert("Valid external URL is required (must start with http:// or https://)");
        return;
      }
    } else if (formData.type === "video") {
      if (formData.uploadMethod === "url" && !formData.videoUrl) {
        alert("Video URL is required");
        return;
      } else if (formData.uploadMethod === "file" && !formData.file) {
        alert("Video file is required");
        return;
      }
    } else {
      if (!formData.file) {
        alert("File upload is required");
        return;
      }
    }

    setUploading(true);
    setUploadProgress(0);

    // Simulate upload
    await simulateUpload();

    const newMaterial = {
      id: Date.now().toString(),
      title: formData.title,
      type: formData.type,
      fileUrl:
        formData.type === "link"
          ? formData.externalUrl
          : formData.type === "video" && formData.uploadMethod === "url"
          ? formData.videoUrl
          : formData.fileUrl || `uploads/${formData.file?.name}`,
      fileName: formData.file?.name || "",
      class: formData.class,
      teacherId: formData.teacherId,
      teacherName: formData.teacherName || user?.name || "Unknown",
      subject: formData.subject,
      description: formData.description,
      visibleToStudents: formData.visibleToStudents,
      visibleToTeachers: formData.visibleToTeachers,
      uploadedBy: user?.name || "Unknown",
      uploadedAt: new Date().toISOString(),
    };

    setMaterials([newMaterial, ...materials]);
    setUploading(false);
    setUploadProgress(0);
    resetForm();
    setShowUploadModal(false);
    alert("Material uploaded successfully!");
  };

  const handleDeleteMaterial = (id) => {
    if (window.confirm("Are you sure you want to delete this material?")) {
      setMaterials(materials.filter((m) => m.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      type: "pdf",
      uploadMethod: "file",
      file: null,
      fileUrl: "",
      videoUrl: "",
      externalUrl: "",
      class: "",
      teacherId: "",
      teacherName: "",
      subject: "",
      description: "",
      visibleToStudents: true,
      visibleToTeachers: true,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleViewMaterial = (material) => {
    setSelectedMaterial(material);
    setShowViewModal(true);
  };

  const getTypeIcon = (type) => {
    const iconMap = {
      pdf: FileText,
      image: ImageIcon,
      video: VideoIcon,
      link: LinkIcon,
    };
    const Icon = iconMap[type] || FileIcon;
    return <Icon size={16} />;
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl shadow-lg">
              <FileText className="text-white" size={32} />
            </div>
            <span className="bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
              Materials Library
            </span>
          </h1>
          <p className="text-gray-600 mt-2">
            Upload and manage study materials, documents, and resources
          </p>
        </div>
        {canManage && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus size={20} />
            <span className="font-semibold">Upload Material</span>
          </button>
        )}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by title, class, subject, or teacher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold">{filteredMaterials.length}</span> of{" "}
          <span className="font-semibold">{materials.length}</span> materials.
        </p>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-md">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">No materials found</p>
          </div>
        ) : (
          filteredMaterials.map((material) => (
            <div
              key={material.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 transform hover:-translate-y-2"
            >
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  {getTypeIcon(material.type)}
                  <span className="text-xs font-semibold uppercase">
                    {material.type}
                  </span>
                </div>
                <h3 className="font-bold text-lg line-clamp-2">{material.title}</h3>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold text-gray-700">Class:</span>
                  <span className="text-gray-600">{material.class}</span>
                </div>

                {material.subject && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-gray-700">Subject:</span>
                    <span className="text-gray-600">{material.subject}</span>
                  </div>
                )}

                {material.teacherName && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-gray-700">Teacher:</span>
                    <span className="text-gray-600">{material.teacherName}</span>
                  </div>
                )}

                {material.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {material.description}
                  </p>
                )}

                <div className="text-xs text-gray-500">
                  Uploaded: {new Date(material.uploadedAt).toLocaleDateString()}
                </div>

                <div className="flex gap-2 pt-2 border-t">
                  <button
                    onClick={() => handleViewMaterial(material)}
                    className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition font-semibold text-sm flex items-center justify-center gap-1"
                  >
                    <Eye size={16} />
                    View
                  </button>
                  <a
                    href={material.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition font-semibold text-sm flex items-center justify-center gap-1"
                  >
                    <Download size={16} />
                    Download
                  </a>
                  {canManage && (
                    <button
                      onClick={() => handleDeleteMaterial(material.id)}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload Material Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-t-xl flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Upload size={24} />
                Upload Material
              </h2>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-white/20 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUploadMaterial} className="p-6 space-y-5">
              {/* Material Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Material Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter material title (e.g., Class 8 – Science Chapter 3 Notes)"
                  className={inputCls}
                  minLength={3}
                  maxLength={150}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.title.length}/150 characters
                </p>
              </div>

              {/* Material Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Material Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value, file: null, fileUrl: "" })
                  }
                  className={inputCls}
                  required
                >
                  {materialTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Upload Method - Dynamic based on type */}
              {formData.type !== "link" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload Method <span className="text-red-500">*</span>
                  </label>

                  {formData.type === "video" && (
                    <div className="space-y-3">
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="uploadMethod"
                            value="file"
                            checked={formData.uploadMethod === "file"}
                            onChange={(e) =>
                              setFormData({ ...formData, uploadMethod: e.target.value })
                            }
                            className="text-green-600"
                          />
                          <span className="text-sm">Upload Video File</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="uploadMethod"
                            value="url"
                            checked={formData.uploadMethod === "url"}
                            onChange={(e) =>
                              setFormData({ ...formData, uploadMethod: e.target.value })
                            }
                            className="text-green-600"
                          />
                          <span className="text-sm">Paste Video URL</span>
                        </label>
                      </div>

                      {formData.uploadMethod === "url" ? (
                        <input
                          type="url"
                          value={formData.videoUrl}
                          onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                          placeholder="https://youtube.com/watch?v=... or Google Drive link"
                          className={inputCls}
                        />
                      ) : (
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="video/*"
                          onChange={handleFileChange}
                          className={inputCls}
                        />
                      )}
                    </div>
                  )}

                  {formData.type === "pdf" && (
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,.ppt,.pptx"
                        onChange={handleFileChange}
                        className={inputCls}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Supported: PDF, DOCX, PPTX (Max 50MB)
                      </p>
                    </div>
                  )}

                  {formData.type === "image" && (
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className={inputCls}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Supported: JPG, PNG, GIF, WEBP (Max 50MB)
                      </p>
                    </div>
                  )}

                  {formData.file && formData.type === "image" && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-600 mb-2">Preview:</p>
                      <img
                        src={URL.createObjectURL(formData.file)}
                        alt="Preview"
                        className="max-h-48 rounded-lg border"
                      />
                    </div>
                  )}
                  
                  {formData.file && (
                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">
                        <span className="font-semibold">Selected file:</span> {formData.file.name}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        Size: {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* External URL */}
              {formData.type === "link" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Material URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    value={formData.externalUrl}
                    onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
                    placeholder="https://example.com/resource"
                    className={inputCls}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Must start with http:// or https://
                  </p>
                </div>
              )}

              {/* Class Selection with Autocomplete */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Class <span className="text-red-500">*</span>
                </label>
                <input
                  ref={classInputRef}
                  type="text"
                  value={formData.class}
                  onChange={(e) => {
                    setFormData({ ...formData, class: e.target.value });
                    setShowClassSuggestions(true);
                  }}
                  onFocus={() => setShowClassSuggestions(true)}
                  onBlur={(e) => {
                    // Delay to allow click on suggestion
                    setTimeout(() => {
                      if (!e.currentTarget.contains(document.activeElement)) {
                        setShowClassSuggestions(false);
                      }
                    }, 300);
                  }}
                  placeholder="Type class name (e.g., Class 10, Nursery)"
                  className={inputCls}
                  required
                  autoComplete="off"
                />
                {showClassSuggestions && filteredClassSuggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border-2 border-green-300 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                    {filteredClassSuggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault(); // Prevent input blur
                          setFormData({ ...formData, class: suggestion.value });
                          setShowClassSuggestions(false);
                          classInputRef.current?.focus();
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-green-50 text-sm transition-colors border-b last:border-b-0"
                      >
                        {suggestion.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Teacher Name with Autocomplete */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Teacher Name (Optional)
                </label>
                <input
                  ref={teacherInputRef}
                  type="text"
                  value={formData.teacherName}
                  onChange={(e) => {
                    setFormData({ ...formData, teacherName: e.target.value, teacherId: "" });
                    setShowTeacherSuggestions(true);
                  }}
                  onFocus={() => setShowTeacherSuggestions(true)}
                  onBlur={(e) => {
                    // Delay to allow click on suggestion
                    setTimeout(() => {
                      if (!e.currentTarget.contains(document.activeElement)) {
                        setShowTeacherSuggestions(false);
                      }
                    }, 300);
                  }}
                  placeholder="Type teacher name (e.g., Rahul, Priya)"
                  className={inputCls}
                  autoComplete="off"
                />
                {showTeacherSuggestions && filteredTeacherSuggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border-2 border-green-300 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                    {filteredTeacherSuggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault(); // Prevent input blur
                          setFormData({
                            ...formData,
                            teacherName: suggestion.name,
                            teacherId: suggestion.id,
                          });
                          setShowTeacherSuggestions(false);
                          teacherInputRef.current?.focus();
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-green-50 text-sm transition-colors border-b last:border-b-0"
                      >
                        {suggestion.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject (Optional)
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className={inputCls}
                >
                  <option value="">Select Subject</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description..."
                  rows={3}
                  maxLength={500}
                  className={inputCls}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.description.length}/500 characters
                </p>
              </div>

              {/* Visibility Settings */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Visibility Settings
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.visibleToStudents}
                      onChange={(e) =>
                        setFormData({ ...formData, visibleToStudents: e.target.checked })
                      }
                      className="rounded text-green-600"
                    />
                    <span className="text-sm">Visible to Students</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.visibleToTeachers}
                      onChange={(e) =>
                        setFormData({ ...formData, visibleToTeachers: e.target.checked })
                      }
                      className="rounded text-green-600"
                    />
                    <span className="text-sm">Visible to Teachers</span>
                  </label>
                </div>
              </div>

              {/* Upload Progress */}
              {uploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-green-600 h-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    resetForm();
                  }}
                  disabled={uploading}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition font-medium flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={20} />
                      Upload Material
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Material Modal */}
      {showViewModal && selectedMaterial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-t-xl flex items-center justify-between">
              <h2 className="text-xl font-bold">{selectedMaterial.title}</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Type</label>
                  <p className="text-gray-900 font-semibold mt-1 flex items-center gap-2">
                    {getTypeIcon(selectedMaterial.type)}
                    {selectedMaterial.type.toUpperCase()}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Class</label>
                  <p className="text-gray-900 font-semibold mt-1">{selectedMaterial.class}</p>
                </div>
                {selectedMaterial.subject && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Subject</label>
                    <p className="text-gray-900 font-semibold mt-1">{selectedMaterial.subject}</p>
                  </div>
                )}
                {selectedMaterial.teacherName && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Teacher</label>
                    <p className="text-gray-900 font-semibold mt-1">
                      {selectedMaterial.teacherName}
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Uploaded By
                  </label>
                  <p className="text-gray-900 font-semibold mt-1">
                    {selectedMaterial.uploadedBy}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Upload Date
                  </label>
                  <p className="text-gray-900 font-semibold mt-1">
                    {new Date(selectedMaterial.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {selectedMaterial.description && (
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Description
                  </label>
                  <p className="text-gray-700 mt-1">{selectedMaterial.description}</p>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Visibility</label>
                <div className="flex gap-3 mt-2">
                  {selectedMaterial.visibleToStudents && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                      Students
                    </span>
                  )}
                  {selectedMaterial.visibleToTeachers && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                      Teachers
                    </span>
                  )}
                </div>
              </div>

              {selectedMaterial.type === "image" && selectedMaterial.fileUrl && (
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">
                    Preview
                  </label>
                  <img
                    src={selectedMaterial.fileUrl}
                    alt={selectedMaterial.title}
                    className="w-full rounded-lg border"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t">
                <a
                  href={selectedMaterial.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition font-medium flex items-center justify-center gap-2"
                >
                  <Download size={18} />
                  Download / View
                </a>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
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
