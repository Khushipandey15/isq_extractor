import React from 'react';
import Icon from 'components/AppIcon';

const TriangulationSection = ({
  uploadedDatasetsCount,
  canTriangulate,
  triangulationStatus,
  triangulationResults,
  onTriangulate
}) => {

  // Filter rows with at least one meaningful value (no blank rows)
  const filteredISQs = triangulationResults?.triangulatedISQs.filter(isq =>
    (isq.specification && isq.specification.trim() !== '') ||
    (isq.option && isq.option.trim() !== '') ||
    (isq.marketRelevance && isq.marketRelevance.trim() !== '') ||
    (isq.impactsPricing && isq.impactsPricing.trim() !== '')
  ) || [];

  const handleDownloadTriangulatedExcel = () => {
    if (!filteredISQs.length) return;

    const csvContent = [
      ['Rank', 'Specification', 'Top Options', 'Why it matters in the market', 'Impacts Pricing?'],
      ...filteredISQs.map((isq, index) => [
        index + 1,
        isq.specification,
        isq.option,
        isq.marketRelevance || '',
        isq.impactsPricing || ''
      ])
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Triangulated_ISQ_Analysis_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getTriangulationButtonText = () => {
    if (triangulationStatus === 'processing') return 'Analyzing...';
    if (triangulationStatus === 'completed') return 'Re-run Triangulation';
    return 'Start Triangulation';
  };

  const getTriangulationButtonIcon = () => {
    if (triangulationStatus === 'processing') return 'Loader';
    return 'GitMerge';
  };

  return (
    <div className="bg-background rounded-lg border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="GitMerge" size={24} color="var(--color-accent)" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-heading font-medium text-text-primary">
              Cross-Dataset Triangulation
            </h2>
            <p className="text-sm text-text-secondary">
              Combine insights from multiple datasets to identify weighted ISQ priorities
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Icon name="Database" size={16} color="var(--color-secondary)" />
              <span className="text-sm text-text-secondary">
                {uploadedDatasetsCount} dataset{uploadedDatasetsCount !== 1 ? 's' : ''} uploaded
              </span>
            </div>

            {triangulationStatus === 'completed' && triangulationResults && (
              <div className="flex items-center space-x-2">
                <Icon name="CheckCircle" size={16} color="var(--color-success)" />
                <span className="text-sm text-success">
                  Analysis completed • {triangulationResults.totalCombinedRows.toLocaleString('en-IN')} total rows
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onTriangulate}
            disabled={!canTriangulate}
            className={`inline-flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-all duration-150 focus-ring ${
              canTriangulate
                ? 'bg-accent text-white hover:bg-accent/90'
                : 'bg-surface text-text-secondary cursor-not-allowed'
            }`}
          >
            <Icon
              name={getTriangulationButtonIcon()}
              size={20}
              className={triangulationStatus === 'processing' ? 'animate-spin' : ''}
            />
            <span>{getTriangulationButtonText()}</span>
          </button>
        </div>

        {uploadedDatasetsCount < 2 && (
          <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-md">
            <div className="flex items-center space-x-2">
              <Icon name="AlertTriangle" size={16} color="var(--color-warning)" />
              <span className="text-sm text-warning">
                Upload at least 2 datasets to enable triangulation analysis
              </span>
            </div>
          </div>
        )}
      </div>

      {filteredISQs.length > 0 && (
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-heading font-medium text-text-primary">Triangulated Results</h3>
            <button
              onClick={handleDownloadTriangulatedExcel}
              className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-md hover:bg-primary/20 transition-colors duration-150 focus-ring"
            >
              <Icon name="Download" size={16} />
              <span>Export Full Results</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border rounded-md">
              <thead>
                <tr className="bg-muted text-text-secondary">
                  <th className="text-left py-2 px-3">Rank</th>
                  <th className="text-left py-2 px-3">Specification</th>
                  <th className="text-left py-2 px-3">Top Options</th>
                  <th className="text-left py-2 px-3">Why it matters</th>
                  <th className="text-center py-2 px-3">Impacts Pricing?</th>
                </tr>
              </thead>
              <tbody>
                {filteredISQs.map((isq, index) => (
                  <tr key={index} className="border-t border-border hover:bg-muted/40">
                    <td className="py-2 px-3">{index + 1}</td>
                    <td className="py-2 px-3">{isq.specification}</td>
                    <td className="py-2 px-3">{isq.option}</td>
                    <td className="py-2 px-3">{isq.marketRelevance || ''}</td>
                    <td className="text-center py-2 px-3">{isq.impactsPricing || ''}</td>
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

export default TriangulationSection;
