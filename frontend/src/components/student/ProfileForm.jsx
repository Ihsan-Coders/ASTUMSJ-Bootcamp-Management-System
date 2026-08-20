import { useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';

export default function ProfileForm() {
  const { user, login } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.put('/users/me', form);
      login(res.data.data, localStorage.getItem('token')); // refresh local user state
      setMessage('Profile updated successfully.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card glow-border rounded-xl p-6 max-w-md">
      <h2 className="text-lg font-semibold text-text-primary mb-4">My Profile</h2>
      {message && <p className="text-emerald text-sm mb-3">{message}</p>}
      <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full p-2 mb-3 rounded border border-border bg-background text-text-primary" placeholder="Name" />
      <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full p-2 mb-4 rounded border border-border bg-background text-text-primary" placeholder="Email" />
      <button type="submit" className="w-full py-2 rounded font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald">
        Save Changes
      </button>
    </form>
  );
}
