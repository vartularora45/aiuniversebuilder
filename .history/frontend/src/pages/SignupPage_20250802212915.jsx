import React from "react";

const SignUpPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] relative overflow-hidden px-4 py-10">
      {/* Sparkle animation background */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff11_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

      {/* Frosted Glass Form */}
      <div className="z-10 backdrop-blur-md bg-white/5 border border-white/10 shadow-2xl rounded-3xl px-10 py-12 w-full max-w-2xl text-white relative animate-fadeIn">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-8 bg-gradient-to-r from-pink-500 via-purple-400 to-blue-500 text-transparent bg-clip-text drop-shadow-lg tracking-tight">
          Create Your <br /> AI Universe Builder Account
        </h1>

        <form className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full">
              <label className="block text-sm mb-1 font-medium text-gray-300">First Name</label>
              <input
                type="text"
                placeholder="Vartul"
                className="w-full bg-black/30 text-white border border-white/10 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div className="w-full">
              <label className="block text-sm mb-1 font-medium text-gray-300">Last Name</label>
              <input
                type="text"
                placeholder="Singh"
                className="w-full bg-black/30 text-white border border-white/10 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium text-gray-300">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full bg-black/30 text-white border border-white/10 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium text-gray-300">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-black/30 text-white border border-white/10 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium text-gray-300">Role</label>
            <select
              className="w-full bg-black/30 text-white border border-white/10 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="">Select Role</option>
              <option value="developer">Developer</option>
              <option value="designer">Designer</option>
              <option value="researcher">Researcher</option>
              <option value="founder">Founder</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:scale-105 transition-transform duration-300 shadow-xl"
          >
            🚀 Sign Up
          </button>
        </form>

        <p className="text-sm text-gray-400 mt-8 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:underline">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
