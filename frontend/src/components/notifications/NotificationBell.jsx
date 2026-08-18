import { useState } from "react";

// Get notification data from our NotificationContext.
import { useNotifications } from "../../context/NotificationContext";

// API function for marking a notification as read.
import { markAsRead } from "../../api/notification.api";

export default function NotificationBell() {
  // Get notifications, unread count and refresh function
  // from NotificationContext.
  const { notifications, unreadCount, refresh } = useNotifications();

  // Controls whether the notification dropdown is visible.
  const [open, setOpen] = useState(false);

  // Mark one notification as read.
  const handleRead = async (id) => {
    // Send the request to the backend.
    await markAsRead(id);

    // Get the updated notifications.
    await refresh();
  };

  return (
    <div className="relative">
      {/* Button used to open and close notifications */}
      <button
        onClick={() => setOpen(!open)}
        className="relative text-text-primary"
      >
        🔔
        {/* Only show the badge when there are unread notifications */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gold text-obsidian text-xs w-4 h-4 rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Show notification dropdown when open is true */}
      {open && (
        <div className="absolute right-0 mt-2 w-72 glass-card glow-border rounded-lg p-3 max-h-80 overflow-y-auto z-50">
          {/* Show this when there are no notifications */}
          {notifications.length === 0 && (
            <p className="text-text-secondary text-sm">No notifications</p>
          )}

          {/* Display every notification */}
          {notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => handleRead(n._id)}
              className={`p-2 rounded text-sm cursor-pointer ${
                n.isRead
                  ? "text-text-secondary"
                  : "text-text-primary font-medium"
              }`}
            >
              {n.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
