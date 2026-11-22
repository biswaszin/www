// View counter for biswaszin.com, served at views.biswaszin.com.
//   POST /hit  -> adds one view, returns { views }
//   GET  /     -> returns { views } without counting
// The site calls /hit once per tab session (see src/components/ViewCounter.astro).
// The total lives in a single Durable Object, so every request sees the exact
// same, up-to-date number.
import { DurableObject } from "cloudflare:workers";

const ALLOWED_ORIGINS = new Set([
  "https://biswaszin.com",
  "https://www.biswaszin.com",
  "https://biswaszin.github.io",
  "http://localhost:4321",
  "http://127.0.0.1:4321",
]);

// Crawlers and link-preview bots shouldn't count as visitors.
const BOT_RE = /bot|crawl|spider|slurp|preview|facebookexternalhit|headless/i;

export class Counter extends DurableObject {
  async get() {
    return (await this.ctx.storage.get("views")) ?? 0;
  }

  async hit() {
    const views = (await this.get()) + 1;
    await this.ctx.storage.put("views", views);
    return views;
  }
}

function cors(origin) {
  const headers = {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
  if (ALLOWED_ORIGINS.has(origin)) headers["Access-Control-Allow-Origin"] = origin;
  return headers;
}

function json(body, origin, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...cors(origin),
    },
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") ?? "";
    const { pathname } = new URL(request.url);
    const counter = env.COUNTER.get(env.COUNTER.idFromName("site"));

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors(origin) });
    }

    if (pathname === "/" && request.method === "GET") {
      return json({ views: await counter.get() }, origin);
    }

    if (pathname === "/hit" && request.method === "POST") {
      // Only count visits made from the site itself, and not from bots.
      const ua = request.headers.get("User-Agent") ?? "";
      if (!ALLOWED_ORIGINS.has(origin) || BOT_RE.test(ua)) {
        return json({ views: await counter.get() }, origin);
      }
      return json({ views: await counter.hit() }, origin);
    }

    return json({ error: "not found" }, origin, 404);
  },
};
