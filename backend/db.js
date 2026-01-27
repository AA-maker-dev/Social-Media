const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'nexora.db');

let db = null;

function initDatabase() {
    return new Promise((resolve, reject) => {
        db = new sqlite3.Database(DB_PATH, (err) => {
            if (err) {
                console.error('Database connection error:', err);
                reject(err);
            } else {
                console.log('Connected to SQLite database at', DB_PATH);
                createTables()
                    .then(() => resolve(db))
                    .catch(reject);
            }
        });
    });
}

function createTables() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Users table
            db.run(`
                CREATE TABLE IF NOT EXISTS users (
                    id TEXT PRIMARY KEY,
                    email TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    name TEXT NOT NULL,
                    username TEXT UNIQUE NOT NULL,
                    role TEXT DEFAULT 'customer',
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `, (err) => {
                if (err) console.error('Users table error:', err);
            });

            // Create indexes for users table
            db.run(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`, (err) => {
                if (err) console.error('Users email index error:', err);
            });
            
            db.run(`CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)`, (err) => {
                if (err) console.error('Users username index error:', err);
            });

            // Posts table
            db.run(`
                CREATE TABLE IF NOT EXISTS posts (
                    id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    caption TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    likes INTEGER DEFAULT 0,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                )
            `, (err) => {
                if (err) console.error('Posts table error:', err);
            });

            // Create indexes for posts table
            db.run(`CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id)`, (err) => {
                if (err) console.error('Posts user_id index error:', err);
            });
            
            db.run(`CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC)`, (err) => {
                if (err) console.error('Posts created_at index error:', err);
            });

            // Post Reactions table
            db.run(`
                CREATE TABLE IF NOT EXISTS post_reactions (
                    id TEXT PRIMARY KEY,
                    post_id TEXT NOT NULL,
                    reaction_type TEXT,
                    count INTEGER DEFAULT 0,
                    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
                )
            `, (err) => {
                if (err) console.error('Post reactions table error:', err);
            });

            // Create index for post reactions
            db.run(`CREATE INDEX IF NOT EXISTS idx_reactions_post_id ON post_reactions(post_id)`, (err) => {
                if (err) console.error('Post reactions index error:', err);
            });

            // Comments table
            db.run(`
                CREATE TABLE IF NOT EXISTS comments (
                    id TEXT PRIMARY KEY,
                    post_id TEXT NOT NULL,
                    user_id TEXT NOT NULL,
                    text TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                )
            `, (err) => {
                if (err) console.error('Comments table error:', err);
            });

            // Create indexes for comments table
            db.run(`CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id)`, (err) => {
                if (err) console.error('Comments post_id index error:', err);
            });
            
            db.run(`CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC)`, (err) => {
                if (err) console.error('Comments created_at index error:', err);
            });

            // Follows table
            db.run(`
                CREATE TABLE IF NOT EXISTS follows (
                    id TEXT PRIMARY KEY,
                    follower_id TEXT NOT NULL,
                    following_id TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(follower_id, following_id),
                    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
                    FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE
                )
            `, (err) => {
                if (err) console.error('Follows table error:', err);
            });

            // Create indexes for follows table
            db.run(`CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_id)`, (err) => {
                if (err) console.error('Follows follower index error:', err);
            });
            
            db.run(`CREATE INDEX IF NOT EXISTS idx_follows_following ON follows(following_id)`, (err) => {
                if (err) console.error('Follows following index error:', err);
                else resolve();
            });
        });
    });
}

function getDatabase() {
    return db;
}

function runAsync(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve({ id: this.lastID, changes: this.changes });
        });
    });
}

function getAsync(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

function allAsync(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows || []);
        });
    });
}

module.exports = {
    initDatabase,
    getDatabase,
    runAsync,
    getAsync,
    allAsync
};
