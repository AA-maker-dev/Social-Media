// ===============================================
// SESSION & AUTHENTICATION MANAGEMENT
// ===============================================

// Check if user is logged in
function checkUserSession() {
    const userSession = localStorage.getItem('userSession');
    if (!userSession) {
        // Redirect to login if no session
        window.location.href = '../../Login/FrontEnd/login.html';
        return false;
    }
    return true;
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
const PROFILE_STORAGE_KEY = 'nexora_profile_v1';
const DEFAULT_AVATAR_URL = 'https://media.istockphoto.com/id/1485546774/photo/bald-man-smiling-at-camera-standing-with-arms-crossed.jpg?s=612x612&w=0&k=20&c=9vuq6HxeSZfhZ7Jit_2HPVLyoajffb7h_SbWssh_bME=';

function loadProfile() {
    try {
        const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
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
        const sidebarAvatar = document.querySelector('.sidebar-card .user-profile .avatar');
        if (sidebarAvatar) {
            sidebarAvatar.src = profilePicture;
        }
        const postCreatorAvatar = document.querySelector('.post-creator .avatar-sm');
        if (postCreatorAvatar) {
            postCreatorAvatar.src = profilePicture;
        }
    }
}

// Helper function to load posts (accessible globally)
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
        // Also reload posts when page becomes visible
        const postsContainer = document.getElementById('posts-container');
        if (postsContainer) {
            const posts = loadPostsForHome();
            renderAllPostsGlobal(posts);
        }
    }
});

// Update profile on page focus (when user switches back to this tab)
window.addEventListener('focus', () => {
    updateHomeProfile();
    // Also reload posts when window regains focus
    const postsContainer = document.getElementById('posts-container');
    if (postsContainer) {
        const posts = loadPostsForHome();
        renderAllPostsGlobal(posts);
    }
});

// Post creation with image upload, persistence, edit/delete, and actions
const STORAGE_KEY = 'nexora_posts_v1';

// Global post rendering functions
function renderAllPostsGlobal(postsArr) {
    const postsContainer = document.getElementById('posts-container');
    if (!postsContainer) return;
    
    postsContainer.innerHTML = '';
    
    if (postsArr.length === 0) {
        postsContainer.innerHTML = '<div style="text-align: center; padding: 60px 20px; color: var(--gray-color);"><div style="font-size: 48px; margin-bottom: 16px;">📭</div><div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">No Posts Found</div><div style="font-size: 14px;">Try adjusting your search or filters!</div></div>';
        return;
    }
    
    const profile = loadProfile();
    const DEFAULT_AVATAR = 'https://media.istockphoto.com/id/1485546774/photo/bald-man-smiling-at-camera-standing-with-arms-crossed.jpg?s=612x612&w=0&k=20&c=9vuq6HxeSZfhZ7Jit_2HPVLyoajffb7h_SbWssh_bME=';
    const profilePicture = (profile && profile.profilePicture) ? profile.profilePicture : DEFAULT_AVATAR;
    
    // Sort posts by time (newest first)
    const sortedPosts = [...postsArr].sort((a, b) => {
        const timeA = new Date(a.time || 0).getTime();
        const timeB = new Date(b.time || 0).getTime();
        return timeB - timeA;
    });
    
    sortedPosts.forEach(post => renderPostGlobal(post, postsContainer, postsArr, profilePicture));
}

