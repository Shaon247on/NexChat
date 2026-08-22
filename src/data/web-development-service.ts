import { WebDevServiceData } from "@/types/web-development-service";

export const webDevelopmentServiceData: WebDevServiceData = {
  heroTitle: "Web Development",
  heroDescription:
    "We design and build high-performing websites and web applications that are scalable, conversion-focused, and engineered for long-term growth. From strategy and UX to frontend architecture and optimization, our process turns complex ideas into polished digital products.",
  heroImage:
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1800&auto=format&fit=crop",
  workflowIntro:
    "Our workflow combines product thinking, visual precision, and robust engineering. Every phase is built to reduce complexity, improve performance, and create a seamless experience across devices.",
  processTitle: "How we build modern web experiences",
  processDescription:
    "From discovery to deployment, we follow a structured development workflow that keeps the project aligned, transparent, and performance-ready at every stage.",
  steps: [
    {
      id: 1,
      eyebrow: "Discovery",
      title: "We define the business goals and technical scope",
      description:
        "We begin by understanding your business model, audience, product goals, and technical requirements. This stage creates the strategic foundation for design and development decisions.",
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600&auto=format&fit=crop",
      alt: "Team workshop planning a web development project",
      deliverables: [
        "Requirement mapping",
        "Feature prioritization",
        "Technical planning",
        "Content structure",
      ],
    },
    {
      id: 2,
      eyebrow: "UX & UI",
      title: "We structure the experience before writing production code",
      description:
        "We shape the user journey, page hierarchy, interface behavior, and visual direction so the final product feels intuitive, consistent, and conversion-oriented.",
      image:
        "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=1600&auto=format&fit=crop",
      alt: "Designer working on interface wireframes and layout",
      deliverables: [
        "Wireframes",
        "Responsive layouts",
        "Design system decisions",
        "Interaction patterns",
      ],
    },
    {
      id: 3,
      eyebrow: "Development",
      title: "We build a fast, scalable, and maintainable web architecture",
      description:
        "Using modern frontend and backend practices, we develop robust systems that support performance, SEO, responsive behavior, and future scalability.",
      image:
        "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1600&auto=format&fit=crop",
      alt: "Developer writing code on a laptop with multi-screen setup",
      deliverables: [
        "Reusable components",
        "Responsive implementation",
        "API integration",
        "Performance optimization",
      ],
    },
    {
    id: 4,
    eyebrow: "Testing",
    title: "We validate quality, usability, and cross-device performance",
    description:
      "Before launch, we test the product across devices, browsers, and user flows to make sure everything works smoothly, loads efficiently, and delivers a reliable experience in production.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1600&auto=format&fit=crop",
    alt: "Team reviewing product testing and performance across multiple screens",
    deliverables: [
      "QA testing",
      "Cross-browser validation",
      "Accessibility checks",
      "Bug fixing",
    ],
  },
    {
      id: 5,
      eyebrow: "Launch & Growth",
      title: "We refine, test, and prepare the product for real-world use",
      description:
        "Before launch, we validate the experience across devices, improve loading performance, and ensure the product is ready for production, analytics, and future iteration.",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop",
      alt: "Analytics dashboard and launch performance monitoring",
      deliverables: [
        "QA and testing",
        "SEO readiness",
        "Deployment support",
        "Post-launch iteration",
      ],
    },
  ],
  techTitle: "Built with modern tools and solid engineering principles",
  techDescription:
    "We choose technologies based on performance, maintainability, and business fit — not trends. The result is a product that is easier to scale, faster to iterate, and stronger in production.",
  techItems: [
    {
      id: 1,
      name: "Scalable Frontend Architecture",
      description:
        "Component-driven systems built for consistency, maintainability, and growth.",
    },
    {
      id: 2,
      name: "Responsive UX Engineering",
      description:
        "Interfaces that adapt cleanly across desktop, tablet, and mobile experiences.",
    },
    {
      id: 3,
      name: "SEO & Performance Optimization",
      description:
        "Technical foundations that improve discoverability, speed, and usability.",
    },
    {
      id: 4,
      name: "API & CMS Integrations",
      description:
        "Flexible integrations that connect your website with the tools your business already uses.",
    },
  ],
  showcaseTitle: "What a strong development workflow creates",
  showcaseDescription:
    "A refined development process does more than ship pages. It creates clarity, speed, consistency, and a smoother experience from first click to final conversion.",
  showcaseItems: [
    {
      id: 1,
      title: "Product strategy sessions",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1400&auto=format&fit=crop",
      alt: "Team discussing product strategy in a workshop",
      size: "lg",
    },
    {
      id: 2,
      title: "Interface design systems",
      image:
        "https://images.unsplash.com/photo-1586717799252-bd134ad00e26?q=80&w=1200&auto=format&fit=crop",
      alt: "UI design board with layout and design elements",
      size: "sm",
    },
    {
      id: 3,
      title: "Development and testing",
      image:
        "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?q=80&w=1200&auto=format&fit=crop",
      alt: "Software developer working with modern code editor",
      size: "md",
    },
    {
      id: 4,
      title: "Launch-ready platforms",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1400&auto=format&fit=crop",
      alt: "Dashboard and analytics platform after launch",
      size: "lg",
    },
  ],
};