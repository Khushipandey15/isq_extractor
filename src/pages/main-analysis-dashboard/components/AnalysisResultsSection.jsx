import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const AnalysisResultsSection = ({ datasetType, results, analysisId }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDownloadExcel = () => {
    // Mock Excel download functionality
    const csvContent = [
      ['Rank', 'Specification', 'Option', results.metricType === 'pageviews' ? 'Pageviews' : 'Occurrences'],
      ...results.topISQs.map(isq => [isq.rank, isq.specification, isq.option, isq.metric])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${datasetType.title.replace(/\s+/g, '_')}_Analysis_${analysisId}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const formatMetricValue = (value) => {
    return value.toLocaleString('en-IN');
  };

  return (
    <div className="bg-background rounded-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-3 flex-1 text-left hover:bg-surface/50 -m-2 p-2 rounded-md transition-colors duration-150 focus-ring"
          >
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name={datasetType.icon} size={18} color="var(--color-primary)" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-heading font-medium text-text-primary">
                {datasetType.title} Analysis
              </h3>
              <p className="text-xs text-text-secondary">
                {results.totalRows.toLocaleString('en-IN')} rows • {results.topISQs.length} top ISQs • {new Date(results.analysisTimestamp).toLocaleDateString('en-IN')}
              </p>
            </div>
            <Icon 
              name={isExpanded ? 'ChevronUp' : 'ChevronDown'} 
              size={20} 
              color="var(--color-secondary)" 
            />
          </button>
          
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={handleDownloadExcel}
              className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 rounded-md hover:bg-primary/20 transition-colors duration-150 focus-ring"
            >
              <Icon name="Download" size={14} />
              <span>Excel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-surface rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Icon name="Database" size={16} color="var(--color-secondary)" />
                <span className="text-xs font-medium text-text-secondary">Total Rows</span>
              </div>
              <p className="text-lg font-heading font-semibold text-text-primary mt-1">
                {results.totalRows.toLocaleString('en-IN')}
              </p>
            </div>
            
            <div className="bg-surface rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Icon name="Target" size={16} color="var(--color-secondary)" />
                <span className="text-xs font-medium text-text-secondary">Top ISQs</span>
              </div>
              <p className="text-lg font-heading font-semibold text-text-primary mt-1">
                {results.topISQs.length}
              </p>
            </div>
            
            <div className="bg-surface rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Icon name="BarChart3" size={16} color="var(--color-secondary)" />
                <span className="text-xs font-medium text-text-secondary">MCAT</span>
              </div>
              <p className="text-sm font-medium text-text-primary mt-1 truncate">
                {results.mcatName}
              </p>
            </div>
          </div>

          {/* ISQ Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 font-medium text-text-secondary">Rank</th>
                  <th className="text-left py-3 px-2 font-medium text-text-secondary">Specification</th>
                  <th className="text-left py-3 px-2 font-medium text-text-secondary">Option</th>
                  <th className="text-right py-3 px-2 font-medium text-text-secondary">
                    {results.metricType === 'pageviews' ? 'Pageviews' : 'Occurrences'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {results.topISQs.map((isq, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-surface/50 transition-colors duration-150">
                    <td className="py-3 px-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                          isq.rank <= 3 
                            ? 'bg-primary text-white' :'bg-surface text-text-secondary'
                        }`}>
                          {isq.rank}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 font-medium text-text-primary">
                      {isq.specification}
                    </td>
                    <td className="py-3 px-2 text-text-secondary">
                      {isq.option}
                    </td>
                    <td className="py-3 px-2 text-right font-medium text-text-primary">
                      {formatMetricValue(isq.metric)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisResultsSection;