import { useState } from "react";
import Navbar from "./components/common/Navbar";
import BottomNav from "./components/common/BottomNav";
import GirihBackground from "./components/common/GirihBackground";
import Footer from "./components/common/Footer";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";

function App() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="min-h-screen flex flex-col relative">
      <GirihBackground />

      <Navbar minimal />

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center gap-4 px-4 pb-24 md:pb-8">
        {showRegister ? <RegisterForm /> : <LoginForm />}

        <button
          onClick={() => setShowRegister(!showRegister)}
          className="text-sm text-gold hover:underline"
        >
          {showRegister
            ? "Already have an account? Login"
            : "Need an account? Register"}
        </button>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}

export default App;






import React, { useState, useEffect, useRef } from "react";
import {
  Menu, X, Sun, Moon, ChevronRight, Users, BookOpen, Bell, Calendar,
  CheckCircle2, Clock, AlertTriangle, GraduationCap, Search, Plus,
  MoreVertical, LayoutGrid, ClipboardList, Megaphone, UserCog, Home,
  Award, TrendingUp
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

/* ============================================================
   THE EMERALD OASIS — design tokens
   ============================================================ */
const C = {
  deep: "#051C14",
  obsidian: "#0A0F0D",
  surface: "rgba(10, 35, 26, 0.75)",
  surfaceLight: "rgba(248, 249, 250, 0.85)",
  gold: "#D4AF37",
  goldLight: "#E9CE73",
  emerald: "#10B981",
  emeraldDeep: "#0B6B4F",
  cream: "#F8F9FA",
  mute: "#9FB8AC",
};

const fontImport = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');
.font-display { font-family: 'Cormorant Garamond', serif; }
.font-body { font-family: 'Manrope', sans-serif; }
@keyframes floatY { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
@keyframes fadeUp { from { opacity:0; transform: translateY(18px);} to {opacity:1; transform: translateY(0);} }
@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
.animate-fadeUp { animation: fadeUp .6s cubic-bezier(.16,1,.3,1) both; }
.animate-float { animation: floatY 6s ease-in-out infinite; }
.tilt-card { transition: transform .35s cubic-bezier(.16,1,.3,1), box-shadow .35s ease, border-color .35s ease; }
.tilt-card:hover { transform: translateY(-6px) rotateX(2deg); box-shadow: 0 20px 60px -20px rgba(212,175,55,0.25); }
.gold-text { background: linear-gradient(90deg, #D4AF37, #F3E2A9, #D4AF37); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; color: transparent; }
.scrollbar-thin::-webkit-scrollbar { height: 6px; width: 6px; }
.scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(212,175,55,0.35); border-radius: 4px; }
`;

/* Girih 8-point star lattice, tiled, low opacity ambient background */
function GirihBackground({ opacity = 0.05, color = C.gold }) {
  return (
    <svg
      className="fixed inset-0 w-full h-full pointer-events-none -z-10"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
    >
      <defs>
        <pattern id="girih" width="120" height="120" patternUnits="userSpaceOnUse">
          <g stroke={color} strokeWidth="1" fill="none">
            <path d="M60 0 L75 30 L110 25 L90 55 L120 60 L90 65 L110 95 L75 90 L60 120 L45 90 L10 95 L30 65 L0 60 L30 55 L10 25 L45 30 Z" />
            <circle cx="60" cy="60" r="14" />
            <path d="M60 46 L68 60 L60 74 L52 60 Z" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#girih)" />
    </svg>
  );
}

/* Arch (mihrab) silhouette top border wrapper for cards */
function ArchTop({ children, accent = C.gold, dark = true, className = "" }) {
  return (
    <div
      className={`relative tilt-card rounded-b-2xl overflow-hidden border ${className}`}
      style={{
        backgroundColor: dark ? C.surface : C.surfaceLight,
        backdropFilter: "blur(16px)",
        borderColor: `${accent}4D`,
        borderTop: "none",
      }}
    >
      <div
        className="h-6 w-full"
        style={{
          background: dark ? C.surface : C.surfaceLight,
          borderTopLeftRadius: "50% 100%",
          borderTopRightRadius: "50% 100%",
          borderTop: `1px solid ${accent}66`,
          borderLeft: `1px solid ${accent}4D`,
          borderRight: `1px solid ${accent}4D`,
        }}
      />
      <div className="p-5">{children}</div>
    </div>
  );
}

/* Animated numeric counter, replays when `trigger` changes */
function Counter({ value, suffix = "", duration = 1200, trigger }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    let start = null;
    cancelAnimationFrame(ref.current);
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) ref.current = requestAnimationFrame(step);
    };
    ref.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(ref.current);
  }, [value, duration, trigger]);
  return <span>{display}{suffix}</span>;
}

/* SVG circular progress ring, gold -> mint gradient, star tick marks */
function AttendanceRing({ percent = 87, size = 168 }) {
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const [p, setP] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setP(percent), 150);
    return () => clearTimeout(t);
  }, [percent]);
  const ticks = new Array(8).fill(0).map((_, i) => (360 / 8) * i);
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={C.gold} />
            <stop offset="100%" stopColor={C.emerald} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          stroke="url(#ringGrad)" strokeWidth={stroke} fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (p / 100) * c}
          style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(.16,1,.3,1)" }}
        />
      </svg>
      {ticks.map((deg, i) => (
        <div
          key={i}
          className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full"
          style={{
            backgroundColor: C.goldLight,
            transform: `rotate(${deg}deg) translate(${size / 2 - 3}px) rotate(-${deg}deg)`,
            opacity: 0.5,
          }}
        />
      ))}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-4xl font-semibold gold-text"><Counter value={percent} suffix="%" trigger={percent} /></span>
        <span className="text-xs tracking-widest uppercase" style={{ color: C.mute }}>Attendance</span>
      </div>
    </div>
  );
}

function GoldButton({ children, variant = "solid", className = "", ...props }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold font-body transition-all duration-300";
  if (variant === "solid") {
    return (
      <button
        className={`${base} ${className}`}
        style={{
          background: `linear-gradient(120deg, ${C.gold}, ${C.emerald})`,
          color: C.obsidian,
          boxShadow: `0 8px 24px -8px ${C.gold}66`,
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
  return (
    <button
      className={`${base} border ${className}`}
      style={{ borderColor: `${C.gold}66`, color: C.cream }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.goldLight)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = `${C.gold}66`)}
      {...props}
    >
      {children}
    </button>
  );
}

/* ============================================================
   NAVBAR
   ============================================================ */
function Navbar({ dark, setDark, mobileOpen, setMobileOpen }) {
  const links = ["Home", "Tracks", "Mentors", "Announcements", "FAQ"];
  return (
    <header
      className="fixed top-0 inset-x-0 z-40 font-body"
      style={{
        backgroundColor: dark ? "rgba(5,28,20,0.72)" : "rgba(248,249,250,0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${C.gold}33`,
        boxShadow: `0 1px 0 0 ${C.gold}00, 0 8px 24px -12px rgba(0,0,0,0.4)`,
      }}
    >
      <div
        className="h-[2px] w-full"
        style={{ background: `linear-gradient(90deg, transparent, ${C.gold}, ${C.emerald}, transparent)` }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand slot */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="relative shrink-0 w-11 h-11 rounded-full flex items-center justify-center overflow-hidden"
            style={{ boxShadow: `0 0 0 2px ${C.gold}, 0 0 18px 2px ${C.gold}55` }}
            title="Logo slot — drop ASTU MSJ logo here"
          >
            {/* [INSERT_LOGO_HERE] — replace this div's children with <img src="..." className="w-full h-full object-contain" /> */}
            <div
              className="w-full h-full flex items-center justify-center text-[9px] text-center leading-tight font-semibold"
              style={{ backgroundColor: C.obsidian, color: C.gold }}
            >
              LOGO
            </div>
            {/* [/INSERT_LOGO_HERE] */}
          </div>
          <span className="font-display text-xl font-semibold truncate" style={{ color: dark ? C.cream : C.deep }}>
            ASTU MSJ <span className="gold-text">Bootcamp</span>
          </span>
        </div>

        {/* Center links */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l}
              href="#"
              className="text-sm font-medium relative group"
              style={{ color: dark ? C.mute : "#3F5A4D" }}
            >
              {l}
              <span
                className="absolute -bottom-1 left-0 h-[1.5px] w-0 group-hover:w-full transition-all duration-300"
                style={{ backgroundColor: C.gold }}
              />
            </a>
          ))}
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setDark(!dark)}
            className="w-9 h-9 rounded-full flex items-center justify-center border"
            style={{ borderColor: `${C.gold}55`, color: C.gold }}
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <GoldButton variant="ghost">Login</GoldButton>
          <GoldButton>Get Started <ChevronRight size={16} /></GoldButton>
        </div>

        <button className="md:hidden" style={{ color: C.gold }} onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {mobileOpen && (
        <div
          className="md:hidden px-4 pb-4 flex flex-col gap-3 animate-fadeUp"
          style={{ backgroundColor: dark ? C.obsidian : C.cream }}
        >
          {links.map((l) => (
            <a key={l} href="#" className="text-sm font-medium py-1" style={{ color: dark ? C.cream : C.deep }}>{l}</a>
          ))}
          <div className="flex gap-3 pt-2">
            <GoldButton variant="ghost" className="flex-1">Login</GoldButton>
            <GoldButton className="flex-1">Get Started</GoldButton>
          </div>
        </div>
      )}
    </header>
  );
}

