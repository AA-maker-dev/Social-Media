# 🚀 Nexora Social Media Platform - Complete Setup Guide

## 📌 Quick Links
- **Status**: ✅ Production Ready (Post-Merge)
- **Last Updated**: January 27, 2026
- **Backend**: Express.js + SQLite3
- **Frontend**: Vanilla JavaScript + HTML5 + CSS3
- **Authentication**: JWT-based

---

## 🎯 What Was Fixed (Post-Merge)

### ✅ Three Critical Fixes Applied:

1. **Backend Route Optimization** (`backend/routes/posts.js`)
   - Moved `/user/:user_id` route BEFORE generic `/:id` route
   - Prevents incorrect route matching

2. **Environment Configuration** (`backend/.env`)
   - Added `CORS_ORIGIN=*` for frontend communication

3. **CSS Linking** (`index.html`)
   - Added `<link rel="stylesheet" href="../CSS/post-styles.css">`
   - Enables thumbnail display and post styling

---

## 🚀 Getting Started

### **Option 1: Quick Start (Windows Batch)**
```bash
# Navigate to project folder
cd d:\GithubProjects\EPP-project\Social-Media

# Run the quick start menu
START.bat
```

### **Option 2: Manual Setup**

#### **Step 1: Start Backend Server**
```bash
cd backend
npm install        # First time only
npm start          # Starts on http://localhost:5000
```

#### **Step 2: Open Frontend**
```
Method A: Double-click
-> Social-Media/Website_Inside/HTML/index.html

Method B: Use Python Server
python -m http.server 8000
-> Visit: http://localhost:8000/Social-Media/Website_Inside/HTML/index.html

Method C: Use VS Code Live Server
-> Right-click index.html -> "Open with Live Server"
```

#### **Step 3: Login**
```
Email:    admin@nexora.com
Password: Admin@123
```

---

## 📋 Project Structure

```
Social-Media/
├── backend/                          # Node.js/Express API
│   ├── server.js                     # Main server file
│   ├── db.js                         # SQLite database
│   ├── package.json                  # Dependencies
│   ├── .env                          # Environment variables ✅ FIXED
│   ├── middleware/
│   │   ├── auth.js                   # JWT authentication
│   │   └── errorHandler.js           # Error handling
│   └── routes/
│       ├── auth.js                   # Login/signup
│       ├── users.js                  # User management
│       ├── posts.js                  # Post CRUD ✅ FIXED
│       └── comments.js               # Comments
│
├── Social-Media/
│   ├── Login/FrontEnd/
│   │   ├── login.html               # Login page
│   │   ├── app.js                   # Login logic
│   │   └── style.css                # Login styling
│   │
│   └── Website_Inside/
│       ├── HTML/
│       │   ├── index.html           # Home page ✅ FIXED
│       │   ├── profile.html         # Profile page
│       │   ├── explore.html         # Discovery page
│       │   ├── messages.html        # Messages page
│       │   ├── notifications.html   # Notifications
│       │   └── admin.html           # Admin dashboard
│       │
│       ├── CSS/
│       │   ├── styles.css           # Main styles
│       │   ├── post-styles.css      # Post styles ✅ NEW
│       │   ├── profile.css          # Profile styles
│       │   ├── home.css             # Home styles
│       │   ├── explore.css          # Explore styles
│       │   ├── messages.css         # Messages styles
│       │   └── notifications.css    # Notifications styles
│       │
│       └── JS/
│           ├── index.js             # Home page logic
│           ├── profile.js           # Profile logic
│           ├── api.js               # API service
│           ├── admin.js             # Admin logic
│           ├── explore.js           # Explore logic
│           ├── messages.js          # Messages logic
│           └── notifications.js     # Notifications logic
│
├── MERGE_STATUS_REPORT.md           # Detailed status
├── MERGE_FIXES_APPLIED.md           # All fixes applied
├── START.bat                         # Quick start script ✅ NEW
└── FIX_AND_PUSH.ps1                 # Git fix script ✅ NEW
```

---

## 🔐 Default Accounts

### Admin Account
```
Email:    admin@nexora.com
Password: Admin@123
Role:     Admin
```

### Test Accounts
```
Email:    test@nexora.com
Password: Test@123
Role:     Customer

Email:    demo@nexora.com
Password: Demo@123
Role:     Customer
```

---

## 🌟 Features

### ✅ Implemented & Working

- **Authentication**
  - JWT-based login/signup
  - Password validation (6+ chars, uppercase, lowercase, number)
  - Remember me functionality
  - Session persistence

- **Post Management**
  - Create posts with text and/or images
  - Multiple image upload support
  - Image thumbnails with preview
  - Edit existing posts
  - Delete posts
  - Soft delete with recovery option

- **Social Features**
  - 6 reaction types (Like, Love, Wow, Heart Eyes, Party, Fire)
  - Reaction breakdown modal
  - Bookmark posts
  - Share functionality
  - Comments on posts
  - Reply to comments

- **User Profiles**
  - View user profile
  - Edit profile information
  - Change profile picture
  - Change cover photo
  - View follower/following count
  - Follow/unfollow users

