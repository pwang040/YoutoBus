import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  // Retrieve the token from the request
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log("Getting token...");

  // If there's no token, redirect to the sign-in page
  if (!token) {
    console.log("No token found, redirecting to signin");
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  // Check if the token has expired
  const expiryDate = new Date(token.exp * 1000);
  if (expiryDate < new Date()) {
    console.log("Token has expired, redirecting to signin");
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  // Check if the user is verified
  if (token.verified !== "true") {
    console.log("User not verified, redirecting to verification page");
    return NextResponse.redirect(new URL('/auth/verify', req.url));
  }

  // Restrict access based on user role
  const pathname = req.nextUrl.pathname;
  if (token.role === 'consumer' && pathname.startsWith('/vdash')) {
    console.log("Consumer trying to access vendor dashboard, redirecting to consumer dashboard");
    return NextResponse.redirect(new URL('/cdash/profile', req.url));
  }
  if (token.role === 'vendor' && pathname.startsWith('/cdash')) {
    console.log("Vendor trying to access consumer dashboard, redirecting to vendor dashboard");
    return NextResponse.redirect(new URL('/vdash/profile', req.url));
  }

  // Allow the request to continue if the session is valid and user has the correct role
  console.log("Session is valid and user has correct role access");
  return NextResponse.next();
}

// Apply the middleware to specific routes
export const config = {
  matcher: ['/vdash/:path*', '/cdash/:path*'], // Add other protected routes if needed
};
