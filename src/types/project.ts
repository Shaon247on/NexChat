export type ProjectMetric = {
  value: string;
  label: string;
};

export type ProjectTag = string;

export type ProjectSummary = {
  id: string;
  slug: string;
  title: string;
  ctaLabel: string;
  href: string;
  coverImage: string;
  coverAlt: string;
  metric: ProjectMetric;
  tags: ProjectTag[];
  accent?: "dark" | "light";
  size?: "standard" | "feature";
  category: string;
  year: string;
};

export type ProjectInfoRow = {
  label: string;
  value: string;
};

export type ProjectMarqueeItem = {
  id: string;
  image: string;
  alt: string;
  width?: "sm" | "md" | "lg";
};

export type ProjectDetail = ProjectSummary & {
  subtitle: string;
  description: string;
  intro: string;
  overview: string;
  solution: string;
  outcome: string;
  quote: {
    text: string;
    author: string;
    role: string;
  };
  heroImage: string;
  introImage: string;
  gallery: string[];
  marqueeGallery: ProjectMarqueeItem[];
  infoRows: ProjectInfoRow[];
  relatedProjectSlugs: string[];
};