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

// Post creation with image upload, persistence, edit/delete, and actions
const STORAGE_KEY = 'nexora_posts_v1';

document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('image-input');
    const thumbsContainer = document.getElementById('image-thumbs');
    const postBtn = document.getElementById('post-btn');
    const captionInput = document.getElementById('post-caption') || document.querySelector('.post-input');
    const postsContainer = document.getElementById('posts-container');
    const clearPostsBtn = document.getElementById('clear-posts');

    let selectedImages = []; // Data URLs

    // Load and render stored posts
    const posts = loadPostsFromStorage();
    renderAllPosts(posts);

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
            alert('Please add a caption or image to post.');
            return;
        }

        const post = {
            id: Date.now().toString(),
            caption: caption,
            images: selectedImages.slice(),
            likes: 0,
            shares: 0,
            bookmarked: false,
            time: new Date().toISOString()
        };

        posts.unshift(post);
        savePostsToStorage(posts);
        renderPost(post, postsContainer, posts);

        // reset
        selectedImages = [];
        renderThumbs();
        if (captionInput) captionInput.value = '';
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
            reader.onload = () => res(reader.result);
            reader.onerror = rej;
            reader.readAsDataURL(file);
        });
    }

    // Storage helpers
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
    }

    // Rendering
    function renderAllPosts(postsArr) {
        postsContainer.innerHTML = '';
        postsArr.forEach(post => renderPost(post, postsContainer, postsArr));
    }

    function renderPost(post, container, postsArr) {
        const postEl = document.createElement('div');
        postEl.className = 'post';
        postEl.dataset.id = post.id;

        const header = document.createElement('div');
        header.className = 'post-header';
        header.innerHTML = `
            <img src="../Images/avatar1.jpg" alt="User Avatar" class="avatar-sm">
            <div class="post-info">
                <h4>You</h4>
                <span class="post-time">${timeAgoShort(post.time)}</span>
            </div>
            <div style="margin-left:8px;display:flex;gap:8px;align-items:center">
                <button class="btn-more btn-small post-edit">Edit</button>
                <button class="btn-more btn-small post-delete">Delete</button>
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
        stats.innerHTML = `<span class="likes"><i class="fas fa-heart"></i> ${post.likes} likes</span><span class="shares"><i class="fas fa-share"></i> ${post.shares} shares</span>`;

        const actions = document.createElement('div');
        actions.className = 'post-actions';
        actions.innerHTML = `
            <button class="action-like action-btn">${post.likes ? '<i class="fas fa-heart"></i> Unlike' : '<i class="far fa-heart"></i> Like'}</button>
            <button class="action-bookmark action-btn">${post.bookmarked ? '<i class="fas fa-bookmark"></i> Bookmarked' : '<i class="far fa-bookmark"></i> Bookmark'}</button>
            <button class="action-share action-btn"><i class="far fa-share"></i> Share</button>
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

        likeBtn && likeBtn.addEventListener('click', () => {
            post.likes = (post.likes || 0) + (post._liked ? -1 : 1);
            post._liked = !post._liked;
            saveAndRefresh(post.id);
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

        deleteBtn && deleteBtn.addEventListener('click', () => {
            if (!confirm('Delete this post?')) return;
            const i = postsArr.findIndex(p => p.id === post.id);
            if (i > -1) {
                postsArr.splice(i, 1);
                savePostsToStorage(postsArr);
                postEl.remove();
            }
        });

        editBtn && editBtn.addEventListener('click', () => {
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
            // update UI pieces
            const updatedLikes = postEl.querySelector('.post-stats .likes') || postEl.querySelector('.likes');
            if (updatedLikes) updatedLikes.innerHTML = `<i class="fas fa-heart"></i> ${post.likes} likes`;
            if (likeBtn) likeBtn.innerHTML = post._liked ? '<i class="fas fa-heart"></i> Unlike' : '<i class="far fa-heart"></i> Like';
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