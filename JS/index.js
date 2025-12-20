// Post Data Pool
const authors = [
    { name: 'Alex Turner', handle: '@alexturner' },
    { name: 'Emma Wilson', handle: '@emmawilson' },
    { name: 'John Developer', handle: '@johndev' },
    { name: 'Sarah Chen', handle: '@sarahchen' },
    { name: 'Mike Johnson', handle: '@mikej' },
    { name: 'Lisa Anderson', handle: '@lisaa' },
    { name: 'David Brown', handle: '@davidbrown' },
    { name: 'Jennifer Lee', handle: '@jenlee' }
];

const postContents = [
    'Just launched my new portfolio website! Check it out and let me know what you think. Built with HTML5, CSS3, and JavaScript. #webdesign #webdeveloper',
    'Learning responsive web design is essential in 2025. Here are my top tips for creating mobile-first layouts 📱',
    '🎉 Excited to announce that our team just hit 1 million downloads! Thank you all for the amazing support. Let\'s build something incredible together! 🚀',
    'Finally completed my first React project! It\'s been a great learning experience. #ReactJS #FrontendDevelopment',
    'Coffee and coding - the perfect combination ☕💻 Working on some interesting JavaScript challenges today',
    'Web development is more exciting than ever! New frameworks, tools, and technologies emerge every day. What\'s your favorite? #WebDev',
    'Just discovered the power of CSS Grid! Game-changer for creating complex layouts. #CSS #WebDesign',
    'Collaborating with amazing designers on a new UI project. Design and development work best together! 🎨',
    'APIs are like the backbone of modern web applications. Building scalable REST APIs today #BackendDevelopment',
    'Version control is essential! Always commit with meaningful messages. Git tips and tricks 💡 #Git #Development'
];

const timeAgo = [
    '1 hour ago',
    '2 hours ago',
    '3 hours ago',
    '4 hours ago',
    '5 hours ago',
    '6 hours ago',
    '1 day ago',
    '2 days ago'
];

let postPage = 0;

// Function to generate random post
function generatePost() {
    const author = authors[Math.floor(Math.random() * authors.length)];
    const content = postContents[Math.floor(Math.random() * postContents.length)];
    const time = timeAgo[Math.floor(Math.random() * timeAgo.length)];
    const likes = Math.floor(Math.random() * 1000) + 50;
    const shares = Math.floor(Math.random() * 200) + 10;

    return {
        author: author.name,
        handle: author.handle,
        content: content,
        time: time,
        likes: likes,
        shares: shares
    };
}

// Function to create post HTML
function createPostHTML(post) {
    return `
        <div class="post">
            <div class="post-header">
                <img src="../Images/avatar1.jpg" alt="User Avatar" class="avatar-sm">
                <div class="post-info">
                    <h4>${post.author}</h4>
                    <span class="post-time">${post.time}</span>
                </div>
                <button class="btn-more"><i class="fas fa-ellipsis-h"></i></button>
            </div>
            <div class="post-content">
                <p>${post.content}</p>
            </div>
            <div class="post-stats">
                <span><i class="fas fa-heart"></i> ${post.likes} likes</span>
                <span><i class="fas fa-share"></i> ${post.shares} shares</span>
            </div>
            <div class="post-actions">
                <button class="action-btn"><i class="far fa-heart"></i> Like</button>
                <button class="action-btn"><i class="far fa-bookmark"></i> Bookmark</button>
                <button class="action-btn"><i class="far fa-share"></i> Share</button>
            </div>
        </div>
    `;
}

// Function to load more posts
function loadMorePosts() {
    const container = document.getElementById('posts-container');
    const loading = document.getElementById('loading');

    // Show loading indicator
    loading.style.display = 'flex';

    // Simulate network delay
    setTimeout(() => {
        // Generate 3 new posts
        for (let i = 0; i < 3; i++) {
            const post = generatePost();
            const postHTML = createPostHTML(post);
            container.insertAdjacentHTML('beforeend', postHTML);
        }

        // Attach event listeners to new posts
        attachPostEventListeners();

        // Hide loading indicator
        loading.style.display = 'none';

        postPage++;
    }, 600);
}

