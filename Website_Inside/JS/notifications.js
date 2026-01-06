// Notifications page interactive functionality

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

// Notifications functionality
const STORAGE_KEY = 'nexora_notifications_v1';

// Sample notifications data
const defaultNotifications = [
    {
        id: 'n1',
        type: 'like',
        user: {
            name: 'Maya Chen',
            avatar: 'https://media.istockphoto.com/id/1364917563/photo/businessman-smiling-with-arms-crossed-on-white-background.jpg?s=612x612&w=0&k=20&c=NtM9Wbs1DBiGaiowsxJY6wNCnLf0POa65rYEwnZymrM=',
            username: '@mayachen'
        },
        action: 'liked your post',
        preview: 'Great work on the new design! Really impressed with the UI improvements.',
        time: new Date(Date.now() - 300000).toISOString(),
        read: false,
        postImage: null
    },
    {
        id: 'n2',
        type: 'comment',
        user: {
            name: 'Alex Rodriguez',
            avatar: 'https://media.istockphoto.com/id/2172317014/photo/happy-hispanic-man-working-on-laptop-at-home.jpg?s=612x612&w=0&k=20&c=9evc002hmjsuha6TiO8OftVTuZIE71Hr3qhmq8vRRH0=',
            username: '@alexrod'
        },
        action: 'commented on your post',
        preview: 'This looks amazing! Can you share the code for this?',
        time: new Date(Date.now() - 900000).toISOString(),
        read: false,
        postImage: null
    },
    {
        id: 'n3',
        type: 'follow',
        user: {
            name: 'Sarah Johnson',
            avatar: 'https://media.istockphoto.com/id/2025682392/photo/man-adult-caucasian-with-beard-and-eyeglasses-work-on-laptop-at-home.jpg?s=612x612&w=0&k=20&c=in_Ty2-lelhpQEDCFtOJhAnrDdueeHgZYpkT0zdL2Qw=',
            username: '@sarahj'
        },
        action: 'started following you',
        preview: null,
        time: new Date(Date.now() - 1800000).toISOString(),
        read: false,
        postImage: null
    },
    {
        id: 'n4',
        type: 'mention',
        user: {
            name: 'Tech Team',
            avatar: 'https://media.istockphoto.com/id/1485546774/photo/bald-man-smiling-at-camera-standing-with-arms-crossed.jpg?s=612x612&w=0&k=20&c=9vuq6HxeSZfhZ7Jit_2HPVLyoajffb7h_SbWssh_bME=',
            username: '@techteam'
        },
        action: 'mentioned you in a post',
        preview: 'Check out this amazing project by @admin!',
        time: new Date(Date.now() - 3600000).toISOString(),
        read: true,
        postImage: null
    },
    {
        id: 'n5',
        type: 'like',
        user: {
            name: 'Design Studio',
            avatar: 'https://media.istockphoto.com/id/1364917563/photo/businessman-smiling-with-arms-crossed-on-white-background.jpg?s=612x612&w=0&k=20&c=NtM9Wbs1DBiGaiowsxJY6wNCnLf0POa65rYEwnZymrM=',
            username: '@designstudio'
        },
        action: 'and 12 others liked your post',
        preview: 'Your latest design update is getting a lot of attention!',
        time: new Date(Date.now() - 7200000).toISOString(),
        read: true,
        postImage: null
    },
    {
        id: 'n6',
        type: 'share',
        user: {
            name: 'Web Dev Pro',
            avatar: 'https://media.istockphoto.com/id/2172317014/photo/happy-hispanic-man-working-on-laptop-at-home.jpg?s=612x612&w=0&k=20&c=9evc002hmjsuha6TiO8OftVTuZIE71Hr3qhmq8vRRH0=',
            username: '@webdevpro'
        },
        action: 'shared your post',
        preview: 'Shared with their followers',
        time: new Date(Date.now() - 10800000).toISOString(),
        read: false,
        postImage: null
    },
    {
        id: 'n7',
        type: 'comment',
        user: {
            name: 'Maya Chen',
            avatar: 'https://media.istockphoto.com/id/1364917563/photo/businessman-smiling-with-arms-crossed-on-white-background.jpg?s=612x612&w=0&k=20&c=NtM9Wbs1DBiGaiowsxJY6wNCnLf0POa65rYEwnZymrM=',
            username: '@mayachen'
        },
        action: 'replied to your comment',
        preview: 'Thanks for the feedback! I\'ll definitely consider that.',
        time: new Date(Date.now() - 14400000).toISOString(),
        read: true,
        postImage: null
    },
    {
        id: 'n8',
        type: 'follow',
        user: {
            name: 'Code Master',
            avatar: 'https://media.istockphoto.com/id/2025682392/photo/man-adult-caucasian-with-beard-and-eyeglasses-work-on-laptop-at-home.jpg?s=612x612&w=0&k=20&c=in_Ty2-lelhpQEDCFtOJhAnrDdueeHgZYpkT0zdL2Qw=',
            username: '@codemaster'
        },
        action: 'started following you',
        preview: null,
        time: new Date(Date.now() - 86400000).toISOString(),
        read: true,
        postImage: null
    }
];

