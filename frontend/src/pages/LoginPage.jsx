import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import LoginForm from "../components/auth/LoginForm";
import ProfessionalLamp from "../components/common/ProfessionalLamp";

import darkBackground from "../assets/login-dark.jpg";
import lightBackground from "../assets/login-light.jpg";
import logo from "../assets/astu-msj-logo.jpg";

export default function LoginPage() {
  const [isOn, setIsOn] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <main className="relative h-[calc(100dvh-64px)] w-full overflow-hidden bg-obsidian">
      {/* =========================================================
          BACKGROUND
      ========================================================== */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="sync">
          {!isOn ? (
            <motion.img
              key="dark-background"
              src={darkBackground}
              alt="Dark atmospheric background for the ASTU MSJ Bootcamp login page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.8,
                ease: "easeInOut",
              }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <motion.img
              key="light-background"
              src={lightBackground}
              alt="Warm illuminated background for the ASTU MSJ Bootcamp login page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.8,
                ease: "easeInOut",
              }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </AnimatePresence>

        {/* Dynamic darkness */}
        <motion.div
          animate={{
            opacity: isOn ? 0.32 : 0.62,
          }}
          transition={{
            duration: 0.7,
          }}
          className="absolute inset-0 bg-black"
        />

        {/* Cinematic side gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-transparent to-black/65" />

        {/* Top fade */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/45 to-transparent" />

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* =========================================================
          AMBIENT LIGHT
      ========================================================== */}
      <AnimatePresence>
        {isOn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.9,
            }}
            className="pointer-events-none absolute inset-0 z-[1]"
          >
            {/* Golden ambient glow */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.7,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 1,
              }}
              className="
                absolute
                left-[5%]
                top-[25%]
                h-64
                w-64
                rounded-full
                bg-gold/10
                blur-[100px]
                sm:left-[15%]
                sm:h-72
                sm:w-72
              "
            />

            {/* Emerald ambient glow */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.7,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 1,
                delay: 0.15,
              }}
              className="
                absolute
                right-[5%]
                top-[30%]
                h-72
                w-72
                rounded-full
                bg-emerald/10
                blur-[120px]
                sm:right-[15%]
                sm:h-80
                sm:w-80
              "
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================
          MAIN CONTENT
      ========================================================== */}
      <div className="relative z-10 flex h-full w-full items-center justify-center px-4 sm:px-6">
        <div
          className="
            flex
            w-full
            max-w-5xl
            flex-col
            items-center
            justify-center
            gap-3
            sm:gap-5
            md:flex-row
            md:gap-12
            lg:gap-20
          "
        >
          {/* =====================================================
              PROFESSIONAL LAMP
          ====================================================== */}
          <motion.div
            initial={{
              opacity: 0,
              x: -35,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.7,
              ease: "easeOut",
            }}
            className="
              relative
              w-[85px]
              shrink-0
              sm:w-[120px]
              md:w-[175px]
              lg:w-[205px]
            "
          >
            <ProfessionalLamp
              isOn={isOn}
              onToggle={() => setIsOn((value) => !value)}
              className="w-full"
            />
          </motion.div>

          {/* =====================================================
              LOGIN / INTRO AREA
          ====================================================== */}
          <div className="relative flex w-full max-w-sm flex-col items-center">
            {/* =================================================
                LAMP LIGHT BEAM
            ================================================== */}
            <AnimatePresence>
              {isOn && (
                <motion.div
                  initial={{
                    opacity: 0,
                    scaleY: 0,
                  }}
                  animate={{
                    opacity: 1,
                    scaleY: 1,
                  }}
                  exit={{
                    opacity: 0,
                    scaleY: 0,
                  }}
                  transition={{
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                  style={{
                    transformOrigin: "top",
                  }}
                  className="
                    pointer-events-none
                    absolute
                    -top-14
                    left-1/2
                    z-0
                    h-56
                    w-48
                    -translate-x-1/2
                    sm:-top-16
                    sm:h-64
                    sm:w-56
                  "
                >
                  <div
                    className="h-full w-full"
                    style={{
                      background:
                        "linear-gradient(to bottom, rgba(212,175,55,0.30), transparent 75%)",
                      clipPath: "polygon(38% 0%, 62% 0%, 100% 100%, 0% 100%)",
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* =================================================
                LOGIN FORM / IDLE STATE
            ================================================== */}
            <AnimatePresence mode="wait">
              {isOn ? (
                <motion.div
                  key="login"
                  initial={{
                    opacity: 0,
                    y: 20,
                    scale: 0.96,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: 15,
                    scale: 0.96,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                  className="relative z-10 w-full"
                >
                  <div
                    className="
                      rounded-2xl
                      border
                      border-white/10
                      bg-black/30
                      p-1
                      shadow-2xl
                      backdrop-blur-xl
                    "
                  >
                    <LoginForm />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="prompt"
                  initial={{
                    opacity: 0,
                    y: 12,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -12,
                  }}
                  transition={{
                    duration: 0.5,
                  }}
                  className="
                    relative
                    z-10
                    flex
                    w-full
                    flex-col
                    items-center
                    text-center
                  "
                >
                  {/* =================================================
                      LOGO
                  ================================================== */}
                  <motion.div
                    animate={{
                      scale: [1, 1.04, 1],
                      opacity: [0.82, 1, 0.82],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="
                      mb-5
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <img
                      src={logo}
                      alt="ASTU MSJ Summer Bootcamp logo"
                      className="
                        h-16
                        w-16
                        object-contain
                        drop-shadow-[0_0_20px_rgba(212,175,55,0.40)]
                        sm:h-20
                        sm:w-20
                      "
                    />
                  </motion.div>

                  {/* =================================================
                      MAIN COMMAND
                  ================================================== */}
                  <motion.h2
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: 0.1,
                    }}
                    className="
                      text-lg
                      font-extrabold
                      tracking-wide
                      text-white
                      sm:text-xl
                    "
                  >
                    Pull the Rope to Begin
                  </motion.h2>

                  {/* =================================================
                      DESCRIPTION
                  ================================================== */}
                  <motion.p
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: 0.2,
                    }}
                    className="
                      mt-2
                      max-w-xs
                      text-sm
                      font-medium
                      leading-relaxed
                      text-white/70
                    "
                  >
                    Illuminate your path and access the ASTU MSJ Bootcamp
                    portal.
                  </motion.p>

                  {/* =================================================
                      ACTION BADGE
                  ================================================== */}
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: 0.35,
                    }}
                    className="
                      mt-4
                      inline-flex
                      items-center
                      gap-2
                      rounded-full
                      border
                      border-gold/20
                      bg-black/25
                      px-4
                      py-2
                      text-xs
                      font-bold
                      uppercase
                      tracking-[0.15em]
                      text-gold/90
                      shadow-lg
                      backdrop-blur-sm
                    "
                  >
                    <motion.span
                      animate={{
                        scale: [1, 1.4, 1],
                        opacity: [0.6, 1, 0.6],
                      }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="
                        h-1.5
                        w-1.5
                        rounded-full
                        bg-gold
                        shadow-[0_0_10px_rgba(212,175,55,0.9)]
                      "
                    />
                    Pull the rope
                  </motion.div>

                  {/* =================================================
                      SMALL SUPPORTING MESSAGE
                  ================================================== */}
                  <motion.p
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: 0.5,
                    }}
                    className="
                      mt-4
                      text-[11px]
                      font-medium
                      tracking-wide
                      text-white/35
                    "
                  >
                    Your journey starts here.
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* =====================================================
                REGISTER
            ====================================================== */}
          </div>
        </div>
      </div>
    </main>
  );
}
