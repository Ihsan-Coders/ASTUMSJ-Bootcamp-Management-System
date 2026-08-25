import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import AnnouncementForm from "../../components/announcements/AnnouncementForm";
import AnnouncementCard from "../../components/announcements/AnnouncementCard";
import Modal from "../../components/common/Modal";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import { getAnnouncements, deleteAnnouncement } from "../../api/announcement.api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { useConfirm } from "../../context/ConfirmContext";

export default function ManageAnnouncements() {
  const { user } = useAuth();

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const { showToast } = useToast();
  const confirm = useConfirm();

  const loadAnnouncements = () => {
    setLoading(true);
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
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAnnouncements();
  }, []);

  const handleCreated = (created) => {
    setAnnouncements((current) => [created, ...current]);
  };

  const handleUpdated = (updated) => {
    setAnnouncements((current) =>
      current.map((a) => (a._id === updated._id ? updated : a)),
    );
    setEditingAnnouncement(null);
  };

  const handleDelete = async (announcement) => {
    const confirmed = await confirm(
      `Delete "${announcement.title}"? This cannot be undone.`,
      { title: "Delete Announcement", confirmLabel: "Delete" },
    );
    if (!confirmed) return;

    setDeletingId(announcement._id);
    try {
      await deleteAnnouncement(announcement._id);
      setAnnouncements((current) =>
        current.filter((a) => a._id !== announcement._id),
      );
    } catch (err) {
      showToast(
        err?.response?.data?.message || "Failed to delete announcement",
        "error",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const canManage = (announcement) =>
    user?.role === "admin" || announcement.createdBy?._id === user?.id;

  return (
    <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl font-bold text-text-primary font-[var(--font-display)]"
        >
          Manage Announcements
        </motion.h1>
      </div>

      <div className="grid lg:grid-cols-[380px_1fr] gap-6 items-start">
        <AnnouncementForm mode="create" onSuccess={handleCreated} />

        <div className="glass-card glow-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">
              All Announcements
            </h3>
            {!loading && (
              <span className="text-xs text-text-secondary">
                {announcements.length} total
              </span>
            )}
          </div>

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
                  canManage={canManage(announcement)}
                  onEdit={setEditingAnnouncement}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          {deletingId && (
            <p className="text-xs text-text-secondary mt-3">Deleting…</p>
          )}
        </div>
      </div>

      <Modal
        isOpen={!!editingAnnouncement}
        onClose={() => setEditingAnnouncement(null)}
        title="Edit Announcement"
      >
        {editingAnnouncement && (
          <AnnouncementForm
            mode="edit"
            announcement={editingAnnouncement}
            onSuccess={handleUpdated}
            onCancel={() => setEditingAnnouncement(null)}
          />
        )}
      </Modal>
    </div>
  );
}
