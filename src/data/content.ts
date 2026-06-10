// ============================================================
// Site content — single source of truth.
// Edit here; components render from these structures.
// ============================================================

export const site = {
  name: 'Valentin Moyse',
  role: 'Ingénieur Systèmes & Réseaux',
  tagline: 'Infrastructure · Cybersécurité · Réseaux',
  location: 'La Rochelle, France',
  email: 'valentin-moyse@outlook.fr',
  linkedin: 'https://www.linkedin.com/in/valentin-moyse/',
  github: 'https://github.com/Vxlentin1',
  // Geographic coordinates of La Rochelle — used as a blueprint annotation
  coords: '46.16°N · 1.15°W',
};

export const nav = [
  { id: 'about', label: 'À propos', n: '01' },
  { id: 'experience', label: 'Expériences', n: '02' },
  { id: 'education', label: 'Formation', n: '03' },
  { id: 'skills', label: 'Compétences', n: '04' },
  { id: 'certifications', label: 'Certifications', n: '05' },
  { id: 'cybersec', label: 'Cybersécurité', n: '06' },
  { id: 'projects', label: 'Projets', n: '07' },
  { id: 'contact', label: 'Contact', n: '08' },
];

// Rotating one-word descriptors shown in the hero (erase + retype effect)
export const roles = [
  'Infra',
  'Systèmes',
  'Réseaux',
  'Sécurité',
  'Pare-feu',
  'Audit',
];

export const about = {
  paragraphs: [
    "Passionné d'informatique depuis mon plus jeune âge, j'ai développé un vif intérêt pour tout ce qui touche aux <strong>réseaux</strong>, à la <strong>sécurité</strong>, à l'<strong>IA</strong> et surtout à la <strong>cybersécurité</strong>.",
    "Actuellement en alternance chez <strong>Koesio</strong>, n°1 des services numériques pour les PME et collectivités, je prépare un <strong>Mastère Manager en Infrastructures et Cybersécurité des SI</strong> (Bac+5) au CESI.",
    "Sportif dans l'âme (vélo, course à pied et trail) j'aime les défis et me fixer des objectifs pour les atteindre en développant de nouvelles compétences chaque jour.",
  ],
  stats: [
    { value: 3, suffix: '+', label: "Années d'expérience IT" },
    { value: 9, suffix: '+', label: 'Certifications' },
    { value: 30, suffix: '+', label: 'Technologies maîtrisées' },
    { value: 3, suffix: '', label: 'Diplômes obtenus & en cours' },
  ],
};

export interface Experience {
  role: string;
  company: string;
  type: string;
  location?: string;
  dateRange: string;
  duration: string;
  desc?: string;
  bullets?: string[];
  tags: string[];
  minor?: boolean;
}

