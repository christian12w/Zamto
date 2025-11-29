# Quick Start Guide - Zamto Africa Website

## Step 1: Install Dependencies

Open your terminal in the project folder and run:

```bash
npm install
```

This will install all required packages (Next.js, TinaCMS, Tailwind, etc.)

**Expected time:** 2-5 minutes

---

## Step 2: Verify Files Are Ready

Check that these exist:
- ✅ `content/vehicles/` folder with vehicle JSON files (16 vehicles converted)
- ✅ `public/logo.png` (your Zamto Africa logo)
- ✅ `tina/config.ts` (TinaCMS configuration)
- ✅ `app/` folder with all pages

---

## Step 3: Run Development Server (Preview)

Start the development server:

```bash

```

Then open your browser to:
**http://localhost:3000**

You should see:
- Home page with Zamto Africa branding
- Navigation with logo
- Popular vehicles section
- Links to browse all vehicles

**Note:** The site will work without TinaCMS credentials for preview, but admin panel won't work until Step 4.

---

## Step 4: Set Up TinaCMS (For Admin Panel)

### Option A: Quick Preview (Skip for now)
You can preview the site without TinaCMS. The admin panel at `/admin` won't work, but all public pages will.

### Option B: Full Setup (For Production)

1. **Get TinaCMS Credentials:**
   - Go to https://tina.io
   - Sign up for a free account
   - Create a new project
   - Connect your GitHub repository
   - Copy your Client ID and Token

2. **Create `.env.local` file:**
   ```bash
   # Copy the example file
   cp .env.example .env.local
   ```

3. **Add your credentials to `.env.local`:**
   ```
   NEXT_PUBLIC_TINA_CLIENT_ID=your-client-id-here
   TINA_TOKEN=your-token-here
   NEXT_PUBLIC_TINA_BRANCH=main
   GITHUB_TOKEN=your-github-token-here
   ```

4. **Get GitHub Token:**
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Create token with `repo` scope
   - Add to `.env.local`

5. **Restart dev server:**
   ```bash
   npm run dev
   ```

6. **Access Admin Panel:**
   - Visit http://localhost:3000/admin
   - You can now edit vehicles!

---

## Step 5: Test the Site

### Pages to Check:

1. **Home Page** (`/`)
   - Should show Zamto Africa branding
   - Logo in navigation
   - Popular vehicles grid
   - Navy blue (#003366) and orange (#FF6600) colors

2. **All Vehicles** (`/vehicles`)
   - List of all 16 vehicles
   - Vehicle cards with images

3. **Vehicles for Sale** (`/vehicles/sale`)
   - Filtered list of sale vehicles

4. **Vehicles for Hire** (`/vehicles/hire`)
   - Filtered list of hire vehicles

5. **Vehicle Detail** (`/vehicles/[slug]`)
   - Click any vehicle to see full details
   - WhatsApp contact button
   - All vehicle specifications

6. **Admin Panel** (`/admin`)
   - Only works after Step 4 setup
   - Beautiful TinaCMS interface

---

## Step 6: Deploy to Netlify

### Prerequisites:
- GitHub account
- Netlify account (free)

### Steps:

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Zamto Africa website"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Netlify:**
   - Go to https://app.netlify.com
   - Click "New site from Git"
   - Select your GitHub repository
   - Build settings (auto-detected):
     - Build command: `npm run tina-build`
     - Publish directory: `.next`

3. **Add Environment Variables:**
   - In Netlify dashboard → Site settings → Environment variables
   - Add all variables from `.env.local`:
     - `NEXT_PUBLIC_TINA_CLIENT_ID`
     - `TINA_TOKEN`
     - `GITHUB_TOKEN`
     - `NEXT_PUBLIC_TINA_BRANCH`

4. **Deploy:**
   - Click "Deploy site"
   - Wait for build (2-5 minutes)
   - Your site is live! 🎉

---

## Troubleshooting

### "Cannot find module" errors
**Solution:** Run `npm install` again

### Admin panel not loading
**Solution:** 
- Check `.env.local` has correct TinaCMS credentials
- Restart dev server after adding env variables
- Visit `/admin` (not `/admin/index.html`)

### Images not showing
**Solution:**
- Check `public/logo.png` exists
- Vehicle images are in base64 format in JSON files
- For production, upload images to `public/vehicles/[slug]/`

### Build errors
**Solution:**
- Run `npm run lint` to check for issues
- Ensure TypeScript types are correct
- Check all environment variables are set

---

## Current Status Checklist

- ✅ Next.js project created
- ✅ 16 vehicles converted from MongoDB
- ✅ TinaCMS schema configured
- ✅ All pages created (home, listings, details)
- ✅ Zamto Africa branding applied
- ✅ ISR configured (revalidate: 10)
- ✅ Responsive design
- ✅ SEO metadata
- ⏳ Dependencies installation (Step 1)
- ⏳ Development server (Step 3)
- ⏳ TinaCMS setup (Step 4 - optional for preview)
- ⏳ Netlify deployment (Step 6)

---

## Next Actions

**Right now, do this:**

1. Open terminal in project folder
2. Run: `npm install`
3. Wait for installation
4. Run: `npm run dev`
5. Open: http://localhost:3000
6. **Preview your site!** 🚀

---

## Need Help?

- Check `README.md` for detailed documentation
- Review `tina/config.ts` for TinaCMS configuration
- Check `netlify.toml` for deployment settings

