import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Mail,
  Megaphone,
  CheckCircle2,
  Trash2,
  Filter,
  Clock4,
  BookOpen,
} from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";
import { useUser } from "../../context/UserContext";

const tabs = [
  { id: "all", label: "All" },
  { id: "message", label: "Messages" },
  { id: "notice", label: "Notices" },
  { id: "system", label: "System" },
];

const typeMeta = {
  message: {
    icon: <Mail className="w-4 h-4 text-blue-600" />,
    pill: "bg-blue-100 text-blue-800",
    target: (note) => (note.referenceId ? `/messages/${note.referenceId}` : "/messages"),
  },
  notice: {
    icon: <Megaphone className="w-4 h-4 text-amber-600" />,
    pill: "bg-amber-100 text-amber-800",
    target: (note) => (note.referenceId ? `/notice-board/${note.referenceId}` : "/notice-board"),
  },
  homework: {
    icon: <BookOpen className="w-4 h-4 text-indigo-600" />,
    pill: "bg-indigo-100 text-indigo-800",
    target: () => "/homework",
  },
  system: {
    icon: <Bell className="w-4 h-4 text-gray-600" />,
    pill: "bg-gray-100 text-gray-800",
    target: () => "/dashboard",
  },
};

const formatTime = (value) => {
  const date = new Date(value || Date.now());
  if (Number.isNaN(date.getTime())) return "Just now";
  const diff = Date.now() - date.getTime();
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} hr ago`;
  return date.toLocaleString();
};

export default function Notifications() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { notifications, markAsRead, markAllAsRead, clearAll } = useNotifications();
  const [activeTab, setActiveTab] = useState("all");

  const filteredNotifications = useMemo(() => {
    const normalizedRole = user?.role?.toLowerCase();
    return notifications
      .filter((n) => {
        if (!n) return false;
        if (n.recipientRole && normalizedRole) {
          return n.recipientRole.toLowerCase() === normalizedRole;
        }
        return true;
      })
      .filter((n) => (activeTab === "all" ? true : n.type === activeTab))
      .sort((a, b) => new Date(b.timestamp || b.createdAt || 0) - new Date(a.timestamp || a.createdAt || 0));
  }, [notifications, activeTab, user]);

  const unreadCount = filteredNotifications.filter((n) => !n.read).length;

  const handleOpen = (note) => {
    const meta = typeMeta[note.type] || typeMeta.system;
    markAsRead(note.id || note.notificationId);
    navigate(meta.target(note));
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-600">Stay on top of messages, notices, and system alerts.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => markAllAsRead()}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <CheckCircle2 className="w-4 h-4" /> Mark all as read
          </button>
          <button
            onClick={() => clearAll()}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
          >
            <Trash2 className="w-4 h-4" /> Clear all
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="flex items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-sm font-semibold border-b-2 ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <div className="text-sm text-gray-500 pr-2">{unreadCount} unread</div>
        </div>

        <div className="divide-y max-h-[70vh] overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No notifications</div>
          ) : (
            filteredNotifications.map((note) => {
              const meta = typeMeta[note.type] || typeMeta.system;
              return (
                <div
                  key={note.id || note.notificationId}
                  className={`p-4 flex gap-3 items-start ${note.read ? "bg-white" : "bg-blue-50"}`}
                >
                  <div className="mt-1">{meta.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[11px] font-semibold px-2 py-1 rounded-full ${meta.pill}`}>
                        {note.type?.toUpperCase() || "UPDATE"}
                      </span>
                      {!note.read && <span className="h-2 w-2 rounded-full bg-blue-600" />}
                    </div>
                    <p className={`text-sm ${note.read ? "font-semibold" : "font-bold"} text-gray-900`}>
                      {note.title || "New update"}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2">{note.message}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                      <Clock4 className="w-3 h-3" />
                      <span>{formatTime(note.timestamp || note.createdAt)}</span>
                      {note.sender && <span>• From {note.sender}</span>}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleOpen(note)}
                      className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Open
                    </button>
                    {!note.read && (
                      <button
                        onClick={() => markAsRead(note.id || note.notificationId)}
                        className="text-xs text-gray-600 hover:text-gray-800"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
