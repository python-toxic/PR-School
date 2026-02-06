import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, ChevronDown, Megaphone, Mail, Clock4, BookOpen } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { useUser } from "../../context/UserContext";
import { ROLES } from "../../constants/roles.js";
import { useNotifications } from "../../context/NotificationContext";

export function TopNavbar() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { notifications, markAsRead, markByReference } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [schoolProfile, setSchoolProfile] = useState({ name: "School ERP", logo: null });

  const userRole = user?.role?.toUpperCase();
  const normalizedRole = user?.role?.toLowerCase();

  // Load school profile from localStorage (saved by School Settings)
  useEffect(() => {
    const loadSchoolProfile = () => {
      try {
        const saved = localStorage.getItem("school-settings");
        if (saved) {
          const parsed = JSON.parse(saved);
          setSchoolProfile({
            name: parsed?.schoolProfile?.schoolName || "School ERP",
            logo: parsed?.schoolProfile?.logo || null,
          });
        }
      } catch (err) {
        console.error("Failed to load school profile", err);
      }
    };

    loadSchoolProfile();

    // Listen for localStorage changes from other tabs/components
    const handleStorageChange = (e) => {
      if (e.key === "school-settings") {
        loadSchoolProfile();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Custom event for same-tab updates
    const handleCustomUpdate = () => {
      loadSchoolProfile();
    };

    window.addEventListener("school-settings-updated", handleCustomUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("school-settings-updated", handleCustomUpdate);
    };
  }, []);

  const sortedNotifications = useMemo(() => {
    const filtered = (notifications || []).filter((note) => {
      if (!note) return false;
      if (note.recipientRole && normalizedRole) {
        return note.recipientRole.toLowerCase() === normalizedRole;
      }
      return true;
    });

    return filtered.sort((a, b) => {
      const aTime = new Date(a.timestamp || a.date || 0).getTime();
      const bTime = new Date(b.timestamp || b.date || 0).getTime();
      return bTime - aTime;
    });
  }, [notifications, normalizedRole]);

  if (!user) {
    return null;
  }

  const unreadCount = sortedNotifications.filter((n) => !n.read).length;
  const topNotifications = sortedNotifications.slice(0, 5);

  const canShowSearch = [
    ROLES.ADMIN,
    ROLES.TEACHER,
    ROLES.SUPER_ADMIN
  ].includes(userRole);

  const isStudentorParent=[
    ROLES.STUDENT,
    ROLES.PARENT
  ].includes(userRole);

  const getTypeMeta = (note) => {
    const type = note.type;
    switch (type) {
      case "notice":
        return {
          label: "Notice Board",
          icon: <Megaphone className="w-4 h-4 text-amber-600" />,
          pill: "bg-amber-100 text-amber-800",
          target: note.referenceId ? `/notice-board/${note.referenceId}` : "/notice-board",
        };
      case "message":
        return {
          label: "Message",
          icon: <Mail className="w-4 h-4 text-blue-600" />,
          pill: "bg-blue-100 text-blue-800",
          target: note.referenceId ? `/messages/${note.referenceId}` : "/messages",
        };
      case "homework":
        return {
          label: "Homework",
          icon: <BookOpen className="w-4 h-4 text-indigo-600" />,
          pill: "bg-indigo-100 text-indigo-800",
          target: "/homework",
        };
      default:
        return {
          label: "Update",
          icon: <Bell className="w-4 h-4 text-gray-600" />,
          pill: "bg-gray-100 text-gray-800",
          target: "/messages",
        };
    }
  };

  const handleNotificationClick = (note) => {
    if (!note) return;
    markAsRead(note.id || note.notificationId);
    if (note.referenceId) {
      markByReference(note.referenceId, note.type);
    }
    setIsOpen(false);
    navigate(getTypeMeta(note).target);
  };

  const formatTime = (value) => {
    const date = new Date(value || Date.now());
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "short",
    });
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="flex items-center gap-3 min-w-[180px]">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
            {schoolProfile.logo ? (
              <img src={schoolProfile.logo} alt="School Logo" className="h-full w-full object-cover" />
            ) : (
              <span className="text-blue-600 font-semibold">
                {schoolProfile.name?.slice(0, 2)?.toUpperCase() || "SE"}
              </span>
            )}
          </div>
          <div className="leading-tight">
            <div className="text-sm text-gray-500">School Profile</div>
            <div className="text-base font-semibold text-gray-900 truncate max-w-[220px]">{schoolProfile.name}</div>
          </div>
        </div>

        {canShowSearch && (
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search students, staff, classes..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {isStudentorParent && (
            <h1 className="text-lg font-semibold text-gray-900">
                School ERP
            </h1>
        )}
      </div>

      
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                {unreadCount}
              </Badge>
            )}
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-3 w-96 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-3 flex items-center justify-between">
                <div className="font-semibold">Notifications</div>
                <Badge className="bg-white/20 text-white border-0">
                  {sortedNotifications.length} total
                </Badge>
              </div>

              <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
                {topNotifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-500 text-sm">
                    No new notifications
                  </div>
                ) : (
                  topNotifications.map((note) => {
                    const meta = getTypeMeta(note);
                    return (
                      <button
                        key={note.id || note.notificationId}
                        onClick={() => handleNotificationClick(note)}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition flex gap-3 ${note.read ? "bg-white" : "bg-blue-50"}`}
                      >
                        <div className="flex-shrink-0 flex items-start">
                          {meta.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-[11px] font-semibold px-2 py-1 rounded-full ${meta.pill}`}>
                              {meta.label}
                            </span>
                            {!note.read && (
                              <span className="h-2 w-2 rounded-full bg-blue-600" aria-hidden="true" />
                            )}
                          </div>
                          <p className="text-sm font-semibold text-gray-900 truncate mt-1">
                            {note.title || "New update"}
                          </p>
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {note.message}
                          </p>
                          <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-2">
                            <Clock4 className="w-3 h-3" />
                            <span>{formatTime(note.timestamp)}</span>
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              <div className="grid grid-cols-2 border-t border-gray-100">
                <button
                  className="px-4 py-2 text-sm font-medium hover:bg-gray-50"
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/messages");
                  }}
                >
                  Go to Messages
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium hover:bg-gray-50 border-l border-gray-100"
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/notice-board");
                  }}
                >
                  Go to Notice Board
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-gray-200" />

        <button className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 transition-colors">
          <Avatar className="w-8 h-8">
            {user.profileImage && <AvatarImage src={user.profileImage} alt={user.name} />}
            <AvatarFallback className="bg-blue-600 text-white">
              {user.name?.[0] || "U"}
            </AvatarFallback>
          </Avatar>

          <div className="text-left hidden md:block">
            <p className="text-sm font-medium text-gray-900">
              {user.name || "User"}
            </p>
            <p className="text-xs text-gray-500">
              {user.role}
            </p>
          </div>

          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </header>
  );
}
