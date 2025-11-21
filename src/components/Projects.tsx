import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image?: string;
  link?: string;
};

export default function Projects() {
  const projects = useMemo<Project[]>(
    () => [
      {
        id: "p1",
        title: "Site for BEST Eka UrFU",
        description:
          "Reusable components with Framer Motion and Tailwind for delightful interactions.",
        tags: ["React", "Framer Motion", "Tailwind"],
        image: "/images/projects/motion-kit.jpg",
      },
      {
        id: "p2",
        title: "Online whiteboard for BEST Eka UrFU",
        description:
          "MDX-driven blog platform with fast DX, strong typing, and clean theming.",
        tags: ["TypeScript", "MDX", "Vite"],
        image: "/images/projects/content-platform.jpg",
      },
      {
        id: "p3",
        title: "Site for Anastasia Karmatskaya",
        description:
          "Accessible component library with tokens, theming, and usage docs.",
        tags: ["Accessibility", "Design Tokens", "Docs"],
        image: "/images/projects/design-system.jpg",
      },
    ],
    []
  );

  const [activeId, setActiveId] = useState<string | null>(null);
  const active = useMemo(
    () => projects.find((p) => p.id === activeId) || null,
    [activeId, projects]
  );

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveId(null);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  return (
    <section id="projects" className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <p className="text-xs uppercase tracking-widest text-slate-500 mb-3">
            Projects
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-900">
            Selected work
          </h2>
        </motion.div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, index) => (
            <motion.li
              key={p.id}
              className="group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              viewport={{ once: true }}
            >
              <button
                className="w-full text-left bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow focus:outline-none"
                onClick={() => setActiveId(p.id)}
                aria-haspopup="dialog"
                aria-controls={`project-${p.id}-dialog`}
              >
                <div className="aspect-video bg-slate-100 overflow-hidden">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform"
                      onError={(e) => {
                        const t = e.currentTarget as HTMLImageElement;
                        t.style.display = "none";
                      }}
                    />
                  ) : null}
                </div>
                <div className="p-4">
                  <h3 className="text-base font-semibold text-slate-900 mb-1">
                    {p.title}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {p.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] font-medium text-[#2b2e32] bg-[#d9e5f8] px-2.5 py-1 rounded-full"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            </motion.li>
          ))}
        </ul>

        <AnimatePresence>
          {active && (
            <>
              {/* Backdrop */}
              <motion.button
                aria-label="Close project details"
                className="fixed inset-0 z-50 bg-black/40 md:bg-black/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                // Клик по затемнению (на всякий случай оставим, хотя он перекрыт)
                onClick={() => setActiveId(null)}
              />

              {/* Wrapper: Убрал p-4, чтобы на мобилке было во всю ширину */}
              <motion.div
                id={`project-${active.id}-dialog`}
                role="dialog"
                aria-modal="true"
                aria-labelledby={`project-${active.id}-title`}
                // Вернул классы как были в оригинале (без padding) + добавил onClick
                className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: "tween", duration: 0.22 }}
                onClick={() => setActiveId(null)} // 1. Закрываем при клике на пустое место
              >
                {/* Card: Добавил stopPropagation */}
                <div
                  // Классы оригинала: w-full (на мобилке от края до края), rounded-t-3xl (скругление только сверху)
                  className="w-full md:max-w-2xl md:mx-auto bg-white rounded-t-3xl md:rounded-2xl shadow-lg overflow-hidden border border-slate-200"
                  onClick={(e) => e.stopPropagation()} // 2. Блокируем закрытие при клике на саму карточку
                >
                  {active.image ? (
                    <div className="aspect-video bg-slate-100">
                      <img
                        src={active.image}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const t = e.currentTarget as HTMLImageElement;
                          t.style.display = "none";
                        }}
                      />
                    </div>
                  ) : null}
                  <div className="p-5 md:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3
                          id={`project-${active.id}-title`}
                          className="text-xl font-semibold text-slate-900"
                        >
                          {active.title}
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {active.tags.map((t) => (
                            <span
                              key={t}
                              className="text-[11px] font-medium text-[#2b2e32] bg-[#d9e5f8] px-2.5 py-1 rounded-full"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveId(null)}
                        className="shrink-0 rounded-md p-2 hover:bg-slate-100 focus:outline-none"
                        aria-label="Close"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5 5l10 10M15 5L5 15"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    </div>
                    <p className="mt-4 text-slate-700 leading-relaxed">
                      {active.description}
                    </p>
                    {active.link ? (
                      <div className="mt-6">
                        <a
                          href={active.link}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex items-center justify-center rounded-md bg-slate-900 text-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-slate-800 transition-colors"
                        >
                          Visit project
                        </a>
                      </div>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
