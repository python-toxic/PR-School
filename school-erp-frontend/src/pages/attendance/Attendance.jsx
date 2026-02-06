import { useUser } from "../../context/UserContext.jsx";
import StudenAttendance from "./StudentAttendance.jsx";
import ParentAttendance from "./ParentAttendance.jsx";
import TeacherAttendance from "./TeacherAttendance.jsx";
import { ROLES } from "../../constants/roles.js";




export default function Students() {

  const {user}=useUser();

  if(user.role===ROLES.STUDENT) return <StudenAttendance/>;

  if(user.role=== ROLES.PARENT) return <ParentAttendance/>;

  if(user.role=== ROLES.TEACHER) return <TeacherAttendance/>;

  
}