function renderPostGlobal(post, container, postsArr, profilePicture) {
    const DEFAULT_AVATAR = 'https://media.istockphoto.com/id/1485546774/photo/bald-man-smiling-at-camera-standing-with-arms-crossed.jpg?s=612x612&w=0&k=20&c=9vuq6HxeSZfhZ7Jit_2HPVLyoajffb7h_SbWssh_bME=';
    const avatar = profilePicture || DEFAULT_AVATAR;
    
    const postEl = document.createElement('div');
    postEl.className = 'post';
    postEl.dataset.id = post.id;

    const header = document.createElement('div');
    header.className = 'post-header';
    header.innerHTML = `
        <img src="${avatar}" alt="User Avatar" class="avatar-sm">
        <div class="post-info">
            <h4>You</h4>
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
    stats.innerHTML = `<span class="likes"><i class="fas fa-thumbs-up"></i> ${post.likes} likes</span><span class="shares"><i class="fas fa-paper-plane"></i> ${post.shares} shares</span>`;

    const actions = document.createElement('div');
    actions.className = 'post-actions';
    actions.innerHTML = `
        <button class="action-like action-btn">${post.likes ? '<i class="fas fa-thumbs-up"></i> Unlike' : '<i class="far fa-thumbs-up"></i> Like'}</button>
        <button class="action-bookmark action-btn">${post.bookmarked ? '<i class="fas fa-bookmark"></i> Bookmarked' : '<i class="far fa-bookmark"></i> Bookmark'}</button>
        <button class="action-share action-btn"><i class="far fa-paper-plane"></i> Share</button>
    `;

    postEl.appendChild(header);
    postEl.appendChild(content);
    postEl.appendChild(stats);
    postEl.appendChild(actions);

    // Add comments section
    const commentsSection = document.createElement('div');
    commentsSection.className = 'post-comments-section';
    commentsSection.style.display = 'none';
    
    const toggleCommentsBtn = document.createElement('button');
    toggleCommentsBtn.className = 'toggle-comments-btn';
    toggleCommentsBtn.textContent = `💬 ${post.comments?.length || 0} Comments`;
    
    const commentsContainer = document.createElement('div');
    commentsContainer.className = 'comments-container';
    
    const commentInputRow = document.createElement('div');
    commentInputRow.className = 'comment-input-row';
    
    const commentInput = document.createElement('textarea');
    commentInput.className = 'comment-input';
    commentInput.placeholder = 'Add a comment...';
    commentInput.rows = '1';
    
    const submitBtn = document.createElement('button');
    submitBtn.className = 'comment-submit-btn';
    submitBtn.textContent = 'Post';
    
    commentInputRow.appendChild(commentInput);
    commentInputRow.appendChild(submitBtn);
    
    commentsSection.appendChild(toggleCommentsBtn);
    commentsSection.appendChild(commentsContainer);
    commentsSection.appendChild(commentInputRow);
    
    postEl.appendChild(commentsSection);

    container.insertAdjacentElement('afterbegin', postEl);

    // handlers
    const likeBtn = postEl.querySelector('.action-like');
    const bookmarkBtn = postEl.querySelector('.action-bookmark');
    const shareBtn = postEl.querySelector('.action-share');
    const deleteBtn = postEl.querySelector('.post-delete');
    const editBtn = postEl.querySelector('.post-edit');
    const menuBtn = postEl.querySelector('.post-menu-btn');
    const menuDropdown = postEl.querySelector('.post-menu-dropdown');
    
    // Comment handlers
    const toggleCommentsBtn = postEl.querySelector('.toggle-comments-btn');
    const commentsSection = postEl.querySelector('.post-comments-section');
    const commentsContainer = postEl.querySelector('.comments-container');
    const submitCommentBtn = postEl.querySelector('.comment-submit-btn');
    const commentInputField = postEl.querySelector('.comment-input');

    // Render existing comments
    function renderComments() {
        commentsContainer.innerHTML = '';
        const comments = post.comments || [];
        if (comments.length === 0) {
            commentsContainer.innerHTML = '<div style="text-align: center; color: var(--gray-color); font-size: 12px; padding: 10px;">No comments yet. Be the first!</div>';
            return;
        }
        
        comments.forEach(comment => {
            const commentEl = document.createElement('div');
            commentEl.className = 'comment';
            commentEl.innerHTML = `
                <img src="${loadProfile()?.profilePicture || DEFAULT_AVATAR_URL}" alt="Avatar" class="avatar-sm" style="border-radius: 50%;">
                <div class="comment-content">
                    <div class="comment-author">${loadProfile()?.name || 'You'}</div>
                    <div class="comment-text">${escapeHtml(comment.text)}</div>
                    <div class="comment-time">${timeAgoShort(comment.time)}</div>
                </div>
            `;
            commentsContainer.appendChild(commentEl);
        });
    }

    renderComments();

    // Toggle comments visibility
    toggleCommentsBtn && toggleCommentsBtn.addEventListener('click', () => {
        commentsSection.style.display = commentsSection.style.display === 'none' ? 'block' : 'none';
        if (commentsSection.style.display === 'block') {
            renderComments();
        }
    });

    // Submit comment
    submitCommentBtn && submitCommentBtn.addEventListener('click', () => {
        const commentText = (commentInputField?.value || '').trim();
        if (!commentText) {
            showToast('💬 Please type a comment!', 'error', 1500);
            return;
        }

        if (!post.comments) post.comments = [];
        post.comments.push({
            text: commentText,
            time: new Date().toISOString()
        });

        saveAndRefreshGlobal(post.id, postsArr, postEl, post, likeBtn, bookmarkBtn);
        
        // Update comment button
        toggleCommentsBtn.textContent = `💬 ${post.comments.length} Comments`;
        
        // Clear input and re-render
        commentInputField.value = '';
        renderComments();
        showToast('✨ Comment posted!', 'success', 1500);
    });

    // Enter key to submit comment
    commentInputField && commentInputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submitCommentBtn.click();
        }
    });

    // Auto-resize textarea
    commentInputField && commentInputField.addEventListener('input', () => {
        commentInputField.style.height = 'auto';
        commentInputField.style.height = Math.min(commentInputField.scrollHeight, 100) + 'px';
    });
    
    // Toggle menu dropdown
    menuBtn && menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.post-menu-dropdown').forEach(dropdown => {
            if (dropdown !== menuDropdown) {
                dropdown.style.display = 'none';
            }
        });
        menuDropdown.style.display = menuDropdown.style.display === 'none' ? 'block' : 'none';
    });

    likeBtn && likeBtn.addEventListener('click', () => {
        post.likes = (post.likes || 0) + (post._liked ? -1 : 1);
        post._liked = !post._liked;
        saveAndRefreshGlobal(post.id, postsArr, postEl, post, likeBtn, bookmarkBtn);
        
        // Add animation to like button
        likeBtn.style.transform = 'scale(1.2)';
        setTimeout(() => { likeBtn.style.transform = 'scale(1)'; }, 200);
        
        // Show feedback
        if (post._liked) {
            showToast('❤️ You liked this post!', 'success', 1500);
        }
    });

    bookmarkBtn && bookmarkBtn.addEventListener('click', () => {
        post.bookmarked = !post.bookmarked;
        saveAndRefreshGlobal(post.id, postsArr, postEl, post, likeBtn, bookmarkBtn);
        
        // Add animation
        bookmarkBtn.style.transform = 'scale(1.2)';
        setTimeout(() => { bookmarkBtn.style.transform = 'scale(1)'; }, 200);
        
        // Show feedback
        showToast(post.bookmarked ? '🔖 Post saved!' : '🔖 Post removed from saved', 'success', 1500);
    });

    shareBtn && shareBtn.addEventListener('click', () => {
        post.shares = (post.shares || 0) + 1;
        saveAndRefreshGlobal(post.id, postsArr, postEl, post, likeBtn, bookmarkBtn);
        
        // Add animation
        shareBtn.style.transform = 'scale(1.2)';
        setTimeout(() => { shareBtn.style.transform = 'scale(1)'; }, 200);
        
        showToast('📤 Post shared!', 'success', 2000);
    });

    deleteBtn && deleteBtn.addEventListener('click', () => {
        menuDropdown.style.display = 'none';
        if (!confirm('Are you sure you want to delete this post?')) return;
        const i = postsArr.findIndex(p => p.id === post.id);
        if (i > -1) {
            postsArr.splice(i, 1);
            savePostsToStorage(postsArr);
            
            // Smooth deletion animation
            postEl.style.animation = 'slideUp 0.3s ease-out reverse';
            setTimeout(() => {
                postEl.remove();
                updateHomeProfile();
                showToast('🗑️ Post deleted successfully!', 'success', 2000);
            }, 300);
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
        ta.style.borderRadius = '8px';
        ta.style.padding = '10px';
        ta.style.borderColor = 'var(--primary-color)';
        content.insertBefore(ta, content.firstChild);
        if (captionEl) captionEl.style.display = 'none';

        const saveBtn = document.createElement('button');
        saveBtn.className = 'btn btn-small';
        saveBtn.textContent = '💾 Save';
        saveBtn.style.marginRight = '8px';
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'btn btn-small';
        cancelBtn.textContent = '✕ Cancel';
        content.appendChild(saveBtn);
        content.appendChild(cancelBtn);

        saveBtn.addEventListener('click', () => {
            post.caption = ta.value.trim();
            saveAndRefreshGlobal(post.id, postsArr, postEl, post, likeBtn, bookmarkBtn);
            content.classList.remove('editing');
            showToast('✏️ Post updated successfully!', 'success', 2000);
        });

        cancelBtn.addEventListener('click', () => {
            if (captionEl) captionEl.style.display = '';
            ta.remove();
            saveBtn.remove();
            cancelBtn.remove();
            content.classList.remove('editing');
        });
    });

    function saveAndRefreshGlobal(id, postsArr, postEl, post, likeBtn, bookmarkBtn) {
        const idx = postsArr.findIndex(p => p.id === id);
        if (idx > -1) postsArr[idx] = post;
        savePostsToStorage(postsArr);
        
        const updatedLikes = postEl.querySelector('.post-stats .likes') || postEl.querySelector('.likes');
        if (updatedLikes) updatedLikes.innerHTML = `<i class="fas fa-thumbs-up"></i> ${post.likes} likes`;
        if (likeBtn) likeBtn.innerHTML = post._liked ? '<i class="fas fa-thumbs-up"></i> Unlike' : '<i class="far fa-thumbs-up"></i> Like';
        if (bookmarkBtn) bookmarkBtn.innerHTML = post.bookmarked ? '<i class="fas fa-bookmark"></i> Bookmarked' : '<i class="far fa-bookmark"></i> Bookmark';
        
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

function savePostsToStorage(postsArr) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(postsArr));
    window.dispatchEvent(new Event('postsUpdated'));
}

function loadPostsFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

// ========== TOAST NOTIFICATION SYSTEM ==========
function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toast.style.animation = 'slideUp 0.3s ease-out';
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideDown 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

document.addEventListener('DOMContentLoaded', () => {
    // Check user session first
    checkUserSession();
    
    // Load and update profile data on page load
    updateHomeProfile();
    
    const imageInput = document.getElementById('post-image');
    const thumbsContainer = document.getElementById('image-thumbs');
    const postBtn = document.getElementById('post-btn');
    const captionInput = document.getElementById('post-caption') || document.querySelector('.post-input');
    const postsContainer = document.getElementById('posts-container');
    const clearPostsBtn = document.getElementById('clear-posts');

    let selectedImages = []; // Data URLs

    // Close all post menus when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.post-menu-container')) {
            document.querySelectorAll('.post-menu-dropdown').forEach(dropdown => {
                dropdown.style.display = 'none';
            });
        }
    });

    // Load and render stored posts
    const posts = loadPostsFromStorage();
    if (postsContainer) {
        if (posts.length === 0) {
            postsContainer.innerHTML = '<div style="text-align: center; padding: 60px 20px; color: var(--gray-color);"><div style="font-size: 48px; margin-bottom: 16px;">📭</div><div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">No Posts Yet</div><div style="font-size: 14px;">Be the first to post something amazing! 🚀</div></div>';
        } else {
            renderAllPosts(posts);
        }
    }

    imageInput && imageInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        const readers = files.map(file => fileToDataURL(file));
        Promise.all(readers).then(dataUrls => {
            selectedImages.push(...dataUrls);
            renderThumbs();
        });
    });

    postBtn && postBtn.addEventListener('click', () => {
        const caption = (captionInput && captionInput.value || '').trim();
        if (!caption && selectedImages.length === 0) {
            showToast('📝 Please add a caption or image to post.', 'error', 2000);
            return;
        }

        const post = {
            id: Date.now().toString(),
            caption: caption,
            images: selectedImages.slice(),
            likes: 0,
            shares: 0,
            bookmarked: false,
            comments: [],
            time: new Date().toISOString()
        };

        posts.unshift(post);
        savePostsToStorage(posts);
        renderPostGlobal(post, postsContainer, posts, loadProfile()?.profilePicture || DEFAULT_AVATAR_URL);
        
        // Dispatch event to update profile page if it's open
        console.log('Dispatching postsUpdated event');
        window.dispatchEvent(new Event('postsUpdated'));
        
        // Also update posts count on home page
        updateHomeProfile();

        // Reset
        selectedImages = [];
        renderThumbs();
        if (captionInput) captionInput.value = '';
        
        // Show success toast
        showToast('✨ Post published successfully!', 'success', 2500);
    });

    clearPostsBtn && clearPostsBtn.addEventListener('click', () => {
        if (!confirm('Clear all posts? This cannot be undone locally.')) return;
        localStorage.removeItem(STORAGE_KEY);
        posts.length = 0;
        postsContainer.innerHTML = '';
        showToast('🗑️ All posts cleared!', 'info', 2000);
    });

    // ========== FILTER FUNCTIONALITY ==========
    const filterSelect = document.getElementById('filterPosts');
    const clearFilterBtn = document.getElementById('clearFilter');

    function filterPosts() {
        const filterType = filterSelect?.value || 'all';
        
        let filtered = [...posts];

        // Filter by type
        if (filterType === 'liked') {
            filtered = filtered.filter(p => p._liked);
        } else if (filterType === 'bookmarked') {
            filtered = filtered.filter(p => p.bookmarked);
        }

        // Render filtered posts
        postsContainer.innerHTML = '';
        if (filtered.length === 0) {
            postsContainer.innerHTML = '<div style="text-align: center; padding: 40px 20px; color: var(--gray-color); font-size: 16px;">📭 No posts found!</div>';
            return;
        }

        filtered.forEach(post => {
            renderPostGlobal(post, postsContainer, posts, loadProfile()?.profilePicture || DEFAULT_AVATAR_URL);
        });
    }

    filterSelect && filterSelect.addEventListener('change', filterPosts);
    
    clearFilterBtn && clearFilterBtn.addEventListener('click', () => {
        if (filterSelect) filterSelect.value = 'all';
        renderAllPostsGlobal(posts);
        showToast('🔄 Filter cleared!', 'info', 1500);
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
            reader.onload = () => res(reader.result);
            reader.onerror = rej;
            reader.readAsDataURL(file);
        });
    }

    // Storage helpers (inside DOMContentLoaded scope)
    function loadPostsFromStorage() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    function savePostsToStorage(postsArr) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(postsArr));
        // Dispatch event to update profile page if it's open
        window.dispatchEvent(new Event('postsUpdated'));
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