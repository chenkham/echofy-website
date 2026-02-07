# Echofy Website

Simple landing page for Echofy with app-ads.txt for AdMob verification.

## Files

- `index.html` - Landing page
- `privacy-policy.html` - Privacy Policy
- `terms.html` - Terms of Service
- `app-ads.txt` - AdMob verification file

## Deploy to GitHub Pages

### Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click **"New repository"**
3. Name it: `echofy-website` (or `yourusername.github.io` for root domain)
4. Make it **Public**
5. Click **Create repository**

### Step 2: Push Code

```bash
cd echofy-website
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/echofy-website.git
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Source", select **main** branch
4. Click **Save**
5. Wait 1-2 minutes for deployment

### Step 4: Your URLs

After deployment, your site will be available at:
- Landing page: `https://YOUR_USERNAME.github.io/echofy-website/`
- app-ads.txt: `https://YOUR_USERNAME.github.io/echofy-website/app-ads.txt`
- Privacy Policy: `https://YOUR_USERNAME.github.io/echofy-website/privacy-policy.html`

### Step 5: Configure in AdMob

1. Go to [AdMob Console](https://apps.admob.com)
2. Select your app
3. Click **App settings**
4. Under "app-ads.txt", add your website URL
5. Click **Verify**

### Step 6: Update Google Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Select Echofy
3. Go to **Store settings** → **Store listing**
4. Add your website URL under "Developer contact"
5. Link to Privacy Policy page
