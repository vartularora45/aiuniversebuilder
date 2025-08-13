import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();

// Configuration Constants
const CONFIG = {
  OPENROUTER_API_URL: "https://openrouter.ai/api/v1/chat/completions",
  REQUEST_TIMEOUT: 30000,
  DEFAULT_TEMPERATURE: 0.3,
  MAX_TOKENS: 256,
  RATE_LIMIT: {
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000
  }
};

const MODELS = {
  PRIMARY: [
    "meta-llama/llama-3-70b-instruct",
    "qwen/qwen-2.5-72b-instruct",
    "anthropic/claude-3-opus"
  ],
  FALLBACK: [
    "openai/gpt-4o",
    "meta-llama/llama-3-8b-instruct",
    "openai/gpt-3.5-turbo"
  ]
};

// Enhanced Error Handling
class ChatbotGenerationError extends Error {
  constructor(message, code, details = {}) {
    super(message);
    this.name = 'ChatbotGenerationError';
    this.code = code;
    this.details = details;
  }
}

// Optimized API Client
class OpenRouterClient {
  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY;
    if (!this.apiKey) {
      throw new ChatbotGenerationError('OpenRouter API key not found', 'MISSING_API_KEY');
    }
  }

  async makeRequest(messages, model, retryCount = 0) {
    try {
      const response = await axios.post(
        CONFIG.OPENROUTER_API_URL,
        {
          model,
          temperature: CONFIG.DEFAULT_TEMPERATURE,
          max_tokens: CONFIG.MAX_TOKENS,
          messages,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'X-Title': 'AI Chatbot Generator'
          },
          timeout: CONFIG.REQUEST_TIMEOUT,
        }
      );

      const result = response.data?.choices?.[0]?.message?.content?.trim();
      if (!result) {
        throw new Error('Empty response from API');
      }
      
      return result;
    } catch (error) {
      if (retryCount < CONFIG.RATE_LIMIT.MAX_RETRIES && this.shouldRetry(error)) {
        await this.delay(CONFIG.RATE_LIMIT.RETRY_DELAY * (retryCount + 1));
        return this.makeRequest(messages, model, retryCount + 1);
      }
      throw error;
    }
  }

  shouldRetry(error) {
    const retryableStatuses = [429, 500, 502, 503, 504];
    return error.response?.status && retryableStatuses.includes(error.response.status);
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async callWithFallback(messages, modelList = [...MODELS.PRIMARY, ...MODELS.FALLBACK]) {
    const errors = [];
    
    for (const model of modelList) {
      try {
        const result = await this.makeRequest(messages, model);
        return { result, modelUsed: model };
      } catch (error) {
        const errorMessage = error.response?.data?.error?.message || error.message;
        errors.push({ model, error: errorMessage });
        
        // Log error for debugging
        console.warn(`Model ${model} failed: ${errorMessage}`);
      }
    }

    const errorDetails = errors.map(e => `${e.model}: ${e.error}`).join('; ');
    throw new ChatbotGenerationError(
      `All AI models failed. Consider checking your API key and quota.`,
      'ALL_MODELS_FAILED',
      { errors: errorDetails }
    );
  }
}

// Utility Functions
const Utils = {
  cleanCode(code) {
    if (!code || typeof code !== 'string') return '';
    
    return code
      .replace(/^```[\w]*\n?/gm, '')
      .replace(/^```$/gm, '')
      .replace(/^.*?(?=(?:import|const|let|var|function|class|export|\/\*|\/\/|<!DOCTYPE|<html|<\?xml))/s, '')
      .replace(/\n\n.*?(?:This code|The above code|This implementation).*$/s, '')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/^\s*Here is.*?:\s*\n/gm, '')
      .replace(/^\s*This (?:code|implementation|file).*?\n/gm, '')
      .trim();
  },

  validatePrompt(prompt) {
    if (!prompt || typeof prompt !== 'string') {
      throw new ChatbotGenerationError('Invalid prompt provided', 'INVALID_PROMPT');
    }
    
    if (prompt.length < 10) {
      throw new ChatbotGenerationError('Prompt too short. Please provide a detailed description.', 'PROMPT_TOO_SHORT');
    }
    
    if (prompt.length > 1000) {
      throw new ChatbotGenerationError('Prompt too long. Please keep it under 1000 characters.', 'PROMPT_TOO_LONG');
    }
    
    return prompt.trim();
  },

  parseJsonResponse(response, fallbackParser = null) {
    try {
      const parsed = JSON.parse(response);
      return parsed;
    } catch (error) {
      if (fallbackParser) {
        return fallbackParser(response);
      }
      throw new ChatbotGenerationError('Invalid JSON response from AI', 'INVALID_JSON_RESPONSE');
    }
  }
};

