import AmbientBackground from "@/components/layout/AmbientBackground";
import AboutExperience from "@/components/about/AboutExperience";
import styles from "./about.module.css";

export default function AboutPage() {
  return (
    <main className={`projects-page about-page ${styles.page}`}>
      <AmbientBackground />

      <header className="projects-page-heading">
        <h1>About Me</h1>
        <p>안녕하세요안성원입니다잘부탁드립니다</p>
      </header>

      <AboutExperience />
    </main>
  );
}
