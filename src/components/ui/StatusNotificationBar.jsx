import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const StatusNotificationBar = ({ 
  notifications = [],
  onDismiss 
}) => {
  const [visibleNotifications, setVisibleNotifications] = useState([]);

  useEffect(() => {
    setVisibleNotifications(notifications.filter(n => n.visible !== false));
  }, [notifications]);

  const handleDismiss = (notificationId) => {
    if (onDismiss) {
      onDismiss(notificationId);
    } else {
      setVisibleNotifications(prev => 
        prev.filter(notification => notification.id !== notificationId)
      );
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <Icon name="CheckCircle" size={20} />;
      case 'warning':
        return <Icon name="AlertTriangle" size={20} />;
      case 'error':
        return <Icon name="AlertCircle" size={20} />;
      case 'loading':
        return <Icon name="Loader" size={20} className="animate-spin" />;
      default:
        return <Icon name="Info" size={20} />;
    }
  };

  const getProgressBar = (progress) => {
    if (typeof progress !== 'number') return null;
    
    return (
      <div className="w-full bg-background/20 rounded-full h-1.5 mt-2">
        <div 
          className="bg-current h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    );
  };

  if (visibleNotifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-16 left-0 right-0 z-dropdown">
      <div className="space-y-2 p-4">
        {visibleNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`status-notification ${notification.type || 'info'} animate-slide-down`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                {getNotificationIcon(notification.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {notification.title && (
                      <h4 className="text-sm font-heading-medium mb-1">
                        {notification.title}
                      </h4>
                    )}
                    <p className="text-sm font-body-regular">
                      {notification.message}
                    </p>
                    {notification.details && (
                      <p className="text-xs mt-1 opacity-80">
                        {notification.details}
                      </p>
                    )}
                    {getProgressBar(notification.progress)}
                  </div>
                  
                  {notification.dismissible !== false && (
                    <button
                      onClick={() => handleDismiss(notification.id)}
                      className="flex-shrink-0 ml-4 p-1 hover:bg-current/10 rounded transition-colors duration-150 focus-ring"
                      aria-label="Dismiss notification"
                    >
                      <Icon name="X" size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusNotificationBar;