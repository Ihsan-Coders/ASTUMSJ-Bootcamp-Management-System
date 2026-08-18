// This component displays one announcement.
export default function AnnouncementCard({ announcement }) {
  return (
    <div className="glass-card glow-border rounded-lg p-4">
      {/* Announcement title */}
      <h2 className="text-text-primary text-lg font-semibold">
        {announcement.title}
      </h2>

      {/* Announcement content */}
      <p className="text-text-secondary mt-2">{announcement.content}</p>

      {/* Announcement publication date */}
      <p className="text-text-secondary text-sm mt-3">
        {new Date(announcement.publishDate).toLocaleDateString()}
      </p>
    </div>
  );
}
