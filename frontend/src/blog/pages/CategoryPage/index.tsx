import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PostPreview from '../../components/PostPreview';
import Footer from '../../components/Footer';
import { usePosts } from '../../../hooks/usePosts';
import './style.css';

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const { posts, loading, error } = usePosts(category);
  const [categoryName, setCategoryName] = useState<string>('');

  useEffect(() => {
    if (category) {
      const nameMap: Record<string, string> = {
        'essays': 'Essays',
        'design': 'Design',
        'tattoo': 'Tattoo',
        'painting': 'Painting',
        'photography': 'Photography',
        'audio': 'Audio',
        'av': 'Audio/Visual',
        'resources': 'Resources'
      };
      setCategoryName(nameMap[category] || category);
    }
  }, [category]);

  const handlePostClick = (slug: string) => {
    window.location.href = `/blog/${slug}`;
  };

  return (
    <div className="category-page">
      <header className="category-header">
        <Link to="/blog" className="back-button">
          ← Back to All Posts
        </Link>
        <h1 className="category-title">{categoryName}</h1>
        <p className="category-description">
          Posts tagged with "{categoryName}"
        </p>
      </header>

      <main className="category-content">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner">Loading posts...</div>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">{error}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="no-posts">
            <p>No posts found for this category.</p>
            <Link to="/blog" className="browse-all">
              Browse all posts
            </Link>
          </div>
        ) : (
          <div className="posts-container">
            {posts.map((post) => (
              <PostPreview
                key={post._id || post.id || `post-${post.slug}`}
                id={post._id || post.id}
                title={post.title}
                date={post.date as Date} // Cast to Date since usePosts transforms it
                preview={post.preview || post.excerpt}
                tags={post.tags}
                onClick={() => handlePostClick(post.slug)}
              />
            ))}
          </div>
        )}
      </main>

      <Footer
        authorName='Mutant Boi Genius'
        websiteCreator='Urutau'
      />
    </div>
  );
};

export default CategoryPage;