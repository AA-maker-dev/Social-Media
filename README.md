# Nexora Social Media Platform

A full-stack social media application built with Express.js backend and vanilla JavaScript frontend.

## 🚀 Project Overview

Nexora is a feature-rich social media platform that allows users to:
- Create and manage posts with image uploads
- React to posts with emoji reactions (6 types)
- Comment on posts
- Bookmark favorite posts
- Manage user profiles
- Follow/unfollow other users
- View notifications and explore content
- Send messages to other users

## 📁 Project Structure

```
.
├── backend/                          # Node.js/Express backend API
│   ├── db.js                         # SQLite3 database initialization
│   ├── server.js                     # Express server configuration
│   ├── package.json                  # Backend dependencies
│   ├── routes/                       # API routes
│   │   ├── auth.js                   # Authentication (login/signup)
│   │   ├── users.js                  # User management
│   │   ├── posts.js                  # Post CRUD operations
│   │   └── comments.js               # Comment management
│   └── middleware/
│       ├── auth.js                   # JWT authentication middleware
│       └── errorHandler.js           # Error handling middleware
│
├── Social-Media/
│   ├── Login/                        # Login page
│   │   └── FrontEnd/
│   │       ├── login.html
│   │       ├── app.js
│   │       └── style.css
│   └── Website_Inside/               # Main application
│       ├── HTML/                     # HTML pages
│       │   ├── index.html            # Main feed
│       │   ├── profile.html          # User profile
│       │   ├── messages.html         # Messaging
│       │   ├── notifications.html    # Notifications
│       │   ├── explore.html          # Explore content
│       │   └── admin.html            # Admin dashboard
│       ├── CSS/                      # Stylesheets
│       │   ├── styles.css            # Global styles
│       │   ├── post-styles.css       # Post and reaction styles
│       │   ├── profile.css           # Profile page styles
│       │   ├── messages.css          # Messages styles
│       │   ├── notifications.css     # Notifications styles
│       │   ├── explore.css           # Explore page styles
│       │   └── home.css              # Home page styles
│       └── JS/                       # JavaScript modules
│           ├── index.js              # Main feed logic (1500+ lines)
│           ├── profile.js            # Profile management (1100+ lines)
│           ├── api.js                # Centralized API service
│           ├── messages.js           # Messaging functionality
│           ├── notifications.js      # Notifications handler
│           ├── explore.js            # Explore page logic
│           └── admin.js              # Admin dashboard
│
├── docs/                             # Documentation files
├── tests/                            # Test files and demos
├── scripts/                          # Helper scripts
├── archive/                          # Old/backup files
└── README.md                         # This file
```

## ⚙️ Setup & Installation

### Prerequisites
- **Node.js** v14+ and npm
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The API will run on `http://localhost:5000`

**Development mode** (with auto-reload):
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the login page:
```
Open: Social-Media/Login/FrontEnd/login.html
```

2. After login, the main app loads:
```
Social-Media/Website_Inside/HTML/index.html
```

3. The frontend uses **localStorage** for session management and data persistence.

## 🔐 Authentication

- User sessions are stored in `localStorage` with key: `userSession`
- JWT tokens are used for API authentication
- Session persists across page refreshes

**Test Credentials:**
- Create an account via the login page
- Credentials are stored securely in the database

## 🛢️ Database

**Type:** SQLite3  
**Location:** `backend/nexora.db`

**Tables:**
- `users` - User profiles
- `posts` - All posts with text and metadata
- `reactions` - Post reactions (6 emoji types)
- `comments` - Post comments
- `bookmarks` - User bookmarks
- `followers` - Follow relationships

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - User login
- `POST /api/auth/verify` - Verify JWT token

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `GET /api/users/:id/followers` - Get followers list
- `POST /api/users/:id/follow` - Follow user

