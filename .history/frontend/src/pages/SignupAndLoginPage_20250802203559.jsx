import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowLeft, ArrowRight } from "lucide-react";

const swipeVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0
  })
};

const formsTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.5
};

const SignupAndLoginPage = () => {
  const [page, setPage] = useState("login"); // "signup" or "login"
  const [direction, setDirection] = useState(0); // For swipe direction

  const togglePage = (newPage) => {
    if (newPage === page) return;
    setDirection(newPage === "signup" ? 1 : -1);
    setPage(newPage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center px-4">
      <div className="bg-gray-900/80 backdrop-blur-lg rounded-3xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden">
        <h2 className="text-3xl font-extrabold text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text mb-8 text-center select-none">
          {page === "login" ? "Welcome Back" : "Create Your Account"}
        </h2>

        <AnimatePresence initial={false} custom={direction}>
          {page === "login" ? (
            <motion.form
              key="login"
              custom={direction}
              variants={swipeVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={formsTransition}
              className="flex flex-col space-y-6"
              onSubmit={e => e.preventDefault()}
            >
              <div className="relative">
                <Mail className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="relative">
                <Lock className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 py-3 rounded-xl font-semibold text-white hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
              >
                Log In
              </button>
              <p className="text-gray-400 text-center">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => togglePage("signup")}
                  className="text-cyan-400 hover:underline font-semibold flex items-center justify-center gap-1 mx-auto"
                >
                  Sign Up <ArrowRight className="w-4 h-4" />
                </button>
              </p>
            </motion.form>
          ) : (
            <motion.form
              key="signup"
              custom={direction}
              variants={swipeVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={formsTransition}
              className="flex flex-col space-y-6"
              onSubmit={e => e.preventDefault()}
            >
              <div className="relative">
                <User className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="relative">
                <Mail className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="relative">
                <Lock className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 py-3 rounded-xl font-semibold text-white hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
              >
                Create Account
              </button>
              <p className="text-gray-400 text-center">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => togglePage("login")}
                  className="text-cyan-400 hover:underline font-semibold flex items-center justify-center gap-1 mx-auto"
                >
                  Log In <ArrowLeft className="w-4 h-4" />
                </button>
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SignupAndLoginPage;
