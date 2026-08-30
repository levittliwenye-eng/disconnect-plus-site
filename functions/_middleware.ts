import { requireAdmin } from "./_shared/access";
import type { PagesContext } from "./_shared/cloudflare";

function isAdminRoute(pathname: string) {
  return (
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/api/admin" ||
    pathname.startsWith("/api/admin/")
  );
}

export async function onRequest(context: PagesContext) {
  const pathname = new URL(context.request.url).pathname;

  if (isAdminRoute(pathname)) {
    const unauthorized = await requireAdmin(context.request, context.env);
    if (unauthorized) {
      return unauthorized;
    }
  }

  return context.next();
}
