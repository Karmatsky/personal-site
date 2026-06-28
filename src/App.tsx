import Header from "./components/Header";
import Footer from "./components/Footer";
import About from "./components/About";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import { Toaster } from "@/components/ui/sonner";
import { useScrollReveal } from "./lib/useScrollReveal";

function App() {
  useScrollReveal();

  return (
    <div className="site-shell">
      <Header />
      <main>
        <About />
        <Projects />
        <Contact />
      </main>
      <Toaster />
      <Footer />
    </div>
  );
}

export default App;
