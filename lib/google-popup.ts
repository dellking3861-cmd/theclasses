import { NextResponse } from "next/server";

/** Small page shown inside the sign-in popup: reports back to the admin page, then closes. */
export function popupResponse(origin: string, payload: { ok: boolean; message: string }) {
  const json = JSON.stringify({ type: "gbp-oauth", ...payload }).replace(/</g, "\\u003c");
  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Google Business Profile</title>
<style>body{font-family:system-ui,sans-serif;margin:0;display:grid;place-items:center;min-height:100vh;background:#fbfaf6;color:#16140f}main{max-width:360px;padding:24px;text-align:center}p{color:#57534e}</style></head>
<body><main><h1 style="font-size:18px">${payload.ok ? "Connected" : "Could not connect"}</h1><p id="m"></p><p style="font-size:13px">You can close this window.</p></main>
<script>
  var data = ${json};
  document.getElementById("m").textContent = data.message;
  try { if (window.opener) { window.opener.postMessage(data, ${JSON.stringify(origin)}); setTimeout(function(){ window.close(); }, ${payload.ok ? 800 : 4000}); } } catch (e) {}
</script></body></html>`;
  return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
}
