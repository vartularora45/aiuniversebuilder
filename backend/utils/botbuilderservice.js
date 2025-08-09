// services/builderservice.js
import axios from 'axios';
import crypto from 'crypto';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const REQUEST_TIMEOUT = 45_000;

const SUPPORTED_MODELS = [
  'anthropic/claude-3.5-sonnet',
  'meta-llama/llama-3.1-70b-instruct',
  'openai/gpt-4o-mini',
  'meta-llama/llama-3-70b-instruct',
  'mistralai/mistral-7b-instruct',
  'meta-llama/llama-3-8b-instruct',
  'qwen/qwen-2.5-72b-instruct',
  'openai/gpt-3.5-turbo',
];

const MODEL_CONFIGS = {
  creative: {
    models: ['anthropic/claude-3.5-sonnet', 'openai/gpt-4o-mini', 'meta-llama/llama-3.1-70b-instruct'],
    temperature: 0.7,
    max_tokens: 4096
  },
  technical: {
    models: ['anthropic/claude-3.5-sonnet', 'meta-llama/llama-3.1-70b-instruct', 'openai/gpt-4o-mini'],
    temperature: 0.3,
    max_tokens: 6144
  },
  general: {
    models: SUPPORTED_MODELS,
    temperature: 0.4,
    max_tokens: 4096
  }
};

const cleanCodeBlock = (code) => {
  return String(code)
    .replace(/```[\w]*\n?/, '')
    .replace(/```[\s]*$/, '')
    .replace(/^[\s]*\/\*[\s\S]*?\*\/[\s]*/, '')
    .trim();
};

const generateSessionId = () => {
  return crypto.randomBytes(16).toString('hex');
};

const callOpenRouterWithFallback = async (messages, config = MODEL_CONFIGS.general, retries = 1) => {
  const errors = [];
  const sessionId = generateSessionId();

  for (const model of config.models) {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await axios.post(
          OPENROUTER_API_URL,
          {
            model,
            temperature: config.temperature,
            messages,
            max_tokens: config.max_tokens,
            stream: false,
            top_p: 0.9,
            frequency_penalty: 0.1,
            presence_penalty: 0.1
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
              'X-Title': process.env.APP_NAME || 'Advanced Chatbot Builder',
              'X-Session-ID': sessionId
            },
            timeout: REQUEST_TIMEOUT,
          }
        );

        const result = response.data?.choices?.[0]?.message?.content?.trim();
        const usage = response.data?.usage || {};
        
        if (result) {
          return { 
            result, 
            modelUsed: model, 
            sessionId,
            usage,
            attempt: attempt + 1
          };
        }
      } catch (err) {
        const errorMsg = err?.response?.data?.error?.message || err.message;
        errors.push({
          model,
          attempt: attempt + 1,
          error: errorMsg,
          status: err?.response?.status
        });

        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }
  }

  throw new Error(
    `All models failed after retries: ${errors.map((e) => 
      `${e.model} (attempt ${e.attempt}): ${e.error}`
    ).join('; ')}`
  );
};

