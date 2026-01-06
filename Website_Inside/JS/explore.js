// Explore page interactive functionality

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

// Post card interactions
document.addEventListener('DOMContentLoaded', () => {
    const postCards = document.querySelectorAll('.explore-post-card');
    
    postCards.forEach((card, index) => {
        // Add staggered animation delay
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Add click handler
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking on action buttons
            if (!e.target.closest('.post-action-btn')) {
                console.log('Viewing post:', card.querySelector('h3').textContent);
                // Could navigate to post detail page or show modal
            }
        });
        
        // Add like/share button handlers
        const likeBtn = card.querySelector('.post-action-btn:first-child');
        const shareBtn = card.querySelector('.post-action-btn:last-child');
        
        if (likeBtn) {
            likeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const icon = likeBtn.querySelector('i');
                const count = likeBtn.textContent.match(/\d+/);
                const currentCount = parseInt(count ? count[0] : 0);
                
                if (icon.classList.contains('fas')) {
                    // Unlike
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    likeBtn.innerHTML = `<i class="far fa-thumbs-up"></i> ${(currentCount - 1).toLocaleString()}`;
                } else {
                    // Like
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    likeBtn.innerHTML = `<i class="fas fa-thumbs-up"></i> ${(currentCount + 1).toLocaleString()}`;
                }
                
                // Add animation
                likeBtn.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    likeBtn.style.transform = 'scale(1)';
                }, 200);
            });
        }
        
        if (shareBtn) {
            shareBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const count = shareBtn.textContent.match(/\d+/);
                const currentCount = parseInt(count ? count[0] : 0);
                shareBtn.innerHTML = `<i class="fas fa-paper-plane"></i> ${(currentCount + 1).toLocaleString()}`;
                
                // Add animation
                shareBtn.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    shareBtn.style.transform = 'scale(1)';
                }, 200);
                
                // Show notification
                showNotification('Post shared!', 'success');
            });
        }
    });
    
    // Topic card interactions
    const topicCards = document.querySelectorAll('.topic-card');
    
    topicCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.addEventListener('click', () => {
            const topic = card.querySelector('h3').textContent;
            console.log('Exploring topic:', topic);
            // Could filter posts by topic or navigate to topic page
            showNotification(`Exploring ${topic}`, 'info');
        });
    });
    
    // Person card interactions
    const personCards = document.querySelectorAll('.person-card');
    
    personCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        
        const followBtn = card.querySelector('.btn-follow');
        
        if (followBtn) {
            followBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                
                if (followBtn.classList.contains('following')) {
                    // Unfollow
                    followBtn.classList.remove('following');
                    followBtn.textContent = 'Follow';
                    showNotification('Unfollowed', 'info');
                } else {
                    // Follow
                    followBtn.classList.add('following');
                    followBtn.textContent = 'Following';
                    showNotification('Following!', 'success');
                }
            });
        }
        
        // Click on card to view profile
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.btn-follow')) {
                const name = card.querySelector('h4').textContent;
                console.log('Viewing profile:', name);
                // Could navigate to profile page
            }
        });
    });
    
    // Smooth scroll for better UX
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Notification function
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
        font-weight: 500;
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

