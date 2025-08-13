import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

class PreviewService {
  constructor() {
    this.activeServers = new Map(); // Track running servers
    this.tempDir = path.join(process.cwd(), 'temp');
  }

  // Generate a complete React app for preview
  async generateReactPreview(frontendCode, projectId) {
    try {
      const tempProjectDir = path.join(this.tempDir, `preview-${projectId}`);
      
      // Create temp directory
      await fs.mkdir(tempProjectDir, { recursive: true });
      
      // Create package.json for React app
      const packageJson = {
        name: `bot-preview-${projectId}`,
        version: "1.0.0",
        private: true,
        dependencies: {
          "react": "^18.2.0",
          "react-dom": "^18.2.0",
          "react-scripts": "5.0.1",
          "socket.io-client": "^4.7.2",
          "tailwindcss": "^3.3.0"
        },
        scripts: {
          "start": "react-scripts start",
          "build": "react-scripts build",
          "test": "react-scripts test",
          "eject": "react-scripts eject"
        },
        browserslist: {
          production: [">0.2%", "not dead", "not op_mini all"],
          development: ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"]
        }
      };

      // Create the main React component
      const appCode = this.processReactCode(frontendCode);
      
      // Create files
      await fs.writeFile(path.join(tempProjectDir, 'package.json'), JSON.stringify(packageJson, null, 2));
      await fs.writeFile(path.join(tempProjectDir, 'public/index.html'), this.generateIndexHTML());
      await fs.writeFile(path.join(tempProjectDir, 'src/index.js'), this.generateIndexJS());
      await fs.writeFile(path.join(tempProjectDir, 'src/App.js'), appCode);
      await fs.writeFile(path.join(tempProjectDir, 'src/index.css'), this.generateCSS());

      return {
        success: true,
        projectDir: tempProjectDir,
        port: await this.findAvailablePort(3000)
      };
    } catch (error) {
      console.error('Error generating React preview:', error);
      throw new Error(`Failed to generate React preview: ${error.message}`);
    }
  }

