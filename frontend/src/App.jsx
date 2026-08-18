import { useState } from "react";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import StatCard from "./components/common/StatCard";
// add this somewhere inside your existing App.jsx return, temporarily:

function App() {
  const [showRegister, setShowRegister] = useState(false);
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center gap-4">
        {showRegister ? <RegisterForm /> : <LoginForm />}
        <button
          onClick={() => setShowRegister(!showRegister)}
          className="text-sm text-primary hover:underline"
        >
          {showRegister
            ? "Already have an account? Login"
            : "Need an account? Register"}
        </button>
        <StatCard label="Active Batches" value="4" icon="📊" />
      </main>
      <Footer />
    </div>
  );
}
export default App;
