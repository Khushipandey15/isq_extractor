import React from 'react';
import Icon from '../AppIcon';

const WorkflowProgressIndicator = ({ 
  currentStage = 'setup',
  completedStages = [],
  onStageChange 
}) => {
  const stages = [
    { 
      id: 'setup', 
      label: 'Setup', 
      icon: 'FileText',
      description: 'MCAT Configuration'
    },
    { 
      id: 'upload', 
      label: 'Upload', 
      icon: 'Upload',
      description: 'Data Ingestion'
    },
    { 
      id: 'analysis', 
      label: 'Analysis', 
      icon: 'BarChart3',
      description: 'Individual Review'
    },
    { 
      id: 'triangulation', 
      label: 'Triangulation', 
      icon: 'GitMerge',
      description: 'Cross-Dataset Analysis'
    },
    { 
      id: 'export', 
      label: 'Export', 
      icon: 'Download',
      description: 'Results & Reports'
    }
  ];

  const getStageStatus = (stageId) => {
    if (completedStages.includes(stageId)) return 'completed';
    if (stageId === currentStage) return 'active';
    return 'pending';
  };

  const handleStageClick = (stageId) => {
    if (completedStages.includes(stageId) && onStageChange) {
      onStageChange(stageId);
    }
  };

  return (
    <div className="bg-background border-b border-border">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {stages.map((stage, index) => (
            <React.Fragment key={stage.id}>
              {/* Stage Step */}
              <div className="flex flex-col items-center space-y-2">
                <button
                  onClick={() => handleStageClick(stage.id)}
                  disabled={!completedStages.includes(stage.id) && stage.id !== currentStage}
                  className={`workflow-progress-step ${getStageStatus(stage.id)} ${
                    completedStages.includes(stage.id) 
                      ? 'cursor-pointer hover:scale-105 transform transition-transform duration-150' 
                      : stage.id === currentStage 
                        ? 'cursor-default' :'cursor-not-allowed'
                  }`}
                  aria-label={`${stage.label}: ${stage.description}`}
                >
                  <Icon 
                    name={stage.icon} 
                    size={16} 
                    color={getStageStatus(stage.id) === 'pending' ? 'currentColor' : 'white'}
                  />
                </button>
                
                <div className="text-center">
                  <div className={`text-sm font-heading-medium ${
                    getStageStatus(stage.id) === 'pending' ?'text-text-secondary' :'text-text-primary'
                  }`}>
                    {stage.label}
                  </div>
                  <div className="text-xs text-text-secondary hidden sm:block">
                    {stage.description}
                  </div>
                </div>
              </div>

              {/* Connector Line */}
              {index < stages.length - 1 && (
                <div className={`workflow-progress-connector ${
                  completedStages.includes(stage.id) ? 'completed' : ''
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkflowProgressIndicator;