import React, { useState } from 'react';
import Icon from '../AppIcon';

const AnalysisSectionNavigator = ({ 
  analysisResults = {},
  triangulationStatus = false,
  activeSection = null,
  onSectionNavigate 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sections = [
    {
      id: 'overview',
      label: 'Analysis Overview',
      icon: 'LayoutDashboard',
      available: true
    },
    {
      id: 'dataset-1',
      label: 'Dataset 1 Analysis',
      icon: 'FileBarChart',
      available: analysisResults.dataset1 || false,
      status: analysisResults.dataset1?.status || 'pending'
    },
    {
      id: 'dataset-2',
      label: 'Dataset 2 Analysis',
      icon: 'FileBarChart',
      available: analysisResults.dataset2 || false,
      status: analysisResults.dataset2?.status || 'pending'
    },
    {
      id: 'dataset-3',
      label: 'Dataset 3 Analysis',
      icon: 'FileBarChart',
      available: analysisResults.dataset3 || false,
      status: analysisResults.dataset3?.status || 'pending'
    },
    {
      id: 'triangulation',
      label: 'Triangulation Results',
      icon: 'GitMerge',
      available: triangulationStatus,
      status: triangulationStatus ? 'completed' : 'pending'
    },
    {
      id: 'export-summary',
      label: 'Export Summary',
      icon: 'FileDown',
      available: triangulationStatus,
      status: triangulationStatus ? 'available' : 'pending'
    }
  ];

  const handleSectionClick = (sectionId) => {
    if (onSectionNavigate) {
      onSectionNavigate(sectionId);
    }
    setIsMobileMenuOpen(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <Icon name="CheckCircle" size={14} color="#059669" />;
      case 'processing':
        return <Icon name="Loader" size={14} color="#D97706" className="animate-spin" />;
      case 'available':
        return <Icon name="Circle" size={14} color="#0EA5E9" />;
      default:
        return <Icon name="Circle" size={14} color="#64748B" />;
    }
  };

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-background border-r border-border z-sidebar transition-all duration-300 ${
      isExpanded ? 'w-64' : 'w-12'
    }`}>
      <div className="flex flex-col h-full">
        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-center h-12 border-b border-border hover:bg-surface transition-colors duration-150 focus-ring"
          aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <Icon 
            name={isExpanded ? "ChevronLeft" : "ChevronRight"} 
            size={20} 
            color="#64748B"
          />
        </button>

        {/* Navigation Items */}
        <nav className="flex-1 py-4">
          <div className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => section.available && handleSectionClick(section.id)}
                disabled={!section.available}
                className={`analysis-section-item w-full ${
                  activeSection === section.id ? 'active' : ''
                } ${
                  !section.available 
                    ? 'opacity-50 cursor-not-allowed' :'hover:bg-surface'
                }`}
                title={isExpanded ? '' : section.label}
              >
                <div className="flex items-center space-x-3">
                  <Icon 
                    name={section.icon} 
                    size={18} 
                    color={activeSection === section.id ? '#2563EB' : '#64748B'}
                  />
                  {isExpanded && (
                    <>
                      <span className="flex-1 text-left">{section.label}</span>
                      {section.status && getStatusIcon(section.status)}
                    </>
                  )}
                </div>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );

  // Mobile Menu
  const MobileMenu = () => (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-elevated flex items-center justify-center z-sidebar lg:hidden focus-ring"
        aria-label="Open navigation menu"
      >
        <Icon name="Menu" size={24} />
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-modal lg:hidden">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[90vw] bg-background shadow-elevated">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-heading-semibold text-text-primary">
                Analysis Sections
              </h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-surface rounded-md transition-colors duration-150 focus-ring"
                aria-label="Close navigation menu"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
            
            <nav className="p-4">
              <div className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => section.available && handleSectionClick(section.id)}
                    disabled={!section.available}
                    className={`analysis-section-item w-full ${
                      activeSection === section.id ? 'active' : ''
                    } ${
                      !section.available 
                        ? 'opacity-50 cursor-not-allowed' :'hover:bg-surface'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon 
                        name={section.icon} 
                        size={18} 
                        color={activeSection === section.id ? '#2563EB' : '#64748B'}
                      />
                      <span className="flex-1 text-left">{section.label}</span>
                      {section.status && getStatusIcon(section.status)}
                    </div>
                  </button>
                ))}
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      <div className="hidden lg:block">
        <DesktopSidebar />
      </div>
      <div className="lg:hidden">
        <MobileMenu />
      </div>
    </>
  );
};

export default AnalysisSectionNavigator;