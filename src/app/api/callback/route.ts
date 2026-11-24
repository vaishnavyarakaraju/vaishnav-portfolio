/**
 * Step 2 of the admin GitHub login: swap GitHub's code for a token and hand it
 * back to the admin window. Needs GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in Vercel.
 * Only GitHub accounts with write access to the repository can save changes.
 */
import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

function reply(status: "success" | "error", payload: object, origin: string) {
  const message = `authorization:github:${status}:${JSON.stringify(payload)}`;
  const html = `<!doctype html><html><body><p>${status === "success" ? "Logged in. You can close this window." : "Login failed. Close this window and try again."}</p>
<script>
(function () {
  var origin = ${JSON.stringify(origin)};
  function receive(e) {
    if (e.origin !== origin) return;
    window.opener.postMessage(${JSON.stringify(message)}, origin);
    window.removeEventListener("message", receive);
  }
  window.addEventListener("message", receive, false);
  window.opener && window.opener.postMessage("authorizing:github", origin);
})();
</script></body></html>`;
  const res = new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
  res.cookies.delete("cms_oauth_state");
  return res;
}

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const expected = req.cookies.get("cms_oauth_state")?.value;

  if (!code || !state || !expected || state !== expected) {
    return reply("error", { message: "Invalid login state. Please try again." }, origin);
  }

  try {
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${origin}/api/callback`,
      }),
    });
    const data = (await tokenRes.json()) as { access_token?: string; error_description?: string };
    if (!data.access_token) {
      return reply("error", { message: data.error_description ?? "GitHub did not return a token." }, origin);
    }
    return reply("success", { token: data.access_token, provider: "github" }, origin);
  } catch {
    return reply("error", { message: "Could not reach GitHub." }, origin);
  }
}
