import React, { useState, useRef, useCallback } from "react";
import { Plus, Settings, Play, Save, Trash2, Edit3, MessageSquare, Bot, Zap, Code, Database, Search, Image, FileText, Calculator } from "lucide-react";

const toolCategories = {
  "AI Tools": [
    { id: "chatbot", label: "AI Chatbot", icon: Bot, color: "bg-gradient-to-r from-purple-500 to-pink-500" },
    { id: "text-generator", label: "Text Generator", icon: FileText, color: "bg-gradient-to-r from-blue-500 to-cyan-500" },
    { id: "image-analyzer", label: "Image Analyzer", icon: Image, color: "bg-gradient-to-r from-green-500 to-teal-500" },
    { id: "code-assistant", label: "Code Assistant", icon: Code, color: "bg-gradient-to-r from-orange-500 to-red-500" }
  ],
  "Data Tools": [
    { id: "database-query", label: "Database Query", icon: Database, color: "bg-gradient-to-r from-indigo-500 to-purple-500" },
    { id: "search-engine", label: "Search Engine", icon: Search, color: "bg-gradient-to-r from-yellow-500 to-orange-500" },
    { id: "calculator", label: "Calculator", icon: Calculator, color: "bg-gradient-to-r from-pink-500 to-rose-500" },
    { id: "data-processor", label: "Data Processor", icon: Zap, color: "bg-gradient-to-r from-cyan-500 to-blue-500" }
  ],
  "Custom": [
    { id: "fees-info", label: "Ask Fees → Show Fee Details", icon: MessageSquare, color: "bg-gradient-to-r from-violet-500 to-purple-500" },
    { id: "hostel-info", label: "Ask Hostel → Show Hostel Info", icon: MessageSquare, color: "bg-gradient-to-r from-emerald-500 to-green-500" },
    { id: "course-info", label: "Ask Course → Show Course Info", icon: MessageSquare, color: "bg-gradient-to-r from-blue-500 to-indigo-500" },
    { id: "placement-info", label: "Ask Placement → Show Placement Stats", icon: MessageSquare, color: "bg-gradient-to-r from-red-500 to-pink-500" }
  ]
};

