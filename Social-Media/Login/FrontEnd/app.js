// Mock user database (in a real app, this would be on the server)
const DEFAULT_USERS = [
    { email: 'admin@nexora.com', password: 'Admin@123', name: 'Admin', username: '@admin' },
    { email: 'user@nexora.com', password: 'User@123', name: 'Test User', username: '@testuser' },
    { email: 'demo@nexora.com', password: 'Demo@123', name: 'Demo Account', username: '@demo' }
];

// Load users from localStorage or use default
function loadUsers() {
    try {
        const stored = localStorage.getItem('nexora_users_db');
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error('Error loading users:', e);
    }
    return DEFAULT_USERS;
}

// Save users to localStorage
function saveUsers(usersArray) {
    try {
        localStorage.setItem('nexora_users_db', JSON.stringify(usersArray));
    } catch (e) {
        console.error('Error saving users:', e);
    }
}

let users = loadUsers();

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Password validation function
function isValidPassword(password) {
    // At least 6 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
    return passwordRegex.test(password);
}

// Show error message
function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
    }
}

// Show success animation
function showSuccessAnimation() {
    const button = document.querySelector('form button');
    const originalText = button.innerHTML;
    
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-check"></i> Success!';
    button.style.background = 'linear-gradient(135deg, #17BF63, #10a04a)';
}

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

// Form validation and signup handler
function validateAndSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const username = document.getElementById('signupUsername').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const agree = document.getElementById('signupAgree').checked;
    
    // Clear previous errors
    document.querySelectorAll('.signup-error').forEach(el => el.style.display = 'none');
    
    let isValid = true;
    
    // Validate name
    if (!name) {
        showError('nameError', 'Full name is required');
        isValid = false;
    } else if (name.length < 2) {
        showError('nameError', 'Name must be at least 2 characters');
        isValid = false;
    }
    
    // Validate email
    if (!email) {
        showError('emailError2', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('emailError2', 'Please enter a valid email address');
        isValid = false;
    } else if (users.find(u => u.email === email)) {
        showError('emailError2', 'Email already registered. Try logging in instead!');
        isValid = false;
    }
    
    // Validate username
    if (!username) {
        showError('usernameError', 'Username is required');
        isValid = false;
    } else if (username.length < 3) {
        showError('usernameError', 'Username must be at least 3 characters');
        isValid = false;
    } else if (!/^@?[a-zA-Z0-9_]{3,}$/.test(username.replace('@', ''))) {
        showError('usernameError', 'Username can only contain letters, numbers, and underscores');
        isValid = false;
    } else if (users.find(u => u.username === '@' + username.replace('@', ''))) {
        showError('usernameError', 'Username already taken. Try another one!');
        isValid = false;
    }
    
    // Validate password
    if (!password) {
        showError('passwordError2', 'Password is required');
        isValid = false;
    } else if (password.length < 6) {
        showError('passwordError2', 'Password must be at least 6 characters');
        isValid = false;
    } else if (!isValidPassword(password)) {
        showError('passwordError2', 'Password must contain uppercase, lowercase, and numbers');
        isValid = false;
    }
    
    // Validate confirm password
    if (!confirmPassword) {
        showError('confirmError', 'Please confirm your password');
        isValid = false;
    } else if (password !== confirmPassword) {
        showError('confirmError', 'Passwords do not match');
        isValid = false;
    }
    
    // Validate terms agreement
    if (!agree) {
        showError('agreeError', 'You must agree to our terms and conditions');
        isValid = false;
    }
    
    if (!isValid) {
        return;
    }
    
    // Create new user
    const newUser = {
        email: email,
        password: password,
        name: name,
        username: '@' + username.replace('@', '')
    };
    
    users.push(newUser);
    
    // Save updated users database to localStorage
    saveUsers(users);
    
    // Show success message
    const signupBtn = document.querySelector('#signupForm button');
    signupBtn.disabled = true;
    signupBtn.innerHTML = '<i class="fas fa-check"></i> Account Created!';
    signupBtn.style.background = 'linear-gradient(135deg, #17BF63, #10a04a)';
    
    // Close modal and show success toast
    setTimeout(() => {
        closeSignupModal();
        showSignupSuccess(name);
        // Clear form
        document.getElementById('signupForm').reset();
    }, 1000);
}

