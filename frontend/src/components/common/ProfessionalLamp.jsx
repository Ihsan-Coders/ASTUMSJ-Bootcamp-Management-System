// import { motion } from "framer-motion";

// // A realistic desk-lamp illustration (shade, harp, pole, weighted base) —
// // no character/face. Click the pull-switch to turn it on, revealing the
// // login card below like flipping on a real lamp.
// export default function ProfessionalLamp({ isOn, onToggle }) {
//   return (
//     <button
//       onClick={onToggle}
//       className="relative flex flex-col items-center focus:outline-none group"
//       aria-label={isOn ? "Turn off the lamp" : "Turn on the lamp"}
//     >
//       <svg
//         width="140"
//         height="180"
//         viewBox="0 0 140 180"
//         className="overflow-visible"
//       >
//         <defs>
//           {/* Shade gradient — lit warm gold when on, cool charcoal when off */}
//           <linearGradient id="shadeGrad" x1="0" y1="0" x2="0" y2="1">
//             <stop offset="0%" stopColor={isOn ? "#F3D98A" : "#4a4f4c"} />
//             <stop offset="55%" stopColor={isOn ? "#D4AF37" : "#333835"} />
//             <stop offset="100%" stopColor={isOn ? "#B8941F" : "#22262a"} />
//           </linearGradient>
//           {/* Inner rim glow at the mouth of the shade */}
//           <radialGradient id="bulbGlow" cx="50%" cy="10%" r="70%">
//             <stop
//               offset="0%"
//               stopColor="#FFF4D6"
//               stopOpacity={isOn ? 0.95 : 0}
//             />
//             <stop offset="100%" stopColor="#FFF4D6" stopOpacity="0" />
//           </radialGradient>
//           {/* Pole cylindrical shading */}
//           <linearGradient id="poleGrad" x1="0" y1="0" x2="1" y2="0">
//             <stop offset="0%" stopColor="#c7cbc8" />
//             <stop offset="45%" stopColor="#8a8f8c" />
//             <stop offset="100%" stopColor="#5c605d" />
//           </linearGradient>
//           {/* Base shading */}
//           <radialGradient id="baseGrad" cx="50%" cy="35%" r="70%">
//             <stop offset="0%" stopColor="#c7cbc8" />
//             <stop offset="100%" stopColor="#6c716e" />
//           </radialGradient>
//           {/* Ambient glow behind the whole shade when lit */}
//           {isOn && (
//             <radialGradient id="ambientGlow">
//               <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.45" />
//               <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
//             </radialGradient>
//           )}
//         </defs>

//         {/* Ambient glow */}
//         {isOn && (
//           <motion.circle
//             initial={{ opacity: 0, r: 25 }}
//             animate={{ opacity: 1, r: 60 }}
//             transition={{ duration: 0.5 }}
//             cx="70"
//             cy="55"
//             r="60"
//             fill="url(#ambientGlow)"
//           />
//         )}

//         {/* Harp (thin wire frame holding the shade) */}
//         <path
//           d="M55 30 L45 8 L95 8 L85 30"
//           fill="none"
//           stroke="#8a8f8c"
//           strokeWidth="1.5"
//         />
//         {/* Finial (small decorative cap on top) */}
//         <circle
//           cx="70"
//           cy="6"
//           r="4"
//           fill="#a8ada9"
//           stroke="#6c716e"
//           strokeWidth="1"
//         />

//         {/* Lampshade */}
//         <path
//           d="M42 30 L98 30 L115 92 L25 92 Z"
//           fill="url(#shadeGrad)"
//           stroke={isOn ? "#B8941F" : "#1a1d1b"}
//           strokeWidth="1.5"
//         />
//         {/* Rim highlight line at top of shade */}
//         <path
//           d="M42 30 L98 30"
//           stroke="#F3D98A"
//           strokeWidth="1"
//           opacity={isOn ? 0.6 : 0.15}
//         />
//         {/* Glow at the mouth (bottom opening) of the shade */}
//         <ellipse cx="70" cy="92" rx="46" ry="6" fill="url(#bulbGlow)" />

