# DISCONNECT+ Cloudflare Launch Checklist

## GitHub

- Use the new source repository for the rebuilt site: `levittliwenye-eng/disconnect-plus-site`.
- Keep `main` as the production branch.
- Connect Cloudflare Pages to this repository after the first push succeeds.
- The old `levittliwenye-eng/Disconnect-website` repository is only the previous website and can be deleted after the new repository is verified.

## Cloudflare Pages

- Framework preset: none / static export.
- Build command: `npm run build`.
- Build output directory: `out`.
- Production branch: `main`.

## Cloudflare D1

- Create a D1 database, for example `disconnect_site`.
- Run `cloudflare/d1/schema.sql` against the database.
- Add a Pages D1 binding named `DB`.

## Environment Variables

```text
NEXT_PUBLIC_SITE_URL=https://your-domain.example
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
CF_ACCESS_TEAM_DOMAIN=your-team.cloudflareaccess.com
CF_ACCESS_AUD=
ADMIN_EMAILS=disconnectaudio@sina.com
```

Do not commit real secrets, API tokens, Turnstile secret keys, Access secrets, or private order exports.

## Cloudflare Turnstile

- Create one Turnstile widget for the production domain.
- Add the site key as `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
- Add the secret as `TURNSTILE_SECRET_KEY`.
- The public store/reservation form should not be advertised until Turnstile is configured.

## Cloudflare Access

- Protect `/admin*`.
- Protect `/api/admin/*`.
- Allow only the admin email list in `ADMIN_EMAILS`.
- Public routes should remain open:
  - `/`
  - `/api/content`
  - `/api/orders`

## Domain

- Buy or transfer the production domain in Cloudflare.
- Attach it to the Cloudflare Pages project.
- Set `NEXT_PUBLIC_SITE_URL` to the final `https://` domain.

## Media

- Small audio files can live in `public/audio`.
- Large audio libraries can move to Cloudflare R2 later.
- Videos should be hosted outside the GitHub repository, for example Bilibili, YouTube, Cloudflare Stream, or R2.
- Add video URLs to the visual archive through `/admin`.
