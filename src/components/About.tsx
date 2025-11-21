import { useState } from "react";
import { motion } from "framer-motion";

export default function About() {
  const [imageError, setImageError] = useState(false);

  return (
    <section id="about" className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-center">
          <motion.div
            className="md:col-span-7"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <p className="text-xs uppercase tracking-widest text-slate-500 mb-3">
              About
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">
              Obsessed with performance and details
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              I am a frontend engineer dedicated to the craft of building clean
              web experiences. I believe that fast load times, semantic markup,
              and smooth animations are not just features, but essentials.
            </p>
            <p className="text-slate-700 leading-relaxed mb-6">
              My workflow is centered around modern best practices: strictly
              typed TypeScript, composable React patterns, and tooling like Vite
              to deliver production-ready code efficiently.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#projects"
                className="inline-flex items-center justify-center rounded-md bg-[#ffdd2d] text-black px-4 py-2 text-xs font-medium shadow-sm hover:bg-[#f2d22b] transition-colors"
              >
                View Projects
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-md border border-slate-300 text-[#126df7] px-4 py-2 text-xs font-medium hover:border-slate-400 transition-colors"
              >
                Contact Me
              </a>
            </div>
          </motion.div>

          <motion.div
            className="md:col-span-5"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* ИЗМЕНЕНИЯ ЗДЕСЬ: mx-auto для мобилок, md:ml-auto md:mr-0 для десктопа */}
            <div className="relative w-full max-w-sm mx-auto md:ml-auto md:mr-0">
              <div
                aria-hidden
                className="absolute -inset-6 bg-gradient-to-tr from-slate-200 via-slate-100 to-white rounded-3xl blur-2xl"
              />
              <figure className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 shadow-sm  flex items-center justify-center">
                {!imageError ? (
                  <img
                    src="/SK.jpg"
                    alt="Portrait of Savely Karmatsky"
                    className="h-full w-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <span className="text-5xl font-bold text-white/90 select-none">
                    Savely Karmatsky
                  </span>
                )}
              </figure>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
