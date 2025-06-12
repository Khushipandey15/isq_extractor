import React, { useState, useCallback } from 'react';
import Header from 'components/ui/Header';
import Icon from 'components/AppIcon';
import MCATInputSection from './components/MCATInputSection';
import DatasetUploadCard from './components/DatasetUploadCard';
import AnalysisResultsSection from './components/AnalysisResultsSection';
import TriangulationSection from './components/TriangulationSection';
import StatusNotificationBar from 'components/ui/StatusNotificationBar';
import { analyzeDataset, triangulateDatasets } from 'services/geminiService';

const MainAnalysisDashboard = () => {
  const [mcatName, setMcatName] = useState('');
  const [datasets, setDatasets] = useState({
    'internal-search': { file: null, status: 'empty', results: null, analysisId: null },
    'lms-chat': { file: null, status: 'empty', results: null, analysisId: null },
    'blni-comments': { file: null, status: 'empty', results: null, analysisId: null },
    'pns-transcript': { file: null, status: 'empty', results: null, analysisId: null },
    'whatsapp-conversations': { file: null, status: 'empty', results: null, analysisId: null }
  });
  const [triangulationResults, setTriangulationResults] = useState(null);
  const [triangulationStatus, setTriangulationStatus] = useState('idle');
  const [notifications, setNotifications] = useState([]);
  const [geminiApiKey, setGeminiApiKey] = useState('');

  const datasetTypes = [
    {
      id: 'internal-search',
      title: 'Internal Search Keywords',
      description: 'Upload CSV containing internal search query data with pageview metrics',
      icon: 'Search',
      acceptedFormats: '.csv',
      metricType: 'pageviews'
    },
    {
      id: 'lms-chat',
      title: 'LMS Chat Logs',
      description: 'Upload CSV containing learning management system chat conversations',
      icon: 'MessageSquare',
      acceptedFormats: '.csv',
      metricType: 'occurrences'
    },
    {
      id: 'blni-comments',
      title: 'BLNI Comments/QRF Data',
      description: 'Upload CSV containing business logic and quality requirement feedback',
      icon: 'FileText',
      acceptedFormats: '.csv',
      metricType: 'occurrences'
    },
    {
      id: 'pns-transcript',
      title: 'PNS Call Transcript',
      description: 'Upload CSV containing phone call transcription data',
      icon: 'Phone',
      acceptedFormats: '.csv',
      metricType: 'occurrences'
    },
    {
      id: 'whatsapp-conversations',
      title: 'WhatsApp Conversations',
      description: 'Upload CSV containing WhatsApp chat conversation data',
      icon: 'MessageCircle',
      acceptedFormats: '.csv',
      metricType: 'occurrences'
    }
  ];

  const addNotification = useCallback((notification) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { ...notification, id }]);
    
    if (notification.type !== 'loading' && notification.dismissible !== false) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, 5000);
    }
    
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const handleFileUpload = useCallback(async (datasetId, file) => {
    if (!mcatName.trim()) {
      addNotification({
        type: 'error',
        title: 'MCAT Required',
        message: 'Please enter an MCAT name before uploading datasets.'
      });
      return;
    }

    // Update dataset status to uploading
    setDatasets(prev => ({
      ...prev,
      [datasetId]: { ...prev[datasetId], file, status: 'uploading' }
    }));

    const loadingId = addNotification({
      type: 'loading',
      title: 'Processing Dataset',
      message: `Analyzing ${file.name} with Gemini AI...`,
      dismissible: false,
      progress: 0
    });

    try {
      // Simulate upload progress
      for (let progress = 0; progress <= 80; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setNotifications(prev => 
          prev.map(n => n.id === loadingId ? { ...n, progress } : n)
        );
      }

      // Get the dataset type
      const datasetType = datasetTypes.find(dt => dt.id === datasetId);
      
      // Use Gemini API to analyze the dataset
      const results = await analyzeDataset(mcatName, file, datasetId);
      const analysisId = Date.now().toString();

      // Complete progress
      setNotifications(prev => 
        prev.map(n => n.id === loadingId ? { ...n, progress: 100 } : n)
      );

      setDatasets(prev => ({
        ...prev,
        [datasetId]: { 
          ...prev[datasetId], 
          status: 'completed', 
          results,
          analysisId 
        }
      }));

      removeNotification(loadingId);
      addNotification({
        type: 'success',
        title: 'Analysis Complete',
        message: `Successfully analyzed ${file.name}. Found ${results.topISQs.length} top ISQs.`
      });

    } catch (error) {
      console.error('Analysis error:', error);
      setDatasets(prev => ({
        ...prev,
        [datasetId]: { ...prev[datasetId], status: 'error' }
      }));

      removeNotification(loadingId);
      addNotification({
        type: 'error',
        title: 'Analysis Failed',
        message: error.message || 'Failed to analyze the dataset. Please try again.'
      });
    }
  }, [mcatName, addNotification, removeNotification, datasetTypes]);

  const handleFileRemove = useCallback((datasetId) => {
    setDatasets(prev => ({
      ...prev,
      [datasetId]: { file: null, status: 'empty', results: null, analysisId: null }
    }));

    addNotification({
      type: 'info',
      message: 'Dataset removed successfully.'
    });
  }, [addNotification]);

  const handleTriangulation = useCallback(async () => {
    const uploadedDatasets = Object.entries(datasets)
      .filter(([_, d]) => d.status === 'completed')
      .map(([id, d]) => ({ id, ...d.results }));
    
    if (uploadedDatasets.length < 2) {
      addNotification({
        type: 'warning',
        title: 'Insufficient Data',
        message: 'At least 2 datasets are required for triangulation analysis.'
      });
      return;
    }

    setTriangulationStatus('processing');
    
    const loadingId = addNotification({
      type: 'loading',
      title: 'Triangulation Analysis',
      message: 'Cross-analyzing datasets to identify weighted ISQ priorities...',
      dismissible: false,
      progress: 0
    });

    try {
      // Simulate triangulation progress
      for (let progress = 0; progress <= 80; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 400));
        setNotifications(prev => 
          prev.map(n => n.id === loadingId ? { ...n, progress } : n)
        );
      }

      // Use Gemini API for triangulation
      const results = await triangulateDatasets(uploadedDatasets, mcatName);
      
      // Complete progress
      setNotifications(prev => 
        prev.map(n => n.id === loadingId ? { ...n, progress: 100 } : n)
      );
      
      setTriangulationResults(results);
      setTriangulationStatus('completed');

      removeNotification(loadingId);
      addNotification({
        type: 'success',
        title: 'Triangulation Complete',
        message: `Successfully triangulated ${results.datasetsUsed} datasets. Generated weighted ISQ rankings.`
      });

    } catch (error) {
      console.error('Triangulation error:', error);
      setTriangulationStatus('error');
      removeNotification(loadingId);
      addNotification({
        type: 'error',
        title: 'Triangulation Failed',
        message: error.message || 'Failed to complete triangulation analysis. Please try again.'
      });
    }
  }, [datasets, mcatName, addNotification, removeNotification]);

  const handleStartNewAnalysis = useCallback(() => {
    setMcatName('');
    setDatasets({
      'internal-search': { file: null, status: 'empty', results: null, analysisId: null },
      'lms-chat': { file: null, status: 'empty', results: null, analysisId: null },
      'blni-comments': { file: null, status: 'empty', results: null, analysisId: null },
      'pns-transcript': { file: null, status: 'empty', results: null, analysisId: null },
      'whatsapp-conversations': { file: null, status: 'empty', results: null, analysisId: null }
    });
    setTriangulationResults(null);
    setTriangulationStatus('idle');
    setNotifications([]);

    addNotification({
      type: 'info',
      message: 'Analysis workspace has been reset. Ready for new analysis.'
    });
  }, [addNotification]);

  const uploadedDatasetsCount = Object.values(datasets).filter(d => d.status === 'completed').length;
  const canTriangulate = uploadedDatasetsCount >= 2 && triangulationStatus !== 'processing';

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <StatusNotificationBar 
        notifications={notifications}
        onDismiss={removeNotification}
      />
      
      <main className="pt-16">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="BarChart3" size={24} color="white" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-semibold text-text-primary">
                Buyer Spec Extractor Dashboard
                </h1>
                <p className="text-text-secondary">
                  Extract and triangulate Important Specifications &amp; Options from multiple datasets
                </p>
              </div>
            </div>
          </div>

          {/* MCAT Input Section */}
          <MCATInputSection 
            mcatName={mcatName}
            onMcatChange={setMcatName}
            geminiApiKey={geminiApiKey}
            onApiKeyChange={setGeminiApiKey}
          />

          {/* Dataset Upload Cards */}
          <div className="mb-8">
            <h2 className="text-lg font-heading font-medium text-text-primary mb-6">
              Dataset Upload &amp; Analysis
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {datasetTypes.map((datasetType) => (
                <DatasetUploadCard
                  key={datasetType.id}
                  datasetType={datasetType}
                  dataset={datasets[datasetType.id]}
                  onFileUpload={(file) => handleFileUpload(datasetType.id, file)}
                  onFileRemove={() => handleFileRemove(datasetType.id)}
                  disabled={!mcatName.trim()}
                />
              ))}
            </div>
          </div>

          {/* Individual Analysis Results */}
          {Object.entries(datasets).some(([_, dataset]) => dataset.status === 'completed') && (
            <div className="mb-8">
              <h2 className="text-lg font-heading font-medium text-text-primary mb-6">
                Individual Dataset Analysis
              </h2>
              <div className="space-y-4">
                {Object.entries(datasets).map(([datasetId, dataset]) => {
                  if (dataset.status !== 'completed') return null;
                  
                  const datasetType = datasetTypes.find(dt => dt.id === datasetId);
                  return (
                    <AnalysisResultsSection
                      key={datasetId}
                      datasetType={datasetType}
                      results={dataset.results}
                      analysisId={dataset.analysisId}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Triangulation Section */}
          <TriangulationSection
            uploadedDatasetsCount={uploadedDatasetsCount}
            canTriangulate={canTriangulate}
            triangulationStatus={triangulationStatus}
            triangulationResults={triangulationResults}
            onTriangulate={handleTriangulation}
          />

          {/* Reset Analysis */}
          {(uploadedDatasetsCount > 0 || triangulationResults) && (
            <div className="mt-12 pt-8 border-t border-border">
              <div className="text-center">
                <button
                  onClick={handleStartNewAnalysis}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-secondary text-white rounded-md font-medium hover:bg-secondary/90 transition-colors duration-150 focus-ring"
                >
                  <Icon name="RotateCcw" size={20} />
                  <span>Start New Analysis</span>
                </button>
                <p className="text-sm text-text-secondary mt-2">
                  This will reset all uploaded datasets and analysis results
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MainAnalysisDashboard;