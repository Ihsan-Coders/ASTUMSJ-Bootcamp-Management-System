import Hero from "../components/landing/Hero";
import About from "../components/landing/About";
import Tracks from "../components/landing/Tracks";
import Mentors from "../components/landing/Mentors";
import FAQ from "../components/landing/FAQ";
import Contact from "../components/landing/Contact";
import Alumni from "./AlumniPage";

export default function LandingPage() {
  return (
    <div>
      <Hero />
      <About />
      <section id="alumni">
        <Alumni />
      </section>
      <Tracks />
      <Mentors />
      <FAQ />
      <Contact />
    </div>
  );
}
