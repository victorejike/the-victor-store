// Dashboard Management
class Dashboard {
    constructor() {
      this.init();
    }
  
    init() {
      this.checkAuthentication();
      this.loadUserProfile();
      this.setupNavigation();
      this.setupEventListeners();
    }
  
    checkAuthentication() {
      if (!auth.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
      }
    }
  
    loadUserProfile() {
      const user = auth.getCurrentUser();
      
      if (!user) return;
  
      // Update profile information
      const elements = {
        userName: document.getElementById('userName'),
        userEmail: document.getElementById('userEmail'),
        memberSince: document.getElementById('memberSince'),
        profileName: document.getElementById('profileName'),
        profileEmail: document.getElementById('profileEmail'),
        profilePhone: document.getElementById('profilePhone'),
        profileSince: document.getElementById('profileSince'),
        editName: document.getElementById('editName'),
        editPhone: document.getElementById('editPhone')
      };
  
      // Format member since date
      const joinDate = new Date(user.joined);
      const formattedDate = joinDate.toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
  
      // Update all elements
      Object.entries(elements).forEach(([id, element]) => {
        if (element) {
          switch(id) {
            case 'userName':
            case 'profileName':
              element.textContent = user.name;
              break;
            case 'userEmail':
            case 'profileEmail':
              element.textContent = user.email;
              break;
            case 'profilePhone':
              element.textContent = user.phone;
              break;
            case 'memberSince':
            case 'profileSince':
              element.textContent = `Member since ${formattedDate}`;
              break;
            case 'editName':
              element.value = user.name;
              break;
            case 'editPhone':
              element.value = user.phone;
              break;
          }
        }
      });
    }
  
