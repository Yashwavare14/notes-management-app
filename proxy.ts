import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

//export default clerkMiddleware()

const isPublicRoute = createRouteMatcher([
  '/',                  // landing page
  '/login(.*)',
  '/signup(.*)',
  '/api/webhook(.*)',   // webhooks must stay public
])

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    const { userId, redirectToSignIn } = await auth()

    if (!userId) return redirectToSignIn() // ✅ works across all versions
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}