// src/utils/buildPreviewHtml.js
export function buildPreviewHtml({ html = '', css = '', js = '' }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>AI Preview</title>
  <style>
    /* Reset and base styles */
    * { 
      margin: 0; 
      padding: 0; 
      box-sizing: border-box; 
    }
    
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    
    /* Custom styles */
    ${css}
  </style>
</head>
<body>
  ${html}
  
  <script>
    // Error handling wrapper
    try {
      ${js}
    } catch (error) {
      console.error('Script execution error:', error);
    }
  </script>
</body>
</html>`;
}

// Alternative function for specific file types
export function generateHTMLCode(aiData) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${aiData.name || 'AI Assistant'}</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="app-container">
        <header class="app-header">
            <h1>${aiData.name || 'AI Assistant'}</h1>
            <p class="tagline">${aiData.initialIdea || 'Your intelligent companion'}</p>
        </header>
        
        <main class="chat-container">
            <div class="messages" id="messages"></div>
            <form class="input-form" id="chatForm">
                <input type="text" id="messageInput" placeholder="Type your message..." autocomplete="off">
                <button type="submit">Send</button>
            </form>
        </main>
    </div>
    
    <script src="script.js"></script>
</body>
</html>`;
}

export function generateCSSCode(aiData) {
  return `/* ${aiData.name || 'AI Assistant'} Styles */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.app-container {
    width: 100%;
    max-width: 800px;
    height: 600px;
    background: white;
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.app-header {
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    color: white;
    padding: 30px;
    text-align: center;
}

.app-header h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
    font-weight: 700;
}

.tagline {
    opacity: 0.9;
    font-size: 1.1rem;
}

.chat-container {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.messages {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    background: #f8fafc;
}

.message {
    margin-bottom: 15px;
    display: flex;
    align-items: flex-start;
    gap: 10px;
}

.message.user {
    flex-direction: row-reverse;
}

.message-content {
    background: #e2e8f0;
    padding: 12px 16px;
    border-radius: 18px;
    max-width: 70%;
    word-wrap: break-word;
}

.message.user .message-content {
    background: #6366f1;
    color: white;
}

.input-form {
    padding: 20px;
    background: white;
    border-top: 1px solid #e2e8f0;
    display: flex;
    gap: 10px;
}

.input-form input {
    flex: 1;
    padding: 12px 16px;
    border: 2px solid #e2e8f0;
    border-radius: 25px;
    font-size: 16px;
    outline: none;
    transition: border-color 0.2s;
}

.input-form input:focus {
    border-color: #6366f1;
}

.input-form button {
    padding: 12px 24px;
    background: #6366f1;
    color: white;
    border: none;
    border-radius: 25px;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.2s;
}

.input-form button:hover {
    background: #5855eb;
}

@media (max-width: 768px) {
    .app-container {
        height: 100vh;
        border-radius: 0;
    }
    
    .app-header h1 {
        font-size: 2rem;
    }
}`;
}

export function generateJSCode(aiData) {
  return `// ${aiData.name || 'AI Assistant'} JavaScript

class AIAssistant {
    constructor() {
        this.messagesContainer = document.getElementById('messages');
        this.messageInput = document.getElementById('messageInput');
        this.chatForm = document.getElementById('chatForm');
        
        this.responses = [
            "That's interesting! Tell me more.",
            "I understand. How can I help you with that?",
            "Great question! Let me think about that.",
            "I'm here to help with ${aiData.queryTypes || 'your questions'}.",
            "As an AI designed for ${aiData.targetAudience || 'everyone'}, I can assist you with that.",
        ];
        
        this.init();
    }
    
    init() {
        this.chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleMessage();
        });
        
        // Add welcome message
        this.addMessage("Hello! I'm ${aiData.name || 'your AI assistant'}. ${aiData.initialIdea || 'How can I help you today?'}", 'bot');
        
        // Focus on input
        this.messageInput.focus();
    }
    
    handleMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;
        
        // Add user message
        this.addMessage(message, 'user');
        this.messageInput.value = '';
        
        // Simulate AI response
        setTimeout(() => {
            const response = this.generateResponse(message);
            this.addMessage(response, 'bot');
        }, 500 + Math.random() * 1000);
    }
    
    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = \`message \${sender}\`;
        
        messageDiv.innerHTML = \`
            <div class="message-content">\${text}</div>
        \`;
        
        this.messagesContainer.appendChild(messageDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
    
    generateResponse(userMessage) {
        // Simple response logic (replace with actual AI integration)
        const message = userMessage.toLowerCase();
        
        if (message.includes('hello') || message.includes('hi')) {
            return \`Hello! I'm ${aiData.name || 'your AI assistant'}. How can I help you today?\`;
        }
        
        if (message.includes('help')) {
            return \`I'm designed to help with ${aiData.queryTypes || 'various tasks'}. What specific assistance do you need?\`;
        }
        
        if (message.includes('language')) {
            return \`I can communicate in ${aiData.languages?.join(', ') || 'English'}. Which language would you prefer?\`;
        }
        
        // Random response fallback
        return this.responses[Math.floor(Math.random() * this.responses.length)];
    }
}

// Initialize the AI Assistant
document.addEventListener('DOMContentLoaded', () => {
    new AIAssistant();
});

// ${aiData.voiceFeature ? 'Voice feature integration would go here' : ''}
// ${aiData.multimedia ? 'Multimedia support would be implemented here' : ''}`;
}

