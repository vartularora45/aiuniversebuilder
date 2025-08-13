import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "BotSmith AI lets my team ship new AI prototypes 10x faster. The collab tools rock.",
    name: "Alex R.",
    title: "Lead ML Engineer, LambdaForge"
  },
  {
    quote: "A dev playground for LLMs and workflows. Integrations were effortless.",
    name: "Priya V.",
    title: "AI Product Lead, HyperType"
  },
  {
    quote: "No other platform gives me power-user APIs and visual chaining in the same box.",
    name: "Chris L.",
    title: "Indie Hacker"
  },
];

const Testimonials = () => {
  const [idx, setIdx] = useState(0);

  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">What Devs Say</h2>
      <div className="flex flex-col items-center">
        <div className="relative max-w-xl px-8 py-8 bg-[#181b28]/80 rounded-2xl border border-white/10 shadow-lg">
          <AnimatePresence initial={false}>
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="text-xl text-white/90 text-center font-medium"
            >
              <Quote className="mx-auto mb-4 text-fuchsia-400" />
              “{testimonials[idx].quote}”
              <div className="mt-4 text-sm text-fuchsia-400">{testimonials[idx].name}, <span className="text-white/50">{testimonials[idx].title}</span></div>
            </motion.div>
          </AnimatePresence>
          <div className="flex gap-4 mt-8 justify-center">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`h-2.5 w-7 rounded-full transition 
                  ${i === idx ? "bg-gradient-to-r from-fuchsia-400 to-indigo-400" : "bg-white/15"}`}
                aria-label={`Show testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
