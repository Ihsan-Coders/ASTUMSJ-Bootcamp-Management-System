import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getMe } from "../../api/user.api";
import ProfileForm from "../../components/student/ProfileForm";
import ChangePasswordForm from "../../components/student/ChangePasswordForm";
import Loader from "../../components/common/Loader";

const ROLE_LABELS = {
  admin: "Administrator",
  mentor: "Mentor",
  student: "Student",
};

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProfile = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await getMe();
      setProfile(res.data.data);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProfile();
  }, []);

  return (
    <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-6xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl sm:text-3xl font-bold text-text-primary mb-6"
      >
        Profile
      </motion.h1>

      {loading && <Loader />}

      {!loading && error && (
        <div className="glass-card glow-border rounded-xl p-6 max-w-md">
          <p className="text-red-400 text-sm mb-3">{error}</p>

          <button
            onClick={loadProfile}
            className="text-sm px-4 py-2 rounded-lg font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && profile && (
        <div className="space-y-6 max-w-5xl">
          {/* Profile + Account Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <ProfileForm
              profile={profile}
              onUpdated={setProfile}
            />

            <div className="glass-card glow-border rounded-xl p-6 h-fit">
              <h2 className="text-lg font-semibold text-text-primary mb-4">
                Account Details
              </h2>

              <dl className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-text-secondary">
                    Role
                  </dt>

                  <dd className="text-text-primary font-medium">
                    {ROLE_LABELS[profile.role] || profile.role}
                  </dd>
                </div>

                <div className="flex justify-between gap-4">
                  <dt className="text-text-secondary">
                    Batch
                  </dt>

                  <dd className="text-text-primary font-medium">
                    {profile.batch?.name || "Not assigned"}
                  </dd>
                </div>

                <div className="flex justify-between gap-4">
                  <dt className="text-text-secondary">
                    Status
                  </dt>

                  <dd
                    className={`font-medium ${
                      profile.isActive
                        ? "text-emerald"
                        : "text-gold"
                    }`}
                  >
                    {profile.isActive
                      ? "Active"
                      : "Pending Approval"}
                  </dd>
                </div>

                {profile.createdAt && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-text-secondary">
                      Joined
                    </dt>

                    <dd className="text-text-primary font-medium">
                      {new Date(
                        profile.createdAt
                      ).toLocaleDateString()}
                    </dd>
                  </div>
                )}
              </dl>

              <p className="text-xs text-text-secondary mt-4">
                Role, batch and account status are managed by an
                administrator and can't be changed here.
              </p>
            </div>
          </div>

          {/* Change Password */}
          <ChangePasswordForm />
        </div>
      )}
    </div>
  );
}