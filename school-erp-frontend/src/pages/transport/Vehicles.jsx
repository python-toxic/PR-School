import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Bus, X } from "lucide-react";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [formData, setFormData] = useState({
    vehicleNumber: "",
    vehicleType: "Bus",
    capacity: "",
    model: "",
    registrationDate: "",
    driver: "",
    route: "",
    status: "Active",
  });

  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const savedVehicles = JSON.parse(localStorage.getItem("transport-vehicles") || "[]");
    const savedDrivers = JSON.parse(localStorage.getItem("transport-drivers") || "[]");
    const savedRoutes = JSON.parse(localStorage.getItem("transport-routes") || "[]");
    setVehicles(savedVehicles);
    setDrivers(savedDrivers);
    setRoutes(savedRoutes);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingVehicle) {
      const updated = vehicles.map(v => v.id === editingVehicle.id ? { ...formData, id: v.id } : v);
      setVehicles(updated);
      localStorage.setItem("transport-vehicles", JSON.stringify(updated));
    } else {
      const newVehicle = { ...formData, id: Date.now().toString() };
      const updated = [...vehicles, newVehicle];
      setVehicles(updated);
      localStorage.setItem("transport-vehicles", JSON.stringify(updated));
    }
    
    handleCloseModal();
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setFormData(vehicle);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this vehicle?")) {
      const updated = vehicles.filter(v => v.id !== id);
      setVehicles(updated);
      localStorage.setItem("transport-vehicles", JSON.stringify(updated));
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingVehicle(null);
    setFormData({
      vehicleNumber: "",
      vehicleType: "Bus",
      capacity: "",
      model: "",
      registrationDate: "",
      driver: "",
      route: "",
      status: "Active",
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Vehicles</h1>
          <p className="text-sm text-slate-600">Manage transport vehicles</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          Add Vehicle
        </button>
      </div>

      {/* Vehicles Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Vehicle Number</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Capacity</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Model</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Driver</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Route</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {vehicles.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-slate-500">
                    <Bus className="mx-auto mb-2" size={40} />
                    <p>No vehicles found. Add your first vehicle to get started.</p>
                  </td>
                </tr>
              ) : (
                vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{vehicle.vehicleNumber}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{vehicle.vehicleType}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{vehicle.capacity}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{vehicle.model}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{vehicle.driver || "-"}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{vehicle.route || "-"}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${vehicle.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {vehicle.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(vehicle)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(vehicle.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-xl font-semibold">{editingVehicle ? "Edit Vehicle" : "Add Vehicle"}</h2>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle Number *</label>
                  <input
                    type="text"
                    value={formData.vehicleNumber}
                    onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle Type *</label>
                  <select
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="Bus">Bus</option>
                    <option value="Van">Van</option>
                    <option value="Mini Bus">Mini Bus</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Capacity *</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Model</label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Registration Date</label>
                  <input
                    type="date"
                    value={formData.registrationDate}
                    onChange={(e) => setFormData({ ...formData, registrationDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Assign Driver</label>
                  <select
                    value={formData.driver}
                    onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Select Driver</option>
                    {drivers.filter(d => d.status === "Active").map(d => (
                      <option key={d.id} value={d.name}>{d.name} - {d.licenseNumber}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Assign Route</label>
                  <select
                    value={formData.route}
                    onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Select Route</option>
                    {routes.filter(r => r.status === "Active").map(r => (
                      <option key={r.id} value={r.name}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  {editingVehicle ? "Update Vehicle" : "Add Vehicle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
