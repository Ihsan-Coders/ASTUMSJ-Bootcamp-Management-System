import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import AlumniCard from "../components/alumni/AlumniCard";

export default function AlumniPage() {
  const [alumni, setAlumni] = useState([]);

  useEffect(() => {
    axiosInstance.get("/alumni").then((res) => setAlumni(res.data.data));
  }, []);

  return (
    <div className="pt-24 px-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-text-primary mb-6">Our Alumni</h2>
      <div className="grid md:grid-cols-4 gap-4">
        {alumni.map((a) => (
          <AlumniCard key={a._id} alumni={a} />
        ))}
      </div>
    </div>
  );
}
