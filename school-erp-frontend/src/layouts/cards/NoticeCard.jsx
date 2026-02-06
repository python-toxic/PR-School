// components/dashboard/cards/NoticeCard.jsx
import { Bell } from "lucide-react";
import CardShell from "./CardShell.jsx";

export default function NoticeCard({ notices = [] }) {
  return (
    <CardShell title="Notices" icon={Bell}>
      {notices.length === 0 ? (
        <p className="text-gray-500">No new notices</p>
      ) : (
        notices.slice(0, 3).map((n, i) => (
          <div key={i} className="flex justify-between">
            <span className="truncate">{n.title}</span>
            <span className="text-xs text-gray-400">{n.date}</span>
          </div>
        ))
      )}
    </CardShell>
  );
}
