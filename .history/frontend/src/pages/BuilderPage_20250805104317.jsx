import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, Brain, Users, Globe, Mic, Image, Shield, Zap, FileText, Download, Copy, Check } from 'lucide-react';

const AIUniverseBuilder = () => {
  const [currentStep, setCurrentStep] = useState('welcome');
  const [userInput, setUserInput] = useState('');
  const [conversation, setConversation] = useState([]);
  const [aiData, setAiData] = useState({
    initialPrompt: '',
    name: '',
    purpose: '',
    targetAudience: '',
    capabilities: [],
    languages: 'English',
    mode: 'online',
    voiceFeature: null,
    multimediaSupport: null,
    dataCollection: null
  });
  const [isTyping, setIsTyping] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [copiedBlueprint, setCopiedBlueprint] = useState(false);
  const messagesEndRef = useRef(null);

  const questions = [
    {
      id: 'audience',
      question: "Awesome idea! 🎯 Now, who will be the primary users of this AI? For example: students, doctors, business owners, or maybe general consumers?",
      field: 'targetAudience'
    },
    {
      id: 'capabilities',
      question: "Perfect! What specific tasks or queries should your AI excel at? Think about the main problems it should solve for your users.",
      field: 'capabilities'
    },
    {
      id: 'languages',
      question: "Great! Should your AI support multiple languages, or will English be sufficient for now?",
      field: 'languages'
    },
    {
      id: 'mode',
      question: "Interesting! Do you want this AI to work online (with internet access for real-time data) or offline (standalone without internet)?",
      field: 'mode'
    },
    {
      id: 'voice',
      question: "Cool! Would you like to include voice features? Users could speak to the AI and hear responses back.",
      field: 'voiceFeature'
    },
    {
      id: 'multimedia',
      question: "Nice! Should your AI be able to share images, links, or other media in its responses?",
      field: 'multimediaSupport'
    },
    {
      id: 'privacy',
      question: "Almost done! 🔐 Do you want your AI to collect and store user data for personalization, or keep it completely private?",
      field: 'dataCollection'
    }
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation, isTyping]);

  const addMessage = (message, isUser = false) => {
    setConversation(prev => [...prev, { message, isUser, timestamp: Date.now() }]);
  };

  const typeMessage = async (message, delay = 1000) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, delay));
    setIsTyping(false);
    addMessage(message);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const message = userInput.trim();
    setUserInput('');
    addMessage(message, true);

    if (currentStep === 'welcome') {
      setAiData(prev => ({ ...prev, initialPrompt: message }));
      setCurrentStep('questioning');
      await typeMessage("That sounds amazing! 🚀 Let me ask you a few questions to make your AI perfect. This will only take a minute!");
      await typeMessage(questions[0].question, 1500);
    } else if (currentStep === 'questioning') {
      const currentQuestion = questions[currentQuestionIndex];
      setAiData(prev => ({ ...prev, [currentQuestion.field]: message }));

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        await typeMessage("Got it! 👍", 800);
        await typeMessage(questions[currentQuestionIndex + 1].question, 1200);
      } else {
        setCurrentStep('naming');
        await typeMessage("Perfect! 🎉 Last question - what would you like to name your AI assistant?", 1000);
      }
    } else if (currentStep === 'naming') {
      setAiData(prev => ({ ...prev, name: message }));
      await typeMessage(`Fantastic! Meet ${message} - your new AI assistant! 🤖✨`, 1000);
      await typeMessage("Let me prepare your complete AI blueprint...", 1500);
      generateSummary();
    }
  };

  const generateSummary = () => {
    // Generate purpose from initial prompt
    const purpose = aiData.initialPrompt.length > 100 
      ? aiData.initialPrompt.substring(0, 100) + "..."
      : aiData.initialPrompt;

    setAiData(prev => ({ ...prev, purpose }));
    setShowSummary(true);
    setCurrentStep('complete');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const generateBlueprint = () => {
    return `
# 🤖 ${aiData.name} - Technical Blueprint

## 🎯 AI Specification
- **Name**: ${aiData.name}
- **Purpose**: ${aiData.purpose}
- **Target Audience**: ${aiData.targetAudience}
- **Core Capabilities**: ${aiData.capabilities}
- **Language Support**: ${aiData.languages}
- **Mode**: ${aiData.mode}
- **Voice Feature**: ${aiData.voiceFeature}
- **Multimedia Support**: ${aiData.multimediaSupport}
- **Data Collection**: ${aiData.dataCollection}

## 🏗️ Technical Requirements

### Frontend
- React.js or Next.js for web interface
- Voice API integration (if voice enabled)
- Responsive design for mobile/desktop
- Real-time chat interface

### Backend
- Node.js/Express or Python/FastAPI
- WebSocket for real-time communication
- ${aiData.mode === 'online' ? 'External API integrations' : 'Local model deployment'}
- ${aiData.dataCollection === 'yes' ? 'Database for user data storage' : 'Stateless architecture'}

### AI Model
- Fine-tuned language model for specific use case
- ${aiData.voiceFeature === 'yes' ? 'Speech-to-text and text-to-speech models' : ''}
- ${aiData.multimediaSupport === 'yes' ? 'Image processing capabilities' : ''}

### Database (if needed)
\`\`\`sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  created_at TIMESTAMP
);

-- Conversations table  
CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  message TEXT,
  response TEXT,
  timestamp TIMESTAMP
);
\`\`\`

## 🎯 Sample Prompts
1. "You are ${aiData.name}, an AI assistant designed for ${aiData.targetAudience}. Your primary purpose is ${aiData.purpose}."
2. "Always respond in a helpful, professional manner while focusing on ${aiData.capabilities}."
3. "Maintain user privacy and ${aiData.dataCollection === 'yes' ? 'securely handle' : 'do not store'} any personal information."

## 🚀 Deployment Strategy
- ${aiData.mode === 'online' ? 'Cloud deployment (AWS/GCP/Azure)' : 'Local/On-premise deployment'}
- API rate limiting and security measures
- Monitoring and analytics dashboard
- A/B testing for response optimization
`;
  };

  const copyBlueprint = () => {
    navigator.clipboard.writeText(generateBlueprint());
    setCopiedBlueprint(true);
    setTimeout(() => setCopiedBlueprint(false), 2000);
  };

  const downloadBlueprint = () => {
    const element = document.createElement('a');
    const file = new Blob([generateBlueprint()], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${aiData.name}_blueprint.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Brain size={24} />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Universe Builder
            </h1>
          </div>
          <p className="text-white/70">Let's create your perfect AI assistant together! 🚀</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-2xl p-6 h-[600px] flex flex-col">
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {/* Welcome Message */}
                {conversation.length === 0 && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot size={16} />
                    </div>
                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-4 rounded-xl max-w-[80%]">
                      <p className="text-white">
                        Hey there! 👋 I'm your AI Universe Builder assistant. I'll help you design the perfect AI chatbot for your needs.
                        <br /><br />
                        <strong>Tell me your basic idea or what you want your AI to do!</strong>
                        <br /><br />
                        For example: "I want an AI that helps students with homework" or "I need a customer support bot for my restaurant"
                      </p>
                    </div>
                  </div>
                )}

                {/* Conversation Messages */}
                {conversation.map((msg, index) => (
                  <div key={index} className={`flex items-start gap-3 ${msg.isUser ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.isUser 
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
                        : 'bg-gradient-to-r from-purple-500 to-pink-500'
                    }`}>
                      {msg.isUser ? <Users size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`p-4 rounded-xl max-w-[80%] ${
                      msg.isUser 
                        ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20' 
                        : 'bg-gradient-to-r from-purple-500/20 to-pink-500/20'
                    }`}>
                      <p className="text-white">{msg.message}</p>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Bot size={16} />
                    </div>
                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-4 rounded-xl">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="flex gap-3">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    currentStep === 'welcome' 
                      ? "Describe your AI idea..." 
                      : "Type your answer..."
                  }
                  className="flex-1 p-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
                  disabled={isTyping || currentStep === 'complete'}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!userInput.trim() || isTyping || currentStep === 'complete'}
                  className="px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Progress & Summary */}
          <div className="space-y-6">
            
            {/* Progress Tracker */}
            <div className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Sparkles size={20} />
                Progress
              </h3>
              <div className="space-y-3">
                {[
                  { step: 'welcome', label: 'Initial Idea', icon: Brain },
                  { step: 'questioning', label: 'Requirements', icon: Users },
                  { step: 'naming', label: 'AI Name', icon: Bot },
                  { step: 'complete', label: 'Blueprint', icon: FileText }
                ].map(({ step, label, icon: Icon }) => (
                  <div key={step} className={`flex items-center gap-3 p-2 rounded-lg ${
                    currentStep === step 
                      ? 'bg-purple-500/20 text-purple-300' 
                      : conversation.length > 0 && 
                        (['welcome', 'questioning', 'naming', 'complete'].indexOf(currentStep) > 
                         ['welcome', 'questioning', 'naming', 'complete'].indexOf(step))
                        ? 'text-green-400' 
                        : 'text-white/50'
                  }`}>
                    <Icon size={16} />
                    <span className="text-sm">{label}</span>
                    {conversation.length > 0 && 
                     (['welcome', 'questioning', 'naming', 'complete'].indexOf(currentStep) > 
                      ['welcome', 'questioning', 'naming', 'complete'].indexOf(step)) && 
                     <Check size={14} />}
                  </div>
                ))}
              </div>
            </div>

            {/* AI Summary */}
            {showSummary && (
              <div className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Zap size={20} />
                  Your AI Summary
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-white/70">🎯 Name:</span>
                    <span className="text-white font-medium">{aiData.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/70">👥 Audience:</span>
                    <span className="text-white">{aiData.targetAudience}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/70">🌐 Languages:</span>
                    <span className="text-white">{aiData.languages}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/70">📶 Mode:</span>
                    <span className="text-white capitalize">{aiData.mode}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/70">🔊 Voice:</span>
                    <span className="text-white capitalize">{aiData.voiceFeature || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/70">🖼️ Media:</span>
                    <span className="text-white capitalize">{aiData.multimediaSupport || 'Not specified'}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <button
                    onClick={copyBlueprint}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg transition-colors"
                  >
                    {copiedBlueprint ? <Check size={16} /> : <Copy size={16} />}
                    {copiedBlueprint ? 'Copied!' : 'Copy Blueprint'}
                  </button>
                  <button
                    onClick={downloadBlueprint}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg transition-colors"
                  >
                    <Download size={16} />
                    Download Blueprint
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIUniverseBuilder;
