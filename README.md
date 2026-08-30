# DISCONNECT+ Website

Official DISCONNECT+ website rebuilt as a maintainable Next.js app for Cloudflare.

- Public band site for music, plugins, visuals, shows, archive, store, and contact.
- Admin console at `/admin` for editing content and managing order intent.
- Local demo storage for development.
- Cloudflare Pages Functions API for production data.
- Cloudflare D1 schema in `cloudflare/d1/schema.sql`.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Local `/admin` can store edits in this browser when a demo password is configured:

```text
NEXT_PUBLIC_DEMO_ADMIN_PASSWORD=choose-a-local-demo-password
```

The demo password is only for local preview. It is not a production security boundary.

## Cloudflare Deployment

Detailed setup notes:

- `docs/cloudflare-launch-checklist.md`
- `docs/cloudflare-dashboard-setup-zh.md`
- `docs/cloudflare-live-status.md`
- `docs/cloudflare-access-api-setup-zh.md`

Use Cloudflare for the whole production stack:

1. Buy or transfer the domain in Cloudflare Registrar.
2. Create a Cloudflare Pages project connected to this GitHub repository.
3. Use build command `npm run build`.
4. Use build output directory `out`.
5. Create a Cloudflare D1 database, for example `disconnect_site`.
6. Run `cloudflare/d1/schema.sql` against that D1 database.
7. Add a Pages D1 binding named `DB`.
8. If using Wrangler config, copy `wrangler.example.jsonc` to `wrangler.jsonc` and replace the D1 `database_id`.
9. Create a Cloudflare Turnstile widget for the domain.
10. Add these Pages environment variables:

```text
NEXT_PUBLIC_SITE_URL=https://your-domain.example
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
```

11. Protect `/admin*` and `/api/admin/*` with Cloudflare Access.
12. Add these Pages environment variables from the Access app:

```text
CF_ACCESS_TEAM_DOMAIN=your-team.cloudflareaccess.com
CF_ACCESS_AUD=
ADMIN_EMAILS=admin@example.com
```

`ADMIN_EMAILS` is a comma-separated allowlist. Admin API requests require a valid
Cloudflare Access JWT and an email on that list.

## Data Model

Production data lives in Cloudflare D1:

- `site_content`: the editable CMS document for songs, plugins, visuals, shows, news, products, and settings.
- `order_intents`: store purchase or reservation requests, initially saved as `new`.

Public visitors can read site content and submit order intent. Admin-only routes handle content
saves and order management.

## Security Notes

- Do not commit `.env.local`, Cloudflare API tokens, Turnstile secrets, Access secrets, or private contact exports.
- Public order submissions are length-limited.
- Public links are restricted to safe protocols before rendering.
- Production admin access requires Cloudflare Access plus the `ADMIN_EMAILS` allowlist.
- Turnstile should be enabled before the public forms are advertised.
- Videos larger than short loops should be hosted outside the repository, for example on Bilibili, Cloudflare Stream, or Cloudflare R2.
