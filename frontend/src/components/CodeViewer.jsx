import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code, Copy, Download, FileText, Server, Settings, 
  ChevronRight, ChevronDown, Check, Eye, Layers,
  Terminal, Globe, Database, Folder, File, Palette,
  Play, Monitor, Smartphone, Zap
} from 'lucide-react';
import PreviewIframe from './PreviewIframe';
import BackendTester from './BackendTester';

const CodeViewer = ({ generatedBot, botResponse, onClose }) => {
  const [activeTab, setActiveTab] = useState('frontend');
  const [expandedFiles, setExpandedFiles] = useState({});
  const [copiedFiles, setCopiedFiles] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [showBackendTester, setShowBackendTester] = useState(false);

  // Toggle file expansion
  const toggleFile = (fileName) => {
    setExpandedFiles(prev => ({
      ...prev,
      [fileName]: !prev[fileName]
    }));
  };

  // Copy code to clipboard
  const copyToClipboard = async (code, fileName) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedFiles(prev => ({ ...prev, [fileName]: true }));
      setTimeout(() => {
        setCopiedFiles(prev => ({ ...prev, [fileName]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Download file
  const downloadFile = (code, fileName) => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Get file extension for syntax highlighting class
  const getFileExtension = (fileName) => {
    return fileName.split('.').pop()?.toLowerCase() || 'txt';
  };

  // Get icon for file type
  const getFileIcon = (fileName) => {
    const ext = getFileExtension(fileName);
    const iconMap = {
      'js': <Terminal className="w-4 h-4 text-yellow-400" />,
      'jsx': <Code className="w-4 h-4 text-blue-400" />,
      'css': <Palette className="w-4 h-4 text-pink-400" />,
      'json': <Database className="w-4 h-4 text-green-400" />,
      'html': <Globe className="w-4 h-4 text-orange-400" />,
      'md': <FileText className="w-4 h-4 text-gray-400" />,
    };
    return iconMap[ext] || <File className="w-4 h-4 text-gray-400" />;
  };

  // FIXED: Get files from the correct data structure
  const getFiles = (section) => {
    // Try botResponse structure first (from Dashboard)
    if (botResponse?.data?.botFiles?.[section]) {
      const sectionData = botResponse.data.botFiles[section];
      
      // Handle different possible structures
      if (sectionData.files && typeof sectionData.files === 'object') {
        return sectionData.files;
      }
      
      if (typeof sectionData === 'object' && sectionData !== null) {
        // Filter out non-file properties if any
        const files = {};
        Object.entries(sectionData).forEach(([key, value]) => {
          if (typeof value === 'string' && key !== 'structure') {
            files[key] = value;
          }
        });
        return files;
      }
    }
    
    // Fallback to generatedBot structure (legacy)
    if (generatedBot?.[section]?.files) {
      return generatedBot[section].files;
    }
    
    return {};
  };

  // Get frontend code for preview
  const getFrontendCode = () => {
    const frontendFiles = getFiles('frontend');
    // Look for main React component files
    const mainFiles = ['App.jsx', 'App.js', 'index.jsx', 'index.js', 'main.jsx', 'main.js'];
    
    for (const fileName of mainFiles) {
      if (frontendFiles[fileName]) {
        return frontendFiles[fileName];
      }
    }
    
    // Return first file if no main file found
    const firstFile = Object.values(frontendFiles)[0];
    return firstFile || '';
  };

  // Get backend code for testing
  const getBackendCode = () => {
    const backendFiles = getFiles('backend');
    // Look for main server files
    const mainFiles = ['server.js', 'app.js', 'index.js', 'main.js'];
    
    for (const fileName of mainFiles) {
      if (backendFiles[fileName]) {
        return backendFiles[fileName];
      }
    }
    
    // Return first file if no main file found
    const firstFile = Object.values(backendFiles)[0];
    return firstFile || '';
  };

  const tabs = [
    {
      id: 'frontend',
      label: 'Frontend',
      icon: <Globe className="w-5 h-5" />,
      files: getFiles('frontend'),
      color: 'blue'
    },
    {
      id: 'backend',
      label: 'Backend',
      icon: <Server className="w-5 h-5" />,
      files: getFiles('backend'),
      color: 'green'
    },
    {
      id: 'config',
      label: 'Config',
      icon: <Settings className="w-5 h-5" />,
      files: getFiles('config'),
      color: 'purple'
    }
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  // Download all files as ZIP (simplified - creates individual downloads)
  const downloadAll = () => {
    tabs.forEach(tab => {
      Object.entries(tab.files).forEach(([fileName, code]) => {
        setTimeout(() => downloadFile(code, `${tab.label.toLowerCase()}_${fileName}`), 100);
      });
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.95 }}
        className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-gray-700/50 rounded-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg">
              <Code className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Generated Bot Code</h2>
              <p className="text-gray-400">Review and download your AI bot files</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Preview Buttons */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowPreview(true)}
              disabled={!getFrontendCode()}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
            >
              <Monitor className="w-4 h-4" />
              Preview Frontend
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowBackendTester(true)}
              disabled={!getBackendCode()}
              className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
            >
              <Terminal className="w-4 h-4" />
              Test Backend
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={downloadAll}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg font-medium flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download All
            </motion.button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Debug Info (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="p-4 bg-gray-900/50 border-b border-gray-700/50">
            <details className="text-xs">
              <summary className="cursor-pointer text-gray-400 mb-2">Debug: Data Structure</summary>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-yellow-400 mb-1">botResponse:</div>
                  <pre className="bg-black/40 p-2 rounded overflow-auto max-h-32">
                    {JSON.stringify(botResponse?.data?.botFiles, null, 2)}
                  </pre>
                </div>
                <div>
                  <div className="text-blue-400 mb-1">generatedBot:</div>
                  <pre className="bg-black/40 p-2 rounded overflow-auto max-h-32">
                    {JSON.stringify(generatedBot, null, 2)}
                  </pre>
                </div>
                <div>
                  <div className="text-green-400 mb-1">Current Files:</div>
                  <pre className="bg-black/40 p-2 rounded overflow-auto max-h-32">
                    {JSON.stringify({
                      frontend: Object.keys(getFiles('frontend')),
                      backend: Object.keys(getFiles('backend')),
                      config: Object.keys(getFiles('config'))
                    }, null, 2)}
                  </pre>
                </div>
              </div>
            </details>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-700/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-4 font-medium transition-all relative ${
                activeTab === tab.id
                  ? 'text-white bg-gray-800/50'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
              }`}
            >
              {tab.icon}
              {tab.label}
              <span className={`px-2 py-1 rounded-full text-xs ${
                tab.color === 'blue' ? 'bg-blue-500/20 text-blue-300' :
                tab.color === 'green' ? 'bg-green-500/20 text-green-300' :
                'bg-purple-500/20 text-purple-300'
              }`}>
                {Object.keys(tab.files).length}
              </span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500"
                />
              )}
            </button>
          ))}
        </div>

        {/* File Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* File List */}
          <div className="w-80 border-r border-gray-700/50 bg-gray-900/30">
            <div className="p-4 border-b border-gray-700/50">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Folder className="w-4 h-4" />
                {activeTabData?.label} Files
              </h3>
            </div>
            <div className="overflow-y-auto h-full">
              {Object.entries(activeTabData?.files || {}).map(([fileName, code]) => (
                <motion.div
                  key={fileName}
                  className="border-b border-gray-700/30 last:border-b-0"
                >
                  <button
                    onClick={() => toggleFile(fileName)}
                    className="w-full p-4 text-left hover:bg-gray-800/30 transition-colors flex items-center gap-3"
                  >
                    {getFileIcon(fileName)}
                    <span className="text-white font-medium flex-1">{fileName}</span>
                    {expandedFiles[fileName] ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {expandedFiles[fileName] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 bg-gray-900/50 border-t border-gray-700/30">
                          <div className="flex gap-2 mb-3">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => copyToClipboard(code, fileName)}
                              className="flex items-center gap-2 px-3 py-1 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg text-xs transition-colors"
                            >
                              {copiedFiles[fileName] ? (
                                <Check className="w-3 h-3 text-green-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                              {copiedFiles[fileName] ? 'Copied!' : 'Copy'}
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => downloadFile(code, fileName)}
                              className="flex items-center gap-2 px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-lg text-xs transition-colors"
                            >
                              <Download className="w-3 h-3" />
                              Download
                            </motion.button>
                          </div>
                          
                          <pre className="text-xs text-gray-300 bg-black/40 p-3 rounded-lg overflow-x-auto max-h-40">
                            <code>{typeof code === 'string' ? code.slice(0, 500) + (code.length > 500 ? '...' : '') : 'Invalid content'}</code>
                          </pre>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Code Display */}
          <div className="flex-1 flex flex-col">
            {Object.keys(activeTabData?.files || {}).length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Layers className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No files in {activeTabData?.label}</p>
                  <p className="text-sm mt-2">This section doesn't contain any generated files.</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-hidden">
                {Object.entries(activeTabData?.files || {}).map(([fileName, code]) => 
                  expandedFiles[fileName] && (
                    <motion.div
                      key={fileName}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-full flex flex-col"
                    >
                      {/* File Header */}
                      <div className="p-4 border-b border-gray-700/50 bg-gray-800/30">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getFileIcon(fileName)}
                            <span className="font-semibold text-white">{fileName}</span>
                            <span className="px-2 py-1 bg-gray-700/50 rounded text-xs text-gray-300">
                              {getFileExtension(fileName).toUpperCase()}
                            </span>
                            <span className="text-xs text-gray-400">
                              {typeof code === 'string' ? `${code.length} chars` : 'Invalid'}
                            </span>
                          </div>
                          
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => copyToClipboard(code, fileName)}
                              className="flex items-center gap-2 px-3 py-1 bg-gray-600/50 hover:bg-gray-500/50 rounded-lg text-sm transition-colors"
                            >
                              {copiedFiles[fileName] ? (
                                <Check className="w-4 h-4 text-green-400" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                              {copiedFiles[fileName] ? 'Copied!' : 'Copy'}
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => downloadFile(code, fileName)}
                              className="flex items-center gap-2 px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-lg text-sm transition-colors"
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </motion.button>
                          </div>
                        </div>
                      </div>

                      {/* Code Content */}
                      <div className="flex-1 overflow-auto">
                        <pre className="p-6 text-sm text-gray-300 bg-black/20 h-full">
                          <code className="whitespace-pre-wrap">
                            {typeof code === 'string' ? code : 'Error: Invalid file content'}
                          </code>
                        </pre>
                      </div>
                    </motion.div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Frontend Preview Modal */}
      <PreviewIframe
        frontendCode={getFrontendCode()}
        backendCode={getBackendCode()}
        isVisible={showPreview}
        onClose={() => setShowPreview(false)}
        onError={(error) => console.error('Preview error:', error)}
      />

      {/* Backend Tester Modal */}
      <BackendTester
        backendCode={getBackendCode()}
        isVisible={showBackendTester}
        onClose={() => setShowBackendTester(false)}
        onError={(error) => console.error('Backend tester error:', error)}
      />
    </motion.div>
  );
};

export default CodeViewer;