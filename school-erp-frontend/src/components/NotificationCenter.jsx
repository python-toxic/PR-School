import {
  X,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Megaphone,
  BookOpen,
  Bell,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";

// Toast-style banner notifications shown in the top-right corner
export default function NotificationCenter() {
  const navigate = useNavigate();
  const { notifications, markAsRead, markByReference } = useNotifications();
  const [dismissed, setDismissed] = useState({});
  const timersRef = useRef({});

  // Show only the most recent few banners that are not manually dismissed
  const bannerNotifications = useMemo(() => {
    return notifications
      .filter((n) => !dismissed[n.id || n.notificationId])
      .slice(0, 3);
  }, [notifications, dismissed]);

  // Auto-dismiss handling with hover pause
  useEffect(() => {
    bannerNotifications.forEach((note) => {
      const key = note.id || note.notificationId;
      const alreadyScheduled = timersRef.current[key];
      if (alreadyScheduled || note.autoDismiss === false) return;

      const timeout = setTimeout(() => {
        setDismissed((prev) => ({ ...prev, [key]: true }));
        delete timersRef.current[key];
      }, note.durationMs || 6500);

      timersRef.current[key] = timeout;
    });

    return () => {
      Object.values(timersRef.current).forEach(clearTimeout);
      timersRef.current = {};
    };
  }, [bannerNotifications]);

  if (bannerNotifications.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle size={20} className="text-green-600" />;
      case "error":
        return <AlertCircle size={20} className="text-red-600" />;
      case "message":
        return <MessageSquare size={20} className="text-blue-600" />;
      case "notice":
        return <Megaphone size={20} className="text-amber-600" />;
      case "homework":
        return <BookOpen size={20} className="text-indigo-600" />;
      case "system":
      default:
        return <Bell size={20} className="text-gray-700" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "message":
        return "bg-blue-50 border-blue-200";
      case "notice":
        return "bg-amber-50 border-amber-200";
      case "homework":
        return "bg-indigo-50 border-indigo-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "Just now";
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return "Just now";
    const diff = Date.now() - date.getTime();
    if (diff < 60 * 1000) return "Just now";
    if (diff < 60 * 60 * 1000) return `${Math.floor(diff / 60000)} min ago`;
    if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / 3600000)} hr ago`;
    return date.toLocaleString();
  };

  const getTargetPath = (note) => {
    switch (note.type) {
      case "message":
        return note.referenceId ? `/messages/${note.referenceId}` : "/messages";
      case "notice":
        return note.referenceId ? `/notice-board/${note.referenceId}` : "/notice-board";
      case "homework":
        return "/homework";
      default:
        return "/dashboard";
    }
  };

  const handleClick = (note) => {
    const key = note.id || note.notificationId;
    markAsRead(key);
    if (note.referenceId) {
      markByReference(note.referenceId, note.type);
    }
    setDismissed((prev) => ({ ...prev, [key]: true }));
    navigate(getTargetPath(note));
  };

  return (
    <div className="fixed top-6 right-6 z-50 space-y-3 max-w-sm">
      {bannerNotifications.map((notification) => {
        const key = notification.id || notification.notificationId;
        return (
          <div
            key={key}
            className={`flex gap-3 p-4 rounded-lg border shadow-lg ${getBgColor(
              notification.type || "info"
            )} animate-slide-in cursor-pointer ${notification.read ? "opacity-90" : ""}`}
            onClick={() => handleClick(notification)}
            onMouseEnter={() => {
              const timer = timersRef.current[key];
              if (timer) {
                clearTimeout(timer);
                delete timersRef.current[key];
              }
            }}
            onMouseLeave={() => {
              if (notification.autoDismiss === false) return;
              const timer = setTimeout(() => {
                setDismissed((prev) => ({ ...prev, [key]: true }));
                delete timersRef.current[key];
              }, (notification.durationMs && notification.durationMs / 2) || 3000);
              timersRef.current[key] = timer;
            }}
          >
            <div className="flex-shrink-0">{getIcon(notification.type)}</div>
            <div className="flex-1 min-w-0">
              {notification.title && (
                <p className={`text-sm ${notification.read ? "font-semibold" : "font-bold"} text-gray-900`}>
                  {notification.title}
                </p>
              )}
              <p className="text-gray-700 text-sm mt-1 line-clamp-2">
                {notification.message}
              </p>
              <div className="flex items-center gap-2 flex-wrap mt-2">
                {notification.priority && (
                  <span className="text-xs px-2 py-1 rounded-full bg-black/5 text-gray-700 font-semibold uppercase">
                    {notification.priority}
                  </span>
                )}
                <span className="text-xs text-gray-500">{formatTime(notification.timestamp || notification.createdAt)}</span>
              </div>
              {notification.sender && (
                <p className="text-gray-600 text-xs mt-2">
                  From: <strong>{notification.sender}</strong>
                </p>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDismissed((prev) => ({ ...prev, [key]: true }));
              }}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition"
              aria-label="Dismiss notification"
            >
              <X size={18} />
            </button>
          </div>
        );
      })}

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