/* ============================================================
   HERO
   ============================================================ */
function Hero({ dark }) {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-14 items-center">
        <div className="animate-fadeUp">
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold mb-6 border"
            style={{ borderColor: `${C.emerald}55`, color: C.emerald, backgroundColor: `${C.emerald}14` }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: C.emerald }} />
            Cohort 5 · Enrollment Open
          </div>
          <h1 className="font-display text-5xl sm:text-6xl font-semibold leading-[1.05]" style={{ color: dark ? C.cream : C.deep }}>
            Empowering the <span className="gold-text">Next Generation</span> of Engineers
          </h1>
          <p className="mt-6 text-lg max-w-lg font-body" style={{ color: dark ? C.mute : "#3F5A4D" }}>
            ASTU MSJ Bootcamp equips Adama Science &amp; Technology University students with
            structured tracks, dedicated mentors, and a rigorous path from first commit to
            production-ready engineer.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <GoldButton className="text-base px-6 py-3">Explore Dashboard <ChevronRight size={18} /></GoldButton>
            <GoldButton variant="ghost" className="text-base px-6 py-3">View Batches</GoldButton>
          </div>
          <div className="mt-10 flex items-center gap-8 text-sm" style={{ color: dark ? C.mute : "#3F5A4D" }}>
            <div><span className="font-display text-2xl font-semibold gold-text">340+</span><br />Students trained</div>
            <div><span className="font-display text-2xl font-semibold gold-text">18</span><br />Mentors</div>
            <div><span className="font-display text-2xl font-semibold gold-text">96%</span><br />Completion</div>
          </div>
        </div>

        {/* Floating glass stat card in geometric frame */}
        <div className="relative flex justify-center lg:justify-end animate-fadeUp" style={{ animationDelay: "150ms" }}>
          <div className="absolute -inset-6 rounded-[2.5rem] opacity-40" style={{ border: `1px dashed ${C.gold}55` }} />
          <div
            className="relative w-full max-w-sm rounded-3xl p-7 animate-float"
            style={{
              backgroundColor: dark ? C.surface : C.surfaceLight,
              backdropFilter: "blur(16px)",
              border: `1px solid ${C.gold}4D`,
              boxShadow: `0 30px 80px -30px rgba(212,175,55,0.3)`,
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs uppercase tracking-widest" style={{ color: C.mute }}>Live Bootcamp Pulse</span>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: C.emerald }} />
            </div>
            <div className="space-y-5">
              {[
                { icon: LayoutGrid, label: "Active Batches", value: 6, suffix: "" },
                { icon: CheckCircle2, label: "Attendance Rate", value: 91, suffix: "%" },
                { icon: ClipboardList, label: "Assignments Completed", value: 1240, suffix: "" },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${C.gold}1A`, color: C.gold }}>
                    <s.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="text-2xl font-display font-semibold" style={{ color: dark ? C.cream : C.deep }}>
                      <Counter value={s.value} suffix={s.suffix} trigger="hero" />
                    </div>
                    <div className="text-xs" style={{ color: C.mute }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   STAT CARD (shared, arch top)
   ============================================================ */
function StatCard({ icon: Icon, label, value, suffix = "", dark, trigger }) {
  return (
    <ArchTop dark={dark}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest mb-2" style={{ color: C.mute }}>{label}</div>
          <div className="font-display text-3xl font-semibold" style={{ color: dark ? C.cream : C.deep }}>
            <Counter value={value} suffix={suffix} trigger={trigger} />
          </div>
        </div>
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${C.gold}1A`, color: C.gold }}>
          <Icon size={18} />
        </div>
      </div>
    </ArchTop>
  );
}

