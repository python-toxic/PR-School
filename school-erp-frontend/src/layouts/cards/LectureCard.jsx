// components/dashboard/cards/LectureCard.jsx
import { Video } from "lucide-react";
import CardShell from "./CardShell.jsx";

export default function LectureCard({ lectures = [] }) {
  return (
    <CardShell title="Lectures" icon={Video}>
      {lectures.length === 0 ? (
        <p className="text-gray-500">No lectures today</p>
      ) : (
        lectures.slice(0, 3).map((l, i) => (
          <div key={i} className="flex justify-between">
            <span>{l.subject}</span>
            <span className="text-xs text-gray-400">{l.time}</span>
          </div>
        ))
      )}
    </CardShell>
  );
}
