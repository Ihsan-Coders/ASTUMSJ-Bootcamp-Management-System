export default function ResourceCard({ resource }) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noreferrer"
      className="glass-card glow-border rounded-lg p-4 block hover:-translate-y-1 transition-transform"
    >
      <span className="text-xs text-gold uppercase">{resource.type}</span>

      <h4 className="text-text-primary font-semibold mt-1">{resource.title}</h4>

      <p className="text-text-secondary text-sm mt-1">{resource.description}</p>

      <span className="text-xs text-emerald mt-2 inline-block">
        {resource.topic}
      </span>
    </a>
  );
}
