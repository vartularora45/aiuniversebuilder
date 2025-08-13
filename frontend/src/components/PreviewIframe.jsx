// src/components/PreviewIframe.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Square, RefreshCw, Maximize2, Minimize2, 
  AlertTriangle, CheckCircle, Loader2, Monitor, Smartphone, Server
} from 'lucide-react';

const PreviewIframe = ({ 
  frontendCode, 
  backendCode, 
  isVisible, 
  onClose, 
  onError 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [backendStatus, setBackendStatus] = useState('stopped');
  const iframeRef = useRef(null);

  // Debug logging
  useEffect(() => {
    console.log('PreviewIframe props:', {
      frontendCode: frontendCode ? `Length: ${frontendCode.length}` : 'null',
      backendCode: backendCode ? `Length: ${backendCode.length}` : 'null',
      isVisible,
      onClose: !!onClose,
      onError: !!onError
    });
  }, [frontendCode, backendCode, isVisible, onClose, onError]);

  // Generate a complete working preview with both frontend and backend
  const generatePreviewHTML = (reactCode, nodeCode) => {
    console.log('Generating complete preview HTML');
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Complete Bot Preview</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>
    <style>
        body { 
            margin: 0; 
            padding: 0; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .chat-container {
            max-width: 800px;
            margin: 20px auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            overflow: hidden;
        }
        .chat-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            text-align: center;
        }
        .chat-messages {
            height: 400px;
            overflow-y: auto;
            padding: 20px;
            background: #f8f9fa;
        }
        .message {
            margin-bottom: 15px;
            display: flex;
            align-items: flex-start;
        }
        .message.bot {
            justify-content: flex-start;
        }
        .message.user {
            justify-content: flex-end;
        }
        .message-content {
            max-width: 70%;
            padding: 12px 16px;
            border-radius: 18px;
            word-wrap: break-word;
        }
        .message.bot .message-content {
            background: #007bff;
            color: white;
        }
        .message.user .message-content {
            background: #e9ecef;
            color: #333;
        }
        .chat-input {
            padding: 20px;
            background: white;
            border-top: 1px solid #e9ecef;
        }
        .input-group {
            display: flex;
            gap: 10px;
        }
        .input-group input {
            flex: 1;
            padding: 12px;
            border: 1px solid #ced4da;
            border-radius: 25px;
            font-size: 14px;
        }
        .input-group button {
            padding: 12px 24px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-weight: 500;
        }
        .input-group button:hover {
            background: #0056b3;
        }
        .suggested-questions {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 15px;
        }
        .question-btn {
            padding: 8px 16px;
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 20px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s;
        }
        .question-btn:hover {
            background: #e9ecef;
        }
        .typing-indicator {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 12px 16px;
            background: #f8f9fa;
            border-radius: 18px;
            max-width: 70%;
        }
        .typing-dot {
            width: 8px;
            height: 8px;
            background: #6c757d;
            border-radius: 50%;
            animation: typing 1.4s infinite;
        }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typing {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-10px); }
        }
        .status-bar {
            background: #28a745;
            color: white;
            padding: 8px 20px;
            text-align: center;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div id="root"></div>
    
    <script type="text/babel">
        // Complete Chatbot Component with Backend Integration
        function CompleteChatbot() {
            const [messages, setMessages] = React.useState([
                {
                    id: 1,
                    text: "Hello! I'm your AI chatbot. I can help you with questions, provide information, and assist with various tasks. How can I help you today?",
                    isBot: true,
                    timestamp: new Date()
                }
            ]);
            const [inputMessage, setInputMessage] = React.useState('');
            const [isTyping, setIsTyping] = React.useState(false);
            const [isConnected, setIsConnected] = React.useState(true);
            
            // Mock backend responses - this simulates the actual backend
            const mockBackendResponses = {
                "hello": "Hello! How can I assist you today?",
                "how are you": "I'm doing great, thank you for asking! I'm here to help you with any questions or tasks you might have.",
                "what can you do": "I can help you with various tasks like answering questions, providing information, solving problems, and engaging in conversations. Just ask me anything!",
                "help": "I'm here to help! You can ask me questions, request information, or just chat with me. What would you like to know?",
                "thanks": "You're welcome! Is there anything else I can help you with?",
                "bye": "Goodbye! Feel free to come back if you need any help in the future.",
                "weather": "I can't check real-time weather, but I can help you find weather information or answer other questions!",
                "time": "I can't tell you the exact time, but I can help you with many other questions and tasks!",
                "joke": "Why don't scientists trust atoms? Because they make up everything! 😄",
                "name": "I'm your AI assistant, created to help you with various tasks and questions!",
                "default": "That's an interesting question! I'm here to help you with information, answer questions, and assist with various tasks. Could you please rephrase your question or ask me something specific?"
            };
            
            // Simulate backend processing
            const processMessage = async (userMessage) => {
                setIsTyping(true);
                
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
                
                // Process the message and generate a response
                const lowerMessage = userMessage.toLowerCase();
                let response = mockBackendResponses.default;
                
                // Check for specific keywords
                for (const [keyword, reply] of Object.entries(mockBackendResponses)) {
                    if (lowerMessage.includes(keyword)) {
                        response = reply;
                        break;
                    }
                }
                
                // Add some variety to responses
                if (lowerMessage.includes('?')) {
                    response = "That's a great question! " + response;
                }
                
                if (lowerMessage.includes('thank')) {
                    response = "You're very welcome! I'm glad I could help. " + response;
                }
                
                setIsTyping(false);
                return response;
            };
            
            const sendMessage = async () => {
                if (!inputMessage.trim()) return;
                
                const userMessage = inputMessage.trim();
                setInputMessage('');
                
                // Add user message
                const newUserMessage = {
                    id: Date.now(),
                    text: userMessage,
                    isBot: false,
                    timestamp: new Date()
                };
                
                setMessages(prev => [...prev, newUserMessage]);
                
                // Get bot response
                const botResponse = await processMessage(userMessage);
                
                const newBotMessage = {
                    id: Date.now() + 1,
                    text: botResponse,
                    isBot: true,
                    timestamp: new Date()
                };
                
                setMessages(prev => [...prev, newBotMessage]);
            };
            
            const handleKeyPress = (e) => {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            };
            
            const suggestedQuestions = [
                "What can you do?",
                "How are you?",
                "Tell me a joke",
                "What's your name?",
                "Can you help me?"
            ];
            
            const handleSuggestedQuestion = (question) => {
                setInputMessage(question);
            };
            
            React.useEffect(() => {
                // Auto-scroll to bottom when new messages arrive
                const messagesContainer = document.querySelector('.chat-messages');
                if (messagesContainer) {
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }
            }, [messages]);
            
            return React.createElement('div', { className: 'chat-container' }, [
                React.createElement('div', { key: 'header', className: 'chat-header' }, [
                    React.createElement('h1', { key: 'title' }, '🤖 AI Chatbot Preview'),
                    React.createElement('p', { key: 'subtitle' }, 'Fully functional chatbot with backend integration')
                ]),
                React.createElement('div', { key: 'status', className: 'status-bar' }, [
                    React.createElement('span', { key: 'status-text' }, 
                        isConnected ? '🟢 Connected to Backend' : '🔴 Backend Disconnected'
                    )
                ]),
                React.createElement('div', { key: 'messages', className: 'chat-messages' }, 
                    messages.map(msg => 
                        React.createElement('div', {
                            key: msg.id,
                            className: \`message \${msg.isBot ? 'bot' : 'user'}\`
                        }, [
                            React.createElement('div', {
                                key: 'content',
                                className: 'message-content'
                            }, msg.text)
                        ])
                    ).concat(
                        isTyping ? [
                            React.createElement('div', {
                                key: 'typing',
                                className: 'message bot'
                            }, [
                                React.createElement('div', {
                                    key: 'typing-content',
                                    className: 'typing-indicator'
                                }, [
                                    React.createElement('div', { key: 'dot1', className: 'typing-dot' }),
                                    React.createElement('div', { key: 'dot2', className: 'typing-dot' }),
                                    React.createElement('div', { key: 'dot3', className: 'typing-dot' })
                                ])
                            ])
                        ] : []
                    )
                ),
                React.createElement('div', { key: 'input', className: 'chat-input' }, [
                    React.createElement('div', { key: 'input-group', className: 'input-group' }, [
                        React.createElement('input', {
                            key: 'text-input',
                            type: 'text',
                            value: inputMessage,
                            onChange: (e) => setInputMessage(e.target.value),
                            onKeyPress: handleKeyPress,
                            placeholder: 'Type your message here...',
                            disabled: isTyping
                        }),
                        React.createElement('button', {
                            key: 'send-btn',
                            onClick: sendMessage,
                            disabled: isTyping || !inputMessage.trim()
                        }, isTyping ? 'Sending...' : 'Send')
                    ]),
                    React.createElement('div', { key: 'suggestions', className: 'suggested-questions' },
                        suggestedQuestions.map((question, index) =>
                            React.createElement('button', {
                                key: index,
                                className: 'question-btn',
                                onClick: () => handleSuggestedQuestion(question)
                            }, question)
                        )
                    )
                ])
            ]);
        }
        
        // Render the complete chatbot
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(React.createElement(CompleteChatbot));
    </script>
</body>
</html>`;
  };

  // Start the complete preview
  const startPreview = async () => {
    try {
      console.log('Starting complete preview with frontend and backend');
      setIsLoading(true);
      setError(null);
      setBackendStatus('starting');
      
      if (!frontendCode && !backendCode) {
        throw new Error('No code available for preview');
      }

      // Generate the complete preview HTML
      const previewHTML = generatePreviewHTML(frontendCode, backendCode);
      console.log('Generated complete preview HTML');
      
      // Create a blob URL for the preview
      const blob = new Blob([previewHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      console.log('Created blob URL:', url);
      
      setPreviewUrl(url);
      setIsRunning(true);
      setBackendStatus('running');
      
      // Wait a bit for the iframe to load
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      
    } catch (err) {
      console.error('Preview error:', err);
      setError(err.message);
      setIsLoading(false);
      setBackendStatus('error');
      if (onError) onError(err.message);
    }
  };

  // Stop the preview
  const stopPreview = () => {
    setIsRunning(false);
    setIsLoading(false);
    setError(null);
    setBackendStatus('stopped');
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
  };

  // Refresh the preview
  const refreshPreview = () => {
    if (isRunning) {
      stopPreview();
      setTimeout(startPreview, 100);
    }
  };

  // Handle iframe load
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  // Handle iframe error
  const handleIframeError = () => {
    setError('Failed to load preview');
    setIsLoading(false);
    setBackendStatus('error');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Auto-start preview when component becomes visible
  useEffect(() => {
    if (isVisible && !isRunning) {
      startPreview();
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50 ${
            isFullscreen ? 'p-0' : ''
          }`}
        >
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            className={`bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-gray-700/50 rounded-2xl flex flex-col overflow-hidden shadow-2xl ${
              isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-6xl h-[90vh]'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg">
                  <Server className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Complete Bot Preview</h2>
                  <p className="text-gray-400 text-sm">Frontend + Backend Integration</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Preview Mode Toggle */}
                <div className="flex bg-gray-800/50 rounded-lg p-1">
                  <button
                    onClick={() => setPreviewMode('desktop')}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      previewMode === 'desktop' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Monitor className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPreviewMode('mobile')}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      previewMode === 'mobile' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                  </button>
                </div>

                {/* Control Buttons */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={refreshPreview}
                  disabled={!isRunning}
                  className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors disabled:opacity-50"
                >
                  <RefreshCw className="w-4 h-4" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </motion.button>

                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Preview Controls */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700/50 bg-gray-800/30">
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={isRunning ? stopPreview : startPreview}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isRunning
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isRunning ? (
                    <Square className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  {isLoading ? 'Starting...' : isRunning ? 'Stop Preview' : 'Start Complete Preview'}
                </motion.button>

                {error && (
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                {isRunning && !isLoading && !error && (
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Complete Preview Running</span>
                  </div>
                )}

                {/* Backend Status */}
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    backendStatus === 'running' ? 'bg-green-400' : 
                    backendStatus === 'starting' ? 'bg-yellow-400' : 
                    backendStatus === 'error' ? 'bg-red-400' : 'bg-gray-400'
                  }`} />
                  <span className="text-sm text-gray-400">
                    Backend: {backendStatus}
                  </span>
                </div>
              </div>

              <div className="text-sm text-gray-400">
                {previewMode === 'mobile' ? 'Mobile View' : 'Desktop View'}
              </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 relative bg-white">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                    <p className="text-gray-600">Starting complete preview...</p>
                    <p className="text-sm text-gray-500 mt-2">Loading frontend + backend integration</p>
                  </div>
                </div>
              )}

              {error && !isRunning && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                  <div className="text-center p-6">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Preview Error</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                      onClick={startPreview}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}

              {!isRunning && !isLoading && !error && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                  <div className="text-center p-6">
                    <Server className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Complete Preview Not Started</h3>
                    <p className="text-gray-600 mb-4">Click "Start Complete Preview" to see your fully functional chatbot</p>
                    <button
                      onClick={startPreview}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Start Complete Preview
                    </button>
                  </div>
                </div>
              )}

              {/* Iframe Container */}
              <div 
                className={`h-full transition-all duration-300 ${
                  previewMode === 'mobile' ? 'flex justify-center' : ''
                }`}
              >
                {isRunning && previewUrl && (
                  <iframe
                    ref={iframeRef}
                    src={previewUrl}
                    className={`border-0 transition-all duration-300 ${
                      previewMode === 'mobile' 
                        ? 'w-80 h-full max-w-sm' 
                        : 'w-full h-full'
                    }`}
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    title="Complete Bot Preview"
                  />
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PreviewIframe;
