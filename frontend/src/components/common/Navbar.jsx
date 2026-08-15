import DarkModeToggle from "./DarkModeToggle";
export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-surface border-b border-border">
      <span className="text-lg font-bold text-primary">ASTU MSJ Bootcamp</span>
      <div className="flex items-center gap-4">
        <DarkModeToggle />
        <button className="text-text-primary hover:text-primary">Login</button>
      </div>
    </nav>
  );
}
