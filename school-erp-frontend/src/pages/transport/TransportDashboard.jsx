import { useNavigate } from "react-router-dom";
import { Bus, Route, Users, MapPin, Calendar, UserCheck, BarChart3, Radio } from "lucide-react";
import { useEffect, useState } from "react";

const cards = [
  {
    title: "Vehicles",
    count: 0,
    icon: Bus,
    color: "from-blue-500 to-blue-600",
    route: "/transport/vehicles",
  },
  {
    title: "Routes",
    count: 0,
    icon: Route,
    color: "from-green-500 to-green-600",
    route: "/transport/routes",
  },
  {
    title: "Drivers",
    count: 0,
    icon: Users,
    color: "from-purple-500 to-purple-600",
    route: "/transport/drivers",
  },
  {
    title: "Stops",
    count: 0,
    icon: MapPin,
    color: "from-orange-500 to-orange-600",
    route: "/transport/stops",
  },
  {
    title: "Today's Trips",
    count: 0,
    icon: Calendar,
    color: "from-cyan-500 to-cyan-600",
    route: "/transport/trips",
  },
  {
    title: "Assigned Students",
    count: 0,
    icon: UserCheck,
    color: "from-pink-500 to-pink-600",
    route: "/transport/students",
  },
];

const modules = [
  {
    title: "Live Tracking",
    description: "Track vehicles in real-time on map",
    icon: Radio,
    route: "/transport/tracking",
    color: "bg-gradient-to-br from-red-500 to-red-600",
  },
  {
    title: "Reports",
    description: "Analytics and transport reports",
    icon: BarChart3,
    route: "/transport/reports",
    color: "bg-gradient-to-br from-indigo-500 to-indigo-600",
  },
];

export default function TransportDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(cards);

  useEffect(() => {
    // Load counts from localStorage
    const vehicles = JSON.parse(localStorage.getItem("transport-vehicles") || "[]");
    const routes = JSON.parse(localStorage.getItem("transport-routes") || "[]");
    const drivers = JSON.parse(localStorage.getItem("transport-drivers") || "[]");
    const stops = JSON.parse(localStorage.getItem("transport-stops") || "[]");
    const students = JSON.parse(localStorage.getItem("transport-students") || "[]");
    const trips = JSON.parse(localStorage.getItem("transport-trips") || "[]");

    const today = new Date().toDateString();
    const todayTrips = trips.filter(t => new Date(t.date).toDateString() === today);

    setStats([
      { ...cards[0], count: vehicles.length },
      { ...cards[1], count: routes.filter(r => r.status === "Active").length },
      { ...cards[2], count: drivers.filter(d => d.status === "Active").length },
      { ...cards[3], count: stops.length },
      { ...cards[4], count: todayTrips.length },
      { ...cards[5], count: students.filter(s => s.status === "Active").length },
    ]);
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Transport Management</h1>
        <p className="text-sm text-slate-600 mt-1">Manage vehicles, routes, drivers, and student transport assignments</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              onClick={() => navigate(card.route)}
              className={`bg-gradient-to-br ${card.color} text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">{card.title}</p>
                  <h3 className="text-4xl font-bold mt-2">{card.count}</h3>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <Icon size={32} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Module Cards */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <div
                key={module.title}
                onClick={() => navigate(module.route)}
                className={`${module.color} text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1`}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-4 rounded-lg">
                    <Icon size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{module.title}</h3>
                    <p className="text-white/80 text-sm mt-1">{module.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Automatic Sync</h3>
        <p className="text-sm text-blue-800">
          Transport data is automatically synchronized across Student, Parent, Class, and Fees modules. 
          When you enable transport during admission, fees are automatically applied and parents can track buses in real-time.
        </p>
      </div>
    </div>
  );
}
