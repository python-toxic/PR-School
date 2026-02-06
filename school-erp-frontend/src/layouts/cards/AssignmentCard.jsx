// layouts/cards/AssignmentCard.jsx
import { ClipboardList } from "lucide-react";
import CardShell from "./CardShell.jsx";

export default function AssignmentCard({ assignments = [] }) {
  return (
    <CardShell title="Assignments" icon={ClipboardList}>
      {assignments.length === 0 ? (
        <p className="text-gray-500">No pending assignments</p>
      ) : (
        assignments.slice(0, 3).map((a, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className="truncate">{a.title}</span>
            <span className="text-sm font-medium text-red-600">
              {a.pending} pending
            </span>
          </div>
        ))
      )}
    </CardShell>
  );
}
