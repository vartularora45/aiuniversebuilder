import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
import { 
  Brain, 
  LogOut, 
  Settings, 
  Plus, 
  BarChart3,
  FileText,
  MessageSquare,
  Image,
  Code
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const aiTools = [
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Smart Chatbot",
      description: "Conversational AI assistant",
      color: "from-blue-500 to-cyan-500",
      count: 3
    },
    {
      icon: <Image className="w-8 h-8" />,
      title: "Image Generator",
      description: "AI-powered image creation",
      color: "from-purple-500 to-pink-500",
      count: 1
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Text Summarizer",
      description: "Intelligent content summary",
      color: "from-green-500 to-emerald-500",
      count: 2
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: "Code Assistant",
      description: "AI coding companion",
      color: "from-orange-500 to-red-500",
      count: 0
    }
  ];

  return (
    <div className="min-h-screen min-w-screen bg-gray-900 text-white">
      {/* Cosmic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative z-10 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800/50 p-6"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              <Brain className="w-8 h-8 text-purple-400" />
              AI Universe
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <img 
                src={user.picture} 
                alt={user.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user.name.split(' ')[0]}!</h1>
          <p className="text-gray-400 text-lg">Build, deploy, and manage your AI tools from one dashboard.</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-8 h-8 text-purple-400" />
              <h3 className="text-lg font-semibold">Total Tools</h3>
            </div>
            <p className="text-3xl font-bold">6</p>
            <p className="text-sm text-gray-400">+2 this month</p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center gap-3 mb-2">
              <Settings className="w-8 h-8 text-cyan-400" />
              <h3 className="text-lg font-semibold">Active</h3>
            </div>
            <p className="text-3xl font-bold">4</p>
            <p className="text-sm text-gray-400">Currently running</p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-8 h-8 text-green-400" />
              <h3 className="text-lg font-semibold">API Calls</h3>
            </div>
            <p className="text-3xl font-bold">1.2K</p>
            <p className="text-sm text-gray-400">This month</p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center gap-3 mb-2">
              <Plus className="w-8 h-8 text-yellow-400" />
              <h3 className="text-lg font-semibold">Templates</h3>
            </div>
            <p className="text-3xl font-bold">12</p>
            <p className="text-sm text-gray-400">Available</p>
          </div>
        </motion.div>

        {/* AI Tools Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Your AI Tools</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg font-semibold flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create New Tool
            </motion.button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {aiTools.map((tool, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`p-6 rounded-xl bg-gradient-to-br ${tool.color} bg-opacity-10 backdrop-blur-sm border border-gray-700/50 hover:border-opacity-50 transition-all duration-300 cursor-pointer`}
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${tool.color} bg-opacity-20 mb-4`}>
                  {tool.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{tool.title}</h3>
                <p className="text-gray-300 mb-4">{tool.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">{tool.count} created</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-colors"
                  >
                    Create
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
        >
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium">Chatbot deployed successfully</p>
                <p className="text-sm text-gray-400">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-lg">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium">New image generator created</p>
                <p className="text-sm text-gray-400">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-lg">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium">API key regenerated</p>
                <p className="text-sm text-gray-400">1 day ago</p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
