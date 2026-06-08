import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const ADMIN_HOSTS = new Set([
  "admin.nexsportts.com.br",
  "admin.localhost:3000",
]);

async function requireAdmin(request: NextRequest, loginPath: string) {
  const { createServerClient } = await import("@supabase/ssr");
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: () => {},
      },
    }
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;
  const role = (user.app_metadata?.role ?? user.user_metadata?.role) as string | undefined;
  if (role !== "admin") return null;
  return user;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = (request.headers.get("host") ?? "").toLowerCase();

  // Host-based routing: admin.* subdomain serves the admin panel
  if (ADMIN_HOSTS.has(host)) {
    // Normalize the target admin path
    let targetPath = pathname;
    if (pathname === "/" || pathname === "") {
      targetPath = "/admin/dashboard";
    } else if (!pathname.startsWith("/admin") && !pathname.startsWith("/_next") && !pathname.startsWith("/api")) {
      targetPath = "/admin" + pathname;
    }

    // Auth guard for everything except the login page itself
    if (targetPath !== "/admin/login") {
      const user = await requireAdmin(request, "/admin/login");
      if (!user) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin/login";
        url.searchParams.set("next", targetPath);
        return NextResponse.redirect(url);
      }
    }

    if (targetPath !== pathname) {
      const url = request.nextUrl.clone();
      url.pathname = targetPath;
      return NextResponse.rewrite(url);
    }
    return NextResponse.next({ request });
  }

  // Main host: only protect /admin/* (rare — admin usually via subdomain)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const user = await requireAdmin(request, "/admin/login");
    if (!user) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next({ request });
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static, _next/image, favicon, public assets
     * - api routes (have their own auth)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif)$).*)",
  ],
};
