import TeacherHomework from "./TeacherHomeWork";
import StudentHomework from "./StudentHomework";
import ParentHomework from "./ParentHomework";
import { useUser } from "../../context/UserContext.jsx";



export default function Homework() {
  const { user, loading } = useUser();

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  const role = (user?.role || "").toUpperCase();

  switch (role) {
    case "TEACHER":
      return <TeacherHomework />;
    case "STUDENT":
      return <StudentHomework />;
    case "PARENT":
      return <ParentHomework />;
    default:
      // Fallback to student view if role is missing/unknown
      return <StudentHomework />;
  }
}
