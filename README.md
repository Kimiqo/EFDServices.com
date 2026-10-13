# EFD Services

A React, TypeScript and Vite portfolio with embroidered SVG headings, a gallery, and WhatsApp inquiries.

## Local development

Use Node.js 20 or newer.

```sh
npm ci
npm run dev
```

Run `npm run build` to type-check and build the site, `npm run lint` for linting, and `npm test` for isolated admin API checks.

## Contact and content

Contact details, WhatsApp and map links live in `src/data/contactDetails.ts`. Gallery pieces, testimonials and hero photos live in their respective files in `src/data/`. The old `/custom-order` URL redirects to Contact.

## Admin API

Run `npm run api` alongside the website. Set `ADMIN_EMAIL`, `ADMIN_PASS`, and `ADMIN_JWT_SECRET` in an ignored `.env` file. The admin screen defaults to `http://localhost:4001`; set `VITE_API_BASE` when using a different API host.

Local content edits update the source data files and keep ignored backups in `api/backups/`. Build and redeploy the site to publish source content changes. Local password changes are stored in ignored `api/admin.json`.

The existing Vercel upload integration uses `BLOB_READ_WRITE_TOKEN` for a public image store. Private admin credential persistence requires a private store; use `ADMIN_BLOB_READ_WRITE_TOKEN` for it when using a separate public image store. Cloud storage requires deployment configuration and is not exercised by local tests. Content-file writes require a writable source checkout and are not a production CMS on a read-only serverless filesystem.

## Stitching headings

The SVG glyphs are generated assets, not font files. To change the wording, edit `scripts/generate_headline_glyphs.swift` and run it from the project root on macOS:

```sh
swift -module-cache-path /tmp/efd-swift-cache scripts/generate_headline_glyphs.swift
```

The shared `StitchingHeadline` component handles dotted outlines, needle motion, looping, pause/resume and reduced-motion preferences.
