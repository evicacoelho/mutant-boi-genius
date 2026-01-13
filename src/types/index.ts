// Tag interface
export interface Tag {
  _id?: string;
  id?: string;  // Make id optional
  name: string;
  type: 'design' | 'tattoo' | 'painting' | 'photography' | 'audio' | 'av' | 'essays' | 'resources';
}

// Post interface
export interface Post {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: {
    _id?: string;
    displayName: string;
    username?: string;
  };
  tags: Tag[];
  featuredImage?: string;
  isPublished?: boolean;
  publishedAt: Date | string;
  updatedAt?: Date | string;
  viewCount?: number;
  // Frontend compatibility
  date?: Date | string;
  preview?: string;
}

// User interface
export interface User {
  _id?: string;
  id?: string;
  username: string;
  email: string;
  displayName: string;
  role: 'admin' | 'author' | 'reader';
}

// Category interface
export interface Category {
  id: string;
  name: string;
  type: string;
  count: number;
}

// API response interfaces
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  posts: T[];
  totalPages: number;
  currentPage: number;
  totalPosts: number;
}

// Login request/response
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
}

// Contact form
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}