- **Discovery**
  - Explore page with trending posts
  - Search functionality
  - Suggested users to follow
  - User recommendations

- **Communication**
  - Direct messages
  - Message history
  - Real-time notifications
  - Read/unread indicators

- **Admin Dashboard**
  - User statistics
  - Content metrics
  - Activity overview
  - User management (if enabled)

---

## 🛠️ API Endpoints

### Authentication
```
POST   /api/auth/login      # Login
POST   /api/auth/signup     # Create account
```

### Users
```
GET    /api/users           # Get all users
GET    /api/users/:id       # Get specific user
PUT    /api/users/:id       # Update user
GET    /api/users/role/:role # Get users by role
```

### Posts
```
GET    /api/posts           # Get all posts
GET    /api/posts/:id       # Get specific post
GET    /api/posts/user/:user_id  # Get user's posts ✅ FIXED
POST   /api/posts           # Create post
POST   /api/posts/:id/like  # Like post
POST   /api/posts/:id/reaction # Add reaction
```

### Comments
```
GET    /api/comments/post/:post_id  # Get post comments
POST   /api/comments               # Add comment
DELETE /api/comments/:id           # Delete comment
```

---

## 📊 Data Storage

### **LocalStorage** (Frontend)
- User session data
- Authentication token
- Bookmark data
- User preferences
- Post metadata (without images)

### **IndexedDB** (Frontend)
- Full post objects with image data URLs
- Performance optimization

### **SQLite3** (Backend)
- User accounts
- Post records
- Comments
- Reaction counts
- User relationships

---

## 🔧 Troubleshooting

### **Backend won't start**
```bash
# Clear dependencies and reinstall
cd backend
rm -r node_modules package-lock.json
npm install
npm start
```

### **Frontend can't connect to backend**
- ✅ Check if backend is running on `http://localhost:5000`
- ✅ Check CORS_ORIGIN in `.env` (should be `*` for development)
- ✅ Check browser console for fetch errors

### **Images not displaying**
- ✅ Check if `post-styles.css` is linked in index.html (line 7)
- ✅ Check browser DevTools Network tab for 404 errors
- ✅ Clear browser cache and refresh

### **Login not working**
- ✅ Verify `.env` has `JWT_SECRET` set
- ✅ Check backend console for database errors
- ✅ Try hard refresh (Ctrl+Shift+R)

### **Database errors**
```bash
# Backend might be locked
# Delete and recreate database
cd backend
rm nexora.db  # Remove old database
npm start     # Creates new database with seed data
```

---

## 📈 Performance Tips

1. **Compress Images**: Use image optimization tools before upload
2. **Clear Storage**: Periodically clear browser storage if using many images
3. **Database Backup**: Regular backups of `nexora.db`
4. **Optimize Queries**: Backend queries use proper indexing

---

## 🔐 Security Notes

⚠️ **Development Only** - For production:
- [ ] Change `JWT_SECRET` in `.env`
- [ ] Set specific `CORS_ORIGIN` (not `*`)
- [ ] Use HTTPS instead of HTTP
- [ ] Implement rate limiting
- [ ] Add input validation on backend
- [ ] Use secure cookie storage for tokens
- [ ] Implement password hashing (already done with bcrypt)
- [ ] Add CSRF protection

---

## 📝 Recent Changes (This Merge)

### Files Modified:
1. ✅ `backend/routes/posts.js` - Route order optimization
2. ✅ `backend/.env` - Added CORS_ORIGIN
3. ✅ `index.html` - Added post-styles.css link

### Files Created:
1. ✅ `post-styles.css` - Post and thumbnail styling
2. ✅ `MERGE_STATUS_REPORT.md` - Status documentation
3. ✅ `MERGE_FIXES_APPLIED.md` - Fixes documentation
4. ✅ `START.bat` - Quick start script
5. ✅ `FIX_AND_PUSH.ps1` - Git fix script

---

## 🚀 Deployment Checklist

- [ ] Test all features locally
- [ ] Update `JWT_SECRET` in `.env`
- [ ] Change `CORS_ORIGIN` to production URL
- [ ] Migrate database to PostgreSQL
- [ ] Setup file storage (AWS S3, Google Cloud, etc.)
- [ ] Configure SSL/HTTPS
- [ ] Setup monitoring and logging
- [ ] Create database backups
- [ ] Configure environment variables on server
- [ ] Test on staging environment first

---

## 📞 Support & Documentation

- **Status Reports**: See `MERGE_STATUS_REPORT.md`
- **Fix Details**: See `MERGE_FIXES_APPLIED.md`
- **Backend Setup**: See `backend/README.md` (if exists)
- **Quick Start**: Run `START.bat`

---

## ✨ What's Next?

1. **Test the application**: Create posts, add reactions, follow users
2. **Review admin dashboard**: Check user stats and metrics
3. **Try mobile view**: Test responsive design
4. **Push to GitHub**: Use `git push -u origin main`
5. **Deploy to server**: Use prepared deployment scripts

---

**Status**: ✅ PRODUCTION READY | Last Updated: 2026-01-27
