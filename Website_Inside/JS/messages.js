// Messages page interactive functionality

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

// Messages functionality
const STORAGE_KEY = 'nexora_messages_v1';
const CONVERSATIONS_KEY = 'nexora_conversations_v1';

// Sample conversations data
const defaultConversations = [
    {
        id: '1',
        name: 'Maya Chen',
        avatar: 'https://media.istockphoto.com/id/1364917563/photo/businessman-smiling-with-arms-crossed-on-white-background.jpg?s=612x612&w=0&k=20&c=NtM9Wbs1DBiGaiowsxJY6wNCnLf0POa65rYEwnZymrM=',
        lastMessage: "Hey! How's your project going?",
        time: '2m ago',
        unread: 2,
        online: true
    },
    {
        id: '2',
        name: 'Alex Rodriguez',
        avatar: 'https://media.istockphoto.com/id/2172317014/photo/happy-hispanic-man-working-on-laptop-at-home.jpg?s=612x612&w=0&k=20&c=9evc002hmjsuha6TiO8OftVTuZIE71Hr3qhmq8vRRH0=',
        lastMessage: 'Thanks for the help with the design!',
        time: '1h ago',
        unread: 0,
        online: true
    },
    {
        id: '3',
        name: 'Sarah Johnson',
        avatar: 'https://media.istockphoto.com/id/2025682392/photo/man-adult-caucasian-with-beard-and-eyeglasses-work-on-laptop-at-home.jpg?s=612x612&w=0&k=20&c=in_Ty2-lelhpQEDCFtOJhAnrDdueeHgZYpkT0zdL2Qw=',
        lastMessage: 'Can we schedule a meeting?',
        time: '3h ago',
        unread: 1,
        online: false
    },
    {
        id: '4',
        name: 'Tech Team',
        avatar: 'https://media.istockphoto.com/id/1485546774/photo/bald-man-smiling-at-camera-standing-with-arms-crossed.jpg?s=612x612&w=0&k=20&c=9vuq6HxeSZfhZ7Jit_2HPVLyoajffb7h_SbWssh_bME=',
        lastMessage: 'New update available!',
        time: '5h ago',
        unread: 0,
        online: false
    }
];

// Sample messages for each conversation
const defaultMessages = {
    '1': [
        { id: 'm1', text: "Hey Abhi! How's your project going?", sender: 'other', time: new Date(Date.now() - 3600000).toISOString(), read: true },
        { id: 'm2', text: 'Pretty good, just working on Nexora 🚀', sender: 'me', time: new Date(Date.now() - 3500000).toISOString(), read: true },
        { id: 'm3', text: "That's awesome! Can't wait to see it.", sender: 'other', time: new Date(Date.now() - 3400000).toISOString(), read: true },
        { id: 'm4', text: 'Hey! How\'s your project going?', sender: 'other', time: new Date(Date.now() - 120000).toISOString(), read: false }
    ],
    '2': [
        { id: 'm5', text: 'Thanks for the help with the design!', sender: 'other', time: new Date(Date.now() - 3600000).toISOString(), read: true }
    ],
    '3': [
        { id: 'm6', text: 'Can we schedule a meeting?', sender: 'other', time: new Date(Date.now() - 10800000).toISOString(), read: false }
    ],
    '4': [
        { id: 'm7', text: 'New update available!', sender: 'other', time: new Date(Date.now() - 18000000).toISOString(), read: true }
    ]
};

let conversations = loadConversations();
let messages = loadMessages();
let activeConversationId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (conversations.length === 0) {
        conversations = defaultConversations;
        messages = defaultMessages;
        saveConversations();
        saveMessages();
    }
    
    renderConversations();
    setupEventListeners();
});

// Storage functions
function loadConversations() {
    try {
        const raw = localStorage.getItem(CONVERSATIONS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

function saveConversations() {
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
}

function loadMessages() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch (e) {
        return {};
    }
}

function saveMessages() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

// Render conversations list
function renderConversations(filtered = null) {
    const list = document.getElementById('conversationsList');
    const convs = filtered || conversations;
    
    list.innerHTML = '';
    
    convs.forEach(conv => {
        const item = document.createElement('div');
        item.className = 'conversation-item';
        item.dataset.id = conv.id;
        
        if (activeConversationId === conv.id) {
            item.classList.add('active');
        }
        
        item.innerHTML = `
            <img src="${conv.avatar}" alt="${conv.name}" class="conversation-avatar">
            <div class="conversation-info">
                <div class="conversation-header-row">
                    <h4 class="conversation-name">${conv.name}</h4>
                    <span class="conversation-time">${conv.time}</span>
                </div>
                <p class="conversation-preview">${conv.lastMessage}</p>
            </div>
            ${conv.unread > 0 ? `<span class="conversation-badge">${conv.unread}</span>` : ''}
        `;
        
        item.addEventListener('click', () => openConversation(conv.id));
        list.appendChild(item);
    });
}

// Open conversation
function openConversation(id) {
    activeConversationId = id;
    const conversation = conversations.find(c => c.id === id);
    
    if (!conversation) return;
    
    // Update active state
    document.querySelectorAll('.conversation-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-id="${id}"]`)?.classList.add('active');
    
    // Update chat header
    const chatHeader = document.getElementById('chatHeader');
    chatHeader.innerHTML = `
        <div class="chat-header-content">
            <img src="${conversation.avatar}" alt="${conversation.name}" class="chat-header-avatar">
            <div class="chat-header-info">
                <h3>${conversation.name}</h3>
                <p>
                    <i class="fas fa-circle" style="font-size: 8px; color: ${conversation.online ? '#10b981' : '#9ca3af'};"></i>
                    ${conversation.online ? 'Online' : 'Offline'}
                </p>
            </div>
        </div>
        <div class="chat-header-actions">
            <button class="chat-header-btn" title="Voice call">
                <i class="fas fa-phone"></i>
            </button>
            <button class="chat-header-btn" title="Video call">
                <i class="fas fa-video"></i>
            </button>
            <button class="chat-header-btn" title="More options">
                <i class="fas fa-ellipsis-v"></i>
            </button>
        </div>
    `;
    
    // Show chat window and input
    document.getElementById('chatWindow').style.display = 'flex';
    document.getElementById('chatInputContainer').style.display = 'flex';
    document.querySelector('.chat-header-placeholder')?.remove();
    
    // Render messages
    renderMessages(id);
    
    // Mark as read
    conversation.unread = 0;
    saveConversations();
    renderConversations();
    
    // Scroll to bottom
    setTimeout(() => {
        const chatWindow = document.getElementById('chatWindow');
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }, 100);
}

// Render messages
function renderMessages(conversationId) {
    const chatWindow = document.getElementById('chatWindow');
    const conversation = conversations.find(c => c.id === conversationId);
    const convMessages = messages[conversationId] || [];
    
    chatWindow.innerHTML = '';
    
    convMessages.forEach(msg => {
        const messageEl = createMessageElement(msg, conversation);
        chatWindow.appendChild(messageEl);
    });
    
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Create message element
function createMessageElement(msg, conversation) {
    const message = document.createElement('div');
    message.className = `message ${msg.sender === 'me' ? 'sent' : 'received'}`;
    message.dataset.id = msg.id;
    
    const timeAgo = getTimeAgo(msg.time);
    
    let content = '';
    if (msg.image) {
        content = `<img src="${msg.image}" alt="Shared image" class="message-image" onclick="window.open('${msg.image}', '_blank')">`;
    }
    if (msg.text) {
        content += `<p class="message-text">${escapeHtml(msg.text)}</p>`;
    }
    
    message.innerHTML = `
        ${msg.sender !== 'me' ? `<img src="${conversation.avatar}" alt="${conversation.name}" class="message-avatar">` : ''}
        <div class="message-content">
            <div class="message-bubble">
                ${content}
            </div>
            <div class="message-time">
                ${timeAgo}
                ${msg.sender === 'me' ? `<span class="message-status"><i class="fas fa-${msg.read ? 'check-double' : 'check'}" style="color: ${msg.read ? '#1DA1F2' : 'rgba(255,255,255,0.7)'};"></i></span>` : ''}
            </div>
        </div>
        ${msg.sender === 'me' ? `<img src="https://media.istockphoto.com/id/1485546774/photo/bald-man-smiling-at-camera-standing-with-arms-crossed.jpg?s=612x612&w=0&k=20&c=9vuq6HxeSZfhZ7Jit_2HPVLyoajffb7h_SbWssh_bME=" alt="You" class="message-avatar">` : ''}
    `;
    
    return message;
}

// Send message
function sendMessage(text, image = null) {
    if (!activeConversationId || (!text && !image)) return;
    
    const message = {
        id: `m${Date.now()}`,
        text: text || '',
        image: image,
        sender: 'me',
        time: new Date().toISOString(),
        read: false
    };
    
    if (!messages[activeConversationId]) {
        messages[activeConversationId] = [];
    }
    
    messages[activeConversationId].push(message);
    saveMessages();
    
    // Update conversation
    const conversation = conversations.find(c => c.id === activeConversationId);
    if (conversation) {
        conversation.lastMessage = text || '📷 Image';
        conversation.time = 'just now';
        saveConversations();
        renderConversations();
    }
    
    // Add message to chat
    const chatWindow = document.getElementById('chatWindow');
    const messageEl = createMessageElement(message, conversation);
    chatWindow.appendChild(messageEl);
    
    // Scroll to bottom
    setTimeout(() => {
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }, 100);
    
    // Simulate typing indicator and response
    setTimeout(() => {
        showTypingIndicator();
        setTimeout(() => {
            hideTypingIndicator();
            simulateResponse();
        }, 2000);
    }, 500);
}

// Show typing indicator
function showTypingIndicator() {
    const chatWindow = document.getElementById('chatWindow');
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.id = 'typingIndicator';
    indicator.innerHTML = '<span></span><span></span><span></span>';
    chatWindow.appendChild(indicator);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Hide typing indicator
function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
}

// Simulate response
function simulateResponse() {
    if (!activeConversationId) return;
    
    const conversation = conversations.find(c => c.id === activeConversationId);
    const responses = [
        "That's great! Keep up the good work! 👍",
        "Sounds interesting! Tell me more about it.",
        "I see! Thanks for letting me know.",
        "Awesome! Can't wait to see the results.",
        "Got it! Let me know if you need any help."
    ];
    
    const response = {
        id: `m${Date.now()}`,
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'other',
        time: new Date().toISOString(),
        read: true
    };
    
    if (!messages[activeConversationId]) {
        messages[activeConversationId] = [];
    }
    
    messages[activeConversationId].push(response);
    saveMessages();
    
    // Update conversation
    if (conversation) {
        conversation.lastMessage = response.text;
        conversation.time = 'just now';
        saveConversations();
        renderConversations();
    }
    
    // Add message to chat
    const chatWindow = document.getElementById('chatWindow');
    const messageEl = createMessageElement(response, conversation);
    chatWindow.appendChild(messageEl);
    
    setTimeout(() => {
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }, 100);
}

// Setup event listeners
function setupEventListeners() {
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const attachImage = document.getElementById('attachImage');
    const attachFile = document.getElementById('attachFile');
    const searchInput = document.getElementById('searchConversations');
    const newMessageBtn = document.getElementById('newMessageBtn');
    
    // Send message on button click
    sendBtn.addEventListener('click', () => {
        const text = messageInput.value.trim();
        if (text || attachImage.files.length > 0) {
            handleSendMessage();
        }
    });
    
    // Send message on Enter key
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const text = messageInput.value.trim();
            if (text || attachImage.files.length > 0) {
                handleSendMessage();
            }
        }
    });
    
    // Image attachment
    attachImage.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                sendMessage(messageInput.value.trim(), event.target.result);
                messageInput.value = '';
                attachImage.value = '';
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Search conversations
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (query) {
            const filtered = conversations.filter(conv =>
                conv.name.toLowerCase().includes(query) ||
                conv.lastMessage.toLowerCase().includes(query)
            );
            renderConversations(filtered);
        } else {
            renderConversations();
        }
    });
    
    // New message button
    newMessageBtn.addEventListener('click', () => {
        alert('New message feature coming soon!');
    });
}

// Handle send message
function handleSendMessage() {
    const messageInput = document.getElementById('messageInput');
    const text = messageInput.value.trim();
    
    if (!activeConversationId) {
        alert('Please select a conversation first!');
        return;
    }
    
    const attachImage = document.getElementById('attachImage');
    if (attachImage.files.length > 0) {
        const file = attachImage.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                sendMessage(text, event.target.result);
                messageInput.value = '';
                attachImage.value = '';
            };
            reader.readAsDataURL(file);
        }
    } else if (text) {
        sendMessage(text);
        messageInput.value = '';
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
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
