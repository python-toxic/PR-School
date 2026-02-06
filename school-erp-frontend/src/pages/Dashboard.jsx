// pages/Dashboard.jsx
import StudentDashboard from "./Dashboard/StudentDashboard.jsx";
import ParentDashboard from "./Dashboard/ParentDashboard.jsx";
import AdminDashboard from "./Dashboard/AdminDashboard.jsx";
import SuperAdminDashboard from "./Dashboard/SuperAdminDashboard.jsx";

import { dashboardMock } from "../data/dashboardMock.js";
import { useUser } from "../context/UserContext.jsx";
import TeacherDashboard from "./Dashboard/TeacherDashboard.jsx";
import { teacherDashboardMock } from "../data/teacherDashboardMock.js";
import { Navigate } from "react-router-dom";

export default function Dashboard() {
  const { user,loading } = useUser(); 

  if(loading){
    return <div>loading...</div>
  }

  if(!user){
    return <Navigate to="/login"/>;
  }

  console.log(user);

  if(!user){
    return <p className="text-gray-500">Loading Dashboard...</p>
  }

  const role = user.role?.toUpperCase();

  switch (role) {
    case "STUDENT":
      return <StudentDashboard data={dashboardMock} />;

    case "PARENT":
      return <ParentDashboard data={dashboardMock} />;

    case "TEACHER":
        return<TeacherDashboard data={teacherDashboardMock}/>

      case "ADMIN":
        return<AdminDashboard/>

      case "SUPER-ADMIN":
        return <SuperAdminDashboard/>

    default:
      return <p>Unauthorized</p>;
  }
}
