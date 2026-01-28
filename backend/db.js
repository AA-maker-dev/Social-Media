const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

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
                    .then(() => seedDefaultUsers())
                    .then(() => resolve(db))
                    .catch(reject);
            }
        });
    });
}

async function seedDefaultUsers() {
    try {
        // Check if users already exist
        const existingUser = await getAsync('SELECT COUNT(*) as count FROM users');
        
        if (existingUser && existingUser.count > 0) {
            console.log('Database already seeded with users');
            return;
        }

        const bcryptRounds = 10;
        // Default avatar for all users until they upload their own
        const defaultAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default&scale=80&backgroundColor=c0aede';

        const users = [
            {
                id: uuidv4(),
                email: 'admin@nexora.com',
                password: await bcrypt.hash('Admin@123', bcryptRounds),
                name: 'Admin User',
                username: '@admin',
                role: 'admin',
                avatar: defaultAvatar,
                bio: 'System Administrator',
                location: 'San Francisco, CA',
                website: 'https://example.com'
            },
            {
                id: uuidv4(),
                email: 'test@nexora.com',
                password: await bcrypt.hash('Test@123', bcryptRounds),
                name: 'Test User',
                username: '@testuser',
                role: 'customer',
                avatar: defaultAvatar,
                bio: 'Testing the platform',
                location: 'New York, NY',
                website: ''
            },
            {
                id: uuidv4(),
                email: 'demo@nexora.com',
                password: await bcrypt.hash('Demo@123', bcryptRounds),
                name: 'Demo Account',
                username: '@demo',
                role: 'customer',
                avatar: defaultAvatar,
                bio: 'Demo user for testing',
                location: 'Boston, MA',
                website: ''
            }
        ];

        for (const user of users) {
            await runAsync(
                'INSERT INTO users (id, email, password, name, username, role, avatar, bio, location, website) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [user.id, user.email, user.password, user.name, user.username, user.role, user.avatar, user.bio, user.location, user.website]
            );
        }

        console.log('✅ Default test users created successfully');
    } catch (err) {
        if (err.message && err.message.includes('UNIQUE constraint failed')) {
            console.log('Users already exist, skipping seed');
        } else {
            console.error('Error seeding users:', err);
        }
    }
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
                    avatar TEXT,
                    bio TEXT,
                    location TEXT,
                    website TEXT,
                    cover_photo TEXT,
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
