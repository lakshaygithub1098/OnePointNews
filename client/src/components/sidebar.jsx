import React from "react";
import { Link} from "react-router-dom";

import {
  
  TrendingUp,
  Film,
  Trophy,
  Shrub,
  Landmark,
  DollarSign,
  Search,
 
} from "lucide-react";

const Sidebar = () => {
  const categories = [
   
    { icon: <TrendingUp className="h-5 w-5" />, label: "Trending News",path: "Trending News" },
    { icon: <Film className="h-5 w-5" />, label: "film",path: "film" },
    { icon: <Shrub className="h-5 w-5" />, label: "life and style",path: "lifeandstyle" },
   
    { icon: <Trophy className="h-5 w-5" />, label: "Sport" ,path: "Sport"},
    { icon: <Landmark className="h-5 w-5" />, label: "Politics",path: "Politics" },
    { icon: <DollarSign className="h-5 w-5" />, label: "Finance",path: "Finance" },
  ];

  return (
    <aside
      className="hidden md:block w-64 h-[calc(100vh-4rem)] sticky top-16 bg-[var(--color-background)] text-[var(--color-text-primary)] border-r border-[var(--color-border)] p-4 flex-col justify-between transition-colors duration-300 shadow-sm"
>
      <div>
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-[var(--color-text-secondary)]" />
          <input
            type="text"
            placeholder="Search news..."
            className="w-full bg-[var(--color-surface)] text-[var(--color-text-primary)] rounded-md py-2 pl-10 pr-3 text-sm placeholder:text-[var(--color-text-secondary)] border border-[var(--color-border)] focus:outline-none"
          />
        </div>

        {/* Categories */}
        <p className="text-sm font-semibold text-[var(--color-text-secondary)] px-2 mb-3">CATEGORIES</p>
        <ul className="space-y-1">
          {categories.map(({ icon, label, path }) => (
            <Link key={label} to={`/${encodeURIComponent(path)}`}>
              <li key={label}>
                <button className={`w-full flex items-center gap-3 text-sm px-4 py-2 rounded-md hover:bg-[var(--color-surface)] transition text-[var(--color-text-primary)]`}>
                  {/* Clone icon and apply color classes */}
                  {icon && React.cloneElement(icon, { className: 'h-5 w-5 text-[var(--color-text-primary)]' })}
                  <span className="text-[var(--color-text-primary)]">{label}</span>
                </button>
              </li>
            </Link>
          ))}
        </ul>
      </div>

    </aside>
  );
};

export default Sidebar;
