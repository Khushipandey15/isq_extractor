import React from 'react';
import Icon from 'components/AppIcon';

const MCATInputSection = ({ 
  mcatName, 
  onMcatChange 
}) => {
  const handleMcatChange = (e) => {
    onMcatChange(e.target.value);
  };

  return (
    <div className="bg-background rounded-lg border border-border p-6 mb-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
          <Icon name="Settings" size={20} color="var(--color-accent)" />
        </div>
        <h2 className="text-lg font-heading font-medium text-text-primary">
          Analysis Configuration
        </h2>
      </div>

      <div className="space-y-6">
        {/* MCAT Name Input */}
        <div>
          <label htmlFor="mcat-name" className="block text-sm font-medium text-text-primary mb-2">
            MCAT Name <span className="text-error">*</span>
          </label>
          <input
            id="mcat-name"
            type="text"
            value={mcatName}
            onChange={handleMcatChange}
            placeholder="e.g., Modular Kitchen Cabinets, Kirloskar Diesel Generator"
            className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-150"
          />
          <p className="text-xs text-text-secondary mt-2">
            Enter the product category name for targeted ISQ extraction and analysis
          </p>
        </div>
      </div>
    </div>
  );
};

export default MCATInputSection;
