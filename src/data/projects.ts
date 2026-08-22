import { ProjectDetail, ProjectSummary } from "@/types/project";

export const projects: ProjectDetail[] = [
  {
    id: "1",
    slug: "orion-satellite-systems",
    title: "Orion Orbital Alpha",
    subtitle: "Aerospace Interface & Identity Design",
    ctaLabel: "View Case Study",
    href: "/projects/orion-satellite-systems",
    coverImage:
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1200&auto=format&fit=crop",
    coverAlt: "Satellite orbiting earth with high-tech solar panels",
    heroImage:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
    introImage:
      "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=1200&auto=format&fit=crop",
    metric: {
      value: "99.9%",
      label: "Uptime Precision",
    },
    tags: [
      "Systems Design",
      "Aerospace",
      "Data Visualization",
      "Product Design",
    ],
    accent: "dark",
    size: "feature",
    category: "Industrial Tech",
    year: "2026",
    description:
      "A comprehensive design system for next-generation satellite monitoring and orbital logistics.",
    intro:
      "Orion is a sophisticated aerospace project focused on creating a seamless bridge between complex orbital telemetry and human-centric control interfaces.",
    overview:
      "The mission was to translate massive streams of astronomical data into an intuitive, high-performance visual dashboard for ground control operators.",
    solution:
      "We engineered a high-contrast UI kit optimized for low-light environments, featuring custom SVG telemetry icons and a real-time 3D orbital mapping engine.",
    outcome:
      "The system reduced operator response times by 30% and established a new visual benchmark for private space exploration ventures.",
    quote: {
      text: "Designing for space requires a balance of extreme technical rigor and absolute visual clarity. Orion achieved both.",
      author: "Dr. Sarah Chen",
      role: "Head of Mission Control",
    },
    gallery: [
      "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1464851707681-f9d5fdaccea8?q=80&w=1200&auto=format&fit=crop",
      "https://i.pinimg.com/736x/f3/d5/04/f3d504893f14961f1affd8f9b0280365.jpg",
      "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=1200&auto=format&fit=crop",
    ],
    marqueeGallery: [
      {
        id: "orion-marquee-1",
        image:
          "https://i.pinimg.com/736x/15/f4/1b/15f41b865a7f4747197044aff399b6fd.jpg",
        alt: "Rocket launch long exposure",
        width: "sm",
      },
      {
        id: "orion-marquee-2",
        image:
          "https://i.pinimg.com/1200x/9d/1b/00/9d1b005198b7f39c5c55480b5567d296.jpg",
        alt: "Deep space telescope nebula imagery",
        width: "lg",
      },
      {
        id: "orion-marquee-3",
        image:
          "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1200&auto=format&fit=crop",
        alt: "Engineer working on satellite hardware",
        width: "md",
      },
      {
        id: "orion-marquee-4",
        image:
          "https://i.pinimg.com/736x/e0/75/09/e075097824ecd48c77ea657ad3c076c3.jpg",
        alt: "View of earth from the space station",
        width: "lg",
      },
    ],
    infoRows: [
      { label: "Client", value: "Nova Aerospace" },
      { label: "Launch Date", value: "Q2 2026" },
      { label: "Role", value: "Lead Product Designer" },
      { label: "Duration", value: "8 Months" },
    ],
    relatedProjectSlugs: [
      "abyssal-research-lab",      // Match: Science/Dark UI
      "helios-solar-infrastructure", // Match: Infrastructure/Dark UI
      "apex-electric-supercar",    // Match: High-tech
    ],
  },
  {
    id: "2",
    slug: "apex-electric-supercar",
    title: "Apex E-Type Concept",
    subtitle: "Automotive UX & Performance Branding",
    ctaLabel: "View Engineering",
    href: "/projects/apex-electric-supercar",
    coverImage:
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200&auto=format&fit=crop",
    coverAlt: "Sleek matte black electric supercar in a minimalist studio",
    heroImage:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
    introImage:
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=1200&auto=format&fit=crop",
    metric: {
      value: "1.9s",
      label: "0-60 MPH Acceleration",
    },
    tags: [
      "Automotive Design",
      "HMI Design",
      "Motion Graphics",
      "Industrial Design",
    ],
    accent: "light",
    size: "feature",
    category: "Mobility",
    year: "2026",
    description:
      "A digital-first approach to the next generation of electric performance vehicles, focusing on the synergy between driver and machine.",
    intro:
      "The Apex E-Type is a benchmark project in sustainable speed, combining a revolutionary battery cooling system with an immersive digital cockpit.",
    overview:
      "Our goal was to design a Human-Machine Interface (HMI) that remains legible at high G-forces while maintaining a luxurious, avant-garde aesthetic.",
    solution:
      "We developed a heads-up display (HUD) focused on peripheral vision data and a physical-digital hybrid console using haptic glass surfaces.",
    outcome:
      "The prototype broke three track records for EV efficiency and was awarded 'Concept of the Year' at the International Auto Expo.",
    quote: {
      text: "We didn't just design a car; we designed a high-speed sensory experience that feels like an extension of the driver.",
      author: "Julian Thorne",
      role: "Design Director",
    },
    gallery: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop",
      "https://i.pinimg.com/736x/8c/fc/de/8cfcde0d53f10e5713ee12cb2d7bbdc0.jpg",
      "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=1200&auto=format&fit=crop",
    ],
    marqueeGallery: [
      {
        id: "apex-marquee-1",
        image:
          "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=1200&auto=format&fit=crop",
        alt: "Detail shot of forged carbon fiber wheel",
        width: "sm",
      },
      {
        id: "apex-marquee-2",
        image:
          "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1200&auto=format&fit=crop",
        alt: "Supercar cockpit with glowing digital displays",
        width: "lg",
      },
      {
        id: "apex-marquee-3",
        image:
          "https://i.pinimg.com/736x/67/81/db/6781db79521bc00b74e1096262b188ac.jpg",
        alt: "Car driving through mountain pass at dusk",
        width: "md",
      },
      {
        id: "apex-marquee-4",
        image:
          "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1200&auto=format&fit=crop",
        alt: "Aerodynamic testing in a wind tunnel",
        width: "lg",
      },
    ],
    infoRows: [
      { label: "Client", value: "Apex Motors" },
      { label: "Reveal Date", value: "Nov 2026" },
      { label: "Role", value: "HMI/UX Specialist" },
      { label: "Duration", value: "5 Months" },
    ],
    relatedProjectSlugs: [
      "orion-satellite-systems",   // Match: High-tech
      "helios-solar-infrastructure", // Match: Engineering
      "fashion-brand-identity",    // Match: Light Accent/Luxury
    ],
  },
  {
    id: "3",
    slug: "ethos-coffee-roasters",
    title: "Ethos Origin Series",
    subtitle: "Artisanal Branding & Sustainable Packaging",
    ctaLabel: "View Process",
    href: "/projects/ethos-coffee-roasters",
    coverImage:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop",
    coverAlt: "Pour over coffee being prepared in a minimalist cafe setting",
    heroImage:
      "https://i.pinimg.com/736x/20/9c/09/209c09c1596c4bff89aed61083e469a6.jpg",
    introImage:
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=1200&auto=format&fit=crop",
    metric: {
      value: "100%",
      label: "Compostable Materials",
    },
    tags: ["Packaging", "Brand Identity", "Typography", "Photography"],
    accent: "light",
    size: "standard",
    category: "Consumer Goods",
    year: "2024",
    description:
      "A sensory-driven identity for a specialty roastery focusing on transparency, origin, and the ritual of brewing.",
    intro:
      "Ethos is more than a roastery; it's a commitment to the farmers and the craft. We built an identity that feels raw, tactile, and deeply intentional.",
    overview:
      "The objective was to move away from the 'corporate coffee' look and create a visual language that felt as organic as the beans themselves.",
    solution:
      "We utilized letterpress textures, hand-stamped elements, and a biodegradable packaging system that uses UV-sensitive inks to show roast dates.",
    outcome:
      "Ethos saw a 60% increase in wholesale partnerships and successfully launched their direct-to-consumer subscription model.",
    quote: {
      text: "The branding tells the story of the soil, the sun, and the hands that picked the cherries. It's beautiful.",
      author: "Mateo Silva",
      role: "Founder",
    },
    gallery: [
      "https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1580915411954-282cb1b0d780?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1498603536246-15572faa67a6?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop",
    ],
    marqueeGallery: [
      {
        id: "ethos-marquee-1",
        image:
          "https://i.pinimg.com/1200x/bf/e8/98/bfe898fa951b19d11e7109ac58785714.jpg",
        alt: "Fresh roasted coffee beans closeup",
        width: "sm",
      },
      {
        id: "ethos-marquee-2",
        image:
          "https://i.pinimg.com/1200x/6d/66/da/6d66da0f6e6ee8083d0011c02830a3c8.jpg",
        alt: "Cafe interior with warm wood and plants",
        width: "lg",
      },
      {
        id: "ethos-marquee-3",
        image:
          "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=1200&auto=format&fit=crop",
        alt: "Branded coffee bag on a marble counter",
        width: "md",
      },
      {
        id: "ethos-marquee-4",
        image:
          "https://i.pinimg.com/736x/72/43/9a/72439afc8ccbd14cbab3957121fcf15f.jpg",
        alt: "Steaming cup of black coffee",
        width: "lg",
      },
    ],
    infoRows: [
      { label: "Client", value: "Ethos Roasters" },
      { label: "Release Date", value: "Feb 2024" },
      { label: "Role", value: "Art Director" },
      { label: "Duration", value: "10 Weeks" },
    ],
    relatedProjectSlugs: [
      "lumina-skincare-systems",   // Match: Lifestyle/Packaging
      "fashion-brand-identity",    // Match: Brand Identity
      "apex-electric-supercar",    // Match: Light Accent
    ],
  },
  {
    id: "4",
    slug: "abyssal-research-lab",
    title: "Abyssal Discovery",
    subtitle: "Deep-Sea Submersible UI & Branding",
    ctaLabel: "Enter the Deep",
    href: "/projects/abyssal-research-lab",
    coverImage:
      "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=1200&auto=format&fit=crop",
    coverAlt: "Autonomous underwater vehicle exploring a dark coral reef",
    heroImage:
      "https://images.unsplash.com/photo-1551244072-5d12893278ab?q=80&w=1200&auto=format&fit=crop",
    introImage:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop",
    metric: {
      value: "11,000m",
      label: "Depth Certification",
    },
    tags: ["Scientific Design", "Hardware UI", "Identity Systems", "Data Viz"],
    accent: "dark",
    size: "feature",
    category: "Science & Tech",
    year: "2025",
    description:
      "Creating the visual and operational interface for the world's most advanced autonomous deep-sea research fleet.",
    intro:
      "Abyssal is a marine technology firm uncovering the secrets of the Hadal zone. We designed their brand to reflect resilience under extreme pressure.",
    overview:
      "The project required a UI that could handle low-bandwidth data transmission from two miles below the surface while remaining readable in high-stress environments.",
    solution:
      "We developed 'Sonar-UI', a monochromatic, high-contrast interface that uses sound-wave visualization and haptic feedback for pilot navigation.",
    outcome:
      "The interface was used during the 2025 Mariana Trench expedition, resulting in the discovery of 14 new marine species.",
    quote: {
      text: "The software feels as robust as the titanium hull. It is the clearest window we've ever had into the abyss.",
      author: "Dr. Aris Thorne",
      role: "Lead Oceanographer",
    },
    gallery: [
      "https://i.pinimg.com/736x/16/58/eb/1658eb08d3da29dab9fbed86d8a0bf48.jpg",
      "https://i.pinimg.com/1200x/ff/ac/58/ffac585329535c89f2be7cf60f91deb1.jpg",
      "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502790671504-542ad42d5189?q=80&w=1200&auto=format&fit=crop",
    ],
    marqueeGallery: [
      {
        id: "abyssal-marquee-1",
        image:
          "https://images.unsplash.com/photo-1574786198875-49f5d09fe2d2?q=80&w=1200&auto=format&fit=crop",
        alt: "Bioluminescent jellyfish in deep water",
        width: "sm",
      },
      {
        id: "abyssal-marquee-2",
        image:
          "https://i.pinimg.com/736x/9b/40/c2/9b40c2454c68b8186619c7bf81412402.jpg",
        alt: "Modern research vessel at sea during sunset",
        width: "lg",
      },
      {
        id: "abyssal-marquee-3",
        image:
          "https://i.pinimg.com/1200x/65/9f/ae/659fae77332ad68133eee0ddb5a3664f.jpg",
        alt: "Close up of waterproof electronics and sensors",
        width: "md",
      },
      {
        id: "abyssal-marquee-4",
        image:
          "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?q=80&w=1200&auto=format&fit=crop",
        alt: "The surface of the ocean from below",
        width: "lg",
      },
    ],
    infoRows: [
      { label: "Client", value: "Abyssal Labs" },
      { label: "Launch Date", value: "July 2025" },
      { label: "Role", value: "Systems Designer" },
      { label: "Duration", value: "14 Months" },
    ],
    relatedProjectSlugs: [
      "orion-satellite-systems",   // Match: Systems/Dark UI
      "helios-solar-infrastructure", // Match: Tech/Dark UI
      "ethos-coffee-roasters",     // Match: Diverse portfolio choice
    ],
  },
  {
    id: "5",
    slug: "lumina-skincare-systems",
    title: "Lumina Bio-Cell",
    subtitle: "Sustainable Beauty Identity & Digital Experience",
    ctaLabel: "View Brand Book",
    href: "/projects/lumina-skincare-systems",
    coverImage:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1200&auto=format&fit=crop",
    coverAlt: "Minimalist glass skincare bottles on a neutral stone surface",
    heroImage:
      "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=1200&auto=format&fit=crop",
    introImage:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1200&auto=format&fit=crop",
    metric: {
      value: "Zero",
      label: "Plastic Waste",
    },
    tags: ["Brand Strategy", "Packaging", "E-Commerce", "Art Direction"],
    accent: "light",
    size: "standard",
    category: "Health & Beauty",
    year: "2024",
    description:
      "A luxury skincare brand focusing on lab-grown botanical ingredients and circular packaging solutions.",
    intro:
      "Lumina bridges the gap between high-science dermatology and organic purity. The identity focuses on transparency, utilizing light-refracting textures and a soft, clinical palette.",
    overview:
      "We needed to create a premium feel that didn't rely on traditional luxury tropes of excess, focusing instead on material innovation and shelf-presence.",
    solution:
      "The design system uses high-contrast serif typography paired with macro-photography of plant cells, emphasizing the 'bio' in bio-beauty.",
    outcome:
      "Lumina launched in 12 global markets and received the 'Sustainable Design of the Year' award in the cosmetics category.",
    quote: {
      text: "We wanted the brand to feel like a deep breath—calm, clear, and essential.",
      author: "Sofia Veras",
      role: "Creative Director",
    },
    gallery: [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1200&auto=format&fit=crop",
    ],
    marqueeGallery: [
      {
        id: "lumina-marquee-1",
        image:
          "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1200&auto=format&fit=crop",
        alt: "Texture of white cream on a glass plate",
        width: "sm",
      },
      {
        id: "lumina-marquee-2",
        image:
          "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=1200&auto=format&fit=crop",
        alt: "Model with glowing skin in natural sunlight",
        width: "lg",
      },
      {
        id: "lumina-marquee-3",
        image:
          "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1200&auto=format&fit=crop",
        alt: "Recycled aluminum pump mechanism detail",
        width: "md",
      },
      {
        id: "lumina-marquee-4",
        image:
          "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1200&auto=format&fit=crop",
        alt: "Abstract lighting reflecting through glass",
        width: "lg",
      },
    ],
    infoRows: [
      { label: "Client", value: "Lumina Labs" },
      { label: "Release Date", value: "May 2024" },
      { label: "Role", value: "Lead Designer" },
      { label: "Duration", value: "4 Months" },
    ],
    relatedProjectSlugs: [
      "wellness-retreat-digital",
      "organic-cotton-textiles",
      "mineral-infusion-branding",
    ],
  },
  {
    id: "6",
    slug: "fashion-brand-identity",
    title: "Nebula Fashion Identity",
    subtitle: "Fashion Brand Identity Design",
    ctaLabel: "View Demo",
    href: "/projects/fashion-brand-identity",
    coverImage:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop",
    coverAlt: "High-fashion editorial model in avant-garde draped clothing",
    heroImage:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop",
    introImage:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop",
    metric: {
      value: "10x",
      label: "Brand Recall",
    },
    tags: ["Brand Design", "Editorial", "Identity Systems", "UI/UX"],
    accent: "light",
    size: "feature",
    category: "Brand Design",
    year: "2024",
    description:
      "A modern fashion brand identity project blending expressive visual language with contemporary digital presentation.",
    intro:
      "Nebula is a comprehensive fashion identity project designed to create a bold, distinctive, and highly expressive brand system.",
    overview:
      "The work focused on balancing artistic direction with clarity across editorial layouts, identity components, and digital brand touchpoints.",
    solution:
      "We developed a cohesive typography system, art direction language, and content presentation approach that translated smoothly across digital surfaces.",
    outcome:
      "The final identity elevated recognition, strengthened emotional connection, and positioned the brand with a sharper premium presence.",
    quote: {
      text: "This visual system gave the brand a distinct point of view and a much stronger digital identity.",
      author: "Marco Rivera",
      role: "Creative Lead",
    },
    gallery: [
      "https://i.pinimg.com/1200x/7e/aa/08/7eaa08f0037b4a0eebb1ca63efcede34.jpg",
      "https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605106702734-205df224ecce?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1581338834647-b0fb40704e21?q=80&w=1200&auto=format&fit=crop",
    ],
    marqueeGallery: [
      {
        id: "nebula-marquee-1",
        image:
          "https://i.pinimg.com/1200x/7e/aa/08/7eaa08f0037b4a0eebb1ca63efcede34.jpg",
        alt: "Editorial fashion walking scene in urban environment",
        width: "sm",
      },
      {
        id: "nebula-marquee-2",
        image:
          "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200&auto=format&fit=crop",
        alt: "Studio fashion portrait with minimalist styling",
        width: "lg",
      },
      {
        id: "nebula-marquee-3",
        image:
          "https://images.unsplash.com/photo-1583209814683-c023dd293cc6?q=80&w=1200&auto=format&fit=crop",
        alt: "Luxury minimalist packaging detail",
        width: "md",
      },
      {
        id: "nebula-marquee-4",
        image:
          "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop",
        alt: "High-end fashion editorial layout preview",
        width: "lg",
      },
    ],
    infoRows: [
      { label: "Client", value: "Nebula Labs" },
      { label: "Release Date", value: "2024" },
      { label: "Role", value: "UI/UX Designer" },
      { label: "Duration", value: "6 Weeks" },
    ],
    relatedProjectSlugs: [
      "lumina-skincare-systems",   // Match: Brand/Beauty
      "ethos-coffee-roasters",     // Match: Identity/Typography
      "apex-electric-supercar",    // Match: Luxury/Performance
    ],
  },
  {
    id: "7",
    slug: "helios-solar-infrastructure",
    title: "Helios Smart Grid",
    subtitle: "Clean Energy Monitoring & Brand Identity",
    ctaLabel: "Analyze Performance",
    href: "/projects/helios-solar-infrastructure",
    coverImage:
      "https://images.unsplash.com/photo-1509391366360-fe5bb58583bb?q=80&w=1200&auto=format&fit=crop",
    coverAlt: "Sunset reflecting off a vast field of blue solar panels",
    heroImage:
      "https://images.unsplash.com/photo-1466611653911-95282ee3956b?q=80&w=1200&auto=format&fit=crop",
    introImage:
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=1200&auto=format&fit=crop",
    metric: {
      value: "1.2GW",
      label: "Power Capacity",
    },
    tags: ["UI/UX", "Environmental Branding", "Dashboards", "Iconography"],
    accent: "dark",
    size: "feature",
    category: "Infrastructure",
    year: "2026",
    description:
      "A digital transformation project for large-scale solar farms, focused on real-time efficiency tracking and grid management.",
    intro:
      "Helios is at the forefront of the renewable transition. We designed their mission control interface to make complex energy distribution data instantly actionable for grid engineers.",
    overview:
      "The challenge was creating a visual system that works across massive wall-mounted displays and mobile field-tablets without losing information density.",
    solution:
      "We utilized a neon-on-slate color palette to reduce eye strain and a modular widget system that allows engineers to customize their views.",
    outcome:
      "Helios systems now manage over 15% of the regional power grid, with a 20% improvement in energy storage distribution efficiency.",
    quote: {
      text: "The new UI has fundamentally changed how our team reacts to grid fluctuations. It's the future of energy management.",
      author: "Marcus Thorne",
      role: "Operations Chief",
    },
    gallery: [
      "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1548337138-e87d889cc369?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1454165833222-38d75e7bb736?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542332213-31f87348057f?q=80&w=1200&auto=format&fit=crop",
    ],
    marqueeGallery: [
      {
        id: "helios-marquee-1",
        image:
          "https://images.unsplash.com/photo-1413882353314-73389f63b6fd?q=80&w=1200&auto=format&fit=crop",
        alt: "Wind turbines on a grassy hill during a clear day",
        width: "sm",
      },
      {
        id: "helios-marquee-2",
        image:
          "https://images.unsplash.com/photo-1592833159155-c62df1b65634?q=80&w=1200&auto=format&fit=crop",
        alt: "Modern electrical transformer and power lines",
        width: "lg",
      },
      {
        id: "helios-marquee-3",
        image:
          "https://images.unsplash.com/photo-1558449028-b53a39d100fc?q=80&w=1200&auto=format&fit=crop",
        alt: "Solar technician using a digital tablet",
        width: "md",
      },
      {
        id: "helios-marquee-4",
        image:
          "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=1200&auto=format&fit=crop",
        alt: "The sun shining brightly through solar panels",
        width: "lg",
      },
    ],
    infoRows: [
      { label: "Client", value: "Helios Energy" },
      { label: "System Live", value: "Jan 2026" },
      { label: "Role", value: "Interface Lead" },
      { label: "Duration", value: "9 Months" },
    ],
    relatedProjectSlugs: [
      "orion-satellite-systems",   // Match: Mission Control/Dark UI
      "abyssal-research-lab",      // Match: Monitoring/Data Viz
      "lumina-skincare-systems",   // Match: Sustainability
    ],
  },

  // add marqueeGallery to your other project objects as well
];

export const projectSummaries: ProjectSummary[] = projects.map(
  ({
    subtitle,
    intro,
    overview,
    solution,
    outcome,
    quote,
    heroImage,
    introImage,
    gallery,
    marqueeGallery,
    infoRows,
    relatedProjectSlugs,
    ...summary
  }) => summary,
);

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getRelatedProjects(slugs: string[]) {
  return projects.filter((project) => slugs.includes(project.slug));
}
