import { useState } from "react";
import Navbar from "./components/common/Navbar";
import BottomNav from "./components/common/BottomNav";
import GirihBackground from "./components/common/GirihBackground";
import Footer from "./components/common/Footer";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";

function App() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="min-h-screen flex flex-col relative">
      <GirihBackground />

      <Navbar minimal />

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center gap-4 px-4 pb-24 md:pb-8">
        {showRegister ? <RegisterForm /> : <LoginForm />}

        <button
          onClick={() => setShowRegister(!showRegister)}
          className="text-sm text-gold hover:underline"
        >
          {showRegister
            ? "Already have an account? Login"
            : "Need an account? Register"}
        </button>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}

export default App;