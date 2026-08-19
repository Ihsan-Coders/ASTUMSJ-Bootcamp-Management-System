import { useState } from "react";
import axiosInstance from "../../api/axiosInstance";

export default function MentorNoteForm({ studentId, batchId, onAdded }) {
  const [note, setNote] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axiosInstance.post("/mentor-notes", {
      student: studentId,
      batch: batchId,
      note,
    });
    setNote("");
    onAdded?.();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card glow-border rounded-lg p-4 space-y-2"
    >
      <textarea
        placeholder="Private note about this student..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full p-2 rounded border border-border bg-background text-text-primary text-sm"
      />
      <button
        type="submit"
        className="text-sm px-3 py-1.5 rounded font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald"
      >
        Add Note
      </button>
    </form>
  );
}
