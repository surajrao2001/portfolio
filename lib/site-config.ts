export const siteConfig = {
  name: "Suraj Rao",
  title: "Suraj Rao — Portfolio",
  description:
    "Personal portfolio of Suraj Rao — projects, writing, and a way to get in touch.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  author: {
    name: "Suraj Rao",
    email: "hello@example.com",
  },
  links: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  nav: [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