export const experiences: Experience[] = [
  {
    role: 'Ingénieur Systèmes & Réseaux',
    company: 'Koesio',
    type: 'Alternance',
    location: 'Périgny',
    dateRange: 'Sept. 2025 — Présent',
    duration: '6 mois',
    desc: "N°1 des services numériques des PME et collectivités — mission en cours dans le cadre du Mastère MICSI.",
    tags: ['Infrastructure', 'Cybersécurité', 'Réseaux'],
  },
  {
    role: 'Administrateur Systèmes & Réseaux',
    company: 'TDI Services',
    type: 'Alternance',
    location: 'Aytré',
    dateRange: 'Sept. 2024 — Présent',
    duration: '1 an 6 mois',
    bullets: [
      "Migration & renouvellement d'infrastructure (serveur, switch, NAS, pare-feu, Wi-Fi)",
      'Segmentation des flux par VLAN et sécurisation (IDS/IPS, Geo-IP, App Control)',
      'Configuration de pare-feu (SonicWall, Sophos, Stormshield)',
      'Configuration de switch (Aruba, D-Link) et bornes Wi-Fi (Cambium Networks)',
      "Scripts d'automatisation PowerShell (AD, récupération d'informations)",
      'Gestion et optimisation de GPO (GPOZaurr, CleanUpMonster)',
      'Sécurisation Active Directory (PingCastle & PurpleKnight)',
      'Sécurisation tenant Microsoft (accès conditionnel, MFA)',
      'Veille technologique & POC Docker & Linux',
      'Support client incidents N2 & gestion de projets techniques',
    ],
    tags: ['Active Directory', 'Hyper-V', 'SonicWall', 'Sophos', 'Stormshield', 'PowerShell', 'VLAN', 'GPO'],
  },
  {
    role: 'Technicien Support Informatique',
    company: 'CGR Cinémas',
    type: 'Alternance',
    location: 'Périgny',
    dateRange: 'Sept. 2022 — Sept. 2024',
    duration: '2 ans 1 mois',
    bullets: [
      'Ticketing GLPI & support aux utilisateurs internes',
      'Gestion du renouvellement du parc informatique',
      'Tests de nouvelles solutions sur Docker / Linux',
      'Lab Proxmox pour environnements de test',
      'Déploiement de postes de vente (caisse, borne, TPE, imprimante)',
      'Mise en place d\'une solution de déploiement (Clonezilla)',
      'Gestion Active Directory & support pare-feu Zyxel',
      'Documentation et guides techniques',
    ],
    tags: ['GLPI', 'Docker', 'Linux', 'Proxmox', 'Clonezilla', 'Zyxel'],
  },
  {
    role: 'Animateur Sportif',
    company: 'Center Parcs — Le Bois aux Daims',
    type: 'CDD',
    dateRange: 'Juil. — Août 2022',
    duration: '2 mois',
    desc: 'Animation d\'activités en plein air : paintball, escalade, accrobranche, paddle, segway…',
    tags: ['Animation', 'Sport', "Travail d'équipe"],
    minor: true,
  },
];

export interface Education {
  degree: string;
  abbr?: string;
  school: string;
  level: string;
  dates: string;
  grade?: string;
  status: 'current' | 'done';
  tags: string[];
}

export const education: Education[] = [
  {
    degree: 'Mastère Manager en Infrastructures et Cybersécurité des SI',
    abbr: 'MICSI',
    school: 'CESI — Ingénierie informatique',
    level: 'Bac+5',
    dates: 'Oct. 2025 — Oct. 2027',
    status: 'current',
    tags: ['Active Directory', 'Infrastructure réseau', 'Sécurité', 'Gestion de projet', 'Migration de systèmes'],
  },
  {
    degree: 'Bachelor Administrateur Systèmes & Réseaux',
    abbr: 'ASR',
    school: 'CESI — Informatique',
    level: 'Bac+3',
    dates: 'Sept. 2024 — Sept. 2025',
    grade: 'Niveau A',
    status: 'done',
    tags: ['Migration de systèmes', 'Préconisation technique', 'Déploiement', 'Pare-feu', 'Sécurisation de flux'],
  },
  {
    degree: 'Gestionnaire Maintenance et Support Informatique',
    abbr: 'GMSI',
    school: 'CESI — Informatique',
    level: 'Bac+2',
    dates: 'Sept. 2022 — Sept. 2024',
    grade: 'Niveau A',
    status: 'done',
    tags: ['Windows', 'Linux', 'Matériel informatique', 'Réseaux', 'Support technique'],
  },
];

export interface SkillGroup {
  id: string;
  title: string;
  items: string[];
}

