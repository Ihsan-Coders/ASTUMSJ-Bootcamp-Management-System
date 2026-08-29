import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  LogOut,
  Home,
  Users,
  Layers,
  Megaphone,
  BarChart3,
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  Crown,
  ClipboardList,
  TrendingUp,
  CalendarDays,
  UserRound,
  Code2,
} from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";
import NotificationBell from "../notifications/NotificationBell";
import { useAuth } from "../../context/AuthContext";
import imageLogo from "../../assets/logo.png";


const PUBLIC_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Alumni", href: "#alumni" },
  { label: "Tracks", href: "#tracks" },
  { label: "Mentors", href: "#mentors" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

const ROLE_LINKS = {
  admin: [
    {
      label: "Dashboard",
      path: "/admin",
      icon: Home,
    },
    {
      label: "Users",
      path: "/admin/users",
      icon: Users,
    },
    {
      label: "Batches",
      path: "/admin/batches",
      icon: Layers,
    },
    {
      label: "Attendance",
      path: "/admin/attendance",
      icon: ClipboardCheck,
    },
    {
      label: "Applications",
      path: "/admin/applications",
      icon: ClipboardList,
    },
    {
      label: "Assignments",
      path: "/admin/assignments",
      icon: ClipboardCheck,
    },
    {
      label: "Alumni",
      path: "/admin/alumni",
      icon: GraduationCap,
    },
    {
      label: "Announcements",
      path: "/admin/announcements",
      icon: Megaphone,
    },
    {
      label: "Reports",
      path: "/admin/reports",
      icon: BarChart3,
    },
    {
      label: "Resources",
      path: "/admin/resources",
      icon: BookOpen,
    },
    {
      label: "Calendar",
      path: "/admin/calendar",
      icon: CalendarDays,
    },
    {
      label: "Contests",
      path: "/admin/contests",
      icon: ClipboardList,
    },
    {
      label: "Leaderboard",
      path: "/admin/leaderboard",
      icon: Crown,
    },
    {
      label: "Profile",
      path: "/admin/profile",
      icon: Users,
    },
  ],

  mentor: [
    {
      label: "Dashboard",
      path: "/mentor",
      icon: Home,
    },
    {
      label: "Assignments",
      path: "/mentor/assignments",
      icon: ClipboardList,
    },
    {
      label: "Applicants",
      path: "/mentor/applicants",
      icon: Users,
    },
    {
      label: "Resources",
      path: "/mentor/resources",
      icon: BookOpen,
    },
    {
      label: "Calendar",
      path: "/mentor/calendar",
      icon: CalendarDays,
    },
    {
      label: "Progress",
      path: "/mentor/progress",
      icon: TrendingUp,
    },
    {
      label: "Contests",
      path: "/mentor/contests",
      icon: ClipboardList,
    },
    {
      label: "Leaderboard",
      path: "/mentor/leaderboard",
      icon: Crown,
    },
    {
      label: "Profile",
      path: "/mentor/profile",
      icon: Users,
    },
  ],

  student: [
    {
      label: "Dashboard",
      path: "/student",
      icon: Home,
    },
    {
      label: "Attendance",
      path: "/student/attendance",
      icon: ClipboardCheck,
    },
    {
      label: "My Assignments",
      path: "/student/myassignments",
      icon: ClipboardList,
    },
    {
      label: "DSA Activity",
      path: "/student/dsa-activity",
      icon: Code2,
    },
    {
      label: "My Progress",
      path: "/student/progress",
      icon: TrendingUp,
    },
    {
      label: "Resources",
      path: "/student/resources",
      icon: BookOpen,
    },
    {
      label: "Calendar",
      path: "/student/calendar",
      icon: CalendarDays,
    },
    {
      label: "Announcements",
      path: "/student/announcements",
      icon: Megaphone,
    },
    {
      label: "Contests",
      path: "/student/contests",
      icon: ClipboardList,
    },
    {
      label: "Timeline",
      path: "/student/timeline",
      icon: CalendarDays,
    },
    {
      label: "Leaderboard",
      path: "/student/leaderboard",
      icon: Crown,
    },
    {
      label: "Profile",
      path: "/student/profile",
      icon: Users,
    },
  ],
};

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3 shrink-0">
      <div
        className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 p-1 rounded-full
                   bg-gradient-to-br from-[#D4AF37]/30 to-[#10B981]/10
                   border border-[#D4AF37]/40
                   shadow-[0_0_15px_rgba(212,175,55,0.15)]
                   overflow-hidden"
      >
        <img
          src={imageLogo}
          alt="ASTU MSJ Bootcamp Logo"
          className="w-full h-full object-cover scale-105 rounded-full"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      <span className="text-lg sm:text-xl font-bold tracking-wide text-text-primary font-[var(--font-display)]">
        ASTU <span className="text-gold">MSJ</span>
      </span>
    </Link>
  );
}

function NavLinks({ links, location, onNavigate }) {
  return (
    <nav className="flex flex-col gap-1.5">
      {links.map((link) => {
        const Icon = link.icon;

        const isActive = location.pathname === link.path;

        return (
          <button
            key={link.path}
            onClick={() => onNavigate(link.path)}
            className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl
                       text-sm font-medium text-left transition-all duration-200
                       ${
                         isActive
                           ? "text-gold bg-gold/10 border border-gold/20 shadow-[0_0_18px_rgba(212,175,55,0.08)]"
                           : "text-text-secondary border border-transparent hover:text-gold hover:bg-white/5"
                       }`}
          >
            <Icon
              size={18}
              strokeWidth={isActive ? 2.2 : 1.8}
              className={`shrink-0 transition-colors ${
                isActive
                  ? "text-gold"
                  : "text-text-secondary group-hover:text-gold"
              }`}
            />

            <span>{link.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default function Navbar({ minimal = false }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";

  const showMinimal = minimal || isAuthPage;

  const roleLinks = user ? ROLE_LINKS[user.role] || [] : [];

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate("/");
  };

  const handleLogin = () => {
    setMobileOpen(false);
    navigate("/login");
  };

  const handleGetStarted = () => {
    setMobileOpen(false);
    navigate("/register");
  };

  const handleNavigation = (path) => {
    setMobileOpen(false);
    navigate(path);
  };

  /*
   * MINIMAL NAVBAR
   */
  if (showMinimal) {
    return (
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-gold/30
                   bg-gradient-to-b from-[rgba(10,35,26,0.9)] to-[rgba(10,35,26,0.6)]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Logo />
          <DarkModeToggle />
        </div>
      </motion.nav>
    );
  }

  /*
   * PUBLIC NAVBAR
   */
  if (!user) {
    return (
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-gold/30
                   bg-gradient-to-b from-[rgba(10,35,26,0.9)] to-[rgba(10,35,26,0.6)]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Logo />

          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            {PUBLIC_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-text-secondary hover:text-gold transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <DarkModeToggle />

            <button
              onClick={handleLogin}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Login
            </button>

            <button
              onClick={handleGetStarted}
              className="text-sm px-4 py-2 rounded-lg font-semibold text-obsidian
                         bg-gradient-to-r from-gold to-emerald
                         hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]
                         transition-shadow"
            >
              Get Started
            </button>
          </div>

          <div className="md:hidden flex items-center gap-3">
            <DarkModeToggle />

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="text-text-primary p-1"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden overflow-hidden border-t border-gold/20"
            >
              <div className="px-6 py-4 flex flex-col gap-4">
                {PUBLIC_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-text-secondary hover:text-gold text-sm"
                  >
                    {link.label}
                  </a>
                ))}

                <div className="flex gap-3 pt-3 border-t border-gold/10">
                  <button
                    onClick={handleLogin}
                    className="text-sm text-text-secondary hover:text-text-primary"
                  >
                    Login
                  </button>

                  <button
                    onClick={handleGetStarted}
                    className="text-sm px-4 py-2 rounded-lg font-semibold text-obsidian
                               bg-gradient-to-r from-gold to-emerald"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    );
  }

  /*
   * AUTHENTICATED DESKTOP SIDEBAR
   */
  return (
    <>
      <motion.aside
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="hidden md:flex fixed left-0 top-0 bottom-0 z-50
                   w-[260px] flex-col
                   glass-card border-r border-gold/30
                   bg-gradient-to-b from-[rgba(10,35,26,0.97)] to-[rgba(10,35,26,0.92)]
                   shadow-[8px_0_30px_rgba(0,0,0,0.15)]"
      >
        <div className="px-5 py-5 border-b border-gold/10">
          <Logo />
        </div>

        <div className="px-5 pt-5 pb-3">
          <p className="text-[10px] uppercase tracking-[0.18em] text-text-secondary">
            {user.role} portal
          </p>
        </div>

        {/* Scrollbar hidden but scrolling still works */}
        <div className="flex-1 overflow-y-auto px-3 pb-4 scrollbar-none">
          <NavLinks
            links={roleLinks}
            location={location}
            onNavigate={handleNavigation}
          />
        </div>

        <div className="border-t border-gold/10 p-4 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0
                         bg-gradient-to-br from-gold/30 to-emerald/20
                         border border-gold/20"
            >
              <UserRound size={17} className="text-gold" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                {user.name}
              </p>

              <p className="text-[11px] text-text-secondary capitalize">
                {user.role}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between px-2">
            <NotificationBell />
            <DarkModeToggle />
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2
                       text-sm px-4 py-2.5 rounded-lg font-semibold text-obsidian
                       bg-gradient-to-r from-gold to-emerald
                       hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]
                       transition-shadow"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </motion.aside>

      {/* MOBILE TOP BAR */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="md:hidden fixed top-0 left-0 right-0 z-50
                   glass-card border-b border-gold/30
                   bg-gradient-to-b from-[rgba(10,35,26,0.95)] to-[rgba(10,35,26,0.85)]"
      >
        <div className="px-4 py-3 flex items-center justify-between">

          {/* Hamburger + Logo are together on the LEFT */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="text-text-primary p-1.5 rounded-lg
                         hover:bg-white/5 transition-colors"
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
            >
              <Menu size={24} />
            </button>

            <Logo />
          </div>

          {/* These intentionally stay OUTSIDE the sidebar */}
          <div className="flex items-center gap-3">
            <NotificationBell />
            <DarkModeToggle />
          </div>
        </div>
      </motion.header>

      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileOpen(false)}
            className="md:hidden fixed inset-0 z-[60] bg-black/60 backdrop-blur-[2px]"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{
              type: "tween",
              duration: 0.3,
              ease: "easeOut",
            }}
            className="md:hidden fixed top-0 left-0 bottom-0 z-[70]
                       w-[280px] max-w-[85vw]
                       flex flex-col
                       glass-card border-r border-gold/30
                       bg-gradient-to-b from-[rgba(10,35,26,0.99)] to-[rgba(10,35,26,0.97)]
                       shadow-[10px_0_40px_rgba(0,0,0,0.3)]"
          >
            {/* Sidebar Header */}
            <div className="px-5 py-5 flex items-center justify-between border-b border-gold/10">
              <Logo />

              <button
                onClick={() => setMobileOpen(false)}
                className="text-text-secondary hover:text-gold
                           transition-colors p-1.5 rounded-lg hover:bg-white/5"
                aria-label="Close navigation menu"
              >
                <X size={24} />
              </button>
            </div>

            <div className="px-5 pt-5 pb-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-text-secondary">
                {user.role} portal
              </p>
            </div>

            {/* Hidden scrollbar, still scrollable */}
            <div className="flex-1 overflow-y-auto px-3 pb-4 scrollbar-none">
              <NavLinks
                links={roleLinks}
                location={location}
                onNavigate={handleNavigation}
              />
            </div>

            <div className="border-t border-gold/10 p-4">
              <div className="flex items-center gap-3 px-2 mb-4">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0
                             bg-gradient-to-br from-gold/30 to-emerald/20
                             border border-gold/20"
                >
                  <UserRound size={17} className="text-gold" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {user.name}
                  </p>

                  <p className="text-[11px] text-text-secondary capitalize">
                    {user.role}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2
                           text-sm px-4 py-2.5 rounded-lg font-semibold text-obsidian
                           bg-gradient-to-r from-gold to-emerald"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
