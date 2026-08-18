import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, GraduationCap, Layers, CalendarCheck, ClipboardList } from 'lucide-react';
import StatCard from '../../components/common/StatCard';

const STATS = [
  { label: 'Students', value: 128, icon: GraduationCap },
  { label: 'Mentors', value: 12, icon: Users },
  { label: 'Batches', value: 4, icon: Layers },
  { label: 'Attendance Rate', value: '94%', icon: CalendarCheck },
  { label: 'Assignments Graded', value: 312, icon: ClipboardList },
];

const USERS = [
  { id: 1, name: 'Bethelhem Assefa', email: 'bethelhem@astu.edu.et', role: 'Student', batch: 'Batch 4' },
  { id: 2, name: 'Nahom Girma', email: 'nahom@astu.edu.et', role: 'Mentor', batch: 'Batch 3' },
  { id: 3, name: 'Selam Tesfaye', email: 'selam@astu.edu.et', role: 'Student', batch: 'Batch 4' },
];

const BATCHES = [
  { id: 1, name: 'Batch 4 — Summer', students: 34, status: 'Active' },
  { id: 2, name: 'Batch 3 — Spring', students: 29, status: 'Completed' },
];

const AUDIENCES = ['All', 'Students', 'Mentors', 'Specific Batch'];

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        active ? 'bg-gradient-to-r from-gold to-emerald text-obsidian' : 'text-text-secondary hover:text-text-primary'
      }`}
    >
      {children}
    </button>
  );
}

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview');
  const [audience, setAudience] = useState('All');

  return (
    <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-7xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl sm:text-3xl font-bold text-text-primary font-[var(--font-display)] mb-6"
      >
        Admin Dashboard
      </motion.h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {STATS.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="flex gap-2 mb-6 glass-card rounded-lg p-1.5 w-fit">
        <TabButton active={tab === 'overview'} onClick={() => setTab('overview')}>Users & Batches</TabButton>
        <TabButton active={tab === 'announce'} onClick={() => setTab('announce')}>Announcements</TabButton>
      </div>

      {tab === 'overview' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass-card glow-border rounded-xl p-5">
            <h2 className="text-text-primary font-semibold mb-4">Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-text-secondary text-left border-b border-border">
                    <th className="py-2 font-medium">Name</th>
                    <th className="py-2 font-medium">Role</th>
                    <th className="py-2 font-medium">Batch</th>
                  </tr>
                </thead>
                <tbody>
                  {USERS.map((u) => (
                    <tr key={u.id} className="border-b border-border/50 last:border-0">
                      <td className="py-2.5 text-text-primary">{u.name}</td>
                      <td className="py-2.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          u.role === 'Mentor' ? 'bg-emerald/15 text-emerald' : 'bg-gold/15 text-gold'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-2.5 text-text-secondary">{u.batch}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass-card glow-border rounded-xl p-5">
            <h2 className="text-text-primary font-semibold mb-4">Batches</h2>
            <div className="space-y-3">
              {BATCHES.map((b) => (
                <div key={b.id} className="flex items-center justify-between border-b border-border/50 last:border-0 pb-3 last:pb-0">
                  <div>
                    <p className="text-text-primary text-sm font-medium">{b.name}</p>
                    <p className="text-text-secondary text-xs">{b.students} students</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    b.status === 'Active' ? 'bg-emerald/15 text-emerald' : 'bg-text-secondary/15 text-text-secondary'
                  }`}>
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'announce' && (
        <div className="glass-card glow-border rounded-xl p-5 max-w-xl">
          <h2 className="text-text-primary font-semibold mb-4">New Announcement</h2>
          <div className="space-y-3">
            <input
              placeholder="Title"
              className="w-full p-2.5 rounded border border-border bg-background text-text-primary text-sm"
            />
            <textarea
              placeholder="What do you want to announce?"
              rows={3}
              className="w-full p-2.5 rounded border border-border bg-background text-text-primary text-sm"
            />
            <div>
              <p className="text-text-secondary text-xs mb-2">Target audience</p>
              <div className="flex flex-wrap gap-2">
                {AUDIENCES.map((a) => (
                  <button
                    key={a}
                    onClick={() => setAudience(a)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      audience === a
                        ? 'bg-gradient-to-r from-gold to-emerald text-obsidian border-transparent'
                        : 'border-border text-text-secondary hover:border-gold/50'
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <button className="w-full py-2.5 rounded font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald">
              Publish Announcement
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
