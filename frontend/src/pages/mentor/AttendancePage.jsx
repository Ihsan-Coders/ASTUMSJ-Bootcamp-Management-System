import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAttendance } from "../../api/attendance.api";
import { useAuth } from "../../context/AuthContext";

export default function AttendancePage() {
  const { user } = useAuth();

  const [data, setData] = useState({
    records: [],
    percentage: 0,
  });

  const [loading, setLoading] = useState(Boolean(user?.id));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.id) return;

    async function loadAttendance() {
      try {
        setLoading(true);
        setError("");

        const response = await getAttendance({ studentId: user.id });

        setData(response?.data?.data || { records: [], percentage: 0 });
      } catch (error) {
        console.error("Failed to load attendance:", error);
        setError(
          error?.response?.data?.message || "Could not load attendance.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadAttendance();
  }, [user?.id]);

  const percentage = Math.min(Math.max(Number(data.percentage) || 0, 0), 100);
  const presentCount = data.records.filter(
    (r) => r.status === "Present",
  ).length;
  const absentCount = data.records.filter((r) => r.status === "Absent").length;
  const lateCount = data.records.filter((r) => r.status === "Late").length;

  return (
    <div className="min-h-screen bg-[#051C14] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.header
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#D4AF37]/40 bg-[#051C14] shadow-[0_0_20px_rgba(212,175,55,0.12)]">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D4AF37]/15">
                <span className="text-sm font-bold tracking-wider text-[#D4AF37]">
                  MSJ
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]">
                ASTU MSJ
              </p>
              <h1 className="mt-1 text-2xl font-bold text-[#F8F9FA] sm:text-3xl">
                Attendance
              </h1>
              <p className="mt-1 text-sm text-[#F8F9FA]/55">
                Track your bootcamp attendance
              </p>
            </div>
          </div>
        </motion.header>

        {!user?.id && (
          <div className="rounded-2xl border border-[#D4AF37]/20 bg-[rgba(10,35,26,0.75)] p-10 text-center backdrop-blur-[16px]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-[#D4AF37]/40 bg-[#051C14]">
              <span className="text-sm font-bold tracking-wider text-[#D4AF37]">
                MSJ
              </span>
            </div>
            <h2 className="mt-4 text-lg font-semibold text-[#F8F9FA]">
              Login Required
            </h2>
            <p className="mt-2 text-sm text-[#F8F9FA]/55">
              Please log in to view your attendance.
            </p>
          </div>
        )}

        {user?.id && loading && (
          <div className="rounded-2xl border border-[#D4AF37]/20 bg-[rgba(10,35,26,0.75)] p-12 text-center backdrop-blur-[16px]">
            <p className="text-sm text-[#F8F9FA]/60">Loading attendance...</p>
          </div>
        )}

        {user?.id && !loading && error && (
          <div className="rounded-2xl border border-red-400/20 bg-[rgba(10,35,26,0.75)] p-8 text-center backdrop-blur-[16px]">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {user?.id && !loading && !error && (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="relative overflow-hidden rounded-2xl border border-[#D4AF37]/30 bg-[rgba(10,35,26,0.75)] p-6 backdrop-blur-[16px]"
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
                <p className="text-xs uppercase tracking-[0.18em] text-[#D4AF37]">
                  Attendance Rate
                </p>
                <div className="mt-3 flex items-end gap-2">
                  <span className="text-4xl font-bold text-[#D4AF37]">
                    {percentage}
                  </span>
                  <span className="mb-1 text-xl text-[#F8F9FA]/40">%</span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#0A0F0D]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#10B981]"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.08 }}
                className="relative overflow-hidden rounded-2xl border border-[#10B981]/25 bg-[rgba(10,35,26,0.75)] p-6 backdrop-blur-[16px]"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-[#10B981]">
                  Present
                </p>
                <div className="mt-3 text-4xl font-bold text-[#F8F9FA]">
                  {presentCount}
                </div>
                <p className="mt-2 text-sm text-[#F8F9FA]/45">Days attended</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.16 }}
                className="relative overflow-hidden rounded-2xl border border-[#D4AF37]/20 bg-[rgba(10,35,26,0.75)] p-6 backdrop-blur-[16px]"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-[#D4AF37]">
                  Late
                </p>
                <div className="mt-3 text-4xl font-bold text-[#F8F9FA]">
                  {lateCount}
                </div>
                <p className="mt-2 text-sm text-[#F8F9FA]/45">Late arrivals</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.24 }}
                className="relative overflow-hidden rounded-2xl border border-red-400/20 bg-[rgba(10,35,26,0.75)] p-6 backdrop-blur-[16px]"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-red-400">
                  Absent
                </p>
                <div className="mt-3 text-4xl font-bold text-[#F8F9FA]">
                  {absentCount}
                </div>
                <p className="mt-2 text-sm text-[#F8F9FA]/45">Days absent</p>
              </motion.div>
            </div>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="relative mt-6 overflow-hidden rounded-2xl border border-[#D4AF37]/30 bg-[rgba(10,35,26,0.75)] p-6 backdrop-blur-[16px]"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#D4AF37]">
                    Attendance History
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-[#F8F9FA]">
                    Recent Records
                  </h2>
                </div>
                <div className="hidden h-10 w-10 items-center justify-center rounded-lg border border-[#D4AF37]/30 bg-[#051C14] sm:flex">
                  <span className="text-xs font-bold tracking-wider text-[#D4AF37]">
                    MSJ
                  </span>
                </div>
              </div>

              {data.records.length === 0 ? (
                <div className="rounded-xl border border-[#F8F9FA]/10 bg-[#051C14]/60 p-10 text-center">
                  <p className="text-sm text-[#F8F9FA]/55">
                    No attendance records found yet.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[500px]">
                    <thead>
                      <tr className="border-b border-[#F8F9FA]/10">
                        <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-[#F8F9FA]/40">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-[#F8F9FA]/40">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.records.map((record, index) => (
                        <motion.tr
                          key={record._id || index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.04 }}
                          className="border-b border-[#F8F9FA]/5 last:border-0"
                        >
                          <td className="px-4 py-4 text-sm text-[#F8F9FA]/70">
                            {new Date(record.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                                record.status === "Present"
                                  ? "border-[#10B981]/30 bg-[#10B981]/10 text-[#10B981]"
                                  : record.status === "Late"
                                    ? "border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37]"
                                    : record.status === "Excused"
                                      ? "border-blue-400/30 bg-blue-400/10 text-blue-300"
                                      : "border-red-400/30 bg-red-400/10 text-red-400"
                              }`}
                            >
                              {record.status}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.section>
          </>
        )}
      </div>
    </div>
  );
}
