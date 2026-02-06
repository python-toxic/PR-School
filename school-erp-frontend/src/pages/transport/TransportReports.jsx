import React, { useState, useEffect } from "react";
import { BarChart3, Download, Filter, Calendar, Route as RouteIcon, Bus, Users, TrendingUp } from "lucide-react";
import * as XLSX from "xlsx";

const TransportReports = () => {
  const [transportStudents, setTransportStudents] = useState([]);
  const [students, setStudents] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [trips, setTrips] = useState([]);
  const [stops, setStops] = useState([]);
  const [selectedReport, setSelectedReport] = useState("student-list");
  const [filterRoute, setFilterRoute] = useState("");
  const [filterClass, setFilterClass] = useState("");

  useEffect(() => {
    const savedTransportStudents = JSON.parse(localStorage.getItem("transport-students") || "[]");
    const savedStudents = JSON.parse(localStorage.getItem("students-list") || "[]");
    const savedRoutes = JSON.parse(localStorage.getItem("transport-routes") || "[]");
    const savedVehicles = JSON.parse(localStorage.getItem("transport-vehicles") || "[]");
    const savedTrips = JSON.parse(localStorage.getItem("transport-trips") || "[]");
    const savedStops = JSON.parse(localStorage.getItem("transport-stops") || "[]");
    
    setTransportStudents(savedTransportStudents);
    setStudents(savedStudents);
    setRoutes(savedRoutes);
    setVehicles(savedVehicles);
    setTrips(savedTrips);
    setStops(savedStops);
  }, []);

  const getStudentInfo = (studentId) => {
    const student = students.find((s) => s.id === studentId);
    return student || { firstName: "Unknown", lastName: "", class: "-", contactNumber: "-" };
  };

  const getRouteName = (routeId) => {
    const route = routes.find((r) => r.id === routeId);
    return route ? route.routeName : "Not Assigned";
  };

  const getStopName = (stopId) => {
    const stop = stops.find((s) => s.id === stopId);
    return stop ? stop.stopName : "Not Assigned";
  };

  const getVehicleName = (vehicleId) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    return vehicle ? vehicle.vehicleNumber : "Not Assigned";
  };

  // Student Transport List Report
  const generateStudentListReport = () => {
    let data = transportStudents.filter(ts => ts.status === "Active");
    
    if (filterRoute) {
      data = data.filter(ts => ts.routeId === filterRoute);
    }
    
    if (filterClass) {
      data = data.filter(ts => {
        const student = getStudentInfo(ts.studentId);
        return student.class === filterClass;
      });
    }

    return data.map(ts => {
      const student = getStudentInfo(ts.studentId);
      return {
        "Student Name": `${student.firstName} ${student.lastName}`,
        "Class": student.class,
        "Contact": student.contactNumber || "-",
        "Route": getRouteName(ts.routeId),
        "Stop": getStopName(ts.stopId),
        "Trip Type": ts.tripType,
        "Status": ts.status,
      };
    });
  };

  // Route-wise Strength Report
  const generateRouteStrengthReport = () => {
    const routeData = {};
    routes.forEach(route => {
      const studentsOnRoute = transportStudents.filter(
        ts => ts.routeId === route.id && ts.status === "Active"
      );
      routeData[route.routeName] = studentsOnRoute.length;
    });

    return Object.entries(routeData).map(([routeName, count]) => ({
      "Route Name": routeName,
      "Total Students": count,
      "Capacity Status": "Normal",
    }));
  };

  // Vehicle Utilization Report
  const generateVehicleUtilizationReport = () => {
    return vehicles.map(vehicle => {
      const assignedRoute = routes.find(r => r.assignedVehicle === vehicle.id);
      const studentsCount = assignedRoute 
        ? transportStudents.filter(ts => ts.routeId === assignedRoute.id && ts.status === "Active").length 
        : 0;
      const utilizationPercent = vehicle.capacity ? Math.round((studentsCount / vehicle.capacity) * 100) : 0;

      return {
        "Vehicle Number": vehicle.vehicleNumber,
        "Vehicle Type": vehicle.vehicleType,
        "Capacity": vehicle.capacity,
        "Assigned Students": studentsCount,
        "Utilization %": utilizationPercent,
        "Status": vehicle.status,
      };
    });
  };

  // Trip History Report
  const generateTripHistoryReport = () => {
    return trips.map(trip => ({
      "Date": new Date(trip.date).toLocaleDateString(),
      "Time": trip.time,
      "Trip Type": trip.tripType,
      "Route": getRouteName(trip.routeId),
      "Vehicle": getVehicleName(trip.vehicleId),
      "Status": trip.status,
    }));
  };

  // Export to Excel
  const handleExport = () => {
    let data = [];
    let fileName = "";

    switch (selectedReport) {
      case "student-list":
        data = generateStudentListReport();
        fileName = `transport-student-list-${Date.now()}.xlsx`;
        break;
      case "route-strength":
        data = generateRouteStrengthReport();
        fileName = `route-strength-report-${Date.now()}.xlsx`;
        break;
      case "vehicle-utilization":
        data = generateVehicleUtilizationReport();
        fileName = `vehicle-utilization-${Date.now()}.xlsx`;
        break;
      case "trip-history":
        data = generateTripHistoryReport();
        fileName = `trip-history-${Date.now()}.xlsx`;
        break;
      default:
        data = [];
    }

    if (data.length === 0) {
      alert("No data available to export");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, fileName);
  };

  // Get classes from students
  const getClasses = () => {
    const classSet = new Set(students.map(s => s.class));
    return Array.from(classSet).sort();
  };

  // Render Report Content
  const renderReportContent = () => {
    switch (selectedReport) {
      case "student-list":
        const studentData = generateStudentListReport();
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stop</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trip Type</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {studentData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{row["Student Name"]}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{row["Class"]}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{row["Route"]}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{row["Stop"]}</td>
                    <td className="px-6 py-4 text-sm"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">{row["Trip Type"]}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "route-strength":
        const routeData = generateRouteStrengthReport();
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {routeData.map((route, idx) => (
              <div key={idx} className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <RouteIcon className="w-5 h-5 text-green-600" />
                  <h3 className="font-bold text-gray-800">{route["Route Name"]}</h3>
                </div>
                <p className="text-3xl font-bold text-green-600">{route["Total Students"]}</p>
                <p className="text-sm text-gray-600">Students on this route</p>
              </div>
            ))}
          </div>
        );

      case "vehicle-utilization":
        const vehicleData = generateVehicleUtilizationReport();
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilization</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vehicleData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{row["Vehicle Number"]}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{row["Vehicle Type"]}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{row["Capacity"]}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{row["Assigned Students"]}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              row["Utilization %"] > 80 ? "bg-red-500" : row["Utilization %"] > 60 ? "bg-yellow-500" : "bg-green-500"
                            }`}
                            style={{ width: `${row["Utilization %"]}%` }}
                          ></div>
                        </div>
                        <span className="font-medium">{row["Utilization %"]}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        row["Status"] === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {row["Status"]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "trip-history":
        const tripData = generateTripHistoryReport();
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trip Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tripData.slice(0, 50).map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{row["Date"]}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{row["Time"]}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${
                        row["Trip Type"] === "Morning" ? "bg-orange-100 text-orange-800" : "bg-indigo-100 text-indigo-800"
                      }`}>
                        {row["Trip Type"]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{row["Route"]}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{row["Vehicle"]}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        row["Status"] === "Completed" ? "bg-green-100 text-green-800" :
                        row["Status"] === "In Progress" ? "bg-blue-100 text-blue-800" :
                        row["Status"] === "Cancelled" ? "bg-red-100 text-red-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {row["Status"]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <BarChart3 className="w-8 h-8 text-indigo-600" />
          Transport Reports
        </h1>
        <p className="text-gray-600 mt-1">Generate and export comprehensive transport reports</p>
      </div>

      {/* Report Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <button
          onClick={() => setSelectedReport("student-list")}
          className={`p-4 rounded-lg border-2 text-left transition ${
            selectedReport === "student-list"
              ? "border-indigo-600 bg-indigo-50"
              : "border-gray-200 hover:border-indigo-300"
          }`}
        >
          <Users className="w-6 h-6 text-indigo-600 mb-2" />
          <h3 className="font-bold text-gray-800">Student Transport List</h3>
          <p className="text-xs text-gray-500 mt-1">All students with transport details</p>
        </button>

        <button
          onClick={() => setSelectedReport("route-strength")}
          className={`p-4 rounded-lg border-2 text-left transition ${
            selectedReport === "route-strength"
              ? "border-green-600 bg-green-50"
              : "border-gray-200 hover:border-green-300"
          }`}
        >
          <RouteIcon className="w-6 h-6 text-green-600 mb-2" />
          <h3 className="font-bold text-gray-800">Route-wise Strength</h3>
          <p className="text-xs text-gray-500 mt-1">Students per route analysis</p>
        </button>

        <button
          onClick={() => setSelectedReport("vehicle-utilization")}
          className={`p-4 rounded-lg border-2 text-left transition ${
            selectedReport === "vehicle-utilization"
              ? "border-blue-600 bg-blue-50"
              : "border-gray-200 hover:border-blue-300"
          }`}
        >
          <Bus className="w-6 h-6 text-blue-600 mb-2" />
          <h3 className="font-bold text-gray-800">Vehicle Utilization</h3>
          <p className="text-xs text-gray-500 mt-1">Capacity vs assigned analysis</p>
        </button>

        <button
          onClick={() => setSelectedReport("trip-history")}
          className={`p-4 rounded-lg border-2 text-left transition ${
            selectedReport === "trip-history"
              ? "border-orange-600 bg-orange-50"
              : "border-gray-200 hover:border-orange-300"
          }`}
        >
          <Calendar className="w-6 h-6 text-orange-600 mb-2" />
          <h3 className="font-bold text-gray-800">Trip History</h3>
          <p className="text-xs text-gray-500 mt-1">Complete trip logs</p>
        </button>
      </div>

      {/* Filters and Export */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-600" />
            {selectedReport === "student-list" && (
              <>
                <select
                  value={filterRoute}
                  onChange={(e) => setFilterRoute(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Routes</option>
                  {routes.map((route) => (
                    <option key={route.id} value={route.id}>
                      {route.routeName}
                    </option>
                  ))}
                </select>
                <select
                  value={filterClass}
                  onChange={(e) => setFilterClass(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Classes</option>
                  {getClasses().map((cls) => (
                    <option key={cls} value={cls}>
                      Class {cls}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            <Download className="w-5 h-5" />
            Export to Excel
          </button>
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {renderReportContent()}
      </div>
    </div>
  );
};

export default TransportReports;
