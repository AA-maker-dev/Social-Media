// Mock user database (in a real app, this would be on the server)
const users = [
    { email: 'admin@nexora.com', password: 'Admin@123', name: 'Admin', username: '@admin' },
    { email: 'user@nexora.com', password: 'User@123', name: 'Test User', username: '@testuser' },
    { email: 'demo@nexora.com', password: 'Demo@123', name: 'Demo Account', username: '@demo' }
];

// Form validation and login handler
function validateAndLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    // Clear previous errors
    document.getElementById('emailError').style.display = 'none';
    document.getElementById('passwordError').style.display = 'none';
    
    let isValid = true;
    
    // Validate email
    if (!email) {
        showError('emailError', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('emailError', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate password
    if (!password) {
        showError('passwordError', 'Password is required');
        isValid = false;
    } else if (password.length < 6) {
        showError('passwordError', 'Password must be at least 6 characters');
        isValid = false;
    }
    
    if (!isValid) {
        return;
    }
    
    // Authenticate user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Store user session
        const userSession = {
            email: user.email,
            name: user.name,
            username: user.username,
            loginTime: new Date().toISOString()
        };
        
        // Save to localStorage
        localStorage.setItem('userSession', JSON.stringify(userSession));
        
        if (remember) {
            localStorage.setItem('rememberUser', JSON.stringify({ email: user.email }));
        }
        
        // Show success message
        showSuccessAnimation();
        
        // Redirect to dashboard after 1 second
        setTimeout(() => {
            window.location.href = '../../Website_Inside/HTML/index.html';
        }, 1000);
    } else {
        showError('emailError', 'Invalid email or password');
    }
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show error message
function showError(elementId, message) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.style.display = 'block';
}

// Show success animation
function showSuccessAnimation() {
    const button = document.querySelector('form button');
    const originalText = button.innerHTML;
    
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-check"></i> Success!';
    button.style.background = 'linear-gradient(135deg, #17BF63, #10a04a)';
}

// Social login handler
function socialLogin(provider) {
    alert(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login is not configured yet. Please use email login for now.`);
    // In a real app, this would handle OAuth authentication
}

// Handle forgot password
function handleForgotPassword(event) {
    event.preventDefault();
    alert('Password reset feature will be available soon. Please contact support.');
    // In a real app, this would open a modal or redirect to password reset page
}

// Handle signup link
function handleSignup(event) {
    event.preventDefault();
    alert('Sign up feature will be available soon. Please contact the administrator.');
    // In a real app, this would redirect to signup page
}

// Check if user is already logged in
function checkExistingSession() {
    const userSession = localStorage.getItem('userSession');
    if (userSession) {
        // User is already logged in, redirect to dashboard
        window.location.href = '../../Website_Inside/HTML/index.html';
    }
}

// Load remembered email if exists
function loadRememberedEmail() {
    const remembered = localStorage.getItem('rememberUser');
    if (remembered) {
        try {
            const data = JSON.parse(remembered);
            document.getElementById('email').value = data.email;
            document.getElementById('remember').checked = true;
        } catch (e) {
            console.error('Error loading remembered email:', e);
        }
    }
}

// Demo credentials hint
function showDemoCredentials() {
    console.log('Demo Credentials:');
    users.forEach(user => {
        console.log(`Email: ${user.email} | Password: ${user.password}`);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    checkExistingSession();
    loadRememberedEmail();
    
    // Log demo credentials to console
    showDemoCredentials();
    
    // Add enter key support for password field
    document.getElementById('password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('loginForm').dispatchEvent(new Event('submit'));
        }
    });
    
    // Add visual feedback to input fields
    const inputs = document.querySelectorAll('form input[type="email"], form input[type="password"]');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            const errorId = this.name === 'email' ? 'emailError' : 'passwordError';
            document.getElementById(errorId).style.display = 'none';
        });
        
        input.addEventListener('input', function() {
            const errorId = this.name === 'email' ? 'emailError' : 'passwordError';
            document.getElementById(errorId).style.display = 'none';
        });
    });
});
