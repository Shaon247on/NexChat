export type CaseStudyCategory =
  | "Brand Strategy"
  | "Web Design"
  | "UI/UX"
  | "Development"
  | "SEO"
  | "Product Design";

export type CaseStudyStat = {
  value: string;
  label: string;
};

export type CaseStudySummary = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  coverAlt: string;
  category: CaseStudyCategory;
  industry: string;
  publishedAt: string;
  readTime: string;
  featured?: boolean;
  stat?: CaseStudyStat;
};

export type CaseStudySection =
  | {
      type: "paragraph";
      title?: string;
      content: string;
    }
  | {
      type: "bulletList";
      title?: string;
      items: string[];
    }
  | {
      type: "quote";
      quote: string;
      author: string;
      role: string;
    };

export type CaseStudyGalleryItem = {
  id: number;
  image: string;
  alt: string;
  size?: "sm" | "md" | "lg";
};

export type CaseStudyDetail = CaseStudySummary & {
  seoTitle: string;
  seoDescription: string;
  client: string;
  duration: string;
  services: string[];
  challenge: string;
  solution: string;
  outcome: string;
  heroSubtitle: string;
  intro: string;
  gallery: string[];
  sections: CaseStudySection[];
  relatedCaseStudySlugs: string[];

  marqueeGallery: CaseStudyGalleryItem[];
  showcaseGallery: CaseStudyGalleryItem[];
};