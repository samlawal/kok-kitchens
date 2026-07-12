import { NextResponse, type NextRequest } from "next/server";

// Staging gate (ophir-digital DESIGN.md D-023). Staging hosts are enumerable
// via Certificate Transparency logs — noindex alone is not access control.
// When STAGING_KEY is set (branch-scoped to `staging`), the whole staging
// host requires a cookie planted by a one-click ?key= link (30 days, no
// password dialog). Fail-OPEN when unset so a missing env var can never lock
// staging out. This is a speed bump for unreleased content, not real
// security: staging must still never hold production data.
export function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  if (host !== "staging.ophirdigital.com" && !host.endsWith(".staging.ophirdigital.com")) {
    return NextResponse.next();
  }

  const key = process.env.STAGING_KEY;
  if (!key) return NextResponse.next();

  const COOKIE = "ophir_staging";
  if (req.cookies.get(COOKIE)?.value === key) return NextResponse.next();

  if (req.nextUrl.searchParams.get("key") === key) {
    const clean = req.nextUrl.clone();
    clean.searchParams.delete("key");
    const res = NextResponse.redirect(clean);
    res.cookies.set(COOKIE, key, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    return res;
  }

  return new NextResponse(
    "Staging preview by Ophir Digital — please use the access link you were sent.",
    { status: 401, headers: { "content-type": "text/plain; charset=utf-8" } },
  );
}

export const config = {
  // All paths except Next.js internals and crawler-directive files, which
  // must stay fetchable even on a keyed staging host.
  matcher: ["/((?!_next/|favicon\\.ico|robots\\.txt|sitemap\\.xml).*)"],
};