//         {/* Pole */}
//         <rect
//           x="65"
//           y="92"
//           width="10"
//           height="55"
//           fill="url(#poleGrad)"
//           rx="2"
//         />
//         {/* Small decorative ring midway on the pole */}
//         <rect x="62" y="118" width="16" height="4" rx="2" fill="#6c716e" />

//         {/* Pull switch — the actual clickable indicator */}
//         <motion.g animate={{ y: isOn ? 2 : 0 }} transition={{ duration: 0.15 }}>
//           <line
//             x1="70"
//             y1="147"
//             x2="70"
//             y2="158"
//             stroke="#6c716e"
//             strokeWidth="1.5"
//           />
//           <circle cx="70" cy="160" r="4" fill={isOn ? "#D4AF37" : "#8a8f8c"} />
//         </motion.g>

//         {/* Base */}
//         <ellipse
//           cx="70"
//           cy="163"
//           rx="34"
//           ry="9"
//           fill="url(#baseGrad)"
//           stroke="#4a4f4c"
//           strokeWidth="1"
//         />
//         <ellipse cx="70" cy="160" rx="34" ry="8" fill="url(#baseGrad)" />
//       </svg>

//       <span className="mt-3 text-xs text-text-secondary group-hover:text-gold transition-colors">
//         {isOn ? "Tap to turn off" : "Tap the switch to begin"}
//       </span>
//     </button>
//   );
// }

// import { motion } from "framer-motion";

// export default function ProfessionalLamp({ isOn, onToggle, size = 220 }) {
//   return (
//     <div className="relative flex flex-col items-center">
//       <svg
//         width={size}
//         height={size * 1.5}
//         viewBox="0 0 140 210"
//         className="overflow-visible"
//       >
//         <defs>
//           {/* Lamp shade */}
//           <linearGradient id="shadeGrad" x1="0" y1="0" x2="0" y2="1">
//             <stop offset="0%" stopColor={isOn ? "#F3D98A" : "#4a4f4c"} />
//             <stop offset="55%" stopColor={isOn ? "#D4AF37" : "#333835"} />
//             <stop offset="100%" stopColor={isOn ? "#B8941F" : "#22262a"} />
//           </linearGradient>

//           {/* Light */}
//           <radialGradient id="bulbGlow" cx="50%" cy="10%" r="70%">
//             <stop
//               offset="0%"
//               stopColor="#FFF4D6"
//               stopOpacity={isOn ? 0.95 : 0}
//             />
//             <stop offset="100%" stopColor="#FFF4D6" stopOpacity="0" />
//           </radialGradient>

//           {/* Stem */}
//           <linearGradient id="poleGrad" x1="0" y1="0" x2="1" y2="0">
//             <stop offset="0%" stopColor="#c7cbc8" />
//             <stop offset="45%" stopColor="#8a8f8c" />
//             <stop offset="100%" stopColor="#5c605d" />
//           </linearGradient>

//           {/* Base */}
//           <radialGradient id="baseGrad" cx="50%" cy="35%" r="70%">
//             <stop offset="0%" stopColor="#c7cbc8" />
//             <stop offset="100%" stopColor="#6c716e" />
//           </radialGradient>

//           {/* Ambient glow */}
//           {isOn && (
//             <radialGradient id="ambientGlow">
//               <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.45" />
//               <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
//             </radialGradient>
//           )}
//         </defs>

//         {/* ================================= */}
//         {/* AMBIENT LIGHT */}
//         {/* ================================= */}

//         {isOn && (
//           <motion.circle
//             initial={{ opacity: 0, r: 25 }}
//             animate={{ opacity: 1, r: 60 }}
//             transition={{ duration: 0.5 }}
//             cx="70"
//             cy="55"
//             r="60"
//             fill="url(#ambientGlow)"
//           />
//         )}

//         {/* ================================= */}
//         {/* ROPE - BEHIND THE SHADE */}
//         {/* ================================= */}

