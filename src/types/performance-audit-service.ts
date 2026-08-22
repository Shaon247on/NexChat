export type PerformanceAuditWorkflowStep = {
  id: number;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  deliverables: string[];
};

export type PerformanceAuditTechItem = {
  id: number;
  name: string;
  description: string;
};

export type PerformanceAuditServiceData = {
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  processTitle: string;
  processDescription: string;
  workflowIntro: string;
  steps: PerformanceAuditWorkflowStep[];
  techTitle: string;
  techDescription: string;
  techItems: PerformanceAuditTechItem[];
};