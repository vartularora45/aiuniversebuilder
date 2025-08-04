import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const gradientText = "bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-indigo-500 bg-clip-text text-transparent";

const Navbar = () => {
  // This useEffect hook dynamically loads the Tailwind CSS script into the document's head.
  // This is a workaround for environments where the script isn't included in the main HTML file.
  // It checks if the script already exists to prevent adding it multiple times.
  useEffect(() => {
    const scriptId = 'tailwind-cdn-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = "https://cdn.tailwindcss.com";
      document.head.appendChild(script);
    }
  }, []);

  return (
    <motion.nav
      className="sticky top-0 z-50 w-full bg-[#0e1016]/80 backdrop-blur-lg border-b border-white/10 shadow-2xl shadow-fuchsia-500/10"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 py-3">
        {/* Left: Icon + Brand */}
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 15 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="p-2 rounded-full bg-gradient-to-tr from-fuchsia-500 to-cyan-400 shadow-lg"
          >
            <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 text-white animate-pulse" />
          </motion.div>
          <span className={`text-xl sm:text-2xl font-extrabold tracking-tight ${gradientText}`}>
            AI Universe Builder
          </span>
        </div>
        {/* Right: Buttons */}
        <div className="hidden sm:flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05, y: -2, boxShadow: "0 0 15px rgba(255, 255, 255, 0.2)" }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2 rounded-xl text-white/90 font-medium bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-300"
          >
            Login
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, y: -2, boxShadow: "0 0 25px #5ffbf1, 0 0 40px #a21caf" }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 rounded-xl font-semibold bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-indigo-500 text-white shadow-lg transition-all duration-300"
          >
            Sign Up
          </motion.button>
        </div>
         <div className="sm:hidden">
           <button className="p-2 rounded-md text-white/80 hover:bg-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
           </button>
         </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