export function generateServerCode(aiData) {
  return `// ${aiData.name || 'AI Assistant'} Backend Server
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// AI Configuration
const aiConfig = {
    name: "${aiData.name || 'AI Assistant'}",
    targetAudience: "${aiData.targetAudience || 'General'}",
    languages: ${JSON.stringify(aiData.languages || ['English'])},
    voiceEnabled: ${aiData.voiceFeature || false},
    multimediaEnabled: ${aiData.multimedia || false},
    dataCollection: "${aiData.dataCollection || 'none'}"
};

// Routes
app.get('/api/config', (req, res) => {
    res.json(aiConfig);
});

app.post('/api/chat', async (req, res) => {
    try {
        const { message, userId } = req.body;
        
        // Process the message (integrate with AI service)
        const response = await processMessage(message, userId);
        
        res.json({ response, timestamp: new Date().toISOString() });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

async function processMessage(message, userId = null) {
    // Implement actual AI processing here
    // This is a placeholder implementation
    
    const responses = [
        "I understand your question about: " + message,
        "That's an interesting point. Let me help you with that.",
        "Based on what you've said, here's what I think...",
        "I'm designed to help with ${aiData.queryTypes || 'various topics'}. Can you be more specific?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
}

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: '${aiData.name || 'AI Assistant'}' });
});

// Start server
app.listen(PORT, () => {
    console.log(\`${aiData.name || 'AI Assistant'} server running on port \${PORT}\`);
});

module.exports = app;`;
}

export function generatePackageJSON(aiData) {
  return `{
  "name": "${aiData.name?.toLowerCase().replace(/\s+/g, '-') || 'ai-assistant'}",
  "version": "1.0.0",
  "description": "${aiData.initialIdea || 'An AI assistant application'}",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "build": "npm run build:frontend",
    "build:frontend": "cd frontend && npm run build"
  },
  "keywords": ["ai", "assistant", "chatbot", "${aiData.targetAudience?.toLowerCase() || 'general'}"],
  "author": "AI Universe Builder",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3"${aiData.voiceFeature ? ',\n    "speech-recognition": "^1.0.0"' : ''}${aiData.multimedia ? ',\n    "multer": "^1.4.5"' : ''}
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}`;
}

