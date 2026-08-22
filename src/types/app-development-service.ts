export type AppDevWorkflowStep = {
  id: number;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  deliverables: string[];
};

export type AppDevTechItem = {
  id: number;
  name: string;
  description: string;
};

export type AppDevelopmentServiceData = {
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  processTitle: string;
  processDescription: string;
  workflowIntro: string;
  steps: AppDevWorkflowStep[];
  techTitle: string;
  techDescription: string;
  techItems: AppDevTechItem[];
};