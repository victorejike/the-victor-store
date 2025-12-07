// Authentication Management
class Auth {
    constructor() {
      this.currentUser = this.loadUser();
      this.init();
    }
  
    init() {
      this.updateAuthUI();
      this.setupAuthEvents();
    }
  
    loadUser() {
      const userData = localStorage.getItem('victorBikes_user');
      return userData ? JSON.parse(userData) : null;
    }
  
    saveUser(user) {
      localStorage.setItem('victorBikes_user', JSON.stringify(user));
    }
  
    login(email, password) {
      const users = JSON.parse(localStorage.getItem('victorBikes_users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        this.currentUser = {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          joined: user.createdAt
        };
        this.saveUser(this.currentUser);
        this.updateAuthUI();
        utils.showToast(`Welcome back, ${user.name}!`, 'success');
        return true;
      }
      
      return false;
    }
  
    register(userData) {
      const users = JSON.parse(localStorage.getItem('victorBikes_users') || '[]');
      
      // Check if user already exists
      if (users.some(u => u.email === userData.email)) {
        return { success: false, message: 'Email already registered' };
      }
  
      const newUser = {
        id: utils.generateId(),
        ...userData,
        createdAt: new Date().toISOString()
      };
  
      users.push(newUser);
      localStorage.setItem('victorBikes_users', JSON.stringify(users));
  
      // Auto login
      this.currentUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        joined: newUser.createdAt
      };
      this.saveUser(this.currentUser);
      this.updateAuthUI();
  
      return { success: true, user: newUser };
    }
  
    logout() {
      this.currentUser = null;
      localStorage.removeItem('victorBikes_user');
      this.updateAuthUI();
      utils.showToast('Logged out successfully', 'info');
    }
  
    isLoggedIn() {
      return this.currentUser !== null;
    }
  
    getCurrentUser() {
      return this.currentUser;
    }
  
    updateAuthUI() {
      const userStatus = document.getElementById('userStatus');
      const loginBtn = document.getElementById('loginBtn');
      
      if (userStatus) {
        if (this.isLoggedIn()) {
          userStatus.textContent = this.currentUser.name.split(' ')[0];
          if (loginBtn) {
            loginBtn.href = 'dashboard.html';
            loginBtn.innerHTML = `
              <i class="fas fa-user"></i>
              <span>${this.currentUser.name.split(' ')[0]}</span>
            `;
          }
        } else {
          userStatus.textContent = 'Login';
          if (loginBtn) {
            loginBtn.href = 'login.html';
            loginBtn.innerHTML = `
              <i class="fas fa-user"></i>
              <span>Login</span>
            `;
          }
        }
      }
    }
  
    setupAuthEvents() {
      // Logout button if exists
      const logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
          this.logout();
          window.location.href = 'index.html';
        });
      }
    }
  
    resetPassword(email) {
      const users = JSON.parse(localStorage.getItem('victorBikes_users') || '[]');
      const user = users.find(u => u.email === email);
      
      if (user) {
        // In a real application, you would send an email here
        utils.showToast(`Password reset link sent to ${email}`, 'success');
        return true;
      }
      
      utils.showToast('No account found with that email', 'error');
      return false;
    }
  
    updateProfile(profileData) {
      if (!this.isLoggedIn()) return false;
  
      // Update current user
      this.currentUser = {
        ...this.currentUser,
        ...profileData
      };
      this.saveUser(this.currentUser);
  
      // Update in users list
      const users = JSON.parse(localStorage.getItem('victorBikes_users') || '[]');
      const userIndex = users.findIndex(u => u.id === this.currentUser.id);
      
      if (userIndex !== -1) {
        users[userIndex] = {
          ...users[userIndex],
          name: profileData.name || users[userIndex].name,
          phone: profileData.phone || users[userIndex].phone
        };
        localStorage.setItem('victorBikes_users', JSON.stringify(users));
      }
  
      this.updateAuthUI();
      utils.showToast('Profile updated successfully', 'success');
      return true;
    }
  
    changePassword(currentPassword, newPassword) {
      if (!this.isLoggedIn()) return false;
  
      const users = JSON.parse(localStorage.getItem('victorBikes_users') || '[]');
      const userIndex = users.findIndex(u => u.id === this.currentUser.id);
      
      if (userIndex === -1) return false;
  
      if (users[userIndex].password !== currentPassword) {
        utils.showToast('Current password is incorrect', 'error');
        return false;
      }
  
      users[userIndex].password = newPassword;
      localStorage.setItem('victorBikes_users', JSON.stringify(users));
  
      utils.showToast('Password changed successfully', 'success');
      return true;
    }
  }
  
  // Initialize auth
  const auth = new Auth();