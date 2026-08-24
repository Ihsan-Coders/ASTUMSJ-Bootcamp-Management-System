import { useEffect, useRef, useState } from "react";
import {
  Bell,
  Megaphone,
  ClipboardList,
  Award,
  AlertTriangle,
  CheckCheck,
} from "lucide-react";
import Loader from "../common/Loader";
import EmptyState from "../common/EmptyState";
import { useNotifications } from "../../context/NotificationContext";

const TYPE_ICON = {
  NewAssignment: ClipboardList,
  Announcement: Megaphone,
  GradePosted: Award,
  DeadlineApproaching: AlertTriangle,
};

const TYPE_COLOR = {
  NewAssignment: "text-gold",
  Announcement: "text-emerald",
  GradePosted: "text-emerald",
  DeadlineApproaching: "text-warning",
};

function timeAgo(dateString) {
  const seconds = Math.floor((Date.now() - new Date(dateString)) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateString).toLocaleDateString();
}

export default function NotificationBell() {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refresh,
  } = useNotifications();

  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Close the dropdown when clicking outside it.
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    if (next) refresh(); // pull fresh data whenever the dropdown opens
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={handleToggle}
        className="relative p-2 rounded-full text-gold hover:bg-gold/10 transition-colors"
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-danger text-white text-[10px] font-semibold leading-none">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-w-[90vw] glass-card glow-border rounded-lg shadow-xl overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h4 className="text-sm font-semibold text-text-primary">
              Notifications
            </h4>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1 text-xs text-gold hover:underline"
              >
                <CheckCheck size={14} />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {error && <p className="text-danger text-sm p-4">{error}</p>}

            {loading && <Loader size="sm" />}

            {!loading && notifications.length === 0 && !error && (
              <EmptyState message="No notifications yet" icon="🔔" />
            )}

            {!loading &&
              notifications.map((n) => {
                const Icon = TYPE_ICON[n.type] || Bell;
                const color = TYPE_COLOR[n.type] || "text-text-secondary";
                return (
                  <button
                    key={n._id}
                    onClick={() => markAsRead(n._id)}
                    className={`w-full text-left px-4 py-3 flex gap-3 border-b border-border/50 last:border-b-0 transition-colors hover:bg-gold/5 ${
                      n.isRead ? "opacity-60" : ""
                    }`}
                  >
                    <Icon size={16} className={`shrink-0 mt-0.5 ${color}`} />
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm text-text-primary">
                        {n.message}
                      </span>
                      <span className="block text-xs text-text-secondary mt-1">
                        {timeAgo(n.createdAt)}
                      </span>
                    </span>
                    {!n.isRead && (
                      <span className="shrink-0 w-2 h-2 mt-1.5 rounded-full bg-gold" />
                    )}
                  </button>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