//         <motion.g
//           initial={false}
//           animate={{ y: isOn ? 7 : 0 }}
//           transition={{
//             type: "spring",
//             stiffness: 500,
//             damping: 18,
//           }}
//           onClick={(e) => {
//             e.stopPropagation();
//             onToggle();
//           }}
//           className="cursor-pointer"
//           role="button"
//           aria-label={isOn ? "Pull rope to turn off" : "Pull rope to turn on"}
//         >
//           {/* Rope starts behind the shade */}
//           <line
//             x1="34"
//             y1="70"
//             x2="34"
//             y2="125"
//             stroke="#8a8f8c"
//             strokeWidth="1.8"
//           />

//           {/* Rope handle */}
//           <circle
//             cx="34"
//             cy="130"
//             r="5"
//             fill={isOn ? "#D4AF37" : "#8a8f8c"}
//             stroke={isOn ? "#F3D98A" : "#5c605d"}
//             strokeWidth="1"
//           />

//           {/* Larger invisible click area */}
//           <circle cx="34" cy="130" r="13" fill="transparent" />
//         </motion.g>

//         {/* ================================= */}
//         {/* HARP */}
//         {/* ================================= */}

//         <path
//           d="M55 30 L45 8 L95 8 L85 30"
//           fill="none"
//           stroke="#8a8f8c"
//           strokeWidth="1.5"
//         />

//         {/* Finial */}
//         <circle
//           cx="70"
//           cy="6"
//           r="4"
//           fill="#a8ada9"
//           stroke="#6c716e"
//           strokeWidth="1"
//         />

//         {/* ================================= */}
//         {/* LAMP SHADE */}
//         {/* ================================= */}

//         <path
//           d="M42 30 L98 30 L115 92 L25 92 Z"
//           fill="url(#shadeGrad)"
//           stroke={isOn ? "#B8941F" : "#1a1d1b"}
//           strokeWidth="1.5"
//         />

//         {/* Top rim */}
//         <path
//           d="M42 30 L98 30"
//           stroke="#F3D98A"
//           strokeWidth="1"
//           opacity={isOn ? 0.6 : 0.15}
//         />

//         {/* Bottom light */}
//         <ellipse cx="70" cy="92" rx="46" ry="6" fill="url(#bulbGlow)" />

//         {/* ================================= */}
//         {/* FULL LAMP STEM */}
//         {/* ================================= */}

//         <rect
//           x="65"
//           y="92"
//           width="10"
//           height="63"
//           fill="url(#poleGrad)"
//           rx="2"
//         />

//         {/* Stem highlight */}
//         <rect
//           x="67"
//           y="94"
//           width="2"
//           height="59"
//           rx="1"
//           fill="#e0e3e1"
//           opacity="0.35"
//         />

//         {/* Decorative ring */}
//         <rect x="62" y="118" width="16" height="4" rx="2" fill="#6c716e" />

//         {/* ================================= */}
//         {/* BASE */}
//         {/* ================================= */}

//         <ellipse
//           cx="70"
//           cy="164"
//           rx="34"
//           ry="9"
//           fill="url(#baseGrad)"
//           stroke="#4a4f4c"
//           strokeWidth="1"
//         />

//         <ellipse cx="70" cy="161" rx="34" ry="8" fill="url(#baseGrad)" />
//       </svg>

//       <span className="mt-3 text-xs text-text-secondary">
//         {isOn ? "Pull the rope to turn off" : "Pull the rope to turn on"}
//       </span>
//     </div>
//   );
// }

import { motion } from "framer-motion";

