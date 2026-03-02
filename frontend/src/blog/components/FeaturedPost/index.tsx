// frontend/src/components/FeaturedPost/index.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';

interface Tag {
  id?: string;
  name: string;
  type?: string;
}

interface FeaturedPostProps {
  title: string;
  date: Date;
  preview: string;
  tags: Tag[];
  onClick?: () => void;
}

const FeaturedPost: React.FC<FeaturedPostProps> = ({
  title,
  date,
  preview,
  tags,
  onClick
}) => {
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <article 
      className="featured-post-container"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="featured-badge">
        <span className="star">⭐</span> Featured Post
      </div>
      <h2 className="featured-title">{title}</h2>
      <time className="featured-date" dateTime={date.toISOString()}>
        {formatDate(date)}
      </time>
      
      <div className="featured-preview">
        <p>{preview}</p>
      </div>
      
      {tags.length > 0 && (
        <div className="featured-tags">
          {tags.map((tag, index) => (
            <Link 
              key={tag.id || `tag-${index}`}
              to={`/category/${tag.type}`}
              className={`featured-tag ${tag.type ? `tag-${tag.type}` : ''}`}
              onClick={(e) => e.stopPropagation()}
            >
              {tag.name}
            </Link>
          ))}
        </div>
      )}
      
      <div className="read-more">
        Read Full Post →
      </div>
    </article>
  );
};

export default FeaturedPost;