import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';

// Type definitions - updated to match backend types
export interface Tag {
  id?: string;  // Make id optional
  name: string;
  type?: string;
}

interface PostProps {
  id?: string;  // Make id optional
  title: string;
  date: Date;   // Keep as Date for frontend
  preview: string;
  tags: Tag[];  // Accept tags with optional id
  className?: string;
  onClick?: () => void;
}

export const tagTypes = [
  'design', 
  'tattoo', 
  'painting', 
  'photography', 
  'audio', 
  'av', 
  'essays', 
  'resources'
];

const PostPreview: React.FC<PostProps> = ({ 
  id, 
  title, 
  date, 
  preview, 
  tags, 
  className = '',
  onClick 
}) => {
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const renderPreview = (text: string) => {
    const paragraphs = text.split('\n').filter(paragraph => paragraph.trim());
    
    return (
      <div className="post-preview">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    );
  };

  return (
    <article 
      className={`post-container ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <p className="post-title special-elite-regular">{title}</p>
      <time className="post-date" dateTime={date.toISOString()}>
        {formatDate(date)}
      </time>
      
      {renderPreview(preview)}
      
      {tags.length > 0 && (
        <div className="tags-container">
          {tags.map((tag, index) => (
            <Link 
              key={tag.id || `tag-${index}`}  // Use index as fallback
              to={`/category/${tag.type}`}
              className={`tag ${tag.type ? `tag-${tag.type}` : ''}`}
              onClick={(e) => e.stopPropagation()} // Prevent triggering post click
            >
              {tag.name}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
};

export default PostPreview;