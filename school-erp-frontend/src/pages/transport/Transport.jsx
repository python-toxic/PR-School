import { useUser } from "../../context/UserContext.jsx";
import StudentTransportPage from "./StudentTransportPage.jsx";
import TransportDashboard from "./TransportDashboard.jsx";

export default function Transport() {
  const { user, loading } = useUser();

  if (loading) return <div>Loading...</div>;

  switch (user.role) {
    case "STUDENT":
      return <StudentTransportPage />;
    default:
      return <TransportDashboard />;
  }
}
