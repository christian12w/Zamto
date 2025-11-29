# Enhanced Static Mode Deployment Guide

## 🚀 Option C: Netlify Functions + GitHub Storage

This setup uses **Netlify Functions** for serverless API and **GitHub Issues** as a free database.

### 📋 Prerequisites

1. **GitHub Personal Access Token**
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Generate new token with `repo` scope
   - Keep it secure!

2. **GitHub Repository for Data**
   - Create a new repository: `zamto-vehicles-data`
   - Make it public (or private if your token has access)

3. **Netlify Account**
   - Free account is sufficient
   - Connect your Git repository

### 🔧 Setup Steps

#### 1. Environment Variables in Netlify

Go to Netlify → Site settings → Build & deploy → Environment → Environment variables and add:

```bash
# GitHub Configuration
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_OWNER=your_github_username
GITHUB_REPO=zamto-vehicles-data

# Feature Flags
NEXT_PUBLIC_USE_GITHUB_STORAGE=true
NEXT_PUBLIC_USE_STATIC_DATA=false
```

#### 2. Local Development Setup

Update your `.env.local`:

```env
# For local development (keep static mode)
NEXT_PUBLIC_USE_STATIC_DATA=true
NEXT_PUBLIC_USE_GITHUB_STORAGE=false

# For testing GitHub integration
# NEXT_PUBLIC_USE_GITHUB_STORAGE=true
# GITHUB_OWNER=your_username
# GITHUB_REPO=zamto-vehicles-data
```

#### 3. Install Dependencies

```bash
npm install @octokit/rest
```

#### 4. Deploy to Netlify

1. Push your code to GitHub
2. Connect repository to Netlify
3. Set environment variables (step 1)
4. Deploy!

### 🏗️ How It Works

#### Data Storage
- **Vehicles** are stored as **GitHub Issues** in your data repository
- Each issue contains vehicle data as JSON in the body
- Issues are labeled with `vehicle` and vehicle type (`sale`/`hire`)

#### API Endpoints
- `GET /api/vehicles` - Fetch all vehicles
- `POST /api/vehicles` - Create new vehicle
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle (closes issue)

#### Authentication
- Static authentication for demo: `admin`/`admin123`
- In production, you can enhance with GitHub OAuth

### ✅ Benefits

- **Free hosting** on Netlify
- **Free database** via GitHub (no limits on issues)
- **Version control** - All changes tracked in Git
- **Easy backup** - Just clone the data repository
- **Scalable** - No database limits
- **Fast** - GitHub's CDN serves data quickly

### ⚠️ Limitations

- **Rate limits** - GitHub API has rate limits (5000/hour for authenticated)
- **Not real-time** - Changes take a few seconds to sync
- **Simple authentication** - Basic auth only (can be enhanced)
- **No complex queries** - Just basic CRUD operations

### 🎯 Next Steps

1. **Create GitHub repository** for vehicle data
2. **Generate Personal Access Token**
3. **Set up Netlify** with environment variables
4. **Test locally** with GitHub integration
5. **Deploy to production**

---

**Ready to deploy! 🚀** Your vehicle inventory will now persist across deployments and be manageable through the admin interface.
