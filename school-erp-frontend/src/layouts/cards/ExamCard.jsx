// components/dashboard/cards/ExamCard.jsx
import { FileText } from "lucide-react";
import CardShell from "./CardShell";

export default function ExamCard({ exams = [] }) {
  return (
    <CardShell title="Examinations" icon={FileText}>
      {exams.length === 0 ? (
        <p className="text-gray-500">No upcoming exams</p>
      ) : (
        exams.slice(0, 3).map((e, i) => (
          <div key={i} className="flex justify-between">
            <span>{e.subject}</span>
            <span className="text-xs font-medium text-blue-600">
              {e.date}
            </span>
          </div>
        ))
      )}
    </CardShell>
  );
}
