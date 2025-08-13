import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Square, RefreshCw, Terminal, Database, 
  AlertTriangle, CheckCircle, Loader2, Send, 
  Code, Server, Zap, Eye, EyeOff
} from 'lucide-react';

const BackendTester = ({ 
  backendCode, 
  isVisible, 
  onClose, 
  onError 
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverUrl, setServerUrl] = useState('http://localhost:3001');
  const [endpoints, setEndpoints] = useState([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [requestData, setRequestData] = useState('');
  const [responseData, setResponseData] = useState('');
  const [responseStatus, setResponseStatus] = useState(null);
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [error, setError] = useState(null);
  const [showCode, setShowCode] = useState(false);

  // Extract endpoints from backend code
  const extractEndpoints = (code) => {
    const endpoints = [];
    
    // Look for Express.js route definitions
    const routePatterns = [
      /app\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]/g,
      /router\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]/g,
      /\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]/g
    ];

    routePatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(code)) !== null) {
        const method = match[1].toUpperCase();
        const path = match[2];
        
        // Skip if already added
        if (!endpoints.find(ep => ep.method === method && ep.path === path)) {
          endpoints.push({
            method,
            path,
            fullPath: `${serverUrl}${path}`,
            description: getEndpointDescription(method, path)
          });
        }
      }
    });

    return endpoints;
  };

  // Generate description for endpoint
  const getEndpointDescription = (method, path) => {
    const descriptions = {
      GET: 'Retrieve data',
      POST: 'Create or send data',
      PUT: 'Update data',
      DELETE: 'Remove data',
      PATCH: 'Partially update data'
    };

    if (path.includes('chat') || path.includes('message')) {
      return `${descriptions[method]} - Chat functionality`;
    } else if (path.includes('user')) {
      return `${descriptions[method]} - User management`;
    } else if (path.includes('health') || path.includes('status')) {
      return `${descriptions[method]} - Health check`;
    } else {
      return descriptions[method];
    }
  };

  // Test endpoint
  const testEndpoint = async (endpoint) => {
    if (!endpoint) return;

    setIsLoadingResponse(true);
    setError(null);
    setResponseData('');
    setResponseStatus(null);

    try {
      const options = {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
        }
      };

      // Add body for POST/PUT/PATCH requests
      if (['POST', 'PUT', 'PATCH'].includes(endpoint.method) && requestData.trim()) {
        try {
          options.body = requestData;
        } catch (err) {
          throw new Error('Invalid JSON in request data');
        }
      }

      const response = await fetch(endpoint.fullPath, options);
      const data = await response.text();

      setResponseStatus(response.status);
      
      try {
        // Try to parse as JSON
        const jsonData = JSON.parse(data);
        setResponseData(JSON.stringify(jsonData, null, 2));
      } catch {
        // If not JSON, display as text
        setResponseData(data);
      }

    } catch (err) {
      setError(err.message);
      setResponseStatus('ERROR');
    } finally {
      setIsLoadingResponse(false);
    }
  };

  // Start backend server (simulation)
  const startBackend = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Extract endpoints from code
      const extractedEndpoints = extractEndpoints(backendCode);
      setEndpoints(extractedEndpoints);

      if (extractedEndpoints.length === 0) {
        throw new Error('No API endpoints found in the backend code');
      }

      // Simulate server startup
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsRunning(true);
      setSelectedEndpoint(extractedEndpoints[0]);

    } catch (err) {
      setError(err.message);
      if (onError) onError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Stop backend server
  const stopBackend = () => {
    setIsRunning(false);
    setEndpoints([]);
    setSelectedEndpoint(null);
    setResponseData('');
    setResponseStatus(null);
    setError(null);
  };

  // Generate sample request data
  const generateSampleData = (endpoint) => {
    if (!endpoint) return;

    const samples = {
      'POST /chat': JSON.stringify({
        message: "Hello, how are you?",
        userId: "user123",
        timestamp: new Date().toISOString()
      }, null, 2),
      'POST /message': JSON.stringify({
        content: "Test message",
        sender: "user",
        roomId: "room1"
      }, null, 2),
      'POST /api/chat': JSON.stringify({
        prompt: "What's the weather like?",
        context: "User is asking about weather"
      }, null, 2)
    };

    const key = `${endpoint.method} ${endpoint.path}`;
    return samples[key] || JSON.stringify({ test: "data" }, null, 2);
  };

  useEffect(() => {
    if (isVisible && backendCode && !isRunning) {
      startBackend();
    }
  }, [isVisible, backendCode]);

  return (
    <AnimatePresence>
      {isVisible && (
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
            className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-gray-700/50 rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg">
                  <Server className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Backend API Tester</h2>
                  <p className="text-gray-400 text-sm">Test your generated Node.js backend</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCode(!showCode)}
                  className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors"
                >
                  {showCode ? <EyeOff className="w-4 h-4" /> : <Code className="w-4 h-4" />}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={isRunning ? stopBackend : startBackend}
                  disabled={isLoading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isRunning
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  } disabled:opacity-50`}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isRunning ? (
                    <Square className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  {isLoading ? 'Starting...' : isRunning ? 'Stop Server' : 'Start Server'}
                </motion.button>

                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Status Bar */}
            <div className="flex items-center justify-between p-3 border-b border-gray-700/50 bg-gray-800/30">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-400' : 'bg-red-400'}`} />
                  <span className="text-sm text-gray-300">
                    {isRunning ? 'Server Running' : 'Server Stopped'}
                  </span>
                </div>

                {isRunning && (
                  <div className="flex items-center gap-2 text-blue-400">
                    <Database className="w-4 h-4" />
                    <span className="text-sm">{endpoints.length} endpoints found</span>
                  </div>
                )}

                {error && (
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}
              </div>

              <div className="text-sm text-gray-400">
                Base URL: {serverUrl}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Panel - Endpoints */}
              <div className="w-80 border-r border-gray-700/50 bg-gray-900/30">
                <div className="p-4 border-b border-gray-700/50">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <Terminal className="w-4 h-4" />
                    API Endpoints
                  </h3>
                </div>
                
                <div className="overflow-y-auto h-full">
                  {endpoints.length === 0 ? (
                    <div className="p-4 text-center text-gray-400">
                      <Server className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No endpoints found</p>
                      <p className="text-xs mt-1">Start the server to scan for endpoints</p>
                    </div>
                  ) : (
                    endpoints.map((endpoint, index) => (
                      <motion.button
                        key={index}
                        onClick={() => {
                          setSelectedEndpoint(endpoint);
                          setRequestData(generateSampleData(endpoint));
                        }}
                        className={`w-full p-4 text-left hover:bg-gray-800/30 transition-colors border-b border-gray-700/30 ${
                          selectedEndpoint?.path === endpoint.path && selectedEndpoint?.method === endpoint.method
                            ? 'bg-blue-600/20 border-blue-500/30'
                            : ''
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            endpoint.method === 'GET' ? 'bg-green-500/20 text-green-300' :
                            endpoint.method === 'POST' ? 'bg-blue-500/20 text-blue-300' :
                            endpoint.method === 'PUT' ? 'bg-yellow-500/20 text-yellow-300' :
                            endpoint.method === 'DELETE' ? 'bg-red-500/20 text-red-300' :
                            'bg-gray-500/20 text-gray-300'
                          }`}>
                            {endpoint.method}
                          </span>
                          <span className="text-white font-medium">{endpoint.path}</span>
                        </div>
                        <p className="text-xs text-gray-400">{endpoint.description}</p>
                      </motion.button>
                    ))
                  )}
                </div>
              </div>

              {/* Right Panel - Request/Response */}
              <div className="flex-1 flex flex-col">
                {selectedEndpoint ? (
                  <>
                    {/* Request Section */}
                    <div className="p-4 border-b border-gray-700/50">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-white flex items-center gap-2">
                          <Send className="w-4 h-4" />
                          Request
                        </h3>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => testEndpoint(selectedEndpoint)}
                          disabled={!isRunning || isLoadingResponse}
                          className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm disabled:opacity-50"
                        >
                          {isLoadingResponse ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Zap className="w-3 h-3" />
                          )}
                          Send Request
                        </motion.button>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <span className="font-medium">{selectedEndpoint.method}</span>
                          <span>{selectedEndpoint.fullPath}</span>
                        </div>
                        
                        {['POST', 'PUT', 'PATCH'].includes(selectedEndpoint.method) && (
                          <div>
                            <label className="block text-sm text-gray-300 mb-2">Request Body (JSON)</label>
                            <textarea
                              value={requestData}
                              onChange={(e) => setRequestData(e.target.value)}
                              className="w-full h-32 bg-gray-800/50 border border-gray-600/50 rounded-lg p-3 text-sm text-white font-mono resize-none"
                              placeholder="Enter JSON request body..."
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Response Section */}
                    <div className="flex-1 p-4">
                      <h3 className="font-semibold text-white flex items-center gap-2 mb-3">
                        <Database className="w-4 h-4" />
                        Response
                      </h3>
                      
                      {responseStatus && (
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            responseStatus === 200 ? 'bg-green-500/20 text-green-300' :
                            responseStatus >= 400 ? 'bg-red-500/20 text-red-300' :
                            'bg-yellow-500/20 text-yellow-300'
                          }`}>
                            {responseStatus}
                          </span>
                          <span className="text-sm text-gray-400">
                            {responseStatus === 200 ? 'Success' : 
                             responseStatus >= 400 ? 'Error' : 'Info'}
                          </span>
                        </div>
                      )}
                      
                      <div className="bg-gray-800/50 border border-gray-600/50 rounded-lg p-3 h-full">
                        <pre className="text-sm text-gray-300 font-mono overflow-auto h-full">
                          {responseData || 'No response data'}
                        </pre>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <Terminal className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Select an endpoint</p>
                      <p className="text-sm mt-2">Choose an endpoint from the list to test it</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Code Preview (if enabled) */}
            {showCode && (
              <div className="h-64 border-t border-gray-700/50 bg-gray-900/50">
                <div className="p-3 border-b border-gray-700/50">
                  <h3 className="font-semibold text-white">Backend Code Preview</h3>
                </div>
                <div className="p-4 overflow-auto h-full">
                  <pre className="text-xs text-gray-300 font-mono">
                    <code>{backendCode}</code>
                  </pre>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BackendTester;
