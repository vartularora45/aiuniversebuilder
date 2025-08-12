// src/components/PreviewIframe.jsx
import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Maximize2, Minimize2 } from 'lucide-react';

export default function PreviewIframe({ 
  html = '', 
  css = '', 
  js = '', 
  onClose,
  title = "Live Preview" 
}) {
  const [previewError, setPreviewError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const srcDoc = `<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <style>
    body { 
      margin: 0; 
      padding: 20px; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
    }
    ${css}
  </style>
</head>
<body>
  ${html}
  <script>
    try {
      ${js}
    } catch (error) {
      console.error('Script error:', error);
      document.body.innerHTML += '<div style="color: red; padding: 20px; background: #ffe6e6; margin: 20px 0; border-radius: 8px;"><strong>JavaScript Error:</strong> ' + error.message + '</div>';
    }
  </script>
</body>
</html>`;

  const openInNewTab = () => {
    const blob = new Blob([srcDoc], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 15000);
  };

  const handleIframeError = () => {
    setPreviewError(true);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isFullscreen, onClose]);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 ${
      isFullscreen ? 'p-0' : ''
    }`}>
      <div className={`bg-white rounded-lg shadow-lg flex flex-col overflow-hidden ${
        isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-5xl h-[80vh]'
      }`}>
        <div className="flex items-center justify-between p-3 border-b bg-gray-50">
          <div className="text-sm font-medium text-gray-700">{title}</div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={toggleFullscreen}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 transition-colors flex items-center gap-2 text-sm"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              {isFullscreen ? "Exit" : "Fullscreen"}
            </button>
            <button 
              onClick={openInNewTab} 
              className="px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white transition-colors flex items-center gap-2 text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              New Tab
            </button>
            <button 
              onClick={onClose} 
              className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white transition-colors flex items-center gap-2 text-sm"
            >
              <X className="w-4 h-4" />
              Close
            </button>
          </div>
        </div>

        {previewError ? (
          <div className="flex-1 flex items-center justify-center bg-red-50">
            <div className="text-center p-8">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-red-700 mb-2">Preview Error</h3>
              <p className="text-red-600 mb-4">Preview load nahi ho saka. Generated code check karein.</p>
              <button 
                onClick={() => setPreviewError(false)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <iframe
            title={title}
            srcDoc={srcDoc}
            sandbox="allow-scripts allow-forms allow-popups allow-modals"
            style={{ flex: 1, border: 'none' }}
            onError={handleIframeError}
            loading="lazy"
          />
        )}
      </div>
    </div>
  );
}
