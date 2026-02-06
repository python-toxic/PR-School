import React, { useState, useEffect } from "react";
import { Radio, MapPin, Bus, Navigation, Clock, Phone, AlertCircle } from "lucide-react";

const LiveTracking = () => {
  const [trips, setTrips] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);

  useEffect(() => {
    const savedTrips = JSON.parse(localStorage.getItem("transport-trips") || "[]");
    const savedRoutes = JSON.parse(localStorage.getItem("transport-routes") || "[]");
    const savedVehicles = JSON.parse(localStorage.getItem("transport-vehicles") || "[]");
    const savedDrivers = JSON.parse(localStorage.getItem("transport-drivers") || "[]");
    
    setTrips(savedTrips.filter(t => t.status === "In Progress" || t.status === "Scheduled"));
    setRoutes(savedRoutes);
    setVehicles(savedVehicles);
    setDrivers(savedDrivers);
  }, []);

  const getRouteName = (routeId) => {
    const route = routes.find((r) => r.id === routeId);
    return route ? route.routeName : "Unknown Route";
  };

  const getVehicleInfo = (vehicleId) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    return vehicle ? { number: vehicle.vehicleNumber, type: vehicle.vehicleType } : { number: "Unknown", type: "-" };
  };

  const getDriverInfo = (driverId) => {
    const driver = drivers.find((d) => d.id === driverId);
    return driver ? { name: driver.driverName, contact: driver.contactNumber } : { name: "Unknown", contact: "-" };
  };

  const getRouteInfo = (routeId) => {
    const route = routes.find((r) => r.id === routeId);
    return route || null;
  };

  const getTodayActiveTrips = () => {
    const today = new Date().toISOString().split("T")[0];
    return trips.filter(t => t.date === today);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Radio className="w-8 h-8 text-red-600" />
          Live Bus Tracking
        </h1>
        <p className="text-gray-600 mt-1">Real-time location tracking of transport vehicles</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100">Active Trips</p>
              <p className="text-3xl font-bold">{getTodayActiveTrips().length}</p>
            </div>
            <Bus className="w-10 h-10 text-red-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">In Progress</p>
              <p className="text-3xl font-bold">{trips.filter(t => t.status === "In Progress").length}</p>
            </div>
            <Navigation className="w-10 h-10 text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100">Scheduled</p>
              <p className="text-3xl font-bold">{trips.filter(t => t.status === "Scheduled").length}</p>
            </div>
            <Clock className="w-10 h-10 text-yellow-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Routes</p>
              <p className="text-3xl font-bold">{routes.length}</p>
            </div>
            <MapPin className="w-10 h-10 text-blue-200" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Trips List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Bus className="w-5 h-5 text-red-600" />
            Active Trips
          </h2>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {getTodayActiveTrips().length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Bus className="w-12 h-12 text-gray-300 mb-2" />
                <p className="text-gray-500 text-sm">No active trips</p>
              </div>
            ) : (
              getTodayActiveTrips().map((trip) => {
                const vehicleInfo = getVehicleInfo(trip.vehicleId);
                const driverInfo = getDriverInfo(trip.driverId);
                return (
                  <div
                    key={trip.id}
                    onClick={() => setSelectedTrip(trip)}
                    className={`p-3 border rounded-lg cursor-pointer transition ${
                      selectedTrip?.id === trip.id
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-red-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Bus className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-gray-900">{vehicleInfo.number}</span>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          trip.status === "In Progress"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {trip.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{getRouteName(trip.routeId)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{trip.time} - {trip.tripType}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span>{driverInfo.name}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Map and Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Map Placeholder */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 text-white">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Navigation className="w-5 h-5" />
                Live Location Map
              </h2>
            </div>
            <div className="relative h-[400px] bg-gray-100 flex items-center justify-center">
              {selectedTrip ? (
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-red-500 mx-auto mb-4 animate-bounce" />
                  <p className="text-gray-700 font-medium">
                    Tracking: {getVehicleInfo(selectedTrip.vehicleId).number}
                  </p>
                  <p className="text-gray-500 text-sm">Route: {getRouteName(selectedTrip.routeId)}</p>
                  <div className="mt-6 bg-white rounded-lg p-4 max-w-sm mx-auto shadow-md">
                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-semibold">GPS Tracking (Demo Mode)</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      In production, this area would display a real-time map with GPS coordinates using Google Maps or Mapbox API.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Select a trip to view live location</p>
                </div>
              )}
            </div>
          </div>

          {/* Trip Details */}
          {selectedTrip && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Bus className="w-5 h-5 text-blue-600" />
                Trip Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Vehicle</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Bus className="w-4 h-4 text-blue-600" />
                      <p className="font-medium text-gray-900">
                        {getVehicleInfo(selectedTrip.vehicleId).number}
                      </p>
                      <span className="text-xs text-gray-500">
                        ({getVehicleInfo(selectedTrip.vehicleId).type})
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Driver</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="w-4 h-4 text-purple-600" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {getDriverInfo(selectedTrip.driverId).name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {getDriverInfo(selectedTrip.driverId).contact}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Trip Type</p>
                    <p className="font-medium text-gray-900 mt-1">{selectedTrip.tripType}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Route</p>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-4 h-4 text-orange-600" />
                      <p className="font-medium text-gray-900">{getRouteName(selectedTrip.routeId)}</p>
                    </div>
                    {getRouteInfo(selectedTrip.routeId) && (
                      <div className="mt-2 text-sm text-gray-600">
                        <p>{getRouteInfo(selectedTrip.routeId).startPoint} → {getRouteInfo(selectedTrip.routeId).endPoint}</p>
                        {getRouteInfo(selectedTrip.routeId).distance && (
                          <p className="text-xs text-gray-500">Distance: {getRouteInfo(selectedTrip.routeId).distance} km</p>
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Schedule</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4 text-cyan-600" />
                      <div>
                        <p className="font-medium text-gray-900">{selectedTrip.time}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(selectedTrip.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span
                      className={`inline-block mt-1 px-3 py-1 text-sm font-semibold rounded-full ${
                        selectedTrip.status === "In Progress"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {selectedTrip.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* ETA Section */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 text-blue-700 mb-2">
                  <Navigation className="w-5 h-5" />
                  <span className="font-semibold">Estimated Time of Arrival</span>
                </div>
                <p className="text-2xl font-bold text-blue-900">
                  {selectedTrip.tripType === "Morning" ? "25 mins" : "18 mins"}
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  Current Location: {selectedTrip.tripType === "Morning" ? "Near Stop 3 of 8" : "Near Stop 5 of 8"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;
