import { useEffect, useState } from "react";
import { Pencil, Trash2, UserRound } from "lucide-react";
import AlumniForm from "./AlumniForm";
import {
  getAlumni,
  updateAlumniProfile,
  deleteAlumniProfile,
} from "../../api/alumni.api";
import { useConfirm } from "../../context/ConfirmContext";

export default function AlumniManagement() {
  const [alumni, setAlumni] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingAlumni, setEditingAlumni] = useState(null);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const confirm = useConfirm();

  const fetchAlumni = async () => {
    try {
      setError("");

      const response = await getAlumni();

      setAlumni(response.data?.data || []);
    } catch (err) {
      console.error("Failed to load alumni:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to load alumni profiles"
      );
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAlumni();
  }, [refreshKey]);

  const handleCreated = () => {
    setRefreshKey((key) => key + 1);
  };

  const handleDelete = async (id) => {
    const confirmed = await confirm(
      "Are you sure you want to delete this alumni profile?",
      { title: "Delete Alumni Profile", confirmLabel: "Delete" }
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");

      await deleteAlumniProfile(id);

      setAlumni((prev) =>
        prev.filter((profile) => profile._id !== id)
      );
    } catch (err) {
      console.error("Failed to delete alumni:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to delete alumni profile"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = async (id, data) => {
    try {
      setError("");

      await updateAlumniProfile(id, data);

      setEditingAlumni(null);
      setRefreshKey((key) => key + 1);
    } catch (err) {
      console.error("Failed to update alumni:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to update alumni profile"
      );
    }
  };

  return (
    <div className="space-y-6">
      <AlumniForm onCreated={handleCreated} />

      {error && (
        <div className="glass-card rounded-lg p-4">
          <p className="text-danger text-sm">{error}</p>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          Alumni Profiles
        </h2>

        {alumni.length === 0 ? (
          <div className="glass-card glow-border rounded-lg p-8 text-center">
            <p className="text-text-secondary">
              No alumni profiles yet.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {alumni.map((profile) => (
              <div
                key={profile._id}
                className="glass-card glow-border rounded-lg p-5"
              >
                <div className="flex justify-center mb-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center
                               bg-gold/10 border border-gold/30
                               shadow-[0_0_20px_rgba(212,175,55,0.35)]"
                  >
                    <UserRound
                      size={30}
                      className="text-gold drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]"
                    />
                  </div>
                </div>

                <h3 className="text-center text-text-primary font-semibold">
                  {profile.student?.name || "Unknown Student"}
                </h3>

                {profile.currentRole && (
                  <p className="text-center text-gold text-sm mt-1">
                    {profile.currentRole}
                  </p>
                )}

                {profile.batch?.name && (
                  <p className="text-center text-text-secondary text-xs mt-2">
                    {profile.batch.name}
                  </p>
                )}

                {profile.testimonial && (
                  <p className="text-text-secondary text-sm mt-3 italic text-center">
                    "{profile.testimonial}"
                  </p>
                )}

                <div className="flex gap-2 mt-5">
                  <button
                    type="button"
                    onClick={() => setEditingAlumni(profile)}
                    className="flex-1 flex items-center justify-center gap-2
                               py-2 rounded-lg text-sm font-medium
                               border border-gold/30 text-gold
                               hover:bg-gold/10 transition-colors"
                  >
                    <Pencil size={15} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(profile._id)}
                    disabled={deletingId === profile._id}
                    className="flex-1 flex items-center justify-center gap-2
                               py-2 rounded-lg text-sm font-medium
                               border border-danger/30 text-danger
                               hover:bg-danger/10 transition-colors
                               disabled:opacity-50"
                  >
                    <Trash2 size={15} />
                    {deletingId === profile._id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingAlumni && (
        <EditAlumniForm
          alumni={editingAlumni}
          onCancel={() => setEditingAlumni(null)}
          onSave={handleEdit}
        />
      )}
    </div>
  );
}

function EditAlumniForm({ alumni, onCancel, onSave }) {
  const [form, setForm] = useState({
    student: alumni.student?._id || alumni.student || "",
    batch: alumni.batch?._id || alumni.batch || "",
    graduationDate: alumni.graduationDate
      ? new Date(alumni.graduationDate)
          .toISOString()
          .split("T")[0]
      : "",
    currentRole: alumni.currentRole || "",
    testimonial: alumni.testimonial || "",
    isPublic: alumni.isPublic ?? true,
  });

  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const { getUsers } = await import("../../api/user.api");
        const { getBatches } = await import("../../api/batch.api");

        const [usersResponse, batchesResponse] =
          await Promise.all([
            getUsers({ role: "student" }),
            getBatches(),
          ]);

        setStudents(usersResponse.data?.data || []);
        setBatches(batchesResponse.data?.data || []);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            "Failed to load options"
        );
      } finally {
        setLoading(false);
      }
    };

    loadOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      await onSave(alumni._id, form);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to update alumni profile"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      <form
        onSubmit={handleSubmit}
        className="glass-card glow-border rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">
            Edit Alumni Profile
          </h3>

          <button
            type="button"
            onClick={onCancel}
            className="text-text-secondary hover:text-text-primary"
          >
            ✕
          </button>
        </div>

        <div>
          <label className="block text-xs text-text-secondary mb-1">
            Student
          </label>

          <select
            name="student"
            value={form.student}
            onChange={handleChange}
            disabled={loading}
            required
            className="w-full p-2 rounded border border-border bg-background text-text-primary"
          >
            <option value="">
              {loading ? "Loading..." : "Select student"}
            </option>

            {students.map((student) => (
              <option key={student._id} value={student._id}>
                {student.name} — {student.email}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-text-secondary mb-1">
            Batch
          </label>

          <select
            name="batch"
            value={form.batch}
            onChange={handleChange}
            disabled={loading}
            required
            className="w-full p-2 rounded border border-border bg-background text-text-primary"
          >
            <option value="">
              {loading ? "Loading..." : "Select batch"}
            </option>

            {batches.map((batch) => (
              <option key={batch._id} value={batch._id}>
                {batch.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-text-secondary mb-1">
            Graduation Date
          </label>

          <input
            type="date"
            name="graduationDate"
            value={form.graduationDate}
            onChange={handleChange}
            required
            className="w-full p-2 rounded border border-border bg-background text-text-primary"
          />
        </div>

        <div>
          <label className="block text-xs text-text-secondary mb-1">
            Current Role
          </label>

          <input
            type="text"
            name="currentRole"
            value={form.currentRole}
            onChange={handleChange}
            className="w-full p-2 rounded border border-border bg-background text-text-primary"
          />
        </div>

        <div>
          <label className="block text-xs text-text-secondary mb-1">
            Testimonial
          </label>

          <textarea
            name="testimonial"
            value={form.testimonial}
            onChange={handleChange}
            rows={4}
            className="w-full p-2 rounded border border-border bg-background text-text-primary resize-none"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-text-secondary">
          <input
            type="checkbox"
            name="isPublic"
            checked={form.isPublic}
            onChange={handleChange}
          />
          Show on public alumni page
        </label>

        {error && (
          <p className="text-danger text-sm">
            {error}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 rounded-lg border border-border text-text-secondary"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving || loading}
            className="flex-1 py-2 rounded-lg font-semibold text-obsidian
                       bg-gradient-to-r from-gold to-emerald
                       disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}