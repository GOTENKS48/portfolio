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
  video?: string
  link: string
}

export const projects: Project[] = [
  {
    id: 1,
    number: '01',
    title: 'Ray Tracer in C++',
    subtitle: 'Computer Graphics & Rendering Engine',
    category: 'C++ / GRAPHICS',
    year: '2026',
    description: 'A custom ray tracing engine built in modern C++ with realistic lighting, shadows, reflections, and camera models.',
    longDescription: `A high-performance physically-based ray tracer implemented in modern C++. Features recursive ray-surface intersections, diffuse and specular reflection shading models, antialiasing, depth of field camera simulations, and multi-threaded rendering optimizations.`,
    tech: ['C++', 'Graphics Programming', 'Multithreading', 'Linear Algebra', 'CMake'],
    image: '/images/project-1.jpg',
    video: 'https://res.cloudinary.com/buydgbex/video/upload/v1789498582/Recording_2026-09-15_232605.mp4',
    link: 'https://github.com/GOTENKS48/RayTracer',
  },
  {
    id: 2,
    number: '02',
    title: 'Blogging Website',
    subtitle: 'Full-Stack Publishing Platform',
    category: 'MERN + REST APIs',
    year: '2024',
    description: 'Dynamic blogging and article publishing platform featuring rich content editing, user authentication, and responsive reading experience.',
    longDescription: `A comprehensive full-stack publishing web application built with modern web technologies. Supports rich markdown authoring, secure user authentication and session management, tagging, responsive layout, and robust API endpoints for fast content retrieval.`,
    tech: ['Node.js', 'Express.js', 'React', 'MongoDB', 'REST APIs', 'TailwindCSS'],
    image: '/images/project-2.jpg',
    video: 'https://res.cloudinary.com/buydgbex/video/upload/v1789498789/Recording_2026-09-15_231310_2.mp4',
    link: 'https://github.com/GOTENKS48/Blog-Website',
  },
  {
    id: 3,
    number: '03',
    title: 'Portfolio',
    subtitle: 'Personal Interactive Design System',
    category: 'DESIGN + DEV',
    year: '2026',
    description: 'Premium developer portfolio featuring smooth scroll-driven mechanics, GSAP reel animations, and refined typography.',
    longDescription: `Custom portfolio built from scratch focusing on high-end creative web design. Features GSAP scroll synchronization, letter masking variants, scramble text mechanics, audio interaction feedback, and square demo video presentation.`,
    tech: ['Next.js', 'TypeScript', 'GSAP', 'Framer Motion', 'TailwindCSS'],
    image: '/images/project-3.jpg',
    video: 'https://res.cloudinary.com/buydgbex/video/upload/v1789498533/Desktop_2026.09.15_-_22.08.51.03_2_online-video-cutter.com.mp4',
    link: 'https://github.com/GOTENKS48/portfolio',
  },
  {
    id: 4,
    number: '04',
    title: 'Heart Disease Prediction',
    subtitle: 'Machine Learning Diagnostic Tool',
    category: 'ML / HEALTHCARE',
    year: '2023',
    description: 'Predictive health analytics tool utilizing machine learning models to assess heart disease risk from clinical metrics.',
    longDescription: `An end-to-end healthcare machine learning application trained on cardiovascular patient data. Evaluates multiple classification models (Random Forest, Logistic Regression, XGBoost) to achieve high sensitivity and precision, with an interactive web UI for risk probability scoring.`,
    tech: ['Python', 'Scikit-Learn', 'Pandas', 'NumPy', 'Flask', 'Machine Learning'],
    image: '/images/project-4.jpg',
    video: 'https://res.cloudinary.com/buydgbex/video/upload/v1789498537/Desktop_2026.09.15_-_21.56.23.01_2_online-video-cutter.com.mp4',
    link: 'https://github.com/GOTENKS48/heart-disease-prediction',
  },
  {
    id: 5,
    number: '05',
    title: 'Weather App',
    subtitle: 'Live Meteorological Forecast Web App',
    category: 'Python + API Integration',
    year: '2022',
    description: 'Responsive weather application providing real-time forecasts, atmospheric conditions, and location-based meteorological metrics.',
    longDescription: `Interactive weather application consuming live third-party meteorological APIs to deliver temperature, wind speed, humidity, and multi-day forecasting with dynamic condition-based background visual styling.`,
    tech: ['Python', 'Weather API', 'REST APIs', 'HTML5', 'CSS3'],
    image: '/images/project-5.jpg',
    video: 'https://res.cloudinary.com/buydgbex/video/upload/v1789498535/Recording_2026-09-15_224056.mp4',
    link: 'https://github.com/GOTENKS48/Weather_app',
  },
]

// Skills data
export const skills = {
  languages: [
    'Python',
    'TypeScript',
    'JavaScript',
    'C++',
    'SQL',
    'Git',
    'Firebase',
    'HTML / CSS',
  ],
  frameworks: [
    'React',
    'Node.js',
    'Express.js',
    'Flask',
    'REST APIs',
    'TailwindCSS',
  ],
  concepts: [
    'Data Structures & Algorithms',
    'System Design',
    'DBMS',
    'OOP',
    'Operating Systems',
  ],
}

// Services data
export const services = [
  {
    number: '01',
    title: 'Full-Stack Development',
    description:
      'From frontend interactions to backend APIs, I build complete web solutions. I work with modern stacks to deliver apps that are scalable, maintainable, and ready for real-world users.',
    tags: ['Node.js', 'React', 'PostgreSQL', 'Docker', 'REST APIs'],
  },
  {
    number: '02',
    title: 'Competitive Programming',
    description:
      'I enjoy tackling challenging algorithmic problems and competing in programming contests. Competitive programming has strengthened my problem-solving skills, algorithmic thinking, and ability to write efficient code under pressure.',
    tags: ['Algorithms', 'Data Structures', 'CodeChef', 'Codeforces', 'C++'],
  },
  {
    number: '03',
    title: 'Optimization',
    description:
      'I focus on building systems that stay reliable as things scale. From handling data efficiently to designing clean architecture, I apply core computer science principles to keep applications fast, stable, and future-ready.',
    tags: ['DSA', 'Kafka', 'System Design', 'Caching', 'Performance'],
  },
]

// Social links
export const socials = {
  linkedin: 'http://www.linkedin.com/in/jitendra-singh4824/',
  github: 'https://github.com/GOTENKS48',
  leetcode: 'https://leetcode.com/u/Jitendra48/',
  codeforces: 'https://codeforces.com/profile/Jitendra48',
  codechef: 'https://www.codechef.com/users/jitendra48',
  email: 'jeetu.singh4824@gmail.com',
}
