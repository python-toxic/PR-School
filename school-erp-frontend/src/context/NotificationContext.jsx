import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Restore persisted notifications on load
  useEffect(() => {
    const saved = localStorage.getItem("notifications");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      setNotifications(Array.isArray(parsed) ? parsed : []);
    } catch (err) {
      // Ignore malformed payloads
    }
  }, []);

  const addNotification = useCallback((notification) => {
    const id = notification.notificationId || notification.id || Math.random().toString(36).substr(2, 9);
    const newNotification = {
      notificationId: id,
      id,
      referenceId: notification.referenceId || null,
      userId: notification.userId || null,
      type: notification.type || "system",
      createdAt: notification.createdAt || new Date().toISOString(),
      timestamp: notification.createdAt || new Date().toISOString(),
      read: false,
      isRead: false,
      autoDismiss: notification.autoDismiss ?? !notification.persistent,
      ...notification,
    };

    setNotifications((prev) => [newNotification, ...prev]);
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id && n.notificationId !== id));
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id || n.notificationId === id
          ? { ...n, read: true, isRead: true }
          : n
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true, isRead: true })));
  }, []);

  const markByReference = useCallback((referenceId, type) => {
    if (!referenceId) return;
    setNotifications((prev) =>
      prev.map((n) =>
        n.referenceId === referenceId && (!type || n.type === type)
          ? { ...n, read: true, isRead: true }
          : n
      )
    );
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const getUnreadCount = useCallback(
    (type) => {
      return notifications.filter((n) => !n.read && (!type || n.type === type)).length;
    },
    [notifications]
  );

  // Persist notifications for reuse across pages
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        markAsRead,
        markAllAsRead,
        markByReference,
        clearAll,
        getUnreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
};
