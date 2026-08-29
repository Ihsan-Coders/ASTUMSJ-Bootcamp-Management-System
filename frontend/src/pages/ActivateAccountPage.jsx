import { motion } from "framer-motion";
import ActivateAccountForm from "../components/auth/ActivateAccountForm";

export default function ActivateAccountPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <ActivateAccountForm />
      </motion.div>
    </div>
  );
}
