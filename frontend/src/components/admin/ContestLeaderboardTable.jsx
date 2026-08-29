// const STATUS_COLOR = {
//   Fetched: "bg-emerald/15 text-emerald",
//   NotParticipated: "bg-text-secondary/15 text-text-secondary",
//   NoHandle: "bg-warning/15 text-warning",
//   InvalidHandle: "bg-danger/15 text-danger",
//   ApiUnavailable: "bg-danger/15 text-danger",
// };

// const STATUS_LABEL = {
//   Fetched: "Participated",
//   NotParticipated: "Not Participated",
//   NoHandle: "No Handle",
//   InvalidHandle: "Invalid Handle",
//   ApiUnavailable: "API Unavailable",
// };

// export default function ContestLeaderboardTable({ results = [] }) {
//   // ---------------------------------------------------------
//   // Safety check
//   // ---------------------------------------------------------
//   const safeResults = Array.isArray(results) ? results : [];

//   // ---------------------------------------------------------
//   // Empty state
//   // ---------------------------------------------------------
//   if (safeResults.length === 0) {
//     return (
//       <div className="glass-card glow-border rounded-xl p-8 text-center text-text-secondary">
//         No results fetched yet — click "Fetch Results" above.
//       </div>
//     );
//   }

//   // ---------------------------------------------------------
//   // Sort results
//   //
//   // Real ranks first.
//   // Students without ranks go after them.
//   // ---------------------------------------------------------
//   const sortedResults = [...safeResults].sort((a, b) => {
//     const rankA = typeof a.rank === "number" ? a.rank : Number.MAX_SAFE_INTEGER;

//     const rankB = typeof b.rank === "number" ? b.rank : Number.MAX_SAFE_INTEGER;

//     return rankA - rankB;
//   });

//   return (
//     <div className="glass-card glow-border rounded-xl overflow-hidden">
//       {/* =====================================================
//           MOBILE SCROLL CONTAINER
//       ====================================================== */}
//       <div className="overflow-x-auto">
//         <table className="w-full text-sm min-w-[760px]">
//           {/* =================================================
//               HEADER
//           ================================================== */}
//           <thead>
//             <tr className="border-b border-border bg-background/30 text-left">
//               <th className="py-3 px-4 text-text-secondary font-medium">
//                 Rank
//               </th>

//               <th className="py-3 px-4 text-text-secondary font-medium">
//                 Student
//               </th>

//               <th className="py-3 px-4 text-text-secondary font-medium">
//                 Codeforces
//               </th>

//               <th className="py-3 px-4 text-text-secondary font-medium text-center">
//                 Points
//               </th>

//               <th className="py-3 px-4 text-text-secondary font-medium text-center">
//                 Solved
//               </th>

//               <th className="py-3 px-4 text-text-secondary font-medium">
//                 Problems
//               </th>

//               <th className="py-3 px-4 text-text-secondary font-medium">
//                 Status
//               </th>
//             </tr>
//           </thead>

//           {/* =================================================
//               BODY
//           ================================================== */}
//           <tbody>
//             {sortedResults.map((result, index) => {
//               const student = result.student || {};

//               const studentName =
//                 student.name || student.email || "Unknown Student";

//               const handle =
//                 result.codeforcesHandle || student.codeforcesHandle || "—";

//               const status = result.status || "Unknown";

//               const statusClass =
//                 STATUS_COLOR[status] ||
//                 "bg-text-secondary/15 text-text-secondary";

//               const statusLabel = STATUS_LABEL[status] || status;

//               return (
//                 <tr
//                   key={result._id || `${student._id || "student"}-${index}`}
//                   className="border-b border-border/50 last:border-0 hover:bg-background/20 transition-colors"
//                 >
//                   {/* =========================================
//                       RANK
//                   ========================================== */}
//                   <td className="py-3 px-4">
//                     {result.rank ? (
//                       <span className="font-bold text-gold">
//                         #{result.rank}
//                       </span>
//                     ) : (
//                       <span className="text-text-secondary">—</span>
//                     )}
//                   </td>

//                   {/* =========================================
//                       STUDENT
//                   ========================================== */}
//                   <td className="py-3 px-4">
//                     <div className="flex flex-col">
//                       <span className="text-text-primary font-medium">
//                         {studentName}
//                       </span>

//                       {student.email && (
//                         <span className="text-xs text-text-secondary">
//                           {student.email}
//                         </span>
//                       )}
//                     </div>
//                   </td>

//                   {/* =========================================
//                       CODEFORCES HANDLE
//                   ========================================== */}
//                   <td className="py-3 px-4">
//                     {handle !== "—" ? (
//                       <a
//                         href={`https://codeforces.com/profile/${handle}`}
//                         target="_blank"
//                         rel="noreferrer"
//                         className="text-gold hover:underline"
//                       >
//                         {handle}
//                       </a>
//                     ) : (
//                       <span className="text-text-secondary">—</span>
//                     )}
//                   </td>

