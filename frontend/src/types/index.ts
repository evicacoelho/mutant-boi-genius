// Tag interface
export interface Tag {
  _id?: string;
  id?: string;  // Make id optional
  name: string;
  type: 'design' | 'tattoo' | 'painting' | 'photography' | 'audio' | 'av' | 'essays' | 'resources';
}

// Post interface
export interface Post {
  draftId?: string;
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
  isFeatured?: boolean;
}

// Draft interface (extends Post with draft-specific fields)
export interface Draft extends Omit<Post, 'publishedAt'> {
  isDraft: boolean;
  lastAutoSaved?: Date | string;
  draftId?: string;
  publishedAt?: Date | string; 
};

// API response for draft operations
export interface DraftResponse {
  success: boolean;
  post: Draft;
  isDraft: boolean;
  message: string;
}

export interface LatestDraftResponse {
  success: boolean;
  draft: Draft | null;
}

export interface DraftsResponse {
  success: boolean;
  drafts: Draft[];
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
  featuredPost?: boolean
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