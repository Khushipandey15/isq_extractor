import React, { useRef, useState } from 'react';
import Icon from 'components/AppIcon';

const DatasetUploadCard = ({ 
  datasetType, 
  dataset, 
  onFileUpload, 
  onFileRemove, 
  disabled = false 
}) => {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/csv') {
      onFileUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'text/csv') {
      onFileUpload(file);
    }
  };

  const handleBrowseClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getStatusColor = () => {
    switch (dataset.status) {
      case 'completed':
        return 'border-success bg-success/5';
      case 'uploading':
        return 'border-warning bg-warning/5';
      case 'error':
        return 'border-error bg-error/5';
      default:
        return isDragOver ? 'border-primary bg-primary/5' : 'border-border bg-background';
    }
  };

  const getStatusIcon = () => {
    switch (dataset.status) {
      case 'completed':
        return <Icon name="CheckCircle" size={20} color="var(--color-success)" />;
      case 'uploading':
        return <Icon name="Loader" size={20} color="var(--color-warning)" className="animate-spin" />;
      case 'error':
        return <Icon name="AlertCircle" size={20} color="var(--color-error)" />;
      default:
        return <Icon name={datasetType.icon} size={24} color="var(--color-secondary)" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`rounded-lg border-2 border-dashed transition-all duration-200 ${getStatusColor()} ${
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    }`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          {getStatusIcon()}
          <div className="flex-1">
            <h3 className="text-sm font-heading font-medium text-text-primary">
              {datasetType.title}
            </h3>
            <p className="text-xs text-text-secondary">
              {datasetType.description}
            </p>
          </div>
          {dataset.status === 'completed' && (
            <button
              onClick={onFileRemove}
              className="p-1 text-text-secondary hover:text-error transition-colors duration-150 focus-ring rounded"
              aria-label="Remove file"
            >
              <Icon name="X" size={16} />
            </button>
          )}
        </div>

        {/* Upload Area */}
        {dataset.status === 'empty' && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
              isDragOver ? 'border-primary bg-primary/5' : 'border-border'
            } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={handleBrowseClick}
          >
            <Icon name="Upload" size={32} color="var(--color-secondary)" className="mx-auto mb-3" />
            <p className="text-sm font-medium text-text-primary mb-1">
              {disabled ? 'Enter MCAT name first' : 'Drop CSV file here or click to browse'}
            </p>
            <p className="text-xs text-text-secondary">
              Accepts: {datasetType.acceptedFormats} • Max size: 10MB
            </p>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
              disabled={disabled}
            />
          </div>
        )}

        {/* File Info */}
        {dataset.file && (
          <div className="bg-surface rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Icon name="FileText" size={20} color="var(--color-primary)" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {dataset.file.name}
                </p>
                <p className="text-xs text-text-secondary">
                  {formatFileSize(dataset.file.size)} • Uploaded {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Status Messages */}
        {dataset.status === 'uploading' && (
          <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-md">
            <div className="flex items-center space-x-2">
              <Icon name="Loader" size={16} color="var(--color-warning)" className="animate-spin" />
              <span className="text-sm text-warning">
                Analyzing dataset with Gemini AI...
              </span>
            </div>
          </div>
        )}

        {dataset.status === 'completed' && dataset.results && (
          <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-md">
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={16} color="var(--color-success)" />
              <span className="text-sm text-success">
                Analysis complete • {dataset.results.totalRows.toLocaleString('en-IN')} rows processed • {dataset.results.topISQs.length} ISQs identified
              </span>
            </div>
          </div>
        )}

        {dataset.status === 'error' && (
          <div className="mt-4 p-3 bg-error/10 border border-error/20 rounded-md">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} color="var(--color-error)" />
              <span className="text-sm text-error">
                Analysis failed. Please try uploading again.
              </span>
            </div>
          </div>
        )}

        {/* Metric Type Info */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-2">
            <Icon name="BarChart3" size={14} color="var(--color-secondary)" />
            <span className="text-xs text-text-secondary">
              Metric Type: {datasetType.metricType === 'pageviews' ? 'Pageviews' : 'Occurrences'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatasetUploadCard;