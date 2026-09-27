import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-card-border bg-background-secondary mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-accent">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor"/>
              </svg>
              <span className="font-bold text-lg tracking-tight">VOLTA</span>
            </div>
            <p className="text-foreground-secondary text-sm leading-relaxed max-w-xs">
              Tutorial, guide e progetti di elettronica fatti con passione.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Navigazione</h4>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/articoli", label: "Articoli" },
                { href: "/chi-sono", label: "Chi sono" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-foreground-secondary text-sm hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Categorie</h4>
            <ul className="space-y-2">
              {[
                { slug: "microcontrollori", name: "Microcontrollori" },
                { slug: "elettronica-di-base", name: "Elettronica di base" },
                { slug: "audio-e-video", name: "Audio e Video" },
                { slug: "hobby-e-progetti", name: "Hobby e Progetti" },
                { slug: "strumenti-di-misura", name: "Strumenti di misura" },
              ].map((c) => (
                <li key={c.slug}>
                  <Link href={`/categorie/${c.slug}`} className="text-foreground-secondary text-sm hover:text-accent transition-colors">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-card-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-foreground-secondary text-xs">&copy; 2026 VOLTA. Tutti i diritti riservati.</p>
          <Link href="/admin" className="text-foreground-secondary text-xs hover:text-accent transition-colors">
            Area admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
