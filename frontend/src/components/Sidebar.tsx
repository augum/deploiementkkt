import { Link, useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";

export interface SidebarItem {
  to: string;
  label: string;
  icon?: ReactNode;
}

export function Sidebar({ brand, items }: { brand: string; items: SidebarItem[] }) {
  const location = useLocation();
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">{brand}</div>
      <nav className="sidebar__nav">
        {items.map((it) => {
          const active = location.pathname === it.to || location.pathname.startsWith(it.to + "/");
          return (
            <Link
              key={it.to}
              to={it.to}
              className={`sidebar__link${active ? " sidebar__link--active" : ""}`}
            >
              {it.icon}
              <span>{it.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="sidebar__footer">© Sclinik</div>
    </aside>
  );
}