import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      className="fixed z-50 top-0 left-0 w-full px-6 md:px-12 py-4 flex justify-between items-center bg-[#0e1016]/60 border-b border-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.25)]"
    >
      {/* Left: Logo + Title */}
      <div className="flex items-center gap-3">
        <motion.div
          whileHover={{ rotate: 20, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="p-3 rounded-full bg-gradient-to-br from-cyan-400 via-fuchsia-500 to-purple-600 shadow-[0_0_20px_#a855f7]"
        >
          <Sparkles className="text-white w-6 h-6 drop-shadow-xl" />
        </motion.div>
        <motion.h1
          whileHover={{ scale: 1.04 }}
          className="text-[1.5rem] md:text-2xl font-extrabold bg-gradient-to-r from-white via-fuchsia-300 to-cyan-300 text-transparent bg-clip-text tracking-tight"
        >
          BotSmith AI
        </motion.h1>
      </div>

      {/* Right: Buttons */}
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="text-sm md:text-base px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
        >
          Login
        </motion.button>

        <motion.button
          whileHover={{
            scale: 1.08,
            boxShadow: "0 0 20px #a855f7, 0 0 10px #06b6d4",
          }}
          transition={{ type: "spring", stiffness: 220 }}
          className="bg-gradient-to-tr from-indigo-600 via-fuchsia-500 to-cyan-500 text-white px-6 py-2 rounded-xl shadow-md font-bold"
        >
          Sign Up
        </motion.button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
