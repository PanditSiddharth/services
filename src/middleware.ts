// correct it according to this project but it's structure should be same
import NextAuth from 'next-auth';
import auth_config from './auth_config';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const { auth } = NextAuth(auth_config);

// Define public paths that don't need authentication
const publicPaths = [
  "/",
  "/about",
  "/contact",
  "/services",
  "/api/webhook",
];


// Define protected paths by role
const protectedPaths = {
  admin: "/admin",
  serviceProvider: "/service-provider",
  user: "/customer"
};

export default auth(async (request: any) => {
  const { pathname } = request.nextUrl
  const p = pathname?.toLowerCase();

  const user = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    cookieName: "user",
    raw: false
  });

  if (p.startsWith("/admin") && user) {
    // Redirect to respective dashboard based on role
    if (user?.role == "user")
      return NextResponse.redirect(new URL("/customer/dashboard", request.url));
    else if (user.role == "serviceProvider")
      return NextResponse.redirect(new URL("/service-provider", request.url));
  }

  if (p.startsWith("/user") && user) {
    if (user.role == "serviceProvider")
      return NextResponse.redirect(new URL("/service-provider", request.url));
  }

  if (p.startsWith("/service-provider") && user) {
    if (user.role == "user")
      return NextResponse.redirect(new URL("/customer/dashboard", request.url));
    else if (user.role == "admin")
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // Check if trying to access auth pages while logged in
  if (p?.startsWith("/auth") && user) {
    // Redirect to respective dashboard based on role
    if (user.role == "user")
      return NextResponse.redirect(new URL("/customer/dashboard", request.url));
    else if (user.role == "serviceProvider")
      return NextResponse.redirect(new URL("/service-provider", request.url));
    else if (user.role == "admin")
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  if ((p?.startsWith("/user") || p?.startsWith("/admin")) && !user) {
    // Redirect to login page if not authenticated
    return NextResponse.redirect(new URL("/auth/customer/login", request.url));
  }

  if (p?.startsWith("/service-provider") && !user) {
    // Redirect to login page if not authenticated
    return NextResponse.redirect(new URL("/auth/service-provider/login", request.url));
  }
});

// Configure middleware path matcher
export const config = {
  matcher: [
    // Match all paths except:
    // - Next.js internals
    // - API authentication routes
    // - Static files
    "/((?!api/auth|_next|fonts|images|[\\w-]+\\.\\w+).*)",
  ],
};
