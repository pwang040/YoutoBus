import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  // Retrieve the token from the request
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log("getting token...");
  // If there's no token, redirect to the sign-in page
  if (!token) {
    console.log("no token found, returning to signin")
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  // Check if the token has expired
  const expiryDate = new Date(token.exp * 1000);
  if (expiryDate < new Date()) {
    console.log("token has expired, returning to signin");
    return NextResponse.redirect(new URL('/auth/signin', req.url)); // Redirect to login if expired
  }

  // Allow the request to continue if the session is valid
  console.log("session is valid");
  return NextResponse.next();
}

// Apply the middleware to specific routes
export const config = {
  matcher: ['/vdash/:path*', '/cdash/:path*', '/protected-route/:path*'], // Add routes as needed
};
