export type WebDevWorkflowStep = {
  id: number;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  deliverables: string[];
};

export type WebDevTechItem = {
  id: number;
  name: string;
  description: string;
};

export type WebDevShowcaseItem = {
  id: number;
  title: string;
  image: string;
  alt: string;
  size?: "sm" | "md" | "lg";
};

export type WebDevServiceData = {
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  workflowIntro: string;
  processTitle: string;
  processDescription: string;
  steps: WebDevWorkflowStep[];
  techTitle: string;
  techDescription: string;
  techItems: WebDevTechItem[];
  showcaseTitle: string;
  showcaseDescription: string;
  showcaseItems: WebDevShowcaseItem[];
};