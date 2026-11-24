import { About } from "@/components/About";
import { Certifications } from "@/components/Certifications";
import { Contact } from "@/components/Contact";
import { Education } from "@/components/Education";
import { Experience } from "@/components/Experience";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { Summary } from "@/components/Summary";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Summary />
        <Experience />
        <Projects />
        <Skills />
        <Certifications />
        <Education />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
