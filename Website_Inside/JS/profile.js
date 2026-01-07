// Profile page interactive functionality

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

// Profile functionality
const STORAGE_KEY = 'nexora_profile_v1';
const POSTS_STORAGE_KEY = 'nexora_posts_v1';

// Default avatar URL
const DEFAULT_AVATAR_URL = 'https://media.istockphoto.com/id/1485546774/photo/bald-man-smiling-at-camera-standing-with-arms-crossed.jpg?s=612x612&w=0&k=20&c=9vuq6HxeSZfhZ7Jit_2HPVLyoajffb7h_SbWssh_bME=';

// Sample profile data
const defaultProfile = {
    name: 'Tester',
    username: '@admin',
    bio: 'Full-stack developer passionate about creating amazing user experiences. Building the future, one line of code at a time. 🚀',
    work: 'Full-stack Developer at Tech Corp',
    education: 'Computer Science, University of Technology',
    location: 'San Francisco, CA',
    website: 'www.example.com',
    joined: 'January 2023',
    followers: '2.5K',
    following: '842',
    posts: '0',
    profilePicture: null
};

// Sample photos
const samplePhotos = [
    'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300',
    'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=300',
    'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300'
];

let profile = loadProfile();

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (Object.keys(profile).length === 0) {
        profile = defaultProfile;
        saveProfile();
    }
    
    renderProfile();
    setupEventListeners();
    renderPosts();
    renderPhotos();
    renderSavedPosts();
    
    // Listen for storage changes to update posts when new ones are created
    window.addEventListener('storage', (e) => {
        if (e.key === POSTS_STORAGE_KEY) {
            renderPosts();
            renderSavedPosts();
        }
    });
    
    // Also listen for custom event (when posts are updated in same tab)
    window.addEventListener('postsUpdated', () => {
        console.log('Posts updated event received');
        renderPosts();
        renderSavedPosts();
        updatePostsCount();
    });
    
    // Update when page becomes visible
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            renderPosts();
            renderSavedPosts();
            updatePostsCount();
        }
    });
    
    // Update on page focus
    window.addEventListener('focus', () => {
        renderPosts();
        renderSavedPosts();
        updatePostsCount();
    });
    
    // Force refresh posts on initial load
    setTimeout(() => {
        renderPosts();
        updatePostsCount();
    }, 100);
});

// Storage functions
function loadProfile() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch (e) {
        return {};
    }
}

function saveProfile() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

