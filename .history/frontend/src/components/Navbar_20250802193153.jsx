import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed z-30 left-0 top-0 w-full py-4 px-6 flex justify-between items-center bg-[#0e1016]/70 backdrop-blur border-b border-white/10">
      <div className="flex items-center gap-2">
        <motion.div
          initial={{ scale: 0.85 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 180 }}
          className="rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 p-2 shadow-lg"
        >
          <Sparkles className="w-6 h-6 text-white drop-shadow" />
        </motion.div>
        <span className="text-lg font-semibold tracking-tight text-white">
          AI Universe Builder
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button className="text-sm px-4 py-2 rounded-lg text-white/80 hover:bg-white/10 transition">Login</button>
        <motion.button whileHover={{ scale: 1.07, boxShadow: "0 0 8px #8b5cf6" }}
          className="bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-500 text-white px-5 py-2 rounded-lg shadow-lg font-semibold transition"
        >
          Sign Up
        </motion.button>
      </div>
    </nav>
  );
};

export default Navbar;
