# Deployment Guide for viteflo.com

## Quick Start

This guide explains how to deploy your Nexora Social Media application to viteflo.com using Vercel.

## Prerequisites

1. GitHub account
2. Vercel account (free at vercel.com)
3. Domain registered at nepalownregistrar.com (viteflo.com)

## Deployment Steps

### Step 1: Prepare Your Repository

Your code is already set up for deployment. The key changes made:

- ✅ API endpoints now auto-detect environment (localhost vs production)
- ✅ Frontend code automatically connects to `https://api.viteflo.com` in production
- ✅ Environment configuration files created
- ✅ .gitignore configured for safety

### Step 2: Push to GitHub

```bash
cd z:\Social-Media

# Initialize git (if not done)
git init
git add .
git commit -m "Initial commit - Ready for deployment"

# Add your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/Social-Media.git
git push -u origin main
```

### Step 3: Deploy Frontend on Vercel

1. Go to **https://vercel.com**
2. Click "New Project"
3. Select your GitHub repository "Social-Media"
4. **Configure:**
   - Framework: "Other"
   - Root Directory: `./Social-Media/Website_Inside/HTML`
   - Build Command: (leave empty - static site)
   - Output Directory: (leave empty)
5. Click "Deploy"
6. After deployment, note your Vercel URL (e.g., `social-media.vercel.app`)

### Step 4: Deploy Backend on Vercel

1. Go to **https://vercel.com**
2. Click "New Project"
3. Select your GitHub repository "Social-Media" again
4. **Configure:**
   - Framework: "Other"
   - Root Directory: `./backend`
   - Build Command: `npm install`
   - Start Command: `node server.js`
5. **Environment Variables** (add these in Vercel Dashboard):
   ```
   NODE_ENV=production
   CORS_ORIGIN=https://viteflo.com
   PORT=3001
   ```
6. Click "Deploy"
7. After deployment, note your backend URL (e.g., `backend-api.vercel.app`)

### Step 5: Update API Endpoints

Once your backend is deployed, update the frontend code:

**In your frontend JavaScript files** (api.js), replace:
```javascript
'https://api.viteflo.com/api'
```

With your actual Vercel backend URL:
```javascript
'https://YOUR-BACKEND-URL.vercel.app/api'
```

Then commit and push:
```bash
git add .
git commit -m "Update API endpoints to production"
git push
```

### Step 6: Connect Custom Domain

#### Connect Frontend Domain:

1. In **Vercel Dashboard** → Select your frontend project
2. Go to **Settings → Domains**
3. Click "Add Domain"
4. Enter `viteflo.com`
5. Choose "Nameserver" option
6. Copy the nameservers provided

#### Connect Backend Domain:

1. In **Vercel Dashboard** → Select your backend project
2. Go to **Settings → Domains**
3. Click "Add Domain"
4. Enter `api.viteflo.com`
5. Choose "Nameserver" option
6. Note the nameservers

#### Update DNS at nepalownregistrar.com:

1. Log in to **nepalownregistrar.com**
2. Go to your domain (viteflo.com)
3. Find **DNS Settings** or **Nameserver Settings**
4. Replace with Vercel nameservers (from step 5 above)
5. Save changes

**Note:** DNS propagation takes 24-48 hours. During this time:
- Your site may not be accessible
- Be patient, it will work!

### Step 7: Verify Deployment

After DNS propagates:

1. Visit `https://viteflo.com`
2. Try logging in with test credentials
3. Check browser console (F12) for any API errors
4. Verify API calls go to `api.viteflo.com`

## Troubleshooting

### API Connection Issues
- Check CORS settings in backend `server.js`
- Verify environment variables in Vercel
- Check browser console for specific errors
- Make sure API URL is correct in frontend code

### Database Issues
- SQLite database is stored in `/backend/nexora.db`
- For persistent data on Vercel, consider migrating to PostgreSQL
- See section below for database migration

### Domain Not Working
- Wait for DNS propagation (up to 48 hours)
- Check nameserver settings at nepalownregistrar.com
- Clear browser cache
- Try accessing with `https://` prefix

## Database Migration (Optional but Recommended)

For production use, consider migrating from SQLite to PostgreSQL:

1. Create PostgreSQL database (use Railway, Vercel Postgres, or Neon)
2. Update `backend/db.js` to use PostgreSQL connection
3. Update environment variables in Vercel
4. Migrate data from SQLite

Popular options for free/cheap PostgreSQL:
- **Vercel Postgres** (integrated with Vercel)
- **Neon** (free tier available)
- **Railway** (starts at $5/month)

## Production Checklist

- [ ] Code pushed to GitHub
- [ ] Frontend deployed on Vercel
- [ ] Backend deployed on Vercel
- [ ] Environment variables set in Vercel
- [ ] Custom domains configured
- [ ] DNS nameservers updated at nepalownregistrar.com
- [ ] DNS propagation complete (24-48 hours)
- [ ] Frontend loads at viteflo.com
- [ ] API calls work correctly
- [ ] Login/Signup functionality working
- [ ] Consider database migration for persistence

## Environment Variables Reference

**Backend (.env.production):**
```
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://viteflo.com
DATABASE_URL=./nexora.db
```

**Frontend (.env.local):**
```
REACT_APP_API_URL=https://api.viteflo.com/api
REACT_APP_BACKEND_URL=https://api.viteflo.com
```

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify DNS propagation at whatsmydns.net
4. Review CORS settings in backend

Good luck with your deployment! 🚀
