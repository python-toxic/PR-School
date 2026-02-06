// layouts/cards/MyClassesCard.jsx
import { BookOpen, Clock } from "lucide-react";
import CardShell from "./CardShell.jsx";
import { useNavigate } from "react-router-dom";

export default function MyClassesCard({ classes = [] }) {
  const navigate=useNavigate();
  return (
    <CardShell title="My Classes Today" icon={BookOpen} >
      {classes.length === 0 ? (
        <p className="text-gray-500">No classes scheduled</p>
      ) : (
        classes.map((c, i) => (
          <div
            key={i}
            className="flex items-center justify-between border-b last:border-b-0 py-2"
          >
            <div>
              <p className="font-medium">{c.subject}</p>
              <p className="text-sm text-gray-500">
                Class {c.class}
              </p>
            </div>

            <div className="flex items-center gap-1 text-sm text-blue-600">
              <Clock size={14} />
              <span>{c.time}</span>
            </div>
           
          </div>
        ))
      )}
       <button 
       style={{
        color:"blue",
        textDecoration:"underline"
       }}
       onClick={()=>navigate("/academics")}>
              view
        </button>
    </CardShell>
  );
}
