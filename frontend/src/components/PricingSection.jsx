import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const plans = {
  monthly: [
    {
      name: "Free",
      price: "0",
      desc: "For learning, personal AI workflows & testing.",
      features: [
        "2 active workflows",
        "Community support",
        "Basic AI connectors",
      ],
    },
    {
      name: "Pro",
      price: "24",
      desc: "Unlimited builder features. Ship live AI apps.",
      features: [
        "Unlimited workflows",
        "Premium connectors",
        "Real-time Collaboration",
        "API Export/Embedding",
      ],
      highlight: true,
    },
    {
      name: "Enterprise",
      price: "Contact",
      desc: "Advanced security, SSO, and priority support.",
      features: [
        "All Pro features",
        "SSO/SAML & Audit log",
        "Custom On-prem LLMs",
        "Dedicated support",
      ],
    },
  ],
  yearly: [
    
    {
      name: "Free",
      price: "0",
      desc: "For learning, personal AI workflows & testing.",
      features: [
        "2 active workflows",
        "Community support",
        "Basic AI connectors",
      ],
    },
    {
      name: "Pro",
      price: "240",
      desc: "Unlimited builder features. Ship live AI apps. <span class='text-green-400'>2 months free</span>",
      features: [
        "Unlimited workflows",
        "Premium connectors",
        "Real-time Collaboration",
        "API Export/Embedding",
        "2 months free",
      ],
      highlight: true,
    },
    {
      name: "Enterprise",
      price: "Contact",
      desc: "Advanced security, SSO, and priority support.",
      features: [
        "All Pro features",
        "SSO/SAML & Audit log",
        "Custom On-prem LLMs",
        "Dedicated support",
      ],
    },
  ]
};

const PricingSection = () => {
  const [cycle, setCycle] = useState("monthly");
  const activePlans = plans[cycle];

  return (
    <section id="pricing" className="py-16 px-2">
      <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
        Simple, transparent pricing
      </h2>
      <div className="flex justify-center mb-10">
        <div className="bg-[#181b28] rounded-xl p-1 flex items-center border border-white/10 w-[210px]">
          <button
            onClick={() => setCycle("monthly")}
            className={`w-1/2 py-2 rounded-xl text-sm font-semibold transition ${cycle === "monthly"
                ? "bg-gradient-to-tr from-fuchsia-500 to-indigo-500 text-white"
                : "text-white/60"
              }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setCycle("yearly")}
            className={`w-1/2 py-2 rounded-xl text-sm font-semibold transition ${cycle === "yearly"
                ? "bg-gradient-to-tr from-fuchsia-500 to-indigo-500 text-white"
                : "text-white/60"
              }`}
          >
            Yearly
          </button>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-2">
        <AnimatePresence initial={false}>
          {activePlans.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ delay: i * 0.07 }}
              className={`flex flex-col bg-[#181b28]/80 border border-white/10 rounded-2xl p-8 pt-10 shadow-lg relative overflow-hidden
              ${p.highlight ? "border-fuchsia-500 shadow-fuchsia-600/20 scale-105 z-10" : ""}`}
            >
              {p.highlight && (
                <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-fuchsia-400 to-indigo-400 text-xs px-4 py-1 rounded-xl font-bold uppercase tracking-wider text-white shadow">
                  Most Popular
                </div>
              )}
              <div className="mb-3">
                <span className="text-lg font-bold">{p.name}</span>
              </div>
              <div className="mb-3">
                <span className="text-4xl font-bold">
                  {p.price === "Contact" ? (
                    <span className="text-xl">Contact us</span>
                  ) : (
                    <>
                      ${p.price}
                      <span className="text-base font-medium text-white/40 align-middle">/{cycle === "monthly" ? "mo" : "yr"}</span>
                    </>
                  )}
                </span>
              </div>
              <div
                className="text-sm text-white/70 mb-5"
                dangerouslySetInnerHTML={{ __html: p.desc }}
              />
              <ul className="mb-7 space-y-2">
                {p.features.map((ftr, j) => (
                  <li key={j} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-gradient-to-tr from-fuchsia-400 to-cyan-400 inline-block" />
                    {ftr}
                  </li>
                ))}
              </ul>
              <button className={`mt-auto py-3 rounded-lg font-semibold transition text-white shadow
                ${p.highlight
                    ? "bg-gradient-to-r from-fuchsia-500 to-indigo-500 hover:from-fuchsia-600 hover:to-indigo-600"
                    : "bg-white/5 hover:bg-white/10"
                  }
              `}>
                {p.price === "Contact" ? "Contact Sales" : "Get Started"}
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};
export default PricingSection;
