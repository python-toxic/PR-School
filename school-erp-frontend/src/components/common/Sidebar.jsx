import { GraduationCap, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { menuItems } from "../../config/menuItems.js";
import { useUser } from "../../context/UserContext.jsx";
import { useNotifications } from "../../context/NotificationContext.jsx";
import { cn } from "../../lib/utils.js";

export function Sidebar({ activeItem = "dashboard", onItemClick }) {
  const { user } = useUser();
  const { notifications } = useNotifications();
  const [openMenu, setOpenMenu] = useState(null);

  const userRole = user?.role?.toUpperCase();
  const normalizedRole = user?.role?.toLowerCase();

  const roleNotifications = notifications.filter((n) => {
    if (!n) return false;
    if (n.recipientRole && normalizedRole) {
      return n.recipientRole.toLowerCase() === normalizedRole;
    }
    return true;
  });

  const unreadByType = roleNotifications.reduce(
    (acc, note) => {
      if (note.read) return acc;
      const type = note.type || "system";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    },
    { system: 0 }
  );
  
  const filteredMenu = menuItems.filter((item) =>
    item.roles.includes(userRole)
  );

  useEffect(() => {
    if (!user || !filteredMenu.length) return;

    const parent = filteredMenu.find(
      (item) =>
        item.children &&
        activeItem.startsWith(item.id + "/")
    );

    if (parent) {
      setOpenMenu(parent.id);
    }
  }, [activeItem, filteredMenu, user]);

  if (!user) return null;

  return (
    <aside className="w-64 bg-white border-r h-screen flex flex-col fixed left-0 top-0 shadow-sm z-40">
      
     
      <div className="p-4 border-b flex-shrink-0 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
            <GraduationCap className="text-blue-600" size={24} />
          </div>
          <div>
            <h2 className="font-bold text-white text-lg">School ERP</h2>
            <p className="text-xs text-blue-100 capitalize">
              {user.role} Panel
            </p>
          </div>
        </div>
      </div>

      {/* NAV */}
      <nav className="flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <ul className="space-y-0.5">
          {filteredMenu.map((item) => {
            const Icon = item.icon;
            const hasChildren = item.children?.length > 0;
            const isOpen = openMenu === item.id;

            const isParentActive =
              activeItem === item.id ||
              activeItem.startsWith(item.id + "/");

            // Filter children by role (important for security)
            const visibleChildren = item.children?.filter((child) =>
              child.roles.includes(userRole)
            );

            return (
              <li key={item.id}>
                {/* PARENT ITEM */}
                <button
                  onClick={() => {
                    if (hasChildren) {
                      setOpenMenu(isOpen ? null : item.id);
                    } else {
                      onItemClick(item.id);
                    }
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium",
                    isParentActive
                      ? "bg-blue-50 text-blue-700 shadow-sm border-l-4 border-blue-600"
                      : "text-gray-700 hover:bg-gray-50 border-l-4 border-transparent hover:border-gray-300"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                    {item.id === "messages" && unreadByType.message ? (
                      <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-[11px] font-semibold rounded-full bg-blue-100 text-blue-700">
                        {unreadByType.message}
                      </span>
                    ) : null}
                    {item.id === "notice-board" && unreadByType.notice ? (
                      <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-[11px] font-semibold rounded-full bg-amber-100 text-amber-800">
                        {unreadByType.notice}
                      </span>
                    ) : null}
                  </div>

                  {hasChildren && (
                    <ChevronDown
                      className={cn(
                        "w-3.5 h-3.5 transition-transform duration-200 flex-shrink-0",
                        isOpen && "rotate-180"
                      )}
                    />
                  )}
                </button>

                {/* CHILD ITEMS */}
                {hasChildren && isOpen && (
                  <ul className="ml-6 mt-1 space-y-0.5 border-l-2 border-gray-200 pl-3">
                    {visibleChildren.map((child) => {
                      const isChildActive =
                        activeItem === `${item.id}/${child.id}`;

                      return (
                        <li key={child.id}>
                          <button
                            onClick={() =>
                              onItemClick(`${item.id}/${child.id}`)
                            }
                            className={cn(
                              "w-full text-left px-3 py-1.5 rounded-md text-xs transition-all duration-200 font-medium",
                              isChildActive
                                ? "bg-blue-50 text-blue-700"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                          >
                            {child.label}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
