import { motion } from "framer-motion";

const DemoVideo = () => (
  <section className="py-16">
    <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">
      See it in Action
    </h2>
    <div className="flex justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="rounded-2xl overflow-hidden border-4 border-fuchsia-500/30 shadow-2xl w-full max-w-3xl aspect-video"
      >
        {/* Replace with your own demo video */}
        <iframe
          className="w-full h-full"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="BotSmith Builder Demo"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </motion.div>
    </div>
  </section>
);

export default DemoVideo;
