import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import AnnouncementCard from "../../components/announcements/AnnouncementCard";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import { getAnnouncements } from "../../api/announcement.api";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAnnouncements()
      .then((res) => {
        setAnnouncements(res.data.data || []);
        setError("");
      })
      .catch((err) => {
        setError(
          err?.response?.data?.message || "Failed to load announcements",
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-3xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl sm:text-3xl font-bold text-text-primary font-[var(--font-display)] mb-6"
      >
        Announcements
      </motion.h1>

      {error && <p className="text-danger text-sm mb-3">{error}</p>}

      {loading && <Loader />}

      {!loading && announcements.length === 0 && !error && (
        <EmptyState message="No announcements yet" icon="📢" />
      )}

      {!loading && announcements.length > 0 && (
        <div className="space-y-3">
          {announcements.map((announcement) => (
            <AnnouncementCard
              key={announcement._id}
              announcement={announcement}
            />
          ))}
        </div>
      )}
    </div>
  );
}