  // Process React code to make it compatible with preview
  processReactCode(code) {
    // Remove any import statements that might cause issues
    let processedCode = code
      .replace(/import\s+.*?from\s+['"`].*?['"`];?\n?/g, '')
      .replace(/export\s+default\s+/g, '')
      .replace(/export\s+{.*?};?\n?/g, '');

    // Ensure the component is properly exported
    if (!processedCode.includes('export default')) {
      // Find the main component function/class
      const componentMatch = processedCode.match(/(function\s+\w+|const\s+\w+\s*=|class\s+\w+)/);
      if (componentMatch) {
        const componentName = componentMatch[1].split(/\s+/)[1] || 'App';
        processedCode += `\n\nexport default ${componentName};`;
      }
    }

    return processedCode;
  }

  // Generate index.html
  generateIndexHTML() {
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Bot Preview" />
    <title>Bot Preview</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>`;
  }

  // Generate index.js
  generateIndexJS() {
    return `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;
  }

  // Generate CSS
  generateCSS() {
    return `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}`;
  }

  // Start React development server
  async startReactServer(projectDir, port) {
    return new Promise((resolve, reject) => {
      const serverId = uuidv4();
      
      const child = spawn('npm', ['start'], {
        cwd: projectDir,
        env: { ...process.env, PORT: port, BROWSER: 'none' }
      });

      let output = '';
      let isStarted = false;

      child.stdout.on('data', (data) => {
        output += data.toString();
        if (output.includes('Local:') && !isStarted) {
          isStarted = true;
          this.activeServers.set(serverId, { child, projectDir, port, type: 'react' });
          resolve({ serverId, port });
        }
      });

      child.stderr.on('data', (data) => {
        output += data.toString();
      });

      child.on('error', (error) => {
        reject(new Error(`Failed to start React server: ${error.message}`));
      });

      child.on('close', (code) => {
        this.activeServers.delete(serverId);
        if (code !== 0 && !isStarted) {
          reject(new Error(`React server exited with code ${code}`));
        }
      });

      // Timeout after 30 seconds
      setTimeout(() => {
        if (!isStarted) {
          child.kill();
          reject(new Error('React server startup timeout'));
        }
      }, 30000);
    });
  }

  // Generate Node.js backend for testing
  async generateBackendPreview(backendCode, projectId) {
    try {
      const tempProjectDir = path.join(this.tempDir, `backend-${projectId}`);
      
      // Create temp directory
      await fs.mkdir(tempProjectDir, { recursive: true });
      
      // Create package.json for Node.js app
      const packageJson = {
        name: `bot-backend-${projectId}`,
        version: "1.0.0",
        main: "server.js",
        dependencies: {
          "express": "^4.18.2",
          "cors": "^2.8.5",
          "helmet": "^7.0.0",
          "socket.io": "^4.7.2",
          "express-rate-limit": "^6.7.0",
          "express-validator": "^7.0.1"
        },
        scripts: {
          "start": "node server.js",
          "dev": "nodemon server.js"
        }
      };

      // Process the backend code
      const processedCode = this.processBackendCode(backendCode);
      
      // Create files
      await fs.writeFile(path.join(tempProjectDir, 'package.json'), JSON.stringify(packageJson, null, 2));
      await fs.writeFile(path.join(tempProjectDir, 'server.js'), processedCode);

      return {
        success: true,
        projectDir: tempProjectDir,
        port: await this.findAvailablePort(3001)
      };
    } catch (error) {
      console.error('Error generating backend preview:', error);
      throw new Error(`Failed to generate backend preview: ${error.message}`);
    }
  }

  // Process backend code
  processBackendCode(code) {
    // Ensure proper imports and setup
    let processedCode = code;
    
    // Add missing imports if needed
    if (!processedCode.includes('const express')) {
      processedCode = `const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

${processedCode}`;
    }

    // Ensure server is listening
    if (!processedCode.includes('.listen(')) {
      processedCode += `

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`;
    }

    return processedCode;
  }

  // Start Node.js server
  async startNodeServer(projectDir, port) {
    return new Promise((resolve, reject) => {
      const serverId = uuidv4();
      
      // First install dependencies
      const install = spawn('npm', ['install'], { cwd: projectDir });
      
      install.on('close', (code) => {
        if (code !== 0) {
          reject(new Error('Failed to install dependencies'));
          return;
        }

        // Then start the server
        const child = spawn('npm', ['start'], {
          cwd: projectDir,
          env: { ...process.env, PORT: port }
        });

        let output = '';
        let isStarted = false;

        child.stdout.on('data', (data) => {
          output += data.toString();
          if (output.includes('Server running') && !isStarted) {
            isStarted = true;
            this.activeServers.set(serverId, { child, projectDir, port, type: 'node' });
            resolve({ serverId, port });
          }
        });

        child.stderr.on('data', (data) => {
          output += data.toString();
        });

        child.on('error', (error) => {
          reject(new Error(`Failed to start Node server: ${error.message}`));
        });

        child.on('close', (code) => {
          this.activeServers.delete(serverId);
          if (code !== 0 && !isStarted) {
            reject(new Error(`Node server exited with code ${code}`));
          }
        });

        // Timeout after 30 seconds
        setTimeout(() => {
          if (!isStarted) {
            child.kill();
            reject(new Error('Node server startup timeout'));
          }
        }, 30000);
      });
    });
  }

  // Stop a server
  async stopServer(serverId) {
    const server = this.activeServers.get(serverId);
    if (server) {
      server.child.kill();
      this.activeServers.delete(serverId);
      
      // Clean up temp directory
      try {
        await fs.rm(server.projectDir, { recursive: true, force: true });
      } catch (error) {
        console.error('Error cleaning up temp directory:', error);
      }
      
      return true;
    }
    return false;
  }

  // Find available port
  async findAvailablePort(startPort) {
    const net = await import('net');
    return new Promise((resolve) => {
      const server = net.createServer();
      server.listen(startPort, () => {
        const port = server.address().port;
        server.close(() => resolve(port));
      });
      server.on('error', () => {
        resolve(this.findAvailablePort(startPort + 1));
      });
    });
  }

  // Test an endpoint
  async testEndpoint(serverId, endpoint, method = 'GET', requestData = null) {
    const server = this.activeServers.get(serverId);
    if (!server) {
      throw new Error('Server not found');
    }

    const url = `http://localhost:${server.port}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestData ? JSON.stringify(requestData) : undefined
      });

      const data = await response.text();
      
      try {
        const jsonData = JSON.parse(data);
        return {
          status: response.status,
          data: jsonData,
          headers: Object.fromEntries(response.headers.entries())
        };
      } catch {
        return {
          status: response.status,
          data: data,
          headers: Object.fromEntries(response.headers.entries())
        };
      }
    } catch (error) {
      throw new Error(`Failed to test endpoint: ${error.message}`);
    }
  }

  // Cleanup all servers
  async cleanup() {
    const promises = Array.from(this.activeServers.keys()).map(serverId => 
      this.stopServer(serverId)
    );
    await Promise.all(promises);
  }
}

export default new PreviewService();
