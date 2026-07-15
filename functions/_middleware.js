// Cloudflare Pages – site-wide username + password (HTTP Basic Auth)
// Credentials come from environment variables set in the Pages dashboard:
//   SITE_USER  and  SITE_PASS
// Nothing sensitive is stored in this file, so it is safe to host publicly.

export async function onRequest(context) {
  const { request, env, next } = context;

  const user = env.SITE_USER || "";
  const pass = env.SITE_PASS || "";

  // If credentials haven't been set yet, fail closed (deny) rather than expose the site.
  if (!user || !pass) {
    return new Response("Site not configured. Set SITE_USER and SITE_PASS.", { status: 503 });
  }

  const expected = "Basic " + btoa(`${user}:${pass}`);
  const provided = request.headers.get("Authorization") || "";

  if (provided !== expected) {
    return new Response("Authentication required.", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Shelbu Invoices", charset="UTF-8"',
      },
    });
  }

  // Correct credentials – serve the page.
  return next();
}