/* ============================================================
   STUDENT DASHBOARD
   ============================================================ */
function StudentDashboard({ dark }) {
  const topics = [
    { name: "React Fundamentals", pct: 92 },
    { name: "Node & Express APIs", pct: 74 },
    { name: "MongoDB Data Modeling", pct: 58 },
    { name: "Auth & Security", pct: 30 },
  ];
  const deadlines = [
    { title: "REST API Assignment", due: "Aug 21", status: "Due Soon" },
    { title: "React Hooks Quiz", due: "Aug 24", status: "Upcoming" },
    { title: "Capstone Proposal", due: "Aug 30", status: "Upcoming" },
  ];
  const announcements = [
    { title: "Guest lecture: Systems Design", time: "2h ago" },
    { title: "Mentor office hours moved to Thu", time: "1d ago" },
  ];
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 flex flex-col gap-6">
        <ArchTop dark={dark} className="flex flex-col items-center py-8">
          <AttendanceRing percent={87} />
          <p className="mt-4 text-sm text-center" style={{ color: C.mute }}>You're ahead of 78% of your batch this month.</p>
        </ArchTop>
        <StatCard icon={Award} label="Assignments Completed" value={22} dark={dark} trigger="student" />
      </div>

      <div className="lg:col-span-2 flex flex-col gap-6">
        <ArchTop dark={dark}>
          <h3 className="font-display text-xl font-semibold mb-5" style={{ color: dark ? C.cream : C.deep }}>Topic Progress</h3>
          <div className="space-y-5">
            {topics.map((t) => (
              <div key={t.name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span style={{ color: dark ? C.cream : C.deep }}>{t.name}</span>
                  <span style={{ color: C.gold }}>{t.pct}%</span>
                </div>
                <div className="h-2 rounded-full w-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${t.pct}%`, background: `linear-gradient(90deg, ${C.gold}, ${C.emerald})`, transition: "width 1s cubic-bezier(.16,1,.3,1)" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </ArchTop>

        <div className="grid sm:grid-cols-2 gap-6">
          <ArchTop dark={dark}>
            <h3 className="font-display text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: dark ? C.cream : C.deep }}>
              <Clock size={18} style={{ color: C.gold }} /> Deadlines
            </h3>
            <ul className="space-y-3">
              {deadlines.map((d) => (
                <li key={d.title} className="flex items-center justify-between text-sm">
                  <span style={{ color: dark ? C.cream : C.deep }}>{d.title}</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      color: d.status === "Due Soon" ? "#F87171" : C.emerald,
                      backgroundColor: d.status === "Due Soon" ? "#F8717122" : `${C.emerald}22`,
                    }}
                  >
                    {d.due}
                  </span>
                </li>
              ))}
            </ul>
          </ArchTop>

          <ArchTop dark={dark}>
            <h3 className="font-display text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: dark ? C.cream : C.deep }}>
              <Bell size={18} style={{ color: C.gold }} /> Announcements
            </h3>
            <ul className="space-y-3">
              {announcements.map((a) => (
                <li key={a.title} className="text-sm">
                  <div style={{ color: dark ? C.cream : C.deep }}>{a.title}</div>
                  <div className="text-xs mt-0.5" style={{ color: C.mute }}>{a.time}</div>
                </li>
              ))}
            </ul>
          </ArchTop>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MENTOR DASHBOARD
   ============================================================ */
function MentorDashboard({ dark }) {
  const [statuses, setStatuses] = useState({
    "Betelhem A.": "Present",
    "Kaleb T.": "Late",
    "Sara M.": "Absent",
    "Nathnael G.": "Present",
  });
  const options = ["Present", "Absent", "Late", "Excused"];
  const optColor = { Present: C.emerald, Absent: "#F87171", Late: C.gold, Excused: "#60A5FA" };
  const grading = [
    { student: "Betelhem A.", assignment: "REST API Assignment", submitted: "Aug 18" },
    { student: "Kaleb T.", assignment: "React Hooks Quiz", submitted: "Aug 17" },
  ];
  const atRisk = ["Sara M.", "Yonas B."];

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 flex flex-col gap-6">
        <StatCard icon={Users} label="Assigned Students" value={24} dark={dark} trigger="mentor" />
        <ArchTop dark={dark}>
          <h3 className="font-display text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: dark ? C.cream : C.deep }}>
            <AlertTriangle size={18} style={{ color: "#F87171" }} /> At-Risk Students
          </h3>
          <div className="flex flex-wrap gap-2">
            {atRisk.map((s) => (
              <span key={s} className="text-xs px-3 py-1.5 rounded-full font-medium" style={{ color: "#F87171", backgroundColor: "#F8717122", border: "1px solid #F8717155" }}>
                {s}
              </span>
            ))}
          </div>
        </ArchTop>
        <ArchTop dark={dark}>
          <h3 className="font-display text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: dark ? C.cream : C.deep }}>
            <ClipboardList size={18} style={{ color: C.gold }} /> Pending Grading
          </h3>
          <ul className="space-y-3">
            {grading.map((g) => (
              <li key={g.student} className="text-sm flex items-center justify-between">
                <div>
                  <div style={{ color: dark ? C.cream : C.deep }}>{g.student}</div>
                  <div className="text-xs" style={{ color: C.mute }}>{g.assignment}</div>
                </div>
                <span className="text-xs" style={{ color: C.mute }}>{g.submitted}</span>
              </li>
            ))}
          </ul>
        </ArchTop>
      </div>

      <div className="lg:col-span-2">
        <ArchTop dark={dark}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-xl font-semibold" style={{ color: dark ? C.cream : C.deep }}>Assigned Students — Quick Attendance</h3>
          </div>
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr style={{ color: C.mute }}>
                  <th className="text-left font-medium pb-3">Student</th>
                  <th className="text-left font-medium pb-3">Track</th>
                  <th className="text-left font-medium pb-3">Mark Attendance</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(statuses).map((name, i) => (
                  <tr key={name} style={{ borderTop: `1px solid ${C.gold}22` }}>
                    <td className="py-3" style={{ color: dark ? C.cream : C.deep }}>{name}</td>
                    <td className="py-3" style={{ color: C.mute }}>{i % 2 === 0 ? "Full-Stack" : "Backend"}</td>
                    <td className="py-3">
                      <div className="flex gap-1.5 flex-wrap">
                        {options.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => setStatuses((s) => ({ ...s, [name]: opt }))}
                            className="text-[11px] px-2.5 py-1 rounded-full font-medium transition-all duration-200"
                            style={
                              statuses[name] === opt
                                ? { backgroundColor: optColor[opt], color: C.obsidian }
                                : { border: `1px solid ${optColor[opt]}55`, color: optColor[opt] }
                            }
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ArchTop>
      </div>
    </div>
  );
}

/* ============================================================
   ADMIN DASHBOARD
   ============================================================ */
function AdminDashboard({ dark }) {
  const attendanceData = [
    { week: "W1", rate: 88 }, { week: "W2", rate: 91 }, { week: "W3", rate: 85 },
    { week: "W4", rate: 94 }, { week: "W5", rate: 90 }, { week: "W6", rate: 96 },
  ];
  const trackData = [
    { name: "Full-Stack", value: 120 },
    { name: "AI/ML", value: 70 },
    { name: "Cybersecurity", value: 55 },
    { name: "Mobile", value: 40 },
  ];
  const pieColors = [C.gold, C.emerald, "#60A5FA", "#F59E0B"];
  const batches = [
    { name: "Cohort 5 — Full-Stack", students: 62, status: "Active" },
    { name: "Cohort 5 — AI/ML", students: 38, status: "Active" },
    { name: "Cohort 4 — Cybersecurity", students: 30, status: "Closing" },
  ];
  const [audience, setAudience] = useState("All Students");

  return (
    <div className="flex flex-col gap-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Users} label="Total Users" value={412} dark={dark} trigger="admin" />
        <StatCard icon={LayoutGrid} label="Active Batches" value={6} dark={dark} trigger="admin" />
        <StatCard icon={TrendingUp} label="Avg. Attendance" value={91} suffix="%" dark={dark} trigger="admin" />
        <StatCard icon={GraduationCap} label="Mentors" value={18} dark={dark} trigger="admin" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <ArchTop dark={dark} className="lg:col-span-2">
          <h3 className="font-display text-xl font-semibold mb-4" style={{ color: dark ? C.cream : C.deep }}>Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="week" stroke={C.mute} fontSize={12} />
              <YAxis stroke={C.mute} fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: C.obsidian, border: `1px solid ${C.gold}55`, borderRadius: 8, color: C.cream }} />
              <Line type="monotone" dataKey="rate" stroke={C.gold} strokeWidth={3} dot={{ fill: C.emerald, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ArchTop>

        <ArchTop dark={dark}>
          <h3 className="font-display text-xl font-semibold mb-4" style={{ color: dark ? C.cream : C.deep }}>Students by Track</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={trackData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={3}>
                {trackData.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: C.obsidian, border: `1px solid ${C.gold}55`, borderRadius: 8, color: C.cream }} />
            </PieChart>
          </ResponsiveContainer>
        </ArchTop>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <ArchTop dark={dark} className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-xl font-semibold" style={{ color: dark ? C.cream : C.deep }}>User &amp; Batch Control</h3>
            <GoldButton className="text-xs px-3 py-1.5"><Plus size={14} /> New Batch</GoldButton>
          </div>
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr style={{ color: C.mute }}>
                  <th className="text-left font-medium pb-3">Batch</th>
                  <th className="text-left font-medium pb-3">Students</th>
                  <th className="text-left font-medium pb-3">Status</th>
                  <th className="pb-3" />
                </tr>
              </thead>
              <tbody>
                {batches.map((b) => (
                  <tr key={b.name} style={{ borderTop: `1px solid ${C.gold}22` }}>
                    <td className="py-3" style={{ color: dark ? C.cream : C.deep }}>{b.name}</td>
                    <td className="py-3" style={{ color: C.mute }}>{b.students}</td>
                    <td className="py-3">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          color: b.status === "Active" ? C.emerald : C.gold,
                          backgroundColor: b.status === "Active" ? `${C.emerald}22` : `${C.gold}22`,
                        }}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 text-right"><MoreVertical size={16} style={{ color: C.mute }} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ArchTop>

        <ArchTop dark={dark}>
          <h3 className="font-display text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: dark ? C.cream : C.deep }}>
            <Megaphone size={18} style={{ color: C.gold }} /> Announcement Builder
          </h3>
          <input
            placeholder="Title"
            className="w-full mb-3 rounded-lg px-3 py-2 text-sm outline-none"
            style={{ backgroundColor: "rgba(255,255,255,0.06)", color: dark ? C.cream : C.deep, border: `1px solid ${C.gold}33` }}
          />
          <textarea
            placeholder="Message"
            rows={3}
            className="w-full mb-3 rounded-lg px-3 py-2 text-sm outline-none resize-none"
            style={{ backgroundColor: "rgba(255,255,255,0.06)", color: dark ? C.cream : C.deep, border: `1px solid ${C.gold}33` }}
          />
          <div className="flex flex-wrap gap-2 mb-4">
            {["All Students", "Mentors", "Full-Stack", "AI/ML"].map((a) => (
              <button
                key={a}
                onClick={() => setAudience(a)}
                className="text-xs px-3 py-1.5 rounded-full font-medium"
                style={
                  audience === a
                    ? { backgroundColor: C.gold, color: C.obsidian }
                    : { border: `1px solid ${C.gold}55`, color: C.gold }
                }
              >
                {a}
              </button>
            ))}
          </div>
          <GoldButton className="w-full">Publish Announcement</GoldButton>
        </ArchTop>
      </div>
    </div>
  );
}

/* ============================================================
   DASHBOARD SECTION (role tabs)
   ============================================================ */
function DashboardSection({ dark }) {
  const [role, setRole] = useState("Student");
  const roles = [
    { key: "Student", icon: GraduationCap },
    { key: "Mentor", icon: UserCog },
    { key: "Admin", icon: LayoutGrid },
  ];
  return (
    <section id="dashboard" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-28">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h2 className="font-display text-3xl font-semibold" style={{ color: dark ? C.cream : C.deep }}>
          Role-Based <span className="gold-text">Dashboards</span>
        </h2>
        <div className="flex gap-2 p-1 rounded-xl" style={{ backgroundColor: dark ? "rgba(255,255,255,0.05)" : "rgba(5,28,20,0.06)" }}>
          {roles.map((r) => (
            <button
              key={r.key}
              onClick={() => setRole(r.key)}
              className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-all duration-300"
              style={
                role === r.key
                  ? { background: `linear-gradient(120deg, ${C.gold}, ${C.emerald})`, color: C.obsidian }
                  : { color: dark ? C.mute : "#3F5A4D" }
              }
            >
              <r.icon size={15} /> {r.key}
            </button>
          ))}
        </div>
      </div>

      <div key={role} className="animate-fadeUp">
        {role === "Student" && <StudentDashboard dark={dark} />}
        {role === "Mentor" && <MentorDashboard dark={dark} />}
        {role === "Admin" && <AdminDashboard dark={dark} />}
      </div>
    </section>
  );
}

/* ============================================================
   MOBILE BOTTOM NAV
   ============================================================ */
function MobileBottomNav({ dark }) {
  const [active, setActive] = useState("Home");
  const items = [
    { key: "Home", icon: Home },
    { key: "Tracks", icon: BookOpen },
    { key: "Dashboard", icon: LayoutGrid },
    { key: "Alerts", icon: Bell },
    { key: "Search", icon: Search },
  ];
  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 px-3 pb-3"
      style={{ backgroundColor: "transparent" }}
    >
      <div
        className="flex items-center justify-between rounded-2xl px-2 py-2"
        style={{
          backgroundColor: dark ? "rgba(5,28,20,0.9)" : "rgba(248,249,250,0.95)",
          backdropFilter: "blur(16px)",
          border: `1px solid ${C.gold}40`,
          boxShadow: "0 10px 30px -12px rgba(0,0,0,0.5)",
        }}
      >
        {items.map((it) => (
          <button
            key={it.key}
            onClick={() => setActive(it.key)}
            className="flex-1 flex flex-col items-center gap-1 py-1.5 rounded-xl relative"
          >
            {active === it.key && (
              <span
                className="absolute -top-px w-6 h-[2px] rounded-full"
                style={{ background: `linear-gradient(90deg, ${C.gold}, ${C.emerald})` }}
              />
            )}
            <it.icon size={18} style={{ color: active === it.key ? C.gold : C.mute }} />
            <span className="text-[10px]" style={{ color: active === it.key ? C.gold : C.mute }}>{it.key}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

/* ============================================================
   ROOT APP
   ============================================================ */
export default function App() {
  const [dark, setDark] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      className="min-h-screen font-body relative pb-24 md:pb-0"
      style={{ backgroundColor: dark ? C.deep : C.cream, transition: "background-color .4s ease" }}
    >
      <style>{fontImport}</style>
      <GirihBackground opacity={dark ? 0.05 : 0.04} color={C.gold} />
      <Navbar dark={dark} setDark={setDark} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <Hero dark={dark} />
      <DashboardSection dark={dark} />
      <MobileBottomNav dark={dark} />
    </div>
  );
}
