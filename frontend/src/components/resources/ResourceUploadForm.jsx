import { useEffect, useState } from "react";
import { createResource } from "../../api/resource.api";
import { getBatches } from "../../api/batch.api";

const EMPTY_FORM = {
  title: "",
  description: "",
  type: "Link",
  url: "",
  topic: "",
  batch: "",
};

export default function ResourceUploadForm({ onCreated }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [batches, setBatches] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    getBatches()
      .then((res) => setBatches(res.data.data || []))
      .catch(() => setBatches([])); // batch scoping is optional, fail silently
  }, []);

  const handleTypeChange = (type) => {
    setForm((current) => ({ ...current, type, url: "" }));
    setFile(null);
    setThumbnail(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.title.trim() || !form.topic.trim()) {
      setError("Title and topic are required");
      return;
    }
    if (form.type === "Document" && !file) {
      setError("Please choose a file to upload");
      return;
    }
    if (form.type !== "Document" && !form.url.trim()) {
      setError("Please provide a URL");
      return;
    }

    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append("title", form.title.trim());
      payload.append("description", form.description.trim());
      payload.append("type", form.type);
      payload.append("topic", form.topic.trim());
      if (form.batch) payload.append("batch", form.batch);

      if (form.type === "Document") {
        payload.append("file", file);
      } else {
        payload.append("url", form.url.trim());
      }

      if (thumbnail) payload.append("thumbnail", thumbnail);

      await createResource(payload);

      setForm(EMPTY_FORM);
      setFile(null);
      setThumbnail(null);
      setSuccess("Resource added successfully");
      onCreated?.();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add resource");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card glow-border rounded-lg p-6 space-y-3"
    >
      <input
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="w-full p-2 rounded border border-border bg-background text-text-primary"
        required
      />

      <textarea
        placeholder="Description (optional)"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        rows={2}
        className="w-full p-2 rounded border border-border bg-background text-text-primary resize-none"
      />

      <input
        placeholder="Topic (e.g. React)"
        value={form.topic}
        onChange={(e) => setForm({ ...form, topic: e.target.value })}
        className="w-full p-2 rounded border border-border bg-background text-text-primary"
        required
      />

      <select
        value={form.type}
        onChange={(e) => handleTypeChange(e.target.value)}
        className="w-full p-2 rounded border border-border bg-background text-text-primary"
      >
        {["Link", "Document", "Video"].map((t) => (
          <option key={t}>{t}</option>
        ))}
      </select>

      {form.type === "Document" ? (
        <div>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full p-2 rounded border border-border bg-background text-text-primary text-sm"
            required
          />
          <p className="text-xs text-text-secondary mt-1">
            PDF, Word, ZIP, image or text file, up to 10MB.
          </p>
        </div>
      ) : (
        <input
          placeholder={form.type === "Video" ? "Video URL (e.g. YouTube link)" : "URL"}
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          className="w-full p-2 rounded border border-border bg-background text-text-primary"
          required
        />
      )}

      <select
        value={form.batch}
        onChange={(e) => setForm({ ...form, batch: e.target.value })}
        className="w-full p-2 rounded border border-border bg-background text-text-primary"
      >
        <option value="">Visible to all batches</option>
        {batches.map((b) => (
          <option key={b._id} value={b._id}>
            Restrict to: {b.name}
          </option>
        ))}
      </select>

      <div>
        <label className="block text-xs text-text-secondary mb-1">
          Thumbnail (optional)
        </label>
        <input
          type="file"
          accept="image/png,image/jpeg"
          onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
          className="w-full p-2 rounded border border-border bg-background text-text-primary text-sm"
        />
        <p className="text-xs text-text-secondary mt-1">
          PNG or JPEG image shown on the resource card.
        </p>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}
      {success && <p className="text-emerald text-sm">{success}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-2 rounded font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald disabled:opacity-60"
      >
        {submitting ? "Adding..." : "Add Resource"}
      </button>
    </form>
  );
}
