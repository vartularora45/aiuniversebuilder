import { Disclosure } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const faqs = [
  {
    q: "Can I export AI tools as APIs or embed them elsewhere?",
    a: "Yes! You can export any workflow as a secure API endpoint, widget, or chatbot. Integration is seamless.",
  },
  {
    q: "Does it support custom/local or self-hosted LLMs?",
    a: "Absolutely — bring your own LLM or use our integrations. All nodes can connect to your private models.",
  },
  {
    q: "Is there an offline mode?",
    a: "Yes. All builder and collaboration functions support real offline mode and sync changes when you reconnect.",
  },
  {
    q: "How do you handle privacy and security?",
    a: "We offer team SSO, encrypted data at rest, audit logs, and options for on-prem deployment for enterprise.",
  },
];

const FAQSection = () => (
  <section className="pb-32 pt-8 max-w-3xl mx-auto">
    <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">
      FAQ
    </h2>
    <div className="space-y-4">
      {faqs.map((faq, i) => (
        <Disclosure key={faq.q}>
          {({ open }) => (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.14 * i }}
              className="bg-[#181b28]/70 border border-white/10 rounded-xl overflow-hidden"
            >
              <Disclosure.Button className="w-full flex items-center justify-between px-6 py-5 font-semibold text-left text-white group">
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${open ? "rotate-180 text-fuchsia-400" : ""}`} />
              </Disclosure.Button>
              <Disclosure.Panel className="px-6 pb-5 pt-1 text-white/80 text-base">
                {faq.a}
              </Disclosure.Panel>
            </motion.div>
          )}
        </Disclosure>
      ))}
    </div>
  </section>
);

export default FAQSection;
