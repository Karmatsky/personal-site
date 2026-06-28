import { useState, type CSSProperties } from "react";
import { ArrowRight, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function About() {
  const [imageError, setImageError] = useState(false);
  const { t } = useTranslation();

  return (
    <section id="about" className="section section--hero">
      <div className="site-container">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-12 lg:gap-16">
          <div className="md:col-span-7" data-reveal>
            <p className="section-eyebrow">{t("about.title")}</p>
            <h1 className="section-title mb-5">{t("about.subtitle")}</h1>
            <div className="max-w-2xl space-y-4">
              <p className="body-copy">{t("about.description.paragraph-1")}</p>
              <p className="body-copy">{t("about.description.paragraph-2")}</p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#projects" className="btn btn-primary">
                {t("about.button.view-projects")}
                <ArrowRight aria-hidden className="size-4" />
              </a>
              <a href="#contact" className="btn btn-secondary">
                <Mail aria-hidden className="size-4" />
                {t("about.button.contact-me")}
              </a>
            </div>
          </div>

          <div
            className="md:col-span-5"
            data-reveal
            style={{ "--reveal-delay": "90ms" } as CSSProperties}
          >
            <div className="portrait-shell">
              <figure className="portrait-frame">
                {!imageError ? (
                  <img
                    src="/SK.webp"
                    width="640"
                    height="640"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    alt="Portrait of Savely Karmatsky"
                    className="h-full w-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <span className="select-none text-6xl font-bold text-white/90">
                    SK
                  </span>
                )}
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
