import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import LoginForm from "../components/auth/LoginForm";
export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        <LoginForm />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="text-sm text-text-secondary"
      >
        Need an account?{" "}
        <Link to="/register" className="text-gold hover:underline">
          Register
        </Link>
      </motion.p>
    </div>
  );
}
