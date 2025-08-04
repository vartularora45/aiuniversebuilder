import React from "react";

const SignUpPage = () => {
  return (
    <div className="min-h-screen  flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] px-6 py-10 relative overflow-hidden">
      {/* Background subtle animated stars */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(2px 2px at 20% 30%, rgba(255 255 255 / 0.15), transparent), " +
            "radial-gradient(1.5px 1.5px at 70% 60%, rgba(255 255 255 / 0.1), transparent), " +
            "radial-gradient(3px 3px at 80% 20%, rgba(255 255 255 / 0.05), transparent)"
        }}
      />
      {/* Frosted Glass Card */}
      <div className="relative z-10 backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-[0_0_30px_rgba(72,61,139,0.5)] max-w-lg w-full p-10">
        {/* Heading */}
        <h1 className="text-center text-4xl md:text-5xl font-extrabold tracking-tight mb-10 select-none
          bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent
          drop-shadow-[0_0_10px_rgba(129,50,255,0.7)]
          animate-gradient-x">
          Create Your AI Universe Builder Account
        </h1>

        {/* Form */}
        <form className="space-y-8" onSubmit={(e) => e.preventDefault()} noValidate>
          {/* Name fields */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col w-full">
              <label
                htmlFor="firstName"
                className="mb-2 text-sm font-semibold text-white/90 tracking-wide transition-colors duration-300 hover:text-cyan-400 cursor-pointer"
              >
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Vartul"
                required
                className="w-full rounded-lg bg-[#1f1f2e]/80 border border-white/20 px-4 py-3 text-white placeholder-white/40
                  focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent
                  transition duration-300 shadow-sm drop-shadow-md hover:ring-cyan-500 hover:brightness-110"
                autoComplete="given-name"
              />
            </div>
            <div className="flex flex-col w-full">
              <label
                htmlFor="lastName"
                className="mb-2 text-sm font-semibold text-white/90 tracking-wide transition-colors duration-300 hover:text-cyan-400 cursor-pointer"
              >
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Singh"
                required
                className="w-full rounded-lg bg-[#1f1f2e]/80 border border-white/20 px-4 py-3 text-white placeholder-white/40
                  focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent
                  transition duration-300 shadow-sm drop-shadow-md hover:ring-cyan-500 hover:brightness-110"
                autoComplete="family-name"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="mb-2 text-sm font-semibold text-white/90 tracking-wide transition-colors duration-300 hover:text-cyan-400 cursor-pointer"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="w-full rounded-lg bg-[#1f1f2e]/80 border border-white/20 px-4 py-3 text-white placeholder-white/40
                focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent
                transition duration-300 shadow-sm drop-shadow-md hover:ring-cyan-500 hover:brightness-110"
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="mb-2 text-sm font-semibold text-white/90 tracking-wide transition-colors duration-300 hover:text-cyan-400 cursor-pointer"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="w-full rounded-lg bg-[#1f1f2e]/80 border border-white/20 px-4 py-3 text-white placeholder-white/40
                focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent
                transition duration-300 shadow-sm drop-shadow-md hover:ring-cyan-500 hover:brightness-110"
              autoComplete="new-password"
            />
          </div>

          {/* Role Dropdown */}
          <div className="flex flex-col">
            <label
              htmlFor="role"
              className="mb-2 text-sm font-semibold text-white/90 tracking-wide transition-colors duration-300 hover:text-cyan-400 cursor-pointer"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              required
              defaultValue=""
              className="w-full rounded-lg bg-[#1f1f2e]/80 border border-white/20 px-4 py-3 text-white placeholder-white/40
                focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent
                transition duration-300 shadow-sm drop-shadow-md hover:ring-cyan-500 hover:brightness-110 cursor-pointer"
            >
              <option value="" disabled>
                Select Role
              </option>
              <option value="developer">Developer</option>
              <option value="designer">Designer</option>
              <option value="researcher">Researcher</option>
              <option value="founder">Founder</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl font-extrabold text-white text-lg
              bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400
              shadow-[0_0_20px_rgba(129,50,255,0.7)]
              hover:brightness-110 hover:scale-[1.02]
              transition transform duration-300"
          >
            🚀 Sign Up
          </button>
        </form>

        {/* Login link */}
        <p className="mt-8 text-center text-sm text-white/70 tracking-wide select-none">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-semibold text-cyan-400 hover:underline hover:text-cyan-500 transition-colors duration-200 cursor-pointer"
          >
            Login here
          </a>
        </p>
      </div>

      {/* Animated gradient background animation (optional) */}
      <style>{`
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 6s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default SignUpPage;
