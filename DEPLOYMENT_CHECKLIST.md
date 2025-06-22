# Deployment Checklist - Receipt Tracker

Use this checklist to ensure a successful deployment to Vercel.

## ✅ Pre-Deployment Checklist

### Code Preparation
- [x] Git repository initialized
- [x] All files committed to Git
- [x] Build passes successfully (`npm run build`)
- [x] ESLint configuration updated for production
- [x] Vercel configuration file created (`vercel.json`)
- [x] Environment variables template created

### Documentation
- [x] README.md with project overview
- [x] DEPLOYMENT.md with step-by-step guide
- [x] Environment variables documented
- [x] API endpoints documented

### Configuration Files
- [x] `package.json` with correct scripts
- [x] `next.config.js` properly configured
- [x] `vercel.json` without environment variable references
- [x] `.gitignore` updated to exclude sensitive files

## 🚀 Deployment Steps

### 1. GitHub Setup
- [ ] Create GitHub repository
- [ ] Push code to GitHub:
  ```bash
  git remote add origin https://github.com/YOUR_USERNAME/receipt-tracker.git
  git branch -M main
  git push -u origin main
  ```

### 2. MongoDB Setup (if needed)
- [ ] MongoDB Atlas account created
- [ ] Database cluster created (free tier M0)
- [ ] Database user created with read/write permissions
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string obtained

### 3. Vercel Deployment
- [ ] Vercel account created/logged in
- [ ] Project imported from GitHub
- [ ] Environment variables configured:
  - [ ] `MONGODB_URI` - MongoDB connection string
  - [ ] `NEXTAUTH_SECRET` - Random secure string
  - [ ] `NEXTAUTH_URL` - Vercel app URL
- [ ] Deployment initiated

### 4. Post-Deployment
- [ ] Deployment successful (check Vercel dashboard)
- [ ] App URL obtained
- [ ] `NEXTAUTH_URL` updated with actual URL
- [ ] App redeployed with correct URL

## 🧪 Testing Checklist

### Basic Functionality
- [ ] App loads without errors
- [ ] Navigation works correctly
- [ ] No console errors in browser

### Camera Features
- [ ] Camera permission prompt appears
- [ ] Camera capture works on desktop
- [ ] Camera capture works on mobile
- [ ] Image preview displays correctly

### Receipt Management
- [ ] Receipt form accepts input
- [ ] Form validation works
- [ ] Receipt submission successful
- [ ] Receipts display in list
- [ ] Database connectivity confirmed

### Performance
- [ ] Page load times acceptable
- [ ] Images load properly
- [ ] Mobile responsiveness verified
- [ ] PWA features work (if applicable)

## 🔧 Environment Variables

Required for production:

| Variable | Source | Example |
|----------|--------|---------|
| `MONGODB_URI` | MongoDB Atlas | `mongodb+srv://user:pass@cluster.mongodb.net/receipts` |
| `NEXTAUTH_SECRET` | Generate random | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Vercel deployment | `https://your-app.vercel.app` |

## 🚨 Common Issues & Solutions

### Build Failures
- Check build logs in Vercel dashboard
- Verify all dependencies in package.json
- Ensure TypeScript types are correct

### Database Connection
- Verify MongoDB connection string format
- Check database user permissions
- Confirm network access settings (0.0.0.0/0)

### Camera Issues
- HTTPS required (Vercel provides this)
- Test on different browsers/devices
- Check browser permissions

### Environment Variables
- Set in Vercel dashboard, not in code
- Use "Production" environment
- Redeploy after changes

## 📱 Mobile Testing

Test on various devices:
- [ ] iPhone Safari
- [ ] Android Chrome
- [ ] iPad
- [ ] Different screen sizes

## 🎯 Success Criteria

Deployment is successful when:
- [ ] App loads without errors
- [ ] Camera capture works
- [ ] Receipts can be saved
- [ ] Database stores data correctly
- [ ] Mobile experience is smooth
- [ ] No critical console errors

## 📞 Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- Project README.md and DEPLOYMENT.md

---

**Note**: Keep this checklist handy during deployment and check off items as you complete them.
