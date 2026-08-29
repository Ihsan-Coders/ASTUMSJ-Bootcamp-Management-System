// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import {
//   Users,
//   GraduationCap,
//   Layers,
//   CalendarCheck,
//   ClipboardList,
// } from "lucide-react";
// import StatCard from "../../components/common/StatCard";
// import Loader from "../../components/common/Loader";
// import EmptyState from "../../components/common/EmptyState";
// import AnnouncementForm from "../../components/announcements/AnnouncementForm";
// import AnnouncementCard from "../../components/announcements/AnnouncementCard";
// import { getAdminDashboard } from "../../api/dashboard.api";
// import { getAnnouncements } from "../../api/announcement.api";

// // Fallback sample data — shown if the backend isn't ready yet or a request fails.
// // This keeps the dashboard looking complete during development or a live demo
// // even if a real API call hiccups.
// const FALLBACK_STATS = {
//   studentCount: 128,
//   mentorCount: 12,
//   batchCount: 4,
//   attendanceRate: 94,
//   gradedSubmissions: 312,
// };

// const FALLBACK_USERS = [
//   {
//     id: 1,
//     name: "Bethelhem Assefa",
//     email: "bethelhem@astu.edu.et",
//     role: "Student",
//     batch: "Batch 4",
//   },
//   {
//     id: 2,
//     name: "Nahom Girma",
//     email: "nahom@astu.edu.et",
//     role: "Mentor",
//     batch: "Batch 3",
//   },
//   {
//     id: 3,
//     name: "Selam Tesfaye",
//     email: "selam@astu.edu.et",
//     role: "Student",
//     batch: "Batch 4",
//   },
// ];

// const FALLBACK_BATCHES = [
//   { id: 1, name: "Batch 4 — Summer", students: 34, status: "Active" },
//   { id: 2, name: "Batch 3 — Spring", students: 29, status: "Completed" },
// ];

// function TabButton({ active, onClick, children }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//         active
//           ? "bg-gradient-to-r from-gold to-emerald text-obsidian"
//           : "text-text-secondary hover:text-text-primary"
//       }`}
//     >
//       {children}
//     </button>
//   );
// }

// export default function AdminDashboard() {
//   const [tab, setTab] = useState("overview");
//   const [stats, setStats] = useState(FALLBACK_STATS);
//   const [users, setUsers] = useState(FALLBACK_USERS);
//   const [batches, setBatches] = useState(FALLBACK_BATCHES);
//   const [isLive, setIsLive] = useState(false); // tracks whether we're showing real or fallback data

//   const [recentAnnouncements, setRecentAnnouncements] = useState([]);
//   const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);
//   const [announcementsError, setAnnouncementsError] = useState("");

//   const loadRecentAnnouncements = () => {
//     setLoadingAnnouncements(true);
//     getAnnouncements()
//       .then((res) => {
//         setRecentAnnouncements((res.data.data || []).slice(0, 5));
//         setAnnouncementsError("");
//       })
//       .catch((err) => {
//         setAnnouncementsError(
//           err?.response?.data?.message || "Failed to load announcements",
//         );
//       })
//       .finally(() => setLoadingAnnouncements(false));
//   };

//   useEffect(() => {
//     // eslint-disable-next-line react-hooks/set-state-in-effect
//     loadRecentAnnouncements();
//   }, []);

//   useEffect(() => {
//     getAdminDashboard()
//       .then((res) => {
//         const data = res.data.data;
//         setStats({
//           studentCount: data.studentCount,
//           mentorCount: data.mentorCount,
//           batchCount: data.batchCount,
//           attendanceRate: data.attendanceRate,
//           gradedSubmissions: data.gradedSubmissions,
//         });
//         if (data.recentActivity) {
//           setUsers(
//             data.recentActivity.map((a, i) => ({
//               id: a._id || i,
//               name: a.student?.name || "Unknown",
//               email: "",
//               role: "Student",
//               batch: a.assignment?.title || "",
//             })),
//           );
//         }
//         setIsLive(true);
//       })
//       .catch(() => {
//         // Backend not ready yet or request failed — silently keep fallback data
//         setIsLive(false);
//       });
//   }, []);

