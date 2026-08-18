import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';

const LINKS = ['Home', 'Tracks', 'Mentors', 'Announcements', 'FAQ'];

export default function Navbar({ minimal = false }) {
  const [mobileOpen, setMobileOpen] = useState(false);

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
        <div className="flex items-center gap-3 shrink-0">
          <div
            className="relative flex items-center justify-center w-11 h-11 p-1.5 rounded-xl
                       bg-gradient-to-br from-[#D4AF37]/30 to-[#10B981]/10
                       border border-[#D4AF37]/40
                       shadow-[0_0_15px_rgba(212,175,55,0.15)]
                       overflow-hidden"
          >
            <img
              src="./assets/astu-msj-logo.jpg"
              alt="ASTU MSJ Bootcamp Logo"
              className="h-full w-full object-contain drop-shadow-md"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          <span className="text-lg sm:text-xl font-bold tracking-wide text-text-primary font-[var(--font-display)]">
            ASTU <span className="text-gold">MSJ</span>
          </span>
        </div>

        {/* Full Navbar */}
        {!minimal && (
          <>
            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
              {LINKS.map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="hover:text-gold transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <DarkModeToggle />

              <button className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                Login
              </button>

              <button
                className="text-sm px-4 py-2 rounded-lg font-semibold text-obsidian
                           bg-gradient-to-r from-gold to-emerald
                           hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]
                           transition-shadow"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-text-primary"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </>
        )}

        {/* Minimal Navbar */}
        {minimal && (
          <div className="flex items-center">
            <DarkModeToggle />
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {!minimal && (
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden overflow-hidden border-t border-gold/20"
            >
              <div className="px-6 py-4 flex flex-col gap-4">
                {LINKS.map((link) => (
                  <a
                    key={link}
                    href={`#${link.toLowerCase()}`}
                    className="text-text-secondary hover:text-gold text-sm"
                  >
                    {link}
                  </a>
                ))}

                <div className="flex items-center justify-between pt-2 border-t border-gold/10">
                  <DarkModeToggle />

                  <div className="flex gap-2">
                    <button className="text-sm text-text-secondary">
                      Login
                    </button>

                    <button className="text-sm px-4 py-2 rounded-lg font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald">
                      Get Started
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.nav>
  );
}