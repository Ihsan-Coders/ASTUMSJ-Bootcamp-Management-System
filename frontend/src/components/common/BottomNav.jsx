import { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, LayoutGrid, BookOpen, Bell, User } from 'lucide-react';

const ITEMS = [
  { key: 'home', label: 'Home', icon: Home },
  { key: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  { key: 'resources', label: 'Resources', icon: BookOpen },
  { key: 'alerts', label: 'Alerts', icon: Bell },
  { key: 'profile', label: 'Profile', icon: User },
];

export default function BottomNav() {
  const [active, setActive] = useState('home');

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-gold/30 px-2 pb-[env(safe-area-inset-bottom)]"
      aria-label="Primary"
    >
      <ul className="flex items-center justify-between">
        {ITEMS.map(({ key, label, icon: Icon }) => {
          const isActive = active === key;
          return (
            <li key={key} className="flex-1">
              <button
                onClick={() => setActive(key)}
                className="relative w-full flex flex-col items-center gap-1 py-2.5"
                aria-current={isActive ? 'page' : undefined}
              >
                {/* 8-pointed star indicator behind the active icon */}
                {isActive && (
                  <motion.svg
                    layoutId="bottomNavIndicator"
                    width="34" height="34"
                    viewBox="0 0 34 34"
                    className="absolute -top-1"
                  >
                    <polygon
                      points="17,2 20,13 31,13 22,19 25,30 17,23 9,30 12,19 3,13 14,13"
                      fill="rgba(212,175,55,0.15)"
                      stroke="#D4AF37"
                      strokeWidth="1"
                    />
                  </motion.svg>
                )}
                <Icon size={20} className={isActive ? 'text-gold relative' : 'text-text-secondary relative'} />
                <span className={`text-[10px] relative ${isActive ? 'text-gold font-medium' : 'text-text-secondary'}`}>
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
