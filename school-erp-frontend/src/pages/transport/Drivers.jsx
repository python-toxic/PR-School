import React, { useState, useEffect } from "react";
import { UserCheck, X, Plus, Edit2, Trash2, Phone, Award, Calendar } from "lucide-react";

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [formData, setFormData] = useState({
    driverName: "",
    contactNumber: "",
    licenseNumber: "",
    licenseExpiry: "",
    experienceYears: "",
    assignedVehicle: "",
    status: "Active",
  });

  useEffect(() => {
    const savedDrivers = JSON.parse(localStorage.getItem("transport-drivers") || "[]");
    const savedVehicles = JSON.parse(localStorage.getItem("transport-vehicles") || "[]");
    setDrivers(savedDrivers);
    setVehicles(savedVehicles);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.driverName || !formData.contactNumber || !formData.licenseNumber) {
      alert("Please fill all required fields");
      return;
    }

    if (editingDriver) {
      const updated = drivers.map((d) =>
        d.id === editingDriver.id ? { ...formData, id: d.id } : d
      );
      setDrivers(updated);
      localStorage.setItem("transport-drivers", JSON.stringify(updated));
    } else {
      const newDriver = {
        ...formData,
        id: Date.now().toString(),
      };
      const updated = [...drivers, newDriver];
      setDrivers(updated);
      localStorage.setItem("transport-drivers", JSON.stringify(updated));
    }
    handleCloseModal();
  };

  const handleEdit = (driver) => {
    setEditingDriver(driver);
    setFormData(driver);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this driver?")) {
      const updated = drivers.filter((d) => d.id !== id);
      setDrivers(updated);
      localStorage.setItem("transport-drivers", JSON.stringify(updated));
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDriver(null);
    setFormData({
      driverName: "",
      contactNumber: "",
      licenseNumber: "",
      licenseExpiry: "",
      experienceYears: "",
      assignedVehicle: "",
      status: "Active",
    });
  };

  const getVehicleName = (vehicleId) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    return vehicle ? vehicle.vehicleNumber : "Not Assigned";
  };

  const isLicenseExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysLeft = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));
    return daysLeft <= 30 && daysLeft >= 0;
  };

  const isLicenseExpired = (expiryDate) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    return expiry < today;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <UserCheck className="w-8 h-8 text-purple-600" />
            Transport Drivers
          </h1>
          <p className="text-gray-600 mt-1">Manage driver information and assignments</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
        >
          <Plus className="w-5 h-5" />
          Add Driver
        </button>
      </div>

      {/* Drivers Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {drivers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <UserCheck className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No drivers found</p>
            <p className="text-gray-400 text-sm">Click "Add Driver" to create your first driver profile</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Driver Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  License Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Experience
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {drivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-purple-600" />
                      <span className="font-medium text-gray-900">{driver.driverName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-gray-700">
                      <Phone className="w-4 h-4" />
                      <span>{driver.contactNumber}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="flex items-center gap-1 text-gray-900">
                        <Award className="w-4 h-4" />
                        <span>{driver.licenseNumber}</span>
                      </div>
                      {driver.licenseExpiry && (
                        <div className="flex items-center gap-1 text-xs mt-1">
                          <Calendar className="w-3 h-3" />
                          <span
                            className={`${
                              isLicenseExpired(driver.licenseExpiry)
                                ? "text-red-600 font-semibold"
                                : isLicenseExpiringSoon(driver.licenseExpiry)
                                ? "text-orange-600 font-semibold"
                                : "text-gray-500"
                            }`}
                          >
                            Exp: {new Date(driver.licenseExpiry).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {driver.experienceYears ? `${driver.experienceYears} years` : "-"}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{getVehicleName(driver.assignedVehicle)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        driver.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {driver.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(driver)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(driver.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingDriver ? "Edit Driver" : "Add New Driver"}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Driver Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="driverName"
                    value={formData.driverName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., Rajesh Kumar"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., 9876543210"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    License Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., DL-1234567890123"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">License Expiry</label>
                  <input
                    type="date"
                    name="licenseExpiry"
                    value={formData.licenseExpiry}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    name="experienceYears"
                    value={formData.experienceYears}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., 5"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assign Vehicle</label>
                  <select
                    name="assignedVehicle"
                    value={formData.assignedVehicle}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select Vehicle</option>
                    {vehicles.filter(v => v.status === "Active").map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.vehicleNumber} ({vehicle.vehicleType})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  {editingDriver ? "Update Driver" : "Add Driver"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Drivers;
