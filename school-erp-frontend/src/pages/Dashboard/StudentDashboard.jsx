import NoticeCard from "../../layouts/cards/NoticeCard.jsx";
import LectureCard from "../../layouts/cards/LectureCard.jsx";
import SocialConnectCard from "../../layouts/cards/SocialConnectCard.jsx";
import  ExamCard from "../../layouts/cards/ExamCard.jsx";



export default function StudentDashboard({data}){
  console.log(data);
  if(!data){
    return null;
  }
  return(

     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <NoticeCard notices={data.notices || []} />
      <LectureCard lectures={data.lectures || []} />
      <SocialConnectCard people={data.social || []} />
      <ExamCard exams={data.exams || []} />
    </div>

  )
  
}
