import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { ExternalLink, X } from "lucide-react";
import { useTranslation } from "react-i18next";

type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image?: string;
  link?: string;
};

const focusableSelector =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export default function Projects() {
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const projects = useMemo<Project[]>(
    () => [
      {
        id: "p1",
        title: t("projects.items.project-1.title"),
        description: t("projects.items.project-1.description"),
        tags: ["HTML", "TailwindCSS", "JavaScript"],
        image: "/urfubestru.webp",
        link: "https://urfubest.ru",
      },
      {
        id: "p2",
        title: t("projects.items.project-2.title"),
        description: t("projects.items.project-2.description"),
        tags: ["Next.js", "TypeScript", "Convex", "Clerk"],
        image: "/whiteboard.webp",
        link: "https://eka-urfu-board.vercel.app/",
      },
    ],
    [t],
  );

  const active = useMemo(
    () => projects.find((project) => project.id === activeId) || null,
    [activeId, projects],
  );

  useEffect(() => {
    if (!active) return;

    const previousOverflow = document.body.style.overflow;
    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const triggerButton = triggerRefs.current[active.id];

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveId(null);
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      ).filter((element) => element.offsetParent !== null);

      if (!focusableElements.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      (triggerButton || previouslyFocused)?.focus();
    };
  }, [active]);

  const closeDialog = () => setActiveId(null);

  return (
    <section id="projects" className="section">
      <div className="site-container">
        <div className="mb-10 sm:mb-12" data-reveal>
          <p className="section-eyebrow">{t("projects.section-label")}</p>
          <h2 className="section-title section-title--compact">
            {t("projects.title")}
          </h2>
        </div>

        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-6">
          {projects.map((project, index) => (
            <li
              key={project.id}
              data-reveal
              style={{ "--reveal-delay": `${index * 70}ms` } as CSSProperties}
            >
              <button
                ref={(element) => {
                  triggerRefs.current[project.id] = element;
                }}
                type="button"
                className="project-card"
                onClick={() => setActiveId(project.id)}
                aria-haspopup="dialog"
                aria-controls={`project-${project.id}-dialog`}
                aria-label={`${project.title}. ${project.description}`}
              >
                <div className="project-card__media aspect-video overflow-hidden bg-slate-100">
                  {project.image ? (
                    <img
                      src={project.image}
                      width="3840"
                      height="2160"
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.hidden = true;
                      }}
                    />
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <h3 className="text-lg font-semibold leading-snug text-slate-950">
                    {project.title}
                  </h3>
                  <p className="project-card__description mt-3">
                    {project.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {active ? (
        <>
          <button
            type="button"
            aria-label="Close project details"
            className="modal-backdrop"
            onClick={closeDialog}
          />
          <div className="modal-layer" onClick={closeDialog}>
            <div
              ref={dialogRef}
              id={`project-${active.id}-dialog`}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`project-${active.id}-title`}
              className="modal-panel"
              onClick={(event) => event.stopPropagation()}
            >
              {active.image ? (
                <div className="aspect-video bg-slate-100">
                  <img
                    src={active.image}
                    width="3840"
                    height="2160"
                    alt=""
                    loading="eager"
                    decoding="async"
                    className="h-full w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.hidden = true;
                    }}
                  />
                </div>
              ) : null}
              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3
                      id={`project-${active.id}-title`}
                      className="text-xl font-semibold leading-tight text-slate-950"
                    >
                      {active.title}
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {active.tags.map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={closeDialog}
                    className="icon-button shrink-0"
                    aria-label="Close"
                  >
                    <X aria-hidden className="size-5" />
                  </button>
                </div>
                <p className="mt-5 text-base leading-7 text-slate-700">
                  {active.description}
                </p>
                {active.link ? (
                  <div className="mt-6">
                    <a
                      href={active.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      {t("projects.visit-button")}
                      <ExternalLink aria-hidden className="size-4" />
                    </a>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}
