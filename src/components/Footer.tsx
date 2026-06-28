export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200/80 py-8">
      <div className="site-container">
        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-slate-600">© {year} Savely Karmatsky</p>

          <nav className="flex items-center gap-4" aria-label="Footer">
            <a
              href="https://github.com/Karmatsky"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
            >
              GitHub
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
