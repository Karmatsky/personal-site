import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";

// 1. Типизация данных
interface NavItem {
  name: string;
  href: string;
}

const navItems: NavItem[] = [
  { name: "About", href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("");

  // 2. Логика Scroll Spy (отслеживание активной секции)
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]");
      let current = "";

      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionHeight = (section as HTMLElement).clientHeight;
        // Если прокрутка дошла до 1/3 секции, считаем её активной
        if (window.scrollY >= sectionTop - sectionHeight / 3) {
          current = section.getAttribute("id") || "";
        }
      });

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Блокировка скролла для мобильного меню
  // useEffect(() => {
  //   if (isOpen) {
  //     document.body.style.overflow = "hidden";
  //   } else {
  //     document.body.style.overflow = "unset";
  //   }
  //   return () => {
  //     document.body.style.overflow = "unset";
  //   };
  // }, [isOpen]);

  // Анимации
  const menuVariants: Variants = {
    closed: {
      opacity: 0,
      y: "-100%",
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const listVariants: Variants = {
    closed: { opacity: 0, y: -20 },
    open: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.05 + i * 0.1,
        duration: 0.4,
        ease: "easeOut",
      },
    }),
  };

  return (
    <header className="fixed top-4 left-0 right-0 z-50 max-w-[1152px] mx-auto w-full px-4">
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-md rounded-2xl relative z-50">
        <div className="px-6 py-3 flex justify-between items-center">
          {/* Логотип */}
          <motion.a
            href="#"
            className="text-xl font-bold text-gray-900 tracking-tight relative z-10"
            whileHover={{ opacity: 0.7 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveSection("")} // Сброс при клике на лого
          >
            Savely Karmatsky
          </motion.a>

          {/* Десктопное меню с "Магической линией" */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.substring(1);

              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                    isActive
                      ? "text-gray-900"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}

                  {/* Плавающая подложка или линия (Magic Layout) */}
                  {isActive && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute inset-0 bg-gray-100 rounded-lg -z-10"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Мобильная кнопка */}
          <motion.button
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 space-y-1.5 z-50"
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle menu"
          >
            <motion.span
              className="w-5 h-0.5 bg-gray-800 block rounded-full origin-center"
              animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 8 : 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="w-5 h-0.5 bg-gray-800 block rounded-full"
              animate={{ opacity: isOpen ? 0 : 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="w-5 h-0.5 bg-gray-800 block rounded-full origin-center"
              animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -8 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </div>
      </div>

      {/* Мобильное меню */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            className="fixed inset-0 bg-white/95 backdrop-blur-lg z-40 flex flex-col justify-center items-center"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <div className="space-y-6 text-center">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.name}
                  custom={i}
                  variants={listVariants}
                  href={item.href}
                  className={`block text-4xl font-semibold tracking-tighter transition-colors ${
                    activeSection === item.href.substring(1)
                      ? "text-[#126df7]"
                      : "text-gray-900"
                  }`}
                  onClick={() => setIsOpen(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.name}
                </motion.a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
