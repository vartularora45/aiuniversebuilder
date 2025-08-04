import { motion } from "framer-motion";

const gradientText =
  "bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-indigo-500 bg-clip-text text-transparent";

const HeroSection = () => (
  <section className="pt-28 pb-16 flex flex-col items-center text-center relative">
    {/* Glowing Aura */}
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 0.6, scale: 1.1 }}
      transition={{ duration: 1.3, delay: 0.2 }}
      className="absolute left-1/2 -translate-x-1/2 top-8 w-[420px] h-[210px] bg-fuchsia-400/20 rounded-full blur-3xl -z-10"
    ></motion.div>
    <motion.h1
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 90 }}
      className={`text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 ${gradientText} leading-tight drop-shadow-xl`}
    >
      Build <span className=" animate-pulse">AI workflows</span> <br />
      with Zero Code
    </motion.h1>
    <motion.p
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="text-lg sm:text-xl text-white/80 max-w-2xl mb-8"
    >
      Drag, drop & deploy AI chains visually. Collaborate in real time and integrate OpenAI, HuggingFace, Gemini, Claude, or your own local models — all in a <span className="text-fuchsia-400 font-semibold">dev-first</span> SaaS.
    </motion.p>
    <motion.a
      href="#features"
      whileHover={{
        scale: 1.06,
        boxShadow: "0 0 32px 6px #a21cafcc",
      }}
      className="relative px-8 py-4 rounded-xl font-bold bg-gradient-to-tr from-indigo-600 via-fuchsia-500 to-cyan-400 shadow-xl text-lg hover:-translate-y-1 transition mb-3"
    >
      🚀 Try the Demo
    </motion.a>
  </section>
);
export default HeroSection;
