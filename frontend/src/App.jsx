import Navbar from "./components/common/Navbar";
import BottomNav from "./components/common/BottomNav";
import GirihBackground from "./components/common/GirihBackground";
import Footer from "./components/common/Footer";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <GirihBackground />
      <Navbar />
      <main className="relative z-10 flex-1">
        <AppRoutes />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
export default App;
