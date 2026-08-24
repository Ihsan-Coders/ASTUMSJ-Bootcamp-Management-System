import { useEffect, useState } from "react";
import { Pencil, Trash2, UserRound, X, CheckCircle2 } from "lucide-react";

import AlumniForm from "../../components/admin/AlumniForm";
import {
  getAlumni,
  updateAlumniProfile,
  deleteAlumniProfile,
} from "../../api/alumni.api";

import { getUsers } from "../../api/user.api";
import { getBatches } from "../../api/batch.api";

export default function ManageAlumni() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingAlumni, setEditingAlumni] = useState(null);
  const [deletingAlumni, setDeletingAlumni] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadAlumni = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAlumni();

      setAlumni(response.data?.data || []);
    } catch (err) {
      console.error("Failed to load alumni:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to load alumni profiles"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAlumni();
  }, []);

  const showSuccess = (message) => {
    setSuccess(message);

    setTimeout(() => {
      setSuccess("");
    }, 4000);
  };

  const handleCreated = async () => {
    await loadAlumni();
    showSuccess("Alumni profile created successfully.");
  };

  const handleDelete = async () => {
    if (!deletingAlumni) return;

    const id = deletingAlumni._id;

    try {
      setDeletingId(id);
      setError("");

      await deleteAlumniProfile(id);

      setAlumni((prev) =>
        prev.filter((profile) => profile._id !== id)
      );

      setDeletingAlumni(null);

      showSuccess("Alumni profile deleted successfully.");
    } catch (err) {
      console.error("Failed to delete alumni:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to delete alumni profile"
      );

      setDeletingAlumni(null);
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdated = (updatedProfile) => {
    setAlumni((prev) =>
      prev.map((profile) =>
        profile._id === updatedProfile._id
          ? updatedProfile
          : profile
      )
    );

    setEditingAlumni(null);

    showSuccess("Alumni profile updated successfully.");
  };

  return (
    <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary font-[var(--font-display)]">
          Manage Alumni
        </h1>

        <p className="text-sm text-text-secondary mt-1">
          Create, edit, and manage alumni profiles for the public
          alumni page.
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="glass-card glow-border rounded-lg p-4 mb-6 border border-emerald/30">
          <div className="flex items-center gap-3">
            <CheckCircle2
              size={20}
              className="text-emerald shrink-0"
            />

            <p className="text-emerald text-sm font-medium">
              {success}
            </p>

            <button
              type="button"
              onClick={() => setSuccess("")}
              className="ml-auto text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Dismiss success message"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="glass-card rounded-lg p-4 mb-6 border border-danger/30">
          <div className="flex items-center gap-3">
            <p className="text-danger text-sm">
              {error}
            </p>

            <button
              type="button"
              onClick={() => setError("")}
              className="ml-auto text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Dismiss error message"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Create form */}
      <div className="max-w-xl mb-10">
        <AlumniForm onCreated={handleCreated} />
      </div>

      {/* Alumni list */}
      <div>
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          Existing Alumni
        </h2>

        {loading ? (
          <div className="glass-card rounded-lg p-8 text-center">
            <p className="text-text-secondary">
              Loading alumni profiles...
            </p>
          </div>
        ) : alumni.length === 0 ? (
          <div className="glass-card glow-border rounded-lg p-8 text-center">
            <p className="text-text-secondary">
              No alumni profiles have been created yet.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {alumni.map((profile) => (
              <div
                key={profile._id}
                className="glass-card glow-border rounded-lg p-5"
              >
                {/* Icon */}
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

                {/* Name */}
                <h3 className="text-center text-text-primary font-semibold">
                  {profile.student?.name || "Unknown Student"}
                </h3>

                {/* Role */}
                {profile.currentRole && (
                  <p className="text-center text-gold text-sm mt-1">
                    {profile.currentRole}
                  </p>
                )}

                {/* Batch */}
                {profile.batch?.name && (
                  <p className="text-center text-text-secondary text-xs mt-2">
                    {profile.batch.name}
                  </p>
                )}

                {/* Testimonial */}
                {profile.testimonial && (
                  <p className="text-text-secondary text-sm mt-3 italic text-center line-clamp-3">
                    "{profile.testimonial}"
                  </p>
                )}

                {/* Visibility */}
                <div className="flex justify-center mt-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      profile.isPublic
                        ? "text-emerald bg-emerald/10"
                        : "text-text-secondary bg-background"
                    }`}
                  >
                    {profile.isPublic ? "Public" : "Hidden"}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-5">
                  <button
                    type="button"
                    onClick={() => {
                      setError("");
                      setEditingAlumni(profile);
                    }}
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
                    onClick={() => {
                      setError("");
                      setDeletingAlumni(profile);
                    }}
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

      {/* Edit modal */}
      {editingAlumni && (
        <EditAlumniModal
          alumni={editingAlumni}
          onClose={() => setEditingAlumni(null)}
          onUpdated={handleUpdated}
        />
      )}

      {/* Delete confirmation modal */}
      {deletingAlumni && (
        <DeleteConfirmationModal
          alumni={deletingAlumni}
          deleting={deletingId === deletingAlumni._id}
          onCancel={() => setDeletingAlumni(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}


/* =========================================================
   DELETE CONFIRMATION MODAL
========================================================= */

function DeleteConfirmationModal({
  alumni,
  deleting,
  onCancel,
  onConfirm,
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="glass-card glow-border rounded-lg p-6 w-full max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center
                       bg-danger/10 border border-danger/30
                       shadow-[0_0_20px_rgba(239,68,68,0.2)]"
          >
            <Trash2
              size={26}
              className="text-danger"
            />
          </div>
        </div>

        {/* Content */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-text-primary">
            Delete Alumni Profile?
          </h3>

          <p className="text-sm text-text-secondary mt-2">
            Are you sure you want to delete the alumni profile for{" "}
            <span className="text-text-primary font-medium">
              {alumni.student?.name || "this student"}
            </span>
            ?
          </p>

          <p className="text-xs text-text-secondary mt-2">
            This action cannot be undone.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="flex-1 py-2.5 rounded-lg border border-border
                       text-text-secondary hover:bg-background
                       transition-colors disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 py-2.5 rounded-lg font-semibold
                       text-white bg-danger hover:bg-danger/90
                       transition-colors disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}


/* =========================================================
   EDIT ALUMNI MODAL
========================================================= */

function EditAlumniModal({
  alumni,
  onClose,
  onUpdated,
}) {
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

  const [loadingOptions, setLoadingOptions] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOptions = async () => {
      try {
        setLoadingOptions(true);
        setError("");

        const [usersResponse, batchesResponse] =
          await Promise.all([
            getUsers({ role: "student" }),
            getBatches(),
          ]);

        setStudents(usersResponse.data?.data || []);
        setBatches(batchesResponse.data?.data || []);
      } catch (err) {
        console.error("Failed to load edit options:", err);

        setError(
          err?.response?.data?.message ||
            "Failed to load students and batches"
        );
      } finally {
        setLoadingOptions(false);
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

      const response = await updateAlumniProfile(
        alumni._id,
        form
      );

      onUpdated(response.data.data);
    } catch (err) {
      console.error("Failed to update alumni:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to update alumni profile"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <form
        onSubmit={handleSubmit}
        className="glass-card glow-border rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-4"
      >
        {/* Modal header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              Edit Alumni Profile
            </h3>

            <p className="text-xs text-text-secondary mt-1">
              Update this alumni's information.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-gold/10 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Student */}
        <div>
          <label className="block text-xs text-text-secondary mb-1">
            Student
          </label>

          <select
            name="student"
            value={form.student}
            onChange={handleChange}
            required
            disabled={loadingOptions}
            className="w-full p-2 rounded border border-border bg-background text-text-primary"
          >
            <option value="">
              {loadingOptions
                ? "Loading students..."
                : "Select student"}
            </option>

            {students.map((student) => (
              <option
                key={student._id}
                value={student._id}
              >
                {student.name} — {student.email}
              </option>
            ))}
          </select>
        </div>

        {/* Batch */}
        <div>
          <label className="block text-xs text-text-secondary mb-1">
            Batch
          </label>

          <select
            name="batch"
            value={form.batch}
            onChange={handleChange}
            required
            disabled={loadingOptions}
            className="w-full p-2 rounded border border-border bg-background text-text-primary"
          >
            <option value="">
              {loadingOptions
                ? "Loading batches..."
                : "Select batch"}
            </option>

            {batches.map((batch) => (
              <option
                key={batch._id}
                value={batch._id}
              >
                {batch.name}
              </option>
            ))}
          </select>
        </div>

        {/* Graduation date */}
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

        {/* Current role */}
        <div>
          <label className="block text-xs text-text-secondary mb-1">
            Current Role
          </label>

          <input
            type="text"
            name="currentRole"
            value={form.currentRole}
            onChange={handleChange}
            placeholder="e.g. Frontend Developer"
            className="w-full p-2 rounded border border-border bg-background text-text-primary"
          />
        </div>

        {/* Testimonial */}
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

        {/* Visibility */}
        <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
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

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-border text-text-secondary hover:bg-background transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving || loadingOptions}
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