export const generateQuestions = async (prompt, questionCount = 5) => {
  const messages = [
    {
      role: 'system',
      content: 'You generate useful chatbot questions. Return ONLY a JSON array of strings.'
    },
    {
      role: 'user',
      content: `Generate ${questionCount} relevant questions for this chatbot prompt:\n"${prompt}"`
    }
  ];

  const { result, modelUsed, usage } = await callOpenRouterWithFallback(
    messages, 
    MODEL_CONFIGS.creative
  );

  try {
    const parsed = JSON.parse(result);
    const validQuestions = parsed
      .filter((q) => typeof q === 'string' && q.trim().length > 5 && q.includes('?'))
      .slice(0, questionCount);
    
    return {
      questions: validQuestions,
      modelUsed,
      usage,
      metadata: {
        totalGenerated: parsed.length,
        validCount: validQuestions.length
      }
    };
  } catch (parseError) {
    if (process.env.DEBUG) {
      console.error('JSON parse failed for generateQuestions:', result);
    }
    
    const fallbackQuestions = result
      .split(/\n|,/)
      .map((line) => line.replace(/^[-*\d.\s"'\[\]]+/, '').replace(/["'\]]*$/, '').trim())
      .filter((q) => q.length > 5 && q.includes('?'))
      .slice(0, questionCount);
    
    return { 
      questions: fallbackQuestions, 
      modelUsed,
      usage,
      metadata: { 
        fallbackUsed: true,
        validCount: fallbackQuestions.length 
      }
    };
  }
};

export const generateBackendCode = async (prompt, questions = [], features = {}) => {
  const defaultFeatures = {
    websocket: true,
    rateLimit: true,
    authentication: false,
    database: false,
    logging: true,
    swagger: false,
    ...features
  };

  const messages = [
    {
      role: 'system',
      content: `You are a senior full-stack engineer. Generate a complete Node.js Express backend for a chatbot.
      Include:
      1. Express server setup with CORS
      2. Chatbot logic class
      3. API endpoints for chat
      4. WebSocket support for real-time chat
      5. Error handling middleware
      6. Environment configuration
      7. Rate limiting
      8. Request validation

      Return only clean, production-ready JavaScript code without markdown formatting.`
    },
    {
      role: 'user',
      content: `Create a Node.js backend for this chatbot:
      Prompt: "${prompt}"
      Questions: ${JSON.stringify(questions, null, 2)}
      Features: ${JSON.stringify(defaultFeatures, null, 2)}

      The backend should handle chat messages and provide intelligent responses based on the prompt.`
    }
  ];

  const { result, modelUsed, usage } = await callOpenRouterWithFallback(
    messages, 
    MODEL_CONFIGS.technical
  );
  
  return { 
    backendCode: cleanCodeBlock(result), 
    modelUsed,
    usage,
    features: defaultFeatures
  };
};

export const generateFrontendCode = async (prompt, questions = [], uiConfig = {}) => {
  const defaultUIConfig = {
    theme: 'modern',
    animations: true,
    darkMode: true,
    responsive: true,
    accessibility: true,
    components: ['chat', 'sidebar', 'header'],
    styling: 'tailwind',
    ...uiConfig
  };

  const messages = [
    {
      role: 'system',
      content: `You are a senior frontend engineer. Generate a complete React chatbot UI.
      Include:
      1. Modern React functional components with hooks
      2. Beautiful chat interface with Tailwind CSS or styled components
      3. Real-time messaging with Socket.io
      4. Typing indicators
      5. Message bubbles with animations
      6. Responsive design
      7. Error handling and loading states
      8. Message history

      Return only clean, production-ready React code without markdown formatting.`
    },
    {
      role: 'user',
      content: `Create a beautiful React frontend for this chatbot:
      Prompt: "${prompt}"
      Questions: ${JSON.stringify(questions, null, 2)}
      UI Config: ${JSON.stringify(defaultUIConfig, null, 2)}

      The UI should be modern, accessible, and provide a great user experience.`
    }
  ];

  const { result, modelUsed, usage } = await callOpenRouterWithFallback(
    messages, 
    MODEL_CONFIGS.creative
  );
  
  return { 
    frontendCode: cleanCodeBlock(result), 
    modelUsed,
    usage,
    uiConfig: defaultUIConfig
  };
};

export const generatePackageFiles = async (prompt, features = {}) => {
  const messages = [
    {
      role: 'system',
      content: `Generate package.json files for both backend and frontend of a chatbot project.
      Return a JSON object with 'backend' and 'frontend' keys containing the respective package.json content.
      Include all necessary dependencies and scripts.`
    },
    {
      role: 'user',
      content: `Generate package.json files for a chatbot project based on: "${prompt}"
      Features: ${JSON.stringify(features, null, 2)}`
    }
  ];

  try {
    const { result, modelUsed, usage } = await callOpenRouterWithFallback(
      messages, 
      MODEL_CONFIGS.technical
    );
    const parsed = JSON.parse(cleanCodeBlock(result));
    return { packageFiles: parsed, modelUsed, usage };
  } catch (error) {
    if (process.env.DEBUG) console.error('Fallback to default package files:', error.message);
    const fallback = {
      backend: {
        name: 'chatbot-backend',
        version: '1.0.0',
        description: 'Backend server for AI chatbot',
        main: 'server.js',
        type: 'module',
        scripts: {
          start: 'node server.js',
          dev: 'nodemon server.js',
          test: 'jest',
          lint: 'eslint . --ext .js'
        },
        dependencies: {
          express: '^4.18.2',
          'socket.io': '^4.7.4',
          cors: '^2.8.5',
          helmet: '^7.1.0',
          dotenv: '^16.3.1',
          'express-rate-limit': '^7.1.5',
          'express-validator': '^7.0.1',
          winston: '^3.11.0',
          compression: '^1.7.4',
          axios: '^1.6.2'
        },
        devDependencies: {
          nodemon: '^3.0.2',
          jest: '^29.7.0',
          eslint: '^8.55.0'
        }
      },
      frontend: {
        name: 'chatbot-frontend',
        version: '1.0.0',
        description: 'React frontend for AI chatbot',
        private: true,
        dependencies: {
          react: '^18.2.0',
          'react-dom': '^18.2.0',
          'react-scripts': '5.0.1',
          'socket.io-client': '^4.7.4',
          axios: '^1.6.2',
          '@tailwindcss/forms': '^0.5.7',
          '@headlessui/react': '^1.7.17',
          'framer-motion': '^10.16.16',
          'react-hot-toast': '^2.4.1'
        },
        scripts: {
          start: 'react-scripts start',
          build: 'react-scripts build',
          test: 'react-scripts test',
          eject: 'react-scripts eject'
        },
        devDependencies: {
          tailwindcss: '^3.3.6',
          autoprefixer: '^10.4.16',
          postcss: '^8.4.32'
        },
        browserslist: {
          production: ['>0.2%', 'not dead', 'not op_mini all'],
          development: ['last 1 chrome version', 'last 1 firefox version', 'last 1 safari version']
        }
      }
    };
    return { packageFiles: fallback, modelUsed: 'fallback', usage: null };
  }
};

export const generateConfigFiles = async (prompt, projectConfig = {}) => {
  const messages = [
    {
      role: 'system',
      content: `Generate configuration files for a chatbot project including:
      1. .env.example file
      2. Docker configuration (Dockerfile, docker-compose.yml)
      3. README.md with setup instructions

      Return a JSON object with file names as keys and content as values.`
    },
    {
      role: 'user',
      content: `Generate configuration files for chatbot: "${prompt}"
      Config: ${JSON.stringify(projectConfig, null, 2)}`
    }
  ];

  try {
    const { result, modelUsed, usage } = await callOpenRouterWithFallback(
      messages, 
      MODEL_CONFIGS.technical
    );
    const parsed = JSON.parse(cleanCodeBlock(result));
    return { configFiles: parsed, modelUsed, usage };
  } catch (error) {
    if (process.env.DEBUG) console.error('Fallback to default config files:', error.message);
    const fallback = {
      '.env.example': `PORT=3001
NODE_ENV=development
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
LOG_LEVEL=info`,

      'README.md': `# AI Chatbot Project

A full-stack chatbot application built with Node.js, Express, React, and Socket.io.

## Setup

### Backend
1. cd backend
2. npm install
3. cp .env.example .env
4. npm run dev

### Frontend
1. cd frontend
2. npm install
3. npm start

## Docker
docker-compose up`,

      'docker-compose.yml': `version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
    volumes:
      - ./backend:/app
      - /app/node_modules

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - backend

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"`,

      'backend/Dockerfile': `FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]`,

      'frontend/Dockerfile': `FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]`,

      '.gitignore': `node_modules/
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
build/
dist/
logs/
*.log
.DS_Store
coverage/`,

      'nginx.conf': `events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend:3001;
    }

    server {
        listen 80;
        
        location /api/ {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        location /socket.io/ {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }

        location / {
            root /usr/share/nginx/html;
            index index.html;
            try_files $uri $uri/ /index.html;
        }
    }
}`
    };
    return { configFiles: fallback, modelUsed: 'fallback', usage: null };
  }
};

export const buildBotFromPrompt = async (prompt, options = {}) => {
  try {
    const {
      questionCount = 5,
      features = {},
      uiConfig = {},
      projectConfig = {}
    } = options;

    const { questions, modelUsed: questionsModel } = await generateQuestions(prompt, questionCount);
    const promptStr = String(prompt);

    const [
      { backendCode, modelUsed: backendModel, features: usedFeatures },
      { frontendCode, modelUsed: frontendModel, uiConfig: usedUIConfig },
      { packageFiles, modelUsed: packageModel },
      { configFiles, modelUsed: configModel },
    ] = await Promise.all([
      generateBackendCode(promptStr, questions, features),
      generateFrontendCode(promptStr, questions, uiConfig),
      generatePackageFiles(promptStr, features),
      generateConfigFiles(promptStr, projectConfig),
    ]);

    return {
      success: true,
      data: {
        questions,
        backendCode,
        frontendCode,
        packageFiles,
        configFiles,
        metadata: {
          modelsUsed: {
            questions: questionsModel,
            backend: backendModel,
            frontend: frontendModel,
            packages: packageModel,
            config: configModel,
          },
          features: usedFeatures,
          uiConfig: usedUIConfig,
          generatedAt: new Date().toISOString(),
          prompt: promptStr.substring(0, 100) + (promptStr.length > 100 ? '...' : ''),
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
};

export const formatFilesForDownload = (generatedData) => {
  const files = [
    { name: 'backend/server.js', content: generatedData.backendCode, type: 'javascript' },
    { name: 'backend/package.json', content: JSON.stringify(generatedData.packageFiles.backend, null, 2), type: 'json' },
    { name: 'frontend/src/App.js', content: generatedData.frontendCode, type: 'javascript' },
    { name: 'frontend/package.json', content: JSON.stringify(generatedData.packageFiles.frontend, null, 2), type: 'json' },
  ];

  Object.entries(generatedData.configFiles).forEach(([filename, content]) => {
    files.push({
      name: filename,
      content,
      type: filename.endsWith('.json')
        ? 'json'
        : filename.endsWith('.md')
        ? 'markdown'
        : filename.endsWith('.yml') || filename.endsWith('.yaml')
        ? 'yaml'
        : 'text',
    });
  });

  return files;
};

export const generateCustomComponent = async (componentType, specifications) => {
  const messages = [
    {
      role: 'system',
      content: `Generate a React component based on specifications. Return only clean code without markdown formatting.`
    },
    {
      role: 'user',
      content: `Create a ${componentType} component with these specifications: ${JSON.stringify(specifications, null, 2)}`
    }
  ];

  const { result, modelUsed, usage } = await callOpenRouterWithFallback(messages, MODEL_CONFIGS.creative);
  return { componentCode: cleanCodeBlock(result), modelUsed, usage };
};

export const generateAPIEndpoints = async (endpoints, dbSchema = null) => {
  const messages = [
    {
      role: 'system',
      content: `Generate Express.js API endpoints with proper validation, error handling, and documentation.`
    },
    {
      role: 'user',
      content: `Create API endpoints for: ${JSON.stringify(endpoints, null, 2)}
      ${dbSchema ? `Database schema: ${JSON.stringify(dbSchema, null, 2)}` : ''}`
    }
  ];

  const { result, modelUsed, usage } = await callOpenRouterWithFallback(messages, MODEL_CONFIGS.technical);
  return { apiCode: cleanCodeBlock(result), modelUsed, usage };
};

export const generateTestSuite = async (codeType, codeContent) => {
  const messages = [
    {
      role: 'system',
      content: `Generate comprehensive test suite with Jest and appropriate testing libraries.`
    },
    {
      role: 'user',
      content: `Generate tests for this ${codeType}:\n${codeContent}`
    }
  ];

  const { result, modelUsed, usage } = await callOpenRouterWithFallback(messages, MODEL_CONFIGS.technical);
  return { testCode: cleanCodeBlock(result), modelUsed, usage };
};

export const optimizeCode = async (code, optimizationType = 'performance') => {
  const messages = [
    {
      role: 'system',
      content: `Optimize code for ${optimizationType}. Return only the optimized code without explanations.`
    },
    {
      role: 'user',
      content: `Optimize this code:\n${code}`
    }
  ];

  const { result, modelUsed, usage } = await callOpenRouterWithFallback(messages, MODEL_CONFIGS.technical);
  return { optimizedCode: cleanCodeBlock(result), modelUsed, usage };
};

export default {
  generateQuestions,
  generateBackendCode,
  generateFrontendCode,
  generatePackageFiles,
  generateConfigFiles,
  buildBotFromPrompt,
  formatFilesForDownload,
  generateCustomComponent,
  generateAPIEndpoints,
  generateTestSuite,
  optimizeCode,
};