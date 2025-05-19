// correct it according to this project but it's structure should be same
import NextAuth from 'next-auth';
import auth_config from './auth_config';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const { auth } = NextAuth(auth_config);

export default auth(async (request: any) => {
  const { pathname } = request.nextUrl;
  const user = await getToken({ 
    req: request, 
    secret: process.env.AUTH_SECRET, 
    cookieName: "user",
    raw: false 
  });

  // Default auth routing
  if (pathname === "/auth" && !user) {
    // Redirect to customer login by default
    return NextResponse.redirect(new URL("/auth/user/login", request.url));
  }

  const isLogged = !!user;
  const authRoute = '/auth';
  console.log({user: user?.role});
  
  // Protect admin routes - only providers can access
  // if (pathname.startsWith("/admin")) {
  //   if (!user) {
  //     return NextResponse.redirect(new URL("/auth/provider/login", request.url))
  //   }

  //   if (user.role !== "provider") {
  //     return NextResponse.redirect(new URL("/auth/provider/login", request.url))
  //   }
  // }

  // // Protect user-specific routes
  // if (pathname.startsWith("/user")) {
  //   if (!user) {
  //     return NextResponse.redirect(new URL("/auth/user/login", request.url))
  //   }

  //   if (user?.role !== "user") {
  //     return NextResponse.redirect(new URL("/auth/user/login", request.url))
  //   }
  // }

  // // Redirect authenticated users away from auth pages
  // if (pathname.startsWith("/auth") && user) {
  //   if (user.role === "provider") {
  //     return NextResponse.redirect(new URL("/admin/dashboard", request.url))
  //   } else {
  //     return NextResponse.redirect(new URL("/", request.url))
  //   }
  // }

  return NextResponse.next();
});
