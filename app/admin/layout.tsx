import Link from "next/link";
import { cookies } from "next/headers";
import { COOKIE_NAME, validateSessionToken } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: LayoutProps<"/admin">) {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);
  const authenticated = session && validateSessionToken(session.value);

  if (!authenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-[calc(100vh-56px)] bg-background-secondary">
      <div className="bg-card-bg border-b border-card-border px-4 sm:px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-accent">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor"/>
            </svg>
            <span className="font-bold tracking-tight">VOLTA</span>
            <span className="text-foreground-secondary text-sm font-normal ml-1">Admin</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/" className="text-foreground-secondary text-sm hover:text-accent transition-colors">
              Vedi sito
            </Link>
            <form action="/api/admin/logout" method="POST">
              <button type="submit" className="text-foreground-secondary text-sm hover:text-danger transition-colors">
                Esci
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">{children}</div>
    </div>
  );
}
