# Deployment Guide - Receipt Tracker

This guide will walk you through deploying the Receipt Tracker application to Vercel.

## Prerequisites

- GitHub account
- Vercel account (free tier available)
- MongoDB database (MongoDB Atlas recommended)

## Step 1: Push to GitHub

1. **Create a new repository on GitHub:**
   - Go to [github.com](https://github.com) and sign in
   - Click "New repository"
   - Name it `receipt-tracker` (or your preferred name)
   - Make it public or private (your choice)
   - Don't initialize with README (we already have one)
   - Click "Create repository"

2. **Push your local code to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/receipt-tracker.git
   git branch -M main
   git push -u origin main
   ```
   Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 2: Set up MongoDB (if not already done)

1. **Create MongoDB Atlas account:**
   - Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
   - Sign up for free account
   - Create a new cluster (free tier M0 is sufficient)

2. **Configure database access:**
   - Go to "Database Access" in Atlas
   - Add a new database user with read/write permissions
   - Note down the username and password

3. **Configure network access:**
   - Go to "Network Access" in Atlas
   - Add IP address `0.0.0.0/0` (allow access from anywhere)
   - This is needed for Vercel to connect

4. **Get connection string:**
   - Go to "Clusters" and click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

## Step 3: Deploy to Vercel

1. **Sign up/Login to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with your GitHub account

2. **Import your project:**
   - Click "New Project"
   - Import your `receipt-tracker` repository from GitHub
   - Vercel will automatically detect it's a Next.js project

3. **Configure environment variables:**
   Before deploying, add these environment variables:
   
   - `MONGODB_URI`: Your MongoDB connection string from Step 2
   - `NEXTAUTH_SECRET`: Generate a random string (you can use: `openssl rand -base64 32`)
   - `NEXTAUTH_URL`: Will be your Vercel app URL (e.g., `https://your-app.vercel.app`)

   **To add environment variables in Vercel:**
   - In the import screen, expand "Environment Variables"
   - Add each variable name and value
   - Or add them later in Project Settings > Environment Variables

4. **Deploy:**
   - Click "Deploy"
   - Vercel will build and deploy your application
   - This usually takes 2-3 minutes

## Step 4: Configure Production URL

1. **Update NEXTAUTH_URL:**
   - After deployment, you'll get a URL like `https://receipt-tracker-xyz.vercel.app`
   - Go to Project Settings > Environment Variables
   - Update `NEXTAUTH_URL` with your actual Vercel URL
   - Redeploy the application

## Step 5: Test Production Deployment

1. **Visit your deployed app:**
   - Click on the deployment URL from Vercel dashboard
   - Test key functionality:
     - Camera capture works
     - Receipt form submission
     - Receipt list display
     - Database connectivity

2. **Check for issues:**
   - Open browser developer tools
   - Check for any console errors
   - Test on mobile devices

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/receipts` |
| `NEXTAUTH_SECRET` | Secret for authentication | `your-secret-key-here` |
| `NEXTAUTH_URL` | Production URL | `https://your-app.vercel.app` |

## Troubleshooting

### Build Failures
- Check the build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify environment variables are set correctly

### Database Connection Issues
- Verify MongoDB connection string is correct
- Check that IP `0.0.0.0/0` is whitelisted in MongoDB Atlas
- Ensure database user has proper permissions

### Camera Not Working
- HTTPS is required for camera access
- Vercel provides HTTPS by default
- Test on different devices/browsers

### Image Upload Issues
- Vercel has file size limits (4.5MB for Hobby plan)
- Check if images are being processed correctly
- Verify upload API endpoints are working

## Custom Domain (Optional)

1. **Add custom domain in Vercel:**
   - Go to Project Settings > Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Update environment variables:**
   - Update `NEXTAUTH_URL` to use your custom domain
   - Redeploy the application

## Monitoring and Analytics

1. **Vercel Analytics:**
   - Enable in Project Settings > Analytics
   - Monitor performance and usage

2. **Error Monitoring:**
   - Check Function Logs in Vercel dashboard
   - Set up error tracking if needed

## Maintenance

### Regular Updates
- Keep dependencies updated
- Monitor for security updates
- Test functionality after updates

### Database Maintenance
- Monitor MongoDB Atlas usage
- Set up automated backups
- Review and optimize queries

### Performance Optimization
- Monitor Core Web Vitals in Vercel
- Optimize images and assets
- Review and optimize API endpoints

## Support

If you encounter issues:
1. Check Vercel documentation
2. Review MongoDB Atlas documentation
3. Check GitHub issues for common problems
4. Contact support if needed

---

**Congratulations!** Your Receipt Tracker application is now deployed and ready for use.
