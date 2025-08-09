import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useUser } from "../context/userContext";
import {
  Plus, Brain, Layers, Rocket, Settings, Zap, ChevronDown, Bell, User,
  Search, Globe, Palette, Code, Database, Star, FileText, Link, Upload,
  Play, Pause, Trash2, Edit3, Eye, Download, RefreshCw
} from "lucide-react";
import CodeViewer from "../components/CodeViewer";

const Dashboard = () => {
  // Core state
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCodeViewer, setShowCodeViewer] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

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
  const [showBotResult, setShowBotResult] = useState(false);

  // Extract projects from API response
  const extractProjects = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.projects)) return data.projects;
    if (Array.isArray(data.data?.projects)) return data.data.projects;
    return [];
  };

  // Fetch projects from backend
  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_URL}/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const projects = extractProjects(res.data);
      setProjects(projects);
    } catch (err) {
      console.error("Fetch projects error:", err);
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

  // Generate questions from prompt
  const generateQuestionsFromPrompt = async () => {
    if (!botData.prompt.trim()) {
      setSubmitError("Please enter a prompt first");
      return;
    }

    setIsGeneratingQuestions(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_URL}/api/prompts/generate-questions`,
        {
          prompt: botData.prompt,
          context: {},
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setGeneratedQuestions(res.data.data.questions);
        setBotData({ ...botData, questions: res.data.data.questions.join(", ") });
      }
    } catch (err) {
      console.error("Generate questions error:", err);
      setSubmitError("Failed to generate questions");
    } finally {
      setIsGeneratingQuestions(false);
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
      console.error(err);
      alert("Failed to delete project");
    }
  };

  // Edit project
  const handleEdit = (id) => {
    navigate(`/projects/edit/${id}`);
  };

  // View project flow
  const handleViewFlow = (id) => {
    navigate(`/projects/flow/${id}`);
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
    setShowBotResult(false);
    setShowCodeViewer(false);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "trainingFile") {
      setBotData({ ...botData, [name]: files[0] });
    } else {
      setBotData({ ...botData, [name]: value });
    }
  };

  // Submit bot generation form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

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

      if (res.data.success) {
        setSubmitSuccess("Bot generated successfully!");
        setGeneratedBot(res.data.data);
        setShowBotResult(true);
        fetchProjects(); // Refresh projects list
      } else {
        setSubmitError(res.data.message || "Failed to generate bot");
      }
    } catch (err) {
      console.error("Bot generation error:", err);
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
        {/* Stars */}
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
                          onClick={() => handleViewFlow(project._id)}
                          className="flex-1 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEdit(project._id)}
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
                              {q}
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

                  {generatedBot && (
                    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Code className="w-5 h-5 text-blue-400" />
                        Generated Files Summary
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                          <h4 className="font-medium text-blue-400 mb-2">Frontend</h4>
                          <div className="text-2xl font-bold text-white mb-1">
                            {Object.keys(generatedBot.frontend?.files || {}).length}
                          </div>
                          <div className="text-sm text-gray-400">Files</div>
                        </div>
                        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                          <h4 className="font-medium text-green-400 mb-2">Backend</h4>
                          <div className="text-2xl font-bold text-white mb-1">
                            {Object.keys(generatedBot.backend?.files || {}).length}
                          </div>
                          <div className="text-sm text-gray-400">Files</div>
                        </div>
                        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                          <h4 className="font-medium text-purple-400 mb-2">Config</h4>
                          <div className="text-2xl font-bold text-white mb-1">
                            {Object.keys(generatedBot.config?.files || {}).length}
                          </div>
                          <div className="text-sm text-gray-400">Files</div>
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
        {showCodeViewer && generatedBot && (
          <CodeViewer
            generatedBot={generatedBot}
            onClose={() => {
              setShowCodeViewer(false);
              setIsCreateModalOpen(false);
              setShowBotResult(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
