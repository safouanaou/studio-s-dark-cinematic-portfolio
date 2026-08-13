// Secret bindings are encrypted in Cloudflare and intentionally absent from wrangler.jsonc.
interface Env {
  TURNSTILE_SECRET: string;
  RATE_LIMIT_SALT: string;
}
