import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Footer from '../../components/Footer';
import { usePostBySlug } from '../../../hooks/usePosts';
import { authAPI } from '../../../services/api';
import './style.css';
import { formatDate } from '../../../utils/dateutils';

const PostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  const { post, loading, error } = usePostBySlug(slug || '');

  useEffect(() => {
    setIsAuthenticated(authAPI.isAuthenticated());
  }, []);

  if (loading) {
    return (
      <div className="post-page">
        <div className="loading-container">
          <div className="loading-spinner">Loading post...</div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="post-page">
        <div className="error-container">
          <h1>Post Not Found</h1>
          <p>The post you're looking for doesn't exist or has been removed.</p>
          <Link to="/blog" className="back-button">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="post-page">
      <header className="post-header">
        <Link to="/blog" className="back-button">
          ← Back to Blog
        </Link>
        <div className="post-meta">
          <h1 className="post-title special-elite-regular">{post.title}</h1>
          <div className="post-info">
            <span className="post-date">
              {post.date instanceof Date 
                ? post.date.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })
                : new Date(formatDate(post.date)).toLocaleDateString('en-US', {
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })
              }
            </span>
            <span className="post-author">by {post.author.displayName}</span>
          </div>
          <div className="post-tags">
            {post.tags.map(tag => (
              <Link 
                key={tag._id || tag.id}
                to={`/category/${tag.type}`}
                className={`tag tag-${tag.type}`}
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <main className="post-content">
        <article 
          className="post-article"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </main>

      <footer className="post-footer">
        <div className="post-navigation">
          <Link to="/blog" className="nav-button">
            ← All Posts
          </Link>
        </div>
        
      </footer>

      <Footer
        authorName='Mutant Boi Genius'
        websiteCreator='Urutau'
      />
    </div>
  );
};

export default PostPage;