### Posts
- `GET /api/posts` - Get all posts (with pagination)
- `POST /api/posts` - Create post
- `GET /api/posts/:id` - Get post details
- `PUT /api/posts/:id` - Edit post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/reactions` - Add reaction
- `POST /api/posts/:id/bookmark` - Bookmark post

### Comments
- `GET /api/posts/:postId/comments` - Get post comments
- `POST /api/posts/:postId/comments` - Add comment
- `DELETE /api/comments/:id` - Delete comment

### Health Check
- `GET /api/health` - API status

## ✨ Key Features

| Feature | Status | Details |
|---------|--------|---------|
| **Post Creation** | ✅ | Text and image uploads with thumbnails |
| **Image Handling** | ✅ | Base64 encoding, thumbnail preview |
| **Reactions** | ✅ | 6 emoji types with counters |
| **Comments** | ✅ | Nested comment threads |
| **Bookmarks** | ✅ | Save posts for later |
| **User Profiles** | ✅ | Profile info, bio, avatar, cover photo |
| **Follow System** | ✅ | Follow/unfollow with follower count |
| **Messages** | ✅ | Direct messaging between users |
| **Notifications** | ✅ | Real-time activity notifications |
| **Admin Dashboard** | ✅ | Moderation and analytics |
| **Responsive Design** | ✅ | Works on desktop and mobile |
| **Search/Explore** | ✅ | Discover users and content |

## 🔧 Configuration

### Backend Configuration (`.env`)
```env
PORT=5000
CORS_ORIGIN=*
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

### Frontend Configuration
- API Base URL: `http://localhost:5000` (hardcoded in `api.js`)
- Storage Strategy: Browser localStorage for offline-first approach

## 🐛 Troubleshooting

### Database Issues
```bash
# Reset database (warning: deletes all data)
rm backend/nexora.db
npm start
```

### Port Already in Use
```bash
# Change PORT in .env file or use:
PORT=3000 npm start
```

### CORS Errors
- Ensure backend is running on `http://localhost:5000`
- Check CORS_ORIGIN setting in `.env`

### Frontend Not Loading
- Clear browser cache and localStorage: `localStorage.clear()`
- Ensure all files are in correct directories
- Check browser console for JavaScript errors

## 📝 Development

### File Organization
- **HTML pages** → `Social-Media/Website_Inside/HTML/`
- **Stylesheets** → `Social-Media/Website_Inside/CSS/`
- **JavaScript** → `Social-Media/Website_Inside/JS/`
- **Backend code** → `backend/`

### Code Style
- ES6+ JavaScript with async/await
- Express.js for backend routing
- Vanilla JS (no frameworks) for frontend

### Dependencies

**Backend:**
- express (^4.18.2)
- sqlite3 (^5.1.6)
- bcryptjs (^3.0.3)
- jsonwebtoken (^9.0.3)
- cors (^2.8.5)
- body-parser (^1.20.2)
- express-validator (^7.3.1)
- uuid (^9.0.0)

**Development:**
- nodemon (^2.0.22)

## 🚀 Deployment

### Production Checklist
- [ ] Set environment variables in `.env`
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS
- [ ] Update CORS_ORIGIN with actual domain
- [ ] Use strong JWT secret
- [ ] Set up database backups
- [ ] Configure server with PM2 or similar

### Deploy to Cloud
1. Push code to GitHub
2. Deploy backend to Heroku/AWS/Azure
3. Update frontend API URL to deployed backend
4. Deploy frontend to GitHub Pages/Netlify/Vercel

## 📚 Documentation

Additional documentation available in `/docs/`:
- `MERGE_STATUS_REPORT.md` - System status report
- `CODE_FIXES_SUMMARY.md` - Recent fixes applied
- `README_PRODUCTION.md` - Production deployment guide

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make changes and test thoroughly
3. Commit: `git commit -m "Add feature: description"`
4. Push: `git push origin feature/my-feature`
5. Open a pull request

## 📄 License

ISC License - See package.json for details

## 📞 Support

For issues or questions:
1. Check existing documentation in `/docs/`
2. Review browser console for errors
3. Check terminal output for backend errors
4. Ensure all dependencies are installed

---

**Last Updated:** January 28, 2026  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
