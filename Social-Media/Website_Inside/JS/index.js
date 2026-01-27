// ===============================================
// SESSION & AUTHENTICATION MANAGEMENT
// ===============================================

// Check if user is logged in (optional - does not redirect)
function checkUserSession() {
    const userSession = localStorage.getItem('userSession');
    if (!userSession) {
        return false;
    }
    return true;
}

// Update navbar based on login status
function updateNavbarAuth() {
    const isLoggedIn = checkUserSession();
    const authNavItem = document.getElementById('authNavItem');
    const logoutNavItem = document.getElementById('logoutNavItem');
    const adminNavItem = document.getElementById('adminNavItem');
    const session = getUserSession();
    const role = (session?.role || 'customer').toLowerCase();
    const isAdmin = role === 'admin';
    
    // Only show logout on profile page
    const isProfilePage = window.location.pathname.includes('profile.html');

    if (adminNavItem) {
        adminNavItem.style.display = isAdmin ? 'block' : 'none';
    }
    
    if (isLoggedIn && authNavItem && logoutNavItem) {
        authNavItem.style.display = 'none';
        logoutNavItem.style.display = isProfilePage ? 'block' : 'none';
    } else if (!isLoggedIn && authNavItem && logoutNavItem) {
        authNavItem.style.display = 'block';
        logoutNavItem.style.display = 'none';
    }
}

// Load user session data
function getUserSession() {
    try {
        const userSession = localStorage.getItem('userSession');
        return userSession ? JSON.parse(userSession) : null;
    } catch (e) {
        console.error('Error loading user session:', e);
        return null;
    }
}

// Logout function
function logout(event) {
    if (event) {
        event.preventDefault();
    }
    
    if (confirm('Are you sure you want to logout?')) {
        // Clear session
        localStorage.removeItem('userSession');
        localStorage.removeItem('rememberUser');
        
        // Redirect to login page
        window.location.href = '../../Login/FrontEnd/login.html';
    }
}

function ensureCorrectLanding() {
    const session = getUserSession();
    if (!session) return;
    const role = (session.role || 'customer').toLowerCase();
    const onIndex = window.location.pathname.endsWith('index.html');
    if (role === 'admin' && onIndex) {
        window.location.href = 'admin.html';
    }
}

// ===============================================
// FOLLOW/UNFOLLOW SYSTEM
// ===============================================

const FOLLOWERS_STORAGE_KEY = 'nexora_followers';
const FOLLOWING_STORAGE_KEY = 'nexora_following';

// Available users to follow
const availableUsers = [
    { id: 'user1', name: 'John Developer', username: '@johndev', avatar: 'https://media.istockphoto.com/id/1364917563/photo/businessman-smiling-with-arms-crossed-on-white-background.jpg?s=612x612&w=0&k=20&c=NtM9Wbs1DBiGaiowsxJY6wNCnLf0POa65rYEwnZymrM=', followers: '12.5K' },
    { id: 'user2', name: 'Sarah Designer', username: '@sarahdesign', avatar: 'https://media.istockphoto.com/id/2172317014/photo/happy-hispanic-man-working-on-laptop-at-home.jpg?s=612x612&w=0&k=20&c=9evc002hmjsuha6TiO8OftVTuZIE71Hr3qhmq8vRRH0=', followers: '8.2K' },
    { id: 'user3', name: 'Mike Tech', username: '@miketech', avatar: 'https://media.istockphoto.com/id/2025682392/photo/man-adult-caucasian-with-beard-and-eyeglasses-work-on-laptop-at-home.jpg?s=612x612&w=0&k=20&c=in_Ty2-lelhpQEDCFtOJhAnrDdueeHgZYpkT0zdL2Qw=', followers: '25.8K' },
    { id: 'user4', name: 'React Masters', username: '@reactmasters', avatar: 'https://media.istockphoto.com/id/1364917563/photo/businessman-smiling-with-arms-crossed-on-white-background.jpg?s=612x612&w=0&k=20&c=NtM9Wbs1DBiGaiowsxJY6wNCnLf0POa65rYEwnZymrM=', followers: '45K' },
    { id: 'user5', name: 'Web Dev Daily', username: '@webdevdaily', avatar: 'https://media.istockphoto.com/id/2172317014/photo/happy-hispanic-man-working-on-laptop-at-home.jpg?s=612x612&w=0&k=20&c=9evc002hmjsuha6TiO8OftVTuZIE71Hr3qhmq8vRRH0=', followers: '92K' },
    { id: 'user6', name: 'Code Tips', username: '@codetips', avatar: 'https://media.istockphoto.com/id/2025682392/photo/man-adult-caucasian-with-beard-and-eyeglasses-work-on-laptop-at-home.jpg?s=612x612&w=0&k=20&c=in_Ty2-lelhpQEDCFtOJhAnrDdueeHgZYpkT0zdL2Qw=', followers: '38K' },
];

