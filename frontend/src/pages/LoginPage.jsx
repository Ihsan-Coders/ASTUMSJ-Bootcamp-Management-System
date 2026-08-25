import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import ProfessionalLamp from "../components/common/ProfessionalLamp";

export default function LoginPage() {
  const [isOn, setIsOn] = useState(false);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-x-hidden px-4 pt-24 pb-8 md:pt-20">
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 w-full max-w-4xl">
        {/* Lamp column */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-[140px] sm:w-[170px] md:w-[200px] lg:w-[230px] shrink-0"
        >
          <ProfessionalLamp
            isOn={isOn}
            onToggle={() => setIsOn((v) => !v)}
            className="w-full"
          />
        </motion.div>

        {/* Form column */}
        <div className="relative w-full max-w-sm flex flex-col items-center gap-4">
          <AnimatePresence>
            {isOn && (
              <motion.div
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                exit={{ opacity: 0, scaleY: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ transformOrigin: "top" }}
                className="absolute -top-24 left-1/2 -translate-x-1/2 w-56 h-64 pointer-events-none z-0"
              >
                <div
                  className="w-full h-full"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(212,175,55,0.3), transparent 75%)",
                    clipPath: "polygon(38% 0%, 62% 0%, 100% 100%, 0% 100%)",
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {isOn ? (
              <motion.div
                key="card"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative z-10 w-full"
              >
                <LoginForm />
              </motion.div>
            ) : (
              <motion.p
                key="prompt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative z-10 text-text-secondary text-sm"
              >
                Turn on the lamp to log in
              </motion.p>
            )}
          </AnimatePresence>

          {isOn && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="relative z-10 text-sm text-text-secondary"
            >
              Need an account?{" "}
              <Link to="/register" className="text-gold hover:underline">
                Register
              </Link>
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
}
