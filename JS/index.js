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

// Like Button Functionality
const likeButtons = document.querySelectorAll('.action-btn');
likeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        // Handle Like button
        if (button.innerHTML.includes('fa-heart')) {
            button.classList.toggle('liked');
            
            const postStats = button.closest('.post').querySelector('.post-stats');
            if (postStats) {
                const likeSpan = postStats.querySelector('span:first-child');
                if (likeSpan) {
                    let likeCount = parseInt(likeSpan.textContent);
                    if (button.classList.contains('liked')) {
                        likeCount++;
                        button.innerHTML = '<i class="fas fa-heart"></i> Unlike';
                    } else {
                        likeCount--;
                        button.innerHTML = '<i class="far fa-heart"></i> Like';
                    }
                    likeSpan.innerHTML = `<i class="fas fa-heart"></i> ${likeCount} likes`;
                }
            }
            
            // Heart animation
            const heart = button.querySelector('i');
            heart.style.animation = 'none';
            setTimeout(() => {
                heart.style.animation = 'heartBeat 0.6s';
            }, 10);
        }
        
        // Handle Bookmark button
        if (button.innerHTML.includes('fa-bookmark')) {
            button.classList.toggle('bookmarked');
            if (button.classList.contains('bookmarked')) {
                button.innerHTML = '<i class="fas fa-bookmark"></i> Bookmarked';
            } else {
                button.innerHTML = '<i class="far fa-bookmark"></i> Bookmark';
            }
        }
        
        // Handle Share button
        if (button.innerHTML.includes('fa-share')) {
            button.classList.toggle('shared');
            if (button.classList.contains('shared')) {
                button.innerHTML = '<i class="fas fa-share"></i> Shared';
            } else {
                button.innerHTML = '<i class="far fa-share"></i> Share';
            }
        }
    });
});

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

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
    });
});

// Like button animation
document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (btn.innerHTML.includes('heart')) {
            const heart = btn.querySelector('i');
            heart.style.animation = 'none';
            setTimeout(() => {
                heart.style.animation = 'heartBeat 0.6s';
            }, 10);
        }
    });
});

// Add CSS animation
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
