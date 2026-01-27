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

            // Posts table
            db.run(`
                CREATE TABLE IF NOT EXISTS posts (
                    id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    caption TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    likes INTEGER DEFAULT 0,
                    FOREIGN KEY (user_id) REFERENCES users(id)
                )
            `, (err) => {
                if (err) console.error('Posts table error:', err);
            });

            // Post Reactions table
            db.run(`
                CREATE TABLE IF NOT EXISTS post_reactions (
                    id TEXT PRIMARY KEY,
                    post_id TEXT NOT NULL,
                    reaction_type TEXT,
                    count INTEGER DEFAULT 0,
                    FOREIGN KEY (post_id) REFERENCES posts(id)
                )
            `, (err) => {
                if (err) console.error('Post reactions table error:', err);
            });

            // Comments table
            db.run(`
                CREATE TABLE IF NOT EXISTS comments (
                    id TEXT PRIMARY KEY,
                    post_id TEXT NOT NULL,
                    user_id TEXT NOT NULL,
                    text TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (post_id) REFERENCES posts(id),
                    FOREIGN KEY (user_id) REFERENCES users(id)
                )
            `, (err) => {
                if (err) console.error('Comments table error:', err);
            });

            // Follows table
            db.run(`
                CREATE TABLE IF NOT EXISTS follows (
                    id TEXT PRIMARY KEY,
                    follower_id TEXT NOT NULL,
                    following_id TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(follower_id, following_id),
                    FOREIGN KEY (follower_id) REFERENCES users(id),
                    FOREIGN KEY (following_id) REFERENCES users(id)
                )
            `, (err) => {
                if (err) console.error('Follows table error:', err);
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
