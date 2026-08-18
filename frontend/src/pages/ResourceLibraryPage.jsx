import { useEffect, useState } from "react";
import { getResources } from "../api/resource.api";
import ResourceCard from "../components/resources/ResourceCard";

export default function ResourceLibraryPage() {
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState("");

  const fetchResources = () => {
    getResources({ search }).then((res) => setResources(res.data.data));
  };

  useEffect(() => {
    fetchResources();
  }, [search]);

  return (
    <div className="pt-24 px-6 max-w-6xl mx-auto">
      <input
        placeholder="Search resources..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 rounded border border-border bg-background text-text-primary mb-6"
      />
      <div className="grid md:grid-cols-3 gap-4">
        {resources.map((r) => (
          <ResourceCard key={r._id} resource={r} />
        ))}
      </div>
    </div>
  );
}
