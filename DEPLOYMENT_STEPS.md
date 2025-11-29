# 🚀 Production Deployment Steps

## 1. Netlify Environment Variables

Add these in **Netlify → Site settings → Build & deploy → Environment → Environment variables**:

```bash
# GitHub Configuration
GITHUB_TOKEN=your_github_personal_access_token_here
GITHUB_OWNER=christian12w
GITHUB_REPO=zamto-vehicles-data

# Feature Flags (already in netlify.toml)
NEXT_PUBLIC_USE_GITHUB_STORAGE=true
NEXT_PUBLIC_USE_STATIC_DATA=false
```

## 2. Deploy Commands

```bash
# Install dependencies
npm install @octokit/rest

# Deploy to Netlify
npm run build
netlify deploy --prod

# Or connect Git repository for auto-deploys
```

## 3. Verification

After deployment:
1. Visit your Netlify site
2. Go to `/admin` 
3. Login with `admin`/`admin123`
4. Try adding a vehicle
5. Check your GitHub repository - you should see a new issue!

## 4. How It Works

- **Vehicles** = GitHub Issues in `christian12w/zamto-vehicles-data`
- **Each issue** contains vehicle data as JSON
- **Issue title** = Vehicle name
- **Labels** = `vehicle` + `sale`/`hire`

## 5. Testing GitHub Integration

You can test locally by updating `.env.local`:

```env
# Test GitHub integration locally
NEXT_PUBLIC_USE_GITHUB_STORAGE=true
GITHUB_OWNER=christian12w
GITHUB_REPO=zamto-vehicles-data
```

**Note:** You'll need the GitHub token to test locally.

## 6. Security

- Never expose `GITHUB_TOKEN` in client code
- Token is only used in Netlify Functions (server-side)
- Repository can be public or private

---

**Ready to deploy! 🚀**
