# MADAD WALLAH FOUNDATION — Official Website

Production-ready static website for **MADAD WALLAH FOUNDATION**, a Section 8
non-profit company (CIN: U88900BR2026NPL087297, DARPAN ID: BR/2026/1184067).

## Pages

| File | Page |
|---|---|
| `index.html` | Home — hero, focus areas, stats, news, CTA |
| `about.html` | About Us — overview, vision & mission, leadership |
| `objectives.html` | Our Objectives — 6 MoA domains |
| `activities.html` | Activities / Programs |
| `gallery.html` | Gallery — photo grid + lightbox, video slots |
| `join.html` | Join Us / Volunteer registration form |
| `donate.html` | Donate — bank details, UPI QR, impact |
| `transparency.html` | Statutory Documents & Transparency |
| `contact.html` | Contact Us — address, email, Google Map |
| `privacy-policy.html` | Privacy Policy |
| `terms.html` | Terms & Conditions |
| `refund-policy.html` | Refund & Cancellation Policy (donations) |

## Structure

```
├── index.html + 11 inner pages
├── css/style.css        # full design system (responsive, accessible)
├── js/main.js           # nav, lightbox, counters, forms, copy buttons
├── images/              # logo, hero, gallery, leaders, UPI QR (demo assets)
└── assets/              # generator scripts (image + page builders)
```

## Before going live — checklist

1. **Google Form (Join Us page)** — create the Google Form with the fields in
   the requirements sheet, link it to a Google Sheet, then in `join.html`
   uncomment the `gform-wrap` iframe block and paste your form's embed URL.
   The on-page demo form can then be removed (it currently stores submissions
   in the browser's localStorage as a placeholder).
2. **Banking details (Donate page)** — replace the four `[ To be updated ]`
   cells in `donate.html` with the real Bank Name, Account Number, IFSC and
   Branch, and update each `data-copy` attribute to match.
3. **UPI ID** — the QR encodes `madadwallahfoundation@upi`. Regenerate
   `images/upi-qr.png` with the real UPI ID (edit `assets/generate_images.py`).
4. **Contact number** — replace `[ To be updated ]` in `contact.html`.
5. **Social media links** — replace the `#` hrefs in the top bar, contact
   page and footer with real Facebook / Instagram / YouTube URLs.
6. **Tagline** — the Hindi tagline "हर हाथ में मदद क़ा साथ" is a placeholder;
   swap it in `index.html` hero if the foundation has an official one.
7. **Gallery photos/videos** — replace demo images with real event photos and
   embed YouTube iframes in `gallery.html` when the channel is live.
8. **News items** — update the three news cards in `index.html` as events happen.

## Deploy (free options)

- **GitHub Pages**: push this folder to a repo → Settings → Pages → deploy from branch.
- **Netlify**: drag-and-drop the folder at app.netlify.com/drop, or `netlify deploy --prod`.
- **Vercel**: `vercel --prod` from this folder.

No build step required — pure HTML/CSS/JS.

## Regenerating demo assets

```bash
python assets/generate_images.py   # all images incl. UPI QR
python assets/build_pages.py       # rebuilds the 10 template-generated pages
```
(`index.html` and `about.html` are hand-maintained and are NOT touched by the builder.)