//                   {/* =========================================
//                       POINTS
//                   ========================================== */}
//                   <td className="py-3 px-4 text-center">
//                     <span className="font-semibold text-text-primary">
//                       {result.points ?? 0}
//                     </span>
//                   </td>

//                   {/* =========================================
//                       SOLVED
//                   ========================================== */}
//                   <td className="py-3 px-4 text-center">
//                     <span className="font-semibold text-emerald">
//                       {result.problemsSolved ?? 0}
//                     </span>
//                   </td>

//                   {/* =========================================
//                       PROBLEMS
//                   ========================================== */}
//                   <td className="py-3 px-4">
//                     {result.solvedProblemIndexes?.length > 0 ? (
//                       <div className="flex flex-wrap gap-1">
//                         {result.solvedProblemIndexes.map((problem) => (
//                           <span
//                             key={problem}
//                             className="text-xs px-2 py-0.5 rounded bg-gold/10 text-gold"
//                           >
//                             {problem}
//                           </span>
//                         ))}
//                       </div>
//                     ) : (
//                       <span className="text-text-secondary">—</span>
//                     )}
//                   </td>

//                   {/* =========================================
//                       STATUS
//                   ========================================== */}
//                   <td className="py-3 px-4">
//                     <span
//                       className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap ${statusClass}`}
//                     >
//                       {statusLabel}
//                     </span>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>

//       {/* =====================================================
//           FOOTER
//       ====================================================== */}
//       <div className="px-4 py-3 border-t border-border text-xs text-text-secondary">
//         Showing {sortedResults.length} student
//         {sortedResults.length !== 1 ? "s" : ""}
//       </div>
//     </div>
//   );
// }

import { ExternalLink } from "lucide-react";

const STATUS_CONFIG = {
  Fetched: {
    label: "Participated",
    className: "bg-emerald/15 text-emerald",
  },
  NotParticipated: {
    label: "Not Participated",
    className: "bg-text-secondary/15 text-text-secondary",
  },
  NoHandle: {
    label: "No Handle",
    className: "bg-warning/15 text-warning",
  },
  InvalidHandle: {
    label: "Invalid Handle",
    className: "bg-danger/15 text-danger",
  },
  ApiUnavailable: {
    label: "API Unavailable",
    className: "bg-danger/15 text-danger",
  },
};

