import React, { useState } from 'react';
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

  const handleMouseEnter = (itemId: string) => {
    setHoveredItemId(itemId);
    setHoveredSubItemId(null); // Reset subitem hover when moving to new main item
  };

  const handleSubItemMouseEnter = (subItemId: string) => {
    setHoveredSubItemId(subItemId);
  };

  const handleMouseLeave = () => {
    setHoveredItemId(null);
    setHoveredSubItemId(null);
  };

  // Calculate total height based on all visible items, subitems, and subsubitems
  const calculateTotalHeight = () => {
    const MAIN_ITEM_HEIGHT = 48;
    const SUB_ITEM_HEIGHT = 40;
    const SUB_SUB_ITEM_HEIGHT = 36;

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

  return (
    <div className={`side-menu-container ${className}`}>
      <div 
        className="side-menu"
        style={{ height: `${calculateTotalHeight()}px` }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="menu-item-container"
            onMouseEnter={() => handleMouseEnter(item.id)}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className={`menu-item ${!(item.onClick || item.subItems) ? 'default-cursor' : ''}`}
              onClick={item.onClick}
            >
              {item.icon && (
                <span className="menu-item-icon">
                  {item.icon}
                </span>
              )}
              <span className="menu-item-label">{item.label}</span>
              {item.subItems && item.subItems.length > 0 && (
                <span className="menu-item-arrow">▶</span>
              )}
            </div>

            {/* Subitems */}
            {item.subItems && item.subItems.length > 0 && (
              <div
                className={`subitems-container ${
                  hoveredItemId === item.id ? 'expanded' : ''
                }`}
              >
                {item.subItems.map((subItem) => (
                  <div
                    key={subItem.id}
                    className="subitem-container"
                    onMouseEnter={() => handleSubItemMouseEnter(subItem.id)}
                  >
                    <div
                      className={`subitem ${!subItem.onClick ? 'default-cursor' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        subItem.onClick?.();
                      }}
                    >
                      <span className="subitem-label">{subItem.label}</span>
                      {subItem.subSubItems && subItem.subSubItems.length > 0 && (
                        <span className="subitem-arrow">▶</span>
                      )}
                    </div>

                    {/* SubSubItems */}
                    {subItem.subSubItems && subItem.subSubItems.length > 0 && (
                      <div
                        className={`subsubitems-container ${
                          hoveredSubItemId === subItem.id ? 'expanded' : ''
                        }`}
                      >
                        {subItem.subSubItems.map((subSubItem) => (
                          <div
                            key={subSubItem.id}
                            className={`subsubitem ${!subSubItem.onClick ? 'default-cursor' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              subSubItem.onClick?.();
                            }}
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
  );
};

export default SideMenu;