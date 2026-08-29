import { motion } from "framer-motion";
import imageLogo from "../../assets/astu-msj-logo.jpg";

// Spins a full 360° exactly once when the page loads, then stays still.
export default function RotateOnceLogo() {
  return (
    <motion.div
      initial={{ rotate: 0, opacity: 0, scale: 0.8 }}
      animate={{ rotate: 360, opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1
                 bg-gradient-to-br from-gold/40 to-emerald/20
                 border border-gold/50
                 shadow-[0_0_20px_rgba(212,175,55,0.2)]"
    >
      <div className="w-full h-full rounded-full overflow-hidden bg-obsidian">
        <img
          src={imageLogo}
          alt="ASTU MSJ Bootcamp Logo"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>
    </motion.div>
  );
}
