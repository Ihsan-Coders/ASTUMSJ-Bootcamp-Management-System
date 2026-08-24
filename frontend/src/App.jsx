import Navbar from "./components/common/Navbar";
import GirihBackground from "./components/common/GirihBackground";
import Footer from "./components/common/Footer";
import AppRoutes from "./routes/AppRoutes";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col relative">
      <GirihBackground />

      <Navbar />

      <main
        className={`relative z-10 flex-1 ${
          user ? "md:pl-[260px]" : ""
        }`}
      >
        <AppRoutes />
      </main>

      <Footer />
    </div>
  );
}

export default App;