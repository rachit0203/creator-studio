import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/services(.*)",
  "/showcase(.*)",
  "/contact(.*)",
]);

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    auth.protect();
  }
});

export const config = {
  runtime: "nodejs",
  matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)"],
};
