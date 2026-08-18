// React functions used to create and manage our context.
import { createContext, useContext, useEffect, useState } from "react";

// API function used to get notifications from the backend.
import { getNotifications } from "../api/notification.api";

// We need the logged-in user to know when
// we should request notifications.
import { useAuth } from "./AuthContext";

// Create the notification context.
const NotificationContext = createContext();

// This provider makes notification data available
// to components throughout the application.
export function NotificationProvider({ children }) {
  // Get the current logged-in user from AuthContext.
  const { user } = useAuth();

  // Store all notifications in React state.
  const [notifications, setNotifications] = useState([]);

  // Get the latest notifications from the backend.
  const refresh = async () => {
    // If nobody is logged in, don't request notifications.
    if (!user) return;

    // Ask the backend for the user's notifications.
    const res = await getNotifications();

    // Save the notifications in React state.
    setNotifications(res.data.data);
  };

  // Run refresh whenever the user changes.
  //
  // For example:
  // user logs in → get notifications
  // user logs out → refresh is called but returns because !user
  useEffect(() => {
    refresh();
  }, [user]);

  // Count notifications that haven't been read yet.
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Make these values available
  // to components using useNotifications().
  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        refresh,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

// Custom hook that allows components
// to access the NotificationContext.
export function useNotifications() {
  return useContext(NotificationContext);
}
