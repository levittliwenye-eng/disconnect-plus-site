# DISCONNECT+ Cloudflare Live Status

Last checked: 2026-08-30

## Live Resources

- Pages project: `disconnect-plus-site`
- Production URL: `https://disconnectplus.com`
- Cloudflare Pages fallback URL: `https://disconnect-plus-site.pages.dev`
- Latest protected deployment: `https://3282b9c9.disconnect-plus-site.pages.dev`
- D1 database name: `disconnect_site`
- D1 binding name used by the app: `DB`
- D1 region observed from queries: APAC / SIN
- Turnstile widget: `DISCONNECT+ Store`
- Turnstile domains currently allowed: `disconnectplus.com`, `disconnect-plus-site.pages.dev`
- Cloudflare Access organization: `DISCONNECT+`
- Cloudflare Access team domain: `disconnectplus.cloudflareaccess.com`
- Cloudflare Access app: `DISCONNECT+ Admin`

## Verified Online

- `/` returns 200.
- `/api/content` returns 200 and reads from D1 with seeded fallback content.
- `/api/orders` requires a Turnstile token.
- `/admin` redirects to Cloudflare Access login on the production domain.
- `/api/admin/session` redirects to Cloudflare Access login on the production domain.
- The Access policy only allows `disconnectaudio@sina.com`.
- Cloudflare Access certificate/JWKS endpoint returns 200.
- Pages production secrets include `CF_ACCESS_TEAM_DOMAIN` and `CF_ACCESS_AUD`.
- Mobile layout has no horizontal overflow at 360px and 390px.
- Turnstile uses explicit client-side rendering to avoid React hydration mismatch.
- `/robots.txt` and `/sitemap.xml` return 200; admin routes are disallowed from indexing.
- `/privacy/` returns 200 and documents order/contact information handling.
- Security headers are present on `/`.
- `/api/content` returns `Cache-Control: no-store`.
- Public order submissions are verified against active products on the server.
- `/.well-known/security.txt` provides the security contact and policy URL.
- HSTS is enabled with `Strict-Transport-Security: max-age=31536000`.
- `https://disconnectplus.com` is active with Pages domain validation and HTTPS verification complete.
- Public DNS resolves `disconnectplus.com` to Cloudflare; the current local resolver may still need time to refresh.

## Still Needed Before Public Launch

- Open `https://disconnectplus.com/admin`, finish the email one-time-code login, and confirm the admin dashboard loads in your browser.
- Local DNS on this machine may still need time to refresh even though public DNS already resolves `disconnectplus.com`.
