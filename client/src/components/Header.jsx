import { Link } from "react-router-dom";
import { Newspaper, Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider"; 

const Header = () => {
  const { theme, toggleTheme } = useTheme(); 

  const navItems = [
    { name: "ALL", path: "/" },
    { name: "Top 10", path: "/top10" },
    { name: "Global", path: "/world" },
  ];

  return (
    <header
      className="sticky top-0 z-50 bg-[var(--color-background)] border-b border-[var(--color-border)]"
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Newspaper className="h-6 w-6 text-[var(--color-text-primary)]" />
          <span className="text-xl font-semibold text-[var(--color-text-primary)]">
            <span className="text-[var(--color-text-primary)]">One </span>
            <span className="text-[var(--color-text-primary)]">Point </span>
            <span className="text-[var(--color-accent)]">News</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors duration-200 font-medium"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => { console.log('Theme toggle clicked'); toggleTheme(); }}
          className="text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-all p-2 rounded-full hover:bg-[var(--color-surface)] border border-[var(--color-border)]"
        >
          {theme === "light" ? <Moon className="h-5 w-5 text-[var(--color-text-primary)]" /> : <Sun className="h-5 w-5 text-[var(--color-text-primary)]" />}
        </button>
      </div>
    </header>
  );
};

export default Header;
