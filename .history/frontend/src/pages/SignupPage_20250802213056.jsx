import React from "react";

const SignUpPage = () => {
  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8 w-full max-w-md text-white animate-fade-in">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-6">
          Create Your AI Universe
        </h2>

        <form className="space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="First Name"
              className="w-1/2 bg-transparent border border-white/20 rounded-lg px-4 py-2 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              placeholder="Last Name"
              className="w-1/2 bg-transparent border border-white/20 rounded-lg px-4 py-2 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <input
            type="email"
            placeholder="Email"
            className="w-full bg-transparent border border-white/20 rounded-lg px-4 py-2 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full bg-transparent border border-white/20 rounded-lg px-4 py-2 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <select className="w-full bg-transparent border border-white/20 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500">
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

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 py-2 rounded-lg font-semibold hover:opacity-90 transition-all"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-400">
          Already have an account?{" "}
         <Link
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
