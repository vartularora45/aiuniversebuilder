import React from "react";
import { motion } from "framer-motion";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-[#0e1016] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md p-8 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 shadow-xl"
      >
        <h2 className="text-3xl font-bold text-center text-white mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-sm text-white/50 mb-6">
          Log in to your AI Universe Builder account
        </p>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-lg bg-[#1a1c24] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg bg-[#1a1c24] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm text-white/50">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-fuchsia-500" />
              Remember me
            </label>
            <a href="#" className="text-fuchsia-500 hover:underline">
              Forgot Password?
            </a>
          </div>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px #d946ef" }}
            transition={{ type: "spring", stiffness: 250 }}
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-500 text-white font-semibold rounded-lg shadow-lg"
          >
            Login
          </motion.button>
        </form>

        <p className="mt-6 text-center text-white/60 text-sm">
          Don’t have an account?{" "}
          <a href="#" className="text-cyan-400 hover:underline">
            Sign up
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