// Show signup modal
function handleSignup(event) {
    if (event) event.preventDefault();
    
    let modal = document.getElementById('signupModal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'signupModal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;
        
        modal.innerHTML = `
            <div style="
                background: white;
                border-radius: 16px;
                width: 90%;
                max-width: 450px;
                padding: 40px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                max-height: 90vh;
                overflow-y: auto;
                animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                    <h2 style="margin: 0; color: #14171a; font-size: 28px; font-weight: 800;">
                        <i class="fas fa-user-plus" style="margin-right: 10px; color: #1DA1F2;"></i>Create Account
                    </h2>
                    <button onclick="closeSignupModal()" style="
                        background: none;
                        border: none;
                        font-size: 28px;
                        cursor: pointer;
                        color: #657786;
                        padding: 0;
                        width: 30px;
                        height: 30px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">×</button>
                </div>
                
                <form id="signupForm" onsubmit="validateAndSignup(event)" style="display: flex; flex-direction: column;">
                    <div style="margin-bottom: 18px;">
                        <label for="signupName" style="display: block; margin-bottom: 8px; color: #14171a; font-weight: 600; font-size: 14px;">Full Name</label>
                        <input type="text" id="signupName" placeholder="John Doe" style="
                            width: 100%;
                            padding: 12px;
                            border: 1px solid #e1e8ed;
                            border-radius: 8px;
                            font-size: 14px;
                            transition: all 0.3s ease;
                        " onfocus="this.style.borderColor='#1DA1F2'; this.style.boxShadow='0 0 0 3px rgba(29, 161, 242, 0.1)'" onblur="this.style.borderColor='#e1e8ed'; this.style.boxShadow='none'">
                        <div class="signup-error" id="nameError" style="color: #E0245E; font-size: 13px; margin-top: 5px; display: none;"></div>
                    </div>
                    
                    <div style="margin-bottom: 18px;">
                        <label for="signupEmail" style="display: block; margin-bottom: 8px; color: #14171a; font-weight: 600; font-size: 14px;">Email Address</label>
                        <input type="email" id="signupEmail" placeholder="you@example.com" style="
                            width: 100%;
                            padding: 12px;
                            border: 1px solid #e1e8ed;
                            border-radius: 8px;
                            font-size: 14px;
                            transition: all 0.3s ease;
                        " onfocus="this.style.borderColor='#1DA1F2'; this.style.boxShadow='0 0 0 3px rgba(29, 161, 242, 0.1)'" onblur="this.style.borderColor='#e1e8ed'; this.style.boxShadow='none'">
                        <div class="signup-error" id="emailError2" style="color: #E0245E; font-size: 13px; margin-top: 5px; display: none;"></div>
                    </div>
                    
                    <div style="margin-bottom: 18px;">
                        <label for="signupUsername" style="display: block; margin-bottom: 8px; color: #14171a; font-weight: 600; font-size: 14px;">Username</label>
                        <input type="text" id="signupUsername" placeholder="your_username" style="
                            width: 100%;
                            padding: 12px;
                            border: 1px solid #e1e8ed;
                            border-radius: 8px;
                            font-size: 14px;
                            transition: all 0.3s ease;
                        " onfocus="this.style.borderColor='#1DA1F2'; this.style.boxShadow='0 0 0 3px rgba(29, 161, 242, 0.1)'" onblur="this.style.borderColor='#e1e8ed'; this.style.boxShadow='none'">
                        <div class="signup-error" id="usernameError" style="color: #E0245E; font-size: 13px; margin-top: 5px; display: none;"></div>
                    </div>
                    
                    <div style="margin-bottom: 18px;">
                        <label for="signupPassword" style="display: block; margin-bottom: 8px; color: #14171a; font-weight: 600; font-size: 14px;">Password</label>
                        <input type="password" id="signupPassword" placeholder="Enter a strong password" style="
                            width: 100%;
                            padding: 12px;
                            border: 1px solid #e1e8ed;
                            border-radius: 8px;
                            font-size: 14px;
                            transition: all 0.3s ease;
                        " onfocus="this.style.borderColor='#1DA1F2'; this.style.boxShadow='0 0 0 3px rgba(29, 161, 242, 0.1)'" onblur="this.style.borderColor='#e1e8ed'; this.style.boxShadow='none'">
                        <div style="color: #657786; font-size: 12px; margin-top: 6px;">Min 6 chars, uppercase, lowercase & numbers</div>
                        <div class="signup-error" id="passwordError2" style="color: #E0245E; font-size: 13px; margin-top: 5px; display: none;"></div>
                    </div>
                    
                    <div style="margin-bottom: 18px;">
                        <label for="signupConfirmPassword" style="display: block; margin-bottom: 8px; color: #14171a; font-weight: 600; font-size: 14px;">Confirm Password</label>
                        <input type="password" id="signupConfirmPassword" placeholder="Confirm your password" style="
                            width: 100%;
                            padding: 12px;
                            border: 1px solid #e1e8ed;
                            border-radius: 8px;
                            font-size: 14px;
                            transition: all 0.3s ease;
                        " onfocus="this.style.borderColor='#1DA1F2'; this.style.boxShadow='0 0 0 3px rgba(29, 161, 242, 0.1)'" onblur="this.style.borderColor='#e1e8ed'; this.style.boxShadow='none'">
                        <div class="signup-error" id="confirmError" style="color: #E0245E; font-size: 13px; margin-top: 5px; display: none;"></div>
                    </div>
                    
                    <div style="margin-bottom: 20px; padding: 12px; background: #f7f9fa; border-radius: 8px;">
                        <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; margin: 0; font-weight: 500; color: #14171a; font-size: 14px;">
                            <input type="checkbox" id="signupAgree" style="width: 18px; height: 18px; cursor: pointer;">
                            I agree to the <a href="#" onclick="event.preventDefault()" style="color: #1DA1F2; text-decoration: none; font-weight: 600;">Terms & Conditions</a> and <a href="#" onclick="event.preventDefault()" style="color: #1DA1F2; text-decoration: none; font-weight: 600;">Privacy Policy</a>
                        </label>
                        <div class="signup-error" id="agreeError" style="color: #E0245E; font-size: 13px; margin-top: 8px; display: none;"></div>
                    </div>
                    
                    <button type="submit" style="
                        padding: 12px;
                        border: none;
                        border-radius: 20px;
                        background: linear-gradient(135deg, #1DA1F2, #1a91da);
                        color: white;
                        font-weight: 700;
                        font-size: 15px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        margin-bottom: 12px;
                    " onhover="this.style.transform='translateY(-2px)'">
                        <i class="fas fa-user-plus"></i> Create Account
                    </button>
                    
                    <p style="text-align: center; color: #657786; font-size: 14px; margin: 0;">
                        Already have an account? <a onclick="closeSignupModal()" style="color: #1DA1F2; text-decoration: none; font-weight: 600; cursor: pointer;">Sign in</a>
                    </p>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    modal.style.display = 'flex';
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeSignupModal();
        }
    });
}

// Close signup modal
function closeSignupModal() {
    const modal = document.getElementById('signupModal');
    if (modal) {
        modal.style.display = 'none';
        // Reset form
        const form = document.getElementById('signupForm');
        if (form) form.reset();
        // Reset button
        const btn = document.querySelector('#signupForm button');
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
            btn.style.background = 'linear-gradient(135deg, #1DA1F2, #1a91da)';
        }
    }
}

// Show signup success toast
function showSignupSuccess(name) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #17BF63, #10a04a);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10001;
        animation: slideInRight 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        font-weight: 600;
    `;
    toast.innerHTML = `<i class="fas fa-check-circle"></i> Welcome ${name}! Account created successfully!`;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 4000);
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
    
    // Add animations to page
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideInRight {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
});
