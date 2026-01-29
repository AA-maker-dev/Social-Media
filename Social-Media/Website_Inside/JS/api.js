/**
 * API Service Layer
 * Centralized module for all backend API calls
 */

const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') 
    ? 'http://localhost:5000/api' 
    : 'https://api.viteflo.com/api';

class APIService {
    constructor() {
        this.token = localStorage.getItem('authToken');
    }

    // Helper method to get headers
    getHeaders(includeAuth = true) {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (includeAuth && this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    // Helper method for API calls
    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers: {
                    ...this.getHeaders(options.auth !== false),
                    ...options.headers
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.message || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Update token
    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('authToken', token);
        } else {
            localStorage.removeItem('authToken');
        }
    }

    // ===============================================
    // AUTHENTICATION APIs
    // ===============================================

    async login(email, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            auth: false,
            body: JSON.stringify({ email, password })
        });

        if (data.token) {
            this.setToken(data.token);
            // Store user session
            localStorage.setItem('userSession', JSON.stringify(data.user));
        }

        return data;
    }

    async signup(email, password, name, username) {
        const data = await this.request('/auth/signup', {
            method: 'POST',
            auth: false,
            body: JSON.stringify({ email, password, name, username })
        });

        if (data.token) {
            this.setToken(data.token);
            // Store user session
            localStorage.setItem('userSession', JSON.stringify(data.user));
        }

        return data;
    }

    logout() {
        this.setToken(null);
        localStorage.removeItem('userSession');
        localStorage.removeItem('rememberUser');
    }

    // ===============================================
    // USER APIs
    // ===============================================

    async getAllUsers() {
        return await this.request('/users');
    }

    async getUserById(userId) {
        return await this.request(`/users/${userId}`);
    }

    async updateUser(userId, data) {
        return await this.request(`/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async getUsersByRole(role) {
        return await this.request(`/users/role/${role}`);
    }

    // ===============================================
    // POST APIs
    // ===============================================

    async getAllPosts() {
        return await this.request('/posts');
    }

    async getPostById(postId) {
        return await this.request(`/posts/${postId}`);
    }

    async createPost(caption, userId) {
        return await this.request('/posts', {
            method: 'POST',
            body: JSON.stringify({ caption, user_id: userId })
        });
    }

    async likePost(postId) {
        return await this.request(`/posts/${postId}/like`, {
            method: 'POST'
        });
    }

    async addReaction(postId, reactionType) {
        return await this.request(`/posts/${postId}/reaction`, {
            method: 'POST',
            body: JSON.stringify({ reaction_type: reactionType })
        });
    }

    async getUserPosts(userId) {
        return await this.request(`/posts/user/${userId}`);
    }

    // ===============================================
    // COMMENT APIs
    // ===============================================

    async getPostComments(postId) {
        return await this.request(`/comments/post/${postId}`);
    }

    async addComment(postId, userId, text) {
        return await this.request('/comments', {
            method: 'POST',
            body: JSON.stringify({ post_id: postId, user_id: userId, text })
        });
    }

    async deleteComment(commentId) {
        return await this.request(`/comments/${commentId}`, {
            method: 'DELETE'
        });
    }

    // ===============================================
    // HEALTH CHECK
    // ===============================================

    async checkHealth() {
        return await this.request('/health', { auth: false });
    }
}

// Export singleton instance
const apiService = new APIService();
export default apiService;
