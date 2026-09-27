import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const session = request.cookies.get("volta_session");
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/admin/login";
  const isLogoutApi = pathname === "/api/admin/logout";
  const isLoginApi = pathname === "/api/admin/login";

  if (pathname.startsWith("/admin") && !isLoginPage && !isLogoutApi && !isLoginApi) {
    if (!session) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};