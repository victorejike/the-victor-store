// Admin Dashboard Management
class AdminDashboard {
    constructor() {
      this.currentUser = null;
      this.currentPage = 1;
      this.pageSize = 10;
      this.selectedProducts = new Set();
      this.init();
    }
  
    init() {
      this.checkAuthentication();
      this.setupEventListeners();
      this.loadDashboard();
      this.setupCharts();
      this.startAutoRefresh();
    }
  
    checkAuthentication() {
      const adminData = localStorage.getItem('victorBikes_admin');
      
      if (!adminData) {
        this.showLoginModal();
        return;
      }
      
      try {
        this.currentUser = JSON.parse(adminData);
        
        // Set default admin if none exists
        if (!this.currentUser) {
          const defaultAdmin = {
            id: 'admin_001',
            username: 'victor',
            name: 'Victor Ejike',
            email: 'victor@victorbikes.com',
            role: 'administrator',
            createdAt: new Date().toISOString()
          };
          
          localStorage.setItem('victorBikes_admin', JSON.stringify(defaultAdmin));
          localStorage.setItem('victorBikes_admin_users', JSON.stringify([defaultAdmin]));
          this.currentUser = defaultAdmin;
        }
        
        this.updateUserUI();
      } catch (error) {
        this.showLoginModal();
      }
    }
  
    showLoginModal() {
      const modal = document.getElementById('adminLoginModal');
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
      
      // Setup login form
      const loginForm = document.getElementById('adminLoginForm');
      if (loginForm) {
        loginForm.addEventListener('submit', (e) => this.handleAdminLogin(e));
      }
    }
  
    handleAdminLogin(e) {
      e.preventDefault();
      
      const username = document.getElementById('adminUsername').value;
      const password = document.getElementById('adminPassword').value;
      
      // Default admin credentials
      if (username === 'victor' && password === 'admin123') {
        const adminData = {
          id: 'admin_001',
          username: 'victor',
          name: 'Victor Ejike',
          email: 'victor@victorbikes.com',
          role: 'administrator',
          createdAt: new Date().toISOString()
        };
        
        localStorage.setItem('victorBikes_admin', JSON.stringify(adminData));
        this.currentUser = adminData;
        this.updateUserUI();
        
        const modal = document.getElementById('adminLoginModal');
        if (modal) {
          modal.classList.remove('active');
          document.body.style.overflow = 'auto';
        }
        
        utils.showToast('Welcome back, Victor!', 'success');
      } else {
        utils.showToast('Invalid credentials', 'error');
      }
    }
  
    updateUserUI() {
      const userName = document.querySelector('.user-name');
      const userRole = document.querySelector('.user-role');
      
      if (userName && this.currentUser) {
        userName.textContent = this.currentUser.name;
      }
      
      if (userRole && this.currentUser) {
        userRole.textContent = this.currentUser.role;
      }
    }
  
