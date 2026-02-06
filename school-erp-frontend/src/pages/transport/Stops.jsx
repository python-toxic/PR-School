import React, { useState, useEffect } from "react";
import { MapPin, X, Plus, Edit2, Trash2, Navigation } from "lucide-react";

const Stops = () => {
  const [stops, setStops] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingStop, setEditingStop] = useState(null);
  const [formData, setFormData] = useState({
    stopName: "",
    area: "",
    landmark: "",
    latitude: "",
    longitude: "",
    status: "Active",
  });

  useEffect(() => {
    const savedStops = JSON.parse(localStorage.getItem("transport-stops") || "[]");
    setStops(savedStops);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.stopName) {
      alert("Please enter stop name");
      return;
    }

    if (editingStop) {
      const updated = stops.map((s) =>
        s.id === editingStop.id ? { ...formData, id: s.id } : s
      );
      setStops(updated);
      localStorage.setItem("transport-stops", JSON.stringify(updated));
    } else {
      const newStop = {
        ...formData,
        id: Date.now().toString(),
      };
      const updated = [...stops, newStop];
      setStops(updated);
      localStorage.setItem("transport-stops", JSON.stringify(updated));
    }
    handleCloseModal();
  };

  const handleEdit = (stop) => {
    setEditingStop(stop);
    setFormData(stop);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this stop?")) {
      const updated = stops.filter((s) => s.id !== id);
      setStops(updated);
      localStorage.setItem("transport-stops", JSON.stringify(updated));
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStop(null);
    setFormData({
      stopName: "",
      area: "",
      landmark: "",
      latitude: "",
      longitude: "",
      status: "Active",
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <MapPin className="w-8 h-8 text-orange-600" />
            Transport Stops
          </h1>
          <p className="text-gray-600 mt-1">Manage pickup and drop locations</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
        >
          <Plus className="w-5 h-5" />
          Add Stop
        </button>
      </div>

      {/* Stops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stops.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-md">
            <MapPin className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No stops found</p>
            <p className="text-gray-400 text-sm">Click "Add Stop" to create your first stop</p>
          </div>
        ) : (
          stops.map((stop) => (
            <div
              key={stop.id}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition border border-gray-200"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-orange-600" />
                  <h3 className="font-bold text-gray-800">{stop.stopName}</h3>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    stop.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {stop.status}
                </span>
              </div>

              {stop.area && (
                <div className="text-sm text-gray-600 mb-2">
                  <strong>Area:</strong> {stop.area}
                </div>
              )}

              {stop.landmark && (
                <div className="text-sm text-gray-600 mb-2">
                  <strong>Landmark:</strong> {stop.landmark}
                </div>
              )}

              {(stop.latitude || stop.longitude) && (
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <Navigation className="w-4 h-4" />
                  <span>
                    {stop.latitude && `Lat: ${stop.latitude}`}
                    {stop.latitude && stop.longitude && " | "}
                    {stop.longitude && `Lng: ${stop.longitude}`}
                  </span>
                </div>
              )}

              <div className="flex gap-2 pt-3 border-t border-gray-200">
                <button
                  onClick={() => handleEdit(stop)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(stop.id)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingStop ? "Edit Stop" : "Add New Stop"}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stop Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="stopName"
                    value={formData.stopName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., Rohini Sector 15"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Area/Locality</label>
                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., Rohini"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Landmark</label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., Near Metro Station"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                  <input
                    type="text"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., 28.7041"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                  <input
                    type="text"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., 77.1025"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                >
                  {editingStop ? "Update Stop" : "Add Stop"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stops;