//   const STATS = [
//     { label: "Students", value: stats.studentCount, icon: GraduationCap },
//     { label: "Mentors", value: stats.mentorCount, icon: Users },
//     { label: "Batches", value: stats.batchCount, icon: Layers },
//     {
//       label: "Attendance Rate",
//       value: `${stats.attendanceRate}%`,
//       icon: CalendarCheck,
//     },
//     {
//       label: "Assignments Graded",
//       value: stats.gradedSubmissions,
//       icon: ClipboardList,
//     },
//   ];

//   return (
//     <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-7xl mx-auto">
//       <div className="flex items-center justify-between mb-6">
//         <motion.h1
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-2xl sm:text-3xl font-bold text-text-primary font-[var(--font-display)]"
//         >
//           Admin Dashboard
//         </motion.h1>
//         {!isLive && (
//           <span className="text-xs px-2 py-1 rounded-full bg-warning/15 text-warning">
//             Sample Data
//           </span>
//         )}
//       </div>

//       <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
//         {STATS.map((s) => (
//           <StatCard key={s.label} {...s} />
//         ))}
//       </div>

//       <div className="flex gap-2 mb-6 glass-card rounded-lg p-1.5 w-fit">
//         <TabButton
//           active={tab === "overview"}
//           onClick={() => setTab("overview")}
//         >
//           Users & Batches
//         </TabButton>
//         <TabButton
//           active={tab === "announce"}
//           onClick={() => setTab("announce")}
//         >
//           Announcements
//         </TabButton>
//       </div>

//       {tab === "overview" && (
//         <div className="grid lg:grid-cols-2 gap-6">
//           <div className="glass-card glow-border rounded-xl p-5">
//             <h2 className="text-text-primary font-semibold mb-4">Users</h2>
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="text-text-secondary text-left border-b border-border">
//                     <th className="py-2 font-medium">Name</th>
//                     <th className="py-2 font-medium">Role</th>
//                     <th className="py-2 font-medium">Batch</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {users.map((u) => (
//                     <tr
//                       key={u.id}
//                       className="border-b border-border/50 last:border-0"
//                     >
//                       <td className="py-2.5 text-text-primary">{u.name}</td>
//                       <td className="py-2.5">
//                         <span
//                           className={`text-xs px-2 py-0.5 rounded-full ${
//                             u.role === "Mentor"
//                               ? "bg-emerald/15 text-emerald"
//                               : "bg-gold/15 text-gold"
//                           }`}
//                         >
//                           {u.role}
//                         </span>
//                       </td>
//                       <td className="py-2.5 text-text-secondary">{u.batch}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           <div className="glass-card glow-border rounded-xl p-5">
//             <h2 className="text-text-primary font-semibold mb-4">Batches</h2>
//             <div className="space-y-3">
//               {batches.map((b) => (
//                 <div
//                   key={b.id}
//                   className="flex items-center justify-between border-b border-border/50 last:border-0 pb-3 last:pb-0"
//                 >
//                   <div>
//                     <p className="text-text-primary text-sm font-medium">
//                       {b.name}
//                     </p>
//                     <p className="text-text-secondary text-xs">
//                       {b.students} students
//                     </p>
//                   </div>
//                   <span
//                     className={`text-xs px-2 py-0.5 rounded-full ${
//                       b.status === "Active"
//                         ? "bg-emerald/15 text-emerald"
//                         : "bg-text-secondary/15 text-text-secondary"
//                     }`}
//                   >
//                     {b.status}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {tab === "announce" && (
//         <div className="grid lg:grid-cols-[380px_1fr] gap-6 items-start">
//           <AnnouncementForm
//             mode="create"
//             onSuccess={(created) =>
//               setRecentAnnouncements((current) =>
//                 [created, ...current].slice(0, 5),
//               )
//             }
//           />

//           <div className="glass-card glow-border rounded-xl p-5">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-text-primary font-semibold">
//                 Recent Announcements
//               </h2>
//               <Link
//                 to="/admin/announcements"
//                 className="text-xs text-gold hover:underline shrink-0"
//               >
//                 Manage all →
//               </Link>
//             </div>

//             {announcementsError && (
//               <p className="text-danger text-sm mb-3">
//                 {announcementsError}
//               </p>
//             )}

//             {loadingAnnouncements && <Loader />}

//             {!loadingAnnouncements &&
//               recentAnnouncements.length === 0 &&
//               !announcementsError && (
//                 <EmptyState message="No announcements yet" icon="📢" />
//               )}

