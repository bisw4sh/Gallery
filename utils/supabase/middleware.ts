import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Supabase environment variables are not set.");
    }

    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            for (const { name, value } of cookiesToSet) {
              request.cookies.set(name, value);
            }
            response = NextResponse.next({
              request,
            });
            for (const { name, value, options } of cookiesToSet) {
              response.cookies.set(name, value, options);
            }
          },
        },
      }
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const user = await supabase.auth.getUser();

    // Public routes
    const publicRoutes = [
      "/",
      "/password/forgot",
      "/signin",
      "/signup",
      "/api/images",  // API route
      "/api/images/[userid]",  // API route
      "/images/[userid]", // Add this route for the client-side images route
      "/public",
    ];

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
