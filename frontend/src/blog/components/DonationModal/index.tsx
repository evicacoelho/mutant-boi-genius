import React, { useState } from 'react';
import './style.css';
import ContactModal from '../ContactModal';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  kofiUrl: string; // Your Ko-fi URL
}

const DonationModal: React.FC<DonationModalProps> = ({ 
  isOpen, 
  onClose,
  kofiUrl 
}) => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDonateClick = () => {
    window.open(kofiUrl, '_blank', 'noopener,noreferrer');
    onClose(); // Close modal after clicking the donation link
  };

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsContactModalOpen(true);
  };

  const handleContactModalClose = () => {
    setIsContactModalOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="coffee-modal-overlay" onClick={handleOverlayClick}>
      <div className="coffee-modal">
        <div className="modal-header">
          <h2 className="modal-title">Support My Work</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="modal-content">
          <div className="coffee-icon">
            ☕
          </div>
          
          <div className="coffee-description">
            <p className="main-text">
              If you find my work valuable and would like to support me, consider buying me a coffee!
            </p>
            
            <div className="considerations">
              <h3>What your support means:</h3>
              <ul className="considerations-list">
                <li>Helps cover hosting and maintenance costs</li>
                <li>Supports continuous development and new features</li>
                <li>Motivates me to create more quality content</li>
                <li>Allows me to dedicate more time to this project</li>
              </ul>
            </div>
            
            <div className="donation-note">
              <p>
                Every donation, no matter how small, is greatly appreciated and makes a difference!
              </p>
            </div>
          </div>
          
          <div className="donation-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              Maybe Later
            </button>
            <button
              type="button"
              className="btn-primary donate-btn"
              onClick={handleDonateClick}
            >
              Donate Now
            </button>
          </div>
          
          <div className="alternative-donation">
              <p className="alternative-text">
                Prefer a different method?{" "}
                <button 
                  className="contact-link-btn"
                  onClick={handleContactClick}
                >
                  Contact me
                </button>{" "}
                for alternatives.
              </p>
            </div>
        </div>
      </div>
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={handleContactModalClose}
      />
    </div>
  );
};

export default DonationModal;