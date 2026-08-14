import EmptyState from "./EmptyState";
import Loader from "./Loader";
export default function Table({
  columns,
  data,
  isLoading,
  emptyMessage = "No data available",
}) {
  if (isLoading) return <Loader />;
  if (!data || data.length === 0) return <EmptyState message={emptyMessage} />;
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-left border-collapse">
        <thead className="bg-background">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="py-2 px-3 text-text-secondary text-sm font-medium"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={row.id || row._id || i}
              className="border-t border-border hover:bg-background/50"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="py-2 px-3 text-text-primary text-sm"
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
