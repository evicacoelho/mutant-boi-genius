import './style.css';
import React, { useEffect, useState } from 'react';
import PostPreview from '../../components/PostPreview';
import SideMenu, { MenuItem } from '../../components/SideMenu';
import SearchBar from '../../components/SearchBar';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import ContactModal from '../../components/ContactModal';
import { usePosts, useCategories } from '../../../hooks/usePosts';
import { authAPI } from '../../../services/api';
import DonationModal from '../../components/DonationModal';

const BlogPage: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState<boolean>(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Donation url
  const donationUrl = process.env.DONATION_URL || "https://ko-fi.com/mutantboigenius"
  
  // Fetch posts with custom hook
  const { posts, loading, error, refetch } = usePosts(undefined, searchQuery);
  
  // Fetch categories
  const { categories } = useCategories();

  // Check authentication
  useEffect(() => {
    setIsAuthenticated(authAPI.isAuthenticated());
  }, []);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Handle post click
  const handlePostClick = (postId: string, postTitle: string) => {
    navigate(`/blog/${postId}`);
  };

  // Build menu items from categories
  const buildMenuItems = (): MenuItem[] => {
    // Group categories by type for Arts section
    const visualCategories = categories.filter(cat => 
      ['design', 'tattoo', 'painting', 'photography'].includes(cat.type)
    );
    
    const otherCategories = categories.filter(cat => 
      !['design', 'tattoo', 'painting', 'photography', 'essays', 'resources'].includes(cat.type)
    );

    const menuItems: MenuItem[] = [
      {
        id: '1',
        label: 'Arts',
        icon: '🎨',
        subItems: [
          {
            id: '1-1',
            label: 'Visual',
            subSubItems: visualCategories.map(cat => ({
              id: cat.id,
              label: cat.name,
              onClick: () => navigate(`/category/${cat.type}`),
            }))
          },
          ...otherCategories.map(cat => ({
            id: `cat-${cat.id}`,
            label: cat.name,
            onClick: () => navigate(`/category/${cat.type}`),
          }))
        ],
      },
      {
        id: '2',
        label: 'Essays',
        icon: '📓',
        onClick: () => navigate('/category/essays')
      },
      {
        id: '3',
        label: 'Resources',
        icon: '💬',
        subItems: categories
          .filter(cat => cat.type === 'resources')
          .map(cat => ({
            id: cat.id,
            label: cat.name,
            onClick: () => navigate(`/category/${cat.type}`),
          })),
        onClick: () => navigate('/category/resources')
      },
      {
        id: '4',
        label: 'Contact',
        icon: '📬',
        onClick: () => setIsContactModalOpen(true)
      },
      {
      id: '5',
      label: 'Buy me a Coffee',
      icon: '☕',
      onClick: () => setIsDonationModalOpen(true)
      }
    ];

    return menuItems;
  };

  const menuItems = buildMenuItems();

  return (
    <div className="blog-page">
      <header className="blog-header">
        <h1 className="rubik-burned-regular">Mutant Boi Genius</h1>
        {isAuthenticated && (
          <Link to="/create" className='create-post-button'>
            New Post
          </Link>
        )}
      </header>
      
      <SearchBar onSearch={handleSearch} />
      
      <main className="blog-content">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner">Loading posts...</div>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button onClick={refetch} className="retry-button">
              Retry
            </button>
          </div>
        ) : (
          <div className="posts-container">
            {posts.length === 0 ? (
              <div className="no-posts">
                <p>No posts found. {searchQuery && 'Try a different search term.'}</p>
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')} 
                    className="clear-search-button"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              posts.map((post) => (
                <PostPreview
                  key={post._id || post.id || `post-${post.slug}`}
                  id={post._id || post.id} // This can be undefined now
                  title={post.title}
                  date={post.date as Date} // Cast to Date since we transformed it
                  preview={post.preview || post.excerpt}
                  tags={post.tags}
                  onClick={() => handlePostClick(post.slug, post.title)}
                />
              ))
            )}
          </div>
        )}
      </main>

      <div style={{ minHeight: '100vh', position: 'relative' }}>
        <SideMenu items={menuItems} />
      </div>

      <Footer
        authorName='Mutant Boi Genius'
        websiteCreator='Urutau'
      />

      <ContactModal 
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

      <DonationModal 
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
        kofiUrl={donationUrl}
      />
    </div>
  );
};

export default BlogPage;