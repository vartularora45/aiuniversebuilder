import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { 
  Zap, 
  Brain, 
  Code2, 
  Workflow, 
  Shield, 
  Layers, 
  Rocket, 
  Users, 
  Star,
  ArrowRight,
  Github,
  Twitter,
  Mail,
  Menu,
  X,
  Cpu,
  Network,
  Database,
  Cloud,
  Lock,
  Gauge,
  Sparkles,
  Eye,
  Fingerprint,
  Globe
} from 'lucide-react';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentFeature, setCurrentFeature] = useState(0);
  const [activeParticles, setActiveParticles] = useState([]);
  
  const { scrollYProgress } = useScroll();
  const yPosAnim = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const scaleAnim = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);
  
  // Mouse tracking for interactive elements
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Particle system
  useEffect(() => {
    const particles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
    }));
    setActiveParticles(particles);

    const animateParticles = () => {
      setActiveParticles(prev => prev.map(particle => ({
        ...particle,
        x: (particle.x + particle.speedX + window.innerWidth) % window.innerWidth,
        y: (particle.y + particle.speedY + window.innerHeight) % window.innerHeight,
      })));
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % 6);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const features = [
    {
      icon: <Workflow className="w-12 h-12" />,
      title: "Neural Workflow Engine",
      description: "AI-powered drag-and-drop with predictive component suggestions and auto-optimization.",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-900/20 to-pink-900/20"
    },
    {
      icon: <Brain className="w-12 h-12" />,
      title: "Quantum Model Fusion",
      description: "Seamlessly blend GPT-4, Claude, Llama, and 100+ models with intelligent load balancing.",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-900/20 to-cyan-900/20"
    },
    {
      icon: <Code2 className="w-12 h-12" />,
      title: "Hypercode Generation",
      description: "Export optimized code in 15+ languages with built-in performance profiling.",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-900/20 to-emerald-900/20"
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Fort Knox Security",
      description: "Military-grade encryption, zero-knowledge architecture, and quantum-resistant protocols.",
      gradient: "from-red-500 to-orange-500",
      bgGradient: "from-red-900/20 to-orange-900/20"
    },
    {
      icon: <Layers className="w-12 h-12" />,
      title: "Dimensional Caching",
      description: "Multi-layer intelligent caching with predictive preloading and edge distribution.",
      gradient: "from-yellow-500 to-amber-500",
      bgGradient: "from-yellow-900/20 to-amber-900/20"
    },
    {
      icon: <Rocket className="w-12 h-12" />,
      title: "Warp Speed Deploy",
      description: "Global edge deployment in <30 seconds with auto-scaling and real-time analytics.",
      gradient: "from-indigo-500 to-purple-500",
      bgGradient: "from-indigo-900/20 to-purple-900/20"
    }
  ];

  const stats = [
    { number: "1M+", label: "AI Workflows", icon: <Network className="w-6 h-6" /> },
    { number: "50K+", label: "Developers", icon: <Users className="w-6 h-6" /> },
    { number: "99.99%", label: "Uptime", icon: <Gauge className="w-6 h-6" /> },
    { number: "23ms", label: "Avg Response", icon: <Zap className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),rgba(0,0,0,0))]" />
        
        {/* Floating Particles */}
        {activeParticles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-60"
            style={{
              left: particle.x,
              top: particle.y,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: particle.id * 0.1
            }}
          />
        ))}

        {/* Interactive Mouse Glow */}
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none"
          animate={{
            x: mousePosition.x - 192,
            y: mousePosition.y - 192,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 30 }}
        />
      </div>

      {/* Futuristic Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 w-full z-50 bg-black/10 backdrop-blur-2xl border-b border-purple-500/20"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="w-10 h-10 bg-gradient-to-br from-blue-400 via-purple-500 to-cyan-400 rounded-xl flex items-center justify-center relative overflow-hidden"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Brain className="w-6 h-6 text-white relative z-10" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
              <div>
                <span className="text-2xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  AI UNIVERSE
                </span>
                <div className="text-xs text-gray-400 -mt-1">BUILDER v3.0</div>
              </div>
            </motion.div>

            <div className="hidden md:flex items-center space-x-8">
              {['Features', 'Playground', 'Docs', 'API'].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="relative text-gray-300 hover:text-white transition-all duration-300 group"
                  whileHover={{ scale: 1.1 }}
                >
                  {item}
                  <motion.div
                    className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"
                  />
                </motion.a>
              ))}
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(139, 92, 246, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 px-6 py-3 rounded-xl font-bold relative overflow-hidden group"
              >
                <span className="relative z-10">Launch App</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* INSANE Hero Section */}
      <section className="relative pt-32 pb-32 px-6">
        <motion.div
          style={{ y: yPosAnim, scale: scaleAnim }}
          className="max-w-7xl mx-auto text-center relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, type: "spring", stiffness: 100 }}
            className="mb-8"
          >
            <motion.div
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-sm px-6 py-3 rounded-full border border-purple-500/30 mb-8"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-semibold">🚀 HACKATHON SPECIAL: Free Pro Access</span>
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-7xl md:text-9xl font-black mb-8 leading-none relative"
          >
            <motion.span
              className="block bg-gradient-to-r from-blue-400 via-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                backgroundSize: "200% 200%"
              }}
            >
              BUILD AI
            </motion.span>
            <motion.span
              className="block text-white"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              WITHOUT
            </motion.span>
            <motion.span
              className="block bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              LIMITS
            </motion.span>

            {/* Floating Elements */}
            <motion.div
              className="absolute -top-10 -left-10 w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 blur-xl"
              animate={{
                scale: [1, 1.5, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full opacity-20 blur-xl"
              animate={{
                scale: [1.5, 1, 1.5],
                rotate: [360, 180, 0]
              }}
              transition={{ duration: 6, repeat: Infinity }}
            />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="text-2xl md:text-3xl text-gray-300 mb-12 max-w-5xl mx-auto leading-relaxed font-light"
          >
            The first <span className="text-cyan-400 font-semibold">quantum-powered</span> no-code platform 
            that makes AI development feel like <span className="text-purple-400 font-semibold">magic</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-16"
          >
            <motion.button
              whileHover={{ 
                scale: 1.1, 
                boxShadow: "0 20px 60px rgba(59, 130, 246, 0.4)",
                y: -5
              }}
              whileTap={{ scale: 0.95 }}
              className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 px-12 py-6 rounded-2xl text-xl font-bold overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-purple-600 to-blue-600"
                initial={{ x: "100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10 flex items-center space-x-3">
                <span>Start Building Magic</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-6 h-6" />
                </motion.div>
              </span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group border-2 border-gray-600 px-12 py-6 rounded-2xl text-xl font-bold hover:border-purple-500 transition-all duration-300 relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              <span className="relative z-10 flex items-center space-x-3">
                <Eye className="w-6 h-6" />
                <span>Watch Live Demo</span>
              </span>
            </motion.button>
          </motion.div>

          {/* Crazy Stats Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.1, 
                  rotateY: 10,
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)"
                }}
                className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-all duration-300 group relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <div className="relative z-10">
                  <div className="flex items-center justify-center mb-3">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-1">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Mind-Blowing Features Section */}
      <section id="features" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl md:text-8xl font-black mb-8">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                SUPERPOWERS
              </span>
            </h2>
            <p className="text-2xl text-gray-300 max-w-4xl mx-auto">
              Features so advanced, they feel like science fiction
            </p>
          </motion.div>

          {/* Interactive Feature Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, rotateX: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.02, 
                  rotateY: 5,
                  z: 50,
                  boxShadow: "0 30px 60px rgba(0, 0, 0, 0.4)"
                }}
                className={`group relative bg-gradient-to-br ${feature.bgGradient} backdrop-blur-sm p-8 rounded-3xl border border-gray-700 hover:border-purple-500/50 transition-all duration-500 overflow-hidden cursor-pointer`}
                onMouseEnter={() => setCurrentFeature(index)}
              >
                {/* Animated Background */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                />
                
                {/* Floating Icon */}
                <motion.div
                  className={`bg-gradient-to-r ${feature.gradient} w-20 h-20 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden`}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-white/20 rounded-2xl"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  />
                  <span className="relative z-10 text-white">
                    {feature.icon}
                  </span>
                </motion.div>

                <h3 className="text-3xl font-black mb-4 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  {feature.description}
                </p>

                <motion.div
                  className="flex items-center text-purple-400 font-semibold group-hover:text-white transition-colors duration-300"
                  whileHover={{ x: 10 }}
                >
                  <span>Explore Feature</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </motion.div>

                {/* Particle Effects */}
                <motion.div
                  className="absolute top-4 right-4 w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100"
                  animate={{
                    scale: [1, 2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Insane CTA Section */}
      <section className="py-32 px-6 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="max-w-6xl mx-auto text-center relative"
        >
          {/* Background Effects */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-cyan-900/20 rounded-3xl blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 1, -1, 0]
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />

          <div className="relative z-10 bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl p-16 rounded-3xl border border-purple-500/30">
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-6xl md:text-8xl font-black mb-8"
            >
              Ready to
              <br />
              <span className="bg-gradient-to-r from-yellow-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
                DOMINATE
              </span>
              <br />
              the Hackathon?
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-2xl text-gray-300 mb-12 max-w-4xl mx-auto"
            >
              Join the <span className="text-cyan-400 font-bold">elite developers</span> who are already 
              building the future with AI Universe Builder
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-8"
            >
              <motion.button
                whileHover={{ 
                  scale: 1.1, 
                  boxShadow: "0 0 50px rgba(255, 215, 0, 0.5)",
                  y: -10
                }}
                whileTap={{ scale: 0.95 }}
                className="group relative bg-gradient-to-r from-yellow-500 via-red-500 to-pink-500 px-12 py-6 rounded-2xl text-2xl font-black overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"
                  animate={{ x: ["-100%", "100%", "-100%"] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <span className="relative z-10 flex items-center space-x-3 text-white">
                  <Rocket className="w-8 h-8" />
                  <span>LAUNCH UNIVERSE NOW</span>
                  <Sparkles className="w-8 h-8" />
                </span>
              </motion.button>
              
              <div className="flex flex-col items-center space-y-2">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-gray-300 text-lg">
                  <span className="text-cyan-400 font-bold">Free Forever</span> • No Limits • No BS
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Epic Footer */}
      <footer className="py-16 px-6 border-t border-purple-500/20 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <motion.div 
              className="flex items-center space-x-4 mb-8 md:mb-0"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="w-12 h-12 bg-gradient-to-br from-blue-400 via-purple-500 to-cyan-400 rounded-xl flex items-center justify-center relative overflow-hidden"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Brain className="w-7 h-7 text-white relative z-10" />
              </motion.div>
              <div>
                <span className="text-3xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  AI UNIVERSE
                </span>
                <div className="text-sm text-gray-400">The Future is Now</div>
              </div>
            </motion.div>

            <div className="flex items-center space-x-8">
              {[
                { icon: <Github className="w-6 h-6" />, href: "#", color: "hover:text-purple-400" },
                { icon: <Twitter className="w-6 h-6" />, href: "#", color: "hover:text-blue-400" },
                { icon: <Mail className="w-6 h-6" />, href: "#", color: "hover:text-cyan-400" }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ 
                    scale: 1.3, 
                    rotate: 360,
                    boxShadow: "0 0 20px rgba(139, 92, 246, 0.5)"
                  }}
                  whileTap={{ scale: 0.9 }}
                  className={`text-gray-400 ${social.color} transition-all duration-300 relative group`}
                >
                  {social.icon}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Animated Divider */}
          <motion.div
            className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mb-8"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1.5 }}
          />

          <div className="flex flex-col md:flex-row items-center justify-between text-gray-400">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-4 md:mb-0"
            >
              &copy; 2024 AI Universe Builder. 
              <span className="text-purple-400 font-semibold"> Redefining Possibility.</span>
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center space-x-6 text-sm"
            >
              <motion.a 
                href="#" 
                className="hover:text-purple-400 transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                Privacy Policy
              </motion.a>
              <motion.a 
                href="#" 
                className="hover:text-blue-400 transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                Terms of Service
              </motion.a>
              <motion.a 
                href="#" 
                className="hover:text-cyan-400 transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                API Docs
              </motion.a>
            </motion.div>
          </div>

          {/* Hidden Easter Egg */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.p
              className="text-xs text-gray-600"
              animate={{
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🚀 Built with 47 cups of coffee, 23 energy drinks, and pure hackathon madness
            </motion.p>
          </div>
        </div>

        {/* Final Background Effect */}
        <motion.div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-32 bg-gradient-to-t from-purple-900/10 to-transparent blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </footer>

      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-8 right-8 z-50"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 2, type: "spring", stiffness: 200 }}
      >
        <motion.button
          whileHover={{ 
            scale: 1.2, 
            rotate: 360,
            boxShadow: "0 0 30px rgba(139, 92, 246, 0.6)"
          }}
          whileTap={{ scale: 0.9 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-8 h-8 text-white" />
        </motion.button>
      </motion.div>

      {/* Loading Bar Effect */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />
    </div>
  );
};

export default LandingPage;