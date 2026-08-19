import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

const BADGE_ICONS = {
  PerfectAttendance: "🎯",
  TopScorer: "🏆",
  FastSubmitter: "⚡",
  ConsistentPerformer: "📈",
};

export default function BadgeShelf({ studentId = "me" }) {
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    axiosInstance
      .get(`/badges/${studentId}`)
      .then((res) => setBadges(res.data.data));
  }, [studentId]);

  if (badges.length === 0) {
    return (
      <p className="text-text-secondary text-sm">
        No badges earned yet — keep going!
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {badges.map((b) => (
        <div
          key={b._id}
          className="glass-card glow-border rounded-lg p-3 text-center w-28"
        >
          <div className="text-3xl">{BADGE_ICONS[b.type] || "🏅"}</div>
          <div className="text-xs text-gold mt-1">{b.title}</div>
        </div>
      ))}
    </div>
  );
}
