import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationRead,
  markAllNotificationsRead,
} from "../api/notification.api";

const NotificationContext = createContext();

// No websocket infrastructure in this app, so the unread count is kept
// fresh with lightweight polling instead.
const POLL_INTERVAL_MS = 30000;

export function NotificationProvider({ children }) {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotifications = useCallback(() => {
    if (!user) return;
    setLoading(true);
    getNotifications()
      .then((res) => {
        setNotifications(res.data.data || []);
        setError("");
      })
      .catch((err) => {
        setError(
          err?.response?.data?.message || "Failed to load notifications",
        );
      })
      .finally(() => setLoading(false));
  }, [user]);

  const refreshUnreadCount = useCallback(() => {
    if (!user) return;
    getUnreadNotificationCount()
      .then((res) => setUnreadCount(res.data.data?.count || 0))
      .catch(() => {
        // Non-critical background refresh — leave the last known count.
      });
  }, [user]);

  const resetNotificationState = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      resetNotificationState();
      return;
    }

    fetchNotifications();
    refreshUnreadCount();

    const interval = setInterval(refreshUnreadCount, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [user, fetchNotifications, refreshUnreadCount, resetNotificationState]);

  const markAsRead = async (id) => {
    const target = notifications.find((n) => n._id === id);
    // Already read (or unknown) — nothing to do, avoids an unnecessary
    // request and an incorrect double-decrement of the unread count.
    if (!target || target.isRead) return;

    setNotifications((current) =>
      current.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
    );
    setUnreadCount((count) => Math.max(0, count - 1));

    try {
      await markNotificationRead(id);
    } catch {
      // Roll back this one item on failure.
      setNotifications((current) =>
        current.map((n) => (n._id === id ? { ...n, isRead: false } : n)),
      );
      setUnreadCount((count) => count + 1);
    }
  };

  const markAllAsRead = async () => {
    const previousNotifications = notifications;
    const previousCount = unreadCount;

    if (previousCount === 0) return;

    setNotifications((current) =>
      current.map((n) => ({ ...n, isRead: true })),
    );
    setUnreadCount(0);

    try {
      await markAllNotificationsRead();
    } catch {
      setNotifications(previousNotifications);
      setUnreadCount(previousCount);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        error,
        markAsRead,
        markAllAsRead,
        refresh: fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
