import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

const publicPages = ["/login"];

export default async function middleware(req: NextRequest) {
    const token = await getToken({ req });
    const isAuth = !!token;

    const { pathname } = req.nextUrl;

    // Skip APIs and statics
    if (
        pathname.startsWith("/api") ||
        pathname.startsWith("/_next") ||
        pathname.includes(".") // files
    ) {
        return NextResponse.next();
    }

    // Check if current path is a public page (handling locales)
    // e.g. /login, /fr/login, /

    // Normalize path to remove locale
    const segments = pathname.split('/');
    const hasLocale = routing.locales.includes(segments[1] as any);
    const pathWithoutLocale = hasLocale ? '/' + segments.slice(2).join('/') : pathname;

    // Simple normalization: if pathWithoutLocale is empty string, it's root
    const normalizedPath = pathWithoutLocale === '' ? '/' : pathWithoutLocale;

    const isPublicPage = publicPages.includes(normalizedPath);

    if (isPublicPage) {
        if (isAuth) {
            // Redirect to dashboard if already logged in
            return NextResponse.redirect(new URL('/', req.url));
        }
        // Allow access to public page (let intl handle it)
        return intlMiddleware(req);
    }

    if (!isAuth) {
        // Redirect to login
        // We need to construct the URL with locale if possible, or just default
        // If we are at /fr/dashboard, redirect to /fr/login
        // If no locale, default to /login (which will redirect to /en/login)

        // Simplest: redirect to /login and let intl middleware handle locale redirect if needed
        // But better to preserve locale:
        const locale = hasLocale ? segments[1] : routing.defaultLocale;
        return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
    }

    // Authenticated and private page
    return intlMiddleware(req);
}

export const config = {
    matcher: ["/((?!api|_next|.*\\..*).*)"]
};
