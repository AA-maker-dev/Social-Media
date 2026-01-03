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
    posts: '0'
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
}

// Render posts
function renderPosts() {
    const grid = document.getElementById('postsGrid');
    grid.innerHTML = '';
    
    samplePosts.forEach((post, index) => {
        const card = document.createElement('div');
        card.className = 'post-card';
        card.style.animationDelay = `${index * 0.1}s`;
        card.innerHTML = `
            <img src="${post.image}" alt="Post" class="post-card-image">
            <div class="post-card-content">
                <div class="post-card-stats">
                    <span><i class="fas fa-heart"></i> ${post.likes}</span>
                    <span><i class="fas fa-comment"></i> ${post.comments}</span>
                </div>
            </div>
        `;
        card.addEventListener('click', () => {
            alert(`Viewing post ${post.id}`);
        });
        grid.appendChild(card);
    });
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
    
    // Show some saved posts (can be filtered from main posts)
    const savedPosts = samplePosts.slice(0, 3);
    
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
    
    savedPosts.forEach((post, index) => {
        const card = document.createElement('div');
        card.className = 'post-card';
        card.style.animationDelay = `${index * 0.1}s`;
        card.innerHTML = `
            <img src="${post.image}" alt="Saved Post" class="post-card-image">
            <div class="post-card-content">
                <div class="post-card-stats">
                    <span><i class="fas fa-heart"></i> ${post.likes}</span>
                    <span><i class="fas fa-comment"></i> ${post.comments}</span>
                    <span><i class="fas fa-bookmark" style="color: var(--primary-color);"></i> Saved</span>
                </div>
            </div>
        `;
        card.addEventListener('click', () => {
            alert(`Viewing saved post ${post.id}`);
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
    
    // Avatar edit
    const avatarEditBtn = document.getElementById('avatarEditBtn');
    avatarEditBtn.addEventListener('click', () => {
        alert('Avatar upload feature coming soon!');
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
