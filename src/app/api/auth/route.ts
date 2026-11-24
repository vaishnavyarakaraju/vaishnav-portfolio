/**
 * Step 1 of the admin (Decap CMS) GitHub login: send the browser to GitHub.
 * Needs GITHUB_CLIENT_ID set in Vercel → Settings → Environment Variables.
 */
import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export function GET(req: NextRequest) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return new NextResponse("Admin login is not set up yet: add GITHUB_CLIENT_ID in Vercel.", { status: 500 });
  }
  const state = crypto.randomUUID();
  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", `${req.nextUrl.origin}/api/callback`);
  url.searchParams.set("scope", "public_repo,read:user");
  url.searchParams.set("state", state);

  const res = NextResponse.redirect(url);
  res.cookies.set("cms_oauth_state", state, { httpOnly: true, secure: true, sameSite: "lax", path: "/api", maxAge: 600 });
  return res;
}
