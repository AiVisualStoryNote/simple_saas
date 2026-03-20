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

    const user = await supabase.auth.getUser();

    if (request.nextUrl.pathname.startsWith("/dashboard") && user.error) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    if (request.nextUrl.pathname.startsWith("/read")) {
      const novelId = request.nextUrl.searchParams.get("novelId");
      const mkt = request.nextUrl.searchParams.get("mkt") || "en";

      if (novelId) {
        const verifyResponse = await fetch(
          `${request.nextUrl.origin}/api/verify-purchase`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Cookie: request.headers.get("Cookie") || "",
            },
            body: JSON.stringify({ novelId, mkt }),
          }
        );

        const verifyData = await verifyResponse.json();

        if (!verifyData.verified) {
          const redirectUrl = new URL("/reading-room", request.url);
          const originalMkt = request.nextUrl.searchParams.get("mkt");
          if (originalMkt) {
            redirectUrl.searchParams.set("mkt", originalMkt);
          }
          return NextResponse.redirect(redirectUrl);
        }
      }
    }

    return response;
  } catch (e) {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
