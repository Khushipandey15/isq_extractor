import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="FileQuestion" size={48} color="var(--color-primary)" />
          </div>
          <h1 className="text-4xl font-heading font-semibold text-text-primary mb-4">
            404
          </h1>
          <h2 className="text-xl font-heading font-medium text-text-primary mb-2">
            Page Not Found
          </h2>
          <p className="text-text-secondary mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <Link
          to="/main-analysis-dashboard"
          className="inline-flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors duration-150 focus-ring"
        >
          <Icon name="Home" size={20} />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;