import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function DarkModeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-background transition-colors"
      aria-label="Toggle dark mode"
    >
      {isDark ? <Sun size={25} /> : <Moon size={25} />}
    </button>
  );
}