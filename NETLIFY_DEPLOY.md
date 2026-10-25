# Netlify Deployment Guide for Ajju Juice Wala

This website is completely ready for deployment on **Netlify**.

---

## Deployment Settings Summary

| Setting | Value |
|---|---|
| **Build Command** | `npm run build` |
| **Publish Directory** | `dist` |
| **Redirects / SPA Rewrites** | `netlify.toml` and `public/_redirects` (included) |
| **Database** | Connected directly to Supabase (`cfjuvpbbrmrzlowqviua`) |

---

## Method 1: Connect via GitHub / GitLab (Recommended for Automatic Updates)

1. Push this project to your GitHub, GitLab, or Bitbucket account.
2. Go to **[Netlify Dashboard](https://app.netlify.com/)** and click **Add new site** > **Import an existing project**.
3. Choose your Git provider and select your repository.
4. Netlify will automatically detect the settings from `netlify.toml`:
   - **Base directory:** *(Leave blank)*
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. *(Optional)* Add environment variables in **Site configuration** > **Environment variables**:
   - `VITE_SUPABASE_URL`: `https://cfjuvpbbrmrzlowqviua.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `sb_publishable_XhLxe3RsTrUbpOtA3VfJ5Q_78hLR4ev`
   *(Even without manually adding them, built-in fallback values will automatically connect to your project).*
6. Click **Deploy Site**. Your site will be live with an SSL certificate (`https://your-site.netlify.app`)!

---

## Method 2: Netlify Drop (Instant 1-Click Drag & Drop)

If you don't want to connect a Git repository:

1. Build the production bundle locally:
   ```bash
   npm run build
   ```
2. Open **[Netlify Drop](https://app.netlify.com/drop)** in your web browser.
3. Drag and drop the `dist` folder into the Netlify drop zone.
4. Your website is deployed and live instantly!

---

## Method 3: Netlify CLI

If you use terminal commands:

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```
2. Build the project:
   ```bash
   npm run build
   ```
3. Deploy to production:
   ```bash
   netlify deploy --prod --dir=dist
   ```

---

## Included Netlify Configurations

- **`netlify.toml`**: Specifies build command, publish directory (`dist`), SPA 200 routing rules, and security headers.
- **`public/_redirects`**: Ensures clean URL rewrites so customer tracking (`/tracking`) and deep links never return 404 errors.
- **Client-Side Supabase Integration**: When deployed on Netlify, customer orders, live tracking, and admin dashboard operations synchronize directly with your Supabase database in real time.
