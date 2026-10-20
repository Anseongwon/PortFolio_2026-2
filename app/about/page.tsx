import AboutExperience from "@/components/about/AboutExperience";
import PageHeading from "@/components/layout/PageHeading";
import PageShell from "@/components/layout/PageShell";
import { ABOUT_IMPRESSION_OPTIONS } from "@/data/about-impressions";
import styles from "./about.module.css";

export default function AboutPage() {
  return (
    <PageShell className={`projects-page about-page ${styles.page}`}>
      <PageHeading
        description="안녕하세요안성원입니다잘부탁드립니다"
        title="About Me"
      />

      <AboutExperience
        initialImpressions={ABOUT_IMPRESSION_OPTIONS.map((option) => ({
          ...option,
          votes: 0,
        }))}
      />
    </PageShell>
  );
}