    setupNavigation() {
      const navItems = document.querySelectorAll('.nav-item');
      const sections = document.querySelectorAll('.dashboard-section');
  
      navItems.forEach(item => {
        item.addEventListener('click', (e) => {
          if (item.classList.contains('logout')) return;
  
          e.preventDefault();
          const targetId = item.getAttribute('href').substring(1);
  
          // Update active nav item
          navItems.forEach(navItem => navItem.classList.remove('active'));
          item.classList.add('active');
  
          // Show corresponding section
          sections.forEach(section => {
            section.classList.toggle('active', section.id === targetId);
          });
  
          // Scroll to top of section
          const targetSection = document.getElementById(targetId);
          if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
          }
        });
      });
    }
  
    setupEventListeners() {
      // Profile Edit
      const editProfileBtn = document.getElementById('editProfileBtn');
      const cancelEditBtn = document.getElementById('cancelEditBtn');
      const profileForm = document.getElementById('profileForm');
  
      if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
          this.toggleEditProfile(true);
        });
      }
  
      if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', () => {
          this.toggleEditProfile(false);
        });
      }
  
      if (profileForm) {
        profileForm.addEventListener('submit', (e) => this.updateProfile(e));
      }
  
      // Address Management
      const addAddressBtn = document.getElementById('addAddressBtn');
      const cancelAddressBtn = document.getElementById('cancelAddressBtn');
      const addressForm = document.getElementById('addressForm');
  
      if (addAddressBtn) {
        addAddressBtn.addEventListener('click', () => {
          this.toggleAddAddress(true);
        });
      }
  
      if (cancelAddressBtn) {
        cancelAddressBtn.addEventListener('click', () => {
          this.toggleAddAddress(false);
        });
      }
  
      if (addressForm) {
        addressForm.addEventListener('submit', (e) => this.saveAddress(e));
      }
  
      // Password Change
      const changePasswordBtn = document.getElementById('changePasswordBtn');
      const cancelPasswordBtn = document.getElementById('cancelPasswordBtn');
      const passwordForm = document.getElementById('passwordForm');
  
      if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', () => {
          this.toggleChangePassword(true);
        });
      }
  
      if (cancelPasswordBtn) {
        cancelPasswordBtn.addEventListener('click', () => {
          this.toggleChangePassword(false);
        });
      }
  
      if (passwordForm) {
        passwordForm.addEventListener('submit', (e) => this.changePassword(e));
      }
  
      // Logout
      const logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
          auth.logout();
        });
      }
  
      // Delete Account
      const deleteAccountBtn = document.getElementById('deleteAccountBtn');
      if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', () => {
          this.deleteAccount();
        });
      }
    }
  
    toggleEditProfile(show) {
      const profileSection = document.querySelector('.profile-details');
      const editForm = document.getElementById('editProfileForm');
  
      if (show) {
        profileSection.style.display = 'none';
        editForm.style.display = 'block';
      } else {
        profileSection.style.display = 'grid';
        editForm.style.display = 'none';
      }
    }
  
    updateProfile(e) {
      e.preventDefault();
      
      const name = document.getElementById('editName').value.trim();
      const phone = document.getElementById('editPhone').value.trim();
  
      if (!name || !phone) {
        utils.showToast('Please fill in all fields', 'error');
        return;
      }
  
      if (!utils.validatePhone(phone)) {
        utils.showToast('Please enter a valid Nigerian phone number', 'error');
        return;
      }
  
      const success = auth.updateProfile({ name, phone });
      
      if (success) {
        this.loadUserProfile();
        this.toggleEditProfile(false);
      }
    }
  
    toggleAddAddress(show) {
      const addressesList = document.getElementById('userAddresses');
      const addForm = document.getElementById('addAddressForm');
  
      if (show) {
        addressesList.style.display = 'none';
        addForm.style.display = 'block';
      } else {
        addressesList.style.display = 'block';
        addForm.style.display = 'none';
      }
    }
  
    saveAddress(e) {
      e.preventDefault();
      
      const label = document.getElementById('addressLabel').value.trim();
      const street = document.getElementById('addressStreet').value.trim();
      const city = document.getElementById('addressCity').value.trim();
      const state = document.getElementById('addressState').value.trim();
  
      if (!label || !street || !city || !state) {
        utils.showToast('Please fill in all fields', 'error');
        return;
      }
  
      const addressData = {
        id: utils.generateId(),
        label,
        street,
        city,
        state,
        default: false
      };
  
      // Save address to localStorage
      const addresses = JSON.parse(localStorage.getItem('victorBikes_addresses') || '[]');
      addresses.push(addressData);
      localStorage.setItem('victorBikes_addresses', JSON.stringify(addresses));
  
      utils.showToast('Address saved successfully', 'success');
      this.toggleAddAddress(false);
      this.loadAddresses();
    }
  
    loadAddresses() {
      const addressesList = document.getElementById('userAddresses');
      if (!addressesList) return;
  
      const addresses = JSON.parse(localStorage.getItem('victorBikes_addresses') || '[]');
      const user = auth.getCurrentUser();
      const userAddresses = addresses.filter(addr => addr.userId === user?.id);
  
      if (userAddresses.length === 0) {
        addressesList.innerHTML = `
          <div class="empty-state">
            <i class="fas fa-map-marker-alt"></i>
            <h3>No addresses saved</h3>
            <p>Add your delivery addresses for faster checkout</p>
          </div>
        `;
      } else {
        addressesList.innerHTML = userAddresses.map(address => `
          <div class="address-card">
            <div class="address-info">
              <h4>${address.label} ${address.default ? '<span class="badge">Default</span>' : ''}</h4>
              <p>${address.street}</p>
              <p>${address.city}, ${address.state}</p>
            </div>
            <div class="address-actions">
              ${!address.default ? `
                <button class="btn btn-secondary btn-sm" onclick="dashboard.setDefaultAddress('${address.id}')">
                  Set as Default
                </button>
              ` : ''}
              <button class="btn btn-danger btn-sm" onclick="dashboard.deleteAddress('${address.id}')">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        `).join('');
      }
    }
  
    setDefaultAddress(addressId) {
      const addresses = JSON.parse(localStorage.getItem('victorBikes_addresses') || '[]');
      
      // Remove default from all addresses
      addresses.forEach(addr => {
        addr.default = addr.id === addressId;
      });
  
      localStorage.setItem('victorBikes_addresses', JSON.stringify(addresses));
      this.loadAddresses();
      utils.showToast('Default address updated', 'success');
    }
  
    deleteAddress(addressId) {
      if (!confirm('Are you sure you want to delete this address?')) return;
  
      const addresses = JSON.parse(localStorage.getItem('victorBikes_addresses') || '[]');
      const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
      
      localStorage.setItem('victorBikes_addresses', JSON.stringify(updatedAddresses));
      this.loadAddresses();
      utils.showToast('Address deleted', 'success');
    }
  
    toggleChangePassword(show) {
      const settingsCard = document.querySelector('.settings-card');
      const passwordForm = document.getElementById('changePasswordForm');
  
      if (show) {
        settingsCard.style.display = 'none';
        passwordForm.style.display = 'block';
      } else {
        settingsCard.style.display = 'block';
        passwordForm.style.display = 'none';
      }
    }
  
    changePassword(e) {
      e.preventDefault();
      
      const currentPassword = document.getElementById('currentPassword').value;
      const newPassword = document.getElementById('newPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
  
      if (!currentPassword || !newPassword || !confirmPassword) {
        utils.showToast('Please fill in all fields', 'error');
        return;
      }
  
      if (newPassword !== confirmPassword) {
        utils.showToast('New passwords do not match', 'error');
        return;
      }
  
      if (newPassword.length < 8) {
        utils.showToast('New password must be at least 8 characters', 'error');
        return;
      }
  
      const success = auth.changePassword(currentPassword, newPassword);
      
      if (success) {
        this.toggleChangePassword(false);
        passwordForm.reset();
      }
    }
  
    deleteAccount() {
      if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
  
      // Get current user
      const user = auth.getCurrentUser();
      
      if (!user) return;
  
      // Remove user from users list
      const users = JSON.parse(localStorage.getItem('victorBikes_users') || '[]');
      const updatedUsers = users.filter(u => u.email !== user.email);
      localStorage.setItem('victorBikes_users', JSON.stringify(updatedUsers));
  
      // Remove user data
      localStorage.removeItem('victorBikes_user');
  
      // Logout
      auth.logout();
      
      utils.showToast('Account deleted successfully', 'success');
      
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    }
  
    loadOrders() {
      const ordersList = document.getElementById('userOrders');
      if (!ordersList) return;
  
      const orders = JSON.parse(localStorage.getItem('victorBikes_orders') || '[]');
      const user = auth.getCurrentUser();
      const userOrders = orders.filter(order => order.customer && order.customer.email === user.email);
  
      app.updateDashboardUI(userOrders, []);
    }
  
    loadBookings() {
      const bookingsList = document.getElementById('userBookings');
      if (!bookingsList) return;
  
      const bookings = JSON.parse(localStorage.getItem('victorBikes_bookings') || '[]');
      const user = auth.getCurrentUser();
      const userBookings = bookings.filter(booking => booking.phone === user.phone);
  
      app.updateDashboardUI([], userBookings);
    }
  }
  
  // Initialize dashboard
  const dashboard = new Dashboard();