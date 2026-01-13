import { useState, useEffect, useCallback } from 'react';
import { Post, Category } from '../types';
import { postsAPI } from '../services/api';

export const usePosts = (category?: string, search?: string, page: number = 1, limit: number = 10) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalPosts, setTotalPosts] = useState<number>(0);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Prepare query params - don't send undefined values
      const params: any = {
        page,
        limit
      };
      
      // Only add category if it's defined and not empty
      if (category && category !== 'undefined') {
        params.category = category;
      }
      
      // Only add search if it's defined and not empty
      if (search && search.trim() !== '') {
        params.search = search;
      }
      
      console.log('Fetching posts with params:', params); // Debug log
      
      const response = await postsAPI.getAllPosts(params);

      console.log('API response:', response); // Debug log

      // Transform backend posts to frontend format
      const transformedPosts = response.posts.map(post => {
        // Ensure we have a valid date
        let postDate: Date;
        if (post.publishedAt) {
          const publishedAtDate = new Date(post.publishedAt);
          postDate = isNaN(publishedAtDate.getTime()) ? new Date() : publishedAtDate;
        } else if (post.date) {
          const dateObj = new Date(post.date);
          postDate = isNaN(dateObj.getTime()) ? new Date() : dateObj;
        } else {
          postDate = new Date(); // Fallback to current date
        }

        // Ensure tags have proper structure
        const transformedTags = post.tags.map(tag => ({
          id: tag._id || tag.id || undefined,
          name: tag.name,
          type: tag.type
        }));

        return {
          ...post,
          id: post._id || post.id || undefined,
          date: postDate,
          preview: post.excerpt,
          tags: transformedTags
        };
      });

      console.log('Transformed posts:', transformedPosts); // Debug log
      
      setPosts(transformedPosts);
      setTotalPages(response.totalPages);
      setTotalPosts(response.totalPosts);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch posts');
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }, [category, search, page, limit]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const refetch = () => {
    fetchPosts();
  };

  return { posts, loading, error, totalPages, totalPosts, refetch };
};

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await postsAPI.getAllCategories();
        setCategories(data);
      } catch (error: any) {
        setError(error.message || 'Failed to fetch categories');
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

export const usePostBySlug = (slug: string) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await postsAPI.getPostBySlug(slug);
        
        // Transform to frontend format
        const transformedPost = {
          ...data,
          id: data._id || data.id,
          date: new Date(data.publishedAt),
          preview: data.excerpt,
          tags: data.tags.map(tag => ({
            ...tag,
            id: tag._id || tag.id || `tag-${Date.now()}-${Math.random()}`
          }))
        };
        
        setPost(transformedPost);
      } catch (error: any) {
        setError(error.message || 'Failed to fetch post');
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  return { post, loading, error };
};