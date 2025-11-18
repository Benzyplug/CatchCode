class AuthSystem {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('learnsphere_users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('learnsphere_current_user')) || null;
        this.init();
    }

    init() {
        // Check if user is logged in
        if (this.currentUser) {
            this.updateUIForLoggedInUser();
        }
        
        // Add event listeners for auth forms
        this.setupAuthForms();
    }

    setupAuthForms() {
        // Signup form
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }

        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }
    }

    handleSignup(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const userData = {
            id: this.generateId(),
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
            fullName: formData.get('fullName'),
            joinDate: new Date().toISOString(),
            progress: {
                completedLessons: 0,
                totalXP: 0,
                currentStreak: 0,
                longestStreak: 0
            },
            achievements: [],
            preferences: {
                theme: 'dark',
                notifications: true
            }
        };

        // Check if user already exists
        if (this.users.find(u => u.email === userData.email)) {
            this.showNotification('User with this email already exists!', 'error');
            return;
        }

        this.users.push(userData);
        this.saveUsers();
        this.showNotification('Account created successfully! Please login.', 'success');
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    }

    handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');

        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = user;
            localStorage.setItem('learnsphere_current_user', JSON.stringify(user));
            this.showNotification(`Welcome back, ${user.username}!`, 'success');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            this.showNotification('Invalid email or password!', 'error');
        }
    }

    handleLogout() {
        this.currentUser = null;
        localStorage.removeItem('learnsphere_current_user');
        this.showNotification('Logged out successfully!', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }

    updateUIForLoggedInUser() {
        const authLinks = document.querySelector('.nav-menu');
        if (authLinks && this.currentUser) {
            authLinks.innerHTML = `
                <a href="dashboard.html" class="nav-link">Dashboard</a>
                <a href="learn.html" class="nav-link">Learn</a>
                <a href="practice.html" class="nav-link">Practice</a>
                <a href="profile.html" class="nav-link">Profile</a>
                <button id="logoutBtn" class="nav-link signup-btn">Logout</button>
            `;
            this.setupAuthForms();
        }
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    saveUsers() {
        localStorage.setItem('learnsphere_users', JSON.stringify(this.users));
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'info'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
}

// Initialize auth system
document.addEventListener('DOMContentLoaded', () => {
    new AuthSystem();
});
