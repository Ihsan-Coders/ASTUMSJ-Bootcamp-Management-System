import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getPublicDashboard } from "../../api/dashboard.api";
import { getRegistrationStatus } from '../../api/settings.api';

const INSPIRATIONS = [
  {
    arabic: "وَقُلْ رَبِّ زِدْنِي عِلْمًا",
    translation: "And say: My Lord, increase me in knowledge.",
    source: "Qur’an 20:114",
  },
  {
    arabic:
      "إِنَّ اللَّهَ يُحِبُّ إِذَا عَمِلَ أَحَدُكُمْ عَمَلًا أَنْ يُتْقِنَهُ",
    translation:
      "Indeed, Allah loves that when one of you does a work, he perfects it.",
    source: "Al-Bayhaqi",
  },
  {
    arabic: "وَأَنْ لَيْسَ لِلْإِنسَانِ إِلَّا مَا سَعَىٰ",
    translation:
      "And that there is not for man except that for which he strives.",
    source: "Qur’an 53:39",
  },
];

export default function Hero() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stats, setStats] = useState({
    activeBatches: 0,
    attendanceRate: 0,
    assignmentsCompleted: 0,
  });

  const [loading, setLoading] = useState(true);
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [regLoading, setRegLoading] = useState(true);
  const [inspirationIndex, setInspirationIndex] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getPublicDashboard();

        const data = response.data?.data;

        setStats({
          activeBatches: data?.activeBatchCount ?? 0,
          attendanceRate: data?.attendanceRate ?? 0,
          assignmentsCompleted: data?.assignmentsCompleted ?? 0,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    let mounted = true;
    setRegLoading(true);
    getRegistrationStatus()
      .then((res) => {
        if (!mounted) return;
        setRegistrationOpen(Boolean(res.data?.data?.registrationOpen));
      })
      .catch((err) => {
        console.error('Failed to fetch registration status:', err);
      })
      .finally(() => setRegLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setInspirationIndex((current) => (current + 1) % INSPIRATIONS.length);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const handleDashboardClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role === "admin") {
      navigate("/admin");
    } else if (user.role === "mentor") {
      navigate("/mentor");
    } else if (user.role === "student") {
      navigate("/student");
    } else {
      navigate("/login");
    }
  };

  const handleBatchesClick = () => {
    if (user?.role === "admin") {
      navigate("/admin/batches");
      return;
    }

    const batchesSection = document.getElementById("batches");

    if (batchesSection) {
      batchesSection.scrollIntoView({
        behavior: "smooth",
      });
      return;
    }

    navigate("/login");
  };

  const STATS = [
    {
      label: "Active Batches",
      value: loading ? "..." : stats.activeBatches,
    },
    {
      label: "Attendance Rate",
      value: loading ? "..." : `${stats.attendanceRate}%`,
    },
    {
      label: "Assignments Completed",
      value: loading ? "..." : stats.assignmentsCompleted,
    },
  ];

  const inspiration = INSPIRATIONS[inspirationIndex];

  return (
    <section
      id="home"
      className="relative pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 max-w-7xl mx-auto
                 grid md:grid-cols-2 gap-10 md:gap-12 items-center"
    >
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-text-primary font-[var(--font-display)]">
          Empowering the Next Generation of{" "}
          <span className="bg-gradient-to-r from-gold to-emerald bg-clip-text text-transparent">
            Engineers
          </span>
        </h1>

        <p className="mt-4 text-text-secondary text-base sm:text-lg max-w-md">
          A centralized platform for the ASTU MSJ Summer Bootcamp — track
          attendance, progress, assignments, and grow together.
        </p>

        <motion.div
          key={inspirationIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-6 max-w-lg border-l-2 border-gold/50 pl-5"
        >
          <p
            dir="rtl"
            className="text-text-primary text-lg sm:text-xl leading-loose font-medium text-right"
          >
            {inspiration.arabic}
          </p>

          <p className="mt-2 text-text-secondary text-xs sm:text-sm italic leading-relaxed">
            {inspiration.translation}
          </p>

          <p className="mt-2 text-gold text-xs font-semibold tracking-wide">
            — {inspiration.source}
          </p>
        </motion.div>

        <div className="mt-8 flex flex-wrap gap-4">
          <button
            onClick={handleDashboardClick}
            className="px-6 py-3 rounded-lg font-semibold text-obsidian
                       bg-gradient-to-r from-gold to-emerald
                       hover:shadow-[0_0_25px_rgba(212,175,55,0.35)]
                       transition-shadow"
          >
            {user ? "Explore Dashboard" : "Get Started"}
          </button>

          <button
            onClick={handleBatchesClick}
            className="px-6 py-3 rounded-lg font-semibold border border-gold/40
                       text-text-primary hover:border-gold transition-colors"
          >
            View Batches
          </button>
          {/* Registration CTA */}
          {!regLoading && (
            registrationOpen ? (
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-3 rounded-lg font-semibold bg-emerald text-obsidian"
              >
                Apply Now
              </button>
            ) : (
              <button
                disabled
                title="Registration is currently closed"
                className="px-6 py-3 rounded-lg font-semibold bg-text-secondary/10 text-text-secondary cursor-not-allowed"
              >
                Registration Closed
              </button>
            )
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative"
      >
        <div
          aria-hidden="true"
          className="absolute -inset-4 rounded-3xl border border-gold/15"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, rgba(212,175,55,0.04) 0 2px, transparent 2px 14px)",
          }}
        />

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="glass-card glow-border rounded-2xl p-6 sm:p-8 relative"
        >
          <div className="grid grid-cols-1 gap-5 sm:gap-6">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex justify-between items-center border-b border-gold/10 pb-3 last:border-0"
              >
                <span className="text-text-secondary text-sm">
                  {stat.label}
                </span>

                <motion.span
                  key={stat.value}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold text-gold"
                >
                  {stat.value}
                </motion.span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
