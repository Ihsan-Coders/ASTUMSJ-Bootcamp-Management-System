import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import RegisterForm from "../components/auth/RegisterForm";
import { useEffect, useState } from 'react';
import { getRegistrationStatus } from '../api/settings.api';


export default function RegisterPage() {
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getRegistrationStatus()
      .then((res) => {
        if (!mounted) return;
        setRegistrationOpen(Boolean(res.data?.data?.registrationOpen));
      })
      .catch((err) => {
        console.error('Failed to fetch registration status:', err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full "
      >
        {loading ? (
          <p className="text-text-secondary text-center">Checking registration status...</p>
        ) : registrationOpen ? (
          <RegisterForm />
        ) : (
          <div className="glass-card rounded-xl p-6 text-center">
            <h2 className="text-lg font-semibold text-text-primary">Registration is currently closed</h2>
            <p className="text-text-secondary">Please check back later.</p>
          </div>
        )}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="text-sm text-text-secondary"
      >
        Already have an account?{" "}
        <Link to="/login" className="text-gold hover:underline">
          Login
        </Link>
      </motion.p>
    </div>
  );
}
