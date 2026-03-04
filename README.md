# Viteflow Social Media Platform - Production Deployment Guide

## 🚀 Quick Deploy

### 1. Backend Setup
```bash
cd backend
npm install
npm start
```
API runs on: `http://localhost:5000`

### 2. Frontend
Open in browser: `Social-Media/Login/FrontEnd/login.html`

## 📋 System Requirements
- Node.js v14+
- Modern web browser
- 100MB disk space

## 🔧 Configuration

### Environment Variables (backend/.env)
```env
PORT=5000
CORS_ORIGIN=*
JWT_SECRET=your_production_secret
NODE_ENV=production
```

### Update Frontend API URL
Edit: `Social-Media/Website_Inside/JS/api.js`
```javascript
const API_BASE_URL = 'http://your-domain.com:5000';
```

## 📦 Deployment Options

### Option 1: Local/VPS
```bash
cd backend
npm install --production
npm start
```

### Option 2: Cloud Platforms

**Heroku:**
```bash
heroku create your-app-name
git push heroku main
```

**AWS/Azure/Google Cloud:**
- Push to Git repository
- Configure CI/CD pipeline
- Set environment variables
- Deploy container or Node.js app

**Docker:**
```dockerfile
FROM node:16
WORKDIR /app
COPY backend .
RUN npm install --production
EXPOSE 5000
CMD ["npm", "start"]
```

## 📊 Database

**Type:** SQLite3  
**Location:** `backend/viteflow.db` (auto-created)

For production, consider migrating to PostgreSQL:
- Update `db.js` to use `pg` instead of `sqlite3`
- Install: `npm install pg`

## 🔐 Security Checklist

- [ ] Change `JWT_SECRET` in `.env`
- [ ] Set `NODE_ENV=production`
- [ ] Update `CORS_ORIGIN` to your domain
- [ ] Enable HTTPS on your domain
- [ ] Set strong database password (if using external DB)
- [ ] Review and update authentication middleware
- [ ] Set up rate limiting
- [ ] Configure firewall rules

## 🌐 Domain Setup

1. **Purchase Domain** (if needed)
2. **Configure DNS:**
   - Point domain to your server IP
   - Update A record in DNS settings
3. **Update Frontend URL:**
   - Edit `Social-Media/Website_Inside/JS/api.js`
   - Change API_BASE_URL to: `https://your-domain.com/api`
4. **Set up HTTPS:**
   - Use Let's Encrypt for SSL
   - Configure reverse proxy (Nginx/Apache)

## 🛠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 5000 in use | Change PORT in `.env` |
| Database error | Delete `backend/viteflow.db` and restart |
| CORS errors | Update CORS_ORIGIN in `.env` |
| Static files not loading | Check file paths in HTML |

## 📈 Monitoring

```bash
# Check backend logs
tail -f logs/server.log

# Monitor database
sqlite3 backend/viteflow.db ".tables"

# Check Node process
ps aux | grep node
```

## 💾 Backup Strategy

```bash
# Backup database
cp backend/viteflow.db backup/viteflow_$(date +%Y%m%d).db

# Backup entire project
tar -czf backup/viteflow_$(date +%Y%m%d).tar.gz .
```

## 🚀 Production Checklist

- [ ] Backend running and accessible
- [ ] Frontend loads without errors
- [ ] Database initialized
- [ ] SSL/HTTPS configured
- [ ] Domain pointing to server
- [ ] Backups scheduled
- [ ] Monitoring enabled
- [ ] Error logging configured
- [ ] Rate limiting enabled
- [ ] Environment variables set

## 📞 Support

For issues:
1. Check backend logs: `npm start` output
2. Check browser console: F12 → Console tab
3. Verify API endpoint: `http://localhost:5000/api/health`
4. Check database: `backend/viteflow.db` exists

## 📝 Additional Notes

- Frontend uses localStorage for offline access
- All user data stored in SQLite3 database
- Static files served from Social-Media/ folder
- API runs separately from frontend
- CORS enabled by default

---

**Ready to deploy!** Start backend and open frontend to begin.