export default function ProfessionalLamp({ isOn, onToggle, className = "" }) {
  return (
    <div className="relative flex flex-col items-center">
      <svg
        viewBox="0 0 140 210"
        className={`w-full h-auto overflow-visible ${className}`}
      >
        <defs>
          {/* Lamp shade */}
          <linearGradient id="shadeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isOn ? "#F3D98A" : "#4a4f4c"} />
            <stop offset="55%" stopColor={isOn ? "#D4AF37" : "#333835"} />
            <stop offset="100%" stopColor={isOn ? "#B8941F" : "#22262a"} />
          </linearGradient>

          {/* Light */}
          <radialGradient id="bulbGlow" cx="50%" cy="10%" r="70%">
            <stop
              offset="0%"
              stopColor="#FFF4D6"
              stopOpacity={isOn ? 0.95 : 0}
            />
            <stop offset="100%" stopColor="#FFF4D6" stopOpacity="0" />
          </radialGradient>

          {/* Stem */}
          <linearGradient id="poleGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#c7cbc8" />
            <stop offset="45%" stopColor="#8a8f8c" />
            <stop offset="100%" stopColor="#5c605d" />
          </linearGradient>

          {/* Base */}
          <radialGradient id="baseGrad" cx="50%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#c7cbc8" />
            <stop offset="100%" stopColor="#6c716e" />
          </radialGradient>

          {/* Ambient glow */}
          {isOn && (
            <radialGradient id="ambientGlow">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
            </radialGradient>
          )}
        </defs>

        {/* ================================= */}
        {/* AMBIENT LIGHT */}
        {/* ================================= */}

        {isOn && (
          <motion.circle
            initial={{ opacity: 0, r: 25 }}
            animate={{ opacity: 1, r: 60 }}
            transition={{ duration: 0.5 }}
            cx="70"
            cy="55"
            r="60"
            fill="url(#ambientGlow)"
          />
        )}

        {/* ================================= */}
        {/* ROPE - BEHIND THE SHADE */}
        {/* ================================= */}

        <motion.g
          initial={false}
          animate={{ y: isOn ? 7 : 0 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 18,
          }}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className="cursor-pointer"
          role="button"
          aria-label={isOn ? "Pull rope to turn off" : "Pull rope to turn on"}
        >
          {/* Rope starts behind the shade */}
          <line
            x1="34"
            y1="70"
            x2="34"
            y2="125"
            stroke="#8a8f8c"
            strokeWidth="1.8"
          />

          {/* Rope handle */}
          <circle
            cx="34"
            cy="130"
            r="5"
            fill={isOn ? "#D4AF37" : "#8a8f8c"}
            stroke={isOn ? "#F3D98A" : "#5c605d"}
            strokeWidth="1"
          />

          {/* Larger invisible click area */}
          <circle cx="34" cy="130" r="13" fill="transparent" />
        </motion.g>

        {/* ================================= */}
        {/* HARP */}
        {/* ================================= */}

        <path
          d="M55 30 L45 8 L95 8 L85 30"
          fill="none"
          stroke="#8a8f8c"
          strokeWidth="1.5"
        />

        {/* Finial */}
        <circle
          cx="70"
          cy="6"
          r="4"
          fill="#a8ada9"
          stroke="#6c716e"
          strokeWidth="1"
        />

        {/* ================================= */}
        {/* LAMP SHADE */}
        {/* ================================= */}

        <path
          d="M42 30 L98 30 L115 92 L25 92 Z"
          fill="url(#shadeGrad)"
          stroke={isOn ? "#B8941F" : "#1a1d1b"}
          strokeWidth="1.5"
        />

        {/* Top rim */}
        <path
          d="M42 30 L98 30"
          stroke="#F3D98A"
          strokeWidth="1"
          opacity={isOn ? 0.6 : 0.15}
        />

        {/* Bottom light */}
        <ellipse cx="70" cy="92" rx="46" ry="6" fill="url(#bulbGlow)" />

        {/* ================================= */}
        {/* FULL LAMP STEM */}
        {/* ================================= */}

        <rect
          x="65"
          y="92"
          width="10"
          height="63"
          fill="url(#poleGrad)"
          rx="2"
        />

        {/* Stem highlight */}
        <rect
          x="67"
          y="94"
          width="2"
          height="59"
          rx="1"
          fill="#e0e3e1"
          opacity="0.35"
        />

        {/* Decorative ring */}
        <rect x="62" y="118" width="16" height="4" rx="2" fill="#6c716e" />

        {/* ================================= */}
        {/* BASE */}
        {/* ================================= */}

        <ellipse
          cx="70"
          cy="164"
          rx="34"
          ry="9"
          fill="url(#baseGrad)"
          stroke="#4a4f4c"
          strokeWidth="1"
        />

        <ellipse cx="70" cy="161" rx="34" ry="8" fill="url(#baseGrad)" />
      </svg>

      <span className="mt-3 text-xs text-text-secondary">
        {isOn ? "Pull the rope to turn off" : "Pull the rope to turn on"}
      </span>
    </div>
  );
}