export function generatePythonBot(aiData) {
  return `"""
${aiData.name || 'AI Assistant'} - Python Backend
${aiData.initialIdea || 'An intelligent AI assistant'}
"""

import json
import logging
from datetime import datetime
from typing import Dict, List, Optional

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ${aiData.name?.replace(/\s+/g, '') || 'AI'}Assistant:
    def __init__(self):
        self.config = {
            "name": "${aiData.name || 'AI Assistant'}",
            "target_audience": "${aiData.targetAudience || 'General'}",
            "languages": ${JSON.stringify(aiData.languages || ['English'])},
            "voice_enabled": ${aiData.voiceFeature || false},
            "multimedia_enabled": ${aiData.multimedia || false},
            "data_collection": "${aiData.dataCollection || 'none'}"
        }
        
        self.conversation_history = []
        logger.info(f"Initialized {self.config['name']}")
    
    def process_message(self, message: str, user_id: Optional[str] = None) -> Dict:
        """Process incoming message and generate response"""
        try:
            # Log the interaction
            timestamp = datetime.now().isoformat()
            
            # Store conversation if data collection is enabled
            if self.config["data_collection"] != "none":
                self.conversation_history.append({
                    "timestamp": timestamp,
                    "user_id": user_id,
                    "message": message,
                    "type": "user"
                })
            
            # Generate response based on AI configuration
            response = self._generate_response(message)
            
            # Store bot response
            if self.config["data_collection"] != "none":
                self.conversation_history.append({
                    "timestamp": timestamp,
                    "user_id": user_id,
                    "message": response,
                    "type": "bot"
                })
            
            return {
                "response": response,
                "timestamp": timestamp,
                "status": "success"
            }
            
        except Exception as e:
            logger.error(f"Error processing message: {e}")
            return {
                "response": "I apologize, but I encountered an error processing your request.",
                "timestamp": datetime.now().isoformat(),
                "status": "error"
            }
    
    def _generate_response(self, message: str) -> str:
        """Generate AI response based on configuration"""
        message_lower = message.lower()
        
        # Greeting responses
        if any(greeting in message_lower for greeting in ["hello", "hi", "hey"]):
            return f"Hello! I'm {self.config['name']}, and I'm here to help with ${aiData.queryTypes || 'your questions'}."
        
        # Help responses
        if "help" in message_lower:
            return f"I'm designed to assist {self.config['target_audience']} with ${aiData.queryTypes || 'various tasks'}. How can I help you today?"
        
        # Language support
        if "language" in message_lower:
            languages = ", ".join(self.config["languages"])
            return f"I can communicate in {languages}. Which language would you prefer?"
        
        # Default responses based on target audience
        responses = {
            "Students": "That's a great question! Let me help you understand this better.",
            "Teachers": "I can help you with educational resources and teaching strategies.",
            "Professionals": "I'm here to assist with your professional needs and workflows.",
            "Healthcare Workers": "I can provide information to support your healthcare practice.",
            "Businesses": "Let me help you with business solutions and strategies.",
            "General Public": "I'm here to help with whatever you need assistance with.",
            "Developers": "I can help you with coding, development, and technical challenges.",
            "Researchers": "I can assist with research methodologies and analysis."
        }
        
        default_response = responses.get(self.config["target_audience"], 
                                       "Thank you for your message. How can I assist you?")
        
        return default_response
    
    def get_conversation_history(self, user_id: Optional[str] = None) -> List[Dict]:
        """Get conversation history for a specific user or all users"""
        if self.config["data_collection"] == "none":
            return []
        
        if user_id:
            return [msg for msg in self.conversation_history if msg.get("user_id") == user_id]
        
        return self.conversation_history
    
    def get_config(self) -> Dict:
        """Get AI assistant configuration"""
        return self.config

# Usage example
if __name__ == "__main__":
    assistant = ${aiData.name?.replace(/\s+/g, '') || 'AI'}Assistant()
    
    # Test the assistant
    test_message = "Hello, how can you help me?"
    response = assistant.process_message(test_message)
    
    print(f"User: {test_message}")
    print(f"AI: {response['response']}")
`;
}

export function generateEnvFile(aiData) {
  return `# ${aiData.name || 'AI Assistant'} Environment Variables

# Application Settings
APP_NAME="${aiData.name || 'AI Assistant'}"
NODE_ENV=development
PORT=3001

# AI Configuration
AI_MODEL=gpt-3.5-turbo
AI_TEMPERATURE=0.7
MAX_TOKENS=150

# Database (if using)
DATABASE_URL=mongodb://localhost:27017/${aiData.name?.toLowerCase().replace(/\s+/g, '_') || 'ai_assistant'}

# API Keys (replace with actual keys)
OPENAI_API_KEY=your_openai_api_key_here
${aiData.voiceFeature ? 'SPEECH_API_KEY=your_speech_api_key_here' : ''}
${aiData.multimedia ? 'CLOUDINARY_API_KEY=your_cloudinary_key_here' : ''}

# Security
JWT_SECRET=your_jwt_secret_here
SESSION_SECRET=your_session_secret_here

# Features
VOICE_FEATURE=${aiData.voiceFeature || false}
MULTIMEDIA_FEATURE=${aiData.multimedia || false}
DATA_COLLECTION=${aiData.dataCollection || 'none'}

# Supported Languages
SUPPORTED_LANGUAGES=${aiData.languages?.join(',') || 'English'}`;
}

export function generateConfigJSON(aiData) {
  return `{
  "app": {
    "name": "${aiData.name || 'AI Assistant'}",
    "version": "1.0.0",
    "description": "${aiData.initialIdea || 'An AI assistant application'}",
    "targetAudience": "${aiData.targetAudience || 'General'}"
  },
  "ai": {
    "model": "gpt-3.5-turbo",
    "temperature": 0.7,
    "maxTokens": 150,
    "systemPrompt": "You are ${aiData.name || 'a helpful AI assistant'} designed to help ${aiData.targetAudience || 'users'} with ${aiData.queryTypes || 'various tasks'}."
  },
  "features": {
    "voice": ${aiData.voiceFeature || false},
    "multimedia": ${aiData.multimedia || false},
    "multiLanguage": ${aiData.languages ? aiData.languages.length > 1 : false}
  },
  "languages": ${JSON.stringify(aiData.languages || ['English'])},
  "privacy": {
    "dataCollection": "${aiData.dataCollection || 'none'}",
    "retentionPeriod": "${aiData.dataCollection === 'full' ? '30 days' : 'none'}",
    "encryption": true
  },
  "deployment": {
    "mode": "${aiData.mode || 'online'}",
    "scaling": "auto",
    "monitoring": true
  }
}`;
}

