import React from "react";
import { motion } from "framer-motion";

const SignUpPage = () => {
  return (
    <div className="min-h-screen w-full bg-black bg-[radial-gradient(#3b0066_1px,transparent_1px)] [background-size:32px_32px] flex items-center justify-center p-6 overflow-hidden relative">
      
      {/* Animated background stars */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-b from-purple-900/40 to-black via-transparent opacity-50 animate-pulse blur-lg" />
        <div className="absolute w-full h-full bg-[url('/stars.svg')] opacity-20 animate-fade-in" />
      </div>

      {/* Signup card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl px-10 py-12 w-full max-w-xl text-white"
      >
        <h2 className="text-4xl font-extrabold text-center mb-8 tracking-wide bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
          Create Your AI Universe
        </h2>

        <form className="space-y-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="First Name"
              className="w-1/2 bg-transparent border border-white/20 rounded-xl px-4 py-3 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300"
            />
            <input
              type="text"
              placeholder="Last Name"
              className="w-1/2 bg-transparent border border-white/20 rounded-xl px-4 py-3 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300"
            />
          </div>

          <input
            type="email"
            placeholder="Email"
            className="w-full bg-transparent border border-white/20 rounded-xl px-4 py-3 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full bg-transparent border border-white/20 rounded-xl px-4 py-3 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
          />

          <select className="w-full bg-transparent border border-white/20 rounded-xl px-4 py-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300">
            <option className="bg-black text-white" value="">
              Select Role
            </option>
            <option className="bg-black text-white" value="user">
              User
            </option>
            <option className="bg-black text-white" value="admin">
              Admin
            </option>
          </select>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-500 py-3 rounded-xl font-semibold text-white hover:shadow-[0_0_20px_#b5179e] transition-all duration-300"
          >
            Sign Up
          </motion.button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-400">
          Already have an account?{" "}
          <a href="#" className="text-purple-400 hover:underline">
            Login
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