//             {!loadingAnnouncements && recentAnnouncements.length > 0 && (
//               <div className="space-y-3">
//                 {recentAnnouncements.map((announcement) => (
//                   <AnnouncementCard
//                     key={announcement._id}
//                     announcement={announcement}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import {
//   Users,
//   GraduationCap,
//   Layers,
//   CalendarCheck,
//   ClipboardList,
// } from "lucide-react";
// import StatCard from "../../components/common/StatCard";
// import Loader from "../../components/common/Loader";
// import EmptyState from "../../components/common/EmptyState";
// import AnnouncementForm from "../../components/announcements/AnnouncementForm";
// import AnnouncementCard from "../../components/announcements/AnnouncementCard";
// import { getAdminDashboard } from "../../api/dashboard.api";
// import { getAnnouncements } from "../../api/announcement.api";

// const FALLBACK_STATS = {
//   studentCount: 0,
//   mentorCount: 0,
//   batchCount: 0,
//   attendanceRate: 0,
//   gradedSubmissions: 0,
// };

// const FALLBACK_BATCHES = [
//   {
//     id: 1,
//     name: "Batch 4 — Summer",
//     students: 34,
//     status: "Active",
//   },
//   {
//     id: 2,
//     name: "Batch 3 — Spring",
//     students: 29,
//     status: "Completed",
//   },
// ];

// function TabButton({ active, onClick, children }) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
//         active
//           ? "bg-gradient-to-r from-gold to-emerald text-obsidian"
//           : "text-text-secondary hover:text-text-primary"
//       }`}
//     >
//       {children}
//     </button>
//   );
// }

// export default function AdminDashboard() {
//   const [tab, setTab] = useState("overview");

//   const [stats, setStats] = useState(FALLBACK_STATS);
//   const [users, setUsers] = useState([]);
//   const [batches, setBatches] = useState(FALLBACK_BATCHES);

//   const [isLive, setIsLive] = useState(false);
//   const [loadingDashboard, setLoadingDashboard] = useState(true);

//   const [recentAnnouncements, setRecentAnnouncements] = useState([]);
//   const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);
//   const [announcementsError, setAnnouncementsError] = useState("");

//   const loadRecentAnnouncements = async () => {
//     try {
//       setLoadingAnnouncements(true);
//       setAnnouncementsError("");

//       const res = await getAnnouncements();

//       setRecentAnnouncements((res?.data?.data || []).slice(0, 5));
//     } catch (err) {
//       setAnnouncementsError(
//         err?.response?.data?.message || "Failed to load announcements",
//       );
//     } finally {
//       setLoadingAnnouncements(false);
//     }
//   };

//   useEffect(() => {
//     loadRecentAnnouncements();
//   }, []);

//   useEffect(() => {
//     const loadDashboard = async () => {
//       try {
//         setLoadingDashboard(true);

//         const res = await getAdminDashboard();
//         const data = res?.data?.data;

//         if (!data) {
//           throw new Error("Invalid dashboard response");
//         }

//         setStats({
//           studentCount: data.studentCount ?? 0,
//           mentorCount: data.mentorCount ?? 0,
//           batchCount: data.batchCount ?? 0,
//           attendanceRate: data.attendanceRate ?? 0,
//           gradedSubmissions: data.gradedSubmissions ?? 0,
//         });

//         const recentUsers = (data.recentUsers || []).map((user) => ({
//           id: user._id,
//           name: user.name || "Unnamed User",
//           email: user.email || "No email available",
//           role: user.role === "mentor" ? "Mentor" : "Student",
//           batch: user.batch?.name || "Not assigned",
//         }));

//         setUsers(recentUsers);

//         setIsLive(true);
//       } catch (err) {
//         setIsLive(false);
//         setUsers([]);
//       } finally {
//         setLoadingDashboard(false);
//       }
//     };

//     loadDashboard();
//   }, []);

//   const STATS = [
//     {
//       label: "Students",
//       value: stats.studentCount,
//       icon: GraduationCap,
//     },
//     {
//       label: "Mentors",
//       value: stats.mentorCount,
//       icon: Users,
//     },
//     {
//       label: "Batches",
//       value: stats.batchCount,
//       icon: Layers,
//     },
//     {
//       label: "Attendance Rate",
//       value: `${stats.attendanceRate}%`,
//       icon: CalendarCheck,
//     },
//     {
//       label: "Assignments Graded",
//       value: stats.gradedSubmissions,
//       icon: ClipboardList,
//     },
//   ];