// Load posts from storage
function loadPostsFromStorage() {
    try {
        const raw = localStorage.getItem(POSTS_STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

// Update posts count in profile
function updatePostsCount() {
    const posts = loadPostsFromStorage();
    const postsCount = posts.length;
    profile.posts = postsCount.toString();
    saveProfile();
    
    // Update display
    const postsCountEl = document.getElementById('postsCount');
    if (postsCountEl) {
        postsCountEl.textContent = postsCount;
    }
    
    // Also update home page if it exists
    const homePostsCountEl = document.getElementById('homePostsCount');
    if (homePostsCountEl) {
        homePostsCountEl.textContent = postsCount;
    }
}

// Render profile
function renderProfile() {
    document.getElementById('profileName').textContent = profile.name;
    document.getElementById('profileUsername').textContent = profile.username;
    document.getElementById('profileBio').textContent = profile.bio;
    document.getElementById('followersCount').textContent = profile.followers;
    document.getElementById('followingCount').textContent = profile.following;
    updatePostsCount(); // Update posts count from actual posts
    document.getElementById('workInfo').textContent = profile.work;
    document.getElementById('educationInfo').textContent = profile.education;
    document.getElementById('locationInfo').textContent = profile.location;
    document.getElementById('websiteLink').textContent = profile.website;
    document.getElementById('websiteLink').href = profile.website.startsWith('http') ? profile.website : `https://${profile.website}`;
    document.getElementById('joinedDate').textContent = profile.joined;
    
    // Update profile avatar
    const profileAvatar = document.getElementById('profileAvatar');
    if (profileAvatar) {
        profileAvatar.src = profile.profilePicture || DEFAULT_AVATAR_URL;
    }
}

// Render posts
function renderPosts() {
    const grid = document.getElementById('postsGrid');
    if (!grid) {
        console.log('Posts grid not found');
        return; // Exit if grid doesn't exist (tab not active)
    }
    
    grid.innerHTML = '';
    
    const posts = loadPostsFromStorage();
    console.log('Loading posts from storage:', posts.length, 'posts found', posts);
    
    if (!posts || posts.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--gray-color);">
                <i class="fas fa-images" style="font-size: 48px; opacity: 0.3; margin-bottom: 15px; display: block;"></i>
                <h3>No posts yet</h3>
                <p>Posts you create will appear here</p>
            </div>
        `;
        updatePostsCount();
        return;
    }
    
    // Sort posts by time (newest first)
    const sortedPosts = [...posts].sort((a, b) => new Date(b.time) - new Date(a.time));
    
    sortedPosts.forEach((post, index) => {
        const card = document.createElement('div');
        card.className = 'post-card';
        card.style.animationDelay = `${index * 0.1}s`;
        card.dataset.postId = post.id;
        
        // Get first image if available
        const postImage = post.images && post.images.length > 0 ? post.images[0] : null;
        
        // Use shares as comments count (or you can add a comments field later)
        const commentsCount = post.shares || 0;
        
        let imageHtml = '';
        if (postImage) {
            imageHtml = `<img src="${postImage}" alt="Post" class="post-card-image">`;
        } else {
            // If no image, show a placeholder or caption preview
            imageHtml = `
                <div class="post-card-image" style="background: linear-gradient(135deg, var(--primary-color), #1a91da); display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; padding: 20px;">
                    ${post.caption ? (post.caption.length > 100 ? post.caption.substring(0, 100) + '...' : post.caption) : 'Post'}
                </div>
            `;
        }
        
        card.innerHTML = `
            ${imageHtml}
            <div class="post-card-content">
                ${post.caption && postImage ? `<p style="font-size: 13px; color: var(--gray-color); margin-bottom: 10px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">${escapeHtml(post.caption)}</p>` : ''}
                <div class="post-card-stats">
                    <span><i class="fas fa-thumbs-up"></i> ${post.likes || 0}</span>
                    <span><i class="fas fa-paper-plane"></i> ${post.shares || 0}</span>
                </div>
            </div>
        `;
        card.addEventListener('click', () => {
            // Could navigate to post detail or show modal
            console.log(`Viewing post ${post.id}`);
        });
        grid.appendChild(card);
    });
    
    updatePostsCount();
}

// Render photos
function renderPhotos() {
    const grid = document.getElementById('photosGrid');
    grid.innerHTML = '';
    
    samplePhotos.forEach((photo, index) => {
        const item = document.createElement('div');
        item.className = 'photo-item';
        item.style.animationDelay = `${index * 0.05}s`;
        item.innerHTML = `<img src="${photo}" alt="Photo">`;
        item.addEventListener('click', () => {
            window.open(photo, '_blank');
        });
        grid.appendChild(item);
    });
}

// Render saved posts
function renderSavedPosts() {
    const grid = document.getElementById('savedPostsGrid');
    if (!grid) return;
    
    // Use same grid style as posts
    grid.className = 'posts-grid';
    grid.innerHTML = '';
    
    // Get saved posts (posts with bookmarked: true)
    const allPosts = loadPostsFromStorage();
    const savedPosts = allPosts.filter(post => post.bookmarked === true);
    
    if (savedPosts.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--gray-color);">
                <i class="fas fa-bookmark" style="font-size: 48px; opacity: 0.3; margin-bottom: 15px; display: block;"></i>
                <h3>No saved posts yet</h3>
                <p>Posts you save will appear here</p>
            </div>
        `;
        return;
    }
    
    // Sort by time (newest first)
    const sortedSaved = [...savedPosts].sort((a, b) => new Date(b.time) - new Date(a.time));
    
    sortedSaved.forEach((post, index) => {
        const card = document.createElement('div');
        card.className = 'post-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        const postImage = post.images && post.images.length > 0 ? post.images[0] : null;
        const commentsCount = post.shares || 0;
        
        let imageHtml = '';
        if (postImage) {
            imageHtml = `<img src="${postImage}" alt="Saved Post" class="post-card-image">`;
        } else {
            imageHtml = `
                <div class="post-card-image" style="background: linear-gradient(135deg, var(--primary-color), #1a91da); display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; padding: 20px;">
                    ${post.caption ? (post.caption.length > 100 ? post.caption.substring(0, 100) + '...' : post.caption) : 'Post'}
                </div>
            `;
        }
        
        card.innerHTML = `
            ${imageHtml}
            <div class="post-card-content">
                ${post.caption && postImage ? `<p style="font-size: 13px; color: var(--gray-color); margin-bottom: 10px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">${escapeHtml(post.caption)}</p>` : ''}
                <div class="post-card-stats">
                    <span><i class="fas fa-thumbs-up"></i> ${post.likes || 0}</span>
                    <span><i class="fas fa-paper-plane"></i> ${post.shares || 0}</span>
                    <span><i class="fas fa-bookmark" style="color: var(--primary-color);"></i> Saved</span>
                </div>
            </div>
        `;
        card.addEventListener('click', () => {
            console.log(`Viewing saved post ${post.id}`);
        });
        grid.appendChild(card);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Tab buttons
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            switchTab(tab);
        });
    });
    
    // Edit profile button
    const editProfileBtn = document.getElementById('editProfileBtn');
    editProfileBtn.addEventListener('click', openEditModal);
    
    // Modal close
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const modal = document.getElementById('editProfileModal');
    
    closeModalBtn.addEventListener('click', closeEditModal);
    cancelEditBtn.addEventListener('click', closeEditModal);
    
    // Close modal on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeEditModal();
        }
    });
    
    // Form submit
    const editProfileForm = document.getElementById('editProfileForm');
    editProfileForm.addEventListener('submit', handleSaveProfile);
    
    // Avatar edit - create hidden file input
    const avatarEditBtn = document.getElementById('avatarEditBtn');
    const avatarFileInput = document.createElement('input');
    avatarFileInput.type = 'file';
    avatarFileInput.accept = 'image/*';
    avatarFileInput.style.display = 'none';
    document.body.appendChild(avatarFileInput);
    
    avatarFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file.');
            return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB.');
            return;
        }
        
        // Convert to data URL
        const reader = new FileReader();
        reader.onload = (event) => {
            const dataURL = event.target.result;
            profile.profilePicture = dataURL;
            saveProfile();
            renderProfile();
            
            // Dispatch event to update home page
            window.dispatchEvent(new Event('profileUpdated'));
            
            showNotification('Profile picture updated successfully!', 'success');
        };
        reader.onerror = () => {
            alert('Error reading image file. Please try again.');
        };
        reader.readAsDataURL(file);
        
        // Reset input
        avatarFileInput.value = '';
    });
    
    avatarEditBtn.addEventListener('click', () => {
        avatarFileInput.click();
    });
    
    // Cover edit
    const coverEditBtn = document.getElementById('coverEditBtn');
    coverEditBtn.addEventListener('click', () => {
        alert('Cover photo upload feature coming soon!');
    });
    
    // Share profile
    const shareProfileBtn = document.getElementById('shareProfileBtn');
    shareProfileBtn.addEventListener('click', () => {
        if (navigator.share) {
            navigator.share({
                title: `${profile.name} - ${profile.username}`,
                text: profile.bio,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Profile link copied to clipboard!');
        }
    });
    
    // More options
    const moreOptionsBtn = document.getElementById('moreOptionsBtn');
    moreOptionsBtn.addEventListener('click', () => {
        alert('More options coming soon!');
    });
}

// Switch tab
function switchTab(tab) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    
    // Update tab panes
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    document.getElementById(`${tab}Tab`).classList.add('active');
    
    // Refresh content when switching to posts or saved tabs
    if (tab === 'posts') {
        renderPosts();
        updatePostsCount();
    } else if (tab === 'saved') {
        renderSavedPosts();
    }
}

