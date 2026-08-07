import { AboutTeaser } from "@/components/AboutTeaser";
import { FeaturedProjects } from "@/components/FeaturedProjects";
import { Hero } from "@/components/Hero";
import { getFeaturedProjects } from "@/lib/content/projects";

export default function HomePage() {
  const featured = getFeaturedProjects();

  return (
    <>
      <Hero />
      <AboutTeaser />
      <FeaturedProjects projects={featured} />
    </>
  );
}
