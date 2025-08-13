import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import tusharImg from '../assets/tushar.png';
import { FaRobot, FaCogs, FaBolt, FaShieldAlt } from "react-icons/fa";
import {
  Menu, X, Rocket, Brain, Play, User, LogOut,
  Sparkles, Settings, Crown, Check, Star,
  Mail, Github, Twitter, Linkedin,
} from 'lucide-react';
import SignIn from '../pages/SignIn';
import toast from 'react-hot-toast';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const features = [
  {
    icon: <FaRobot size={40} />,
    title: "AI-Powered Chatbots",
    description: "Build intelligent chatbots with natural language understanding and personalized responses."
  },
  {
    icon: <FaCogs size={40} />,
    title: "Fully Customizable",
    description: "Customize the bot’s tone, behavior, and appearance to fit your brand perfectly."
  },
  {
    icon: <FaBolt size={40} />,
    title: "Fast Deployment",
    description: "Deploy your AI solutions instantly with minimal setup and zero downtime."
  },
  {
    icon: <FaShieldAlt size={40} />,
    title: "Secure & Reliable",
    description: "Enterprise-grade security ensures your data and users stay safe and protected."
  },
];

const pricingPlans = [
  {
    name: "Hobby",
    price: "Free",
    period: "",
    description: "Perfect for learning and personal projects",
    features: ["3 AI Tools", "Basic Templates", "Community Support", "Web Deployment"],
    popular: false,
    buttonText: "Start Free"
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For professionals and growing businesses",
    features: ["Unlimited AI Tools", "Advanced Templates", "Priority Support", "API Access", "Custom Branding", "Analytics Dashboard"],
    popular: true,
    buttonText: "Start Pro Trial"
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    description: "For large teams and organizations",
    features: ["Everything in Pro", "White-label Solution", "Custom Integrations", "24/7 Support", "On-premise Deployment", "SLA Guarantee"],
    popular: false,
    buttonText: "Contact Sales"
  }
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Product Manager",
    company: "TechCorp",
    image: "👩‍💼",
    text: "AI Universe Builder transformed how we prototype AI features. What used to take weeks now takes hours!",
    rating: 5
  },
  {
    name: "Marcus Rodriguez",
    role: "Startup Founder",
    company: "InnovateLab",
    image: "👨‍💻",
    text: "No-code AI development at its finest. Built and deployed 5 AI tools for our clients in just one day.",
    rating: 5
  },
  {
    name: "Emily Watson",
    role: "AI Researcher",
    company: "University",
    image: "👩‍🔬",
    text: "The drag-and-drop interface makes AI accessible to everyone on our research team, not just the programmers.",
    rating: 5
  }
];

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [typewriterText, setTypewriterText] = useState('');
  const [user, setUser] = useState(null);
  const fullText = 'Build Your Own BotSmith AI';

  const isLoggedIn = localStorage.getItem('token') && localStorage.getItem('user');

  useEffect(() => {
    if (isLoggedIn) {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    } else {
      setUser(null);
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully!');
    setIsMenuOpen(false);
  };

  // Typewriter effect
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setTypewriterText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 80);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen min-w-screen bg-gray-900 text-white overflow-x-hidden">
      {/* Cosmic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -100, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -150, 0], y: [0, 100, 0], rotate: [360, 180, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 -right-40 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 left-1/3 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"
        />
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      {/* Sticky Navbar */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 w-full z-50 backdrop-blur-lg bg-gray-900/80 border-b border-gray-800/50"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
            >
              <FaRobot className="w-8 h-8 text-purple-400" />
              BotSmith
            </motion.div>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {['Home', 'Features', 'Pricing'].map((item) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  whileHover={{ scale: 1.05 }}
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                >
                  {item}
                </motion.a>
              ))}
              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1 bg-gray-800/50 rounded-full border border-gray-700">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-sm font-bold">
                      {user?.first_name ? user.first_name.charAt(0).toUpperCase() :
                        user?.name ? user.name.charAt(0).toUpperCase() :
                          user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="text-sm text-gray-300 max-w-24 truncate">
                      {user?.first_name || user?.name || user?.email || 'User'}
                    </span>
                  </div>
                  <motion.button
                    onClick={handleLogout}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-1 text-gray-300 hover:text-red-400 transition-colors duration-300 cursor-pointer px-2 py-1 rounded-lg hover:bg-gray-800/50"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  onClick={() => setShowSignIn(true)}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer"
                >
                  <User className="w-5 h-5" />
                  <span>Sign In</span>
                </motion.button>
              )}
            </nav>

            {/* CTA Button Desktop */}
            {isLoggedIn ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => window.location.href = '/dashboard'}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full font-semibold text-sm"
              >
                <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                Dashboard
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(168, 85, 247, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSignIn(true)}
                className="hidden md:block px-6 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
              >
                Try Now
              </motion.button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden z-50 relative"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-gray-900/95 backdrop-blur-lg border-t border-gray-800/50"
            >
              <div className="container mx-auto px-6 py-4 space-y-4">
                {['Home', 'Features', 'Pricing'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="block text-gray-300 hover:text-white transition-colors duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
                {isLoggedIn ? (
                  <>
                    <div className="flex items-center gap-3 py-2 border-t border-gray-700">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-sm font-bold">
                        {user?.first_name ? user.first_name.charAt(0).toUpperCase() :
                          user?.name ? user.name.charAt(0).toUpperCase() :
                            user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <p className="text-gray-300 text-sm font-medium">
                          {user?.first_name || user?.name || 'User'}
                        </p>
                        {user?.email && (
                          <p className="text-gray-500 text-xs">{user.email}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        window.location.href = '/dashboard';
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full font-semibold mb-2"
                    >
                      Go to Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-gray-300 hover:text-red-400 transition-colors duration-300 text-left py-2"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setShowSignIn(true);
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 text-left"
                    >
                      <User className="w-5 h-5" />
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        setShowSignIn(true);
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full font-semibold"
                    >
                      Try Now
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero - Left */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="text-center lg:text-left"
            >
              <motion.h1
                variants={fadeInUp}
                className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent"
              >
                {typewriterText}
                <span className="animate-pulse">|</span>
              </motion.h1>
              <motion.p
                variants={fadeInUp}
                className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl"
              >
                Create, customize, and deploy AI tools without writing a single line of code. Your imagination is the only limit.
              </motion.p>
              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(168, 85, 247, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => isLoggedIn ? window.location.href = '/dashboard' : setShowSignIn(true)}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full font-semibold text-lg flex items-center gap-2 justify-center hover:shadow-2xl transition-all duration-300"
                >
                  <Rocket className="w-5 h-5" />
                  {isLoggedIn ? 'Go to Dashboard' : 'Launch Builder'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border border-gray-600 rounded-full font-semibold text-lg flex items-center gap-2 justify-center hover:border-purple-400 hover:bg-gray-800/50 transition-all duration-300"
                >
                  <Play className="w-5 h-5" /> Watch Demo
                </motion.button>
              </motion.div>
              {/* User Welcome */}
              {isLoggedIn && user && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="mt-6 p-4 bg-gradient-to-r from-purple-900/30 to-cyan-900/30 border border-purple-500/20 rounded-xl backdrop-blur-sm"
                >
                  <p className="text-lg">
                    Welcome back, <span className="font-semibold text-purple-400">
                      {user.first_name || user.name || user.email || 'User'}
                    </span>! Ready to continue building your AI universe?
                  </p>
                </motion.div>
              )}
            </motion.div>
            {/* Hero - Right (Image + Icons) */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="relative"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-80 h-[420px] rounded-full overflow-hidden border-4 border-gray-600 shadow-xl mx-auto"
              >
                <img
                  src={tusharImg}
                  className="w-full h-full object-cover object-center scale-[2] -translate-y-16"
                  alt="AI Mockup"
                />
              </motion.div>
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-3 shadow-lg"
              >
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full p-3 shadow-lg"
              >
                <Brain className="w-6 h-6 text-white" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-20"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
            >
              Powerful Features
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto"
            >
              Everything you need to build, customize, and deploy AI tools at scale effortlessly.
            </motion.p>
          </motion.div>
          {/* Features Grid */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 25px rgba(168, 85, 247, 0.5)",
                  backgroundColor: "rgba(109, 40, 217, 0.1)"
                }}
                className="group p-8 rounded-3xl bg-gray-800/40 backdrop-blur-md border border-gray-700/50 hover:border-purple-500/70 transition-all duration-300 cursor-pointer"
              >
                <div className="text-purple-400 group-hover:text-cyan-400 mb-5">{feature.icon}</div>
                <h3 className="text-2xl font-semibold mb-3 text-white group-hover:text-cyan-300 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-300 group-hover:text-gray-200 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Bot Preview Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            >
              Bot Preview
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto"
            >
              Experience your AI bot in action — sleek, smart, and easy to deploy.
            </motion.p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative rounded-3xl overflow-hidden border border-gray-700 bg-gray-800/50 backdrop-blur-lg shadow-2xl">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-blue-500/20 blur-3xl pointer-events-none" />
              <div className="p-6 md:p-10 relative z-10">
                <div className="flex justify-center items-center gap-4">
                  <span className="text-6xl select-none">🤖</span>
                </div>
                <div className="mt-6 text-center text-gray-300">
                  <p className="text-lg mb-4">
                    Chat with your AI bot, customize its tone, and deploy instantly.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
            >
              How It Works
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-300 max-w-2xl mx-auto"
            >
              Build your AI chatbot in three simple steps
            </motion.p>
          </motion.div>
          {[
            {
              number: "1", icon: "📂", title: "Upload Your Data",
              description: "Add your documents, PDFs, or website links. Our system instantly processes and prepares them for AI training.",
            },
            {
              number: "2", icon: "⚡", title: "Train Your Chatbot",
              description: "BotSmith connects your data with GPT-4 and creates a smart, context-aware chatbot—no coding required.",
            },
            {
              number: "3", icon: "🚀", title: "Deploy Anywhere",
              description: "Get your chatbot’s embed code and launch it on your website or connect it to WhatsApp, Slack, and more.",
            },
          ].map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`flex flex-col lg:flex-row items-center gap-8 mb-16 ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
            >
              <div className="flex-1">
                <div className="text-6xl font-bold text-purple-500/20 mb-4">{step.number}</div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl">
                    <span className="text-3xl">{step.icon}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    {step.title}
                  </h3>
                </div>
                <p className="text-lg text-gray-300">{step.description}</p>
              </div>
              <div className="flex-1">
                <div className="w-full h-64 bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl flex items-center justify-center">
                  <div className="text-gray-500 text-center">
                    <div className="text-8xl mb-4">{step.icon}</div>
                    <p>Step {step.number} Preview</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
            >
              Choose Your Plan
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-300 max-w-2xl mx-auto"
            >
              Start building for free, scale as you grow
            </motion.p>
          </motion.div>
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                className={`relative p-8 rounded-2xl border transition-all duration-300 ${plan.popular
                  ? 'bg-gradient-to-b from-purple-900/50 to-gray-800/50 border-purple-500 shadow-lg shadow-purple-500/25'
                  : 'bg-gray-800/30 backdrop-blur-sm border-gray-700/50 hover:border-purple-500/50'
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full text-sm font-semibold">
                      <Crown className="w-4 h-4" />
                      Most Popular
                    </div>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-400 ml-1">{plan.period}</span>
                  </div>
                  <p className="text-gray-300">{plan.description}</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => isLoggedIn ? window.location.href = '/dashboard' : setShowSignIn(true)}
                  className={`w-full py-3 rounded-full font-semibold transition-all duration-300 ${plan.popular
                    ? 'bg-gradient-to-r from-purple-500 to-cyan-500 hover:shadow-lg hover:shadow-purple-500/25'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                    }`}
                >
                  {isLoggedIn ? 'Upgrade Plan' : plan.buttonText}
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            >
              What Our Users Say
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-300 max-w-2xl mx-auto"
            >
              Join thousands of satisfied creators building the future with AI
            </motion.p>
          </motion.div>
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(168, 85, 247, 0.2)" }}
                className="p-8 rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
              >
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(testimonial.rating)].map((_, starIndex) => (
                    <Star key={starIndex} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{testimonial.image}</div>
                  <div>
                    <h4 className="font-semibold text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                    <p className="text-sm text-purple-400">{testimonial.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-800/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
              >
                <Brain className="w-8 h-8 text-purple-400" />
                AI Universe
              </motion.div>
              <p className="text-gray-400 max-w-md mb-6">
                Empowering creators to build the future of AI, one tool at a time. No code required, infinite possibilities unlocked.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg font-semibold flex items-center gap-2 justify-center"
                >
                  <Mail className="w-4 h-4" />
                  Subscribe
                </motion.button>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Docs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800">
            <p className="text-gray-400 mb-4 md:mb-0">
              &copy; 2025 AI Universe Builder. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <motion.a
                href="#"
                whileHover={{ scale: 1.1, color: "#8b5cf6" }}
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1, color: "#8b5cf6" }}
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                <Github className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1, color: "#8b5cf6" }}
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </motion.a>
            </div>
          </div>
        </div>
      </footer>

      {/* Sign In Modal */}
      <AnimatePresence>
        {showSignIn && <SignIn onClose={() => setShowSignIn(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;
