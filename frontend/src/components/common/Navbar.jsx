import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";
import { useAuth } from "../../context/AuthContext";

const PUBLIC_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Tracks", href: "#tracks" },
  { label: "Mentors", href: "#mentors" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

const ROLE_LINKS = {
  admin: [
    { label: "Dashboard", path: "/admin" },
    { label: "Users", path: "/admin/users" },
    { label: "Batches", path: "/admin/batches" },
    { label: "Reports", path: "/admin/reports" },
    { label: "Resources", path: "/admin/resources" },
  ],

  mentor: [
  { label: "Dashboard", path: "/mentor" },
  { label: "Attendance", path: "/mentor/attendance" },
  { label: "Assignments", path: "/mentor/assignments" },
  { label: "Progress", path: "/mentor/progress" },
  { label: "Resources", path: "/mentor/resources" },
],

  student: [
    { label: "Dashboard", path: "/student" },
    { label: "Attendance", path: "/student/attendance" },
    { label: "MyAssignments", path: "/student/myassignments" },
    { label: "Progress", path: "/student/progress" },
    { label: "Resources", path: "/student/resources" },
    { label: "Timeline", path: "/student/timeline" },
  ],
};

export default function Navbar({ minimal = false }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

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

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-gold/30
                 bg-gradient-to-b from-[rgba(10,35,26,0.9)] to-[rgba(10,35,26,0.6)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div
            className="relative flex items-center justify-center w-11 h-11 p-1 rounded-full
                       bg-gradient-to-br from-[#D4AF37]/30 to-[#10B981]/10
                       border border-[#D4AF37]/40
                       shadow-[0_0_15px_rgba(212,175,55,0.15)]
                       overflow-hidden"
          >
            <img
              src="/src/assets/astu-msj-logo.jpg"
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

        {!showMinimal && (
          <>
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
              {!user ? (
                PUBLIC_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-text-secondary hover:text-gold transition-colors"
                  >
                    {link.label}
                  </a>
                ))
              ) : (
                roleLinks.map((link) => (
                  <button
                    key={link.path}
                    onClick={() => handleNavigation(link.path)}
                    className={`transition-colors ${
                      location.pathname === link.path
                        ? "text-gold"
                        : "text-text-secondary hover:text-gold"
                    }`}
                  >
                    {link.label}
                  </button>
                ))
              )}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <DarkModeToggle />

              {user ? (
                <>
                  <button
                    onClick={() => handleNavigation("/profile")}
                    className={`text-sm transition-colors ${
                      location.pathname === "/profile"
                        ? "text-gold"
                        : "text-text-secondary hover:text-gold"
                    }`}
                  >
                    {user.name}
                  </button>

                  <button
                    onClick={handleLogout}
                    className="text-sm px-4 py-2 rounded-lg font-semibold text-obsidian
                               bg-gradient-to-r from-gold to-emerald
                               hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]
                               transition-shadow"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-text-primary"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </>
        )}

        {/* Minimal Navbar */}
        {showMinimal && (
          <div className="flex items-center">
            <DarkModeToggle />
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {!showMinimal && (
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
                {!user
                  ? PUBLIC_LINKS.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="text-text-secondary hover:text-gold text-sm"
                      >
                        {link.label}
                      </a>
                    ))
                  : roleLinks.map((link) => (
                      <button
                        key={link.path}
                        onClick={() => handleNavigation(link.path)}
                        className={`text-left text-sm ${
                          location.pathname === link.path
                            ? "text-gold"
                            : "text-text-secondary hover:text-gold"
                        }`}
                      >
                        {link.label}
                      </button>
                    ))}

                <div className="flex items-center justify-between pt-2 border-t border-gold/10">
                  <DarkModeToggle />

                  {user ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleNavigation("/profile")}
                        className={`text-sm ${
                          location.pathname === "/profile"
                            ? "text-gold"
                            : "text-text-secondary hover:text-gold"
                        }`}
                      >
                        {user.name}
                      </button>

                      <button
                        onClick={handleLogout}
                        className="text-sm px-4 py-2 rounded-lg font-semibold text-obsidian
                                   bg-gradient-to-r from-gold to-emerald"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleLogin}
                        className="text-sm text-text-secondary"
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
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.nav>
  );
}