// Prompt Templates
const PromptTemplates = {
  questions: {
    system: `You are an expert UX researcher specializing in conversational AI design.

Generate 5-6 engaging follow-up questions that will captivate users and encourage meaningful interaction.

REQUIREMENTS:
- Output ONLY a JSON array of strings
- Each question: 8-15 words
- Mix question types: practical, exploratory, clarifying
- Avoid generic questions
- Create curiosity gaps that make users want to click

PSYCHOLOGY PRINCIPLES:
- Personalization for user's interests
- Progressive disclosure (broad → specific)
- Address real user pain points`,

    user: (prompt) => `Analyze this chatbot prompt and generate irresistible follow-up questions:

CHATBOT: "${prompt}"

Generate questions that make users think "I need to know this!" Focus on the most engaging aspects.`
  },

  backend: {
    system: `You are a Senior Node.js Architect creating production-ready backend systems.

CRITICAL: OUTPUT ONLY PURE JAVASCRIPT CODE. NO MARKDOWN, NO EXPLANATIONS, NO BACKTICKS.

Create a complete Express.js server with:
- Socket.io for real-time communication
- Comprehensive middleware (helmet, cors, rate-limiting)
- Input validation with express-validator
- Intelligent ChatbotService with personality-driven responses
- Production-ready error handling
- Security best practices

Architecture: Single server.js file, modular organization, clean separation of concerns.`,

    user: (prompt, questions) => `Create Node.js backend for this chatbot:

PERSONALITY: "${prompt}"
EXAMPLE INTERACTIONS: ${JSON.stringify(questions.slice(0, 3))}

Requirements:
- Embody the personality from the prompt
- Handle example questions naturally
- Include conversation memory
- Production-ready with modern practices`
  },

  frontend: {
    system: `You are a Senior React Developer specializing in modern, beautiful UIs.

CRITICAL: OUTPUT ONLY PURE JSX CODE. NO MARKDOWN, NO EXPLANATIONS, NO BACKTICKS.

Create a complete React App.jsx with:
- Modern React hooks (useState, useEffect, useCallback)
- Socket.io-client integration
- Tailwind CSS with glassmorphism and animations
- Mobile-first responsive design
- Real-time messaging with typing indicators
- Interactive suggested questions
- Beautiful, personality-matching design

Connect to WebSocket at 'ws://localhost:3001'`,

    user: (prompt, questions) => `Build React frontend for this chatbot:

PERSONALITY: "${prompt}"
SUGGESTED QUESTIONS: ${JSON.stringify(questions)}

Requirements:
- Reflect personality in visual design
- Present questions as beautiful, clickable elements
- Create engaging welcome experience
- Smooth transitions and micro-interactions
- Mobile-first responsive design`
  }
};

// Enhanced Generators
class ChatbotGenerator {
  constructor() {
    this.client = new OpenRouterClient();
  }