const ToolBlock = ({ tool, onDragStart, isDragging = false }) => {
  const IconComponent = tool.icon;

  const handleMouseDown = (e) => {
    e.preventDefault();
    onDragStart(tool, e);
  };

  const handleTouchStart = (e) => {
    e.preventDefault(); 
    onDragStart(tool, e.touches[0]);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      className={`${tool.color} p-4 rounded-xl cursor-grab active:cursor-grabbing shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 min-w-[180px] backdrop-blur-sm border border-white/20 select-none ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center gap-3 text-white">
        <IconComponent size={20} />
        <span className="font-medium text-sm">{tool.label}</span>
      </div>
    </div>
  );
};

const DroppedBlock = ({ block, index, onEdit, onDelete }) => {
  const tool = Object.values(toolCategories).flat().find(t => t.id === block.id);
  const IconComponent = tool?.icon || MessageSquare;

  return (
    <div className={`${tool?.color || 'bg-gray-700'} p-4 rounded-xl  shadow-lg backdrop-blur-sm border border-white/20 min-w-[200px] group relative`}>
      <div className="flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <IconComponent size={18} />
          <span className="font-medium text-sm">{block.customLabel || tool?.label || block.id}</span>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
          <button 
            onClick={() => onEdit(index)}
            className="p-1 hover:bg-white/20 rounded"
          >
            <Edit3 size={14} />
          </button>
          <button 
            onClick={() => onDelete(index)}
            className="p-1 hover:bg-red-500/50 rounded"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      {block.prompt && (
        <div className="mt-2 text-xs text-white/80 bg-black/20 p-2 rounded">
          Prompt: {block.prompt}
        </div>
      )}
    </div>
  );
};

const PromptModal = ({ isOpen, onClose, onSave, initialPrompt = "", blockLabel = "", initialCustomLabel = "" }) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [customLabel, setCustomLabel] = useState(initialCustomLabel);

  // Reset form when modal opens with new data
  React.useEffect(() => {
    setPrompt(initialPrompt);
    setCustomLabel(initialCustomLabel);
  }, [initialPrompt, initialCustomLabel, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(prompt, customLabel);
    onClose();
  };

  const handleClose = () => {
    setPrompt("");
    setCustomLabel("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl border border-white/20 max-w-2xl w-full mx-4">
        <h3 className="text-xl font-bold text-white mb-4">Configure Tool: {blockLabel}</h3>
        
        <div className="mb-4">
          <label className="block text-white/80 mb-2 text-sm">Custom Label (optional)</label>
          <input
            type="text"
            value={customLabel}
            onChange={(e) => setCustomLabel(e.target.value)}
            placeholder="Enter custom name for this tool..."
            className="w-full p-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-white/80 mb-2 text-sm">Prompt/Instructions</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt or instructions for this AI tool..."
            rows={6}
            className="w-full p-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500 resize-none"
          />
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-colors"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

const DropZone = ({ droppedBlocks, onEdit, onDelete, onRun, isDragOver, onDrop, onDragOver, onDragLeave }) => {
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">AI Workflow Builder</h2>
        <div className="flex gap-3">
          <button 
            onClick={onRun}
            disabled={droppedBlocks.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            <Play size={16} />
            Run Workflow
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg transition-colors">
            <Save size={16} />
            Save
          </button>
        </div>
      </div>

      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`min-h-[500px] p-8 border-4 border-dashed rounded-2xl transition-all duration-300 ${
          isDragOver 
            ? "border-purple-400 bg-purple-500/10 shadow-2xl shadow-purple-500/20" 
            : "border-gray-600 bg-black/20"
        }`}
      >
        {droppedBlocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mb-6">
              <Plus size={40} className="text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Start Building Your AI Workflow</h3>
            <p className="text-white/60 max-w-md">
              Drag and drop AI tools from the sidebar to create your custom workflow. 
              Configure each tool with prompts and connect them to build powerful AI solutions.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {droppedBlocks.map((block, index) => (
              <DroppedBlock
                key={`${block.id}-${index}-${block.timestamp || Date.now()}`}
                block={block}
                index={index}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const DragPreview = ({ tool, position }) => {
  if (!tool || !position) return null;

  const IconComponent = tool.icon;

  return (
    <div
      className={`${tool.color} p-4 rounded-xl shadow-2xl backdrop-blur-sm border border-white/20 min-w-[180px] pointer-events-none z-50 opacity-90`}
      style={{
        position: 'fixed',
        left: position.x - 90,
        top: position.y - 25,
        transform: 'rotate(5deg)',
      }}
    >
      <div className="flex items-center gap-3 text-white">
        <IconComponent size={20} />
        <span className="font-medium text-sm">{tool.label}</span>
      </div>
    </div>
  );
};

const Sidebar = ({ onDragStart }) => {
  return (
    <div className="w-80 bg-black/30 backdrop-blur-sm border-r border-white/10 p-6 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-2">AI Tool Library</h2>
        <p className="text-white/60 text-sm">Drag tools to build your workflow</p>
      </div>

      {Object.entries(toolCategories).map(([category, tools]) => (
        <div key={category} className="mb-8">
          <h3 className="text-white/80 font-medium mb-4 text-sm uppercase tracking-wider">
            {category}
          </h3>
          <div className="space-y-3">
            {tools.map((tool) => (
              <ToolBlock key={tool.id} tool={tool} onDragStart={onDragStart} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const BuilderPage = () => {
  const [droppedBlocks, setDroppedBlocks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedTool, setDraggedTool] = useState(null);
  const [dragPosition, setDragPosition] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragStart = useCallback((tool, startEvent) => {
    setIsDragging(true);
    setDraggedTool(tool);
    setDragPosition({ x: startEvent.clientX, y: startEvent.clientY });

    const handleMouseMove = (e) => {
      setDragPosition({ x: e.clientX, y: e.clientY });
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      setDragPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    };

    const handleDragEnd = () => {
      setIsDragging(false);
      setDraggedTool(null);
      setDragPosition(null);
      setIsDragOver(false);
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleDragEnd);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleDragEnd);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    if (draggedTool) {
      const newBlock = { 
        id: draggedTool.id, 
        prompt: "", 
        customLabel: "",
        timestamp: Date.now() // Add timestamp for unique keys
      };
      setDroppedBlocks(prev => [...prev, newBlock]);
      setEditingIndex(droppedBlocks.length);
      setModalOpen(true);
    }
    setIsDragOver(false);
  }, [draggedTool, droppedBlocks.length]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    if (draggedTool) {
      setIsDragOver(true);
    }
  }, [draggedTool]);

  const handleDragLeave = useCallback((e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  }, []);

  const handleEdit = (index) => {
    setEditingIndex(index);
    setModalOpen(true);
  };

  const handleDelete = (index) => {
    setDroppedBlocks(prev => prev.filter((_, i) => i !== index));
  };

  const handleSavePrompt = (prompt, customLabel) => {
    if (editingIndex !== null) {
      setDroppedBlocks(prev => {
        const updated = [...prev];
        updated[editingIndex] = { 
          ...updated[editingIndex], 
          prompt, 
          customLabel 
        };
        return updated;
      });
      setEditingIndex(null);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    // If we were adding a new block but cancelled, remove it
    if (editingIndex === droppedBlocks.length - 1 && droppedBlocks[editingIndex]?.prompt === "") {
      setDroppedBlocks(prev => prev.slice(0, -1));
    }
    setEditingIndex(null);
  };

  const handleRunWorkflow = () => {
    alert(`Running workflow with ${droppedBlocks.length} tools! 🚀\n\nWorkflow steps:\n${droppedBlocks.map((block, i) => `${i + 1}. ${block.customLabel || block.id}`).join('\n')}`);
  };

  const getCurrentBlock = () => {
    if (editingIndex !== null && droppedBlocks[editingIndex]) {
      return droppedBlocks[editingIndex];
    }
    return null;
  };

  const currentBlock = getCurrentBlock();
  const currentTool = currentBlock ? Object.values(toolCategories).flat().find(t => t.id === currentBlock.id) : null;

  return (
    <div className="h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] text-white overflow-hidden">
      <div className="flex h-full">
        <Sidebar onDragStart={handleDragStart} />
        
        <div className="flex-1 p-6 overflow-y-auto">
          <DropZone 
            droppedBlocks={droppedBlocks}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRun={handleRunWorkflow}
            isDragOver={isDragOver}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          />
        </div>
      </div>

      {isDragging && <DragPreview tool={draggedTool} position={dragPosition} />}

      <PromptModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSavePrompt}
        initialPrompt={currentBlock?.prompt || ""}
        initialCustomLabel={currentBlock?.customLabel || ""}
        blockLabel={currentTool?.label || ""}
      />
    </div>
  );
};

export default BuilderPage;
