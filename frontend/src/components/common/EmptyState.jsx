export default function EmptyState({
  message = "No data available",
  icon = "📭",
}) {
  return (
    <div className="text-center py-10 text-text-secondary">
      <div className="text-3xl mb-2">{icon}</div>
      <p>{message}</p>
    </div>
  );
}
