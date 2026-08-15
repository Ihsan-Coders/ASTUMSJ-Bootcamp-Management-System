import { useState } from "react";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
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
      </main>
      <Footer />
    </div>
  );
}
export default App;
