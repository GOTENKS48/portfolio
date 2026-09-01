// Project data
export interface Project {
  id: number
  number: string
  title: string
  subtitle: string
  category: string
  year: string
  description: string
  longDescription: string
  tech: string[]
  image: string
  link: string
}

export const projects: Project[] = [
  {
    id: 1,
    number: '01',
    title: 'Bharat Sentinel',
    subtitle: 'Threat Intelligence Platform',
    category: 'FULL-STACK',
    year: '2024',
    description: 'Real-time cyber threat intelligence platform with microservices architecture and Kafka-powered data pipelines.',
    longDescription: `A production-grade real-time threat intelligence platform built on a distributed microservices architecture. 
    Ingests and processes millions of threat events per day through an Apache Kafka pipeline with custom stream processors. 
    Backend built on Node.js microservices, containerized with Docker, orchestrated via Kubernetes. 
    Features a React dashboard with live WebSocket data feeds, geolocation threat maps, and ML-based anomaly detection.`,
    tech: ['Node.js', 'Apache Kafka', 'React', 'PostgreSQL', 'Docker', 'Redis', 'Python', 'WebSocket'],
    image: '/images/bharat-sentinel.png',
    link: '#',
  },
  {
    id: 2,
    number: '02',
    title: 'Smart Building',
    subtitle: 'IoT Data Processing System',
    category: 'IOT + BACKEND',
    year: '2024',
    description: 'IoT sensor integration platform with MQTT broker, real-time analytics dashboard, and automated control systems.',
    longDescription: `End-to-end IoT platform for intelligent building management. Integrates hundreds of physical sensors via 
    MQTT broker (Mosquitto) into a centralized Node.js data ingestion layer. Time-series data stored in InfluxDB with 
    Grafana dashboards for real-time visualization. Machine learning models predict energy consumption and trigger automated 
    HVAC/lighting adjustments, reducing energy usage by 34%.`,
    tech: ['Node.js', 'MQTT', 'InfluxDB', 'Grafana', 'Python', 'React', 'PostgreSQL', 'Docker'],
    image: '/images/smart-building.png',
    link: '#',
  },
  {
    id: 3,
    number: '03',
    title: 'Portfolio v2',
    subtitle: 'Personal Design System',
    category: 'DESIGN + DEV',
    year: '2026',
    description: 'Premium developer portfolio with scroll-driven animations, clip-path transitions, and cursor-interactive elements.',
    longDescription: `This portfolio — built as a custom design system from scratch. Features GSAP scroll-pinned horizontal 
    project carousel, Framer Motion clip-path reveal animations, cursor-tracking interactive elements, and a fully dynamic 
    design language inspired by high-end agency websites. Zero component library boilerplate.`,
    tech: ['Next.js', 'Framer Motion', 'GSAP', 'TypeScript', 'TailwindCSS'],
    image: '/images/portfolio-v2.png',
    link: '#',
  },
  {
    id: 4,
    number: '04',
    title: 'Algorithm Visualizer',
    subtitle: 'Interactive DSA Learning Tool',
    category: 'EDUCATION',
    year: '2023',
    description: 'Interactive visualization tool for sorting algorithms, graph traversals, and tree structures with step-by-step walkthroughs.',
    longDescription: `An interactive web application that visualizes classic computer science algorithms in real-time. 
    Supports 15+ sorting algorithms with adjustable speed and array size, graph traversals (BFS, DFS, Dijkstra, A*), 
    binary tree operations, and dynamic programming step-through. Built for CS students and interview preparation.`,
    tech: ['React', 'TypeScript', 'D3.js', 'Tailwind CSS', 'Framer Motion'],
    image: '/images/algo-visualizer.png',
    link: '#',
  },
  {
    id: 5,
    number: '05',
    title: 'Cloud File System',
    subtitle: 'Distributed Storage Platform',
    category: 'SYSTEMS',
    year: '2023',
    description: 'Distributed file storage system with client-side encryption, chunk-based upload, and redundant replication.',
    longDescription: `A distributed file storage system implementing core principles of cloud storage at scale. 
    Features client-side AES-256 encryption before upload, intelligent file chunking for large uploads, 
    Reed-Solomon erasure coding for data redundancy, and a consistent hashing ring for node distribution. 
    REST API with S3-compatible interface, CLI client, and React web UI.`,
    tech: ['Python', 'FastAPI', 'React', 'PostgreSQL', 'Redis', 'Docker', 'AWS S3'],
    image: '/images/cloud-fs.png',
    link: '#',
  },
]

// Skills data
export const skills = {
  languages: [
    'Python',
    'TypeScript',
    'JavaScript',
    'C++',
    'Java',
    'SQL',
    'Bash',
    'HTML / CSS',
  ],
  frameworks: [
    'React',
    'Next.js',
    'Node.js',
    'Express.js',
    'Flask',
    'FastAPI',
    'TailwindCSS',
    'Framer Motion',
    'GSAP',
  ],
  concepts: [
    'Data Structures & Algorithms',
    'System Design',
    'DBMS',
    'OOP',
    'Operating Systems',
    'Computer Networks',
    'Microservices',
    'REST / GraphQL',
  ],
}

// Services data
export const services = [
  {
    number: '01',
    title: 'Full-Stack Development',
    description:
      'End-to-end web application architecture — from RESTful APIs and microservices to cloud-native deployments. I build systems that scale reliably under production load, using Node.js, Python, PostgreSQL, Redis, and Docker.',
    tags: ['Node.js', 'React', 'PostgreSQL', 'Docker', 'REST APIs'],
  },
  {
    number: '02',
    title: 'UI / UX & Frontend',
    description:
      'Pixel-precise interfaces with deliberate motion design. I translate design intent into performant React applications with advanced animations (Framer Motion, GSAP), accessibility standards, and component architecture.',
    tags: ['React', 'Next.js', 'Framer Motion', 'GSAP', 'TypeScript'],
  },
  {
    number: '03',
    title: 'Core Optimization',
    description:
      'Algorithmic efficiency and data pipeline engineering. I diagnose bottlenecks, design optimal data structures, architect event-driven systems with Kafka, and apply system design patterns for high-throughput environments.',
    tags: ['DSA', 'Kafka', 'System Design', 'Caching', 'Performance'],
  },
]

// Social links
export const socials = {
  linkedin: 'https://linkedin.com/in/jitendra',
  github: 'https://github.com/jitendra',
  leetcode: 'https://leetcode.com/jitendra',
}