export const skills: SkillGroup[] = [
  {
    id: 'net',
    title: 'Réseaux & Infrastructure',
    items: ['Active Directory', 'VLAN', 'Routage', 'IPv4', 'Haute disponibilité', 'Infrastructure réseau', 'Dépannage réseau', 'GPO', 'DNS / DHCP', 'Hyper-V'],
  },
  {
    id: 'sec',
    title: 'Sécurité & Cybersécurité',
    items: ['Sécurisation de flux', 'IDS / IPS', 'Sécurité réseau', 'Cybersécurité', 'MFA / Accès conditionnel', 'PingCastle', 'PurpleKnight', 'Reconnaissance', 'Énumération'],
  },
  {
    id: 'fw',
    title: 'Pare-feu & Équipements',
    items: ['SonicWall', 'Sophos', 'Stormshield', 'Zyxel', 'Fortinet', 'Aruba', 'D-Link', 'Cambium Networks', 'Cisco IOS'],
  },
  {
    id: 'sys',
    title: 'Systèmes & Outils',
    items: ['Windows Server', 'Linux', 'PowerShell', 'Docker', 'Proxmox', 'GLPI', 'Clonezilla', 'Terraform', 'Vagrant'],
  },
];

export interface Cert {
  name: string;
  issuer: string;
  date: string;
  logo?: string; // path under /assets/logos or null for monogram
  tags?: string[];
}

export const certifications: Cert[] = [
  { name: 'Pre-Security', issuer: 'TryHackMe', date: 'Mai 2026', logo: '/assets/logos/tryhackme.svg', tags: ['Cybersécurité', 'Fondamentaux', 'CTF'] },
  { name: 'Fortinet Certified Associate in Cybersecurity', issuer: 'Fortinet', date: 'Mars 2026 — Mars 2028', logo: '/assets/logos/fortinet.svg', tags: ['Cybersécurité', 'Fortinet'] },
  { name: 'CCNA: Switching, Routing, and Wireless Essentials', issuer: 'Cisco Networking Academy', date: 'Février 2026', logo: '/assets/logos/cisco.svg', tags: ['Haute disponibilité', 'Cisco IOS', 'Wireless'] },
  { name: 'Ethical Hacker', issuer: 'Cisco', date: 'Janvier 2026', logo: '/assets/logos/cisco.svg', tags: ['Sécurité réseau', 'Reconnaissance', 'Cybersécurité'] },
  { name: 'Network Technician Career Path', issuer: 'Cisco Networking Academy', date: 'Janvier 2026', logo: '/assets/logos/cisco.svg', tags: ['IPv4', 'Réseaux', 'Dépannage'] },
  { name: 'Certification Technique Secuserve', issuer: 'Secuserve', date: 'Décembre 2025', tags: ['Anti-spam', 'Domaine'] },
  { name: 'CCNA 1 : Introduction to Networks', issuer: 'Cisco Networking Academy', date: 'Juillet 2025', logo: '/assets/logos/cisco.svg' },
  { name: 'Fortinet Certified Fundamentals in Cybersecurity', issuer: 'Fortinet', date: 'Juillet 2025 — Juillet 2027', logo: '/assets/logos/fortinet.svg' },
  { name: 'MOOC — SecNumAcadémie', issuer: 'ANSSI', date: 'Mars 2023' },
];

export interface Project {
  name: string;
  date: string;
  desc: string;
  tags: string[];
  href: string;
  context: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    name: 'RGUI',
    date: 'Décembre 2025',
    desc: "Interface graphique pour la commande Windows Robocopy, facilitant la configuration et l'exécution de tâches de synchronisation et de sauvegarde de fichiers.",
    tags: ['PowerShell', 'GUI', 'Robocopy'],
    href: 'https://github.com/Vxlentin1/RGUI',
    context: 'Projet réalisé chez Koesio',
    featured: true,
  },
  {
    name: 'NotionNotes',
    date: 'Avril 2026',
    desc: "Application web générant automatiquement des notes techniques structurées dans Notion via Google Gemini, avec publication formatée et catégorisation multi-thèmes.",
    tags: ['Python', 'FastAPI', 'Google Gemini', 'Notion API', 'Docker'],
    href: 'https://github.com/Vxlentin1/NotionNotes',
    context: 'Projet personnel',
  },
];

export const positions = [
  'Administrateur Sécurité',
  'Ingénieur Réseau',
  'Administrateur Réseau',
  'Alternant Cybersécurité',
  'Ingénieur Systèmes',
];