// Open edit modal
function openEditModal() {
    const modal = document.getElementById('editProfileModal');
    document.getElementById('editName').value = profile.name;
    document.getElementById('editUsername').value = profile.username;
    document.getElementById('editBio').value = profile.bio;
    document.getElementById('editWork').value = profile.work;
    document.getElementById('editEducation').value = profile.education;
    document.getElementById('editLocation').value = profile.location;
    document.getElementById('editWebsite').value = profile.website;
    modal.classList.add('active');
}

// Close edit modal
function closeEditModal() {
    const modal = document.getElementById('editProfileModal');
    modal.classList.remove('active');
}

// Handle save profile
function handleSaveProfile(e) {
    e.preventDefault();
    
    profile.name = document.getElementById('editName').value;
    profile.username = document.getElementById('editUsername').value;
    profile.bio = document.getElementById('editBio').value;
    profile.work = document.getElementById('editWork').value;
    profile.education = document.getElementById('editEducation').value;
    profile.location = document.getElementById('editLocation').value;
    profile.website = document.getElementById('editWebsite').value;
    
    saveProfile();
    renderProfile();
    closeEditModal();
    
    // Dispatch custom event to update home page if it's open
    window.dispatchEvent(new Event('profileUpdated'));
    
    // Also trigger storage event manually for cross-tab sync
    // Note: StorageEvent can't be manually created, so we'll rely on the custom event
    // The storage event will fire automatically when localStorage is updated
    
    // Show success message
    showNotification('Profile updated successfully!', 'success');
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, var(--primary-color), #1a91da)'};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations for notification
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);
// Settings Modal
const settingsBtn = document.getElementById("settingsBtn");
const settingsModal = document.getElementById("settingsModal");
const closeSettingsBtn = document.getElementById("closeSettingsBtn");

const darkModeToggle = document.getElementById("darkModeToggle");
const emailToggle = document.getElementById("emailNotificationsToggle");
const logoutBtn = document.getElementById("logoutBtn");
const changePasswordBtn = document.getElementById("changePasswordBtn");

// Open / Close
settingsBtn.addEventListener("click", () => {
    settingsModal.classList.add("active");
});

closeSettingsBtn.addEventListener("click", () => {
    settingsModal.classList.remove("active");
});

// Load Settings
darkModeToggle.checked = localStorage.getItem("darkMode") === "true";
emailToggle.checked = localStorage.getItem("emailNotifications") === "true";

if (darkModeToggle.checked) {
    document.body.classList.add("dark-mode");
}

// Dark Mode
darkModeToggle.addEventListener("change", () => {
    localStorage.setItem("darkMode", darkModeToggle.checked);
    document.body.classList.toggle("dark-mode", darkModeToggle.checked);
});

// Email Notifications
emailToggle.addEventListener("change", () => {
    localStorage.setItem("emailNotifications", emailToggle.checked);
});

// Change Password
changePasswordBtn.addEventListener("click", () => {
    alert("Redirect to Change Password Page");
});

// Logout
logoutBtn.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
});