export function generateReadme(aiData) {
  return `# ${aiData.name || 'AI Assistant'}

${aiData.initialIdea || 'An intelligent AI assistant built with AI Universe Builder.'}

## Features

- 🤖 **AI-Powered**: Advanced conversational AI capabilities
- 👥 **Target Audience**: Designed specifically for ${aiData.targetAudience || 'general users'}
- 🌐 **Multi-Language**: Supports ${aiData.languages?.join(', ') || 'English'}
- 📱 **Mode**: ${aiData.mode || 'Online'} operation
${aiData.voiceFeature ? '- 🎤 **Voice Commands**: Voice interaction enabled' : ''}
${aiData.multimedia ? '- 🖼️ **Multimedia**: Rich media support' : ''}
- 🔐 **Privacy**: ${aiData.dataCollection === 'none' ? 'No data collection' : aiData.dataCollection === 'anonymous' ? 'Anonymous analytics only' : 'Personalized experience with user consent'}

## Quick Start

### Prerequisites

- Node.js 16+ 
- npm or yarn
- MongoDB (optional, for data storage)

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd ${aiData.name?.toLowerCase().replace(/\s+/g, '-') || 'ai-assistant'}
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env
# Edit .env with your API keys and configuration
\`\`\`

4. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open your browser and navigate to \`http://localhost:3001\`

## Project Structure

\`\`\`
${aiData.name?.toLowerCase().replace(/\s+/g, '-') || 'ai-assistant'}/
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── backend/
│   ├── server.js
│   ├── bot.py
│   └── package.json
├── config/
│   ├── .env
│   ├── config.json
│   └── README.md
└── docs/
    └── API.md
\`\`\`

## Configuration

The AI assistant can be configured through the following files:

- **config.json**: Main configuration file
- **.env**: Environment variables and API keys
- **server.js**: Backend server configuration

### Key Configuration Options

\`\`\`json
{
  "ai": {
    "model": "gpt-3.5-turbo",
    "temperature": 0.7,
    "maxTokens": 150
  },
  "features": {
    "voice": ${aiData.voiceFeature || false},
    "multimedia": ${aiData.multimedia || false}
  },
  "privacy": {
    "dataCollection": "${aiData.dataCollection || 'none'}"
  }
}
\`\`\`

## API Endpoints

### Chat API
- **POST** \`/api/chat\` - Send message to AI
- **GET** \`/api/config\` - Get AI configuration
- **GET** \`/health\` - Health check

### Example Request
\`\`\`javascript
fetch('/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: 'Hello, how can you help me?',
    userId: 'user123'
  })
});
\`\`\`

## Deployment

### Option 1: Traditional Hosting
\`\`\`bash
npm run build
npm start
\`\`\`

### Option 2: Docker
\`\`\`bash
docker build -t ${aiData.name?.toLowerCase().replace(/\s+/g, '-') || 'ai-assistant'} .
docker run -p 3001:3001 ${aiData.name?.toLowerCase().replace(/\s+/g, '-') || 'ai-assistant'}
\`\`\`

### Option 3: Cloud Platforms
- Deploy to Vercel, Netlify, or Heroku
- Configure environment variables in your platform's dashboard

## Customization

### Adding New Features
1. Modify the AI configuration in \`config.json\`
2. Update the frontend interface in \`frontend/\`
3. Extend the backend logic in \`server.js\`

### Styling
The UI can be customized by editing \`frontend/style.css\`. The design uses:
- Modern CSS Grid and Flexbox
- Responsive design principles
- Gradient backgrounds and smooth animations

## Privacy & Security

${aiData.dataCollection === 'none' 
  ? '- **No Data Collection**: This AI does not store any user conversations or personal data'
  : aiData.dataCollection === 'anonymous'
    ? '- **Anonymous Analytics**: Only anonymous usage statistics are collected'
    : '- **Personalized Experience**: User data is collected with explicit consent for personalization'
}
- All API communications are encrypted
- Environment variables store sensitive information securely

## Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue in the repository
- Check the [documentation](docs/)
- Contact: [your-email@example.com]

---

Built with ❤️ using [AI Universe Builder](https://github.com/your-repo/ai-universe-builder)
`;
}
