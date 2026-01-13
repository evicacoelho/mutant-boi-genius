import React from 'react';
import './style.css';

interface FooterProps {
  authorName?: string;
  websiteCreator?: string;
  year?: number;
}

const Footer: React.FC<FooterProps> = ({ 
  authorName = "Mutant Boi Genius",
  websiteCreator = "Your Name",
  year = new Date().getFullYear()
}) => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4 className="footer-title">Content Licensing</h4>
          <p className="footer-text">
            All content © {year} {authorName}. All rights reserved.
          </p>
          <p className="footer-text">
            Unless otherwise specified, all essays, zines, and creative works 
            are licensed under Creative Commons BY-NC-SA 4.0.
          </p>
        </div>
        
        <div className="footer-section">
          <h4 className="footer-title">Website Information</h4>
          <p className="footer-text">
            Website created and maintained by {websiteCreator}.
          </p>
          <p className="footer-text">
            Built with React, TypeScript, and passion.
          </p>
        </div>
        
        <div className="footer-section">
          <h4 className="footer-title">Acknowledgments</h4>
          <p className="footer-text">
            Special thanks to all readers, contributors, and supporters 
            of independent publishing and digital art.
          </p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p className="footer-copyright">
          © {year} {authorName} • Website by {websiteCreator}
        </p>
      </div>
    </footer>
  );
};

export default Footer;