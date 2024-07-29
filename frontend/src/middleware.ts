import { NextRequest, NextResponse } from "next/server"
import { RoleEnum } from '@/common/types/form-types'

const protectedRoutes = ["/my-slots", "/profile"]; // can't access protected routes without authorization
const signInRoute = "/sign-in";
const homeRoute = "/home";

// if isUserAuthenticated is false in this case user can access only 'sign-up' page
export default function middleware(request: NextRequest) {
  const authToken = request.cookies.get('authToken')?.value;
  const userToken = request.cookies.get('userToken')?.value;
  const isUserAuthenticated = authToken && authToken !== 'null';
  const userData = userToken && userToken !== 'null' ? JSON.parse(atob(userToken)) : null;

  if (!isUserAuthenticated) {
    console.log("No auth token");
    // If the user is not authenticated, redirect to sign-in page
    if (protectedRoutes.includes(request.nextUrl.pathname) || request.nextUrl.pathname.startsWith("/admin")) {
      const signInUrl = new URL(signInRoute, request.nextUrl.origin);
      return NextResponse.redirect(signInUrl.toString());
    }
  } 
  if (isUserAuthenticated) {
    console.log("Auth token");
    if (userData) {
      if (userData.role === RoleEnum.NORMAL) {
        console.log("ordinary user");
        if (request.nextUrl.pathname.startsWith("/admin")) {
          const homeUrl = new URL(homeRoute, request.nextUrl.origin);
          return NextResponse.redirect(homeUrl.toString());
        }
      } else if (userData.role === RoleEnum.ADMIN) {
        console.log("admin user");
        // Admin users should be allowed to access /admin routes
        if (request.nextUrl.pathname.startsWith("/admin")) {
          return NextResponse.next();
        }
      }
    }
    return NextResponse.next();
  }
}
