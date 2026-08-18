import { useState } from "react";
import { createAnnouncement } from "../../api/announcement.api";

export default function AnnouncementForm() {
  // Store the form values.
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    targetAudience: "All",
  });

  // Update the correct field when the user types.
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Send the announcement to the backend.
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createAnnouncement(formData);

      // Clear the form after successful creation.
      setFormData({
        title: "",
        content: "",
        targetAudience: "All",
      });

      alert("Announcement created");
    } catch (error) {
      console.error("Failed to create announcement:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-4">
      {/* Announcement title */}
      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Announcement title"
        className="w-full p-2"
      />

      {/* Announcement content */}
      <textarea
        name="content"
        value={formData.content}
        onChange={handleChange}
        placeholder="Announcement content"
        className="w-full p-2 mt-3"
      />

      {/* Who should receive the announcement? */}
      <select
        name="targetAudience"
        value={formData.targetAudience}
        onChange={handleChange}
        className="w-full p-2 mt-3"
      >
        <option value="All">All</option>
        <option value="Students">Students</option>
        <option value="Mentors">Mentors</option>
        <option value="SpecificBatch">Specific Batch</option>
      </select>

      {/* Submit button */}
      <button type="submit" className="mt-3 px-4 py-2">
        Create Announcement
      </button>
    </form>
  );
}
