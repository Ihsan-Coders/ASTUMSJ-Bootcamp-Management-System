import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getContests } from "../../api/contest.api";
import ContestForm from "../../components/admin/ContestForm";
import ContestCard from "../../components/admin/ContestCard";

export default function ManageContests() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadContests = () => {
    setLoading(true);
    getContests()
      .then((res) => setContests(res.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadContests();
  }, []);

  return (
    <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-6xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl sm:text-3xl font-bold text-text-primary mb-6"
      >
        Weekly CP Contests
      </motion.h1>

      <div className="grid lg:grid-cols-[340px_1fr] gap-6 items-start">
        <ContestForm onCreated={loadContests} />

        <div className="space-y-3">
          {loading && (
            <p className="text-text-secondary text-sm">Loading contests...</p>
          )}
          {!loading && contests.length === 0 && (
            <div className="glass-card glow-border rounded-xl p-8 text-center text-text-secondary">
              No contests yet — create the first one.
            </div>
          )}
          {contests.map((c) => (
            <ContestCard key={c._id} contest={c} />
          ))}
        </div>
      </div>
    </div>
  );
}
