import React, { useState, useEffect } from "react";
import { Users, X, Plus, Edit2, Trash2, UserCheck, MapPin, Route as RouteIcon } from "lucide-react";

const TransportStudents = () => {
  const [transportStudents, setTransportStudents] = useState([]);
  const [students, setStudents] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [stops, setStops] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    studentId: "",
    routeId: "",
    stopId: "",
    tripType: "Both",
    status: "Active",
  });

  useEffect(() => {
    const savedTransportStudents = JSON.parse(localStorage.getItem("transport-students") || "[]");
    const savedStudents = JSON.parse(localStorage.getItem("students-list") || "[]");
    const savedRoutes = JSON.parse(localStorage.getItem("transport-routes") || "[]");
    const savedStops = JSON.parse(localStorage.getItem("transport-stops") || "[]");
    setTransportStudents(savedTransportStudents);
    setStudents(savedStudents);
    setRoutes(savedRoutes);
    setStops(savedStops);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.studentId || !formData.routeId || !formData.stopId) {
      alert("Please fill all required fields");
      return;
    }

    // Check if student is already assigned
    const existingAssignment = transportStudents.find(
      ts => ts.studentId === formData.studentId && ts.id !== editingStudent?.id
    );
    if (existingAssignment) {
      alert("This student is already assigned to a transport route!");
      return;
    }

    if (editingStudent) {
      const updated = transportStudents.map((ts) =>
        ts.id === editingStudent.id ? { ...formData, id: ts.id } : ts
      );
      setTransportStudents(updated);
      localStorage.setItem("transport-students", JSON.stringify(updated));
    } else {
      const newAssignment = {
        ...formData,
        id: Date.now().toString(),
      };
      const updated = [...transportStudents, newAssignment];
      setTransportStudents(updated);
      localStorage.setItem("transport-students", JSON.stringify(updated));
    }
    handleCloseModal();
  };

  const handleEdit = (transportStudent) => {
    setEditingStudent(transportStudent);
    setFormData(transportStudent);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this student from transport?")) {
      const updated = transportStudents.filter((ts) => ts.id !== id);
      setTransportStudents(updated);
      localStorage.setItem("transport-students", JSON.stringify(updated));
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStudent(null);
    setFormData({
      studentId: "",
      routeId: "",
      stopId: "",
      tripType: "Both",
      status: "Active",
    });
  };

  const getStudentInfo = (studentId) => {
    const student = students.find((s) => s.id === studentId);
    return student ? { name: `${student.firstName} ${student.lastName}`, class: student.class } : { name: "Unknown", class: "-" };
  };

  const getRouteName = (routeId) => {
    const route = routes.find((r) => r.id === routeId);
    return route ? route.routeName : "Not Assigned";
  };

  const getStopName = (stopId) => {
    const stop = stops.find((s) => s.id === stopId);
    return stop ? stop.stopName : "Not Assigned";
  };

  const getFilteredStops = () => {
    if (!formData.routeId) return [];
    const route = routes.find(r => r.id === formData.routeId);
    if (!route || !route.stops) return [];
    return stops.filter(s => route.stops.includes(s.id));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="w-8 h-8 text-pink-600" />
            Transport Students
          </h1>
          <p className="text-gray-600 mt-1">Assign students to routes and stops</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition"
        >
          <Plus className="w-5 h-5" />
          Assign Student
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100">Total Assigned</p>
              <p className="text-3xl font-bold">{transportStudents.length}</p>
            </div>
            <Users className="w-12 h-12 text-pink-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Active Students</p>
              <p className="text-3xl font-bold">{transportStudents.filter(ts => ts.status === "Active").length}</p>
            </div>
            <UserCheck className="w-12 h-12 text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Inactive Students</p>
              <p className="text-3xl font-bold">{transportStudents.filter(ts => ts.status === "Inactive").length}</p>
            </div>
            <Users className="w-12 h-12 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {transportStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Users className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No students assigned to transport</p>
            <p className="text-gray-400 text-sm">Click "Assign Student" to add students to transport</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stop
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trip Type
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
              {transportStudents.map((ts) => {
                const studentInfo = getStudentInfo(ts.studentId);
                return (
                  <tr key={ts.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-pink-600" />
                        <span className="font-medium text-gray-900">{studentInfo.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{studentInfo.class}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-gray-700">
                        <RouteIcon className="w-4 h-4 text-green-600" />
                        <span>{getRouteName(ts.routeId)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-gray-700">
                        <MapPin className="w-4 h-4 text-orange-500" />
                        <span>{getStopName(ts.stopId)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        {ts.tripType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          ts.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {ts.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(ts)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(ts.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
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
                {editingStudent ? "Edit Transport Assignment" : "Assign Student to Transport"}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Student <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  >
                    <option value="">Choose a student</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.firstName} {student.lastName} - Class {student.class}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Route <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="routeId"
                    value={formData.routeId}
                    onChange={(e) => {
                      handleInputChange(e);
                      setFormData({ ...formData, routeId: e.target.value, stopId: "" });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
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
                    Select Stop <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="stopId"
                    value={formData.stopId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                    disabled={!formData.routeId}
                  >
                    <option value="">Choose a stop</option>
                    {getFilteredStops().map((stop) => (
                      <option key={stop.id} value={stop.id}>
                        {stop.stopName}
                      </option>
                    ))}
                  </select>
                  {!formData.routeId && (
                    <p className="text-xs text-gray-500 mt-1">Select a route first</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trip Type</label>
                  <select
                    name="tripType"
                    value={formData.tripType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="Both">Both (Pickup & Drop)</option>
                    <option value="Pickup Only">Pickup Only</option>
                    <option value="Drop Only">Drop Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
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
                  className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
                >
                  {editingStudent ? "Update Assignment" : "Assign Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransportStudents;
