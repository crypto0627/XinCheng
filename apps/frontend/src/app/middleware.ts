import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // Add performance headers
  response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  
  // Add correct content type based on path
  if (request.nextUrl.pathname.match(/\.(js|mjs)$/)) {
    response.headers.set('Content-Type', 'text/javascript');
  } else if (request.nextUrl.pathname.match(/\.css$/)) {
    response.headers.set('Content-Type', 'text/css');
  } else if (request.nextUrl.pathname.match(/\.(jpg|jpeg|png|webp|avif|gif)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  return response;
}

// Apply middleware to all routes
export const config = {
  matcher: [
    // Apply to all routes except API, images, and other static assets
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 