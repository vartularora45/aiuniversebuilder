import React from 'react';

const SignUpPage = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] px-4 py-10">
      <div className="backdrop-blur-lg bg-white/5 border border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] rounded-3xl p-10 w-full max-w-2xl text-white relative">
        
        <h2 className="text-4xl font-extrabold text-center mb-6 tracking-tight bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-transparent bg-clip-text drop-shadow-lg">
          Create Your AI Universe Builder Account
        </h2>

        <form className="space-y-6">
          <div className="flex flex-col md:flex-row gap-5">
            <div className="w-full">
              <label className="text-sm font-medium mb-1 block">First Name</label>
              <input
                type="text"
                placeholder="Vartul"
                className="w-full bg-[#1f1f2e]/60 text-white border border-white/10 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
              />
            </div>
            <div className="w-full">
              <label className="text-sm font-medium mb-1 block">Last Name</label>
              <input
                type="text"
                placeholder="Singh"
                className="w-full bg-[#1f1f2e]/60 text-white border border-white/10 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full bg-[#1f1f2e]/60 text-white border border-white/10 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-[#1f1f2e]/60 text-white border border-white/10 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Role</label>
            <select
              className="w-full bg-[#1f1f2e]/60 text-white border border-white/10 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
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
            className="w-full py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:brightness-110 hover:scale-[1.01] transition-transform shadow-lg"
          >
            🚀 Sign Up
          </button>
        </form>

        <p className="text-sm text-gray-400 mt-6 text-center">
          Already have an account?{' '}
          <a href="/login" className="text-blue-400 hover:underline">Login here</a>
        </p>

        <div className="absolute inset-0 rounded-3xl pointer-events-none bg-gradient-to-br from-white/5 via-white/0 to-white/5" />
      </div>
    </div>
  );
};

export default SignUpPage;