let notifications = loadNotifications();
let currentFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (notifications.length === 0) {
        notifications = defaultNotifications;
        saveNotifications();
    }
    
    renderNotifications();
    setupEventListeners();
    updateFilterCounts();
});

// Storage functions
function loadNotifications() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

function saveNotifications() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
}

// Render notifications
function renderNotifications(filter = 'all') {
    const list = document.getElementById('notificationsList');
    const emptyState = document.getElementById('emptyState');
    
    let filtered = notifications;
    
    if (filter !== 'all') {
        filtered = notifications.filter(n => n.type === filter);
    }
    
    // Sort by time (newest first)
    filtered.sort((a, b) => new Date(b.time) - new Date(a.time));
    
    if (filtered.length === 0) {
        list.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    list.style.display = 'flex';
    emptyState.style.display = 'none';
    list.innerHTML = '';
    
    filtered.forEach((notif, index) => {
        const item = createNotificationElement(notif, index);
        list.appendChild(item);
    });
}

// Create notification element
function createNotificationElement(notif, index) {
    const item = document.createElement('div');
    item.className = `notification-item ${notif.read ? '' : 'unread'}`;
    item.dataset.id = notif.id;
    item.dataset.type = notif.type;
    item.style.animationDelay = `${index * 0.05}s`;
    
    const timeAgo = getTimeAgo(notif.time);
    const iconClass = getIconClass(notif.type);
    
    let previewHtml = '';
    if (notif.preview) {
        previewHtml = `<div class="notification-preview">"${escapeHtml(notif.preview)}"</div>`;
    }
    
    let actionButtons = '';
    if (notif.type === 'follow') {
        actionButtons = `
            <div class="notification-actions">
                <button class="notification-action-btn primary" onclick="handleFollow('${notif.id}')">
                    <i class="fas fa-user-plus"></i> Follow Back
                </button>
                <button class="notification-action-btn" onclick="handleViewProfile('${notif.user.username}')">
                    <i class="fas fa-user"></i> View Profile
                </button>
            </div>
        `;
    } else if (notif.type === 'comment' || notif.type === 'mention') {
        actionButtons = `
            <div class="notification-actions">
                <button class="notification-action-btn primary" onclick="handleReply('${notif.id}')">
                    <i class="fas fa-reply"></i> Reply
                </button>
                <button class="notification-action-btn" onclick="handleViewPost('${notif.id}')">
                    <i class="fas fa-eye"></i> View Post
                </button>
            </div>
        `;
    } else {
        actionButtons = `
            <div class="notification-actions">
                <button class="notification-action-btn" onclick="handleViewPost('${notif.id}')">
                    <i class="fas fa-eye"></i> View Post
                </button>
            </div>
        `;
    }
    
    item.innerHTML = `
        <div class="notification-icon ${notif.type}">
            <i class="${iconClass}"></i>
        </div>
        <div class="notification-content">
            <p class="notification-text">
                <strong>${escapeHtml(notif.user.name)}</strong> ${notif.action}
            </p>
            ${previewHtml}
            <div class="notification-time">
                <i class="fas fa-clock"></i>
                ${timeAgo}
            </div>
            ${actionButtons}
        </div>
        ${notif.postImage ? `<img src="${notif.postImage}" alt="Post" class="notification-image">` : ''}
    `;
    
    // Mark as read on click
    item.addEventListener('click', (e) => {
        if (!e.target.closest('.notification-action-btn')) {
            markAsRead(notif.id);
        }
    });
    
    return item;
}

// Get icon class for notification type
function getIconClass(type) {
    const icons = {
        'like': 'fas fa-thumbs-up',
        'comment': 'fas fa-comment',
        'follow': 'fas fa-user-plus',
        'mention': 'fas fa-at',
        'share': 'fas fa-paper-plane'
    };
    return icons[type] || 'fas fa-bell';
}

// Mark notification as read
function markAsRead(id) {
    const notif = notifications.find(n => n.id === id);
    if (notif && !notif.read) {
        notif.read = true;
        saveNotifications();
        updateNotificationElement(id);
        updateFilterCounts();
    }
}

// Mark all as read
function markAllAsRead() {
    notifications.forEach(notif => {
        notif.read = true;
    });
    saveNotifications();
    renderNotifications(currentFilter);
    updateFilterCounts();
}

// Update notification element
function updateNotificationElement(id) {
    const item = document.querySelector(`[data-id="${id}"]`);
    if (item) {
        item.classList.remove('unread');
    }
}

// Update filter counts
function updateFilterCounts() {
    const counts = {
        all: notifications.length,
        likes: notifications.filter(n => n.type === 'like').length,
        comments: notifications.filter(n => n.type === 'comment').length,
        follows: notifications.filter(n => n.type === 'follow').length,
        mentions: notifications.filter(n => n.type === 'mention').length
    };
    
    document.getElementById('allCount').textContent = counts.all;
    document.getElementById('likesCount').textContent = counts.likes;
    document.getElementById('commentsCount').textContent = counts.comments;
    document.getElementById('followsCount').textContent = counts.follows;
    document.getElementById('mentionsCount').textContent = counts.mentions;
}

// Setup event listeners
function setupEventListeners() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const markAllReadBtn = document.getElementById('markAllReadBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderNotifications(currentFilter);
        });
    });
    
    // Mark all as read
    markAllReadBtn.addEventListener('click', () => {
        markAllAsRead();
    });
    
    // Settings button
    settingsBtn.addEventListener('click', () => {
        alert('Notification settings coming soon!');
    });
}

// Action handlers
function handleFollow(id) {
    const notif = notifications.find(n => n.id === id);
    if (notif) {
        alert(`Following ${notif.user.name} back!`);
        markAsRead(id);
    }
}

function handleViewProfile(username) {
    alert(`Viewing profile: ${username}`);
}

function handleReply(id) {
    const notif = notifications.find(n => n.id === id);
    if (notif) {
        alert(`Replying to ${notif.user.name}...`);
        markAsRead(id);
    }
}

function handleViewPost(id) {
    const notif = notifications.find(n => n.id === id);
    if (notif) {
        alert(`Viewing post...`);
        markAsRead(id);
    }
}

// Utility functions
function getTimeAgo(isoString) {
    try {
        const diff = Date.now() - new Date(isoString).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'just now';
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        const days = Math.floor(hrs / 24);
        if (days < 7) return `${days}d ago`;
        return new Date(isoString).toLocaleDateString();
    } catch (e) {
        return '';
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Make handlers global for onclick
window.handleFollow = handleFollow;
window.handleViewProfile = handleViewProfile;
window.handleReply = handleReply;
window.handleViewPost = handleViewPost;
