import axios from "axios";
import dotenv from 'dotenv'
dotenv.config()
/**
 * Base URL for the OpenRouter API chat completions endpoint.
 * @constant {string}
 */
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

/**
 * List of supported AI models, ordered by preference.
 * @constant {string[]}
 */
const SUPPORTED_MODELS = [
  "meta-llama/llama-3-70b-instruct",
  "qwen/qwen-2.5-72b-instruct",
  "openai/gpt-4o",
  "anthropic/claude-3-opus",
  "meta-llama/llama-3-8b-instruct",
  "openai/gpt-3.5-turbo",
];

/**
 * Maximum timeout for API requests in milliseconds.
 * @constant {number}
 */
const REQUEST_TIMEOUT = 45000; // Increased for larger models

/**
 * Calls the OpenRouter API with a fallback model list.
 * Tries each model in order until one returns a valid response.
 * @param {object[]} messages - Array of messages to send to the chat model.
 * @param {string[]} [modelList=SUPPORTED_MODELS] - List of models to try.
 * @returns {Promise<{result: string, modelUsed: string}>} - The result content and the model used.
 * @throws {Error} If all models in the list fail.
 */
const callOpenRouterWithFallback = async (messages, modelList = SUPPORTED_MODELS) => {
  const errors = [];

  for (const model of modelList) {
    try {
      const response = await axios.post(
        OPENROUTER_API_URL,
        {
          model,
          temperature: 0.3,
          max_tokens: 4096,
          messages,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
          timeout: REQUEST_TIMEOUT,
        }
      );

      const result = response.data?.choices?.[0]?.message?.content?.trim();
      if (result) {
        return { result, modelUsed: model };
      }
      errors.push({ model, error: "Empty or malformed response." });
    } catch (err) {
      const errorMessage = err.response?.data?.error?.message || err.message;
      errors.push({ model, error: errorMessage });
    }
  }

  const errorDetails = errors.map((e) => `[${e.model}: ${e.error}]`).join("; ");
  throw new Error(`All AI models failed. Errors: ${errorDetails}`);
};

/**
 * Cleans markdown code blocks and other artifacts from a code string.
 * @param {string} code - The code string to clean.
 * @returns {string} The cleaned code.
 */
const cleanCodeBlock = (code) => {
  if (!code) return "";
  // Improved regex to remove code fences with or without language specifier
  return code.replace(/^``````$/, "").trim();
};

/**
 * Generates follow-up questions for a chatbot based on a prompt.
 * @param {string} prompt - The initial chatbot prompt.
 * @returns {Promise<{questions: string[], modelUsed: string}>}
 */
