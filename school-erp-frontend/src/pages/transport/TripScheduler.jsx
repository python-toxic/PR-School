import React, { useState, useEffect } from "react";
import { Calendar, X, Plus, Edit2, Trash2, Clock, Route as RouteIcon, Bus, UserCheck } from "lucide-react";

const TripScheduler = () => {
  const [trips, setTrips] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    time: "",
    tripType: "Morning",
    routeId: "",
    vehicleId: "",
    driverId: "",
    status: "Scheduled",
  });

  useEffect(() => {
    const savedTrips = JSON.parse(localStorage.getItem("transport-trips") || "[]");
    const savedRoutes = JSON.parse(localStorage.getItem("transport-routes") || "[]");
    const savedVehicles = JSON.parse(localStorage.getItem("transport-vehicles") || "[]");
    const savedDrivers = JSON.parse(localStorage.getItem("transport-drivers") || "[]");
    setTrips(savedTrips);
    setRoutes(savedRoutes);
    setVehicles(savedVehicles);
    setDrivers(savedDrivers);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.date || !formData.time || !formData.routeId || !formData.vehicleId || !formData.driverId) {
      alert("Please fill all required fields");
      return;
    }

    if (editingTrip) {
      const updated = trips.map((t) =>
        t.id === editingTrip.id ? { ...formData, id: t.id } : t
      );
      setTrips(updated);
      localStorage.setItem("transport-trips", JSON.stringify(updated));
    } else {
      const newTrip = {
        ...formData,
        id: Date.now().toString(),
      };
      const updated = [...trips, newTrip];
      setTrips(updated);
      localStorage.setItem("transport-trips", JSON.stringify(updated));
    }
    handleCloseModal();
  };

  const handleEdit = (trip) => {
    setEditingTrip(trip);
    setFormData(trip);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      const updated = trips.filter((t) => t.id !== id);
      setTrips(updated);
      localStorage.setItem("transport-trips", JSON.stringify(updated));
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTrip(null);
    setFormData({
      date: new Date().toISOString().split("T")[0],
      time: "",
      tripType: "Morning",
      routeId: "",
      vehicleId: "",
      driverId: "",
      status: "Scheduled",
    });
  };

  const getRouteName = (routeId) => {
    const route = routes.find((r) => r.id === routeId);
    return route ? route.routeName : "Not Assigned";
  };

  const getVehicleName = (vehicleId) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    return vehicle ? vehicle.vehicleNumber : "Not Assigned";
  };

  const getDriverName = (driverId) => {
    const driver = drivers.find((d) => d.id === driverId);
    return driver ? driver.driverName : "Not Assigned";
  };

  const getTodayTrips = () => {
    const today = new Date().toISOString().split("T")[0];
    return trips.filter((t) => t.date === today);
  };

  const getUpcomingTrips = () => {
    const today = new Date().toISOString().split("T")[0];
    return trips.filter((t) => t.date > today);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Calendar className="w-8 h-8 text-cyan-600" />
            Trip Scheduler
          </h1>
          <p className="text-gray-600 mt-1">Schedule and manage daily transport trips</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition"
        >
          <Plus className="w-5 h-5" />
          Schedule Trip
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-100">Total Trips</p>
              <p className="text-3xl font-bold">{trips.length}</p>
            </div>
            <Calendar className="w-10 h-10 text-cyan-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Today's Trips</p>
              <p className="text-3xl font-bold">{getTodayTrips().length}</p>
            </div>
            <Clock className="w-10 h-10 text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Upcoming</p>
              <p className="text-3xl font-bold">{getUpcomingTrips().length}</p>
            </div>
            <Calendar className="w-10 h-10 text-orange-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Completed</p>
              <p className="text-3xl font-bold">{trips.filter(t => t.status === "Completed").length}</p>
            </div>
            <Calendar className="w-10 h-10 text-blue-200" />
          </div>
        </div>
      </div>

      {/* Trips Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {trips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No trips scheduled</p>
            <p className="text-gray-400 text-sm">Click "Schedule Trip" to create your first trip</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trip Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Driver
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
              {trips.sort((a, b) => new Date(b.date) - new Date(a.date)).map((trip) => (
                <tr key={trip.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-cyan-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(trip.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {trip.time}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        trip.tripType === "Morning"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-indigo-100 text-indigo-800"
                      }`}
                    >
                      {trip.tripType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-gray-700">
                      <RouteIcon className="w-4 h-4 text-green-600" />
                      <span>{getRouteName(trip.routeId)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-gray-700">
                      <Bus className="w-4 h-4 text-blue-600" />
                      <span>{getVehicleName(trip.vehicleId)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-gray-700">
                      <UserCheck className="w-4 h-4 text-purple-600" />
                      <span>{getDriverName(trip.driverId)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        trip.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : trip.status === "In Progress"
                          ? "bg-blue-100 text-blue-800"
                          : trip.status === "Cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {trip.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(trip)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(trip.id)}
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
                {editingTrip ? "Edit Trip" : "Schedule New Trip"}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trip Type</label>
                  <select
                    name="tripType"
                    value={formData.tripType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="Morning">Morning (School Pickup)</option>
                    <option value="Afternoon">Afternoon (School Drop)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Route <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="routeId"
                    value={formData.routeId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  >
                    <option value="">Choose a route</option>
                    {routes.filter(r => r.status === "Active").map((route) => (
                      <option key={route.id} value={route.id}>
                        {route.routeName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Vehicle <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="vehicleId"
                    value={formData.vehicleId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  >
                    <option value="">Choose a vehicle</option>
                    {vehicles.filter(v => v.status === "Active").map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.vehicleNumber} ({vehicle.vehicleType})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Driver <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="driverId"
                    value={formData.driverId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  >
                    <option value="">Choose a driver</option>
                    {drivers.filter(d => d.status === "Active").map((driver) => (
                      <option key={driver.id} value={driver.id}>
                        {driver.driverName}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
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
                  className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
                >
                  {editingTrip ? "Update Trip" : "Schedule Trip"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripScheduler;
