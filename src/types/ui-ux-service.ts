export type UiUxWorkflowStep = {
  id: number;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  deliverables: string[];
};

export type UiUxTechItem = {
  id: number;
  name: string;
  description: string;
};

export type UiUxServiceData = {
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  processTitle: string;
  processDescription: string;
  workflowIntro: string;
  steps: UiUxWorkflowStep[];
  techTitle: string;
  techDescription: string;
  techItems: UiUxTechItem[];
};