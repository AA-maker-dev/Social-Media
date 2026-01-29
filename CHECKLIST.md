# Deployment Checklist for viteflo.com

## Pre-Deployment ✅ READY

- [x] Frontend code updated with dynamic API endpoints
- [x] Backend configured for production
- [x] Environment variables configured
- [x] .gitignore created (protects .env and node_modules)
- [x] vercel.json created
- [x] CORS configured
- [x] Code is deployment-ready

## Deployment Phase (What YOU Need to Do)

### Phase 1: GitHub Setup
- [ ] Create GitHub account at https://github.com/signup
- [ ] Create new repository named "Social-Media"
- [ ] Run: `git remote add origin https://github.com/YOUR_USERNAME/Social-Media.git`
- [ ] Run: `git push -u origin main`
- [ ] Verify code appears on GitHub

### Phase 2: Frontend Deployment
- [ ] Go to https://vercel.com and sign in with GitHub
- [ ] Click "New Project"
- [ ] Select "Social-Media" repository
- [ ] **Project Settings:**
  - [ ] Framework: Choose "Other"
  - [ ] Root Directory: `./Social-Media/Website_Inside/HTML`
  - [ ] Build Command: (leave empty)
  - [ ] Install Command: (leave empty)
- [ ] Click "Deploy"
- [ ] Wait for deployment (2-5 minutes)
- [ ] **Save your frontend Vercel URL** (e.g., yourname-social-media.vercel.app)

### Phase 3: Backend Deployment
- [ ] Click "New Project" again in Vercel
- [ ] Select "Social-Media" repository again
- [ ] **Project Settings:**
  - [ ] Framework: Choose "Other"
  - [ ] Root Directory: `./backend`
  - [ ] Build Command: `npm install`
  - [ ] Start Command: `node server.js`
- [ ] Click "Environment Variables"
- [ ] Add these variables:
  - [ ] `NODE_ENV` = `production`
  - [ ] `CORS_ORIGIN` = `https://viteflo.com`
  - [ ] `PORT` = `3001`
- [ ] Click "Deploy"
- [ ] Wait for deployment (2-5 minutes)
- [ ] **Save your backend Vercel URL** (e.g., yourname-backend.vercel.app)

### Phase 4: Update Frontend with Backend URL
- [ ] Open your local code
- [ ] Find in files: `api.viteflo.com` in the production URLs
- [ ] Replace with your actual backend Vercel URL from Phase 3
- [ ] Commit and push:
  ```bash
  git add .
  git commit -m "Update backend API endpoint"
  git push
  ```
- [ ] Wait for Vercel to auto-redeploy

### Phase 5: Domain Configuration
- [ ] In Vercel Frontend Project → Settings → Domains
  - [ ] Click "Add Domain"
  - [ ] Enter: `viteflo.com`
  - [ ] Choose "Nameserver" option
  - [ ] **Copy the nameservers provided** (usually 4 entries)

- [ ] In Vercel Backend Project → Settings → Domains
  - [ ] Click "Add Domain"
  - [ ] Enter: `api.viteflo.com`
  - [ ] Choose "Nameserver" option
  - [ ] **Copy these nameservers too**

### Phase 6: DNS Update at nepalownregistrar.com
- [ ] Log in to nepalownregistrar.com
- [ ] Find your domain (viteflo.com)
- [ ] Go to DNS Settings or Nameserver Settings
- [ ] Replace existing nameservers with Vercel's:
  ```
  ns1.vercel-dns.com
  ns2.vercel-dns.com
  ns3.vercel-dns.com
  ns4.vercel-dns.com
  ```
- [ ] Save changes
- [ ] **Wait 24-48 hours for DNS to propagate**

### Phase 7: Verification
- [ ] After 24-48 hours, visit: https://viteflo.com
- [ ] Check if site loads
- [ ] Try logging in
- [ ] Open browser console (F12) → Network tab
- [ ] Verify API calls go to your backend domain
- [ ] Verify no "Mixed Content" errors

## Post-Deployment Testing

### Frontend Tests
- [ ] Homepage loads at viteflo.com
- [ ] CSS and images display correctly
- [ ] Navigation works
- [ ] Responsive design works on mobile

### Authentication Tests
- [ ] Login page loads
- [ ] Can log in with test user
- [ ] Can sign up new user
- [ ] JWT token stored in localStorage
- [ ] Redirects to dashboard after login

### API Tests
- [ ] Check Network tab in DevTools (F12)
- [ ] Verify API calls go to correct domain
- [ ] No CORS errors in console
- [ ] No "Mixed Content" warnings

### Database Tests
- [ ] Can create posts
- [ ] Can create comments
- [ ] Can follow users
- [ ] Data persists (doesn't disappear on refresh)

## Production Deployment Notes

### Current Setup
- Frontend: Static HTML/CSS/JS on Vercel CDN
- Backend: Node.js running on Vercel Serverless Functions
- Database: SQLite (file-based)
- Domain: viteflo.com via Vercel nameservers

### Database Persistence
⚠️ **Important**: SQLite in Vercel is not persistent across deployments.

Options:
1. **For Testing**: Current setup is fine (data resets on redeploy)
2. **For Production**: Migrate to PostgreSQL
   - Vercel Postgres
   - Railway PostgreSQL
   - Neon PostgreSQL

See DEPLOYMENT.md for migration guide.

### Performance Optimization (Optional)
- [ ] Enable Vercel Analytics
- [ ] Set up monitoring
- [ ] Consider caching for static assets
- [ ] Monitor API response times

## Troubleshooting Checklist

If something doesn't work:

### Site not loading
- [ ] Check if 24-48 hours have passed
- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Try in incognito/private mode
- [ ] Check DNS propagation: https://whatsmydns.net
- [ ] Verify nameservers in nepalownregistrar.com

### API connection errors
- [ ] Verify API URL is correct in frontend code
- [ ] Check Vercel backend logs
- [ ] Verify environment variables set in Vercel
- [ ] Check CORS settings in backend/server.js
- [ ] Try accessing backend URL directly in browser

### Login not working
- [ ] Check Network tab (F12) for API response
- [ ] Look for error messages in console
- [ ] Verify backend deployed successfully
- [ ] Check if test users exist in database

### Database issues
- [ ] Vercel resets SQLite on redeploy
- [ ] Migrate to PostgreSQL for persistence
- [ ] Check database connection in logs

## Success Indicators

Your deployment is successful when:

✅ viteflo.com loads in browser  
✅ Homepage displays correctly  
✅ Can log in and see dashboard  
✅ Can create posts and comments  
✅ API calls show in Network tab without CORS errors  
✅ Data persists (doesn't disappear on refresh)  
✅ No console errors related to API  
✅ HTTPS works (green lock icon)  

## Final Checklist

- [ ] Code pushed to GitHub
- [ ] Frontend deployed on Vercel
- [ ] Backend deployed on Vercel  
- [ ] Domain added to both Vercel projects
- [ ] Nameservers updated at nepalownregistrar.com
- [ ] DNS propagation complete
- [ ] All tests passing
- [ ] Ready for users!

---

**Estimated Time**: 2-3 days (including DNS propagation)  
**Actual Work Time**: 30-45 minutes

🚀 **You're ready to launch!**
