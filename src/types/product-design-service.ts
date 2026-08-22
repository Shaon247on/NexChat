export type ProductDesignWorkflowStep = {
  id: number;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  deliverables: string[];
};

export type ProductDesignTechItem = {
  id: number;
  name: string;
  description: string;
};

export type ProductDesignServiceData = {
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  processTitle: string;
  processDescription: string;
  workflowIntro: string;
  steps: ProductDesignWorkflowStep[];
  techTitle: string;
  techDescription: string;
  techItems: ProductDesignTechItem[];
};