export type BlogCategory =
  | "UI/UX Design"
  | "Web Development"
  | "App Development"
  | "Business Strategy"
  | "Digital Marketing"
  | "Photography"
  | "Generative AI"
  | "AI Production"
  | "Edge Computing";

export interface BlogPost {
  id: number;
  title: string;
  author: string;
  date: string;
  category: BlogCategory;
  image: string;
  description?: string;
  slug: string;
}

export const blogCategories: BlogCategory[] = [
  "UI/UX Design",
  "Web Development",
  "App Development",
  "Business Strategy",
  "Digital Marketing",
  "Photography",
  "Generative AI",
  "AI Production",
  "Edge Computing",
];

export const blogs: BlogPost[] = [
  {
    id: 1,
    title: "Designing Digital Experiences That Connect Brands and People",
    author: "Olivia",
    date: "July 3, 2026",
    category: "UI/UX Design",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1400&auto=format&fit=crop",
    slug: "designing-digital-experiences",
  },
  {
    id: 2,
    title: "From Concept to Launch: Building Products That Truly Matter",
    author: "Daniel",
    date: "July 8, 2026",
    category: "Business Strategy",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1400&auto=format&fit=crop",
    slug: "from-concept-to-launch",
  },
  {
    id: 3,
    title: "Creating Impactful Interfaces Through Thoughtful Design Systems",
    author: "Emma",
    date: "July 12, 2026",
    category: "UI/UX Design",
    image:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=1400&auto=format&fit=crop",
    slug: "impactful-interfaces-design-systems",
  },
  {
    id: 4,
    title: "Why Strong Visual Identity Is the Foundation of Modern Brands",
    author: "Lucas",
    date: "July 17, 2026",
    category: "Digital Marketing",
    image:
      "https://images.unsplash.com/photo-1517502884422-41eaead166d4?q=80&w=1400&auto=format&fit=crop",
    slug: "strong-visual-identity-modern-brands",
  },
  {
    id: 5,
    title: "Crafting Mobile Journeys That Feel Native From Day One",
    author: "Sophia",
    date: "July 21, 2026",
    category: "App Development",
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1400&auto=format&fit=crop",
    slug: "crafting-mobile-journeys",
  },
  {
    id: 6,
    title: "Performance-First Frontends for Scalable Web Platforms",
    author: "Noah",
    date: "July 24, 2026",
    category: "Web Development",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1400&auto=format&fit=crop",
    slug: "performance-first-frontends",
  },
  {
    id: 7,
    title: "How Strategy Workshops Reduce Risk Before Product Delivery",
    author: "Mia",
    date: "July 29, 2026",
    category: "Business Strategy",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1400&auto=format&fit=crop",
    slug: "strategy-workshops-reduce-risk",
  },
  {
    id: 8,
    title: "Photography Direction for Brands That Need a Distinct Visual Tone",
    author: "Ethan",
    date: "August 2, 2026",
    category: "Photography",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1400&auto=format&fit=crop",
    slug: "photography-direction-for-brands",
  },
  {
    id: 9,
    title: "Designing Content Systems That Keep Marketing Teams Fast",
    author: "Ava",
    date: "August 5, 2026",
    category: "Digital Marketing",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1400&auto=format&fit=crop",
    slug: "designing-content-systems",
  },
  {
    id: 10,
    title: "What Great App Onboarding Teaches Us About Product Clarity",
    author: "Liam",
    date: "August 9, 2026",
    category: "App Development",
    image:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1400&auto=format&fit=crop",
    slug: "great-app-onboarding",
  },
  {
    id: 11,
    title:
      "Building Conversion-Focused Landing Pages With Strong Information Flow",
    author: "Isabella",
    date: "August 13, 2026",
    category: "Web Development",
    image:
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=1400&auto=format&fit=crop",
    slug: "conversion-focused-landing-pages",
  },
  {
    id: 12,
    title: "Interface Details That Make Enterprise Software Easier to Use",
    author: "James",
    date: "August 18, 2026",
    category: "UI/UX Design",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1400&auto=format&fit=crop",
    slug: "enterprise-interface-details",
  },
  {
    id: 13,
    title: "Scaling Product Teams With Better Technical Planning",
    author: "Charlotte",
    date: "August 22, 2026",
    category: "Business Strategy",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1400&auto=format&fit=crop",
    slug: "scaling-product-teams",
  },
  {
    id: 14,
    title: "Visual Storytelling Techniques for High-Impact Campaigns",
    author: "Benjamin",
    date: "August 26, 2026",
    category: "Digital Marketing",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop",
    slug: "visual-storytelling-techniques",
  },
  {
    id: 15,
    title: "Building Reliable APIs for Cross-Platform Product Ecosystems",
    author: "Harper",
    date: "August 29, 2026",
    category: "App Development",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1400&auto=format&fit=crop",
    slug: "reliable-apis-cross-platform",
  },
  {
    id: 16,
    title: "Responsive Web Systems That Stay Consistent Across Devices",
    author: "Elijah",
    date: "September 2, 2026",
    category: "Web Development",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1400&auto=format&fit=crop",
    slug: "responsive-web-systems",
  },
  {
    id: 17,
    title: "Using Editorial Photography to Strengthen Product Positioning",
    author: "Amelia",
    date: "September 6, 2026",
    category: "Photography",
    image:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1400&auto=format&fit=crop",
    slug: "editorial-photography-positioning",
  },
  {
    id: 18,
    title: "Design Patterns That Improve Retention in Complex Products",
    author: "Henry",
    date: "September 10, 2026",
    category: "UI/UX Design",
    image:
      "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=1400&auto=format&fit=crop",
    slug: "design-patterns-product-retention",
  },
  {
    id: 19,
    title: "Why Clear Positioning Wins Before Paid Growth Starts",
    author: "Evelyn",
    date: "September 14, 2026",
    category: "Business Strategy",
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1400&auto=format&fit=crop",
    slug: "clear-positioning-before-growth",
  },
  {
    id: 20,
    title: "Campaign Landing Page Systems for Faster Team Execution",
    author: "Alexander",
    date: "September 18, 2026",
    category: "Digital Marketing",
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1400&auto=format&fit=crop",
    slug: "campaign-landing-page-systems",
  },
  {
    id: 21,
    title: "Lessons Learned from Large-Scale LLM",
    author: "Olivia",
    date: "July 3, 2026",
    category: "Generative AI",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1400&auto=format&fit=crop",
    slug: "lessons-learned-from-large-scale-llm",
  },
  {
    id: 22,
    title:
      "Beyond the Accuracy Score: Why Scalability is the True Metric of Production AI",
    author: "Olivia",
    date: "July 3, 2026",
    category: "AI Production",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1400&auto=format&fit=crop",
    slug: "beyond-the-accuracy-score",
  },
  {
    id: 23,
    title:
      "Optimizing Real-Time Detection: Strategies for Reducing Latency in Edge Computing",
    author: "Lucas",
    date: "July 17, 2026",
    category: "Edge Computing",
    image:
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=1400&auto=format&fit=crop",
    slug: "optimizing-real-time-detection",
  },
];
