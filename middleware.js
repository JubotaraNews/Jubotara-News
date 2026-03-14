import { withAuth } from "next-auth/middleware";

// This replaces the "export { default } ..." line
export default withAuth(
  function middleware(req) {
    // You can add custom logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/addnews/:path*",
    "/newslist/:path*",
    "/users/:path*",
    "/videos/:path*",
    "/settings/:path*",
    "/ads/:path*",
    "/addCategory/:path*",
    "/navmanager/:path*",
    "/epaper-manager/:path*",
  ],
};