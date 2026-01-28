# 📋 Project Reference Card

## 🎯 One-Minute Overview

**Nexora** is a complete social media platform:
- ✅ Full-stack (Node.js backend + Vanilla JS frontend)
- ✅ 12+ features (posts, reactions, comments, followers, messages)
- ✅ Organized structure (clean, professional)
- ✅ Ready to use (start in 2 minutes)

---

## 🚀 Quick Commands

```bash
# Start Backend (required first)
cd backend && npm install && npm start

# Open Frontend (in browser)
Social-Media/Login/FrontEnd/login.html
```

---

## 📁 Key Files/Folders

| Path | Purpose |
|------|---------|
| `backend/` | API Server (Express + SQLite3) |
| `Social-Media/Website_Inside/HTML/` | Web pages |
| `Social-Media/Website_Inside/JS/` | JavaScript logic |
| `Social-Media/Website_Inside/CSS/` | Stylesheets |
| `docs/` | All documentation |
| `tests/` | Test files |
| `scripts/` | Utility scripts |
| `archive/` | Old backups |

---

## 📖 Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Complete guide (start here!) |
| `QUICK_START.md` | 2-minute setup |
| `ORGANIZATION_SUMMARY.md` | What was organized |
| `VERIFICATION_COMPLETE.md` | Final status report |
| `docs/` folder | All references |

---

## 🔧 API Endpoints

```
Authentication:   /api/auth/login, /api/auth/signup
Users:           /api/users/:id, /api/users/:id/followers
Posts:           /api/posts, /api/posts/:id
Comments:        /api/posts/:postId/comments
Reactions:       /api/posts/:id/reactions
Bookmarks:       /api/posts/:id/bookmark
Health Check:    /api/health
```

---

## ✨ Main Features

| Feature | Status |
|---------|--------|
| Post Creation | ✅ |
| Image Upload | ✅ |
| Reactions (6 emoji) | ✅ |
| Comments | ✅ |
| Bookmarks | ✅ |
| User Profiles | ✅ |
| Follow System | ✅ |
| Messages | ✅ |
| Notifications | ✅ |
| Admin Dashboard | ✅ |
| Responsive Design | ✅ |
| Search/Explore | ✅ |

---

## 🗂️ File Structure

```
Nexora/
├── README.md                      ← Start here
├── QUICK_START.md                 ← 2-min setup
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── routes/
│   ├── middleware/
│   └── package.json
├── Social-Media/
│   └── Website_Inside/
│       ├── HTML/  (6 pages)
│       ├── CSS/   (7 styles)
│       └── JS/    (7 modules)
├── docs/          (13 guides)
├── tests/         (3 demos)
├── scripts/       (3 tools)
└── archive/       (backups)
```

---

## 💡 Common Tasks

### Create a Post
1. Open main feed
2. Click "Create Post"
3. Add text + image
4. Click "Post"

### Follow Someone
1. Go to Explore
2. Find user
3. Click "Follow"

### Check Reactions
1. Find post
2. See emoji count
3. Click to react

### View Messages
1. Click Messages tab
2. Select user
3. Type & send

---

## 🔗 Important URLs

```
Backend API:     http://localhost:5000
Frontend:        Social-Media/Website_Inside/HTML/index.html
Login Page:      Social-Media/Login/FrontEnd/login.html
Health Check:    http://localhost:5000/api/health
```

---

## 🛠️ Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| Backend won't start | `npm install` in backend folder |
| Port 5000 in use | Change PORT in backend/.env |
| Files not loading | Clear browser cache |
| Session lost | Check localStorage.getItem('userSession') |
| Database error | Delete backend/nexora.db, restart |

---

## 📊 Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Node.js, Express |
| Database | SQLite3 |
| Frontend | Vanilla JavaScript |
| Styling | CSS3 |
| Auth | JWT Tokens |
| Storage | Browser localStorage |

---

## ✅ Pre-Launch Checklist

- [ ] Backend running on localhost:5000
- [ ] Frontend opens in browser
- [ ] Can create account
- [ ] Can create post
- [ ] Can see reactions
- [ ] Can follow users
- [ ] Can send messages

---

## 📞 Help Resources

1. **Getting Started** → Read `README.md`
2. **Quick Setup** → Use `QUICK_START.md`
3. **API Details** → Check `README.md` API section
4. **Issues** → See `/docs/` folder
5. **Deployment** → See `/docs/README_PRODUCTION.md`

---

## 🎯 Next Steps

```
1. Read README.md (5 min)
2. Follow QUICK_START.md (2 min)
3. Start backend (1 min)
4. Open frontend (instant)
5. Create account (1 min)
6. Explore features (fun!)
```

---

## ⚡ Pro Tips

- Use **QUICK_START.md** for fastest setup
- Check `/docs/` for any questions
- Review `CODE_FIXES_SUMMARY.md` for recent changes
- All old files safely in `/archive/` (won't clutter your work)
- Backend logs will help debug issues

---

## 📌 Remember

✅ Everything is organized  
✅ No duplicates  
✅ Fully documented  
✅ Ready to use  
✅ Ready to deploy  

**You're ready to build!** 🚀

---

**Last Updated:** January 28, 2026  
**Status:** Ready for Development & Production
