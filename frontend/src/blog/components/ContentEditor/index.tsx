import React, { useState, useEffect, useRef } from 'react';
import './style.css';

interface ContentEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

interface MediaModalData {
  isOpen: boolean;
  type: 'image' | 'video' | 'audio' | null;
  url: string;
  alt: string;
  caption: string;
  width?: string;
  height?: string;
  youtubeId?: string;
}

const ContentEditor: React.FC<ContentEditorProps> = ({ 
  value, 
  onChange, 
  placeholder = 'Start writing...',
  className = '',
  disabled = false
}) => {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrike, setIsStrike] = useState(false);
  const [mediaModal, setMediaModal] = useState<MediaModalData>({
    isOpen: false,
    type: null,
    url: '',
    alt: '',
    caption: '',
    width: '100%',
    height: 'auto',
    youtubeId: ''
  });
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Extract YouTube ID from various URL formats
  const extractYoutubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w\-_]+)/,
      /youtube\.com\/v\/([\w\-_]+)/,
      /youtube\.com\/embed\/([\w\-_]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  useEffect(() => {
    if (textareaRef.current) {      
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (disabled) return;
    onChange(e.target.value);
  };

  const toggleFormatting = (format: 'bold' | 'italic' | 'underline' | 'strike') => {
    if (disabled || !textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let formattedText = '';
    
    switch (format) {
      case 'bold':
        formattedText = `<strong>${selectedText}</strong>`;
        setIsBold(!isBold);
        break;
      case 'italic':
        formattedText = `<em>${selectedText}</em>`;
        setIsItalic(!isItalic);
        break;
      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        setIsUnderline(!isUnderline);
        break;
      case 'strike':
        formattedText = `<s>${selectedText}</s>`;
        setIsStrike(!isStrike);
        break;
    }
    
    const newValue = value.substring(0, start) + formattedText + value.substring(end);
    onChange(newValue);
    
    setTimeout(() => {
      if (textareaRef.current) {
        const cursorPos = start + formattedText.length;
        textareaRef.current.selectionStart = cursorPos;
        textareaRef.current.selectionEnd = cursorPos;
        textareaRef.current.focus();
      }
    }, 0);
  };

  const openMediaModal = (type: 'image' | 'video' | 'audio') => {
    if (disabled) return;
    setMediaModal({
      isOpen: true,
      type,
      url: '',
      alt: '',
      caption: '',
      width: type === 'video' ? '560' : '100%',
      height: type === 'video' ? '315' : 'auto',
      youtubeId: ''
    });
  };

  const closeMediaModal = () => {
    setMediaModal({
      isOpen: false,
      type: null,
      url: '',
      alt: '',
      caption: '',
      width: '100%',
      height: 'auto',
      youtubeId: ''
    });
  };

  const handleVideoUrlChange = (url: string) => {
    const youtubeId = extractYoutubeId(url);
    setMediaModal(prev => ({
      ...prev,
      url,
      youtubeId: youtubeId || ''
    }));
  };

  const insertMedia = () => {
    if (!mediaModal.type || !textareaRef.current) return;
    
    // Validate required fields
    if (!mediaModal.url.trim()) {
      alert('Please enter a URL');
      return;
    }
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    let mediaHTML = '';
    
    switch (mediaModal.type) {
      case 'image':
        mediaHTML = `\n<div class="embedded-media embedded-image">
  <img src="${mediaModal.url}" alt="${mediaModal.alt || 'Image'}" 
    style="max-width: ${mediaModal.width}; height: ${mediaModal.height};" />
  ${mediaModal.caption ? `<p class="media-caption">${mediaModal.caption}</p>` : ''}
</div>\n`;
        break;
      case 'video':
        let embedUrl = mediaModal.url;
        let embedTitle = mediaModal.alt || 'Video';
        
        // If it's a YouTube URL, convert to embed format
        if (mediaModal.youtubeId) {
          embedUrl = `https://www.youtube.com/embed/${mediaModal.youtubeId}`;
        } else if (mediaModal.url.includes('youtube.com') || mediaModal.url.includes('youtu.be')) {
          // Try to extract ID from any YouTube URL
          const youtubeId = extractYoutubeId(mediaModal.url);
          if (youtubeId) {
            embedUrl = `https://www.youtube.com/embed/${youtubeId}`;
          } else {
            alert('Please enter a valid YouTube URL in one of these formats:\n\n• https://www.youtube.com/watch?v=VIDEO_ID\n• https://youtu.be/VIDEO_ID\n• https://www.youtube.com/embed/VIDEO_ID');
            return;
          }
        } else if (mediaModal.url.includes('vimeo.com')) {
          // Handle Vimeo URLs
          const vimeoId = mediaModal.url.split('/').pop()?.split('?')[0];
          if (vimeoId) {
            embedUrl = `https://player.vimeo.com/video/${vimeoId}`;
          }
        }
        
        mediaHTML = `\n<div class="embedded-media video-embed">
  <div class="video-wrapper">
    <iframe 
      src="${embedUrl}"
      title="${embedTitle}"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      style="width: ${mediaModal.width}; height: ${mediaModal.height}; max-width: 100%;">
    </iframe>
  </div>
  ${mediaModal.caption ? `<p class="media-caption">${mediaModal.caption}</p>` : ''}
</div>\n`;
        break;
      case 'audio':
        mediaHTML = `\n<div class="embedded-media audio-embed">
  <audio controls style="width: ${mediaModal.width};">
    <source src="${mediaModal.url}" type="audio/mpeg" />
    Your browser does not support the audio element.
  </audio>
  ${mediaModal.caption ? `<p class="media-caption">${mediaModal.caption}</p>` : ''}
</div>\n`;
        break;
    }
    
    const newValue = value.substring(0, start) + mediaHTML + value.substring(start);
    onChange(newValue);
    closeMediaModal();
    
    setTimeout(() => {
      if (textareaRef.current) {
        const cursorPos = start + mediaHTML.length;
        textareaRef.current.selectionStart = cursorPos;
        textareaRef.current.selectionEnd = cursorPos;
        textareaRef.current.focus();
      }
    }, 0);
  };

  const openPreview = () => {
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
  };

  // Get embed URL for preview
  const getEmbedUrl = (url: string): string => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const youtubeId = extractYoutubeId(url);
      return youtubeId ? `https://www.youtube.com/embed/${youtubeId}` : url;
    }
    if (url.includes('vimeo.com')) {
      const vimeoId = url.split('/').pop()?.split('?')[0];
      return vimeoId ? `https://player.vimeo.com/video/${vimeoId}` : url;
    }
    return url;
  };

  // Create preview HTML with corrected embed URLs
  const getPreviewHtml = (): string => {
    if (!value) return '<p>No content to preview yet.</p>';
    
    // Find and fix YouTube/Vimeo URLs in iframes
    return value.replace(
      /<iframe[^>]*src=["']([^"']+)["'][^>]*>/g,
      (match, src) => {
        const embedUrl = getEmbedUrl(src);
        return match.replace(src, embedUrl);
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (disabled || !textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    if (e.key === 'Enter') {
      e.preventDefault();
      
      // Check if Shift is pressed for new paragraph
      if (e.shiftKey) {
        // Insert <p></p> tags for new paragraph
        const newValue = 
          value.substring(0, start) + 
          '\n<p></p>\n' + 
          value.substring(end);
        
        onChange(newValue);
        
        // Place cursor between the paragraph tags
        setTimeout(() => {
          if (textareaRef.current) {
            const cursorPos = start + 4; // Position after <p> (4 chars) + newline (1 char)
            textareaRef.current.selectionStart = cursorPos;
            textareaRef.current.selectionEnd = cursorPos;
          }
        }, 0);
      } else {
        // Regular Enter key - insert <br> tag
        const newValue = 
          value.substring(0, start) + 
          '\n<br>' + 
          value.substring(end);
        
        onChange(newValue);
        
        // Move cursor after the <br> tag
        setTimeout(() => {
          if (textareaRef.current) {
            const cursorPos = start + 5;
            textareaRef.current.selectionStart = cursorPos;
            textareaRef.current.selectionEnd = cursorPos;
          }
        }, 0);
      }
    } else if (e.key === 'Tab') {
    e.preventDefault();
    
    // Tab key - insert 4 non-breaking spaces
    const tabSpaces = '&nbsp;&nbsp;&nbsp;&nbsp;';
    const newValue = 
      value.substring(0, start) + 
      tabSpaces + 
      value.substring(end);
    
    onChange(newValue);
    
    // Move cursor after the tab spaces
    setTimeout(() => {
      if (textareaRef.current) {
        const cursorPos = start + tabSpaces.length;
        textareaRef.current.selectionStart = cursorPos;
        textareaRef.current.selectionEnd = cursorPos;
      }
    }, 0);
  }
  };

  return (
    <>
      <div className={`content-editor-container ${className} ${disabled ? 'content-editor-disabled' : ''}`}>
        <div className="editor-toolbar">
          <button 
            type="button" 
            className={`toolbar-btn ${isBold ? 'active' : ''}`}
            onClick={() => toggleFormatting('bold')}
            disabled={disabled}
            title="Bold"
          >
            <strong>B</strong>
          </button>
          <button 
            type="button" 
            className={`toolbar-btn ${isItalic ? 'active' : ''}`}
            onClick={() => toggleFormatting('italic')}
            disabled={disabled}
            title="Italic"
          >
            <em>I</em>
          </button>
          <button 
            type="button" 
            className={`toolbar-btn ${isUnderline ? 'active' : ''}`}
            onClick={() => toggleFormatting('underline')}
            disabled={disabled}
            title="Underline"
          >
            <u>U</u>
          </button>
          <button 
            type="button" 
            className={`toolbar-btn ${isStrike ? 'active' : ''}`}
            onClick={() => toggleFormatting('strike')}
            disabled={disabled}
            title="Strikethrough"
          >
            <s>S</s>
          </button>
          <div className="toolbar-divider"></div>
          <button 
            type="button" 
            className="toolbar-btn"
            onClick={() => openMediaModal('image')}
            disabled={disabled}
            title="Insert Image"
          >
            🖼️
          </button>
          <button 
            type="button" 
            className="toolbar-btn"
            onClick={() => openMediaModal('video')}
            disabled={disabled}
            title="Insert Video"
          >
            🎥
          </button>
          <button 
            type="button" 
            className="toolbar-btn"
            onClick={() => openMediaModal('audio')}
            disabled={disabled}
            title="Insert Audio"
          >
            🎵
          </button>
          <div className="toolbar-divider"></div>
          <button 
            type="button" 
            className="toolbar-btn preview-btn"
            onClick={openPreview}
            disabled={disabled || !value.trim()}
            title="Preview Post"
          >
            👁️ Preview
          </button>
        </div>
        
        <textarea
          ref={textareaRef}
          className="editor-textarea"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          style={{ resize: 'vertical', minHeight: '200px' }}
        />
        
        <div className="editor-footer">
          <span className="char-count">
            {value.length} characters
          </span>
          <div className="formatting-hint">
            Select text and click buttons to format • Use Ctrl+B/I/U for shortcuts
          </div>
        </div>
      </div>

      {/* Media Insertion Modal */}
      {mediaModal.isOpen && (
        <div className="media-modal-overlay">
          <div className="media-modal">
            <div className="modal-header">
              <h3>Insert {mediaModal.type}</h3>
              <button className="modal-close" onClick={closeMediaModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>URL *</label>
                <input
                  type="url"
                  value={mediaModal.url}
                  onChange={(e) => {
                    if (mediaModal.type === 'video') {
                      handleVideoUrlChange(e.target.value);
                    } else {
                      setMediaModal({...mediaModal, url: e.target.value});
                    }
                  }}
                  placeholder={
                    mediaModal.type === 'video' 
                      ? 'https://www.youtube.com/watch?v=... or https://vimeo.com/...'
                      : `Enter ${mediaModal.type} URL`
                  }
                  className="form-input"
                />
                {mediaModal.type === 'video' && mediaModal.youtubeId && (
                  <div className="url-hint">
                    ✓ Detected YouTube video: {mediaModal.youtubeId}
                  </div>
                )}
                {mediaModal.type === 'video' && (
                  <div className="url-examples">
                    <small>Examples:</small>
                    <ul>
                      <li>YouTube: https://www.youtube.com/watch?v=dQw4w9WgXcQ</li>
                      <li>YouTube Short: https://youtu.be/dQw4w9WgXcQ</li>
                      <li>Vimeo: https://vimeo.com/123456789</li>
                    </ul>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Title/Alt Text</label>
                <input
                  type="text"
                  value={mediaModal.alt}
                  onChange={(e) => setMediaModal({...mediaModal, alt: e.target.value})}
                  placeholder={`Enter ${mediaModal.type} title/description`}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Caption</label>
                <input
                  type="text"
                  value={mediaModal.caption}
                  onChange={(e) => setMediaModal({...mediaModal, caption: e.target.value})}
                  placeholder="Optional caption"
                  className="form-input"
                />
              </div>
              {(mediaModal.type === 'image' || mediaModal.type === 'video') && (
                <div className="dimensions-row">
                  <div className="form-group">
                    <label>Width</label>
                    <input
                      type="text"
                      value={mediaModal.width}
                      onChange={(e) => setMediaModal({...mediaModal, width: e.target.value})}
                      placeholder="e.g., 100% or 560px"
                      className="form-input"
                    />
                  </div>
                  {mediaModal.type === 'video' && (
                    <div className="form-group">
                      <label>Height</label>
                      <input
                        type="text"
                        value={mediaModal.height}
                        onChange={(e) => setMediaModal({...mediaModal, height: e.target.value})}
                        placeholder="e.g., 315px"
                        className="form-input"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeMediaModal}>
                Cancel
              </button>
              <button 
                className="btn-primary" 
                onClick={insertMedia}
                disabled={!mediaModal.url.trim()}
              >
                Insert {mediaModal.type}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Preview Modal */}
      {isPreviewOpen && (
        <div className="preview-modal-overlay">
          <div className="preview-modal">
            <div className="preview-modal-header">
              <h2>Post Preview</h2>
              <p>This is how your content will appear on the actual post page</p>
              <button className="modal-close" onClick={closePreview}>×</button>
            </div>
            <div className="preview-modal-content">
              <div className="preview-post-page">
                <main className="preview-post-content">
                  <article 
                    className="post-article"
                    dangerouslySetInnerHTML={{ __html: getPreviewHtml() }}
                  />
                </main>
              </div>
            </div>
            <div className="preview-modal-footer">
              <button className="btn-secondary" onClick={closePreview}>
                Close Preview
              </button>
              <div className="preview-hint">
                Note: This preview shows content only. The actual post page will include title, author, date, and tags.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContentEditor;