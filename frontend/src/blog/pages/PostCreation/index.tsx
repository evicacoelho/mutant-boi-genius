import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ContentEditor from '../../components/ContentEditor';
import './style.css';
import { tagTypes } from '../../components/PostPreview';
import { postsAPI } from '../../../services/api';
import { Tag, Draft } from '../../../types';
import BackgroundImage from '../../../background.png'

interface PostData {
  title: string;
  content: string;
  excerpt: string;
  tags: Tag[];
  featuredImage?: string;
  isFeatured?: boolean;
}

const PostCreation: React.FC = () => {
  const [postData, setPostData] = useState<PostData>({
    title: '',
    content: '',
    excerpt: '',
    tags: [],
  });
  const [draftId, setDraftId] = useState<string | null>(null);
  const [newTag, setNewTag] = useState({ name: '', type: 'design' });
  const [generatedSlug, setGeneratedSlug] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [error, setError] = useState('');
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  
  const navigate = useNavigate();
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const isInitialMount = useRef(true);
  const hasLoadedDraft = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load the latest draft on component mount
    useEffect(() => {
    // Only load draft once, even in StrictMode
    if (!hasLoadedDraft.current) {
      hasLoadedDraft.current = true;
      loadLatestDraft();
    }
  }, []); 

  // Auto-save functionality
  const saveDraft = useCallback(async (force = false) => {
    // Don't auto-save if there's no content at all (except maybe on force save)
    if (!force && !postData.title && !postData.content && !postData.excerpt && postData.tags.length === 0) {
      return;
    }

    // Don't save if already saving
    if (isSavingDraft) return;

    setIsSavingDraft(true);
    setSaveStatus('saving');

    try {
      const draftToSave: any = {
        title: postData.title,
        content: postData.content,
        excerpt: postData.excerpt,
        tags: postData.tags,
        featuredImage: postData.featuredImage,
      };

      // Include draftId if we have one (for updating existing draft)
      if (draftId) {
        draftToSave.draftId = draftId;
      }

      const response = await postsAPI.saveDraft(draftToSave);
      
      // If this is a new draft, store the draftId
      if (!draftId && response.post && response.post.draftId) {
        setDraftId(response.post.draftId);
      } else if (response.post && response.post._id && !draftId) {
        // Fallback to _id if draftId not available
        setDraftId(response.post._id);
      }
      
      setLastSaved(new Date());
      setSaveStatus('saved');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Error saving draft:', error);
      setSaveStatus('error');
    } finally {
      setIsSavingDraft(false);
    }
  }, [postData, draftId, isSavingDraft]);

  // Debounced auto-save
  useEffect(() => {
    // Skip auto-save on initial mount if we're loading a draft
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Set new timeout for auto-save (2 seconds after last change)
    autoSaveTimeoutRef.current = setTimeout(() => {
      saveDraft();
    }, 2000);

    // Cleanup on unmount
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [postData, saveDraft]);

  const loadLatestDraft = async () => {
    try {
      const response = await postsAPI.getLatestDraft();
      
      if (response.success && response.draft) {
        const draft = response.draft;
        
        // Use updatedAt or lastAutoSaved or current time as fallback
        const draftDate = draft.updatedAt || draft.lastAutoSaved || new Date().toISOString();
        
        // Confirm with user if they want to load the draft
        const shouldLoadDraft = window.confirm(
          'You have an unsaved draft from ' + 
          new Date(draftDate).toLocaleString() + 
          '. Would you like to continue editing it?'
        );
        
        if (shouldLoadDraft) {
          setPostData({
            title: draft.title || '',
            content: draft.content || '',
            excerpt: draft.excerpt || '',
            tags: draft.tags || [],
            featuredImage: draft.featuredImage || BackgroundImage,
            isFeatured: draft.isFeatured || false,
          });
          
          // Store the draft ID for future updates
          if (draft.draftId) {
            setDraftId(draft.draftId);
          } else {
            setDraftId(draft._id || null);
          }
          
          setDraftLoaded(true);
          setLastSaved(new Date(draftDate));
        }
      }
    } catch (error) {
      console.error('Error loading draft:', error);
      // Don't show error to user, just silently fail
    }
  };

  // Manual save function
  const handleManualSave = () => {
    saveDraft(true);
  };

  // Generate slug when title changes
  useEffect(() => {
    if (postData.title) {
      const slug = postData.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setGeneratedSlug(slug);
    } else {
      setGeneratedSlug('');
    }
  }, [postData.title]);

  // Generate excerpt from content if not manually set
  useEffect(() => {
    if (postData.content && !postData.excerpt) {
      const plainText = postData.content.replace(/<[^>]*>/g, '');
      const excerpt = plainText.substring(0, 200) + (plainText.length > 200 ? '...' : '');
      setPostData(prev => ({ ...prev, excerpt }));
    }
  }, [postData.content]);

  const handleContentChange = (content: string) => {
    setPostData(prev => ({ ...prev, content }));
  };

  const handleAddTag = () => {
    if (newTag.name.trim()) {
      const tag: Tag = {
        name: newTag.name.trim(),
        type: newTag.type as any
      };
      setPostData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setNewTag({ name: '', type: 'design' });
    }
  };

  const handleRemoveTag = (index: number) => {
    setPostData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleExcerptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostData(prev => ({ ...prev, excerpt: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Prepare data for backend
      const postToSubmit = {
        title: postData.title,
        content: postData.content,
        excerpt: postData.excerpt,
        tags: postData.tags,
        featuredImage: postData.featuredImage || BackgroundImage,
        isFeatured: postData.isFeatured,
      };

      const createdPost = await postsAPI.createPost(postToSubmit);
      
      // If we have a draft, delete it after successful publish
      if (draftId) {
        try {
          await postsAPI.deleteDraft(draftId);
        } catch (deleteError) {
          console.error('Error deleting draft after publish:', deleteError);
          // Non-critical error, don't block user
        }
      }
      
      alert('Post published successfully!');
      navigate(`/blog/${createdPost.slug}`);
      
    } catch (error: any) {
      setError(error.message || 'Failed to publish post. Please try again.');
      console.error('Error publishing post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    // Clear any pending auto-save
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    // Save current state one last time before logout
    if (postData.content || postData.title) {
      saveDraft(true).then(() => {
        localStorage.removeItem('blog_auth_token');
        navigate('/blog');
      }).catch(() => {
        localStorage.removeItem('blog_auth_token');
        navigate('/blog');
      });
    } else {
      localStorage.removeItem('blog_auth_token');
      navigate('/blog');
    }
  };

  // Format last saved time
  const getLastSavedText = () => {
    if (!lastSaved) return '';
    return `Last saved: ${lastSaved.toLocaleTimeString()}`;
  };

  // Get save status indicator
  const getSaveStatusIndicator = () => {
    switch (saveStatus) {
      case 'saving':
        return <span className="save-status saving">💾 Saving draft...</span>;
      case 'saved':
        return <span className="save-status saved">✓ Draft saved</span>;
      case 'error':
        return <span className="save-status error">✗ Failed to save</span>;
      default:
        return lastSaved ? <span className="save-status idle">{getLastSavedText()}</span> : null;
    }
  };

  return (
    <div className="post-creation-page">
      <header className="creation-header">
        <div className="header-top">
          <Link to="/blog" className="back-button">
            ← Back to Blog
          </Link>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
        <h1>{draftLoaded ? 'Continue Editing Draft' : 'Create New Post'}</h1>
        <p>Share your thoughts and creativity with the world</p>
        
        {/* Save status bar */}
        <div className="save-status-bar">
          {getSaveStatusIndicator()}
          <button 
            type="button" 
            onClick={handleManualSave} 
            className="manual-save-button"
            disabled={isSavingDraft || isSubmitting}
          >
            {isSavingDraft ? 'Saving...' : '💾 Save Draft Now'}
          </button>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="post-form">
        {error && <div className="error-message">{error}</div>}

        {/* Title Input */}
        <div className="form-group">
          <label htmlFor="title">Post Title *</label>
          <input
            type="text"
            id="title"
            value={postData.title}
            onChange={(e) => setPostData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter a compelling title..."
            required
            disabled={isSubmitting}
          />
          {generatedSlug && (
            <div className="slug-preview">
              <strong>Slug will be:</strong> {generatedSlug}
            </div>
          )}
        </div>

        {/* Excerpt */}
        <div className="form-group">
          <label htmlFor="excerpt">Excerpt (Preview Text) *</label>
          <textarea
            id="excerpt"
            value={postData.excerpt}
            onChange={handleExcerptChange}
            placeholder="Write a short preview of your post (max 200 characters)"
            rows={3}
            maxLength={200}
            required
            disabled={isSubmitting}
          />
          <div className="char-count">
            {postData.excerpt.length}/200 characters
          </div>
        </div>

        {/* Content Editor */}
        <div className="form-group">
          <label>Content *</label>
          <ContentEditor
            value={postData.content}
            onChange={handleContentChange}
            placeholder="Start writing your post content here..."
            disabled={isSubmitting}
          />
        </div>

        {/* Tags */}
        <div className="form-group">
          <label>Tags</label>
          <div className="tag-input">
            <input
              type="text"
              value={newTag.name}
              onChange={(e) => setNewTag(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter tag name"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              disabled={isSubmitting}
            />
            <select
              value={newTag.type}
              onChange={(e) => setNewTag(prev => ({ ...prev, type: e.target.value }))}
              disabled={isSubmitting}
            >
              {tagTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
            <button 
              type="button" 
              onClick={handleAddTag} 
              className="add-button"
              disabled={isSubmitting}
            >
              Add Tag
            </button>
          </div>
          <div className="tags-list">
            {postData.tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag.name} ({tag.type})
                <button
                  type="button"
                  onClick={() => handleRemoveTag(index)}
                  className="remove-tag"
                  disabled={isSubmitting}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Featured Image URL */}
        <div className="form-group">
          <label htmlFor="featuredImage">Featured Image URL</label>
          <input
            type="text"
            id="featuredImage"
            value={postData.featuredImage || ''}
            onChange={(e) => setPostData(prev => ({ ...prev, featuredImage: e.target.value }))}
            placeholder="https://example.com/image.jpg"
            disabled={isSubmitting}
          />
        </div>

        {/* Featured? */}
        <div className="form-group">
          <label className={`toggle-label ${isSubmitting ? 'disabled' : ''}`}>
            <div className="toggle-switch">
              <input
                type="checkbox"
                checked={postData.isFeatured || false}
                onChange={(e) => setPostData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                disabled={isSubmitting}
              />
              <span className="toggle-slider"></span>
            </div>
            <span className="toggle-text">Feature this post</span>
          </label>
          {postData.isFeatured && (
            <div className="feature-hint">
              ⭐ This post will appear at the top of the blog page
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button 
            type="button" 
            className="draft-button"
            onClick={() => {
              if (window.confirm('Are you sure you want to cancel? Your draft will be saved.')) {
                saveDraft(true).then(() => {
                  navigate('/blog');
                }).catch(() => {
                  navigate('/blog');
                });
              }
            }}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="publish-button"
            disabled={isSubmitting || !postData.title || !postData.content || !postData.excerpt}
          >
            {isSubmitting ? 'Publishing...' : 'Publish Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostCreation;