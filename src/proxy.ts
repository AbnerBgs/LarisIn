import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  // Halaman dashboard dan semua API dilindungi login Clerk,
  // kecuali /api/umkm yang merupakan direktori UMKM publik.
  const isProtectedPage = pathname.startsWith('/dashboard');
  const isProtectedApi =
    pathname.startsWith('/api') && !pathname.startsWith('/api/umkm');

  if (isProtectedPage || isProtectedApi) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/__clerk/(.*)',
  ],
};

// The "middleware" file convention is deprecated. Please use "proxy" instead.