    setupEventListeners() {
      // Navigation
      document.querySelectorAll('.nav-item[data-section]').forEach(item => {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          const section = item.dataset.section;
          this.switchSection(section);
        });
      });
  
      // Logout
      const logoutBtn = document.getElementById('adminLogout');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => this.logout());
      }
  
      // Product selection
      const selectAll = document.getElementById('selectAllProducts');
      if (selectAll) {
        selectAll.addEventListener('change', (e) => {
          const checkboxes = document.querySelectorAll('.product-checkbox');
          checkboxes.forEach(checkbox => {
            checkbox.checked = e.target.checked;
            const productId = checkbox.dataset.id;
            if (e.target.checked) {
              this.selectedProducts.add(productId);
            } else {
              this.selectedProducts.delete(productId);
            }
          });
        });
      }
  
      // Search and filters
      const productSearch = document.getElementById('productSearch');
      if (productSearch) {
        productSearch.addEventListener('input', utils.debounce(() => {
          this.loadProducts();
        }, 300));
      }
  
      // Forms
      const productForm = document.getElementById('productForm');
      if (productForm) {
        productForm.addEventListener('submit', (e) => this.saveProduct(e));
      }
  
      const paymentLinkForm = document.getElementById('paymentLinkForm');
      if (paymentLinkForm) {
        paymentLinkForm.addEventListener('submit', (e) => this.generatePaymentLink(e));
      }
  
      // Settings tabs
      document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.addEventListener('click', () => {
          const tabId = tab.dataset.tab;
          this.switchSettingsTab(tabId);
        });
      });
    }
  
    switchSection(section) {
      // Update active nav item
      document.querySelectorAll('.nav-item[data-section]').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === section) {
          item.classList.add('active');
        }
      });
  
      // Show corresponding section
      document.querySelectorAll('.admin-section').forEach(sectionEl => {
        sectionEl.classList.remove('active');
        if (sectionEl.id === section) {
          sectionEl.classList.add('active');
          this.loadSection(section);
        }
      });
    }
  
    loadSection(section) {
      switch(section) {
        case 'dashboard':
          this.loadDashboard();
          break;
        case 'products':
          this.loadProducts();
          break;
        case 'orders':
          this.loadOrders();
          break;
        case 'users':
          this.loadUsers();
          break;
        case 'messages':
          this.loadMessages();
          break;
        case 'payments':
          this.loadPayments();
          break;
        case 'services':
          this.loadServices();
          break;
        case 'analytics':
          this.loadAnalytics();
          break;
        case 'settings':
          this.loadSettings();
          break;
      }
    }
  
    loadDashboard() {
      this.updateStats();
      this.loadActivities();
      this.updateCharts();
    }
  
    updateStats() {
      // Calculate totals
      const products = JSON.parse(localStorage.getItem('victorBikes_products') || '[]');
      const orders = JSON.parse(localStorage.getItem('victorBikes_orders') || '[]');
      const users = JSON.parse(localStorage.getItem('victorBikes_users') || '[]');
      const payments = JSON.parse(localStorage.getItem('victorBikes_payments') || '[]');
  
      // Total revenue
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      document.getElementById('totalRevenue').textContent = utils.formatCurrency(totalRevenue);
  
      // Total orders
      document.getElementById('totalOrders').textContent = orders.length;
  
      // Total users
      document.getElementById('totalUsers').textContent = users.length;
  
      // Total products
      document.getElementById('totalProducts').textContent = products.length;
  
      // Update badges
      document.getElementById('productsCount').textContent = products.length;
      document.getElementById('ordersCount').textContent = orders.length;
      document.getElementById('usersCount').textContent = users.length;
      document.getElementById('messagesCount').textContent = this.getUnreadMessagesCount();
      document.getElementById('paymentsCount').textContent = payments.length;
      document.getElementById('servicesCount').textContent = this.getServicesCount();
    }
  
    getUnreadMessagesCount() {
      const messages = JSON.parse(localStorage.getItem('victorBikes_contacts') || '[]');
      return messages.filter(msg => !msg.read).length;
    }
  
    getServicesCount() {
      const services = JSON.parse(localStorage.getItem('victorBikes_bookings') || '[]');
      return services.length;
    }
  
    loadActivities() {
      const activitiesList = document.getElementById('activitiesList');
      if (!activitiesList) return;
  
      const activities = this.getRecentActivities();
      
      if (activities.length === 0) {
        activitiesList.innerHTML = `
          <div class="no-activities">
            <i class="fas fa-history"></i>
            <p>No recent activities</p>
          </div>
        `;
        return;
      }
  
      activitiesList.innerHTML = activities.map(activity => `
        <div class="activity-item">
          <div class="activity-icon ${activity.type}">
            <i class="fas fa-${activity.icon}"></i>
          </div>
          <div class="activity-content">
            <p>${activity.message}</p>
            <span class="activity-time">${utils.formatDate(activity.timestamp)}</span>
          </div>
        </div>
      `).join('');
    }
  
    getRecentActivities() {
      const activities = [];
      
      // Get recent orders
      const orders = JSON.parse(localStorage.getItem('victorBikes_orders') || '[]')
        .slice(-5)
        .reverse();
      
      orders.forEach(order => {
        activities.push({
          type: 'order',
          icon: 'shopping-cart',
          message: `New order #${order.orderId} from ${order.customer?.name || 'Customer'}`,
          timestamp: order.orderDate
        });
      });
      
      // Get recent users
      const users = JSON.parse(localStorage.getItem('victorBikes_users') || '[]')
        .slice(-3)
        .reverse();
      
      users.forEach(user => {
        activities.push({
          type: 'user',
          icon: 'user-plus',
          message: `New user registered: ${user.name}`,
          timestamp: user.createdAt
        });
      });
      
      // Sort by timestamp
      return activities.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      ).slice(0, 10);
    }
  
    setupCharts() {
      // Revenue Chart
      this.revenueChart = new Chart(document.getElementById('revenueChart'), {
        type: 'line',
        data: {
          labels: [],
          datasets: [{
            label: 'Revenue',
            data: [],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
  
      // Orders Chart
      this.ordersChart = new Chart(document.getElementById('ordersChart'), {
        type: 'bar',
        data: {
          labels: [],
          datasets: [{
            label: 'Orders',
            data: [],
            backgroundColor: '#0ea5a5',
            borderColor: '#0ea5a5',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
  
      // Sales Chart
      this.salesChart = new Chart(document.getElementById('salesChart'), {
        type: 'line',
        data: {
          labels: [],
          datasets: [{
            label: 'Sales',
            data: [],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
  
      // Top Products Chart
      this.topProductsChart = new Chart(document.getElementById('topProductsChart'), {
        type: 'doughnut',
        data: {
          labels: [],
          datasets: [{
            data: [],
            backgroundColor: [
              '#10b981',
              '#0ea5a5',
              '#3b82f6',
              '#8b5cf6',
              '#f59e0b'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
  
    updateCharts() {
      this.updateRevenueChart();
      this.updateOrdersChart();
    }
  
    updateRevenueChart() {
      const orders = JSON.parse(localStorage.getItem('victorBikes_orders') || '[]');
      
      // Group by date (last 7 days)
      const last7Days = Array.from({length: 7}, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();
  
      const revenueByDay = last7Days.map(date => {
        const dayOrders = orders.filter(order => 
          order.orderDate && order.orderDate.startsWith(date)
        );
        return dayOrders.reduce((sum, order) => sum + (order.total || 0), 0);
      });
  
      this.revenueChart.data.labels = last7Days.map(date => 
        new Date(date).toLocaleDateString('en-NG', { weekday: 'short' })
      );
      this.revenueChart.data.datasets[0].data = revenueByDay;
      this.revenueChart.update();
    }
  
    updateOrdersChart() {
      const orders = JSON.parse(localStorage.getItem('victorBikes_orders') || '[]');
      
      // Group by date (last 7 days)
      const last7Days = Array.from({length: 7}, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();
  
      const ordersByDay = last7Days.map(date => {
        return orders.filter(order => 
          order.orderDate && order.orderDate.startsWith(date)
        ).length;
      });
  
      this.ordersChart.data.labels = last7Days.map(date => 
        new Date(date).toLocaleDateString('en-NG', { weekday: 'short' })
      );
      this.ordersChart.data.datasets[0].data = ordersByDay;
      this.ordersChart.update();
    }
  
    loadProducts() {
      const productsTable = document.getElementById('productsTable');
      if (!productsTable) return;
  
      let products = JSON.parse(localStorage.getItem('victorBikes_products') || '[]');
      
      // Apply filters
      const searchQuery = document.getElementById('productSearch')?.value.toLowerCase() || '';
      const categoryFilter = document.getElementById('categoryFilter')?.value || '';
      const stockFilter = document.getElementById('stockFilter')?.value || '';
  
      if (searchQuery) {
        products = products.filter(p => 
          p.title.toLowerCase().includes(searchQuery) ||
          p.description.toLowerCase().includes(searchQuery)
        );
      }
  
      if (categoryFilter) {
        products = products.filter(p => p.category === categoryFilter);
      }
  
      if (stockFilter) {
        switch(stockFilter) {
          case 'in_stock':
            products = products.filter(p => p.stock > 10);
            break;
          case 'low_stock':
            products = products.filter(p => p.stock > 0 && p.stock <= 10);
            break;
          case 'out_of_stock':
            products = products.filter(p => p.stock === 0);
            break;
        }
      }
  
      // Pagination
      const totalPages = Math.ceil(products.length / this.pageSize);
      document.getElementById('totalPages').textContent = totalPages;
      
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      const paginatedProducts = products.slice(start, end);
  
      if (paginatedProducts.length === 0) {
        productsTable.innerHTML = `
          <tr>
            <td colspan="7" class="no-data">
              <i class="fas fa-box-open"></i>
              <p>No products found</p>
            </td>
          </tr>
        `;
        return;
      }
  
      productsTable.innerHTML = paginatedProducts.map(product => `
        <tr>
          <td>
            <input type="checkbox" class="product-checkbox" data-id="${product.id}"
                   onchange="admin.toggleProductSelection('${product.id}')">
          </td>
          <td>
            <div class="product-cell">
              <img src="${product.image || 'https://via.placeholder.com/40'}" alt="${product.title}" class="product-thumb">
              <div>
                <strong>${product.title}</strong>
                <small>${product.description?.substring(0, 50)}...</small>
              </div>
            </div>
          </td>
          <td>
            <span class="category-badge">${product.category}</span>
          </td>
          <td>${utils.formatCurrency(product.price)}</td>
          <td>
            <div class="stock-indicator ${product.stock > 10 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-of-stock'}">
              ${product.stock} units
            </div>
          </td>
          <td>
            <span class="status-badge ${product.stock > 0 ? 'active' : 'inactive'}">
              ${product.stock > 0 ? 'Active' : 'Inactive'}
            </span>
          </td>
          <td>
            <div class="action-buttons">
              <button class="btn-icon edit" onclick="admin.editProduct('${product.id}')">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn-icon delete" onclick="admin.deleteProduct('${product.id}')">
                <i class="fas fa-trash"></i>
              </button>
              <button class="btn-icon view" onclick="admin.viewProduct('${product.id}')">
                <i class="fas fa-eye"></i>
              </button>
            </div>
          </td>
        </tr>
      `).join('');
    }
  
    toggleProductSelection(productId) {
      if (this.selectedProducts.has(productId)) {
        this.selectedProducts.delete(productId);
      } else {
        this.selectedProducts.add(productId);
      }
    }
  
    showAddProductModal() {
      const modal = document.getElementById('addProductModal');
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }
  
    closeModal() {
      document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
      });
      document.body.style.overflow = 'auto';
    }
  
    saveProduct(e) {
      e.preventDefault();
      
      const productData = {
        id: `product_${Date.now()}`,
        title: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        description: document.getElementById('productDescription').value,
        price: parseFloat(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        image: document.getElementById('productImage').value || 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=60',
        features: document.getElementById('productFeatures').value.split('\n').filter(f => f.trim()),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
  
      // Save product
      const products = JSON.parse(localStorage.getItem('victorBikes_products') || '[]');
      products.push(productData);
      localStorage.setItem('victorBikes_products', JSON.stringify(products));
  
      // Log activity
      this.logActivity('product', 'New product added: ' + productData.title);
  
      utils.showToast('Product added successfully!', 'success');
      this.closeModal();
      this.loadProducts();
      this.updateStats();
    }
  
    editProduct(productId) {
      const products = JSON.parse(localStorage.getItem('victorBikes_products') || '[]');
      const product = products.find(p => p.id === productId);
      
      if (!product) return;
  
      const modal = document.getElementById('editProductModal');
      const modalBody = modal.querySelector('.modal-body');
      
      modalBody.innerHTML = `
        <form id="editProductForm">
          <div class="form-row">
            <div class="form-group">
              <label for="editProductName">Product Name *</label>
              <input type="text" id="editProductName" value="${product.title}" required>
            </div>
            <div class="form-group">
              <label for="editProductCategory">Category *</label>
              <select id="editProductCategory" required>
                <option value="bikes" ${product.category === 'bikes' ? 'selected' : ''}>Bikes</option>
                <option value="electric" ${product.category === 'electric' ? 'selected' : ''}>Electric Vehicles</option>
                <option value="parts" ${product.category === 'parts' ? 'selected' : ''}>Parts</option>
                <option value="accessories" ${product.category === 'accessories' ? 'selected' : ''}>Accessories</option>
                <option value="services" ${product.category === 'services' ? 'selected' : ''}>Services</option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label for="editProductDescription">Description *</label>
            <textarea id="editProductDescription" rows="3" required>${product.description}</textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="editProductPrice">Price (₦) *</label>
              <input type="number" id="editProductPrice" value="${product.price}" required min="0" step="100">
            </div>
            <div class="form-group">
              <label for="editProductStock">Stock Quantity *</label>
              <input type="number" id="editProductStock" value="${product.stock}" required min="0">
            </div>
          </div>
          
          <div class="form-group">
            <label for="editProductImage">Image URL</label>
            <input type="url" id="editProductImage" value="${product.image || ''}">
          </div>
          
          <div class="form-group">
            <label for="editProductFeatures">Features (one per line)</label>
            <textarea id="editProductFeatures" rows="3">${product.features?.join('\n') || ''}</textarea>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">Update Product</button>
            <button type="button" class="btn btn-secondary" onclick="admin.closeModal()">Cancel</button>
          </div>
        </form>
      `;
  
      const form = modalBody.querySelector('#editProductForm');
      form.addEventListener('submit', (e) => this.updateProduct(e, productId));
  
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  
    updateProduct(e, productId) {
      e.preventDefault();
      
      const updatedData = {
        title: document.getElementById('editProductName').value,
        category: document.getElementById('editProductCategory').value,
        description: document.getElementById('editProductDescription').value,
        price: parseFloat(document.getElementById('editProductPrice').value),
        stock: parseInt(document.getElementById('editProductStock').value),
        image: document.getElementById('editProductImage').value || product.image,
        features: document.getElementById('editProductFeatures').value.split('\n').filter(f => f.trim()),
        updatedAt: new Date().toISOString()
      };
  
      // Update product
      const products = JSON.parse(localStorage.getItem('victorBikes_products') || '[]');
      const index = products.findIndex(p => p.id === productId);
      
      if (index !== -1) {
        products[index] = { ...products[index], ...updatedData };
        localStorage.setItem('victorBikes_products', JSON.stringify(products));
  
        // Log activity
        this.logActivity('product', 'Product updated: ' + updatedData.title);
  
        utils.showToast('Product updated successfully!', 'success');
        this.closeModal();
        this.loadProducts();
      }
    }
  
    deleteProduct(productId) {
      if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
        return;
      }
  
      const products = JSON.parse(localStorage.getItem('victorBikes_products') || '[]');
      const product = products.find(p => p.id === productId);
      
      if (product) {
        const filteredProducts = products.filter(p => p.id !== productId);
        localStorage.setItem('victorBikes_products', JSON.stringify(filteredProducts));
  
        // Log activity
        this.logActivity('product', 'Product deleted: ' + product.title);
  
        utils.showToast('Product deleted successfully!', 'success');
        this.loadProducts();
        this.updateStats();
      }
    }
  
    deleteSelectedProducts() {
      if (this.selectedProducts.size === 0) {
        utils.showToast('No products selected', 'warning');
        return;
      }
  
      if (!confirm(`Are you sure you want to delete ${this.selectedProducts.size} product(s)?`)) {
        return;
      }
  
      const products = JSON.parse(localStorage.getItem('victorBikes_products') || '[]');
      const filteredProducts = products.filter(p => !this.selectedProducts.has(p.id));
      localStorage.setItem('victorBikes_products', JSON.stringify(filteredProducts));
  
      this.selectedProducts.clear();
      document.getElementById('selectAllProducts').checked = false;
  
      utils.showToast(`${this.selectedProducts.size} products deleted successfully!`, 'success');
      this.loadProducts();
      this.updateStats();
    }
  
    loadOrders() {
      const ordersTable = document.getElementById('ordersTable');
      if (!ordersTable) return;
  
      const orders = JSON.parse(localStorage.getItem('victorBikes_orders') || '[]').reverse();
  
      // Update order stats
      const pending = orders.filter(o => o.status === 'pending').length;
      const processing = orders.filter(o => o.status === 'processing').length;
      const completed = orders.filter(o => o.status === 'completed').length;
      const cancelled = orders.filter(o => o.status === 'cancelled').length;
  
      document.getElementById('pendingOrders').textContent = pending;
      document.getElementById('processingOrders').textContent = processing;
      document.getElementById('completedOrders').textContent = completed;
      document.getElementById('cancelledOrders').textContent = cancelled;
  
      if (orders.length === 0) {
        ordersTable.innerHTML = `
          <tr>
            <td colspan="7" class="no-data">
              <i class="fas fa-shopping-cart"></i>
              <p>No orders found</p>
            </td>
          </tr>
        `;
        return;
      }
  
      ordersTable.innerHTML = orders.map(order => `
        <tr>
          <td>
            <strong>${order.orderId}</strong>
          </td>
          <td>
            <div>
              <strong>${order.customer?.name || 'Customer'}</strong>
              <br>
              <small>${order.customer?.email || ''}</small>
            </div>
          </td>
          <td>${utils.formatDate(order.orderDate)}</td>
          <td>${utils.formatCurrency(order.total)}</td>
          <td>
            <span class="payment-method">${order.paymentMethod || 'Bank Transfer'}</span>
          </td>
          <td>
            <span class="status-badge ${order.status}">
              ${order.status}
            </span>
          </td>
          <td>
            <div class="action-buttons">
              <button class="btn-icon view" onclick="admin.viewOrder('${order.orderId}')">
                <i class="fas fa-eye"></i>
              </button>
              <button class="btn-icon edit" onclick="admin.updateOrderStatus('${order.orderId}')">
                <i class="fas fa-edit"></i>
              </button>
            </div>
          </td>
        </tr>
      `).join('');
    }
  
    viewOrder(orderId) {
      const orders = JSON.parse(localStorage.getItem('victorBikes_orders') || '[]');
      const order = orders.find(o => o.orderId === orderId);
      
      if (!order) return;
  
      const modal = document.createElement('div');
      modal.className = 'modal active';
      modal.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h3>Order Details: ${order.orderId}</h3>
            <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
          </div>
          <div class="modal-body">
            <div class="order-details-view">
              <div class="detail-section">
                <h4>Customer Information</h4>
                <p><strong>Name:</strong> ${order.customer?.name || 'N/A'}</p>
                <p><strong>Email:</strong> ${order.customer?.email || 'N/A'}</p>
                <p><strong>Phone:</strong> ${order.customer?.phone || 'N/A'}</p>
              </div>
              
              <div class="detail-section">
                <h4>Order Items</h4>
                <table class="order-items-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${order.items?.map(item => `
                      <tr>
                        <td>${item.title}</td>
                        <td>${item.quantity}</td>
                        <td>${utils.formatCurrency(item.price)}</td>
                        <td>${utils.formatCurrency(item.price * item.quantity)}</td>
                      </tr>
                    `).join('') || ''}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="3"><strong>Total:</strong></td>
                      <td><strong>${utils.formatCurrency(order.total)}</strong></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              <div class="detail-section">
                <h4>Shipping & Payment</h4>
                <p><strong>Shipping Address:</strong> ${order.shippingAddress || 'N/A'}</p>
                <p><strong>Payment Method:</strong> ${order.paymentMethod || 'Bank Transfer'}</p>
                <p><strong>Status:</strong> <span class="status-badge ${order.status}">${order.status}</span></p>
                <p><strong>Order Date:</strong> ${utils.formatDate(order.orderDate)}</p>
              </div>
              
              <div class="detail-section">
                <h4>Update Status</h4>
                <select id="updateOrderStatus" class="filter-select" onchange="admin.saveOrderStatus('${order.orderId}')">
                  <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                  <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                  <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completed</option>
                  <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      `;
  
      document.body.appendChild(modal);
      document.body.style.overflow = 'hidden';
    }
  
    saveOrderStatus(orderId, status) {
      const orders = JSON.parse(localStorage.getItem('victorBikes_orders') || '[]');
      const orderIndex = orders.findIndex(o => o.orderId === orderId);
      
      if (orderIndex !== -1) {
        orders[orderIndex].status = status;
        orders[orderIndex].updatedAt = new Date().toISOString();
        localStorage.setItem('victorBikes_orders', JSON.stringify(orders));
  
        // Log activity
        this.logActivity('order', `Order ${orderId} status updated to ${status}`);
  
        utils.showToast('Order status updated!', 'success');
        this.loadOrders();
      }
    }
  
    loadUsers() {
      const usersTable = document.getElementById('usersTable');
      if (!usersTable) return;
  
      const users = JSON.parse(localStorage.getItem('victorBikes_users') || '[]').reverse();
      const orders = JSON.parse(localStorage.getItem('victorBikes_orders') || '[]');
  
      if (users.length === 0) {
        usersTable.innerHTML = `
          <tr>
            <td colspan="8" class="no-data">
              <i class="fas fa-users"></i>
              <p>No users found</p>
            </td>
          </tr>
        `;
        return;
      }
  
      usersTable.innerHTML = users.map(user => {
        const userOrders = orders.filter(o => o.customer?.email === user.email);
        
        return `
          <tr>
            <td>${user.id}</td>
            <td>
              <div>
                <strong>${user.name}</strong>
              </div>
            </td>
            <td>${user.email}</td>
            <td>${user.phone || 'N/A'}</td>
            <td>${utils.formatDate(user.createdAt)}</td>
            <td>${userOrders.length}</td>
            <td>
              <span class="status-badge active">Active</span>
            </td>
            <td>
              <div class="action-buttons">
                <button class="btn-icon view" onclick="admin.viewUser('${user.id}')">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="btn-icon delete" onclick="admin.deleteUser('${user.id}')">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }
  
    viewUser(userId) {
      const users = JSON.parse(localStorage.getItem('victorBikes_users') || '[]');
      const user = users.find(u => u.id === userId);
      
      if (!user) return;
  
      const orders = JSON.parse(localStorage.getItem('victorBikes_orders') || '[]');
      const userOrders = orders.filter(o => o.customer?.email === user.email);
  
      const modal = document.createElement('div');
      modal.className = 'modal active';
      modal.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h3>User Details: ${user.name}</h3>
            <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
          </div>
          <div class="modal-body">
            <div class="user-details-view">
              <div class="detail-section">
                <h4>Personal Information</h4>
                <p><strong>Name:</strong> ${user.name}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Phone:</strong> ${user.phone || 'N/A'}</p>
                <p><strong>Member Since:</strong> ${utils.formatDate(user.createdAt)}</p>
              </div>
              
              <div class="detail-section">
                <h4>Order History (${userOrders.length} orders)</h4>
                ${userOrders.length > 0 ? `
                  <table class="order-items-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${userOrders.slice(0, 5).map(order => `
                        <tr>
                          <td>${order.orderId}</td>
                          <td>${utils.formatDate(order.orderDate)}</td>
                          <td>${utils.formatCurrency(order.total)}</td>
                          <td><span class="status-badge ${order.status}">${order.status}</span></td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                  ${userOrders.length > 5 ? `<p class="more-orders">... and ${userOrders.length - 5} more orders</p>` : ''}
                ` : '<p>No orders yet</p>'}
              </div>
              
              <div class="detail-section">
                <h4>User Actions</h4>
                <div class="user-actions">
                  <button class="btn btn-secondary" onclick="admin.sendEmailToUser('${user.email}')">
                    <i class="fas fa-envelope"></i> Send Email
                  </button>
                  <button class="btn btn-danger" onclick="admin.deleteUser('${user.id}', true)">
                    <i class="fas fa-trash"></i> Delete User
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
  
      document.body.appendChild(modal);
      document.body.style.overflow = 'hidden';
    }
  
    deleteUser(userId, confirmOnly = false) {
      if (!confirmOnly) {
        if (!confirm('Are you sure you want to delete this user? This will also delete their orders.')) {
          return;
        }
      }
  
      // Delete user
      const users = JSON.parse(localStorage.getItem('victorBikes_users') || '[]');
      const user = users.find(u => u.id === userId);
      const filteredUsers = users.filter(u => u.id !== userId);
      localStorage.setItem('victorBikes_users', JSON.stringify(filteredUsers));
  
      // Delete user's orders
      const orders = JSON.parse(localStorage.getItem('victorBikes_orders') || '[]');
      const filteredOrders = orders.filter(o => o.customer?.email !== user?.email);
      localStorage.setItem('victorBikes_orders', JSON.stringify(filteredOrders));
  
      // Log activity
      this.logActivity('user', 'User deleted: ' + user?.name);
  
      utils.showToast('User deleted successfully!', 'success');
      this.loadUsers();
      this.updateStats();
    }
  
    loadMessages() {
      const messagesList = document.getElementById('messagesList');
      if (!messagesList) return;
  
      const messages = JSON.parse(localStorage.getItem('victorBikes_contacts') || '[]').reverse();
  
      if (messages.length === 0) {
        messagesList.innerHTML = `
          <div class="no-messages">
            <i class="fas fa-envelope"></i>
            <p>No messages found</p>
          </div>
        `;
        return;
      }
  
      messagesList.innerHTML = messages.map((msg, index) => `
        <div class="message-item ${msg.read ? '' : 'unread'} ${index === 0 ? 'selected' : ''}" 
             onclick="admin.viewMessage('${msg.timestamp}')">
          <div class="message-header">
            <span class="message-sender">${msg.name}</span>
            <span class="message-time">${utils.formatDate(msg.timestamp)}</span>
          </div>
          <div class="message-preview">
            ${msg.subject || 'General Inquiry'}: ${msg.message.substring(0, 50)}...
          </div>
        </div>
      `).join('');
  
      // Load first message by default
      if (messages.length > 0) {
        this.viewMessage(messages[0].timestamp);
      }
    }
  
    viewMessage(timestamp) {
      const messages = JSON.parse(localStorage.getItem('victorBikes_contacts') || '[]');
      const message = messages.find(m => m.timestamp === timestamp);
      
      if (!message) return;
  
      // Mark as read
      if (!message.read) {
        message.read = true;
        localStorage.setItem('victorBikes_contacts', JSON.stringify(messages));
        this.loadMessages();
        this.updateStats();
      }
  
      const messageViewer = document.getElementById('messageViewer');
      if (!messageViewer) return;
  
      messageViewer.innerHTML = `
        <div class="message-details">
          <div class="message-header">
            <h3>${message.subject || 'General Inquiry'}</h3>
            <span class="message-date">${utils.formatDate(message.timestamp)}</span>
          </div>
          
          <div class="sender-info">
            <p><strong>From:</strong> ${message.name}</p>
            <p><strong>Email:</strong> ${message.email}</p>
            <p><strong>Phone:</strong> ${message.phone || 'Not provided'}</p>
          </div>
          
          <div class="message-content">
            <p>${message.message}</p>
          </div>
          
          <div class="message-actions">
            <button class="btn btn-primary" onclick="admin.replyToMessage('${message.email}')">
              <i class="fas fa-reply"></i> Reply
            </button>
            <button class="btn btn-secondary" onclick="admin.markAsUrgent('${timestamp}')">
              <i class="fas fa-exclamation-circle"></i> Mark as Urgent
            </button>
            <button class="btn btn-danger" onclick="admin.deleteMessage('${timestamp}')">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>
      `;
    }
  
    replyToMessage(email) {
      window.location.href = `mailto:${email}?subject=Re: Your inquiry to Victor Bikes`;
    }
  
    deleteMessage(timestamp) {
      if (!confirm('Are you sure you want to delete this message?')) {
        return;
      }
  
      const messages = JSON.parse(localStorage.getItem('victorBikes_contacts') || '[]');
      const filteredMessages = messages.filter(m => m.timestamp !== timestamp);
      localStorage.setItem('victorBikes_contacts', JSON.stringify(filteredMessages));
  
      utils.showToast('Message deleted!', 'success');
      this.loadMessages();
      this.updateStats();
    }
  
    markAllAsRead() {
      const messages = JSON.parse(localStorage.getItem('victorBikes_contacts') || '[]');
      messages.forEach(msg => msg.read = true);
      localStorage.setItem('victorBikes_contacts', JSON.stringify(messages));
  
      utils.showToast('All messages marked as read!', 'success');
      this.loadMessages();
      this.updateStats();
    }
  
    loadPayments() {
      const paymentsTable = document.getElementById('paymentsTable');
      if (!paymentsTable) return;
  
      const payments = JSON.parse(localStorage.getItem('victorBikes_payments') || '[]').reverse();
      const orders = JSON.parse(localStorage.getItem('victorBikes_orders') || '[]');
  
      // Update payment stats
      const total = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
      const successful = payments.filter(p => p.status === 'successful').length;
      const pending = payments.filter(p => p.status === 'pending').length;
      const failed = payments.filter(p => p.status === 'failed').length;
  
      document.getElementById('totalPayments').textContent = utils.formatCurrency(total);
      document.getElementById('successfulPayments').textContent = successful;
      document.getElementById('pendingPayments').textContent = pending;
      document.getElementById('failedPayments').textContent = failed;
  
      if (payments.length === 0) {
        paymentsTable.innerHTML = `
          <tr>
            <td colspan="8" class="no-data">
              <i class="fas fa-credit-card"></i>
              <p>No payments found</p>
            </td>
          </tr>
        `;
        return;
      }
  
      paymentsTable.innerHTML = payments.map(payment => {
        const order = orders.find(o => o.orderId === payment.orderId);
        
        return `
          <tr>
            <td>${payment.id}</td>
            <td>
              <div>
                <strong>${order?.customer?.name || 'Customer'}</strong>
                <br>
                <small>${payment.email || ''}</small>
              </div>
            </td>
            <td>${utils.formatCurrency(payment.amount)}</td>
            <td>
              <span class="payment-method">${payment.method || 'Bank Transfer'}</span>
            </td>
            <td>
              <span class="status-badge ${payment.status}">
                ${payment.status}
              </span>
            </td>
            <td>${utils.formatDate(payment.date)}</td>
            <td>
              <code>${payment.reference || 'N/A'}</code>
            </td>
            <td>
              <div class="action-buttons">
                <button class="btn-icon view" onclick="admin.viewPayment('${payment.id}')">
                  <i class="fas fa-eye"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }
  
    syncPayments() {
      // Simulate payment sync
      utils.showToast('Syncing payments...', 'info');
      
      setTimeout(() => {
        utils.showToast('Payments synced successfully!', 'success');
        this.loadPayments();
      }, 1500);
    }
  
    generatePaymentLink(e) {
      if (e) e.preventDefault();
      
      const amount = document.getElementById('linkAmount').value;
      const customer = document.getElementById('linkCustomer').value;
      const description = document.getElementById('linkDescription').value;
      
      if (!amount || amount < 100) {
        utils.showToast('Amount must be at least ₦100', 'error');
        return;
      }
      
      // Generate payment link (simulated)
      const paymentId = 'PAY' + Date.now().toString().slice(-8);
      const paymentLink = `https://victorbikes.com/pay/${paymentId}`;
      
      // Save payment record
      const payment = {
        id: paymentId,
        amount: parseFloat(amount),
        customerEmail: customer,
        description: description || 'Payment for Victor Bikes',
        status: 'pending',
        date: new Date().toISOString(),
        method: 'payment_link'
      };
      
      const payments = JSON.parse(localStorage.getItem('victorBikes_payments') || '[]');
      payments.push(payment);
      localStorage.setItem('victorBikes_payments', JSON.stringify(payments));
      
      // Show generated link
      const linkDisplay = document.getElementById('generatedLink');
      const linkInput = document.getElementById('paymentLink');
      const openLink = document.getElementById('openPaymentLink');
      
      linkInput.value = paymentLink;
      openLink.href = paymentLink;
      linkDisplay.style.display = 'block';
      
      // Log activity
      this.logActivity('payment', `Payment link generated: ₦${amount}`);
      
      utils.showToast('Payment link generated!', 'success');
    }
  
    copyPaymentLink() {
      const linkInput = document.getElementById('paymentLink');
      linkInput.select();
      document.execCommand('copy');
      utils.showToast('Link copied to clipboard!', 'success');
    }
  
    copyText(text) {
      navigator.clipboard.writeText(text);
      utils.showToast('Copied to clipboard!', 'success');
    }
  
    loadServices() {
      const servicesTable = document.getElementById('servicesTable');
      if (!servicesTable) return;
  
      const services = JSON.parse(localStorage.getItem('victorBikes_bookings') || '[]').reverse();
  
      if (services.length === 0) {
        servicesTable.innerHTML = `
          <tr>
            <td colspan="7" class="no-data">
              <i class="fas fa-tools"></i>
              <p>No service bookings found</p>
            </td>
          </tr>
        `;
        return;
      }
  
      servicesTable.innerHTML = services.map(service => `
        <tr>
          <td>${service.timestamp}</td>
          <td>
            <div>
              <strong>${service.name}</strong>
              <br>
              <small>${service.phone}</small>
            </div>
          </td>
          <td>${service.service}</td>
          <td>
            ${utils.formatDate(service.date)}<br>
            <small>${service.time}</small>
          </td>
          <td>${utils.formatCurrency(service.price)}</td>
          <td>
            <span class="status-badge pending">Pending</span>
          </td>
          <td>
            <div class="action-buttons">
              <button class="btn-icon edit" onclick="admin.updateServiceStatus('${service.timestamp}')">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn-icon delete" onclick="admin.deleteService('${service.timestamp}')">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `).join('');
    }
  
    loadAnalytics() {
      this.updateAnalytics();
    }
  
    updateAnalytics() {
      const period = document.getElementById('analyticsPeriod').value;
      this.updateSalesChart(period);
      this.updateTopProductsChart();
      this.updateMetrics();
    }
  
    updateSalesChart(period = '30') {
      const orders = JSON.parse(localStorage.getItem('victorBikes_orders') || '[]');
      const days = parseInt(period);
      
      // Generate labels for the period
      const labels = Array.from({length: days}, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' });
      }).reverse();
      
      // Calculate sales for each day
      const salesData = labels.map((_, index) => {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() - (days - 1 - index));
        const dateStr = targetDate.toISOString().split('T')[0];
        
        const dayOrders = orders.filter(order => 
          order.orderDate && order.orderDate.startsWith(dateStr)
        );
        
        return dayOrders.reduce((sum, order) => sum + (order.total || 0), 0);
      });
      
      this.salesChart.data.labels = labels;
      this.salesChart.data.datasets[0].data = salesData;
      this.salesChart.update();
    }
  
    updateTopProductsChart() {
      const orders = JSON.parse(localStorage.getItem('victorBikes_orders') || '[]');
      const productSales = {};
      
      // Calculate product sales
      orders.forEach(order => {
        order.items?.forEach(item => {
          if (!productSales[item.title]) {
            productSales[item.title] = 0;
          }
          productSales[item.title] += item.quantity;
        });
      });
      
      // Get top 5 products
      const topProducts = Object.entries(productSales)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
      
      this.topProductsChart.data.labels = topProducts.map(p => p[0]);
      this.topProductsChart.data.datasets[0].data = topProducts.map(p => p[1]);
      this.topProductsChart.update();
    }
  
    updateMetrics() {
      const orders = JSON.parse(localStorage.getItem('victorBikes_orders') || '[]');
      const users = JSON.parse(localStorage.getItem('victorBikes_users') || '[]');
      
      // Average Order Value
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
      document.getElementById('avgOrderValue').textContent = utils.formatCurrency(avgOrderValue);
      
      // Conversion Rate (simulated)
      const conversionRate = 3.5; // Simulated percentage
      document.getElementById('conversionRate').textContent = conversionRate.toFixed(1) + '%';
      
      // Customer Lifetime Value (simulated)
      const clv = avgOrderValue * 2.5; // Simulated
      document.getElementById('clv').textContent = utils.formatCurrency(clv);
      
      // Repeat Purchase Rate (simulated)
      const repeatRate = 25; // Simulated percentage
      document.getElementById('repeatRate').textContent = repeatRate + '%';
    }
  
    loadSettings() {
      // Load saved settings
      const settings = JSON.parse(localStorage.getItem('victorBikes_settings') || '{}');
      
      // Populate form fields
      if (settings.storeName) document.getElementById('storeName').value = settings.storeName;
      if (settings.storeEmail) document.getElementById('storeEmail').value = settings.storeEmail;
      if (settings.storePhone) document.getElementById('storePhone').value = settings.storePhone;
      if (settings.storeAddress) document.getElementById('storeAddress').value = settings.storeAddress;
      
      // Load backup list
      this.loadBackupList();
    }
  
    switchSettingsTab(tabId) {
      document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabId);
      });
      
      document.querySelectorAll('.settings-tab').forEach(tab => {
        tab.classList.toggle('active', tab.id === tabId);
      });
    }
  
    saveSettings() {
      const settings = {
        storeName: document.getElementById('storeName').value,
        storeEmail: document.getElementById('storeEmail').value,
        storePhone: document.getElementById('storePhone').value,
        storeAddress: document.getElementById('storeAddress').value,
        storeCurrency: document.getElementById('storeCurrency').value,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem('victorBikes_settings', JSON.stringify(settings));
      
      utils.showToast('Settings saved successfully!', 'success');
      
      // Log activity
      this.logActivity('settings', 'Settings updated');
    }
  
    createBackup() {
      // Create backup of all data
      const backup = {
        timestamp: new Date().toISOString(),
        users: JSON.parse(localStorage.getItem('victorBikes_users') || '[]'),
        products: JSON.parse(localStorage.getItem('victorBikes_products') || '[]'),
        orders: JSON.parse(localStorage.getItem('victorBikes_orders') || '[]'),
        payments: JSON.parse(localStorage.getItem('victorBikes_payments') || '[]'),
        messages: JSON.parse(localStorage.getItem('victorBikes_contacts') || '[]'),
        services: JSON.parse(localStorage.getItem('victorBikes_bookings') || '[]')
      };
      
      // Save backup
      const backups = JSON.parse(localStorage.getItem('victorBikes_backups') || '[]');
      backups.push(backup);
      localStorage.setItem('victorBikes_backups', JSON.stringify(backups));
      
      // Update last backup time
      document.getElementById('lastBackup').textContent = 
        new Date().toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' });
      
      utils.showToast('Backup created successfully!', 'success');
      
      // Log activity
      this.logActivity('backup', 'System backup created');
      
      // Refresh backup list
      this.loadBackupList();
    }
  
    loadBackupList() {
      const backupList = document.getElementById('backupList');
      if (!backupList) return;
  
      const backups = JSON.parse(localStorage.getItem('victorBikes_backups') || '[]').reverse();
      
      if (backups.length === 0) {
        backupList.innerHTML = '<p class="no-backups">No backups available</p>';
        return;
      }
      
      backupList.innerHTML = backups.slice(0, 5).map(backup => `
        <div class="backup-item">
          <div class="backup-info">
            <span class="backup-name">Backup ${new Date(backup.timestamp).toLocaleDateString()}</span>
            <span class="backup-size">${Object.keys(backup).length} collections</span>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="admin.restoreBackup('${backup.timestamp}')">
            Restore
          </button>
        </div>
      `).join('');
    }
  
    restoreBackup(timestamp) {
      if (!timestamp) {
        // Show restore modal
        utils.showToast('Please select a backup to restore', 'info');
        return;
      }
      
      if (!confirm('Are you sure you want to restore this backup? Current data will be replaced.')) {
        return;
      }
      
      const backups = JSON.parse(localStorage.getItem('victorBikes_backups') || '[]');
      const backup = backups.find(b => b.timestamp === timestamp);
      
      if (!backup) {
        utils.showToast('Backup not found', 'error');
        return;
      }
      
      // Restore data
      if (backup.users) localStorage.setItem('victorBikes_users', JSON.stringify(backup.users));
      if (backup.products) localStorage.setItem('victorBikes_products', JSON.stringify(backup.products));
      if (backup.orders) localStorage.setItem('victorBikes_orders', JSON.stringify(backup.orders));
      if (backup.payments) localStorage.setItem('victorBikes_payments', JSON.stringify(backup.payments));
      if (backup.messages) localStorage.setItem('victorBikes_contacts', JSON.stringify(backup.messages));
      if (backup.services) localStorage.setItem('victorBikes_bookings', JSON.stringify(backup.services));
      
      utils.showToast('Backup restored successfully!', 'success');
      
      // Log activity
      this.logActivity('backup', 'System restored from backup');
      
      // Refresh dashboard
      setTimeout(() => {
        location.reload();
      }, 1000);
    }
  
    exportData() {
      // Export all data as JSON
      const exportData = {
        exportedAt: new Date().toISOString(),
        users: JSON.parse(localStorage.getItem('victorBikes_users') || '[]'),
        products: JSON.parse(localStorage.getItem('victorBikes_products') || '[]'),
        orders: JSON.parse(localStorage.getItem('victorBikes_orders') || '[]'),
        payments: JSON.parse(localStorage.getItem('victorBikes_payments') || '[]'),
        messages: JSON.parse(localStorage.getItem('victorBikes_contacts') || '[]'),
        services: JSON.parse(localStorage.getItem('victorBikes_bookings') || '[]')
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `victor-bikes-backup-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      utils.showToast('Data exported successfully!', 'success');
      
      // Log activity
      this.logActivity('export', 'All data exported');
    }
  
    logout() {
      if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('victorBikes_admin');
        window.location.href = 'index.html';
      }
    }
  
    startAutoRefresh() {
      // Refresh dashboard every 60 seconds
      setInterval(() => {
        if (document.querySelector('#dashboard').classList.contains('active')) {
          this.updateStats();
          this.updateCharts();
        }
      }, 60000);
    }
  
    logActivity(type, message) {
      const activity = {
        type,
        message,
        timestamp: new Date().toISOString(),
        user: this.currentUser?.name || 'System'
      };
      
      const activities = JSON.parse(localStorage.getItem('victorBikes_activities') || '[]');
      activities.push(activity);
      localStorage.setItem('victorBikes_activities', JSON.stringify(activities.slice(-100))); // Keep last 100 activities
    }
  
    refreshDashboard() {
      this.updateStats();
      this.updateCharts();
      this.loadActivities();
      utils.showToast('Dashboard refreshed!', 'success');
    }
  
    generateReport() {
      utils.showToast('Report generation started! Download will begin shortly.', 'info');
      
      // Simulate report generation
      setTimeout(() => {
        utils.showToast('Report downloaded successfully!', 'success');
      }, 2000);
    }
  
    testEmail() {
      utils.showToast('Test email configuration...', 'info');
      
      // Simulate email test
      setTimeout(() => {
        utils.showToast('Email configuration test completed!', 'success');
      }, 1500);
    }
  
    viewAllActivities() {
      this.switchSection('analytics');
    }
  
    exportProducts() {
      const products = JSON.parse(localStorage.getItem('victorBikes_products') || '[]');
      const csv = this.convertToCSV(products);
      this.downloadCSV(csv, 'products-export.csv');
    }
  
    exportOrders() {
      const orders = JSON.parse(localStorage.getItem('victorBikes_orders') || '[]');
      const csv = this.convertToCSV(orders);
      this.downloadCSV(csv, 'orders-export.csv');
    }
  
    exportUsers() {
      const users = JSON.parse(localStorage.getItem('victorBikes_users') || '[]');
      const csv = this.convertToCSV(users);
      this.downloadCSV(csv, 'users-export.csv');
    }
  
    exportPayments() {
      const payments = JSON.parse(localStorage.getItem('victorBikes_payments') || '[]');
      const csv = this.convertToCSV(payments);
      this.downloadCSV(csv, 'payments-export.csv');
    }
  
    convertToCSV(data) {
      if (data.length === 0) return '';
      
      const headers = Object.keys(data[0]);
      const rows = data.map(item => 
        headers.map(header => 
          JSON.stringify(item[header] || '')
        ).join(',')
      );
      
      return [headers.join(','), ...rows].join('\n');
    }
  
    downloadCSV(csv, filename) {
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
      
      utils.showToast(`${filename} downloaded!`, 'success');
    }
  
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        document.getElementById('currentPage').textContent = this.currentPage;
        this.loadProducts();
      }
    }
  
    nextPage() {
      const totalPages = parseInt(document.getElementById('totalPages').textContent);
      if (this.currentPage < totalPages) {
        this.currentPage++;
        document.getElementById('currentPage').textContent = this.currentPage;
        this.loadProducts();
      }
    }
  }
  
  // Initialize admin dashboard
  const admin = new AdminDashboard();