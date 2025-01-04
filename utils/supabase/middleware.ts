import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const user = await supabase.auth.getUser();

    // Public routes
    const publicRoutes = ["/", "/password/forgot", "/signin", "/signup"];
    if (!publicRoutes.includes(request.nextUrl.pathname) && user.error) {
      // Redirect unauthenticated users trying to access private routes to /signin
      return NextResponse.redirect(new URL("/signin", request.url));
    }
    
    return response;
  } catch (e) {
    // This is likely because you have not set up environment variables.
    console.log(e);
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
