"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  };

  const links = [
    { href: "/", label: "Home" },
    { href: "/articoli", label: "Articoli" },
    { href: "/chi-sono", label: "Chi sono" },
  ];

  return (
    <nav className="nav-glass fixed top-0 left-0 right-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-accent group-hover:opacity-80 transition-opacity">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor"/>
          </svg>
          <span className="font-bold text-lg tracking-tight">VOLTA</span>
        </Link>

        <div className="flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-foreground text-background"
                  : "text-foreground-secondary hover:text-foreground hover:bg-background-secondary"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <button
            onClick={toggleTheme}
            className="ml-2 p-2 rounded-full hover:bg-background-secondary transition-colors"
            aria-label="Toggle dark mode"
          >
            {dark ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          <Link
            href="/admin"
            className="ml-1 px-3 py-1.5 rounded-full text-sm font-medium bg-accent text-white hover:bg-accent-hover transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
