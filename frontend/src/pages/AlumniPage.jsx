import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import AlumniCard from "../components/alumni/AlumniCard";

export default function AlumniPage() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axiosInstance.get("/alumni");

        setAlumni(response.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch alumni:", err);

        setError(
          err?.response?.data?.message ||
            "Failed to load alumni"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, []);

  return (
    <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
          Our Alumni
        </h2>

        <p className="text-sm text-text-secondary mt-1">
          Meet the students who completed the ASTU MSJ Bootcamp.
        </p>
      </div>

      {loading && (
        <div className="text-center py-12 text-text-secondary">
          Loading alumni...
        </div>
      )}

      {error && (
        <div className="glass-card rounded-lg p-6 text-center">
          <p className="text-danger text-sm">
            {error}
          </p>
        </div>
      )}

      {!loading && !error && alumni.length === 0 && (
        <div className="glass-card glow-border rounded-lg p-10 text-center">
          <h3 className="text-lg font-semibold text-text-primary">
            No alumni yet
          </h3>

          <p className="text-sm text-text-secondary mt-2">
            Alumni profiles will appear here once they are added.
          </p>
        </div>
      )}

      {!loading && !error && alumni.length > 0 && (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {alumni.map((alumnus) => (
            <AlumniCard
              key={alumnus._id}
              alumni={alumnus}
            />
          ))}
        </div>
      )}
    </div>
  );
}