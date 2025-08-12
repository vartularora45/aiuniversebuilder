import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useUser } from "../context/userContext";
import {
  Plus, Brain, Layers, Rocket, Settings, Zap, ChevronDown, Bell, User,
  Search, Globe, Palette, Code, Database, Star, FileText, Link, Upload,
  Play, Pause, Trash2, Edit3, Eye, Download, RefreshCw, Save, X
} from "lucide-react";
import CodeViewer from "../components/CodeViewer";
import BotSuggestions from "../components/BotSuggestions"; // ⭐ NEW IMPORT

const Dashboard = () => {
  // Core state
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCodeViewer, setShowCodeViewer] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  // View/Edit Modal States
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    status: "",
    category: ""
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Navigation & user
  const navigate = useNavigate();
  const { user } = useUser();
  const token = localStorage.getItem("token");

  // Bot generation modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [botData, setBotData] = useState({
    prompt: "",
    questions: "",
    trainingText: "",
    trainingLink: "",
    trainingFile: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  // Question generation state
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);

  // Bot generation result state
  const [generatedBot, setGeneratedBot] = useState(null);
  const [botResponse, setBotResponse] = useState(null);
  const [showBotResult, setShowBotResult] = useState(false);

  // ⭐ NEW STATES FOR SUGGESTIONS
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [lastGeneratedBot, setLastGeneratedBot] = useState(null);
   
  // Extract projects from API response
  const extractProjects = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.projects)) return data.projects;
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.data?.projects)) return data.data.projects;
    return [];
  };

  // Fetch projects from backend
  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_URL}/prompts/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const projects = extractProjects(res.data);
      console.log(projects)
      setProjects(projects);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        setError("Could not load projects.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setBotData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setBotData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Generate questions from prompt
  const generateQuestionsFromPrompt = async () => {
    if (!botData.prompt.trim()) {
      setSubmitError("Please enter a prompt first");
      return;
    }

    setIsGeneratingQuestions(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_URL}/prompts/generate-questions`,
        {
          prompt: botData.prompt,
          context: {},
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        const questionsArray = res.data.data.questions;
        setGeneratedQuestions(questionsArray);
        setBotData({
          ...botData,
          questions: questionsArray.map(q => q.question).join(", "),
        });
      }
    } catch (err) {
      setSubmitError("Failed to generate questions");
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  // View project functionality
  const handleViewFlow = (project) => {
    setSelectedProject(project);
    setShowViewModal(true);
  };

  // Edit project functionality
  const handleEdit = (project) => {
    setSelectedProject(project);
    setEditFormData({
      name: project.name || "",
      description: project.description || "",
      status: project.status || "draft",
      category: project.category || "general"
    });
    setShowEditModal(true);
  };

  // Handle edit form input changes
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit edit form
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_URL}/projects/${selectedProject._id}`,
        editFormData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        // Update projects in state
        setProjects(prev => prev.map(p => 
          p._id === selectedProject._id 
            ? { ...p, ...editFormData }
            : p
        ));
        setShowEditModal(false);
        setSelectedProject(null);
      }
    } catch (err) {
      console.error("Failed to update project:", err);
      alert("Failed to update project. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete project
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_URL}/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert("Failed to delete project");
    }
  };

  // Toggle create modal
  const handleCreate = () => {
    setIsCreateModalOpen(true);
    setBotData({
      prompt: "",
      questions: "",
      trainingText: "",
      trainingLink: "",
      trainingFile: null,
    });
    setGeneratedQuestions([]);
    setSubmitError(null);
    setSubmitSuccess(null);
    setGeneratedBot(null);
    setBotResponse(null);
    setShowBotResult(false);
    setShowCodeViewer(false);
  };

  // ⭐ NEW FUNCTION - Suggestion handler
  const handleSuggestionSelect = (suggestion) => {
    // Close suggestions modal
    setShowSuggestions(false);
    
    // Pre-fill create modal with suggestion data
    setBotData({
      prompt: suggestion.initialPrompt || suggestion.description || "",
      questions: suggestion.tags ? suggestion.tags.join(", ") : "",
      trainingText: "",
      trainingLink: "",
      trainingFile: null,
    });
    
    // Keep create modal open for new bot
    setShowBotResult(false);
  };

  // Submit bot generation form - UPDATED WITH SUGGESTIONS
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    // ⭐ NEW: Set data for suggestions BEFORE generation starts
    setLastGeneratedBot({
      _id: Date.now(), // temporary ID
      name: "Generated Bot",
      category: "other",
      initialPrompt: botData.prompt,
      description: botData.prompt.substring(0, 100) + "...",
      tags: botData.questions ? botData.questions.split(",").map(q => q.trim()) : []
    });

    // ⭐ NEW: Show suggestions modal during generation
    setTimeout(() => {
      setShowSuggestions(true);
    }, 2000); // 2 seconds बाद show होगा

    const formData = new FormData();
    formData.append("prompt", botData.prompt);

    if (botData.questions.trim()) {
      const questions = botData.questions.split(",").map(q => q.trim()).filter(Boolean);
      formData.append("questions", JSON.stringify(questions));
    }

    formData.append("trainingText", botData.trainingText);
    formData.append("trainingLink", botData.trainingLink);

    if (botData.trainingFile) {
      formData.append("trainingFile", botData.trainingFile);
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_URL}/prompts/generate-bot`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      console.log("Full Response:", res.data);
      
      if (res.data.success) {
        setSubmitSuccess("Bot generated successfully!");
        setBotResponse(res.data);
        setGeneratedBot(res.data.data);
        setShowBotResult(true);
        
        // ⭐ NEW: Update bot data after generation completes
        setLastGeneratedBot(prev => ({
          ...prev,
          ...res.data.data
        }));
        
        fetchProjects();
      } else {
        setSubmitError(res.data.message || "Failed to generate bot");
      }
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Failed to generate bot");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Helper functions
  const getCategoryIcon = (category) => {
    const icons = {
      conversational: <Brain className="w-4 h-4" />,
      creative: <Palette className="w-4 h-4" />,
      development: <Code className="w-4 h-4" />,
      analytics: <Database className="w-4 h-4" />,
      audio: <Globe className="w-4 h-4" />,
      other: <Layers className="w-4 h-4" />,
    };
    return icons[category] || <Layers className="w-4 h-4" />;
  };

  const getStatusColor = (status) => {
    const statusColors = {
      active: "bg-green-400/30 border-green-400/60 text-green-200",
      draft: "bg-yellow-400/30 border-yellow-400/60 text-yellow-200",
      in_progress: "bg-blue-400/30 border-blue-400/60 text-blue-200",
      paused: "bg-red-400/30 border-red-400/60 text-red-200",
      completed: "bg-purple-400/30 border-purple-400/60 text-purple-200",
    };
    return statusColors[status] || "bg-gray-400/30 border-gray-400/60 text-gray-200";
  };

  const getFileCount = (section) => {
    if (!botResponse?.data?.botFiles) return 0;
    
    const sectionData = botResponse.data.botFiles[section];
    if (!sectionData) return 0;
    
    if (sectionData.files && typeof sectionData.files === 'object') {
      return Object.keys(sectionData.files).length;
    }
    
    if (typeof sectionData === 'object' && sectionData !== null) {
      return Object.keys(sectionData).length;
    }
    
    return 0;
  };

  // Animation variants
  const fadeIn = { initial: { opacity: 0 }, animate: { opacity: 1 } };
  const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };
  const stagger = { animate: { transition: { staggerChildren: 0.1 } } };

  return (
    <div className="min-h-screen bg-[#09090f] text-white font-mono relative">
      {/* Cosmic background */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 100, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -right-40 -top-40 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -150, 0],
            y: [0, 150, 0],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute right-0 bottom-0 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl"
        />
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-w-screen">
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gray-800/30 backdrop-blur-lg border-b border-gray-700/50"
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex flex-col">
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 mb-2">
                  <Rocket className="inline mr-3 w-8 h-8" />
                  AI Universe Builder
                </h1>
                <p className="text-gray-400 text-lg">
                  <Star className="inline w-4 h-4 mr-2" />
                  Create, manage, and deploy intelligent AI systems
                </p>
              </div>
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={fetchProjects}
                  className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreate}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full font-bold flex items-center gap-2 shadow-lg hover:shadow-xl hover:shadow-purple-700/40 transition-all"
                >
                  <Plus className="w-6 h-6" />
                  Launch Project
                </motion.button>
              </div>
            </div>
          </div>
        </motion.header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Stats */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <motion.div
              variants={fadeIn}
              className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 text-center"
            >
              <div className="text-3xl font-bold text-white mb-2">{projects.length}</div>
              <div className="text-sm text-gray-400">Total Projects</div>
            </motion.div>
            <motion.div
              variants={fadeIn}
              className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 text-center"
            >
              <div className="text-3xl font-bold text-green-400 mb-2">
                {projects.filter(p => p.status === 'active').length}
              </div>
              <div className="text-sm text-gray-400">Active</div>
            </motion.div>
            <motion.div
              variants={fadeIn}
              className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 text-center"
            >
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {projects.filter(p => p.status === 'in_progress').length}
              </div>
              <div className="text-sm text-gray-400">In Progress</div>
            </motion.div>
            <motion.div
              variants={fadeIn}
              className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 text-center"
            >
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {projects.filter(p => p.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-400">Completed</div>
            </motion.div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row gap-4 mb-8"
          >
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg focus:outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg focus:outline-none focus:border-purple-500/50 transition-colors"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="in_progress">In Progress</option>
              <option value="draft">Draft</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>
          </motion.div>

          {/* Projects Grid */}
          <motion.div layout className="relative">
            {loading ? (
              <motion.div
                variants={fadeInUp}
                className="flex flex-col items-center justify-center py-32 text-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, ease: "linear", duration: 1.5 }}
                  className="w-16 h-16 rounded-full border-4 border-purple-500/70 border-t-purple-500 flex items-center justify-center mb-6"
                >
                  <Brain className="w-8 h-8 text-purple-400 animate-pulse" />
                </motion.div>
                <p className="text-2xl font-semibold bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent">
                  Loading your AI Universe...
                </p>
              </motion.div>
            ) : error ? (
              <motion.div
                variants={fadeInUp}
                className="flex flex-col items-center justify-center py-32 text-center"
              >
                <div className="p-8 rounded-xl border border-red-500/30 bg-gradient-to-r from-red-700/20 to-red-800/20 backdrop-blur-sm max-w-md mx-auto">
                  <p className="text-xl font-semibold mb-2">Error: {error}</p>
                  <p className="text-gray-400 mb-4">Could not connect to the cosmos</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={fetchProjects}
                    className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 rounded-lg"
                  >
                    Retry
                  </motion.button>
                </div>
              </motion.div>
            ) : filteredProjects.length === 0 ? (
              <motion.div
                variants={fadeInUp}
                className="flex flex-col items-center justify-center py-32 text-center"
              >
                <Layers className="w-16 h-16 text-gray-600 mb-6" />
                <h3 className="text-2xl font-semibold text-gray-400 mb-2">
                  {projects.length === 0 ? "No projects yet" : "No matching projects"}
                </h3>
                <p className="text-lg text-gray-500 max-w-md mb-8">
                  {projects.length === 0
                    ? "Start building your AI universe with your first project"
                    : "Try adjusting your search or filters"
                  }
                </p>
                {projects.length === 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCreate}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full font-semibold flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Create Your First Project
                  </motion.button>
                )}
              </motion.div>
            ) : (
              <motion.div
                layout
                variants={stagger}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence>
                  {filteredProjects.map((project) => (
                    <motion.div
                      layout
                      key={project._id}
                      variants={fadeInUp}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="group relative bg-gradient-to-tr from-[#11111d] to-[#0c0c17] border-2 border-gray-700/30 rounded-2xl p-6 overflow-hidden shadow-lg hover:border-purple-500/50 transition-all duration-300"
                    >
                      {/* Status indicator */}
                      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
                        project.status === 'active' ? 'from-green-500 to-emerald-500' :
                        project.status === 'in_progress' ? 'from-blue-500 to-cyan-500' :
                        project.status === 'completed' ? 'from-purple-500 to-pink-500' :
                        'from-yellow-500 to-orange-500'
                      }`} />

                      {/* Header */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20">
                          {getCategoryIcon(project.category)}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all">
                            {project.name}
                          </h3>
                          <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                            {project.description || "No description"}
                          </p>
                        </div>
                      </div>
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        <span className={`px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(project.status)}`}>
                          {project.status?.replace('_', ' ') || "draft"}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-gray-700/50 border border-gray-600/50 text-xs font-medium text-gray-300 capitalize">
                          {project.category || "general"}
                        </span>
                      </div>
                      {/* Actions */}
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleViewFlow(project)}
                          className="flex-1 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEdit(project)}
                          className="flex-1 px-3 py-2 bg-gray-600/20 hover:bg-gray-600/30 text-gray-300 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                          Edit
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(project._id)}
                          className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm font-medium transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </motion.div>
        </main>
      </div>

      {/* All your existing modals remain exactly the same */}
      {/* View Project Modal */}
      <AnimatePresence>
        {showViewModal && selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border-2 border-blue-500/20 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                    Project Details
                  </h2>
                  <p className="text-gray-400 mt-2">View project information and settings</p>
                </div>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-2 rounded-full hover:bg-gray-700/50 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Project Info */}
                <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    Project Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Project Name</label>
                      <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-600/50">
                        {selectedProject.name}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Status</label>
                      <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-600/50">
                        <span className={`px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(selectedProject.status)}`}>
                          {selectedProject.status?.replace('_', ' ') || "draft"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Category</label>
                      <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-600/50 capitalize">
                        {selectedProject.category || "general"}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Created</label>
                      <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-600/50">
                        {new Date(selectedProject.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm text-gray-300 mb-1">Description</label>
                    <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-600/50 min-h-[80px]">
                      {selectedProject.description || "No description available"}
                    </div>
                  </div>
                </div>

                {/* Project Settings/Data */}
                {selectedProject.prompt && (
                  <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Brain className="w-5 h-5 text-purple-400" />
                      AI Configuration
                    </h3>
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Bot Prompt</label>
                      <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-600/50 max-h-40 overflow-y-auto">
                        {selectedProject.prompt}
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowViewModal(false);
                      handleEdit(selectedProject);
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full font-bold flex items-center justify-center gap-2"
                  >
                    <Edit3 className="w-5 h-5" />
                    Edit Project
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowViewModal(false)}
                    className="px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 rounded-full font-bold"
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Project Modal */}
      <AnimatePresence>
        {showEditModal && selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border-2 border-purple-500/20 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-300">
                    Edit Project
                  </h2>
                  <p className="text-gray-400 mt-2">Update your project information</p>
                </div>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 rounded-full hover:bg-gray-700/50 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-purple-400" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Project Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={editFormData.name}
                        onChange={handleEditInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-lg focus:outline-none focus:border-purple-500/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Status</label>
                      <select
                        name="status"
                        value={editFormData.status}
                        onChange={handleEditInputChange}
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-lg focus:outline-none focus:border-purple-500/50 transition-colors"
                      >
                        <option value="draft">Draft</option>
                        <option value="active">Active</option>
                        <option value="in_progress">In Progress</option>
                        <option value="paused">Paused</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm text-gray-300 mb-2">Category</label>
                    <select
                      name="category"
                      value={editFormData.category}
                      onChange={handleEditInputChange}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-lg focus:outline-none focus:border-purple-500/50 transition-colors"
                    >
                      <option value="general">General</option>
                      <option value="conversational">Conversational</option>
                      <option value="creative">Creative</option>
                      <option value="development">Development</option>
                      <option value="analytics">Analytics</option>
                      <option value="audio">Audio</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm text-gray-300 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={editFormData.description}
                      onChange={handleEditInputChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-lg focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
                      placeholder="Describe your project..."
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                  <motion.button
                    type="submit"
                    disabled={isUpdating}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full font-bold flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-purple-700/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Changes
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 rounded-full font-bold border border-gray-600/50 transition-all"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bot Creation Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border-2 border-purple-500/20 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              {!showBotResult ? (
                <>
                  {/* Bot Creation Modal Form */}
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-300">
                        Create AI Bot
                      </h2>
                      <p className="text-gray-400 mt-2">Build your intelligent assistant step by step</p>
                    </div>
                    <button
                      onClick={() => setIsCreateModalOpen(false)}
                      className="p-2 rounded-full hover:bg-gray-700/50 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Prompt Section */}
                    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30">
                      <div className="flex items-center gap-3 mb-4">
                        <Brain className="w-5 h-5 text-purple-400" />
                        <h3 className="text-lg font-semibold">Bot Prompt</h3>
                        <span className="text-red-400">*</span>
                      </div>
                      <textarea
                        name="prompt"
                        value={botData.prompt}
                        onChange={handleInputChange}
                        required
                        minLength={10}
                        rows={4}
                        placeholder="Describe your bot's purpose, personality, and behavior in detail..."
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-lg focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
                      />
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-sm text-gray-500">
                          {botData.prompt.length} characters (min: 10)
                        </span>
                        <motion.button
                          type="button"
                          onClick={generateQuestionsFromPrompt}
                          disabled={!botData.prompt.trim() || isGeneratingQuestions}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {isGeneratingQuestions ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1 }}
                                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                              />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Zap className="w-4 h-4" />
                              Generate Questions
                            </>
                          )}
                        </motion.button>
                      </div>
                    </div>

                    {/* Generated Questions Display */}
                   {generatedQuestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-900/20 border border-green-500/30 rounded-xl p-4"
                      >
                        <h4 className="text-green-400 font-medium mb-2">Generated Questions:</h4>
                        <ul className="text-sm text-gray-300 space-y-1">
                          {generatedQuestions.map((q, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-green-400 mt-1">•</span>
                              {q.question}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}

                    {/* Questions Section */}
                    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30">
                      <div className="flex items-center gap-3 mb-4">
                        <FileText className="w-5 h-5 text-blue-400" />
                        <h3 className="text-lg font-semibold">Questions & Scenarios</h3>
                        <span className="text-gray-500">(optional)</span>
                      </div>
                      <input
                        type="text"
                        name="questions"
                        value={botData.questions}
                        onChange={handleInputChange}
                        placeholder="What questions should your bot handle? (comma-separated)"
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-lg focus:outline-none focus:border-blue-500/50 transition-colors"
                      />
                    </div>

                    {/* Training Data Section */}
                    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30">
                      <div className="flex items-center gap-3 mb-4">
                        <Database className="w-5 h-5 text-green-400" />
                        <h3 className="text-lg font-semibold">Training Data</h3>
                        <span className="text-gray-500">(optional)</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-300 mb-2">Training Text</label>
                          <textarea
                            name="trainingText"
                            value={botData.trainingText}
                            onChange={handleInputChange}
                            rows={3}
                            placeholder="Paste any text your bot should learn from..."
                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-lg focus:outline-none focus:border-green-500/50 transition-colors resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-300 mb-2">Training URL</label>
                          <div className="relative mb-3">
                            <Link className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                              type="url"
                              name="trainingLink"
                              value={botData.trainingLink}
                              onChange={handleInputChange}
                              placeholder="https://example.com/data"
                              className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-lg focus:outline-none focus:border-green-500/50 transition-colors"
                            />
                          </div>
                          <label className="block text-sm text-gray-300 mb-2">Upload PDF</label>
                          <div className="relative">
                            <Upload className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                              type="file"
                              name="trainingFile"
                              onChange={handleInputChange}
                              accept=".pdf"
                              className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-lg focus:outline-none focus:border-green-500/50 transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Status Messages */}
                    <AnimatePresence>
                      {submitSuccess && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="p-4 bg-green-900/30 border border-green-500/50 rounded-xl text-green-300"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            {submitSuccess}
                          </div>
                        </motion.div>
                      )}
                      {submitError && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="p-4 bg-red-900/30 border border-red-500/50 rounded-xl text-red-300"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                            {submitError}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-6">
                      <motion.button
                        type="submit"
                        disabled={isSubmitting || !botData.prompt.trim()}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full font-bold flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-purple-700/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 1 }}
                              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            />
                            Generating Bot...
                          </>
                        ) : (
                          <>
                            <Rocket className="w-5 h-5" />
                            Generate Bot
                          </>
                        )}
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={() => setIsCreateModalOpen(false)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 rounded-full font-bold border border-gray-600/50 transition-all"
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </form>
                </>
              ) : (
                /* Bot Generation Result */
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-400">
                        Bot Generated Successfully! 🎉
                      </h2>
                      <p className="text-gray-400 mt-2">Your AI bot has been created and is ready to use</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsCreateModalOpen(false);
                        setShowBotResult(false);
                      }}
                      className="p-2 rounded-full hover:bg-gray-700/50 transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Generated Files Summary Section */}
                  {botResponse && (
                    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Code className="w-5 h-5 text-blue-400" />
                        Generated Files Summary
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Frontend */}
                        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                          <h4 className="font-medium text-blue-400 mb-2">Frontend</h4>
                          <div className="text-2xl font-bold text-white mb-1">
                            {getFileCount('frontend')}
                          </div>
                          <div className="text-sm text-gray-400">Files</div>
                        </div>
                        
                        {/* Backend */}
                        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                          <h4 className="font-medium text-green-400 mb-2">Backend</h4>
                          <div className="text-2xl font-bold text-white mb-1">
                            {getFileCount('backend')}
                          </div>
                          <div className="text-sm text-gray-400">Files</div>
                        </div>
                        
                        {/* Config */}
                        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                          <h4 className="font-medium text-purple-400 mb-2">Config</h4>
                          <div className="text-2xl font-bold text-white mb-1">
                            {getFileCount('config')}
                          </div>
                          <div className="text-sm text-gray-400">Files</div>
                        </div>
                      </div>

                      {/* Total Files Count */}
                      <div className="mt-4 pt-4 border-t border-gray-700/30">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-400">Total Files Generated:</span>
                          <span className="font-semibold text-white">
                            {getFileCount('frontend') + getFileCount('backend') + getFileCount('config')}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full font-bold flex items-center justify-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      Download Project
                    </motion.button>
                    <motion.button
                      onClick={() => setShowCodeViewer(true)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full font-bold flex items-center justify-center gap-2"
                    >
                      <Eye className="w-5 h-5" />
                      View Code
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        setIsCreateModalOpen(false);
                        setShowBotResult(false);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 rounded-full font-bold"
                    >
                      Close
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Code Viewer Modal */}
      <AnimatePresence>
        {showCodeViewer && (generatedBot || botResponse) && (
          <CodeViewer
            generatedBot={generatedBot}
            botResponse={botResponse}  
            onClose={() => {
              setShowCodeViewer(false);
              setIsCreateModalOpen(false);
              setShowBotResult(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* ⭐ NEW - BotSuggestions Component */}
      <BotSuggestions
        generatedBotData={lastGeneratedBot}
        onSuggestionSelect={handleSuggestionSelect}
        onClose={() => setShowSuggestions(false)}
        isVisible={showSuggestions}
        userToken={token}
        isGenerating={isSubmitting}
      />
    </div>
  );
};

export default Dashboard;
