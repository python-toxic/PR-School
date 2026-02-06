import { useUser } from "../../context/UserContext.jsx";
import StudentLibraryPage from "./StudentLibraryPage.jsx";
import ParentLibraryPage from "./ParentLibraryPage.jsx";
import TeacherLibraryPage from "./TeacherLibraryPage.jsx";




export default function Library() {

  const {user,loading}=useUser();

  switch(user.role){
  
      case "TEACHER":
        return <TeacherLibraryPage/>;
  
      case "STUDENT":
        return <StudentLibraryPage/>;
  
      case "PARENT":
        return <ParentLibraryPage/>;


  
}
}
