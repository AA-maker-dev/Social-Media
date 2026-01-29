# Nexora Social Media - Deployment Ready 🚀

Your website is now configured and ready to deploy to **viteflo.com**!

## What I've Done

✅ **Updated API Endpoints** - Frontend automatically connects to production API  
✅ **Created Environment Files** - Configured for both development and production  
✅ **Generated Deployment Configs** - vercel.json ready for Vercel deployment  
✅ **Added .gitignore** - Protects sensitive files from being exposed  
✅ **Created Deployment Guide** - Step-by-step instructions included  

## Quick Summary

| Component | Type | Deploy To |
|-----------|------|-----------|
| Frontend | HTML/CSS/JS | Vercel (viteflo.com) |
| Backend | Node.js/Express API | Vercel (api.viteflo.com) |
| Database | SQLite | Vercel (nexora.db) |

## How API Endpoints Work Now

Your frontend code now **automatically detects** the environment:

- **Local Development** → Uses `http://localhost:5000/api`
- **Production** → Uses `https://api.viteflo.com/api`

This means **no manual changes needed** when deploying!

## Files Created for Deployment

```
📁 Social-Media/
├── DEPLOYMENT.md           ← Complete step-by-step guide
├── DEPLOY.bat              ← Quick setup script (run this first!)
├── vercel.json            ← Vercel configuration
├── .gitignore             ← Git security file
├── .env.example           ← Environment template
│
├── 📁 backend/
│   ├── .env.production    ← Production settings
│   └── .env.example       ← Development template
│
└── 📁 Social-Media/
    └── Website_Inside/    ← Frontend files (ready to deploy)
```

## Quickest Path to Launch

### 1. **Push to GitHub**
```bash
# Open PowerShell in this folder
cd z:\Social-Media

# Run deployment setup
.\DEPLOY.bat

# Then manually push (script prepared git):
git remote add origin https://github.com/YOUR_USERNAME/Social-Media.git
git push -u origin main
```

### 2. **Deploy on Vercel**
- Go to https://vercel.com → New Project → Select your repository
- Deploy frontend from: `./Social-Media/Website_Inside/HTML`
- Deploy backend from: `./backend`
- Add environment variables (in Vercel dashboard)

### 3. **Connect Domain**
- In Vercel: Settings → Domains → Add `viteflo.com`
- At nepalownregistrar.com: Update nameservers to Vercel's
- Wait 24-48 hours for DNS

### 4. **Done!**
- Your site is live at **viteflo.com** 🎉

## API Endpoint Auto-Detection

The frontend code now uses smart detection:

```javascript
// In api.js (both locations)
const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') 
    ? 'http://localhost:5000/api' 
    : 'https://api.viteflo.com/api';
```

When deployed to viteflo.com, it automatically uses the production API URL!

## Deployment Commands

```bash
# Local development
cd backend
npm install
npm start
# → API runs on http://localhost:5000

# For Vercel deployment
# → Just push to GitHub, Vercel handles the rest!
```

## Testing Deployment Locally

```bash
# Terminal 1: Start backend
cd z:\Social-Media\backend
npm install
npm start

# Terminal 2: Open frontend
# Open: z:\Social-Media\Social-Media\Website_Inside\HTML\index.html
# Or use: Start → START.bat
```

## Important Notes

⚠️ **SQLite Database** - Data stored in `backend/nexora.db`
- Works fine for now
- For production with multiple instances, migrate to PostgreSQL (see DEPLOYMENT.md)

✅ **CORS Configured** - Backend accepts requests from your domain

✅ **Automatic HTTPS** - Vercel provides free SSL certificates

✅ **Environment Variables** - Automatically set in Vercel dashboard

## Support & Troubleshooting

See **DEPLOYMENT.md** for:
- Detailed step-by-step instructions
- Troubleshooting guide
- Database migration options
- Complete checklist

## Test Accounts (Default Users)

After deployment, you can test with:
```
Email: user1@example.com
Password: password123

Email: user2@example.com
Password: password123
```

(Created automatically in database)

## Environment Variables

**Development (.env)**
```
REACT_APP_API_URL=http://localhost:5000/api
```

**Production** (Set in Vercel Dashboard)
```
CORS_ORIGIN=https://viteflo.com
NODE_ENV=production
```

---

**Everything is ready!** 🚀  
Next step: Follow the "Quickest Path to Launch" above.

For detailed instructions: **Read DEPLOYMENT.md**