export const generateQuestions = async (prompt) => {
  const messages = [
    {
      role: "system",
      content:
        'You are a User Experience (UX) expert specializing in conversational design. Your task is to generate insightful, contextually relevant follow-up questions. Your response MUST BE EXCLUSIVELY a JSON array of strings, without any additional text or markdown formatting.',
    },
    {
      role: "user",
      content: `Based on the following chatbot prompt, generate 4 to 6 excellent questions that a user might ask next.
Prompt: "${prompt}"`,
    },
  ];

  const { result, modelUsed } = await callOpenRouterWithFallback(messages);

  try {
    const parsed = JSON.parse(result);
    if (Array.isArray(parsed)) {
      return {
        questions: parsed.filter((q) => typeof q === "string" && q.trim().length > 0),
        modelUsed,
      };
    }
    throw new Error("AI response was not an array.");
  } catch {
    const fallback = result
      .split("\n")
      .map((line) => line.replace(/^[-*"\d.]+\s*/, "").trim())
      .filter((q) => q.length > 10 && q.includes("?"));
    return { questions: fallback, modelUsed: `${modelUsed} (fallback)` };
  }
};

/**
 * Generates the complete Node.js backend code for the chatbot.
 * @param {string} prompt - The chatbot prompt.
 * @param {string[]} questions - Generated questions for context.
 * @returns {Promise<{backendCode: string, modelUsed: string}>}
 */
export const generateBackendCode = async (prompt, questions) => {
  const messages = [
    {
      role: "system",
      content: `You are a senior software architect specializing in Node.js. Your task is to generate a single, complete, robust, production-ready Node.js/Express server file.
Strict requirements:
1.  **File Structure:** All code must be in a single block, as if it were one 'server.js' file.
2.  **Express Server:** Full configuration with essential middlewares: 'cors', 'helmet', 'express.json()'.
3.  **Chatbot Logic:** Include a 'ChatbotService' class or module to encapsulate response logic, simulating an intelligent response based on the prompt.
4.  **WebSockets:** Integrate 'socket.io' for real-time bidirectional communication.
5.  **API Endpoints:** A POST '/api/chat' endpoint for clients without WebSocket and a GET '/api/health' endpoint for health checks.
6.  **Error Handling:** A centralized error handling middleware.
7.  **Security:** Implement 'express-rate-limit' to prevent abuse.
8.  **Validation:** Use 'express-validator' to validate API inputs.
9.  **Environment Variables:** Use 'dotenv' to manage configuration (PORT, CORS_ORIGIN).
10. **Clean Code:** The code must be modular, self-documented, and follow best practices. DO NOT include markdown formatting. The output must be pure JavaScript code only.`,
    },
    {
      role: "user",
      content: `Create the complete Node.js backend for a chatbot with the following behavior:
Chatbot Prompt: "${prompt}"
Example User Questions: ${JSON.stringify(questions)}

The chatbot should be able to handle basic conversation and respond to questions related to its main prompt.`,
    },
  ];

  const { result, modelUsed } = await callOpenRouterWithFallback(messages);
  return { backendCode: cleanCodeBlock(result), modelUsed };
};

/**
 * Generates the complete React frontend code for the chatbot.
 * @param {string} prompt - The chatbot prompt.
 * @param {string[]} questions - Generated questions for context.
 * @returns {Promise<{frontendCode: string, modelUsed: string}>}
 */
export const generateFrontendCode = async (prompt, questions) => {
  const messages = [
    {
      role: "system",
      content: `You are a senior frontend engineer specializing in React and UI/UX design. Your task is to generate a single 'App.jsx' file containing a complete, modern, aesthetically pleasing chat application.
Strict requirements:
1.  **Modern React:** Use functional components with Hooks (useState, useEffect, useRef, useCallback).
2.  **Styling:** Use Tailwind CSS for a clean, modern, responsive design. Include subtle animations for a better experience.
3.  **Components:** Structure the code into logical components (e.g., ChatWindow, MessageList, MessageInput) within the same 'App.jsx' file.
4.  **Real-Time Communication:** Integrate 'socket.io-client' to connect to the backend, send and receive messages.
5.  **UX Features:** Implement "typing..." indicators, auto-scroll to new messages, and display the initial suggested questions.
6.  **State Management:** Properly manage loading, error, and connection states.
7.  **Clean Code:** The output must be a clean, production-ready block of JSX code only. DO NOT include markdown formatting.`,
    },
    {
      role: "user",
      content: `Create the React user interface for a chatbot.
Chatbot Prompt: "${prompt}"
Suggested Questions to show the user: ${JSON.stringify(questions)}

The UI must be intuitive, attractive, and connect to the backend via WebSockets at 'ws://localhost:3001'.`,
    },
  ];

  const { result, modelUsed } = await callOpenRouterWithFallback(messages);
  return { frontendCode: cleanCodeBlock(result), modelUsed };
};

/**
 * Generates 'package.json' files for the backend and frontend.
 * @param {string} prompt - The chatbot prompt for context.
 * @returns {Promise<{packageFiles: object, modelUsed: string}>}
 */
export const generatePackageFiles = async (prompt) => {
  const messages = [
    {
      role: "system",
      content: `Your task is to generate the content for two 'package.json' files. Your response MUST BE a single JSON object with two top-level keys: 'backend' and 'frontend'.
- The 'backend' key should contain a 'package.json' for a Node.js/Express/Socket.io app. Include dependencies like 'express', 'cors', 'helmet', 'socket.io', 'dotenv', 'express-rate-limit', 'express-validator', and 'nodemon' as a devDependency.
- The 'frontend' key should contain a 'package.json' for a React app created with Vite. Include 'react', 'react-dom', 'socket.io-client', 'axios', and devDependencies like '@vitejs/plugin-react', 'vite', 'tailwindcss', 'postcss', 'autoprefixer'.
- Include appropriate 'start' and 'dev' scripts for both.`,
    },
    {
      role: "user",
      content: `Generate the 'package.json' files for a chatbot project based on the prompt: "${prompt}"`,
    },
  ];

  try {
    const { result, modelUsed } = await callOpenRouterWithFallback(messages);
    const parsed = JSON.parse(cleanCodeBlock(result));
    // Basic structure validation
    if (parsed.backend && parsed.frontend) {
      return { packageFiles: parsed, modelUsed };
    }
    throw new Error("The generated JSON structure is invalid.");
  } catch (error) {
    // Provide a robust fallback in case of failure
    return {
      packageFiles: getFallbackPackageFiles(),
      modelUsed: "fallback_hardcoded",
    };
  }
};

/**
 * Generates essential configuration files for the project.
 * @param {string} prompt - The chatbot prompt for context.
 * @returns {Promise<{configFiles: object, modelUsed: string}>}
 */
export const generateConfigFiles = async (prompt) => {
  const messages = [
    {
      role: "system",
      content: `You are a DevOps expert. Generate a collection of configuration files for a full-stack chatbot project (Node.js/React). Your response MUST BE a single JSON object where each key is a filename (e.g., 'README.md', '.env.example', 'docker-compose.yml') and its value is the file content as a string.
      Include the following files:
      1.  '.env.example': Environment variables for the backend (PORT, CORS_ORIGIN, OPENROUTER_API_KEY).
      2.  'README.md': Detailed setup instructions, project structure, environment variables, and how to run locally and with Docker.
      3.  'docker-compose.yml': A Docker Compose file to orchestrate backend and frontend services.
      4.  'backend/Dockerfile': An optimized, multi-stage production Dockerfile for the Node.js service.
      5.  'frontend/Dockerfile': An optimized, multi-stage production Dockerfile for the React service (build and serve with Nginx).
      6.  'frontend/tailwind.config.js': Basic Tailwind CSS configuration.
      7.  'frontend/postcss.config.js': PostCSS configuration.
      8.  '.gitignore': A complete .gitignore for a Node/React project.`,
    },
    {
      role: "user",
      content: `Generate the configuration files for a chatbot project with the prompt: "${prompt}"`,
    },
  ];

  try {
    const { result, modelUsed } = await callOpenRouterWithFallback(messages);
    const parsed = JSON.parse(cleanCodeBlock(result));
    return { configFiles: parsed, modelUsed };
  } catch (error) {
    return {
      configFiles: getFallbackConfigFiles(),
      modelUsed: "fallback_hardcoded",
    };
  }
};

/**
 * Orchestrates the complete generation of a chatbot project from a prompt.
 * @param {string} prompt - The main prompt defining the chatbot.
 * @returns {Promise<object>} An object indicating success and containing the generated data, or an error.
 */
export const buildBotFromPrompt = async (prompt) => {
  try {
    const { questions, modelUsed: questionsModel } = await generateQuestions(prompt);

    const [
      { backendCode, modelUsed: backendModel },
      { frontendCode, modelUsed: frontendModel },
      { packageFiles, modelUsed: packageModel },
      { configFiles, modelUsed: configModel },
    ] = await Promise.all([
      generateBackendCode(prompt, questions),
      generateFrontendCode(prompt, questions),
      generatePackageFiles(prompt),
      generateConfigFiles(prompt),
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
          generatedAt: new Date().toISOString(),
          prompt,
        },
      },
    };
  } catch (error) {
    console.error("❌ Critical error during chatbot generation:", error.message);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Formats the generated data into a file structure ready for download.
 * @param {object} generatedData - The data object from `buildBotFromPrompt`.
 * @returns {Array<{name: string, content: string}>}
 */
export const formatFilesForDownload = (generatedData) => {
  const { backendCode, frontendCode, packageFiles, configFiles } = generatedData;

  const files = [
    // Backend
    { name: "backend/server.js", content: backendCode },
    { name: "backend/package.json", content: JSON.stringify(packageFiles.backend, null, 2) },

    // Frontend
    { name: "frontend/src/App.jsx", content: frontendCode },
    { name: "frontend/package.json", content: JSON.stringify(packageFiles.frontend, null, 2) },
    {
      name: "frontend/src/index.css",
      content: `@tailwind base;\n@tailwind components;\n@tailwind utilities;`,
    },

    // Configuration files (root and others)
    ...Object.entries(configFiles).map(([filename, content]) => ({
      name: filename,
      content,
    })),
  ];

  return files;
};

// --- Fallback Functions ---

function getFallbackPackageFiles() {
  return {
    backend: {
      name: "chatbot-backend",
      version: "1.0.0",
      main: "server.js",
      type: "module",
      scripts: { start: "node server.js", dev: "nodemon server.js" },
      dependencies: {
        cors: "^2.8.5",
        dotenv: "^16.3.1",
        express: "^4.18.2",
        "express-rate-limit": "^7.1.5",
        "express-validator": "^7.0.1",
        helmet: "^7.1.0",
        "socket.io": "^4.7.2",
      },
      devDependencies: { nodemon: "^3.0.1" },
    },
    frontend: {
      name: "chatbot-frontend",
      private: true,
      version: "0.0.0",
      type: "module",
      scripts: { dev: "vite", build: "vite build", preview: "vite preview" },
      dependencies: {
        react: "^18.2.0",
        "react-dom": "^18.2.0",
        "socket.io-client": "^4.7.2",
      },
      devDependencies: {
        "@types/react": "^18.2.45",
        "@types/react-dom": "^18.2.18",
        "@vitejs/plugin-react": "^4.2.1",
        autoprefixer: "^10.4.16",
        postcss: "^8.4.32",
        tailwindcss: "^3.4.0",
        vite: "^5.0.8",
      },
    },
  };
}

function getFallbackConfigFiles() {
  return {
    ".env.example": "PORT=3001\nCORS_ORIGIN=http://localhost:5173\n# OPENROUTER_API_KEY=your_key_here",
    "README.md": `# AI Chatbot Project\n\nThis project was auto-generated. Follow the instructions to run it.\n\n## Backend\n1. cd backend\n2. npm install\n3. cp ../.env.example ./.env\n4. Add your API key in .env\n5. npm run dev\n\n## Frontend\n1. cd frontend\n2. npm install\n3. npm run dev\n\n## Docker\ndocker-compose up --build`,
    ".gitignore": "# Dependencies\n/node_modules\n/.pnp\n.pnp.js\n\n# Build\n/dist\n/build\n\n# Misc\n.DS_Store\n\n# Environment\n.env\n.env.local\n.env.*\n\n# Logs\nnpm-debug.log*\nyarn-debug.log*\nyarn-error.log*",
    "docker-compose.yml": `version: '3.8'\nservices:\n  backend:\n    build: ./backend\n    ports:\n      - "3001:3001"\n    env_file:\n      - ./.env\n  frontend:\n    build: ./frontend\n    ports:\n      - "5173:5173"\n    depends_on:\n      - backend`,
    "backend/Dockerfile": `FROM node:18-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE 3001\nCMD ["npm", "run", "dev"]`,
    "frontend/Dockerfile": `FROM node:18-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nRUN npm run build\n\nFROM nginx:stable-alpine\nCOPY --from=builder /app/dist /usr/share/nginx/html\nEXPOSE 5173\nCMD ["nginx", "-g", "daemon off;"]`,
    "frontend/tailwind.config.js": `/** @type {import('tailwindcss').Config} */\nexport default {\n  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],\n  theme: {\n    extend: {},\n  },\n  plugins: [],\n}`,
    "frontend/postcss.config.js": `export default {\n  plugins: {\n    tailwindcss: {},\n    autoprefixer: {},\n  },\n}`,
  };
}