//   return (
//     <div className="mx-auto max-w-7xl px-4 pb-24 pt-24 sm:px-6 sm:pt-28 md:pb-12">
//       <div className="mb-6 flex items-center justify-between gap-4">
//         <motion.h1
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="font-[var(--font-display)] text-2xl font-bold text-text-primary sm:text-3xl"
//         >
//           Admin Dashboard
//         </motion.h1>

//         {!isLive && !loadingDashboard && (
//           <span className="rounded-full bg-warning/15 px-2 py-1 text-xs text-warning">
//             Offline
//           </span>
//         )}

//         {isLive && (
//           <span className="rounded-full bg-emerald/15 px-2 py-1 text-xs font-medium text-emerald">
//             Live
//           </span>
//         )}
//       </div>

//       <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
//         {STATS.map((stat) => (
//           <StatCard key={stat.label} {...stat} />
//         ))}
//       </div>

//       <div className="glass-card mb-6 flex w-fit gap-2 rounded-lg p-1.5">
//         <TabButton
//           active={tab === "overview"}
//           onClick={() => setTab("overview")}
//         >
//           Users & Batches
//         </TabButton>

//         <TabButton
//           active={tab === "announce"}
//           onClick={() => setTab("announce")}
//         >
//           Announcements
//         </TabButton>
//       </div>

//       {tab === "overview" && (
//         <div className="grid gap-6 lg:grid-cols-2">
//           <div className="glass-card glow-border rounded-xl p-5">
//             <div className="mb-4 flex items-center justify-between">
//               <div>
//                 <h2 className="font-semibold text-text-primary">
//                   Recent Users
//                 </h2>

//                 <p className="mt-1 text-xs text-text-secondary">
//                   Latest registered students and mentors
//                 </p>
//               </div>

//               <Users className="h-5 w-5 text-gold" />
//             </div>

//             {loadingDashboard ? (
//               <div className="py-8">
//                 <Loader />
//               </div>
//             ) : users.length === 0 ? (
//               <div className="flex flex-col items-center justify-center py-10 text-center">
//                 <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-text-secondary/10">
//                   <Users className="h-6 w-6 text-text-secondary" />
//                 </div>

//                 <p className="text-sm font-semibold text-text-primary">
//                   No recent user activity
//                 </p>

//                 <p className="mt-1 max-w-xs text-xs leading-5 text-text-secondary">
//                   Newly registered students and mentors will appear here.
//                 </p>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full text-sm">
//                   <thead>
//                     <tr className="border-b border-border text-left text-text-secondary">
//                       <th className="py-2 font-medium">User</th>

//                       <th className="py-2 font-medium">Role</th>

//                       <th className="py-2 font-medium">Batch</th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {users.map((user) => (
//                       <tr
//                         key={user.id}
//                         className="border-b border-border/50 last:border-0"
//                       >
//                         <td className="py-3">
//                           <div className="min-w-[180px]">
//                             <p className="font-medium text-text-primary">
//                               {user.name}
//                             </p>

//                             <p className="mt-0.5 text-xs text-text-secondary">
//                               {user.email}
//                             </p>
//                           </div>
//                         </td>

//                         <td className="py-3">
//                           <span
//                             className={`rounded-full px-2 py-1 text-xs ${
//                               user.role === "Mentor"
//                                 ? "bg-emerald/15 text-emerald"
//                                 : "bg-gold/15 text-gold"
//                             }`}
//                           >
//                             {user.role}
//                           </span>
//                         </td>

//                         <td className="py-3 text-text-secondary">
//                           {user.batch}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>

//           <div className="glass-card glow-border rounded-xl p-5">
//             <div className="mb-4 flex items-center justify-between">
//               <div>
//                 <h2 className="font-semibold text-text-primary">Batches</h2>

//                 <p className="mt-1 text-xs text-text-secondary">
//                   Current bootcamp batches
//                 </p>
//               </div>

//               <Layers className="h-5 w-5 text-emerald" />
//             </div>

//             <div className="space-y-3">
//               {batches.map((batch) => (
//                 <div
//                   key={batch.id}
//                   className="flex items-center justify-between gap-4 border-b border-border/50 pb-3 last:border-0 last:pb-0"
//                 >
//                   <div className="min-w-0">
//                     <p className="truncate text-sm font-medium text-text-primary">
//                       {batch.name}
//                     </p>

