import { CaseStudyDetail, CaseStudySummary } from "@/types/case-study";

export const caseStudies: CaseStudyDetail[] = [
  {
    id: 1,
    slug: "scaling-a-b2b-saas-platform",
    title: "Scaling a B2B SaaS Platform for Faster Enterprise Growth",
    excerpt: "How we redesigned the product experience, improved conversion paths, and strengthened performance for an enterprise SaaS brand.",
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600&auto=format&fit=crop",
    coverAlt: "Data analytics dashboard showing growth metrics on a screen",
    category: "Development",
    industry: "SaaS",
    publishedAt: "2026-04-10",
    readTime: "6 min read",
    featured: true,
    stat: { value: "+42%", label: "Qualified Leads" },
    seoTitle: "Scaling a B2B SaaS Platform | Case Study",
    seoDescription: "Explore how a modern redesign and performance-focused frontend architecture helped accelerate enterprise SaaS growth.",
    client: "VertexFlow",
    duration: "10 Weeks",
    services: ["UI/UX Design", "Frontend Development", "SEO Optimization"],
    challenge: "The client had a strong product but an underperforming digital experience. Their website lacked a clear conversion journey, the messaging was fragmented, and performance issues were affecting both engagement and organic visibility.",
    solution: "We restructured the information architecture, introduced a cleaner conversion-focused content system, redesigned the UI, and optimized the frontend for performance, responsiveness, and SEO.",
    outcome: "The new platform improved lead quality, increased demo requests, and created a more consistent enterprise-ready brand presence.",
    heroSubtitle: "Enterprise SaaS Growth Case Study",
    intro: "This case study highlights how a design-led and performance-focused digital overhaul helped a B2B SaaS company strengthen positioning, improve user journeys, and create measurable business impact.",
    gallery: [
      "https://images.unsplash.com/photo-1551288049-bb9408428d00?q=80&w=1200&auto=format&fit=crop", // Fixed
      "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1200&auto=format&fit=crop",
    ],
    marqueeGallery: [
      { id: 101, image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop", alt: "Team workshop", size: "md" },
      { id: 102, image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop", alt: "Dashboard", size: "lg" },
      { id: 103, image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop", alt: "Meeting", size: "sm" },
      { id: 104, image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1200&auto=format&fit=crop", alt: "Designer", size: "md" },
    ],
    showcaseGallery: [
      { id: 201, image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1400&auto=format&fit=crop", alt: "Workspace", size: "lg" },
      { id: 202, image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop", alt: "Consultation", size: "sm" },
      { id: 203, image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=1200&auto=format&fit=crop", alt: "Team", size: "md" },
      { id: 204, image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1400&auto=format&fit=crop", alt: "Planning", size: "lg" },
    ],
    sections: [
      { type: "paragraph", title: "Project Overview", content: "The engagement focused on improving the client’s web presence as a growth engine." },
      { type: "bulletList", title: "Key Focus Areas", items: ["Conversion-focused structure", "Messaging clarity", "Scalable frontend", "Technical SEO"] },
      { type: "quote", quote: "The final result gave us a stronger enterprise presence.", author: "Amelia Carter", role: "Head of Marketing, VertexFlow" }
    ],
    relatedCaseStudySlugs: ["repositioning-a-fashion-brand-online", "optimizing-a-service-business-website"]
  },
  {
    id: 2,
    slug: "repositioning-a-fashion-brand-online",
    title: "Repositioning a Fashion Brand Through a Premium Digital Experience",
    excerpt: "Elevating visual storytelling and mobile-first UX for a luxury fashion label.",
    coverImage: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1600&auto=format&fit=crop",
    coverAlt: "Editorial fashion portrait",
    category: "Brand Strategy",
    industry: "Fashion",
    publishedAt: "2026-03-28",
    readTime: "5 min read",
    stat: { value: "+31%", label: "Engagement Rate" },
    seoTitle: "Fashion Brand Repositioning | Case Study",
    seoDescription: "A premium digital redesign focused on editorial storytelling and luxury user experience.",
    client: "Nebula Studio",
    duration: "8 Weeks",
    services: ["Brand Design", "UI/UX", "Web Design"],
    challenge: "The brand lacked visual impact and felt generic online, failing to match its premium physical products.",
    solution: "Created an editorial design system with high-contrast typography and fluid mobile interactions.",
    outcome: "Distinctive brand positioning and significant growth in organic social-to-site conversions.",
    heroSubtitle: "Fashion Identity & Experience",
    intro: "Translating high-fashion ambition into a digital language that feels both timeless and modern.",
    gallery: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1200&auto=format&fit=crop",
    ],
    marqueeGallery: [
      { id: 105, image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop", alt: "Modern fashion editorial", size: "md" }, // Updated
      { id: 106, image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200&auto=format&fit=crop", alt: "Luxury detail", size: "lg" },
      { id: 107, image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1200&auto=format&fit=crop", alt: "Editorial layout", size: "sm" },
      { id: 108, image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop", alt: "Fashion model posing", size: "md" }, // Updated
    ],
    showcaseGallery: [
      { id: 205, image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1400&auto=format&fit=crop", alt: "Storefront", size: "lg" },
      { id: 206, image: "https://images.unsplash.com/photo-1537832816519-689ad163238b?q=80&w=1200&auto=format&fit=crop", alt: "Accessories", size: "sm" },
      { id: 207, image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1200&auto=format&fit=crop", alt: "Clothing rack", size: "md" },
      { id: 208, image: "https://images.unsplash.com/photo-1470331901111-c96767676668?q=80&w=1400&auto=format&fit=crop", alt: "Fashion shoot", size: "lg" }, // Updated slightly to be more robust
    ],
    sections: [
      { type: "paragraph", title: "Design Direction", content: "The redesign balanced elegance and restraint using a spacious layout system." },
      { type: "bulletList", title: "What Changed", items: ["Refined typography", "Editorial composition", "Immersive product stories", "Mobile-first layouts"] }
    ],
    relatedCaseStudySlugs: ["scaling-a-b2b-saas-platform", "optimizing-a-service-business-website"]
  },
  {
    id: 3,
    slug: "optimizing-a-service-business-website",
    title: "Optimizing a Service Business Website for SEO and Conversions",
    excerpt: "Increasing visibility, trust, and lead generation for a leading professional service brand.",
    coverImage: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1600&auto=format&fit=crop",
    coverAlt: "Bright, modern office space",
    category: "SEO",
    industry: "Professional Services",
    publishedAt: "2026-02-18",
    readTime: "7 min read",
    stat: { value: "+54%", label: "Organic Traffic" },
    seoTitle: "SEO and Conversion Optimization | Case Study",
    seoDescription: "Technical SEO and UI improvements that helped a service business scale their lead generation.",
    client: "NorthPeak Advisory",
    duration: "9 Weeks",
    services: ["SEO", "Web Design", "Frontend Optimization"],
    challenge: "The site lacked search visibility and failed to convert professional interest into actual consultation requests.",
    solution: "Enhanced technical SEO and rebuilt conversion-focused landing pages with high-trust signaling.",
    outcome: "Significant increase in keyword rankings and a steady stream of qualified inbound leads.",
    heroSubtitle: "SEO & Lead Generation",
    intro: "Turning a static brochure site into a high-performing lead generation engine.",
    gallery: [
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1200&auto=format&fit=crop", // Updated
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?q=80&w=1200&auto=format&fit=crop",
    ],
    marqueeGallery: [
      { id: 109, image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop", alt: "Office meeting", size: "md" },
      { id: 110, image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop", alt: "SEO charts", size: "lg" },
      { id: 111, image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop", alt: "Team collaboration", size: "sm" }, // Updated
      { id: 112, image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1200&auto=format&fit=crop", alt: "Client presentation", size: "md" },
    ],
    showcaseGallery: [
      { id: 209, image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1400&auto=format&fit=crop", alt: "Modern building", size: "lg" },
      { id: 210, image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop", alt: "Success metrics", size: "sm" },
      { id: 211, image: "https://images.unsplash.com/photo-1600880210830-80479705886d?q=80&w=1200&auto=format&fit=crop", alt: "Advisory board", size: "md" },
      { id: 212, image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1400&auto=format&fit=crop", alt: "Workshop", size: "lg" },
    ],
    sections: [
      { type: "paragraph", title: "Strategy", content: "Aligned technical SEO with clear messaging to improve discoverability." },
      { type: "bulletList", title: "Execution Highlights", items: ["Metadata cleanup", "Page speed optimization", "CTA hierarchy", "Service page clarity"] }
    ],
    relatedCaseStudySlugs: ["scaling-a-b2b-saas-platform", "repositioning-a-fashion-brand-online"]
  },
  {
    id: 4,
    slug: "fintech-mobile-banking-interface",
    title: "Revolutionizing Personal Finance with a Human-Centric UI",
    excerpt: "Redesigning a fintech interface to simplify complex financial data for a banking startup.",
    coverImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1600&auto=format&fit=crop",
    coverAlt: "Smartphone with clean banking app",
    category: "UI/UX",
    industry: "Fintech",
    publishedAt: "2026-05-12",
    readTime: "8 min read",
    stat: { value: "85%", label: "User Retention" },
    seoTitle: "Fintech UI/UX Redesign | Digital Banking",
    seoDescription: "Human-centric UX design for a mobile banking platform focusing on clarity and retention.",
    client: "NovaBank",
    duration: "12 Weeks",
    services: ["UX Research", "Mobile UI Design", "Prototyping"],
    challenge: "The app felt overwhelming, making it hard for users to find daily transaction tools.",
    solution: "Simplified the interface using progressive disclosure and a personalized dashboard.",
    outcome: "Boosted NPS scores and drastically reduced customer support tickets.",
    heroSubtitle: "Mobile Experience & UX",
    intro: "Creating a banking experience that feels supportive and intuitive.",
    gallery: [
      "https://images.unsplash.com/photo-1614332287897-cdc485fa562d?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551288049-bb9408428d00?q=80&w=1200&auto=format&fit=crop", // Fixed
    ],
    marqueeGallery: [
      { id: 113, image: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=1200&auto=format&fit=crop", alt: "Modern banking app UI", size: "md" }, // Fixed
      { id: 114, image: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=1200&auto=format&fit=crop", alt: "Payment flow", size: "lg" },
      { id: 115, image: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=1200&auto=format&fit=crop", alt: "Mobile interface", size: "sm" },
      { id: 116, image: "https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=1200&auto=format&fit=crop", alt: "Financial data visualization", size: "md" }, // Fixed
    ],
    showcaseGallery: [
      { id: 213, image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1400&auto=format&fit=crop", alt: "Digital currency", size: "lg" },
      { id: 214, image: "https://images.unsplash.com/photo-1519337265831-281ec6cc8514?q=80&w=1200&auto=format&fit=crop", alt: "Phone mockup", size: "sm" },
      { id: 215, image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop", alt: "User dashboard", size: "md" }, // Fixed
      { id: 216, image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1400&auto=format&fit=crop", alt: "Security room", size: "lg" },
    ],
    sections: [
      { type: "paragraph", title: "Journey Mapping", content: "Focused on reducing anxiety during financial transfers through UX." },
      { type: "bulletList", title: "UX Innovations", items: ["Smart search", "Biometric security", "Saving buckets", "Dark mode"] }
    ],
    relatedCaseStudySlugs: ["scaling-a-b2b-saas-platform", "impactful-interfaces-design-systems"]
  },
  {
    id: 5,
    slug: "e-commerce-product-design-evolution",
    title: "Crafting a Modular Product System for Global E-commerce",
    excerpt:
      "Developing a scalable design system for a multi-brand retail giant.",
    coverImage:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop",
    coverAlt: "High-end retail products",
    category: "Product Design",
    industry: "Retail",
    publishedAt: "2026-06-02",
    readTime: "10 min read",
    stat: { value: "+65%", label: "Deployment Speed" },
    seoTitle: "E-commerce Product Design | Aura Global",
    seoDescription:
      "Scaling retail digital products through a modular, token-based design system.",
    client: "Aura Global",
    duration: "16 Weeks",
    services: ["Product Strategy", "Design Systems", "Component Dev"],
    challenge:
      "Fragmentation across five brand codebases caused massive design debt.",
    solution: "Built a multi-tenant design system using brand-specific tokens.",
    outcome: "Reduced time-to-market for new campaigns by 70%.",
    heroSubtitle: "Design Systems & Product",
    intro: "Scaling design across borders via a unified component library.",
    gallery: [
      "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=1200&auto=format&fit=crop",
    ],
    marqueeGallery: [
      {
        id: 117,
        image:
          "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?q=80&w=1200&auto=format&fit=crop",
        alt: "UI Components",
        size: "md",
      },
      {
        id: 118,
        image:
          "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?q=80&w=1200&auto=format&fit=crop",
        alt: "E-comm store",
        size: "lg",
      },
      {
        id: 119,
        image:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
        alt: "System tokens",
        size: "sm",
      },
      {
        id: 120,
        image:
          "https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=1200&auto=format&fit=crop",
        alt: "Shopping experience",
        size: "md",
      },
    ],
    showcaseGallery: [
      {
        id: 217,
        image:
          "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=1400&auto=format&fit=crop",
        alt: "Online shop",
        size: "lg",
      },
      {
        id: 218,
        image:
          "https://images.unsplash.com/photo-1507206130118-b5907f817163?q=80&w=1200&auto=format&fit=crop",
        alt: "Modular design",
        size: "sm",
      },
      {
        id: 219,
        image:
          "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1200&auto=format&fit=crop",
        alt: "Design team",
        size: "md",
      },
      {
        id: 220,
        image:
          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1400&auto=format&fit=crop",
        alt: "Dev meeting",
        size: "lg",
      },
    ],
    sections: [
      {
        type: "paragraph",
        title: "Atomic Design",
        content:
          "Defining atoms and molecules to ensure consistency across brands.",
      },
      {
        type: "bulletList",
        title: "Scalability Results",
        items: [
          "Unified components",
          "Automated docs",
          "Multi-brand support",
          "WCAG compliance",
        ],
      },
    ],
    relatedCaseStudySlugs: [
      "impactful-interfaces-design-systems",
      "repositioning-a-fashion-brand-online",
    ],
  },
  {
    id: 6,
    slug: "real-estate-platform-development",
    title: "Developing a High-Performance Real Estate Search Engine",
    excerpt: "Engineering a lightning-fast property portal with interactive map integration.",
    coverImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1600&auto=format&fit=crop",
    coverAlt: "Modern glass building",
    category: "Development",
    industry: "Real Estate",
    publishedAt: "2026-06-25",
    readTime: "9 min read",
    stat: { value: "< 1.2s", label: "Load Time" },
    seoTitle: "Full-Stack Dev | Real Estate Platform",
    seoDescription: "High-performance real estate platform development with SSR and advanced search integrations.",
    client: "LuxeProperties",
    duration: "14 Weeks",
    services: ["Backend Engineering", "Frontend Dev", "API Integration"],
    challenge: "The old site crashed under load and had massive search delays.",
    solution: "Built a headless architecture using server-side rendering and elastic-search.",
    outcome: "Bounce rates dropped by 45% and mobile sessions surged.",
    heroSubtitle: "Technical Architecture & Dev",
    intro: "Proving that performance is a feature that drives property inquiries.",
    gallery: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
    ],
    marqueeGallery: [
      { id: 121, image: "https://images.unsplash.com/photo-1512918766775-d56aebb309f9?q=80&w=1200&auto=format&fit=crop", alt: "Modern apartment interior", size: "md" }, // Updated
      { id: 122, image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop", alt: "House interior", size: "lg" },
      { id: 123, image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=1200&auto=format&fit=crop", alt: "Urban architectural detail", size: "sm" }, // Updated
      { id: 124, image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=1200&auto=format&fit=crop", alt: "Luxury home", size: "md" },
    ],
    showcaseGallery: [
      { id: 221, image: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=1400&auto=format&fit=crop", alt: "Suburban home", size: "lg" },
      { id: 222, image: "https://images.unsplash.com/photo-1554469384-e58fb1580453?q=80&w=1200&auto=format&fit=crop", alt: "City skyscraper office", size: "sm" },
      { id: 223, image: "https://images.unsplash.com/photo-1560184897-ae75f418493e?q=80&w=1200&auto=format&fit=crop", alt: "Living room", size: "md" },
      { id: 224, image: "https://images.unsplash.com/photo-1493397665643-c5abab07d531?q=80&w=1400&auto=format&fit=crop", alt: "Modern architectural lines", size: "lg" },
    ],
    sections: [
      { type: "paragraph", title: "Tech Stack", content: "Used Next.js and Mapbox for an instantaneous search experience." },
      { type: "bulletList", title: "Dev Wins", items: ["Map layers", "CDN delivery", "Real-time sync", "Lead dashboard"] }
    ],
    relatedCaseStudySlugs: ["optimizing-a-service-business-website", "scaling-a-b2b-saas-platform"]
  },
  {
    id: 7,
    slug: "minimalist-portfolio-web-design",
    title: "Visual Identity & Web Experience for an Architectural Firm",
    excerpt: "Designing a minimalist digital portfolio that highlights architectural scale.",
    coverImage: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=1600&auto=format&fit=crop",
    coverAlt: "Concrete architecture",
    category: "Web Design",
    industry: "Architecture",
    publishedAt: "2026-07-10",
    readTime: "4 min read",
    stat: { value: "100%", label: "Client Satisfaction" },
    seoTitle: "Minimalist Web Design | Architecture Portfolio",
    seoDescription: "Minimalist digital experience for an award-winning architectural firm.",
    client: "Form & Void",
    duration: "6 Weeks",
    services: ["Web Design", "Motion Design", "Visual Branding"],
    challenge: "The firm needed to showcase high-res photos without cluttering the interface.",
    solution: "A digital gallery approach with brutalist typography and immense whitespace.",
    outcome: "Multiple design awards and increased high-ticket project inquiries.",
    heroSubtitle: "Visual Storytelling",
    intro: "When work is this visual, design should act as a structural frame.",
    gallery: [
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?q=80&w=1200&auto=format&fit=crop",
    ],
    marqueeGallery: [
      { id: 125, image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1200&auto=format&fit=crop", alt: "Modern interior", size: "md" },
      { id: 126, image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop", alt: "Building detail", size: "lg" }, // Updated
      { id: 127, image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop", alt: "Architecture plan", size: "sm" },
      { id: 128, image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=1200&auto=format&fit=crop", alt: "Tower view", size: "md" },
    ],
    showcaseGallery: [
      { id: 225, image: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=1400&auto=format&fit=crop", alt: "Blueprint", size: "lg" },
      { id: 226, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1200&auto=format&fit=crop", alt: "Minimal desk", size: "sm" },
      { id: 227, image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200&auto=format&fit=crop", alt: "Work desk", size: "md" },
      { id: 228, image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1400&auto=format&fit=crop", alt: "Modern office", size: "lg" },
    ],
    sections: [
      { type: "paragraph", title: "Movement", content: "Used smooth scroll to mimic the feeling of walking through physical space." },
      { type: "bulletList", title: "Design Features", items: ["Custom cursor", "Immersive galleries", "Variable types", "Hidden nav"] }
    ],
    relatedCaseStudySlugs: ["repositioning-a-fashion-brand-online", "designing-digital-experiences"]
  }
];

export const caseStudySummaries: CaseStudySummary[] = caseStudies.map(
  ({
    seoTitle,
    seoDescription,
    client,
    duration,
    services,
    challenge,
    solution,
    outcome,
    heroSubtitle,
    intro,
    gallery,
    marqueeGallery,
    showcaseGallery,
    sections,
    relatedCaseStudySlugs,
    ...summary
  }) => summary,
);

export function getCaseStudyBySlug(slug: string) {
  return caseStudies.find((item) => item.slug === slug);
}

export function getRelatedCaseStudies(slugs: string[]) {
  return caseStudies.filter((item) => slugs.includes(item.slug));
}
