import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function About() {
  const [imageError, setImageError] = useState(false);

  const { t } = useTranslation();
  return (
    <section
      id="about"
      className="min-h-screen flex items-center pt-28 pb-16 md:py-24 scroll-mt-28"
    >
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
              {t("about.title")}
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">
              {t("about.subtitle")}
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              {t("about.description.paragraph-1")}
            </p>
            <p className="text-slate-700 leading-relaxed mb-6">
              {t("about.description.paragraph-2")}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#projects"
                className="min-w-30 min-h-10 inline-flex items-center justify-center rounded-md bg-[#ffdd2d] text-black px-6 py-3 text-xs font-normal shadow-sm hover:bg-[#f2d22b] transition-colors"
              >
                {t("about.button.view-projects")}
              </a>
              <a
                href="#contact"
                className="min-w-30 min-h-10 inline-flex items-center justify-center rounded-md border border-slate-300 text-[#126df7] px-6 py-3 text-xs font-normal hover:border-slate-400 transition-colors"
              >
                {t("about.button.contact-me")}
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
            <div className="relative w-full max-w-sm mx-auto md:ml-auto md:mr-0">
              <div
                aria-hidden
                className="absolute -inset-6 bg-linear-to-tr from-slate-200 via-slate-100 to-white rounded-3xl blur-2xl"
              />
              <figure className="relative aspect-square rounded-3xl overflow-hidden bg-linear-to-br from-slate-800 via-slate-700 to-slate-900 shadow-sm  flex items-center justify-center">
                {!imageError ? (
                  <img
                    src="/SK.webp"
                    loading="eager"
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