//                     <p className="text-xs text-text-secondary">
//                       {batch.students} students
//                     </p>
//                   </div>

//                   <span
//                     className={`shrink-0 rounded-full px-2 py-1 text-xs ${
//                       batch.status === "Active"
//                         ? "bg-emerald/15 text-emerald"
//                         : "bg-text-secondary/15 text-text-secondary"
//                     }`}
//                   >
//                     {batch.status}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {tab === "announce" && (
//         <div className="grid items-start gap-6 lg:grid-cols-[380px_1fr]">
//           <AnnouncementForm
//             mode="create"
//             onSuccess={(created) =>
//               setRecentAnnouncements((current) =>
//                 [created, ...current].slice(0, 5),
//               )
//             }
//           />

//           <div className="glass-card glow-border rounded-xl p-5">
//             <div className="mb-4 flex items-center justify-between gap-4">
//               <h2 className="font-semibold text-text-primary">
//                 Recent Announcements
//               </h2>

//               <Link
//                 to="/admin/announcements"
//                 className="shrink-0 text-xs text-gold hover:underline"
//               >
//                 Manage all →
//               </Link>
//             </div>

//             {announcementsError && (
//               <p className="mb-3 text-sm text-danger">{announcementsError}</p>
//             )}

//             {loadingAnnouncements && <Loader />}

//             {!loadingAnnouncements &&
//               recentAnnouncements.length === 0 &&
//               !announcementsError && (
//                 <EmptyState message="No announcements yet" icon="📢" />
//               )}

//             {!loadingAnnouncements && recentAnnouncements.length > 0 && (
//               <div className="space-y-3">
//                 {recentAnnouncements.map((announcement) => (
//                   <AnnouncementCard
//                     key={announcement._id}
//                     announcement={announcement}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Users,
  GraduationCap,
  Layers,
  CalendarCheck,
  ClipboardList,
} from "lucide-react";

import StatCard from "../../components/common/StatCard";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import AnnouncementForm from "../../components/announcements/AnnouncementForm";
import AnnouncementCard from "../../components/announcements/AnnouncementCard";

import { getAdminDashboard } from "../../api/dashboard.api";
import { getAnnouncements } from "../../api/announcement.api";

// ============================================================
// FALLBACK STATS
// ============================================================

const FALLBACK_STATS = {
  studentCount: 0,
  mentorCount: 0,
  batchCount: 0,
  attendanceRate: 0,
  gradedSubmissions: 0,
};

// ============================================================
// TAB BUTTON
// ============================================================

function TabButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-gradient-to-r from-gold to-emerald text-obsidian"
          : "text-text-secondary hover:text-text-primary"
      }`}
    >
      {children}
    </button>
  );
}

// ============================================================
// ADMIN DASHBOARD
// ============================================================

export default function AdminDashboard() {
  // ==========================================================
  // TABS
  // ==========================================================

  const [tab, setTab] = useState("overview");

  // ==========================================================
  // DASHBOARD DATA
  // ==========================================================

  const [stats, setStats] = useState(FALLBACK_STATS);

  const [users, setUsers] = useState([]);

  const [batches, setBatches] = useState([]);

  const [isLive, setIsLive] = useState(false);

  const [loadingDashboard, setLoadingDashboard] = useState(true);

  // ==========================================================
  // ANNOUNCEMENTS
  // ==========================================================

  const [recentAnnouncements, setRecentAnnouncements] = useState([]);

  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);

  const [announcementsError, setAnnouncementsError] = useState("");

  // ==========================================================
  // LOAD ANNOUNCEMENTS
  // ==========================================================

  const loadRecentAnnouncements = async () => {
    try {
      setLoadingAnnouncements(true);
      setAnnouncementsError("");

      const res = await getAnnouncements();

      const announcements = res?.data?.data || [];

      setRecentAnnouncements(announcements.slice(0, 5));
    } catch (err) {
      console.error("Failed to load announcements:", err);

      setAnnouncementsError(
        err?.response?.data?.message || "Failed to load announcements",
      );
    } finally {
      setLoadingAnnouncements(false);
    }
  };

  // ==========================================================
  // LOAD DASHBOARD
  // ==========================================================

  const loadDashboard = async () => {
    try {
      setLoadingDashboard(true);

      const res = await getAdminDashboard();

      console.log("Admin dashboard response:", res?.data);

      const data = res?.data?.data;

      if (!data) {
        throw new Error("Invalid dashboard response");
      }

      // ======================================================
      // LIVE STATISTICS
      // ======================================================

      setStats({
        studentCount: data.studentCount ?? 0,
        mentorCount: data.mentorCount ?? 0,
        batchCount: data.batchCount ?? 0,
        attendanceRate: data.attendanceRate ?? 0,
        gradedSubmissions: data.gradedSubmissions ?? 0,
      });

      // ======================================================
      // LIVE RECENT USERS
      // ======================================================

      const recentUsers = (data.recentUsers || []).map((user) => ({
        id: user._id || user.id,

        name: user.name || "Unnamed User",

        email: user.email || "No email available",

        role:
          user.role === "mentor"
            ? "Mentor"
            : user.role === "student"
              ? "Student"
              : user.role || "User",

        batch: user.batch?.name || user.batchName || "Not assigned",
      }));

      setUsers(recentUsers);

      // ======================================================
      // LIVE BATCHES
      // ======================================================

      const liveBatches = (data.batches || []).map((batch) => ({
        id: batch._id || batch.id,

        name: batch.name || "Unnamed Batch",

        students:
          batch.studentCount ??
          batch.studentsCount ??
          (Array.isArray(batch.students) ? batch.students.length : 0),

        status: batch.status || (batch.isActive ? "Active" : "Completed"),
      }));

      console.log("Live batches:", liveBatches);

      setBatches(liveBatches);

      // ======================================================
      // DASHBOARD IS LIVE
      // ======================================================

      setIsLive(true);
    } catch (err) {
      console.error("Failed to load admin dashboard:", err);

      setIsLive(false);

      setUsers([]);

      setBatches([]);

      setStats(FALLBACK_STATS);
    } finally {
      setLoadingDashboard(false);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadRecentAnnouncements();
    loadDashboard();
  }, []);

  // ==========================================================
  // STAT CARDS
  // ==========================================================

  const STATS = [
    {
      label: "Students",
      value: stats.studentCount,
      icon: GraduationCap,
    },

    {
      label: "Mentors",
      value: stats.mentorCount,
      icon: Users,
    },

    {
      label: "Batches",
      value: stats.batchCount,
      icon: Layers,
    },

    {
      label: "Attendance Rate",
      value: `${stats.attendanceRate}%`,
      icon: CalendarCheck,
    },

    {
      label: "Assignments Graded",
      value: stats.gradedSubmissions,
      icon: ClipboardList,
    },
  ];

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-24 sm:px-6 sm:pt-28 md:pb-12">
      {/* ====================================================
          HEADER
      ==================================================== */}

      <div className="mb-6 flex items-center justify-between gap-4">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-[var(--font-display)] text-2xl font-bold text-text-primary sm:text-3xl"
        >
          Admin Dashboard
        </motion.h1>

        {/* OFFLINE */}

        {!isLive && !loadingDashboard && (
          <span className="rounded-full bg-warning/15 px-2 py-1 text-xs text-warning">
            Offline
          </span>
        )}

        {/* LIVE */}

        {isLive && (
          <span className="rounded-full bg-emerald/15 px-2 py-1 text-xs font-medium text-emerald">
            Live
          </span>
        )}
      </div>

      {/* ====================================================
          STATISTICS
      ==================================================== */}

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* ====================================================
          TABS
      ==================================================== */}

      <div className="glass-card mb-6 flex w-fit gap-2 rounded-lg p-1.5">
        <TabButton
          active={tab === "overview"}
          onClick={() => setTab("overview")}
        >
          Users & Batches
        </TabButton>

        <TabButton
          active={tab === "announce"}
          onClick={() => setTab("announce")}
        >
          Announcements
        </TabButton>
      </div>

      {/* ====================================================
          OVERVIEW TAB
      ==================================================== */}

      {tab === "overview" && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* ==================================================
              RECENT USERS
          ================================================== */}

          <div className="glass-card glow-border rounded-xl p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-text-primary">
                  Recent Users
                </h2>

                <p className="mt-1 text-xs text-text-secondary">
                  Latest registered students and mentors
                </p>
              </div>

              <Users className="h-5 w-5 text-gold" />
            </div>

            {/* LOADING */}

            {loadingDashboard ? (
              <div className="py-8">
                <Loader />
              </div>
            ) : users.length === 0 ? (
              /* EMPTY */
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-text-secondary/10">
                  <Users className="h-6 w-6 text-text-secondary" />
                </div>

                <p className="text-sm font-semibold text-text-primary">
                  No recent user activity
                </p>

                <p className="mt-1 max-w-xs text-xs leading-5 text-text-secondary">
                  Newly registered students and mentors will appear here.
                </p>
              </div>
            ) : (
              /* USERS TABLE */
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-text-secondary">
                      <th className="py-2 font-medium">User</th>

                      <th className="py-2 font-medium">Role</th>

                      <th className="py-2 font-medium">Batch</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-border/50 last:border-0"
                      >
                        <td className="py-3">
                          <div className="min-w-[180px]">
                            <p className="font-medium text-text-primary">
                              {user.name}
                            </p>

                            <p className="mt-0.5 text-xs text-text-secondary">
                              {user.email}
                            </p>
                          </div>
                        </td>

                        <td className="py-3">
                          <span
                            className={`rounded-full px-2 py-1 text-xs ${
                              user.role === "Mentor"
                                ? "bg-emerald/15 text-emerald"
                                : "bg-gold/15 text-gold"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>

                        <td className="py-3 text-text-secondary">
                          {user.batch}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ==================================================
              BATCHES
          ================================================== */}

          <div className="glass-card glow-border rounded-xl p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-text-primary">Batches</h2>

                <p className="mt-1 text-xs text-text-secondary">
                  Current bootcamp batches
                </p>
              </div>

              <Layers className="h-5 w-5 text-emerald" />
            </div>

            {/* LOADING */}

            {loadingDashboard ? (
              <div className="py-8">
                <Loader />
              </div>
            ) : batches.length === 0 ? (
              /* EMPTY */
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-text-secondary/10">
                  <Layers className="h-6 w-6 text-text-secondary" />
                </div>

                <p className="text-sm font-semibold text-text-primary">
                  No batches found
                </p>

                <p className="mt-1 max-w-xs text-xs leading-5 text-text-secondary">
                  Create a batch to see it displayed here.
                </p>
              </div>
            ) : (
              /* LIVE BATCH LIST */
              <div className="space-y-3">
                {batches.map((batch) => {
                  const isActive =
                    String(batch.status).toLowerCase() === "active";

                  return (
                    <div
                      key={batch.id}
                      className="flex items-center justify-between gap-4 border-b border-border/50 pb-3 last:border-0 last:pb-0"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-text-primary">
                          {batch.name}
                        </p>

                        <p className="text-xs text-text-secondary">
                          {batch.students}{" "}
                          {batch.students === 1 ? "student" : "students"}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2 py-1 text-xs ${
                          isActive
                            ? "bg-emerald/15 text-emerald"
                            : "bg-text-secondary/15 text-text-secondary"
                        }`}
                      >
                        {batch.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====================================================
          ANNOUNCEMENTS TAB
      ==================================================== */}

      {tab === "announce" && (
        <div className="grid items-start gap-6 lg:grid-cols-[380px_1fr]">
          {/* CREATE ANNOUNCEMENT */}

          <AnnouncementForm
            mode="create"
            onSuccess={(created) =>
              setRecentAnnouncements((current) =>
                [created, ...current].slice(0, 5),
              )
            }
          />

          {/* RECENT ANNOUNCEMENTS */}

          <div className="glass-card glow-border rounded-xl p-5">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="font-semibold text-text-primary">
                Recent Announcements
              </h2>

              <Link
                to="/admin/announcements"
                className="shrink-0 text-xs text-gold hover:underline"
              >
                Manage all →
              </Link>
            </div>

            {/* ERROR */}

            {announcementsError && (
              <p className="mb-3 text-sm text-danger">{announcementsError}</p>
            )}

            {/* LOADING */}

            {loadingAnnouncements && <Loader />}

            {/* EMPTY */}

            {!loadingAnnouncements &&
              recentAnnouncements.length === 0 &&
              !announcementsError && (
                <EmptyState message="No announcements yet" icon="📢" />
              )}

            {/* ANNOUNCEMENTS */}

            {!loadingAnnouncements && recentAnnouncements.length > 0 && (
              <div className="space-y-3">
                {recentAnnouncements.map((announcement) => (
                  <AnnouncementCard
                    key={announcement._id}
                    announcement={announcement}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
