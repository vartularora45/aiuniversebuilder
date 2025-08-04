import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const Navbar = () => (
  <motion.nav
    className="sticky top-0 z-50 w-full bg-[#0e1016]/70 backdrop-blur-lg border-b border-white/10 shadow-lg"
    initial={{ y: -32, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.7, ease: "easeOut" }}
  >
    <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
      {/* Left: Icon + Brand */}
      <div className="flex items-center gap-3">
        <motion.div
          whileHover={{ scale: 1.1, filter: "brightness(1.4)" }}
          className="p-2 rounded-full bg-gradient-to-tr from-fuchsia-400 to-cyan-400 shadow-lg"
        >
          <Sparkles className="h-7 w-7 text-fuchsia-300 drop-shadow-neon animate-pulse" />
        </motion.div>
        <span className="text-2xl font-extrabold bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-indigo-400 bg-clip-text text-transparent tracking-tight">
          AI Universe Builder
        </span>
      </div>
      {/* Right: Buttons */}
      <div className="flex gap-4">
        <motion.button
          whileHover={{ scale: 1.06, boxShadow: "0 0 10px #fb37f4" }}
          className="px-5 py-2 rounded-xl text-white/90 font-medium bg-white/10 border border-white/10 backdrop-blur-lg shadow neon-glow transition"
        >
          Login
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1, boxShadow: "0 0 20px #5ffbf1" }}
          className="px-6 py-2 rounded-xl font-semibold bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-indigo-400 text-white neon-glow shadow-lg"
        >
          Sign Up
        </motion.button>
      </div>
    </div>
  </motion.nav>
);

export default Navbar;
