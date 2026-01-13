import { 
  Post, 
  User, 
  Category, 
  PaginatedResponse, 
  LoginRequest, 
  LoginResponse, 
  ContactFormData,
  ApiResponse 
} from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function for API calls
interface ApiRequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

const apiRequest = async <T = any>(
  endpoint: string, 
  options: ApiRequestOptions = {}
): Promise<T> => {
  const token = localStorage.getItem('blog_auth_token');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: headers as HeadersInit,
  });

  if (!response.ok) {
    const errorText = await response.text();
    const error = new Error(`API Error ${response.status}: ${errorText}`);
    (error as any).status = response.status;
    throw error;
  }

  return response.json();
};

// Auth API
export const authAPI = {
  login: (credentials: LoginRequest): Promise<LoginResponse> => 
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getCurrentUser: (): Promise<{ user: User }> => 
    apiRequest('/auth/me'),

  logout: () => {
    localStorage.removeItem('blog_auth_token');
  },

  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('blog_auth_token');
    return !!token;
  },

  getToken: (): string | null => {
    return localStorage.getItem('blog_auth_token');
  },

  setToken: (token: string) => {
    localStorage.setItem('blog_auth_token', token);
  }
};

// Posts API
export const postsAPI = {
  getAllPosts: (params?: { 
    page?: number; 
    limit?: number; 
    category?: string;
    search?: string;
  }): Promise<PaginatedResponse<Post>> => {
    const query = new URLSearchParams(params as any).toString();
    return apiRequest(`/posts?${query}`);
  },

  getPostBySlug: (slug: string): Promise<Post> => 
    apiRequest(`/posts/${slug}`),

  createPost: (postData: Partial<Post>): Promise<Post> => 
    apiRequest('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    }),

  updatePost: (id: string, postData: Partial<Post>): Promise<Post> => 
    apiRequest(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    }),

  deletePost: (id: string): Promise<{ message: string }> => 
    apiRequest(`/posts/${id}`, {
      method: 'DELETE',
    }),

  getAllCategories: (): Promise<Category[]> => 
    apiRequest('/posts/categories'),
};

// Contact API
export const contactAPI = {
  submitContact: (contactData: ContactFormData): Promise<ApiResponse<void>> => 
    apiRequest('/contact', {
      method: 'POST',
      body: JSON.stringify(contactData),
    }),
};

export default apiRequest;