// Function to attach event listeners to action buttons
function attachPostEventListeners() {
    const actionButtons = document.querySelectorAll('.action-btn');

    actionButtons.forEach(button => {
        // Remove existing listeners to prevent duplicates
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);

        newButton.addEventListener('click', (e) => {
            // Handle Like button
            if (newButton.innerHTML.includes('fa-heart')) {
                newButton.classList.toggle('liked');

                const postStats = newButton.closest('.post').querySelector('.post-stats');
                if (postStats) {
                    const likeSpan = postStats.querySelector('span:first-child');
                    if (likeSpan) {
                        let likeCount = parseInt(likeSpan.textContent);
                        if (newButton.classList.contains('liked')) {
                            likeCount++;
                            newButton.innerHTML = '<i class="fas fa-heart"></i> Unlike';
                        } else {
                            likeCount--;
                            newButton.innerHTML = '<i class="far fa-heart"></i> Like';
                        }
                        likeSpan.innerHTML = `<i class="fas fa-heart"></i> ${likeCount} likes`;
                    }
                }

                // Heart animation
                const heart = newButton.querySelector('i');
                heart.style.animation = 'none';
                setTimeout(() => {
                    heart.style.animation = 'heartBeat 0.6s';
                }, 10);
            }

            // Handle Bookmark button
            if (newButton.innerHTML.includes('fa-bookmark')) {
                newButton.classList.toggle('bookmarked');
                if (newButton.classList.contains('bookmarked')) {
                    newButton.innerHTML = '<i class="fas fa-bookmark"></i> Bookmarked';
                } else {
                    newButton.innerHTML = '<i class="far fa-bookmark"></i> Bookmark';
                }
            }

            // Handle Share button
            if (newButton.innerHTML.includes('fa-share')) {
                newButton.classList.toggle('shared');
                if (newButton.classList.contains('shared')) {
                    newButton.innerHTML = '<i class="fas fa-share"></i> Shared';
                } else {
                    newButton.innerHTML = '<i class="far fa-share"></i> Share';
                }
            }
        });
    });
}

// Infinite scroll functionality
window.addEventListener('scroll', () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;

    // If user is near the bottom (within 500px)
    if (scrollTop + clientHeight >= scrollHeight - 500) {
        loadMorePosts();
    }
});

// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Post Input Focus Effect
const postInput = document.querySelector('.post-input');
if (postInput) {
    postInput.addEventListener('focus', () => {
        postInput.style.boxShadow = '0 0 0 2px rgba(29, 161, 242, 0.2)';
    });

    postInput.addEventListener('blur', () => {
        postInput.style.boxShadow = 'none';
    });
}

// Add CSS animation for heart beat
const style = document.createElement('style');
style.innerHTML = `
    @keyframes heartBeat {
        0% { transform: scale(1); }
        25% { transform: scale(1.3); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// Load initial posts on page load
document.addEventListener('DOMContentLoaded', () => {
    // Load 3 initial posts
    for (let i = 0; i < 3; i++) {
        const post = generatePost();
        const postHTML = createPostHTML(post);
        document.getElementById('posts-container').insertAdjacentHTML('beforeend', postHTML);
    }
    attachPostEventListeners();
});

document.addEventListener("DOMContentLoaded", () => {
    const posts = [
        { user: "Abhi", content: "Exploring Nexora is amazing!", likes: 120 },
        { user: "Maya", content: "Loving the new UI design ✨", likes: 95 },
        { user: "Ravi", content: "JavaScript makes everything interactive!", likes: 80 }
    ];

    const topics = ["Web Development", "UI/UX Design", "JavaScript", "AI Trends"];

    const people = [
        { name: "Abhi", role: "Frontend Developer" },
        { name: "Maya", role: "Designer" },
        { name: "Ravi", role: "Engineer" }
    ];

    // Render posts
    const postsContainer = document.querySelector(".posts-container");
    posts.forEach(post => {
        const div = document.createElement("div");
        div.classList.add("post");
        div.innerHTML = `
            <p><strong>${post.user}</strong>: ${post.content}</p>
            <span>❤️ ${post.likes} likes</span>
        `;
        postsContainer.appendChild(div);
    });

    // Render topics
    const topicsList = document.querySelector(".topics-list");
    topics.forEach(topic => {
        const li = document.createElement("li");
        li.textContent = `#${topic}`;
        topicsList.appendChild(li);
    });

    // Render people
    const peopleContainer = document.querySelector(".people-container");
    people.forEach(person => {
        const div = document.createElement("div");
        div.classList.add("person");
        div.innerHTML = `
            <i class="fas fa-user"></i>
            <p><strong>${person.name}</strong> - ${person.role}</p>
        `;
        peopleContainer.appendChild(div);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const chatWindow = document.getElementById("chat-window");
    const messageInput = document.getElementById("message-input");
    const sendBtn = document.getElementById("send-btn");

    // Sample conversation
    const messages = [
        { sender: "Maya", text: "Hey Abhi! How’s your project going?" },
        { sender: "You", text: "Pretty good, just working on Nexora 🚀" },
        { sender: "Maya", text: "That’s awesome! Can’t wait to see it." }
    ];

    // Render initial messages
    messages.forEach(msg => addMessage(msg.sender, msg.text));

    // Send new message
    sendBtn.addEventListener("click", () => {
        const text = messageInput.value.trim();
        if (text !== "") {
            addMessage("You", text);
            messageInput.value = "";

            // Simulate reply
            setTimeout(() => {
                addMessage("Maya", "Got it 👍");
            }, 1000);
        }
    });

    function addMessage(sender, text) {
        const div = document.createElement("div");
        div.classList.add("message", sender === "You" ? "sent" : "received");
        div.innerHTML = `<p><strong>${sender}:</strong> ${text}</p>`;
        chatWindow.appendChild(div);
        chatWindow.scrollTop = chatWindow.scrollHeight; // auto-scroll
    }
});