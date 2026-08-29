// import { useState } from "react";
// import {Link, useNavigate } from "react-router-dom";
// import { loginUser } from "../../api/auth.api";
// import { useAuth } from "../../context/AuthContext";
// import RotateOnceLogo from "../common/RotateOnceLogo";
// export default function LoginForm() {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const res = await loginUser(form);

//       login(res.data.data.user, res.data.data.token);

//       navigate("/");
//     } catch (err) {
//       setError(err.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="glass-card glow-border rounded-lg p-6 max-w-sm mx-auto"
//     >
//       <div className="flex justify-center mb-4">
//         <RotateOnceLogo />
//       </div>

//       <h2 className="text-xl font-semibold text-text-primary mb-4 text-center">
//         Login
//       </h2>
//       {error && <p className="text-danger text-sm mb-3">{error}</p>}
//       <input
//         type="email"
//         name="email"
//         placeholder="Email"
//         value={form.email}
//         onChange={handleChange}
//         autoComplete="email"
//         className="w-full p-2 mb-3 rounded border border-border bg-background text-text-primary"
//       />
//       <input
//         type="password"
//         name="password"
//         placeholder="Password"
//         value={form.password}
//         onChange={handleChange}
//         autoComplete="current-password"
//         className="w-full p-2 mb-4 rounded border border-border bg-background text-text-primary"
//       />

//       <div className="text-right mb-4">
//         <Link to="/forgot-password" className="text-sm text-gold hover:underline">
//           Forgot password?
//         </Link>
//       </div>

//       <button
//         type="submit"
//         className="w-full py-2 rounded font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] transition-shadow"
//       >
//         Login
//       </button>
//     </form>
//   );
// }
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../api/auth.api";
import { useAuth } from "../../context/AuthContext";
import RotateOnceLogo from "../common/RotateOnceLogo";

export default function LoginForm() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setError("");
    setIsSubmitting(true);

    try {
      const res = await loginUser(form);

      login(res.data.data.user, res.data.data.token);

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        relative
        mx-auto
        w-full
        max-w-[350px]
        overflow-hidden
        rounded-2xl
        border
        border-white/15
        bg-white/[0.07]
        px-5
        py-5
        shadow-[0_15px_50px_rgba(0,0,0,0.45)]
        backdrop-blur-xl
        sm:px-6
        sm:py-6
      "
    >
      {/* ==================== GLACIER EFFECT ==================== */}

      <div
        className="
          pointer-events-none
          absolute
          -top-20
          left-1/2
          h-40
          w-40
          -translate-x-1/2
          rounded-full
          bg-cyan-100/10
          blur-[60px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-16
          top-12
          h-32
          w-32
          rounded-full
          bg-gold/10
          blur-[55px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-16
          -left-12
          h-36
          w-36
          rounded-full
          bg-emerald/10
          blur-[60px]
        "
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          background:
            "linear-gradient(125deg, transparent 25%, rgba(255,255,255,0.35) 40%, transparent 52%, transparent 70%, rgba(255,255,255,0.2) 82%, transparent 92%)",
        }}
      />

      <div
        className="
          pointer-events-none
          absolute
          inset-x-6
          top-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-white/50
          to-transparent
        "
      />

      {/* ==================== CONTENT ==================== */}

      <div className="relative z-10">
        {/* Logo */}
        <div className="mb-2 flex justify-center">
          <div
            className="
              scale-75
              rounded-full
              border
              border-white/10
              bg-white/[0.05]
              p-1
              shadow-[0_0_20px_rgba(255,255,255,0.08)]
            "
          >
            <RotateOnceLogo />
          </div>
        </div>

        {/* Heading */}
        <div className="mb-4 text-center">
          <h2
            className="
              text-xl
              font-extrabold
              tracking-wide
              text-white
              sm:text-2xl
            "
          >
            Welcome Back
          </h2>

          <p className="mt-1 text-[11px] font-medium text-white/50 sm:text-xs">
            Sign in to continue your journey
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="
              mb-3
              rounded-lg
              border
              border-red-400/20
              bg-red-500/10
              px-3
              py-2
              text-xs
              font-medium
              text-red-300
            "
          >
            {error}
          </div>
        )}

        {/* Email */}
        <div className="mb-3">
          <label
            htmlFor="email"
            className="
              mb-1
              block
              text-[10px]
              font-bold
              uppercase
              tracking-wider
              text-white/55
            "
          >
            Email Address
          </label>

          <input
            id="email"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            disabled={isSubmitting}
            className="
              w-full
              rounded-lg
              border
              border-white/10
              bg-black/20
              px-3
              py-2.5
              text-sm
              font-medium
              text-white
              outline-none
              placeholder:text-white/30
              transition-all
              duration-300
              focus:border-gold/50
              focus:bg-black/30
              focus:ring-2
              focus:ring-gold/10
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          />
        </div>

        {/* Password */}
        <div className="mb-2">
          <label
            htmlFor="password"
            className="
              mb-1
              block
              text-[10px]
              font-bold
              uppercase
              tracking-wider
              text-white/55
            "
          >
            Password
          </label>

          <input
            id="password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            disabled={isSubmitting}
            className="
              w-full
              rounded-lg
              border
              border-white/10
              bg-black/20
              px-3
              py-2.5
              text-sm
              font-medium
              text-white
              outline-none
              placeholder:text-white/30
              transition-all
              duration-300
              focus:border-gold/50
              focus:bg-black/30
              focus:ring-2
              focus:ring-gold/10
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          />
        </div>

        {/* Forgot password */}
        <div className="mb-4 flex justify-end">
          <Link
            to="/forgot-password"
            className="
              text-[11px]
              font-semibold
              text-gold/80
              transition-colors
              hover:text-gold
              hover:underline
            "
          >
            Forgot password?
          </Link>
        </div>

        {/* Sign In */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="
            group
            relative
            flex
            w-full
            items-center
            justify-center
            gap-2
            overflow-hidden
            rounded-lg
            bg-gradient-to-r
            from-gold
            to-emerald
            py-2.5
            text-sm
            font-extrabold
            tracking-wide
            text-obsidian
            shadow-[0_7px_20px_rgba(212,175,55,0.18)]
            transition-all
            duration-300
            hover:-translate-y-0.5
            hover:shadow-[0_10px_28px_rgba(212,175,55,0.28)]
            active:translate-y-0
            disabled:cursor-not-allowed
            disabled:opacity-70
            disabled:hover:translate-y-0
          "
        >
          {/* Button shine */}
          {!isSubmitting && (
            <span
              className="
                absolute
                inset-y-0
                -left-full
                w-1/2
                skew-x-[-20deg]
                bg-white/25
                transition-all
                duration-700
                group-hover:left-[130%]
              "
            />
          )}

          {isSubmitting ? (
            <>
              <span
                className="
                  h-4
                  w-4
                  animate-spin
                  rounded-full
                  border-2
                  border-obsidian/30
                  border-t-obsidian
                "
              />

              <span className="relative z-10">Signing in...</span>
            </>
          ) : (
            <span className="relative z-10">Sign In</span>
          )}
        </button>

        {/* Register */}
        <div className="mt-4 text-center">
          <p className="text-xs font-medium text-white/55">
            Need an account?{" "}
            <Link
              to="/register"
              className="
                font-bold
                text-gold
                transition-colors
                hover:text-emerald
                hover:underline
              "
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
}
