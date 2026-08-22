import { AppDevelopmentServiceData } from "@/types/app-development-service";

export const appDevelopmentServiceData: AppDevelopmentServiceData = {
  heroTitle: "App Development",
  heroDescription:
    "We design and develop modern mobile applications that are fast, intuitive, and built for scale. From product strategy and user experience to production-ready engineering, our process helps turn ideas into reliable digital products that users enjoy using every day.",
  heroImage:
    "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1800&auto=format&fit=crop",
  processTitle: "How we build modern mobile products",
  processDescription:
    "Our app development workflow is structured to reduce risk, improve product clarity, and create mobile experiences that feel polished, performant, and ready for real users.",
  workflowIntro:
    "We combine product strategy, mobile UX thinking, and scalable engineering to create mobile apps that are useful, engaging, and built to grow with the business.",
  steps: [
    {
      id: 1,
      eyebrow: "Discovery",
      title: "We define the product vision, audience, and technical scope",
      description:
        "We begin by understanding the app’s purpose, business objectives, target users, and functional requirements. This stage builds the foundation for smart product and technical decisions.",
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600&auto=format&fit=crop",
      alt: "Team workshop discussing mobile app product strategy",
      deliverables: [
        "Product roadmap",
        "Feature scoping",
        "User flow planning",
        "Technical direction",
      ],
    },
    {
      id: 2,
      eyebrow: "UX & UI",
      title: "We design user journeys that feel intuitive on every screen",
      description:
        "We create mobile-first flows, screen hierarchies, and interaction patterns that make the app feel simple, efficient, and visually aligned with the product vision.",
      image:
        "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=1600&auto=format&fit=crop",
      alt: "Designer working on mobile app wireframes and UI screens",
      deliverables: [
        "Wireframes",
        "Mobile UI design",
        "Design system setup",
        "Prototype flows",
      ],
    },
    {
      id: 3,
      eyebrow: "Development",
      title: "We build performant applications with clean architecture",
      description:
        "We develop scalable mobile applications using maintainable code structure, robust state handling, and efficient integrations so the product stays fast and stable as it grows.",
      image:
        "https://images.unsplash.com/photo-1516321165247-4aa89a48be28?q=80&w=1600&auto=format&fit=crop",
      alt: "Developer building a mobile app in a modern coding workspace",
      deliverables: [
        "Reusable architecture",
        "API integration",
        "State management",
        "Performance optimization",
      ],
    },
    {
      id: 4,
      eyebrow: "Testing",
      title: "We validate usability, reliability, and device consistency",
      description:
        "Before release, we test the app across devices, screen sizes, and user scenarios to make sure the experience is smooth, stable, and production-ready.",
      image:
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1600&auto=format&fit=crop",
      alt: "Team reviewing mobile app testing across multiple devices",
      deliverables: [
        "Device testing",
        "Bug fixing",
        "Usability review",
        "Performance checks",
      ],
    },
    {
      id: 5,
      eyebrow: "Launch",
      title: "We prepare the app for release, analytics, and future growth",
      description:
        "We support release preparation, store readiness, monitoring, and post-launch iteration so the app is positioned for long-term improvement and user adoption.",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop",
      alt: "Analytics dashboard showing app growth and engagement metrics",
      deliverables: [
        "Release readiness",
        "Analytics setup",
        "Monitoring support",
        "Post-launch iteration",
      ],
    },
  ],
  techTitle: "Built for usability, performance, and scale",
  techDescription:
    "We focus on technical decisions that improve speed, maintainability, and user experience so the app remains easier to evolve and stronger in production.",
  techItems: [
    {
      id: 1,
      name: "Mobile-First UX",
      description:
        "Experiences designed around touch, clarity, and fast task completion across small screens.",
    },
    {
      id: 2,
      name: "Scalable App Architecture",
      description:
        "Clean code structure and reusable systems that support long-term product growth.",
    },
    {
      id: 3,
      name: "API & Backend Integration",
      description:
        "Reliable connectivity between the app, backend services, and third-party systems.",
    },
    {
      id: 4,
      name: "Performance Optimization",
      description:
        "Efficient rendering, smooth interactions, and responsive behavior across devices.",
    },
  ],
};