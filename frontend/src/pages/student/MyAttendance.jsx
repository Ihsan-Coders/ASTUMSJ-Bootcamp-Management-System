
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock3,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import AttendanceRing from "../../components/common/AttendanceRing";
import { getAttendance } from "../../api/attendance.api";
import { useAuth } from "../../context/AuthContext";

const STATUS_CONFIG = {
  Present: {
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },

  Absent: {
    icon: XCircle,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },

  Late: {
    icon: Clock3,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },

  Excused: {
    icon: ShieldCheck,
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
  },
};

export default function MyAttendance() {
  const { user } = useAuth();

  const [records, setRecords] = useState([]);
  const [percentage, setPercentage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    getAttendance({ studentId: user.id })
      .then((res) => {
        const data = res?.data?.data;

        setRecords(data?.records || []);
        setPercentage(data?.percentage || 0);
      })
      .catch((error) => {
        console.error("Failed to load attendance:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user?.id]);

  const present = records.filter(
    (item) => item.status === "Present"
  ).length;

  const absent = records.filter(
    (item) => item.status === "Absent"
  ).length;

  const late = records.filter(
    (item) => item.status === "Late"
  ).length;

  const excused = records.filter(
    (item) => item.status === "Excused"
  ).length;

  return (
    <div className="min-h-screen bg-[#051C14] text-[#F8F9FA] relative overflow-hidden">

      {/* Islamic geometric background */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(45deg, transparent 48%, #D4AF37 49%, transparent 51%),
            linear-gradient(-45deg, transparent 48%, #D4AF37 49%, transparent 51%)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Emerald glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full" />

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold">
            My Attendance
          </h1>

          <p className="text-white/50 mt-2">
            Track your attendance and stay consistent throughout the bootcamp.
          </p>
        </motion.div>

        {/* Attendance Overview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            relative
            overflow-hidden
            rounded-3xl
            border border-[#D4AF37]/20
            bg-[rgba(10,35,26,0.75)]
            backdrop-blur-2xl
            p-6 sm:p-8
            mb-6
          "
        >
          <div className="
            absolute
            top-0
            left-1/2
            -translate-x-1/2
            w-44
            h-1
            bg-gradient-to-r
            from-transparent
            via-[#D4AF37]
            to-transparent
          " />

          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8 items-center">

            {/* Attendance Ring */}
            <div className="flex flex-col items-center">

              <AttendanceRing percentage={percentage} />

              <div className="flex items-center gap-2 mt-4">
                <TrendingUp className="w-4 h-4 text-emerald-400" />

                <span className="text-emerald-400 font-semibold">
                  {percentage}%
                </span>

                <span className="text-white/40 text-sm">
                  overall attendance
                </span>
              </div>

            </div>

            {/* Statistics */}
            <div>

              <h2 className="text-xl font-semibold mb-2">
                Attendance Overview
              </h2>

              <p className="text-white/50 text-sm mb-6">
                Your attendance record across all recorded bootcamp sessions.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

                <Stat
                  icon={CalendarDays}
                  label="Total"
                  value={records.length}
                  color="text-white/70"
                />

                <Stat
                  icon={CheckCircle2}
                  label="Present"
                  value={present}
                  color="text-emerald-400"
                />

                <Stat
                  icon={XCircle}
                  label="Absent"
                  value={absent}
                  color="text-red-400"
                />

                <Stat
                  icon={Clock3}
                  label="Late"
                  value={late}
                  color="text-amber-400"
                />

              </div>
            </div>
          </div>
        </motion.section>

        {/* Loading */}
        {loading && (
          <div className="space-y-3">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="
                  h-28
                  rounded-2xl
                  bg-white/5
                  border border-white/5
                  animate-pulse
                "
              />
            ))}

          </div>
        )}

        {/* Attendance History */}
        {!loading && records.length > 0 && (
          <section>

            <div className="flex justify-between items-center mb-4">

              <div>
                <h2 className="text-xl sm:text-2xl font-bold">
                  Attendance History
                </h2>

                <p className="text-white/40 text-sm mt-1">
                  Your recorded sessions
                </p>
              </div>

              <span className="text-sm text-white/40">
                {records.length} sessions
              </span>

            </div>

            <div className="space-y-3">

              {records.map((record, index) => {

                const config =
                  STATUS_CONFIG[record.status] ||
                  STATUS_CONFIG.Excused;

                const Icon = config.icon;

                return (
                  <motion.div
                    key={record._id || index}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.05,
                    }}
                    whileHover={{
                      y: -2,
                    }}
                    className="
                      rounded-2xl
                      border border-[#D4AF37]/10
                      hover:border-[#D4AF37]/30
                      bg-[rgba(10,35,26,0.72)]
                      backdrop-blur-xl
                      p-4 sm:p-5
                    "
                  >

                    <div className="flex items-center justify-between gap-4">

                      {/* Date */}
                      <div className="flex items-center gap-4">

                        <div className="
                          w-11
                          h-11
                          rounded-xl
                          bg-white/5
                          flex
                          items-center
                          justify-center
                        ">
                          <CalendarDays className="w-5 h-5 text-[#D4AF37]" />
                        </div>

                        <div>

                          <p className="text-xs text-white/40">
                            Session Date
                          </p>

                          <p className="font-medium mt-1">
                            {new Date(record.date).toLocaleDateString(
                              undefined,
                              {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </p>

                        </div>
                      </div>

                      {/* Status */}
                      <div
                        className={`
                          flex
                          items-center
                          gap-2
                          px-3
                          py-1.5
                          rounded-full
                          border
                          text-xs
                          font-semibold
                          ${config.bg}
                          ${config.border}
                          ${config.color}
                        `}
                      >
                        <Icon className="w-3.5 h-3.5" />

                        {record.status}
                      </div>

                    </div>
                  </motion.div>
                );
              })}

            </div>
          </section>
        )}

        {/* Empty State */}
        {!loading && records.length === 0 && (
          <div
            className="
              rounded-3xl
              border border-[#D4AF37]/15
              bg-[rgba(10,35,26,0.75)]
              p-10
              text-center
            "
          >

            <CalendarDays className="
              w-10
              h-10
              text-[#D4AF37]
              mx-auto
              mb-4
            " />

            <h2 className="text-xl font-semibold">
              No Attendance Yet
            </h2>

            <p className="text-white/50 max-w-md mx-auto mt-2">
              No attendance sessions have been recorded yet. Your history
              will appear here once your mentor starts marking attendance.
            </p>

          </div>
        )}

        {/* Excused Sessions */}
        {!loading && records.length > 0 && (
          <div className="
            mt-5
            flex
            items-center
            justify-between
            rounded-2xl
            border border-white/5
            bg-white/[0.025]
            p-4
          ">

            <div className="flex items-center gap-3">

              <ShieldCheck className="w-5 h-5 text-sky-400" />

              <div>
                <p className="text-sm font-medium">
                  Excused Sessions
                </p>

                <p className="text-xs text-white/40">
                  Officially excused attendance
                </p>
              </div>

            </div>

            <span className="text-lg font-bold text-sky-400">
              {excused}
            </span>

          </div>
        )}

      </main>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  color,
}) {
  return (
    <div className="
      rounded-2xl
      border border-white/5
      bg-white/[0.035]
      p-3
    ">

      <Icon className={`w-4 h-4 ${color} mb-3`} />

      <p className="text-xl font-bold">
        {value}
      </p>

      <p className="text-xs text-white/40 mt-1">
        {label}
      </p>

    </div>
  );
}