// Get following
function getFollowing() {
    try {
        const raw = localStorage.getItem(FOLLOWING_STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

// Save following
function saveFollowing(following) {
    localStorage.setItem(FOLLOWING_STORAGE_KEY, JSON.stringify(following));
}

// Follow a user
function followUser(userId) {
    const following = getFollowing();
    const user = availableUsers.find(u => u.id === userId);
    
    if (user && !following.find(u => u.id === userId)) {
        following.push(user);
        saveFollowing(following);
        renderSuggestedUsersHome();
        return true;
    }
    return false;
}

// Unfollow a user
function unfollowUser(userId) {
    let following = getFollowing();
    following = following.filter(u => u.id !== userId);
    saveFollowing(following);
    renderSuggestedUsersHome();
}

// Check if following a user
function isFollowing(userId) {
    const following = getFollowing();
    return following.some(u => u.id === userId);
}

// Render suggested users in home page
function renderSuggestedUsersHome() {
    const container = document.getElementById('suggestedUsersHome');
    if (!container) return;
    
    const following = getFollowing();
    const followingIds = following.map(u => u.id);
    
    // Show users that are not being followed
    const suggestedUsers = availableUsers.filter(u => !followingIds.includes(u.id)).slice(0, 3);
    
    if (suggestedUsers.length === 0) {
        container.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--gray-color);"><p>You\'re following everyone!</p></div>';
    } else {
        container.innerHTML = suggestedUsers.map(user => `
            <div class="suggestion">
                <img src="${user.avatar}" alt="${user.name}" class="avatar-sm">
                <div style="flex: 1;">
                    <h5>${user.name}</h5>
                    <p><i class="fas fa-users" style="font-size: 10px; margin-right: 4px;"></i>${user.followers} followers · Suggested for you</p>
                </div>
                <button class="btn btn-small" onclick="followUser('${user.id}')">Follow</button>
            </div>
        `).join('');
    }
}


// ===============================================
// SIMPLIFIED JS FOR INDEX PAGE
// ===============================================

// Simplified JS for index page

// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Profile data sync
// Get user-specific profile storage key
function getUserProfileStorageKey(email) {
    return `nexora_profile_${email}`;
}

function getProfileStorageKey() {
    const userSession = getUserSession();
    if (userSession && userSession.email) {
        return getUserProfileStorageKey(userSession.email);
    }
    return 'nexora_profile_default';
}

const DEFAULT_AVATAR_URL = 'https://media.istockphoto.com/id/1485546774/photo/bald-man-smiling-at-camera-standing-with-arms-crossed.jpg?s=612x612&w=0&k=20&c=9vuq6HxeSZfhZ7Jit_2HPVLyoajffb7h_SbWssh_bME=';

function loadProfile() {
    try {
        const storageKey = getProfileStorageKey();
        const raw = localStorage.getItem(storageKey);
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        return null;
    }
}

function updateHomeProfile() {
    const profile = loadProfile();
    const userSession = getUserSession();
    
    const nameEl = document.getElementById('homeProfileName');
    const usernameEl = document.getElementById('homeProfileUsername');
    const followersEl = document.getElementById('homeFollowersCount');
    const followingEl = document.getElementById('homeFollowingCount');
    const postsEl = document.getElementById('homePostsCount');
    const postInput = document.getElementById('postInput');
    
    // Update posts count from actual posts
    const posts = loadPostsForHome();
    const postsCount = posts.length;
    
    if (profile) {
        if (nameEl) nameEl.textContent = profile.name || 'Tester';
        if (usernameEl) usernameEl.textContent = profile.username || '@admin';
        if (followersEl) followersEl.textContent = profile.followers || '2.5K';
        if (followingEl) followingEl.textContent = profile.following || '842';
        if (postsEl) postsEl.textContent = postsCount;
        if (postInput) {
            postInput.placeholder = `What's on your mind, ${profile.name || 'Tester'}? Share your thoughts...`;
        }
    } else if (userSession) {
        // Use session data if no profile yet
        if (nameEl) nameEl.textContent = userSession.name || 'User';
        if (usernameEl) usernameEl.textContent = userSession.username || '@user';
        if (followersEl) followersEl.textContent = '0';
        if (followingEl) followingEl.textContent = '0';
        if (postsEl) postsEl.textContent = postsCount;
        if (postInput) {
            postInput.placeholder = `What's on your mind, ${userSession.name || 'User'}? Share your thoughts...`;
        }
    }
    
    // Update avatars with profile picture
    const profilePicture = profile?.profilePicture || DEFAULT_AVATAR_URL;
    
    // Update sidebar avatar
    const sidebarAvatar = document.querySelector('.sidebar-card .user-profile .avatar');
    if (sidebarAvatar) {
        sidebarAvatar.src = profilePicture;
    }
    
    // Update post creator avatar
    const postCreatorAvatar = document.querySelector('.post-creator .avatar-sm');
    if (postCreatorAvatar) {
        postCreatorAvatar.src = profilePicture;
    }
}

// Helper function to load posts (accessible globally)
// ===============================================
// REACTIONS MANAGEMENT & DISPLAY
// ===============================================

function showReactionsBreakdown(reactions) {
    const reactionEmojiMap = {
        'like': { emoji: '👍', name: 'Like' },
        'love': { emoji: '❤️', name: 'Love' },
        'wow': { emoji: '😮', name: 'Wow' },
        'heartEyes': { emoji: '😍', name: 'Love It' },
        'party': { emoji: '🎉', name: 'Celebrate' },
        'fire': { emoji: '🔥', name: 'Fire' }
    };

    let modal = document.getElementById('reactions-modal');
    
    // Create modal if it doesn't exist
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'reactions-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;
        document.body.appendChild(modal);
    }

    // Build breakdown content
    let breakdownHtml = '';
    let totalCount = 0;
    
    Object.entries(reactions).forEach(([type, count]) => {
        if (count > 0) {
            const info = reactionEmojiMap[type] || { emoji: '👍', name: 'Like' };
            breakdownHtml += `
                <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #e1e8ed;">
                    <span style="font-size: 28px; margin-right: 15px; min-width: 40px;">${info.emoji}</span>
                    <div style="flex: 1;">
                        <div style="font-weight: 600; color: #14171a;">${info.name}</div>
                    </div>
                    <div style="font-size: 18px; font-weight: 600; color: #ff7f07; min-width: 40px; text-align: right;">${count}</div>
                </div>
            `;
            totalCount += count;
        }
    });

    if (!breakdownHtml) {
        breakdownHtml = '<p style="text-align: center; color: #657786; padding: 20px;">No reactions yet</p>';
    }

    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: 16px;
            padding: 24px;
            max-width: 400px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #e1e8ed; padding-bottom: 15px;">
                <h3 style="margin: 0; color: #14171a; font-size: 20px;">Reactions</h3>
                <button onclick="document.getElementById('reactions-modal').remove()" style="
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #657786;
                ">×</button>
            </div>
            <div style="color: #657786; font-size: 14px; margin-bottom: 15px;">
                Total: <strong style="color: #14171a;">${totalCount}</strong> reactions
            </div>
            ${breakdownHtml}
        </div>
    `;

    // Close modal on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Add fade-in animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    if (!document.querySelector('style[data-reactions-modal]')) {
        style.setAttribute('data-reactions-modal', 'true');
        document.head.appendChild(style);
    }
}

// ===============================================
// HELPER FUNCTIONS
// ===============================================

function loadPostsForHome() {
    try {
        const raw = localStorage.getItem('nexora_posts_v1');
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

// Listen for storage changes (when profile is updated from another tab/page)
window.addEventListener('storage', (e) => {
    if (e.key === PROFILE_STORAGE_KEY) {
        updateHomeProfile();
    }
});

// Also listen for custom event (when profile is updated in same tab)
window.addEventListener('profileUpdated', () => {
    updateHomeProfile();
});

// Update profile when page becomes visible (user returns from profile page)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        updateHomeProfile();
    }
});

// Update profile on page focus (when user switches back to this tab)
window.addEventListener('focus', () => {
    updateHomeProfile();
});

// Post creation with image upload, persistence, edit/delete, and actions
const STORAGE_KEY = 'nexora_posts_v1';

// IndexedDB setup for storing images
const DB_NAME = 'nexora_db';
const STORE_NAME = 'posts_store';

async function initIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };
    });
}

async function savePostToIndexedDB(post) {
    try {
        const db = await initIndexedDB();
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        await store.put(post);
    } catch (e) {
        console.warn('IndexedDB not available, falling back to localStorage:', e);
    }
}

async function loadPostsFromIndexedDB() {
    try {
        const db = await initIndexedDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.getAll();
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    } catch (e) {
        console.warn('IndexedDB not available:', e);
        return [];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    ensureCorrectLanding();
    // Update navbar authentication UI
    updateNavbarAuth();
    
    // Load and update profile data on page load
    updateHomeProfile();
    
    // Render suggested users in sidebar
    renderSuggestedUsersHome();
    
    const imageInput = document.getElementById('post-image');
    const thumbsContainer = document.getElementById('image-thumbs');
    const postBtn = document.getElementById('post-btn');
    const captionInput = document.getElementById('postInput') || document.getElementById('post-caption') || document.querySelector('.post-input');
    const postsContainer = document.getElementById('posts-container');
    const clearPostsBtn = document.getElementById('clear-posts');

    let selectedImages = []; // Data URLs
    let currentImageInput = imageInput; // Keep track of current input element
    
    // Debug logging
    console.log('Initializing post creation...');
    console.log('imageInput:', imageInput);
    console.log('currentImageInput:', currentImageInput);

    // Helper function to attach change listener to image input
    function attachImageInputListener(input) {
        if (!input) {
            console.warn('Cannot attach listener - input is null/undefined');
            return;
        }
        console.log('Attaching listener to input:', input);
        input.addEventListener('change', (e) => {
            console.log('File selected:', e.target.files);
            const files = Array.from(e.target.files || []);
            if (!files.length) return;
            const readers = files.map(file => fileToDataURL(file));
            Promise.all(readers).then(dataUrls => {
                console.log('Images loaded:', dataUrls.length);
                selectedImages.push(...dataUrls);
                renderThumbs();
            });
        });
    }

    // Attach initial listener
    attachImageInputListener(currentImageInput);

    // Close all post menus when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.post-menu-container')) {
            document.querySelectorAll('.post-menu-dropdown').forEach(dropdown => {
                dropdown.style.display = 'none';
            });
        }
    });

    // Load and render stored posts (with images from IndexedDB)
    let posts = loadPostsFromStorage();
    
    // Restore images from IndexedDB
    loadPostsFromIndexedDB().then(indexedDBPosts => {
        const indexedDBMap = {};
        indexedDBPosts.forEach(post => {
            indexedDBMap[post.id] = post.images;
        });
        
        // Merge images back into posts
        posts.forEach(post => {
            if (indexedDBMap[post.id]) {
                post.images = indexedDBMap[post.id];
            }
        });
        
        renderAllPosts(posts);
    }).catch(e => {
        console.error('Error loading posts from IndexedDB:', e);
        renderAllPosts(posts);
    });

    postBtn && postBtn.addEventListener('click', () => {
        try {
            console.log('Post button clicked');
            console.log('selectedImages.length:', selectedImages.length);
            console.log('caption:', captionInput?.value);
            const caption = (captionInput && captionInput.value || '').trim();
            if (!caption && selectedImages.length === 0) {
                alert('Please add a caption or image to post.');
                return;
            }

            const userSession = getUserSession();
            const post = {
                id: Date.now().toString(),
                caption: caption,
                images: selectedImages.slice(),
                likes: 0,
                shares: 0,
                bookmarked: false,
                time: new Date().toISOString(),
                reactions: {
                    like: 0,
                    love: 0,
                    wow: 0,
                    heartEyes: 0,
                    party: 0,
                    fire: 0
                },
                userReactions: {},
                author: userSession ? userSession.name : 'You',
                authorUsername: userSession ? userSession.username : '@user'
            };

            console.log('Creating post with', post.images.length, 'images');
            posts.unshift(post);
            savePostsToStorage(posts);
            renderPost(post, postsContainer, posts);
            
            // Dispatch event to update profile page if it's open
            console.log('Dispatching postsUpdated event');
            window.dispatchEvent(new Event('postsUpdated'));
            
            // Also update posts count on home page
            updateHomeProfile();

            // reset
            selectedImages = [];
            renderThumbs();
            if (captionInput) captionInput.value = '';
            console.log('Resetting file input');
            // Reset file input - create a new input element to allow same file selection
            if (currentImageInput) {
                console.log('Old input:', currentImageInput);
                const newInput = currentImageInput.cloneNode(true);
                currentImageInput.parentNode.replaceChild(newInput, currentImageInput);
                currentImageInput = newInput;
                console.log('New input:', currentImageInput);
                attachImageInputListener(currentImageInput);
            } else {
                console.warn('currentImageInput is null/undefined during reset');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Error posting: ' + error.message);
        }
    });

    clearPostsBtn && clearPostsBtn.addEventListener('click', () => {
        if (!confirm('Clear all posts? This cannot be undone locally.')) return;
        localStorage.removeItem(STORAGE_KEY);
        posts.length = 0;
        postsContainer.innerHTML = '';
    });

    function renderThumbs() {
        if (!thumbsContainer) return;
        thumbsContainer.innerHTML = '';
        if (!selectedImages.length) {
            thumbsContainer.style.display = 'none';
            return;
        }
        thumbsContainer.style.display = 'block';
        const row = document.createElement('div');
        row.className = 'image-thumbs-row';
        selectedImages.forEach((dataUrl, idx) => {
            const t = document.createElement('div');
            t.className = 'thumb';
            t.innerHTML = `<img src="${dataUrl}" alt="thumb"><button class="thumb-remove" data-index="${idx}"><i class="fas fa-times"></i></button>`;
            row.appendChild(t);
        });
        thumbsContainer.appendChild(row);

        // attach remove handlers
        thumbsContainer.querySelectorAll('.thumb-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                const i = parseInt(btn.getAttribute('data-index'));
                if (!isNaN(i)) {
                    selectedImages.splice(i, 1);
                    renderThumbs();
                }
            });
        });
    }

    function fileToDataURL(file) {
        return new Promise((res, rej) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    // Create canvas and resize image aggressively
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    
                    // More aggressive sizing
                    const maxWidth = 600;
                    const maxHeight = 600;
                    
                    if (width > height) {
                        if (width > maxWidth) {
                            height = Math.round((height * maxWidth) / width);
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width = Math.round((width * maxHeight) / height);
                            height = maxHeight;
                        }
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Convert to data URL with aggressive compression (0.5 quality)
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.5);
                    res(dataUrl);
                };
                img.onerror = rej;
                img.src = e.target.result;
            };
            reader.onerror = rej;
            reader.readAsDataURL(file);
        });
    }

    // Storage helpers (inside DOMContentLoaded scope)
    function loadPostsFromStorage() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            const posts = raw ? JSON.parse(raw) : [];
            // Migrate old posts to have reactions object
            posts.forEach(post => {
                if (!post.reactions) {
                    post.reactions = {
                        like: 0,
                        love: 0,
                        wow: 0,
                        heartEyes: 0,
                        party: 0,
                        fire: 0
                    };
                }
                // Migrate from old single-user reaction to multi-user
                if (!post.userReactions) {
                    post.userReactions = {};
                }
                if (!post.author) {
                    post.author = 'You';
                    post.authorUsername = userSession ? userSession.username : '@user';
                }
            });
            return posts;
        } catch (e) {
            return [];
        }
    }

    function savePostsToStorage(postsArr) {
        try {
            // Store post metadata in localStorage (without images)
            const postsForStorage = postsArr.map(post => ({
                ...post,
                images: [] // Don't store images in localStorage
            }));
            
            const jsonString = JSON.stringify(postsForStorage);
            localStorage.setItem(STORAGE_KEY, jsonString);
            
            // Store full posts with images in IndexedDB
            postsArr.forEach(post => {
                if (post.images && post.images.length > 0) {
                    savePostToIndexedDB(post);
                }
            });
            
            // Dispatch event to update profile page if it's open
            window.dispatchEvent(new Event('postsUpdated'));
        } catch (e) {
            console.error('Error saving posts to storage:', e);
            if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                alert('Storage quota exceeded. Please clear your browser storage or use fewer/smaller images.');
            } else {
                alert('Error saving post: ' + e.message);
            }
            throw e;
        }
    }

    // Rendering
    function renderAllPosts(postsArr) {
        postsContainer.innerHTML = '';
        // Sort posts by time (newest first)
        const sortedPosts = [...postsArr].sort((a, b) => {
            const timeA = new Date(a.time || 0).getTime();
            const timeB = new Date(b.time || 0).getTime();
            return timeB - timeA; // Descending order (newest first)
        });
        sortedPosts.forEach(post => renderPost(post, postsContainer, postsArr));
    }

    function renderPost(post, container, postsArr) {
        const postEl = document.createElement('div');
        postEl.className = 'post';
        postEl.dataset.id = post.id;

        // Get profile picture for avatar
        const profile = loadProfile();
        const profilePicture = (profile && profile.profilePicture) ? profile.profilePicture : DEFAULT_AVATAR_URL;

        const header = document.createElement('div');
        header.className = 'post-header';
        const authorName = post.author || 'You';
        const authorUsername = post.authorUsername || (userSession ? userSession.username : '@user');
        header.innerHTML = `
            <img src="${profilePicture}" alt="User Avatar" class="avatar-sm">
            <div class="post-info">
                <h4>${authorName} <span style="color: #657786; font-weight: 400; font-size: 14px;">${authorUsername}</span></h4>
                <span class="post-time">${timeAgoShort(post.time)}</span>
            </div>
            <div class="post-menu-container" style="position: relative;">
                <button class="post-menu-btn" title="More options">
                    <i class="fas fa-ellipsis-v"></i>
                </button>
                <div class="post-menu-dropdown" style="display: none;">
                    <button class="post-menu-item post-edit">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="post-menu-item post-delete">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;

        const content = document.createElement('div');
        content.className = 'post-content';
        if (post.caption) content.innerHTML = `<p class="post-caption">${escapeHtml(post.caption)}</p>`;

        if (post.images && post.images.length) {
            post.images.forEach(src => {
                const img = document.createElement('img');
                img.className = 'post-image';
                img.src = src;
                content.appendChild(img);
            });
        }

        const stats = document.createElement('div');
        stats.className = 'post-stats';
        
        // Build reactions and shares display with breakdown
        let reactionsCount = '0 reactions';
        if (post.reactions && Object.keys(post.reactions).length > 0) {
            const reactionEmojis = { 
                'like': '👍', 
                'love': '❤️', 
                'wow': '😮',
                'heartEyes': '😍',
                'party': '🎉',
                'fire': '🔥'
            };
            const totalReactions = Object.values(post.reactions).reduce((a, b) => a + b, 0);
            
            if (totalReactions > 0) {
                let uniqueReactions = [];
                let breakdownText = '';
                Object.entries(post.reactions).forEach(([type, count]) => {
                    if (count > 0) {
                        uniqueReactions.push(reactionEmojis[type] || '👍');
                        const reactionNames = {
                            'like': 'Like',
                            'love': 'Love',
                            'wow': 'Wow',
                            'heartEyes': 'Love It',
                            'party': 'Celebrate',
                            'fire': 'Fire'
                        };
                        breakdownText += `${reactionEmojis[type]} ${count} ${reactionNames[type]}\n`;
                    }
                });
                
                let badgesHtml = uniqueReactions.slice(0, 3).map(emoji => 
                    `<span class="reaction-badge">${emoji}</span>`
                ).join('');
                
                reactionsCount = `
                    <div class="reactions-display" title="${breakdownText.trim()}" data-post-id="${post.id}">
                        ${badgesHtml}
                        <span class="reactions-label">${totalReactions} ${totalReactions === 1 ? 'reaction' : 'reactions'}</span>
                    </div>
                `;
            }
        }
        
        stats.innerHTML = `
            <div class="stats-left">${reactionsCount}</div>
            <div class="stats-right">
                <i class="fas fa-paper-plane"></i> ${post.shares} shares
            </div>
        `;

        const actions = document.createElement('div');
        actions.className = 'post-actions';
        actions.innerHTML = `
            <div class="reaction-picker-container">
                <button class="action-like action-btn"><i class="far fa-thumbs-up"></i> Like</button>
                <div class="reaction-picker-panel">
                    <button class="reaction-picker-btn" data-reaction="like" title="Like">👍</button>
                    <button class="reaction-picker-btn" data-reaction="love" title="Love">❤️</button>
                    <button class="reaction-picker-btn" data-reaction="wow" title="Wow">😮</button>
                    <button class="reaction-picker-btn" data-reaction="heartEyes" title="Love It">😍</button>
                    <button class="reaction-picker-btn" data-reaction="party" title="Celebrate">🎉</button>
                    <button class="reaction-picker-btn" data-reaction="fire" title="Fire">🔥</button>
                </div>
            </div>
            <button class="action-bookmark action-btn">${post.bookmarked ? '<i class="fas fa-bookmark"></i> Bookmarked' : '<i class="far fa-bookmark"></i> Bookmark'}</button>
            <button class="action-share action-btn"><i class="far fa-paper-plane"></i> Share</button>
        `;

        postEl.appendChild(header);
        postEl.appendChild(content);
        postEl.appendChild(stats);
        postEl.appendChild(actions);

        container.insertAdjacentElement('afterbegin', postEl);

        // handlers
        const likeBtn = postEl.querySelector('.action-like');
        const bookmarkBtn = postEl.querySelector('.action-bookmark');
        const shareBtn = postEl.querySelector('.action-share');
        const deleteBtn = postEl.querySelector('.post-delete');
        const editBtn = postEl.querySelector('.post-edit');
        const menuBtn = postEl.querySelector('.post-menu-btn');
        const menuDropdown = postEl.querySelector('.post-menu-dropdown');
        const menuContainer = postEl.querySelector('.post-menu-container');
        const reactionContainer = postEl.querySelector('.reaction-picker-container');
        const reactionPanel = postEl.querySelector('.reaction-picker-panel');
        const reactionBtns = postEl.querySelectorAll('.reaction-picker-btn');

        // Initialize reactions object if not exists
        if (!post.reactions) {
            post.reactions = { 'like': 0, 'love': 0, 'wow': 0, 'heartEyes': 0, 'party': 0, 'fire': 0 };
        }

        // Reaction emoji map - All positive emojis only
        const reactionEmojis = { 
            'like': '👍', 
            'love': '❤️', 
            'wow': '😮',
            'heartEyes': '😍',
            'party': '🎉',
            'fire': '🔥'
        };

        // Mobile long-press detection
        let touchStartTime = 0;
        const longPressDuration = 500;

        // Show reaction panel on hover (desktop)
        reactionContainer.addEventListener('mouseenter', () => {
            reactionPanel.classList.add('show');
        });

        reactionContainer.addEventListener('mouseleave', () => {
            reactionPanel.classList.remove('show');
        });

        // Long-press detection for mobile
        likeBtn.addEventListener('touchstart', () => {
            touchStartTime = Date.now();
        });

        likeBtn.addEventListener('touchend', (e) => {
            const touchDuration = Date.now() - touchStartTime;
            if (touchDuration >= longPressDuration) {
                e.preventDefault();
                reactionPanel.classList.add('show');
            }
        });

        // Handle reaction selection
        reactionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const reactionType = btn.dataset.reaction;
                const reactionEmojisMap = { 'like': '👍', 'love': '❤️', 'wow': '😮', 'heartEyes': '😍', 'party': '🎉', 'fire': '🔥' };
                
                // Animate the emoji flying up (Facebook style)
                const emoji = reactionEmojisMap[reactionType];
                animateEmojiPop(btn, emoji);
                
                // Add button animation
                btn.classList.add('clicked');
                setTimeout(() => btn.classList.remove('clicked'), 600);

                // Pulse animation on like button
                likeBtn.style.animation = 'none';
                setTimeout(() => {
                    likeBtn.style.animation = 'buttonPulse 0.4s ease-out';
                }, 10);
                
                // Get current user's email to track their reaction
                const currentUser = getUserSession();
                const userEmail = currentUser ? currentUser.email : 'guest';
                const previousReaction = post.userReactions[userEmail];
                
                // Remove previous user reaction
                if (previousReaction && post.reactions[previousReaction] > 0) {
                    post.reactions[previousReaction]--;
                }

                // Add new reaction
                if (previousReaction !== reactionType) {
                    post.reactions[reactionType]++;
                    post.userReactions[userEmail] = reactionType;
                } else {
                    // Click same reaction again to remove it
                    delete post.userReactions[userEmail];
                }

                reactionPanel.classList.remove('show');
                saveAndRefresh(post.id);
            });
        });

        // Animate emoji pop effect
        function animateEmojiPop(sourceBtn, emoji) {
            const emojiEl = document.createElement('div');
            emojiEl.textContent = emoji;
            emojiEl.className = 'emoji-animation';
            
            const rect = sourceBtn.getBoundingClientRect();
            emojiEl.style.left = (rect.left + rect.width / 2) + 'px';
            emojiEl.style.top = (rect.top + rect.height / 2) + 'px';
            
            document.body.appendChild(emojiEl);
            
            // Remove after animation completes
            setTimeout(() => emojiEl.remove(), 1000);
        }

        // Like button - toggle first positive reaction (Like)
        likeBtn && likeBtn.addEventListener('click', (e) => {
            if (reactionPanel.classList.contains('show')) {
                e.preventDefault();
                return;
            }

            // Get current user's email to track their reaction
            const currentUser = getUserSession();
            const userEmail = currentUser ? currentUser.email : 'guest';
            const previousReaction = post.userReactions[userEmail];
            
            // Toggle like reaction
            if (previousReaction === 'like') {
                post.reactions['like']--;
                delete post.userReactions[userEmail];
            } else {
                // Remove previous reaction
                if (previousReaction && post.reactions[previousReaction] > 0) {
                    post.reactions[previousReaction]--;
                }
                post.reactions['like']++;
                post.userReactions[userEmail] = 'like';
            }

            reactionPanel.classList.remove('show');
            saveAndRefresh(post.id);
        });

        // Toggle menu dropdown
        menuBtn && menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // Close all other menus first
            document.querySelectorAll('.post-menu-dropdown').forEach(dropdown => {
                if (dropdown !== menuDropdown) {
                    dropdown.style.display = 'none';
                }
            });
            // Toggle current menu
            menuDropdown.style.display = menuDropdown.style.display === 'none' ? 'block' : 'none';
        });

        bookmarkBtn && bookmarkBtn.addEventListener('click', () => {
            post.bookmarked = !post.bookmarked;
            saveAndRefresh(post.id);
        });

        shareBtn && shareBtn.addEventListener('click', () => {
            post.shares = (post.shares || 0) + 1;
            saveAndRefresh(post.id);
            alert('Post shared (simulated)');
        });

        deleteBtn && deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            menuDropdown.style.display = 'none';
            if (!confirm('Delete this post?')) return;
            const i = postsArr.findIndex(p => p.id === post.id);
            if (i > -1) {
                postsArr.splice(i, 1);
                savePostsToStorage(postsArr);
                postEl.remove();
                // Update posts count on home page
                updateHomeProfile();
            }
        });

        editBtn && editBtn.addEventListener('click', () => {
            menuDropdown.style.display = 'none';
            if (content.classList.contains('editing')) return;
            content.classList.add('editing');
            const captionEl = content.querySelector('.post-caption');
            const current = captionEl ? captionEl.textContent : '';
            const ta = document.createElement('textarea');
            ta.value = current;
            content.insertBefore(ta, content.firstChild);
            if (captionEl) captionEl.style.display = 'none';

            const saveBtn = document.createElement('button');
            saveBtn.className = 'btn btn-small';
            saveBtn.textContent = 'Save';
            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'btn btn-small';
            cancelBtn.style.marginLeft = '6px';
            cancelBtn.textContent = 'Cancel';
            content.appendChild(saveBtn);
            content.appendChild(cancelBtn);

            saveBtn.addEventListener('click', () => {
                post.caption = ta.value.trim();
                saveAndRefresh(post.id);
                content.classList.remove('editing');
            });

            cancelBtn.addEventListener('click', () => {
                if (captionEl) captionEl.style.display = '';
                ta.remove();
                saveBtn.remove();
                cancelBtn.remove();
                content.classList.remove('editing');
            });
        });

        function saveAndRefresh(id) {
            const idx = postsArr.findIndex(p => p.id === id);
            if (idx > -1) postsArr[idx] = post;
            savePostsToStorage(postsArr);

            // Update reactions display
            const statsEl = postEl.querySelector('.post-stats');
            const totalReactions = Object.values(post.reactions).reduce((a, b) => a + b, 0);
            
            let reactionsContent = '0 reactions';
            if (totalReactions > 0) {
                let uniqueReactions = [];
                let breakdownText = '';
                const reactionEmojiDisplay = { 
                    'like': '👍', 
                    'love': '❤️', 
                    'wow': '😮',
                    'heartEyes': '😍',
                    'party': '🎉',
                    'fire': '🔥'
                };
                
                Object.entries(post.reactions).forEach(([type, count]) => {
                    if (count > 0) {
                        uniqueReactions.push(reactionEmojiDisplay[type] || '👍');
                        const reactionNames = {
                            'like': 'Like',
                            'love': 'Love',
                            'wow': 'Wow',
                            'heartEyes': 'Love It',
                            'party': 'Celebrate',
                            'fire': 'Fire'
                        };
                        breakdownText += `${reactionEmojiDisplay[type]} ${count} ${reactionNames[type]}\n`;
                    }
                });
                
                let badgesHtml = uniqueReactions.slice(0, 3).map(emoji => 
                    `<span class="reaction-badge">${emoji}</span>`
                ).join('');
                
                reactionsContent = `
                    <div class="reactions-display" title="${breakdownText.trim()}" style="cursor: pointer;">
                        ${badgesHtml}
                        <span class="reactions-label">${totalReactions} ${totalReactions === 1 ? 'reaction' : 'reactions'}</span>
                    </div>
                `;
            }

            statsEl.innerHTML = `
                <div class="stats-left">${reactionsContent}</div>
                <div class="stats-right">
                    <i class="fas fa-paper-plane"></i> ${post.shares} shares
                </div>
            `;
            
            // Add click handler to show detailed reactions breakdown
            const reactionsDisplay = statsEl.querySelector('.reactions-display');
            if (reactionsDisplay) {
                reactionsDisplay.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showReactionsBreakdown(post.reactions);
                });
            }

            // Update like button based on current user's reaction
            if (likeBtn) {
                const reactionEmojiDisplay = { 
                    'like': '👍', 
                    'love': '❤️', 
                    'wow': '😮',
                    'heartEyes': '😍',
                    'party': '🎉',
                    'fire': '🔥'
                };
                const currentUser = getUserSession();
                const userEmail = currentUser ? currentUser.email : 'guest';
                const userReaction = post.userReactions ? post.userReactions[userEmail] : null;
                
                if (userReaction) {
                    likeBtn.innerHTML = `${reactionEmojiDisplay[userReaction]} Unlike`;
                } else {
                    likeBtn.innerHTML = '<i class="far fa-thumbs-up"></i> Like';
                }
            }

            if (bookmarkBtn) bookmarkBtn.innerHTML = post.bookmarked ? '<i class="fas fa-bookmark"></i> Bookmarked' : '<i class="far fa-bookmark"></i> Bookmark';
            // caption refresh
            const cap = postEl.querySelector('.post-caption');
            if (cap) cap.innerHTML = escapeHtml(post.caption || '');
        }

    }

    function timeAgoShort(iso) {
        try {
            const diff = Date.now() - new Date(iso).getTime();
            const mins = Math.floor(diff / 60000);
            if (mins < 1) return 'just now';
            if (mins < 60) return `${mins}m`;
            const hrs = Math.floor(mins / 60);
            if (hrs < 24) return `${hrs}h`;
            const days = Math.floor(hrs / 24);
            return `${days}d`;
        } catch (e) {
            return '';
        }
    }

    function escapeHtml(text) {
        return (text || '').replace(/[&"'<>]/g, (m) => ({ '&': '&amp;', '"': '&quot;', "'": '&#39;', '<': '&lt;', '>': '&gt;' })[m]);
    }

});

// Keep chat setup if present in page
document.addEventListener('DOMContentLoaded', () => {
    const chatWindow = document.getElementById('chat-window');
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');

    if (!chatWindow || !messageInput || !sendBtn) return;

    const messages = [
        { sender: 'Maya', text: "Hey Abhi! How’s your project going?" },
        { sender: 'You', text: 'Pretty good, just working on Nexora 🚀' },
        { sender: 'Maya', text: "That’s awesome! Can’t wait to see it." }
    ];

    messages.forEach(msg => addMessage(msg.sender, msg.text));

    sendBtn.addEventListener('click', () => {
        const text = messageInput.value.trim();
        if (text !== '') {
            addMessage('You', text);
            messageInput.value = '';
            setTimeout(() => addMessage('Maya', 'Got it 👍'), 1000);
        }
    });

    function addMessage(sender, text) {
        const div = document.createElement('div');
        div.classList.add('message', sender === 'You' ? 'sent' : 'received');
        div.innerHTML = `<p><strong>${sender}:</strong> ${text}</p>`;
        chatWindow.appendChild(div);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }
});