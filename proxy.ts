import createMiddleware from 'next-intl/middleware';
import { routing } from './frontend/i18n/routing';
import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

const authMiddleware = withAuth(
  function middleware(req) {
    // If we reach here, the user is authorized
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Admin path check
    const isSpecialAdminPath = pathname.includes("/admin");
    if (isSpecialAdminPath && token?.role !== "ADMIN") {
      // Find the locale to redirect correctly
      const localeMatch = pathname.match(/^\/(sq|en|de)/);
      const locale = localeMatch ? localeMatch[1] : 'sq';
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, req.url));
    }

    return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export default function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  
  // Define protected routes
  const isProtectedRoute = 
    pathname.includes("/dashboard") || 
    pathname.includes("/admin") ||
    pathname.includes("/profile") ||
    pathname.includes("/marketplace/add");

  if (isProtectedRoute) {
    return (authMiddleware as any)(req);
  }

  return intlMiddleware(req);
}

export const config = {
    matcher: [
        // Enable a redirect to a matching locale at the root
        '/',

        // Set a cookie to remember the previous locale for
        // all requests that have a locale prefix
        '/(sq|en|de)/:path*',

        // Enable redirects that add missing locales
        '/((?!api|_next|_vercel|.*\\..*).*)'
    ]
};
