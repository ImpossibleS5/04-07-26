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

Site URL: `https://impossibles5.github.io/invite/`

## Setting up Google Forms for RSVP

The site sends RSVP submissions to a Google Form. To wire it up:

1. Go to https://forms.google.com and create a new form titled e.g. «Подтверждение присутствия».
2. Add four questions:
   - **Имя и фамилия** — short answer, required.
   - **Номер телефона** — short answer, required. (Front-end already validates and submits in `+7XXXXXXXXXX` form.)
   - **Присутствие** — multiple choice with two options:
     - `Я с удовольствием приду`
     - `К сожалению, не смогу прийти`
   - **Имена дополнительных гостей** — short answer, **not** required. (Front-end only sends this entry when the "Я буду не один" checkbox is on.)
3. Open the form's response settings and enable email notifications (Settings → ⋮ → Get email notifications for new responses).
4. Click **Send** → link tab → copy the form URL. The URL contains the form ID after `/d/e/`.
5. Get field entry IDs:
   - Click **⋮ → Get pre-filled link**.
   - Fill the fields with placeholder values (e.g. `NAME` and `Я с удовольствием приду`).
   - Click **Get link** → copy the URL.
   - The URL contains `entry.NNNNNNNN=NAME&entry.MMMMMMMM=...` — these `entry.NNNN` keys are the field IDs.
6. Open `src/data/wedding.ts` and update:

   ```ts
   rsvp: {
     formActionUrl: 'https://docs.google.com/forms/d/e/<FORM_ID>/formResponse',
     fields: {
       name: 'entry.<NUMBER>',
       phone: 'entry.<NUMBER>',
       attendance: 'entry.<NUMBER>',
       companions: 'entry.<NUMBER>',
     },
     // ...
   }
   ```

7. Commit and push — the deploy will rebuild and the form starts working.

## Replacing placeholder assets

- **Hero photo:** drop a square image at `public/images/hero.jpg` (or any name) and update the `src` in `src/components/Hero.astro` to point at it.
- **Background music:** put an mp3 at `public/audio/background.mp3` and set `wedding.music.src = '/audio/background.mp3'` in `src/data/wedding.ts`.

After either change, run `npm run build` locally to verify, commit, and push.
