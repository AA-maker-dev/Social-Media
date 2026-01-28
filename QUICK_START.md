# Quick Start Guide

## 🚀 Start Development Immediately

### 1️⃣ Backend Setup (2 minutes)
```bash
cd backend
npm install
npm start
```
✅ API runs on `http://localhost:5000`

### 2️⃣ Frontend Launch
Open this file in your browser:
```
Social-Media/Login/FrontEnd/login.html
```

### 3️⃣ Login/Signup
- Create a new account, OR
- Use any test credentials you create

### 4️⃣ Explore Features
- Create posts with images
- React with emojis
- Comment on posts
- Follow users
- Browse notifications

---

## 📁 Important File Locations

| What | Where |
|------|-------|
| **Main Feed** | `Social-Media/Website_Inside/HTML/index.html` |
| **User Profile** | `Social-Media/Website_Inside/HTML/profile.html` |
| **API Logic** | `Social-Media/Website_Inside/JS/api.js` |
| **Backend** | `backend/server.js` |
| **Database** | `backend/nexora.db` |
| **Styles** | `Social-Media/Website_Inside/CSS/` |

---

## 🛠️ Common Commands

```bash
# Start backend
cd backend && npm start

# Development mode (auto-reload)
cd backend && npm run dev

# Reset database
rm backend/nexora.db && npm start
```

---

## 🔧 Configuration

**Backend Port:** Edit `backend/package.json`  
**API URL:** Edit `Social-Media/Website_Inside/JS/api.js` (line 1)  
**Database:** Auto-created at `backend/nexora.db`

---

## 📚 Learn More

- Full guide: `README.md`
- API docs: `README.md` → API Endpoints section
- Troubleshooting: `README.md` → Troubleshooting section
- Production: `docs/README_PRODUCTION.md`

---

## ✅ System Check

- ✅ Backend: Express.js + SQLite3
- ✅ Frontend: Vanilla JS + Bootstrap CSS
- ✅ Auth: JWT tokens
- ✅ Storage: Browser localStorage
- ✅ Status: Ready to use!

---

**Last Updated:** January 28, 2026
