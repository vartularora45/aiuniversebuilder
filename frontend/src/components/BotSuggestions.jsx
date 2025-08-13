import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Brain,
  ArrowRight,
  X,
  MessageSquare,
  Bot,
  Lightbulb,
  Zap,
  Star,
  Loader,
  Tag,
  Clock,
  Code,
  Database
} from 'lucide-react';

const BotSuggestions = ({ 
  generatedBotData, 
  onSuggestionSelect, 
  onClose, 
  isVisible,
  userToken,
  isGenerating = false
}) => {
  const [keywords, setKeywords] = useState([]);
  const [suggestedModels, setSuggestedModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simple model display info (since your backend just returns model names)
  const getModelIcon = (modelName) => {
    if (modelName.includes('bert') || modelName.includes('distil')) {
      return <Brain className="w-5 h-5" />;
    }
    if (modelName.includes('gpt')) {
      return <Lightbulb className="w-5 h-5" />;
    }
    if (modelName.includes('bart')) {
      return <MessageSquare className="w-5 h-5" />;
    }
    return <Bot className="w-5 h-5" />;
  };

  const getModelColor = (modelName) => {
    if (modelName.includes('bert') || modelName.includes('distil')) {
      return 'from-blue-500 to-indigo-500';
    }
    if (modelName.includes('gpt')) {
      return 'from-yellow-500 to-orange-500';
    }
    if (modelName.includes('bart')) {
      return 'from-green-500 to-teal-500';
    }
    return 'from-purple-500 to-pink-500';
  };

  // Fetch suggestions from your exact backend endpoint
  const fetchSuggestions = async () => {
    if (!generatedBotData) return;
    
    setLoading(true);
    setError(null);

    try {
      const apiUrl= import.meta.env.VITE_URL 
      
      const response = await fetch(`${apiUrl}/model/suggest-model`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(userToken && { Authorization: `Bearer ${userToken}` })
        },
        body: JSON.stringify({
          idea: generatedBotData.initialPrompt || 
                generatedBotData.description || 
                generatedBotData.name || 
                'AI chatbot'
        })
      });

      const data = await response.json();
      console.log('Backend Response:', data);

      if (!response.ok) {
        throw new Error(data.error || data.details || `HTTP ${response.status}`);
      }

      // Your backend returns: { keywords: [...], suggested_models: [...] }
      setKeywords(data.keywords || []);
      setSuggestedModels(data.suggested_models || []);
      
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      setError(err.message || 'Failed to fetch model suggestions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible && generatedBotData) {
      const timer = setTimeout(fetchSuggestions, 1000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, generatedBotData]);

  const handleModelSelect = (modelName) => {
    // Create suggestion object for parent component
    const suggestion = {
      name: modelName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      model: modelName,
      description: `${modelName} AI model`,
      keywords: keywords,
      type: 'huggingface-model'
    };
    
    onSuggestionSelect(suggestion);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[70]"
      >
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.95 }}
          className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-purple-500/20 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <motion.h2
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-300 flex items-center gap-3"
              >
                <Sparkles className="w-8 h-8 text-purple-400" />
                {isGenerating ? 'AI Model Suggestions' : 'Recommended Models'}
              </motion.h2>
              <motion.p
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-400 mt-2"
              >
                Based on your bot idea: "{generatedBotData?.name || 'AI Bot'}"
              </motion.p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-700/50 transition-colors text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Generation Status */}
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-4 mb-6"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-5 h-5 border-2 border-purple-400/30 border-t-purple-400 rounded-full"
                />
                <div>
                  <p className="text-purple-300 font-semibold">Bot Generation in Progress</p>
                  <p className="text-gray-400 text-sm">Explore these model suggestions while we work</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Loading State */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full mb-4"
              />
              <p className="text-gray-400 text-lg">Analyzing your bot idea...</p>
              <p className="text-gray-500 text-sm mt-2">Finding the best AI models</p>
            </motion.div>
          )}

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 mb-6"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <div>
                  <p className="text-red-300 font-semibold">Error Loading Suggestions</p>
                  <p className="text-red-400/80 text-sm mt-1">{error}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={fetchSuggestions}
                className="mt-4 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 rounded-lg transition-colors text-red-300"
              >
                Retry
              </motion.button>
            </motion.div>
          )}

          {/* Keywords Section */}
          {!loading && !error && keywords.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Detected Keywords</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full text-sm text-purple-300"
                  >
                    {keyword}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Models Grid */}
          {!loading && !error && suggestedModels.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Database className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-semibold text-white">Suggested Models</h3>
                <span className="text-sm text-gray-400">({suggestedModels.length} found)</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestedModels.map((modelName, index) => (
                  <motion.div
                    key={`${modelName}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ 
                      scale: 1.02, 
                      boxShadow: "0 0 20px rgba(168, 85, 247, 0.2)" 
                    }}
                    className="group relative bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 cursor-pointer hover:border-purple-500/50 transition-all duration-300"
                    onClick={() => handleModelSelect(modelName)}
                  >
                    {/* Recommended Badge */}
                    {index === 0 && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full p-1">
                        <Star className="w-4 h-4 text-white" />
                      </div>
                    )}

                    <div className="flex items-start gap-4">
                      {/* Model Icon */}
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${getModelColor(modelName)} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        {getModelIcon(modelName)}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Model Name */}
                        <h4 className="text-lg font-semibold text-white mb-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all">
                          {modelName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </h4>
                        
                        {/* Technical Name */}
                        <p className="text-xs text-gray-500 font-mono mb-3 bg-gray-900/30 rounded px-2 py-1 inline-block">
                          {modelName}
                        </p>

                        {/* Description */}
                        <p className="text-gray-400 text-sm mb-4">
                          {modelName.includes('distilbert') ? 'Fast and efficient text understanding model' :
                           modelName.includes('bert') ? 'Powerful bidirectional text analysis model' :
                           modelName.includes('gpt2') ? 'Advanced text generation model' :
                           modelName.includes('distilgpt2') ? 'Lightweight text generation model' :
                           modelName.includes('bart') ? 'Text classification and inference model' :
                           'Advanced AI model for your use case'}
                        </p>

                        {/* Action */}
                        <motion.div
                          whileHover={{ x: 5 }}
                          className="flex items-center gap-2 text-purple-400 group-hover:text-cyan-400 transition-colors"
                        >
                          <span className="text-sm font-medium">
                            {isGenerating ? 'Queue this model' : 'Use this model'}
                          </span>
                          <ArrowRight className="w-4 h-4" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* No Results */}
          {!loading && !error && suggestedModels.length === 0 && keywords.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <Brain className="w-20 h-20 text-gray-600 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-400 mb-3">
                No suggestions found
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                We couldn't analyze your bot idea. Please try again or check your connection.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={fetchSuggestions}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-full font-bold transition-colors"
              >
                Try Again
              </motion.button>
            </motion.div>
          )}

          {/* Footer */}
          {(!loading && !error && (suggestedModels.length > 0 || keywords.length > 0)) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex gap-4 mt-8 pt-6 border-t border-gray-700/30"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={fetchSuggestions}
                disabled={loading}
                className="px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 rounded-full font-bold border border-gray-600/50 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Zap className="w-5 h-5" />
                Refresh Suggestions
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full font-bold transition-all"
              >
                {isGenerating ? 'Continue with Main Bot' : 'Close'}
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BotSuggestions;