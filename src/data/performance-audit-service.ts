import { PerformanceAuditServiceData } from "@/types/performance-audit-service";

export const performanceAuditServiceData: PerformanceAuditServiceData = {
  heroTitle: "Performance Audit",
  heroDescription:
    "We analyze websites and web applications to uncover bottlenecks affecting speed, usability, scalability, and search visibility. From Core Web Vitals and rendering strategy to assets, scripts, and delivery architecture, our audits translate technical issues into clear, actionable improvements.",
  heroImage:
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1800&auto=format&fit=crop",
  processTitle: "How we audit performance and uncover hidden bottlenecks",
  processDescription:
    "Our performance audit process is built to identify real-world issues, prioritize fixes, and create a roadmap that improves speed, experience, and reliability without unnecessary complexity.",
  workflowIntro:
    "A strong audit is not just a list of issues. It is a structured analysis of how the product behaves in production, why slowdowns happen, and what changes will create the most meaningful performance gains.",
  steps: [
    {
      id: 1,
      eyebrow: "Benchmarking",
      title: "We measure the current performance baseline across key journeys",
      description:
        "We start by evaluating real pages, user flows, and loading behavior to understand how the product currently performs across devices, network conditions, and screen sizes.",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600&auto=format&fit=crop",
      alt: "Analytics dashboard showing performance baseline metrics",
      deliverables: [
        "Baseline reports",
        "Core Web Vitals review",
        "Critical page identification",
        "Journey mapping",
      ],
    },
    {
      id: 2,
      eyebrow: "Analysis",
      title: "We investigate rendering, assets, scripts, and architecture",
      description:
        "We inspect bundle size, image delivery, hydration cost, script execution, third-party impact, caching, and rendering strategy to find the root causes behind slow or inconsistent performance.",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1600&auto=format&fit=crop",
      alt: "Team reviewing technical performance data across multiple screens",
      deliverables: [
        "Bundle analysis",
        "Asset review",
        "Render-path inspection",
        "Third-party script assessment",
      ],
    },
    {
      id: 3,
      eyebrow: "Prioritization",
      title: "We turn findings into a focused and practical improvement roadmap",
      description:
        "Not every issue has the same business impact. We prioritize fixes based on performance gain, user experience improvement, implementation effort, and SEO significance.",
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1600&auto=format&fit=crop",
      alt: "Product and engineering team prioritizing technical improvements",
      deliverables: [
        "Priority matrix",
        "Quick wins",
        "Strategic improvements",
        "Implementation roadmap",
      ],
    },
    {
      id: 4,
      eyebrow: "Optimization",
      title: "We define the changes needed to improve speed and stability",
      description:
        "We recommend concrete optimization strategies for assets, loading patterns, rendering, infrastructure, and frontend architecture so the product becomes faster and more reliable in production.",
      image:
        "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?q=80&w=1600&auto=format&fit=crop",
      alt: "Developer working on optimization and technical improvements",
      deliverables: [
        "Optimization recommendations",
        "Frontend performance fixes",
        "Delivery strategy improvements",
        "Caching guidance",
      ],
    },
    {
      id: 5,
      eyebrow: "Validation",
      title: "We verify results and ensure improvements hold in real use",
      description:
        "Once recommendations are implemented, we validate the outcome through retesting and comparative analysis to confirm measurable performance gains and long-term stability.",
      image:
        "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1600&auto=format&fit=crop",
      alt: "Team validating performance improvements after implementation",
      deliverables: [
        "Before and after comparison",
        "Retesting",
        "Impact validation",
        "Long-term monitoring guidance",
      ],
    },
  ],
  techTitle: "Focused on measurable speed, stability, and delivery quality",
  techDescription:
    "Our audits concentrate on the technical areas that most directly affect load time, responsiveness, SEO performance, and real-world user experience.",
  techItems: [
    {
      id: 1,
      name: "Core Web Vitals Review",
      description:
        "We evaluate loading, interactivity, and layout stability to identify the metrics affecting experience and search performance.",
    },
    {
      id: 2,
      name: "Frontend Rendering Analysis",
      description:
        "We inspect hydration, JavaScript cost, rendering flow, and client-side overhead across key pages.",
    },
    {
      id: 3,
      name: "Asset & Delivery Optimization",
      description:
        "We analyze images, fonts, scripts, caching, and delivery strategy to remove avoidable load bottlenecks.",
    },
    {
      id: 4,
      name: "Practical Improvement Roadmap",
      description:
        "We turn findings into a prioritized plan your team can implement with clarity and measurable impact.",
    },
  ],
};