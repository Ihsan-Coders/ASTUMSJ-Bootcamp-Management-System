export default function Sidebar({ links = [] }) {
  return (
    <aside className="w-56 bg-surface border-r border-border h-full p-4">
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="block text-text-primary hover:text-primary py-1"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
