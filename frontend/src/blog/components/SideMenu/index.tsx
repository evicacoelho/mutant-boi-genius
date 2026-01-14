import React, { useEffect, useState } from 'react';
import './style.css';

// Type definitions
export interface SubSubItem {
  id: string;
  label: string;
  onClick?: () => void;
}

export interface SubItem {
  id: string;
  label: string;
  onClick?: () => void;
  subSubItems?: SubSubItem[];
}

export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  onClick?: () => void;
  subItems?: SubItem[];
}

export interface SideMenuProps {
  items: MenuItem[];
  className?: string;
}

const SideMenu: React.FC<SideMenuProps> = ({ items, className = '' }) => {
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [hoveredSubItemId, setHoveredSubItemId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      // Auto-close menu when resizing from mobile to desktop
      if (window.innerWidth > 768) {
        setMenuOpen(false);
      }
    };

    checkMobile(); // Initial check
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close menu when clicking outside on mobile
  useEffect(() => {
    if (!isMobile || !menuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.side-menu-container') && !target.closest('.mobile-menu-toggle')) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobile, menuOpen]);

  const handleMouseEnter = (itemId: string) => {
    if (isMobile) return; // Disable hover effects on mobile
    setHoveredItemId(itemId);
    setHoveredSubItemId(null);
  };

  const handleSubItemMouseEnter = (subItemId: string) => {
    if (isMobile) return; // Disable hover effects on mobile
    setHoveredSubItemId(subItemId);
  };

  const handleMouseLeave = () => {
    if (isMobile) return; // Disable hover effects on mobile
    setHoveredItemId(null);
    setHoveredSubItemId(null);
  };

  // Calculate total height based on all visible items, subitems, and subsubitems
  const calculateTotalHeight = () => {
    if (isMobile && !menuOpen) return 0;
    
    const MAIN_ITEM_HEIGHT = isMobile ? 56 : 48;
    const SUB_ITEM_HEIGHT = isMobile ? 44 : 40;
    const SUB_SUB_ITEM_HEIGHT = isMobile ? 40 : 36;

    let totalHeight = items.length * MAIN_ITEM_HEIGHT;
    
    // Add height for subitems of hovered item
    if (hoveredItemId) {
      const hoveredItem = items.find(item => item.id === hoveredItemId);
      if (hoveredItem?.subItems) {
        totalHeight += hoveredItem.subItems.length * SUB_ITEM_HEIGHT;
        
        // Add height for subsubitems of hovered subitem
        if (hoveredSubItemId) {
          const hoveredSubItem = hoveredItem.subItems.find(subItem => subItem.id === hoveredSubItemId);
          if (hoveredSubItem?.subSubItems) {
            totalHeight += hoveredSubItem.subSubItems.length * SUB_SUB_ITEM_HEIGHT;
          }
        }
      }
    }
    
    return totalHeight;
  };

  const handleItemClick = (item: MenuItem, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    
    // If item has subItems on desktop, don't trigger onClick - use hover instead
    if (!isMobile && item.subItems && item.subItems.length > 0) {
      return; // Let hover handle submenu expansion
    }
    
    if (item.onClick) {
      item.onClick();
      if (isMobile) {
        setMenuOpen(false);
      }
    }
  };

  const handleSubItemClick = (subItem: SubItem, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    
    // If subItem has subSubItems on desktop, don't trigger onClick - use hover instead
    if (!isMobile && subItem.subSubItems && subItem.subSubItems.length > 0) {
      return; // Let hover handle submenu expansion
    }
    
    if (subItem.onClick) {
      subItem.onClick();
      if (isMobile) {
        setMenuOpen(false);
      }
    }
  };

  const handleSubSubItemClick = (subSubItem: SubSubItem, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    
    if (subSubItem.onClick) {
      subSubItem.onClick();
      if (isMobile) {
        setMenuOpen(false);
      }
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button
          className={`mobile-menu-toggle ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className="toggle-bar"></span>
          <span className="toggle-bar"></span>
          <span className="toggle-bar"></span>
        </button>
      )}

      {/* Menu Container */}
      <div 
        className={`side-menu-container ${className} ${isMobile ? 'mobile' : ''} ${menuOpen ? 'mobile-open' : ''}`}
      >
        <div 
          className="side-menu"
          style={{ 
            height: isMobile && menuOpen ? 'auto' : `${calculateTotalHeight()}px`,
            maxHeight: isMobile ? 'calc(100vh - 100px)' : 'none'
          }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="menu-item-container"
              onMouseEnter={() => !isMobile && handleMouseEnter(item.id)}
              onMouseLeave={!isMobile ? handleMouseLeave : undefined}
            >
              <div
                className={`menu-item ${!(item.onClick || item.subItems) ? 'default-cursor' : ''}`}
                onClick={(e) => handleItemClick(item, e)}
              >
                {item.icon && (
                  <span className="menu-item-icon">
                    {item.icon}
                  </span>
                )}
                <span className="menu-item-label">{item.label}</span>
                {item.subItems && item.subItems.length > 0 && !isMobile && (
                  <span className="menu-item-arrow">▶</span>
                )}
                {item.subItems && item.subItems.length > 0 && isMobile && (
                  <span 
                    className="mobile-arrow" 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isMobile) {
                        setHoveredItemId(hoveredItemId === item.id ? null : item.id);
                      }
                    }}
                  >
                    {hoveredItemId === item.id ? '▼' : '▶'}
                  </span>
                )}
              </div>

              {/* Subitems */}
              {item.subItems && item.subItems.length > 0 && (
                <div
                  className={`subitems-container ${
                    (isMobile && hoveredItemId === item.id) || (!isMobile && hoveredItemId === item.id) ? 'expanded' : ''
                  }`}
                >
                  {item.subItems.map((subItem) => (
                    <div
                      key={subItem.id}
                      className="subitem-container"
                      onMouseEnter={() => !isMobile && handleSubItemMouseEnter(subItem.id)}
                    >
                      <div
                        className={`subitem ${!subItem.onClick ? 'default-cursor' : ''}`}
                        onClick={(e) => handleSubItemClick(subItem, e)}
                      >
                        <span className="subitem-label">{subItem.label}</span>
                        {subItem.subSubItems && subItem.subSubItems.length > 0 && !isMobile && (
                          <span className="subitem-arrow">▶</span>
                        )}
                        {subItem.subSubItems && subItem.subSubItems.length > 0 && isMobile && (
                          <span 
                            className="mobile-arrow" 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isMobile) {
                                setHoveredSubItemId(hoveredSubItemId === subItem.id ? null : subItem.id);
                              }
                            }}
                          >
                            {hoveredSubItemId === subItem.id ? '▼' : '▶'}
                          </span>
                        )}
                      </div>

                      {/* SubSubItems */}
                      {subItem.subSubItems && subItem.subSubItems.length > 0 && (
                        <div
                          className={`subsubitems-container ${
                            (isMobile && hoveredSubItemId === subItem.id) || (!isMobile && hoveredSubItemId === subItem.id) ? 'expanded' : ''
                          }`}
                        >
                          {subItem.subSubItems.map((subSubItem) => (
                            <div
                              key={subSubItem.id}
                              className={`subsubitem ${!subSubItem.onClick ? 'default-cursor' : ''}`}
                              onClick={(e) => handleSubSubItemClick(subSubItem, e)}
                            >
                              {subSubItem.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SideMenu;