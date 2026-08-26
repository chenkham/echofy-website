# Echofy Web Landing & Universal Deep-Linking Engine

Official modern landing page and deep-linking routing gateway for **Echofy Android** (Lossless Music Streaming, Jam Together, Spotify Sync, Voice Control).

## Features

- **Dynamic Deep-Link Gateway**:
  - Handles `/track/{id}` or `?track={id}&title=...&artist=...` to display song info and auto-trigger Android App Links (`echofy://track/...`).
  - Handles `/jam/{roomCode}` or `?jam={roomCode}` to show Jam Together room invitation card and auto-connect in Echofy.
  - Handles `/playlist/{id}`, `/album/{id}`, `/artist/{id}` for rich in-app media navigation.
- **Smart Fallback**: If the app is not installed, it offers direct downloads:
  - Google Play Store badge
  - Direct Universal Release APK (v4.9.0)
  - Google Drive Cloud Mirror link
  - GitHub Releases
- **Social Media Previews (OpenGraph / Twitter)**: Rich unfurling cards on WhatsApp, Telegram, Discord, and iMessage.
- **AdMob & Google Play Compliant**:
  - `app-ads.txt`
  - `privacy-policy.html`
  - `terms.html`

---

## File Structure

```
echofy-website/
├── index.html            # Main landing page & dynamic deep-link router
├── style.css             # OLED glassmorphism design system
├── app.js                # URL parsing, deep-link engine & intent dispatch
├── privacy-policy.html   # Privacy Policy
├── terms.html            # Terms of Service
├── app-ads.txt           # AdMob verification file
└── README.md             # Documentation & deployment guide
```

---

## Deployment Options

### Option 1: GitHub Pages (Free & Instant)

1. Push this directory to your GitHub repository `https://github.com/chenkham/echofy-website` (branch `main`).
2. Go to **Repository Settings** &rarr; **Pages**.
3. Under **Build and deployment** &rarr; **Branch**, select `main` and `/ (root)`, then click **Save**.
4. Your site will be live at:
   `https://chenkham.github.io/echofy-website/`

### Option 2: Custom Domain (e.g. `echofy.app` or `music.echofy.me`)

1. In GitHub Pages settings, enter your custom domain under **Custom domain**.
2. Add a `CNAME` or `A` DNS record at your domain registrar pointing to GitHub Pages / Cloudflare Pages.
3. Configure your custom domain in the Echofy Android app under **Settings &rarr; Content / Share Links**.

### Option 3: Cloudflare Pages / Vercel / Netlify

1. Connect your GitHub repository to Cloudflare Pages or Vercel.
2. Set build command to empty (static files).
3. Deploy for global edge CDN routing and free SSL certificate.
