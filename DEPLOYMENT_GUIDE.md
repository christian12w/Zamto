# Deployment Guide for Zamto Africa Website

## Prerequisites
1. MongoDB Atlas account (for production database)
2. GitHub account (for version control)
3. Netlify account (for frontend deployment)
4. Backend hosting service (Heroku, Render, or similar)

## Step 1: Set up MongoDB Atlas

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Create a database user with read/write permissions
4. Whitelist all IP addresses (0.0.0.0/0) for testing
5. Get your connection string:
   - Click "Connect" -> "Connect your application"
   - Copy the connection string
   - Replace `<username>`, `<password>`, and `<dbname>` with your actual values

## Step 2: Update Environment Variables

Update your [.env](file:///C:/Users/HP/Desktop/New%20folder/.env) file with production values:

```
# Frontend API Base URL (your deployed backend URL)
VITE_API_BASE_URL=https://your-backend-url.com/api

# Backend JWT Secret (use a strong secret)
JWT_SECRET=your_strong_jwt_secret_here

# MongoDB Connection URI (your MongoDB Atlas URI)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/zamto_africa?retryWrites=true&w=majority
```

## Step 3: Deploy the Backend

### Option A: Deploy to Render (Recommended)
1. Create a Render account at https://render.com
2. Fork your repository on GitHub
3. Create a new Web Service on Render
4. Connect your GitHub repository
5. Set the following environment variables in Render:
   - `JWT_SECRET` = your_strong_jwt_secret_here
   - `MONGODB_URI` = your_mongodb_atlas_uri
6. Set the build command: `npm install`
7. Set the start command: `node server.cjs`
8. Set the root directory: `/`
9. Deploy!

### Option B: Deploy to Heroku
1. Create a Heroku account at https://heroku.com
2. Install Heroku CLI
3. Login to Heroku CLI: `heroku login`
4. Create a new app: `heroku create your-app-name`
5. Set environment variables:
   ```
   heroku config:set JWT_SECRET=your_strong_jwt_secret_here
   heroku config:set MONGODB_URI=your_mongodb_atlas_uri
   ```
6. Deploy: `git push heroku master`

## Step 4: Deploy the Frontend to Netlify

1. Commit and push all changes to GitHub
2. Log in to Netlify
3. Click "New site from Git"
4. Connect to GitHub and select your repository
5. Set the following build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Set environment variables in Netlify:
   - `VITE_API_BASE_URL` = https://your-backend-url.com/api
7. Deploy site!

## Step 5: Update Frontend API URL

After deploying your backend, update the `VITE_API_BASE_URL` in Netlify environment variables to point to your deployed backend URL.

## Troubleshooting

### Common Issues:
1. **CORS errors**: Make sure your backend allows requests from your frontend domain
2. **Database connection errors**: Verify your MongoDB Atlas connection string and IP whitelist
3. **Authentication errors**: Check that your JWT_SECRET is the same in both frontend and backend

### Testing Your Deployment:
1. Visit your frontend URL
2. Try logging in with the default admin account (admin/admin123)
3. Check that vehicles are loading
4. Try importing a CSV file

## Production Security Recommendations

1. Use strong, unique passwords for all accounts
2. Rotate your JWT secret regularly
3. Restrict MongoDB Atlas IP whitelist to only necessary IPs
4. Enable two-factor authentication on all accounts
5. Regularly update dependencies