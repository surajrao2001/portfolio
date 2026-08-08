import { FeaturedPosts } from "@/components/FeaturedPosts";
import { FeaturedProjects } from "@/components/FeaturedProjects";
import { Hero } from "@/components/Hero";
import { HomeCta } from "@/components/HomeCta";
import { SkillsSection } from "@/components/SkillsSection";
import { getAllPosts } from "@/lib/content/blog";
import { getFeaturedProjects } from "@/lib/content/projects";

const HOME_POST_LIMIT = 3;

export default function HomePage() {
  const featured = getFeaturedProjects();
  const posts = getAllPosts().slice(0, HOME_POST_LIMIT);

  return (
    <>
      <Hero />
      <FeaturedProjects projects={featured} />
      <SkillsSection />
      <FeaturedPosts posts={posts} />
      <HomeCta />
    </>
  );
}
