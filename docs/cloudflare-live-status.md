# DISCONNECT+ Cloudflare Live Status

Last checked: 2026-08-30

## Live Resources

- Pages project: `disconnect-plus-site`
- Production URL: `https://disconnect-plus-site.pages.dev`
- Latest protected deployment: `https://e33347ee.disconnect-plus-site.pages.dev`
- D1 database name: `disconnect_site`
- D1 binding name used by the app: `DB`
- D1 region observed from queries: APAC / SIN
- Turnstile widget: `DISCONNECT+ Store`
- Turnstile domain currently allowed: `disconnect-plus-site.pages.dev`

## Verified Online

- `/` returns 200.
- `/api/content` returns 200 and reads from D1 with seeded fallback content.
- `/api/orders` requires a Turnstile token.
- `/admin` returns 401 without Cloudflare Access.
- `/api/admin/session` returns 401 without Cloudflare Access.
- Mobile layout has no horizontal overflow at 360px and 390px.

## Still Needed Before Public Launch

- Buy or transfer the final domain in Cloudflare.
- Add the final domain to the Pages project.
- Add the final domain to the Turnstile widget allowed domains.
- Change `NEXT_PUBLIC_SITE_URL` to the final `https://` domain and redeploy.
- Configure Cloudflare Access for `/admin*` and `/api/admin/*`.
- Set `CF_ACCESS_TEAM_DOMAIN` and `CF_ACCESS_AUD` after the Access application is created.
