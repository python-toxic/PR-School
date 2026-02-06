import React, { useState, useEffect } from "react";
import {
  Upload,
  X,
  Edit2,
  Trash2,
  Plus,
  Search,
  Grid3X3,
  Settings,
  Image as ImageIcon,
} from "lucide-react";

export default function Gallery() {
  const [activeTab, setActiveTab] = useState("mySchool");
  const [images, setImages] = useState({
    mySchool: [],
    otherSchools: [],
  });
  const [filteredImages, setFilteredImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    schoolName: "",
    category: "Event",
    imageUrl: "",
    uploadDate: new Date().toISOString().split("T")[0],
  });

  // Load images from localStorage
  useEffect(() => {
    const savedImages = localStorage.getItem("gallery-images");
    if (savedImages) {
      try {
        setImages(JSON.parse(savedImages));
      } catch (error) {
        console.error("Error loading gallery images:", error);
      }
    }
  }, []);

  // Filter images based on search
  useEffect(() => {
    let filtered = images[activeTab] || [];
    if (searchTerm) {
      filtered = filtered.filter(
        (img) =>
          img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          img.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (activeTab === "otherSchools" &&
            img.schoolName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    setFilteredImages(filtered);
  }, [activeTab, searchTerm, images]);

  // Save to localStorage
  const saveImages = (updatedImages) => {
    localStorage.setItem("gallery-images", JSON.stringify(updatedImages));
    setImages(updatedImages);
  };

  // Handle form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Add or update image
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.imageUrl) {
      alert("Please fill in all required fields");
      return;
    }

    const updatedImages = { ...images };
    const currentTab = activeTab;

    if (editingId) {
      // Update existing
      updatedImages[currentTab] = updatedImages[currentTab].map((img) =>
        img.id === editingId ? { ...img, ...formData } : img
      );
      setEditingId(null);
    } else {
      // Add new
      const newImage = {
        id: Date.now().toString(),
        ...formData,
      };
      updatedImages[currentTab] = [newImage, ...(updatedImages[currentTab] || [])];
    }

    saveImages(updatedImages);
    resetForm();
    setShowModal(false);
  };

  // Edit image
  const handleEdit = (image) => {
    setFormData(image);
    setEditingId(image.id);
    setShowModal(true);
  };

  // Delete image
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      const updatedImages = { ...images };
      updatedImages[activeTab] = updatedImages[activeTab].filter(
        (img) => img.id !== id
      );
      saveImages(updatedImages);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      schoolName: "",
      category: "Event",
      imageUrl: "",
      uploadDate: new Date().toISOString().split("T")[0],
    });
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <Grid3X3 className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gallery Management</h1>
              <p className="text-gray-600">Manage school photos and gallery</p>
            </div>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg text-white px-6 py-3 rounded-lg font-semibold transition transform hover:scale-105"
          >
            <Plus size={20} />
            Add Gallery
          </button>
        </div>

        {/* Tabs and Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setActiveTab("mySchool");
                setSearchTerm("");
              }}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                activeTab === "mySchool"
                  ? "bg-purple-500 text-white shadow-lg"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-purple-300"
              }`}
            >
              My School ({images.mySchool?.length || 0})
            </button>
            <button
              onClick={() => {
                setActiveTab("otherSchools");
                setSearchTerm("");
              }}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                activeTab === "otherSchools"
                  ? "bg-pink-500 text-white shadow-lg"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-pink-300"
              }`}
            >
              Other Schools ({images.otherSchools?.length || 0})
            </button>
          </div>

          {/* Search */}
          <div className="w-full md:w-64 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredImages.length > 0 ? (
          filteredImages.map((image) => (
            <div
              key={image.id}
              onClick={() => setSelectedImage(image)}
              className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300 transform hover:scale-105 cursor-pointer h-64"
            >
              {/* Image */}
              <img
                src={image.imageUrl}
                alt={image.title}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-end p-4">
                <h3 className="text-white font-bold text-lg truncate">{image.title}</h3>
                <p className="text-gray-200 text-sm truncate">{image.description}</p>
                {activeTab === "otherSchools" && (
                  <p className="text-gray-300 text-xs mt-1">{image.schoolName}</p>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(image);
                    }}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-semibold flex items-center justify-center gap-1 transition"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(image.id);
                    }}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded font-semibold flex items-center justify-center gap-1 transition"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>

              {/* Category Badge */}
              <div className="absolute top-3 right-3 bg-purple-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                {image.category}
              </div>

              {/* Date Badge */}
              <div className="absolute top-3 left-3 bg-gray-900 text-white text-xs px-3 py-1 rounded-full opacity-75">
                {new Date(image.uploadDate).toLocaleDateString()}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
            <ImageIcon size={48} className="text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg font-semibold mb-2">
              No images found
            </p>
            <p className="text-gray-400 text-sm">
              {searchTerm ? "Try adjusting your search" : "Click 'Add Gallery' to upload your first image"}
            </p>
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="bg-white rounded-xl max-w-2xl w-full overflow-hidden">
            <div className="relative">
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.title}
                className="w-full max-h-96 object-cover"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedImage.title}
              </h2>
              <p className="text-gray-600 mb-4">{selectedImage.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 font-semibold">Category</p>
                  <p className="text-gray-700">{selectedImage.category}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-semibold">Date</p>
                  <p className="text-gray-700">
                    {new Date(selectedImage.uploadDate).toLocaleDateString()}
                  </p>
                </div>
                {activeTab === "otherSchools" && (
                  <div className="col-span-2">
                    <p className="text-gray-500 font-semibold">School Name</p>
                    <p className="text-gray-700">{selectedImage.schoolName}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Plus size={28} />
                {editingId ? "Edit Gallery" : "Add New Gallery"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter gallery title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter description"
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* School Name (for Other Schools) */}
              {activeTab === "otherSchools" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    School Name
                  </label>
                  <input
                    type="text"
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleInputChange}
                    placeholder="Enter school name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              )}

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option>Event</option>
                  <option>Sports</option>
                  <option>Academic</option>
                  <option>Cultural</option>
                  <option>Achievement</option>
                  <option>Infrastructure</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Upload Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  name="uploadDate"
                  value={formData.uploadDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Image *
                </label>
                <div className="relative">
                  {formData.imageUrl && (
                    <div className="mb-3">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-purple-300 rounded-lg cursor-pointer hover:bg-purple-50 transition">
                    <Upload size={20} className="text-purple-500" />
                    <span className="text-purple-600 font-semibold">
                      {formData.imageUrl ? "Change Image" : "Upload Image"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg text-white py-3 rounded-lg font-semibold transition transform hover:scale-105"
                >
                  {editingId ? "Update Gallery" : "Add Gallery"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
