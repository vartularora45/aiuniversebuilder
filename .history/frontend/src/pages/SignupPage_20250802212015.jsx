import React from "react";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const inputFocus = {
  borderColor: "#8b5cf6",
  boxShadow: "0 0 8px 2px rgba(139, 92, 246, 0.6)",
  transition: { duration: 0.3 }
};

const SignUpPage = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] px-4 py-10 relative overflow-hidden">
      
      {/* Animated Background Glowing Vignette */}
      <motion.div
        initial={{ opacity: 0.25, scale: 1 }}
        animate={{ opacity: [0.25, 0.5, 0.3, 0.25], scale: [1, 1.05, 1, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(139, 92, 246, 0.4), transparent 70%)"
        }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="backdrop-blur-lg bg-white/5 border border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] rounded-3xl p-10 w-full max-w-2xl text-white relative z-10"
      >
        {/* Heading with shimmering gradient */}
        <motion.h2
          className="text-4xl font-extrabold text-center mb-6 tracking-tight bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-transparent bg-clip-text drop-shadow-lg select-none"
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{
            backgroundSize: "200% 200%",
            duration: 6,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          Create Your AI Universe Builder Account
        </motion.h2>

        <form className="space-y-8" onSubmit={e => e.preventDefault()}>

          <div className="flex flex-col md:flex-row gap-6">
            <AnimatedInput
              label="First Name"
              type="text"
              placeholder="Vartul"
              focusColor="#a855f7"
            />
            <AnimatedInput
              label="Last Name"
              type="text"
              placeholder="Singh"
              focusColor="#a855f7"
            />
          </div>

          <AnimatedInput
            label="Email"
            type="email"
            placeholder="you@example.com"
            focusColor="#3b82f6"
          />

          <AnimatedInput
            label="Password"
            type="password"
            placeholder="••••••••"
            focusColor="#3b82f6"
          />

          <div>
            <label className="text-sm font-medium mb-2 block select-none">
              Role
            </label>
            <motion.select
              whileFocus={inputFocus}
              className="w-full bg-[#1f1f2e]/70 text-white border border-white/10 px-4 py-3 rounded-lg focus:outline-none transition"
              style={{ boxShadow: "none" }}
              defaultValue=""
            >
              <option value="" disabled>
                Select Role
              </option>
              <option value="developer">Developer</option>
              <option value="designer">Designer</option>
              <option value="researcher">Researcher</option>
              <option value="founder">Founder</option>
            </motion.select>
          </div>

          <motion.button
            type="submit"
            whileHover={{
              scale: 1.03,
              filter: "brightness(1.1)",
              boxShadow: "0 0 20px rgba(139, 92, 246, 0.8)"
            }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 shadow-lg transition-transform"
          >
            🚀 Sign Up
          </motion.button>
        </form>

        <p className="text-sm text-gray-400 mt-8 text-center select-none">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-400 hover:underline font-semibold"
          >
            Login here
          </a>
        </p>

        {/* subtle overlay for depth */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.15) 100%)"
          }}
        />
      </motion.div>
    </div>
  );
};

const AnimatedInput = ({ label, type, placeholder, focusColor }) => {
  return (
    <div>
      <label className="text-sm font-medium mb-2 block select-none">{label}</label>
      <motion.input
        type={type}
        placeholder={placeholder}
        whileFocus={{
          borderColor: focusColor,
          boxShadow: `0 0 8px 2px ${focusColor}aa`
        }}
        className="w-full bg-[#1f1f2e]/70 text-white border border-white/10 px-4 py-3 rounded-lg transition"
        style={{ outline: "none" }}
        required
      />
    </div>
  );
};

export default SignUpPage;
