import React, { useState } from 'react';
import Icon from '../AppIcon';

const Header = () => {
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

  const handleResetAnalysis = () => {
    // Reset analysis logic
    console.log('Reset analysis');
    setIsActionMenuOpen(false);
  };

  const handleExportResults = () => {
    // Export results logic
    console.log('Export results');
    setIsActionMenuOpen(false);
  };

  const handleSettings = () => {
    // Settings logic
    console.log('Settings');
    setIsActionMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-header bg-background border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo Section */}
        <div className="flex items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="BarChart3" size={20} color="white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-heading-semibold text-text-primary">
                DataFlow Analytics
              </h1>
              <span className="text-xs text-text-secondary font-body-regular">
                IndiaMART Intelligent Spec Platform
              </span>
            </div>
          </div>
        </div>

        {/* Action Context Menu */}
        <div className="relative">
          <button
            onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
            className="flex items-center space-x-2 px-3 py-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface transition-colors duration-150 focus-ring"
            aria-label="Open action menu"
            aria-expanded={isActionMenuOpen}
          >
            <Icon name="Settings" size={20} />
            <Icon 
              name={isActionMenuOpen ? "ChevronUp" : "ChevronDown"} 
              size={16} 
            />
          </button>

          {/* Dropdown Menu */}
          {isActionMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-background rounded-md shadow-elevated border border-border animate-slide-down">
              <div className="py-2">
                <button
                  onClick={handleExportResults}
                  className="flex items-center w-full px-4 py-2 text-sm text-text-primary hover:bg-surface transition-colors duration-150"
                >
                  <Icon name="Download" size={16} className="mr-3" />
                  Export All Results
                </button>
                <button
                  onClick={handleResetAnalysis}
                  className="flex items-center w-full px-4 py-2 text-sm text-warning hover:bg-warning/5 transition-colors duration-150"
                >
                  <Icon name="RotateCcw" size={16} className="mr-3" />
                  Reset Analysis
                </button>
                <div className="border-t border-border my-2"></div>
                <button
                  onClick={handleSettings}
                  className="flex items-center w-full px-4 py-2 text-sm text-text-primary hover:bg-surface transition-colors duration-150"
                >
                  <Icon name="Settings" size={16} className="mr-3" />
                  Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close menu */}
      {isActionMenuOpen && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => setIsActionMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;