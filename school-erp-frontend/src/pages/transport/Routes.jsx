import React, { useState, useEffect } from "react";
import { Route as RouteIcon, MapPin, X, Plus, Edit2, Trash2, Bus, Navigation } from "lucide-react";

const Routes = () => {
  const [routes, setRoutes] = useState([]);
  const [stops, setStops] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [formData, setFormData] = useState({
    routeName: "",
    startPoint: "",
    endPoint: "",
    stops: [],
    assignedVehicle: "",
    distance: "",
    estimatedTime: "",
    status: "Active",
  });

  useEffect(() => {
    const savedRoutes = JSON.parse(localStorage.getItem("transport-routes") || "[]");
    const savedStops = JSON.parse(localStorage.getItem("transport-stops") || "[]");
    const savedVehicles = JSON.parse(localStorage.getItem("transport-vehicles") || "[]");
    setRoutes(savedRoutes);
    setStops(savedStops);
    setVehicles(savedVehicles);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStopToggle = (stopId) => {
    const updatedStops = formData.stops.includes(stopId)
      ? formData.stops.filter((id) => id !== stopId)
      : [...formData.stops, stopId];
    setFormData({ ...formData, stops: updatedStops });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.routeName || !formData.startPoint || !formData.endPoint) {
      alert("Please fill all required fields");
      return;
    }

    if (editingRoute) {
      const updated = routes.map((r) =>
        r.id === editingRoute.id ? { ...formData, id: r.id } : r
      );
      setRoutes(updated);
      localStorage.setItem("transport-routes", JSON.stringify(updated));
    } else {
      const newRoute = {
        ...formData,
        id: Date.now().toString(),
      };
      const updated = [...routes, newRoute];
      setRoutes(updated);
      localStorage.setItem("transport-routes", JSON.stringify(updated));
    }
    handleCloseModal();
  };

  const handleEdit = (route) => {
    setEditingRoute(route);
    setFormData(route);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this route?")) {
      const updated = routes.filter((r) => r.id !== id);
      setRoutes(updated);
      localStorage.setItem("transport-routes", JSON.stringify(updated));
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRoute(null);
    setFormData({
      routeName: "",
      startPoint: "",
      endPoint: "",
      stops: [],
      assignedVehicle: "",
      distance: "",
      estimatedTime: "",
      status: "Active",
    });
  };

  const getStopName = (stopId) => {
    const stop = stops.find((s) => s.id === stopId);
    return stop ? stop.stopName : "Unknown Stop";
  };

  const getVehicleName = (vehicleId) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    return vehicle ? vehicle.vehicleNumber : "Not Assigned";
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <RouteIcon className="w-8 h-8 text-green-600" />
            Transport Routes
          </h1>
          <p className="text-gray-600 mt-1">Manage transport routes and stops</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          <Plus className="w-5 h-5" />
          Add Route
        </button>
      </div>

      {/* Routes Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {routes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <RouteIcon className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No routes found</p>
            <p className="text-gray-400 text-sm">Click "Add Route" to create your first route</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start - End
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stops
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Distance/Time
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
              {routes.map((route) => (
                <tr key={route.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-gray-900">{route.routeName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="text-gray-900">{route.startPoint}</div>
                      <div className="text-gray-500">to {route.endPoint}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      <span className="text-gray-700">{route.stops.length} stops</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Bus className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-700">{getVehicleName(route.assignedVehicle)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {route.distance && <div>{route.distance} km</div>}
                    {route.estimatedTime && <div className="text-gray-500">{route.estimatedTime}</div>}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        route.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {route.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(route)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(route.id)}
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
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingRoute ? "Edit Route" : "Add New Route"}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Route Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="routeName"
                    value={formData.routeName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., Route A - North Delhi"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Point <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="startPoint"
                    value={formData.startPoint}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., School Gate"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Point <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="endPoint"
                    value={formData.endPoint}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., Terminal Stop"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Distance (km)</label>
                  <input
                    type="text"
                    name="distance"
                    value={formData.distance}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 15"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Time
                  </label>
                  <input
                    type="text"
                    name="estimatedTime"
                    value={formData.estimatedTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 45 mins"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assign Vehicle</label>
                  <select
                    name="assignedVehicle"
                    value={formData.assignedVehicle}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Stops Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Stops (in sequence)
                </label>
                <div className="border border-gray-300 rounded-md p-3 max-h-48 overflow-y-auto">
                  {stops.length === 0 ? (
                    <p className="text-gray-500 text-sm">No stops available. Create stops first.</p>
                  ) : (
                    <div className="space-y-2">
                      {stops.filter(s => s.status === "Active").map((stop) => (
                        <label key={stop.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                          <input
                            type="checkbox"
                            checked={formData.stops.includes(stop.id)}
                            onChange={() => handleStopToggle(stop.id)}
                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                          />
                          <MapPin className="w-4 h-4 text-orange-500" />
                          <span className="text-sm text-gray-700">{stop.stopName}</span>
                          {stop.area && <span className="text-xs text-gray-500">- {stop.area}</span>}
                        </label>
                      ))}
                    </div>
                  )}
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
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  {editingRoute ? "Update Route" : "Add Route"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Routes;
