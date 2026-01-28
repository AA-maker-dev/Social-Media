// 🔍 DIAGNOSTIC SCRIPT - Run in Browser Console to debug text post issue

// 1. Check if postInput element exists
console.log('=== ELEMENT CHECKS ===');
const postInput = document.getElementById('postInput');
console.log('postInput element:', postInput);
console.log('postInput.value:', postInput?.value);
console.log('postInput.id:', postInput?.id);
console.log('postInput.type:', postInput?.type);
console.log('postInput is visible:', postInput && postInput.offsetParent !== null);

// 2. Check post button
const postBtn = document.getElementById('post-btn');
console.log('\npostBtn element:', postBtn);
console.log('postBtn has click listener:', postBtn && postBtn.onclick !== null);

// 3. Try typing and check value
console.log('\n=== TEST: Type something below and run this again ===');
setTimeout(() => {
    console.log('Current postInput value after 2 seconds:', postInput?.value);
}, 2000);

// 4. Manual click test
console.log('\n=== MANUAL POST CREATION TEST ===');
function testPostCreation() {
    if (!postInput) {
        console.error('❌ postInput not found');
        return;
    }
    
    // Set a test value
    postInput.value = 'Test post from console';
    console.log('Set postInput.value to:', postInput.value);
    
    // Simulate click
    postBtn.click();
    console.log('Clicked postBtn');
}

// Run test
// testPostCreation();

console.log('\n=== QUICK CHECKS ===');
console.log('User session exists:', !!localStorage.getItem('userSession'));
console.log('User session:', JSON.parse(localStorage.getItem('userSession') || '{}'));

// Check if post was created
console.log('\n=== POSTS IN STORAGE ===');
const storageKey = Object.keys(localStorage).find(key => key.includes('posts'));
console.log('Posts storage key:', storageKey);
if (storageKey) {
    const posts = JSON.parse(localStorage.getItem(storageKey) || '[]');
    console.log('Number of posts:', posts.length);
    console.log('Latest post:', posts[0]);
}

// Check CSS
console.log('\n=== CSS CHECKS ===');
const styles = window.getComputedStyle(postInput);
console.log('postInput display:', styles.display);
console.log('postInput visibility:', styles.visibility);
console.log('postInput pointer-events:', styles.pointerEvents);

// Try to focus and type
console.log('\n=== MANUAL INPUT TEST ===');
console.log('Attempting to focus postInput...');
postInput.focus();
postInput.value = 'Manual test';
console.log('postInput value after manual set:', postInput.value);
console.log('postInput focused:', document.activeElement === postInput);
