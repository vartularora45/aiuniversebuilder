import { motion } from "framer-motion";
import { LayoutDashboard, BrainCog, Share, Users } from "lucide-react";

const features = [
  {
    icon: <LayoutDashboard className="w-7 h-7" />,
    title: "Visual AI Builder",
    desc: "Drag & drop blocks to architect workflows — no code needed. Compose, test, tweak visually.",
    color: "from-indigo-500 via-fuchsia-500 to-purple-500",
  },
  {
    icon: <BrainCog className="w-7 h-7" />,
    title: "Plug Any AI",
    desc: "Use OpenAI, HuggingFace, Gemini, Claude, or local LLMs. Mix and match models seamlessly.",
    color: "from-cyan-400 via-blue-500 to-sky-500",
  },
  {
    icon: <Share className="w-7 h-7" />,
    title: "Export Anywhere",
    desc: "Deploy as REST API, embeddable widget, or chatbot interface. Integrate with anything you build.",
    color: "from-fuchsia-400 via-cyan-400 to-indigo-400",
  },
  {
    icon: <Users className="w-7 h-7" />,
    title: "Collab & Analytics",
    desc: "Real-time syncing, live collaboration, granular analytics, and true offline mode for teams.",
    color: "from-purple-500 to-fuchsia-500",
  },
];

const FeatureGrid = () => (
  <section id="features" className="pt-8 pb-20">
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
      {features.map((f, i) => (
        <motion.div
          key={i}
          whileHover={{ y: -8, scale: 1.025, boxShadow: "0 2px 24px #a21caf40" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="group relative flex flex-col items-center p-7 bg-[#181b28]/80 rounded-2xl border border-white/10 shadow-xl hover:border-fuchsia-600 transition duration-150"
        >
          <span
            className={`p-3 mb-4 rounded-xl bg-gradient-to-br ${f.color} text-white shadow-lg group-hover:scale-110 transition`}
          >
            {f.icon}
          </span>
          <h3 className="font-bold text-lg text-white mb-2 text-center drop-shadow-md">
            {f.title}
          </h3>
          <p className="text-white/70 text-sm text-center">
            {f.desc}
          </p>
        </motion.div>
      ))}
    </div>
  </section>
);

export default FeatureGrid;
