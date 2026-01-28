# 📌 QUICK REFERENCE CARD

## ⚡ 30-Second Start

```bash
# Terminal 1: Start Backend
cd d:\GithubProjects\EPP-project\Social-Media\backend
npm start

# Terminal 2: Open Frontend  
start d:\GithubProjects\EPP-project\Social-Media\Social-Media\Website_Inside\HTML\index.html

# Login with:
# Email: admin@nexora.com
# Password: Admin@123
```

---

## 📝 Files You Modified

| File | Change | Line |
|------|--------|------|
| `backend/.env` | Added `CORS_ORIGIN=*` | End |
| `backend/routes/posts.js` | Moved `/user/:user_id` before `/:id` | ~20-110 |
| `index.html` | Added CSS link | 7 |

---

## 🆘 Common Issues & Fixes

### Issue: "Cannot GET /api/posts"
```
✅ Fix: Start backend server (npm start in terminal 1)
```

### Issue: "Images not displaying"
```
✅ Fix: Browser cache - Ctrl+Shift+Delete and refresh
```

### Issue: "Can't login"
```
✅ Fix: Clear localStorage - F12 > Application > Clear
```

### Issue: "Database locked"
```
✅ Fix: Delete backend/nexora.db and restart npm start
```

---

## 🔗 Important URLs

| Resource | URL |
|----------|-----|
| Backend API | `http://localhost:5000` |
| Frontend | `file:///..../index.html` or browser localhost |
| GitHub | Your repository URL |

---

## 📚 Documentation Quick Links

```
START HERE:
  1. README_PRODUCTION.md ........... Full setup guide
  2. FIXES_SUMMARY.md .............. What was fixed
  3. COMPLETION_CHECKLIST.md ....... Full verification

HELPERS:
  4. START.bat ..................... Quick menu
  5. PUSH_TO_GITHUB.bat ............ Git push helper

DETAILED:
  6. MERGE_STATUS_REPORT.md ........ Technical details
  7. MERGE_FIXES_APPLIED.md ........ Implementation details
```

---

## 👤 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@nexora.com | Admin@123 |
| User | test@nexora.com | Test@123 |
| User | demo@nexora.com | Demo@123 |

---

## ✨ Feature Checklist (All Working ✅)

- [x] User Authentication
- [x] Post Creation
- [x] Image Upload
- [x] Reactions & Comments
- [x] Bookmarks & Share
- [x] User Profiles
- [x] Follow System
- [x] Admin Dashboard
- [x] Responsive Design
- [x] Data Persistence

---

## 🚀 To Deploy to GitHub

```bash
cd d:\GithubProjects\EPP-project\Social-Media
git add .
git commit -m "Post-merge fixes applied"
git push -u origin main
```

Or use: `PUSH_TO_GITHUB.bat`

---

## 📞 Need Help?

1. Check the `MERGE_FIXES_APPLIED.md` for technical details
2. Run `START.bat` for guided setup
3. Read `README_PRODUCTION.md` for comprehensive guide
4. Check browser console (F12) for errors

---

**✅ All fixes complete!** Your application is ready to use.

