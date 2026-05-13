# Wedding Invitation — Екатерина & Никита

Static invitation site for the wedding on **04.07.2026** in Волгоград.

## Local development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
npm run test     # runs vitest
```

## Deploy

Pushes to `main` trigger GitHub Actions, which builds and publishes to GitHub Pages.

Site URL: `https://impossibles5.github.io/04-07-26/`

## RSVP

The RSVP section is a single CTA button that opens a Google Form in a new tab — no in-page form, no programmatic POSTs (browser anti-abuse on Google's side made the embedded approach unreliable).

To swap the form, edit `src/data/wedding.ts`:

```ts
rsvp: {
  formUrl: 'https://docs.google.com/forms/d/e/<FORM_ID>/viewform',
}
```

Enable email notifications inside the form: Responses tab → ⋮ → **Get email notifications for new responses**. Link the form to a Google Sheet for tabular responses: Responses tab → green Sheets icon.

## Replacing placeholder assets

- **Hero photo:** drop a square image at `public/images/hero.jpg` (or any name) and update the `src` in `src/components/Hero.astro` to point at it.
- **Background music:** put an mp3 at `public/audio/background.mp3` and set `wedding.music.src = '/audio/background.mp3'` in `src/data/wedding.ts`.

After either change, run `npm run build` locally to verify, commit, and push.
