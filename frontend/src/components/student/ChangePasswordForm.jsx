import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { changePassword } from "../../api/user.api";

export default function ChangePassword() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError("");
    setSuccess("");
  };

  const togglePassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setError("All password fields are required.");
      return;
    }

    if (form.newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    const missing = [];
    if (!/[a-z]/.test(form.newPassword)) missing.push("a lowercase letter");
    if (!/[A-Z]/.test(form.newPassword)) missing.push("an uppercase letter");
    if (!/\d/.test(form.newPassword)) missing.push("a number");
    if (!/[^A-Za-z0-9]/.test(form.newPassword)) missing.push("a special character");
    if (missing.length > 0) {
      setError(`New password must include ${missing.join(", ")}.`);
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (form.currentPassword === form.newPassword) {
      setError("New password must be different from your current password.");
      return;
    }

    try {
      setSubmitting(true);

      const res = await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      setSuccess(
        res.data?.message || "Password changed successfully."
      );

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setShowPassword({
        current: false,
        new: false,
        confirm: false,
      });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to change password. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full p-2.5 pr-10 rounded border border-border bg-background text-text-primary outline-none focus:border-gold transition";

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card glow-border rounded-xl p-6 max-w-md"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 rounded-lg bg-gold/10">
          <Lock size={20} className="text-gold" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            Change Password
          </h2>

          <p className="text-xs text-text-secondary">
            Update your account password
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-lg border border-emerald/20 bg-emerald/10 p-3">
          <p className="text-emerald text-sm">{success}</p>
        </div>
      )}

      {/* Current Password */}
      <div className="mb-4">
        <label className="block text-xs text-text-secondary mb-1">
          Current Password
        </label>

        <div className="relative">
          <input
            type={showPassword.current ? "text" : "password"}
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            className={inputClass}
            placeholder="Enter current password"
            autoComplete="current-password"
            disabled={submitting}
          />

          <button
            type="button"
            onClick={() => togglePassword("current")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition"
            aria-label={
              showPassword.current
                ? "Hide current password"
                : "Show current password"
            }
          >
            {showPassword.current ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>
      </div>

      {/* New Password */}
      <div className="mb-4">
        <label className="block text-xs text-text-secondary mb-1">
          New Password
        </label>

        <div className="relative">
          <input
            type={showPassword.new ? "text" : "password"}
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            className={inputClass}
            placeholder="Enter new password"
            autoComplete="new-password"
            disabled={submitting}
          />

          <button
            type="button"
            onClick={() => togglePassword("new")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition"
            aria-label={
              showPassword.new
                ? "Hide new password"
                : "Show new password"
            }
          >
            {showPassword.new ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>

        <p className="text-xs text-text-secondary mt-1">
          At least 8 characters, with uppercase, lowercase, a number, and a special character.
        </p>
      </div>

      {/* Confirm Password */}
      <div className="mb-5">
        <label className="block text-xs text-text-secondary mb-1">
          Confirm New Password
        </label>

        <div className="relative">
          <input
            type={showPassword.confirm ? "text" : "password"}
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className={inputClass}
            placeholder="Confirm new password"
            autoComplete="new-password"
            disabled={submitting}
          />

          <button
            type="button"
            onClick={() => togglePassword("confirm")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition"
            aria-label={
              showPassword.confirm
                ? "Hide confirm password"
                : "Show confirm password"
            }
          >
            {showPassword.confirm ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-2 rounded font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
}