export default function ContestLeaderboardTable({ results = [] }) {
  if (!Array.isArray(results) || results.length === 0) {
    return (
      <div className="glass-card glow-border rounded-xl p-8 text-center">
        <p className="text-text-primary font-medium">
          No leaderboard results yet
        </p>
        <p className="text-text-secondary text-sm mt-1">
          Click "Fetch Results" to retrieve the latest Codeforces results.
        </p>
      </div>
    );
  }

  const participated = results
    .filter((r) => r.status === "Fetched")
    .sort((a, b) => {
      if (a.rank == null) return 1;
      if (b.rank == null) return -1;
      return a.rank - b.rank;
    });

  const others = results.filter((r) => r.status !== "Fetched");

  const sortedResults = [...participated, ...others];

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-card glow-border rounded-xl p-4">
          <p className="text-xs text-text-secondary">Participants</p>
          <p className="text-xl font-bold text-emerald mt-1">
            {participated.length}
          </p>
        </div>

        <div className="glass-card glow-border rounded-xl p-4">
          <p className="text-xs text-text-secondary">Not Participated</p>
          <p className="text-xl font-bold text-text-primary mt-1">
            {results.filter((r) => r.status === "NotParticipated").length}
          </p>
        </div>

        <div className="glass-card glow-border rounded-xl p-4">
          <p className="text-xs text-text-secondary">No Handle</p>
          <p className="text-xl font-bold text-warning mt-1">
            {results.filter((r) => r.status === "NoHandle").length}
          </p>
        </div>

        <div className="glass-card glow-border rounded-xl p-4">
          <p className="text-xs text-text-secondary">Total Students</p>
          <p className="text-xl font-bold text-gold mt-1">{results.length}</p>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="glass-card glow-border rounded-xl overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-text-primary">
                Contest Leaderboard
              </h3>
              <p className="text-xs text-text-secondary mt-1">
                Ranked by official Codeforces contest rank
              </p>
            </div>

            <span className="text-xs text-text-secondary">
              {participated.length} ranked
            </span>
          </div>
        </div>

        {/* Desktop / Tablet table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="py-3 px-4 text-xs font-medium text-text-secondary">
                  Rank
                </th>

                <th className="py-3 px-4 text-xs font-medium text-text-secondary">
                  Student
                </th>

                <th className="py-3 px-4 text-xs font-medium text-text-secondary">
                  Codeforces
                </th>

                <th className="py-3 px-4 text-xs font-medium text-text-secondary text-center">
                  Points
                </th>

                <th className="py-3 px-4 text-xs font-medium text-text-secondary text-center">
                  Solved
                </th>

                <th className="py-3 px-4 text-xs font-medium text-text-secondary">
                  Problems
                </th>

                <th className="py-3 px-4 text-xs font-medium text-text-secondary">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {sortedResults.map((result, index) => {
                const status =
                  STATUS_CONFIG[result.status] || STATUS_CONFIG.ApiUnavailable;

                const rank = result.rank;

                return (
                  <tr
                    key={result._id}
                    className="border-b border-border/50 last:border-0 hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Rank */}
                    <td className="py-4 px-4">
                      {rank ? (
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                            rank === 1
                              ? "bg-gold/20 text-gold"
                              : rank === 2
                                ? "bg-text-secondary/20 text-text-secondary"
                                : rank === 3
                                  ? "bg-warning/20 text-warning"
                                  : "text-text-primary"
                          }`}
                        >
                          {rank}
                        </div>
                      ) : (
                        <span className="text-text-secondary">—</span>
                      )}
                    </td>

                    {/* Student */}
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          {result.student?.name || "Unknown Student"}
                        </p>

                        {result.student?.email && (
                          <p className="text-xs text-text-secondary mt-0.5">
                            {result.student.email}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Codeforces */}
                    <td className="py-4 px-4">
                      {result.codeforcesHandle ? (
                        <a
                          href={`https://codeforces.com/profile/${result.codeforcesHandle}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-gold hover:underline"
                        >
                          {result.codeforcesHandle}
                          <ExternalLink size={12} />
                        </a>
                      ) : (
                        <span className="text-text-secondary">—</span>
                      )}
                    </td>

                    {/* Points */}
                    <td className="py-4 px-4 text-center">
                      {result.status === "Fetched" && result.points != null ? (
                        <span className="font-semibold text-text-primary">
                          {result.points}
                        </span>
                      ) : (
                        <span className="text-text-secondary">—</span>
                      )}
                    </td>

                    {/* Solved */}
                    <td className="py-4 px-4 text-center">
                      {result.status === "Fetched" ? (
                        <span className="font-semibold text-emerald">
                          {result.problemsSolved ?? 0}
                        </span>
                      ) : (
                        <span className="text-text-secondary">—</span>
                      )}
                    </td>

                    {/* Problems */}
                    <td className="py-4 px-4">
                      {result.solvedProblemIndexes?.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {result.solvedProblemIndexes.map((problem) => (
                            <span
                              key={problem}
                              className="px-2 py-0.5 rounded bg-gold/10 text-gold text-xs font-medium"
                            >
                              {problem}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-text-secondary">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-border/50">
          {sortedResults.map((result) => {
            const status =
              STATUS_CONFIG[result.status] || STATUS_CONFIG.ApiUnavailable;

            return (
              <div key={result._id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold text-sm shrink-0">
                      {result.rank ?? "—"}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-text-primary truncate">
                        {result.student?.name || "Unknown Student"}
                      </p>

                      {result.codeforcesHandle ? (
                        <a
                          href={`https://codeforces.com/profile/${result.codeforcesHandle}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-gold hover:underline mt-0.5"
                        >
                          {result.codeforcesHandle}
                          <ExternalLink size={11} />
                        </a>
                      ) : (
                        <p className="text-xs text-text-secondary mt-0.5">
                          No Codeforces handle
                        </p>
                      )}
                    </div>
                  </div>

                  <span
                    className={`shrink-0 px-2 py-1 rounded-full text-[10px] font-medium ${status.className}`}
                  >
                    {status.label}
                  </span>
                </div>

                {result.status === "Fetched" && (
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="rounded-lg bg-background/40 p-3">
                      <p className="text-[11px] text-text-secondary">Points</p>
                      <p className="text-sm font-semibold text-text-primary mt-1">
                        {result.points ?? 0}
                      </p>
                    </div>

                    <div className="rounded-lg bg-background/40 p-3">
                      <p className="text-[11px] text-text-secondary">
                        Problems Solved
                      </p>
                      <p className="text-sm font-semibold text-emerald mt-1">
                        {result.problemsSolved ?? 0}
                      </p>
                    </div>
                  </div>
                )}

                {result.solvedProblemIndexes?.length > 0 && (
                  <div className="mt-3">
                    <p className="text-[11px] text-text-secondary mb-1.5">
                      Solved Problems
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {result.solvedProblemIndexes.map((problem) => (
                        <span
                          key={problem}
                          className="px-2 py-1 rounded bg-gold/10 text-gold text-xs font-medium"
                        >
                          {problem}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
