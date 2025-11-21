
export interface User {
  id: string;
  name: string;
  role: string;
  avatar: string;
  coins: number;
}

export interface NavItem {
  label: string;
  icon: any; // Lucide icon component
  path: string;
  category?: string;
}

export interface NewsItem {
  id: number;
  title: string;
  category: string;
  date: string;
  image: string;
  excerpt: string;
   description?: string;
  slug?: string;
  body?: string[];
}

export interface HeroBlock {
  title: string;
  subtitle: string;
  date: string;
  image: string;
  ctaText?: string;
  ctaLink?: string;
}

export interface Tile {
  title: string;
  description: string;
  cta?: string;
  link?: string;
  variant?: 'primary' | 'secondary';
}

export interface HomeTask {
  id: string | number;
  title: string;
  time: string;
  status: 'pending' | 'done';
}

export interface EventItem {
  title: string;
  date: string;
  place: string;
  cta?: string;
}

export interface OrderItem {
  title: string;
  type: string;
  size: string;
}

export interface HomeConfig {
  hero: HeroBlock;
  tiles: Tile[];
  notifications: string[];
  tasks: HomeTask[];
  events: EventItem[];
  orders: OrderItem[];
}

export interface Course {
  id: number;
  title: string;
  progress: number;
  totalModules: number;
  thumbnail: string;
  duration?: string;
  badge?: string;
  modules?: CourseModule[];
  category?: string;
  description?: string;
  author?: string;
}

export type ModuleKind = 'video' | 'article' | 'image' | 'quiz' | 'assessment';

export interface CourseModule {
  id: string;
  title: string;
  type: ModuleKind;
  duration: string;
  description?: string;
  videoUrl?: string;
  imageUrl?: string;
  sections?: string[];
  quiz?: Quiz;
  content?: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
}

export interface Quiz {
  title: string;
  questions: QuizQuestion[];
}

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee?: User;
  createdAt?: string;
}

export interface DocumentItem {
  id: number;
  title: string;
  type: string;
  size: string;
  category: string;
  updated: string;
  link: string;
}