  async generateQuestions(prompt) {
    const validPrompt = Utils.validatePrompt(prompt);
    
    const messages = [
      { role: "system", content: PromptTemplates.questions.system },
      { role: "user", content: PromptTemplates.questions.user(validPrompt) }
    ];

    const { result, modelUsed } = await this.client.callWithFallback(messages);
    
    const fallbackParser = (text) => {
      return text
        .split('\n')
        .map(line => line.replace(/^[-*"\d.]+\s*/, '').trim())
        .filter(q => q.length > 10 && q.includes('?'))
        .slice(0, 6);
    };

    const questions = Utils.parseJsonResponse(result, fallbackParser);
    
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new ChatbotGenerationError('Failed to generate valid questions', 'INVALID_QUESTIONS');
    }

    return {
      questions: questions.filter(q => typeof q === 'string' && q.trim().length > 0),
      modelUsed
    };
  }

  async generateBackendCode(prompt, questions) {
    console.log('🔧 Generating backend code...');
    console.log('Prompt:', prompt.substring(0, 100) + '...');
    console.log('Questions:', questions);
    
    const messages = [
      { role: "system", content: PromptTemplates.backend.system },
      { role: "user", content: PromptTemplates.backend.user(prompt, questions) }
    ];

    const { result, modelUsed } = await this.client.callWithFallback(messages);
    const cleanedCode = Utils.cleanCode(result);
    
    console.log('Backend code generated, length:', cleanedCode.length);
    console.log('Backend code preview:', cleanedCode.substring(0, 200) + '...');
    
    if (!cleanedCode.includes('express') || !cleanedCode.includes('socket.io')) {
      console.error('Backend code validation failed - missing express or socket.io');
      throw new ChatbotGenerationError('Generated backend code is incomplete', 'INCOMPLETE_BACKEND');
    }

    console.log('✅ Backend code generation successful');
    return { backendCode: cleanedCode, modelUsed };
  }

  async generateFrontendCode(prompt, questions) {
    console.log('🎨 Generating frontend code...');
    console.log('Prompt:', prompt.substring(0, 100) + '...');
    console.log('Questions:', questions);
    
    const messages = [
      { role: "system", content: PromptTemplates.frontend.system },
      { role: "user", content: PromptTemplates.frontend.user(prompt, questions) }
    ];

    const { result, modelUsed } = await this.client.callWithFallback(messages);
    const cleanedCode = Utils.cleanCode(result);
    
    console.log('Frontend code generated, length:', cleanedCode.length);
    console.log('Frontend code preview:', cleanedCode.substring(0, 200) + '...');
    
    if (!cleanedCode.includes('React') && !cleanedCode.includes('useState')) {
      console.error('Frontend code validation failed - missing React or useState');
      throw new ChatbotGenerationError('Generated frontend code is incomplete', 'INCOMPLETE_FRONTEND');
    }

    console.log('✅ Frontend code generation successful');
    return { frontendCode: cleanedCode, modelUsed };
  }

  async generatePackageFiles(prompt) {
    const template = {
      backend: {
        name: "ai-chatbot-backend",
        version: "1.0.0",
        type: "module",
        main: "server.js",
        scripts: {
          start: "node server.js",
          dev: "nodemon server.js",
          test: "jest"
        },
        dependencies: {
          express: "^4.18.2",
          "socket.io": "^4.7.2",
          cors: "^2.8.5",
          helmet: "^7.1.0",
          dotenv: "^16.3.1",
          "express-rate-limit": "^7.1.5",
          "express-validator": "^7.0.1"
        },
        devDependencies: {
          nodemon: "^3.0.1",
          jest: "^29.7.0"
        }
      },
      frontend: {
        name: "ai-chatbot-frontend",
        private: true,
        version: "1.0.0",
        type: "module",
        scripts: {
          dev: "vite",
          build: "vite build",
          preview: "vite preview",
          lint: "eslint src"
        },
        dependencies: {
          react: "^18.2.0",
          "react-dom": "^18.2.0",
          "socket.io-client": "^4.7.2"
        },
        devDependencies: {
          "@vitejs/plugin-react": "^4.2.1",
          vite: "^5.0.8",
          tailwindcss: "^3.4.0",
          postcss: "^8.4.32",
          autoprefixer: "^10.4.16",
          eslint: "^8.55.0",
          "@eslint/js": "^9.0.0"
        }
      }
    };

    return { packageFiles: template, modelUsed: "template" };
  }

  async generateConfigFiles() {
    const configs = {
      ".env.example": `# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Settings  
CORS_ORIGIN=http://localhost:5173

# API Keys (Add your keys here)
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100`,

      "README.md": `# AI Chatbot Project 🤖

An intelligent chatbot application built with Node.js, Express, React, and Socket.io.

## Features
- Real-time messaging with WebSocket
- AI-powered responses
- Modern React UI with Tailwind CSS
- Production-ready backend with security middleware
- Docker support for easy deployment

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Development Setup

1. **Clone and setup:**
\`\`\`bash
git clone <your-repo>
cd chatbot-project
cp .env.example .env
# Add your OpenRouter API key to .env
\`\`\`

2. **Backend:**
\`\`\`bash
cd backend
npm install
npm run dev  # Starts on port 3001
\`\`\`

3. **Frontend:**
\`\`\`bash
cd frontend  
npm install
npm run dev  # Starts on port 5173
\`\`\`

### Docker Deployment
\`\`\`bash
docker-compose up --build
\`\`\`

## Project Structure
\`\`\`
├── backend/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/App.jsx
│   ├── package.json
│   └── tailwind.config.js
├── docker-compose.yml
└── .env.example
\`\`\`

## API Endpoints
- \`POST /api/chat\` - HTTP chat endpoint
- \`GET /api/health\` - Health check
- WebSocket on \`ws://localhost:3001\`

## Deployment
Ready for deployment on Heroku, DigitalOcean, AWS, or any Node.js hosting platform.`,

      ".gitignore": `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
/dist
/build
.next/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Cache
.cache/
.parcel-cache/
.next/cache/

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# Temporary folders
tmp/
temp/`,

      "docker-compose.yml": `version: '3.8'

services:
  backend:
    build: 
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=development
      - PORT=3001
    env_file:
      - .env
    volumes:
      - ./backend:/app
      - /app/node_modules
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend  
      dockerfile: Dockerfile
    ports:
      - "5173:5173"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - backend
    restart: unless-stopped`,

      "backend/Dockerfile": `FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \\
    adduser -S nextjs -u 1001

USER nextjs

EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost:3001/api/health || exit 1

CMD ["npm", "start"]`,

      "frontend/Dockerfile": `# Multi-stage build for optimized production
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production image
FROM nginx:stable-alpine

# Copy build files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]`,

      "frontend/tailwind.config.js": `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-soft': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      },
      colors: {
        'chat': {
          primary: '#667eea',
          secondary: '#764ba2',
          accent: '#f093fb',
        }
      }
    },
  },
  plugins: [],
}`,

      "frontend/postcss.config.js": `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,

      "frontend/vite.config.js": `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  optimizeDeps: {
    include: ['socket.io-client'],
  },
})`
    };

    return { configFiles: configs, modelUsed: "template" };
  }

  async buildBotFromPrompt(prompt) {
    try {
      console.log('🚀 Starting chatbot generation...');
      
      // Step 1: Generate questions
      console.log('📝 Generating questions...');
      const questionsResult = await this.generateQuestions(prompt);
      
      // Step 2: Generate all components in parallel for better performance  
      console.log('⚡ Generating components...');
      const [backendResult, frontendResult, packageResult, configResult] = await Promise.all([
        this.generateBackendCode(prompt, questionsResult.questions),
        this.generateFrontendCode(prompt, questionsResult.questions), 
        this.generatePackageFiles(prompt),
        this.generateConfigFiles()
      ]);

      console.log('✅ Generation completed successfully!');
      
      return {
        success: true,
        data: {
          questions: questionsResult.questions,
          backendCode: backendResult.backendCode,
          frontendCode: frontendResult.frontendCode,
          packageFiles: packageResult.packageFiles,
          configFiles: configResult.configFiles,
          metadata: {
            modelsUsed: {
              questions: questionsResult.modelUsed,
              backend: backendResult.modelUsed,
              frontend: frontendResult.modelUsed,
              packages: packageResult.modelUsed,
              config: configResult.modelUsed,
            },
            generatedAt: new Date().toISOString(),
            prompt: prompt,
            version: '2.0.0'
          },
        },
      };
    } catch (error) {
      console.error('❌ Generation failed:', error.message);
      
      return {
        success: false,
        error: error.message,
        code: error.code || 'GENERATION_FAILED',
        details: error.details || {},
        timestamp: new Date().toISOString(),
      };
    }
  }
}

// File Structure Formatter
export const formatFilesForDownload = (generatedData) => {
  const { backendCode, frontendCode, packageFiles, configFiles } = generatedData;

  const files = [
    // Backend files
    { name: "backend/server.js", content: backendCode },
    { name: "backend/package.json", content: JSON.stringify(packageFiles.backend, null, 2) },

    // Frontend files  
    { name: "frontend/src/App.jsx", content: frontendCode },
    { name: "frontend/package.json", content: JSON.stringify(packageFiles.frontend, null, 2) },
    { 
      name: "frontend/src/index.css", 
      content: "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n/* Custom animations */\n@keyframes fadeIn {\n  from { opacity: 0; }\n  to { opacity: 1; }\n}\n\n@keyframes slideUp {\n  from { transform: translateY(10px); opacity: 0; }\n  to { transform: translateY(0); opacity: 1; }\n}" 
    },
    {
      name: "frontend/index.html",
      content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AI Chatbot</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`
    },
    {
      name: "frontend/src/main.jsx",
      content: `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`
    },

    // Configuration files
    ...Object.entries(configFiles).map(([filename, content]) => ({
      name: filename,
      content,
    })),
  ];

  return files;
};

// Main export
const generator = new ChatbotGenerator();

export const generateQuestions = (prompt) => generator.generateQuestions(prompt);
export const generateBackendCode = (prompt, questions) => generator.generateBackendCode(prompt, questions);
export const generateFrontendCode = (prompt, questions) => generator.generateFrontendCode(prompt, questions);
export const generatePackageFiles = (prompt) => generator.generatePackageFiles(prompt);
export const generateConfigFiles = () => generator.generateConfigFiles();
export const buildBotFromPrompt = (prompt) => generator.buildBotFromPrompt(prompt);