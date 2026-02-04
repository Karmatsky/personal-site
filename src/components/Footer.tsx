import React from "react";
const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="py-10">
      <div className="mx-auto max-w-6xl">
        <div className="bg-white  px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-600">
            © {year} Savely Karmatsky{" "}
          </div>

          <nav className="flex items-center space-x-4">
            <a
              href="https://github.com/Karmatsky"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://t.me/SKarmatsky"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              Telegram
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
