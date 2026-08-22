export type CmsIntegrationWorkflowStep = {
  id: number;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  deliverables: string[];
};

export type CmsIntegrationTechItem = {
  id: number;
  name: string;
  description: string;
};

export type CmsIntegrationServiceData = {
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  processTitle: string;
  processDescription: string;
  workflowIntro: string;
  steps: CmsIntegrationWorkflowStep[];
  techTitle: string;
  techDescription: string;
  techItems: CmsIntegrationTechItem[];
};