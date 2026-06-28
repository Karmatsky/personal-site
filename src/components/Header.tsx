import { useEffect, useMemo, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface NavItem {
  name: string;
  href: string;
}

export default function Header() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);

  const navItems = useMemo<NavItem[]>(
    () => [
      { name: t("header.about"), href: "#about" },
      { name: t("header.projects"), href: "#projects" },
      { name: t("header.contact"), href: "#contact" },
    ],
    [t],
  );

  useEffect(() => {
    const sections = navItems
      .map((item) => document.querySelector<HTMLElement>(item.href))
      .filter((section): section is HTMLElement => section !== null);

    if (!sections.length || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target.id) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      {
        rootMargin: "-34% 0px -56% 0px",
        threshold: [0.01, 0.2, 0.45],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [navItems]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const menuButton = menuButtonRef.current;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    requestAnimationFrame(() => firstMobileLinkRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      menuButton?.focus();
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="nav-shell">
          <a
            href="#about"
            className="rounded-md text-base font-bold text-slate-950 sm:text-lg"
            onClick={closeMenu}
          >
            Savely Karmatsky
          </a>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.slice(1);

              return (
                <a
                  key={item.href}
                  href={item.href}
                  className="nav-link"
                  data-active={isActive}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.name}
                </a>
              );
            })}
          </nav>

          <button
            ref={menuButtonRef}
            type="button"
            className="icon-button md:hidden"
            onClick={() => setIsOpen((open) => !open)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
          </button>
        </div>
      </div>

      <nav
        id="mobile-menu"
        className="mobile-menu"
        data-open={isOpen}
        aria-hidden={!isOpen}
        aria-label="Mobile primary"
      >
        <div className="w-full max-w-sm space-y-3">
          {navItems.map((item, index) => {
            const isActive = activeSection === item.href.slice(1);

            return (
              <a
                key={item.href}
                ref={index === 0 ? firstMobileLinkRef : undefined}
                href={item.href}
                className="mobile-menu__link"
                data-active={isActive}
                aria-current={isActive ? "page" : undefined}
                tabIndex={isOpen ? 0 : -1}
                onClick={closeMenu}
              >
                {item.name}
              </a>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
