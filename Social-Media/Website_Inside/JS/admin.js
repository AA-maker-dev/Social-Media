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

function hydrateAdminPage(session) {
    setText('adminName', session?.name || 'Admin');
    setText('adminUsername', session?.username || '@admin');
    setText('adminBadge', 'Admin');

    renderList('adminTasks', [
        { title: 'Review flagged posts', meta: '12 items need a decision', badge: 'Due' },
        { title: 'Approve new creators', meta: '5 pending verifications', badge: 'Priority' },
        { title: 'Audit admin actions', meta: 'Export CSV for weekly audit', badge: 'Audit' }
    ]);

    renderList('adminSignals', [
        { title: 'Moderation queue stable', meta: 'Queue time < 3m', badge: 'Healthy' },
        { title: 'API error rate elevated', meta: '0.24% over 10m', badge: 'Investigate' },
        { title: 'New feature rollout', meta: '30% of users included', badge: 'Phased' }
    ]);

    renderActions('adminActions', [
        { title: 'View audit log', icon: 'fa-clipboard-list' },
        { title: 'Download reports', icon: 'fa-file-download' },
        { title: 'Manage roles', icon: 'fa-user-shield' },
        { title: 'Toggle maintenance', icon: 'fa-screwdriver-wrench' }
    ]);
}

document.addEventListener('DOMContentLoaded', () => {
    const session = ensureAdminSession();
    if (!session) return;
    setupNav(session);
    hydrateAdminPage(session);
});
