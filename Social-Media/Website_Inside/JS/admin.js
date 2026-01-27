// Basic admin-only page bootstrap
function getUserSession() {
    try {
        const raw = localStorage.getItem('userSession');
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        console.error('Failed to parse session:', e);
        return null;
    }
}

function logout(event) {
    if (event) event.preventDefault();
    localStorage.removeItem('userSession');
    localStorage.removeItem('rememberUser');
    window.location.href = '../../Login/FrontEnd/login.html';
}

function ensureAdminSession() {
    const session = getUserSession();
    if (!session) {
        window.location.href = '../../Login/FrontEnd/login.html';
        return null;
    }
    const role = (session.role || 'customer').toLowerCase();
    if (role !== 'admin') {
        window.location.href = 'index.html';
        return null;
    }
    return session;
}

function setupNav(session) {
    const authNavItem = document.getElementById('authNavItem');
    const logoutNavItem = document.getElementById('logoutNavItem');
    const adminNavItem = document.getElementById('adminNavItem');
    if (authNavItem) authNavItem.style.display = 'none';
    if (logoutNavItem) logoutNavItem.style.display = 'block';
    if (adminNavItem) adminNavItem.style.display = 'block';

    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function renderList(id, items) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = items.map(item => `
        <li>
            <div>
                <div style="font-weight: 700;">${item.title}</div>
                <div class="admin-meta-text">${item.meta}</div>
            </div>
            <span class="admin-chip">${item.badge}</span>
        </li>
    `).join('');
}

function renderActions(id, items) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = items.map(action => `
        <button class="admin-action-btn"><i class="fas ${action.icon}"></i>${action.title}</button>
    `).join('');
}

const POSTS_KEY = 'nexora_posts_v1';
const USERS_KEY = 'nexora_users_db';
const REPORTS_KEY = 'nexora_reports_v1';

function formatNumber(num) {
    const n = Number(num) || 0;
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    return n.toString();
}

function loadJson(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
        console.warn('Failed to read', key, e);
        return fallback;
    }
}

function loadPosts() {
    return loadJson(POSTS_KEY, []);
}

function loadUsersDb() {
    return loadJson(USERS_KEY, []);
}

function loadReports() {
    return loadJson(REPORTS_KEY, []);
}

function computeStats() {
    const posts = loadPosts();
    const users = loadUsersDb();
    const reports = loadReports();

    const now = Date.now();
    const dayAgo = now - 24 * 60 * 60 * 1000;
    const posts24h = posts.filter(p => p.time && new Date(p.time).getTime() >= dayAgo);

    const engagement = posts.reduce((acc, p) => {
        const reactions = p.reactions ? Object.values(p.reactions).reduce((a, b) => a + (Number(b) || 0), 0) : 0;
        return acc + (Number(p.likes) || 0) + reactions;
    }, 0);

    const topPosts = [...posts]
        .map(p => ({
            caption: p.caption || 'Untitled',
            score: (Number(p.likes) || 0) + (p.reactions ? Object.values(p.reactions).reduce((a, b) => a + (Number(b) || 0), 0) : 0),
            time: p.time
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

    return {
        usersCount: users.length,
        posts24hCount: posts24h.length,
        engagement,
        reportsCount: reports.length,
        topPosts,
        posts
    };
}

function renderLiveList(items) {
    const el = document.getElementById('adminLive');
    if (!el) return;
    if (!items.length) {
        el.innerHTML = '<li><div>No posts yet</div><span class="admin-chip">Idle</span></li>';
        return;
    }
    el.innerHTML = items.map(item => `
        <li>
            <div>
                <div style="font-weight: 700;">${item.caption.slice(0, 60)}${item.caption.length > 60 ? '…' : ''}</div>
                <div class="admin-meta-text">Score: ${formatNumber(item.score)}</div>
            </div>
            <span class="admin-chip">${item.time ? new Date(item.time).toLocaleTimeString() : 'recent'}</span>
        </li>
    `).join('');
}

function updateMetrics() {
    const stats = computeStats();
    setText('metricUsers', formatNumber(stats.usersCount));
    setText('metricUsersSub', `${stats.usersCount} registered accounts`);
    setText('metricPosts24h', formatNumber(stats.posts24hCount));
    setText('metricPostsSub', `${stats.posts.length} total posts`);
    setText('metricEngagement', formatNumber(stats.engagement));
    setText('metricEngagementSub', 'Sum of likes and reactions');

    renderLiveList(stats.topPosts);

    renderList('adminSignals', [
        { title: 'Feed activity', meta: `${formatNumber(stats.posts24hCount)} posts in last 24h`, badge: 'Live' },
        { title: 'Engagement pulse', meta: `${formatNumber(stats.engagement)} total reactions/likes`, badge: 'Realtime' },
        { title: 'Reports queue', meta: `${formatNumber(stats.reportsCount)} pending`, badge: stats.reportsCount ? 'Action' : 'Clear' }
    ]);
}

function hydrateAdminPage(session) {
    setText('adminName', session?.name || 'Admin');
    setText('adminUsername', session?.username || '@admin');
    setText('adminBadge', 'Admin');

    renderList('adminTasks', [
        { title: 'Review flagged posts', meta: 'Feed-level moderation queue', badge: 'Due' },
        { title: 'Approve new creators', meta: 'Verify any high-signal accounts', badge: 'Priority' },
        { title: 'Audit admin actions', meta: 'Export CSV for weekly audit', badge: 'Audit' }
    ]);

    renderActions('adminActions', [
        { title: 'View audit log', icon: 'fa-clipboard-list' },
        { title: 'Download reports', icon: 'fa-file-download' },
        { title: 'Manage roles', icon: 'fa-user-shield' },
        { title: 'Toggle maintenance', icon: 'fa-screwdriver-wrench' }
    ]);

    updateMetrics();
    window.addEventListener('storage', updateMetrics);
    setInterval(updateMetrics, 5000);
}

document.addEventListener('DOMContentLoaded', () => {
    const session = ensureAdminSession();
    if (!session) return;
    setupNav(session);
    hydrateAdminPage(session);
});
