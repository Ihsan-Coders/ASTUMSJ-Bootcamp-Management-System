import { useEffect, useState } from "react";
import { createAlumniProfile } from "../../api/alumni.api";
import { getUsers } from "../../api/user.api";
import { getBatches } from "../../api/batch.api";

const EMPTY_FORM = {
  student: "",
  batch: "",
  graduationDate: "",
  currentRole: "",
  testimonial: "",
  isPublic: true,
};

export default function AlumniForm({ onCreated }) {
  const [form, setForm] = useState(EMPTY_FORM);

  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);

  const [loadingOptions, setLoadingOptions] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOptions = async () => {
      try {
        setLoadingOptions(true);
        setError("");

        const [usersResponse, batchesResponse] = await Promise.all([
          getUsers({ role: "student" }),
          getBatches(),
        ]);

        setStudents(usersResponse.data?.data || []);
        setBatches(batchesResponse.data?.data || []);
      } catch (err) {
        console.error("Failed to load alumni options:", err);

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

    setSubmitting(true);
    setError("");

    try {
      await createAlumniProfile(form);

      setForm(EMPTY_FORM);

      if (onCreated) {
        onCreated();
      }
    } catch (err) {
      console.error("Failed to create alumni profile:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to create alumni profile"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card glow-border rounded-lg p-6 space-y-4"
    >
      <div>
        <h3 className="text-lg font-semibold text-text-primary">
          Create Alumni Profile
        </h3>

        <p className="text-xs text-text-secondary mt-1">
          Add a completed student to the public alumni showcase.
        </p>
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
            {loadingOptions ? "Loading students..." : "Select student"}
          </option>

          {students.map((student) => (
            <option key={student._id} value={student._id}>
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
            {loadingOptions ? "Loading batches..." : "Select batch"}
          </option>

          {batches.map((batch) => (
            <option key={batch._id} value={batch._id}>
              {batch.name}
            </option>
          ))}
        </select>
      </div>

      {/* Graduation Date */}
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

      {/* Current Role */}
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
          rows={3}
          placeholder="Alumni success story..."
          className="w-full p-2 rounded border border-border bg-background text-text-primary resize-none"
        />
      </div>

      {/* Public visibility */}
      <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
        <input
          type="checkbox"
          name="isPublic"
          checked={form.isPublic}
          onChange={handleChange}
        />

        Show on public alumni page
      </label>

      {/* Error */}
      {error && (
        <p className="text-danger text-sm">
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting || loadingOptions}
        className="w-full py-2 rounded font-semibold text-obsidian
                   bg-gradient-to-r from-gold to-emerald
                   disabled:opacity-60"
      >
        {submitting ? "Creating..." : "Create Alumni Profile"}
      </button>
    </form>
  );
}