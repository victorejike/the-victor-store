// Main Application
class App {
    constructor() {
      this.init();
    }
  
    init() {
      this.setupEventListeners();
      this.setupMobileMenu();
      this.checkRedirect();
      this.loadUserData();
    }
  
    setupEventListeners() {
      // Smooth scroll for anchor links
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          const targetId = this.getAttribute('href');
          if (targetId !== '#') {
            utils.scrollToElement(targetId.substring(1));
          }
        });
      });
  
      // Make phone call
      document.querySelectorAll('.phone-link').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const phone = link.getAttribute('href').replace('tel:', '');
          utils.makePhoneCall(phone);
        });
      });
  
      // Open WhatsApp
      document.querySelectorAll('.whatsapp-link').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const phone = link.dataset.phone;
          const message = link.dataset.message || 'Hello, I need information about Victor Bikes';
          utils.openWhatsApp(phone, message);
        });
      });
  
      // Send email
      document.querySelectorAll('.email-link').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const email = link.getAttribute('href').replace('mailto:', '');
          utils.sendEmail(email);
        });
      });
    }
  
   // In your existing app.js, add this to the init() method:
setupMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      menuToggle.innerHTML = navMenu.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
      }
    });
  }
}
  
    checkRedirect() {
      const params = utils.getUrlParams();
      
      if (params.redirect === 'checkout' && auth.isLoggedIn()) {
        // User logged in from checkout redirect, show cart
        setTimeout(() => {
          cart.showCart();
          utils.removeUrlParam('redirect');
        }, 500);
      }
    }
  
    loadUserData() {
      // Update user UI
      auth.updateAuthUI();
      
      // Load user orders if on dashboard
      if (window.location.pathname.includes('dashboard.html')) {
        this.loadUserDashboard();
      }
    }
  
    loadUserDashboard() {
      // This would be expanded for the dashboard page
      const user = auth.getCurrentUser();
      
      if (!user) {
        window.location.href = 'login.html';
        return;
      }
  
      // Load user orders
      const orders = JSON.parse(localStorage.getItem('victorBikes_orders') || '[]');
      const userOrders = orders.filter(order => order.customer && order.customer.email === user.email);
      
      // Load user bookings
      const bookings = JSON.parse(localStorage.getItem('victorBikes_bookings') || '[]');
      const userBookings = bookings.filter(booking => booking.phone === user.phone);
      
      // Update dashboard UI
      this.updateDashboardUI(userOrders, userBookings);
    }
  
    updateDashboardUI(orders, bookings) {
      const ordersSection = document.getElementById('userOrders');
      const bookingsSection = document.getElementById('userBookings');
      
      if (ordersSection) {
        if (orders.length === 0) {
          ordersSection.innerHTML = `
            <div class="empty-state">
              <i class="fas fa-shopping-bag"></i>
              <h3>No orders yet</h3>
              <p>Your order history will appear here</p>
              <a href="index.html#products" class="btn btn-primary">Shop Now</a>
            </div>
          `;
        } else {
          ordersSection.innerHTML = orders.map(order => `
            <div class="order-card">
              <div class="order-header">
                <span class="order-id">Order #${order.orderId}</span>
                <span class="order-status ${order.status}">${order.status}</span>
              </div>
              <div class="order-details">
                <div class="order-date">${utils.formatDate(order.orderDate)}</div>
                <div class="order-total">${utils.formatCurrency(order.total)}</div>
              </div>
              <div class="order-items">
                ${order.items.map(item => `
                  <div class="order-item">
                    <span>${item.title} × ${item.quantity}</span>
                    <span>${utils.formatCurrency(item.price * item.quantity)}</span>
                  </div>
                `).join('')}
              </div>
              <div class="order-actions">
                <button class="btn btn-secondary" onclick="app.trackOrder('${order.orderId}')">
                  <i class="fas fa-truck"></i> Track Order
                </button>
                <button class="btn btn-primary" onclick="app.reorder('${order.orderId}')">
                  <i class="fas fa-redo"></i> Reorder
                </button>
              </div>
            </div>
          `).join('');
        }
      }
  
      if (bookingsSection) {
        if (bookings.length === 0) {
          bookingsSection.innerHTML = `
            <div class="empty-state">
              <i class="fas fa-calendar-alt"></i>
              <h3>No bookings yet</h3>
              <p>Your service bookings will appear here</p>
              <a href="index.html#services" class="btn btn-primary">Book Service</a>
            </div>
          `;
        } else {
          bookingsSection.innerHTML = bookings.map(booking => `
            <div class="booking-card">
              <div class="booking-header">
                <span class="booking-service">${booking.service}</span>
                <span class="booking-price">${utils.formatCurrency(booking.price)}</span>
              </div>
              <div class="booking-details">
                <div class="booking-date">
                  <i class="fas fa-calendar"></i>
                  ${new Date(booking.date).toLocaleDateString()} at ${booking.time}
                </div>
                <div class="booking-phone">
                  <i class="fas fa-phone"></i>
                  ${booking.phone}
                </div>
              </div>
              ${booking.notes ? `
                <div class="booking-notes">
                  <strong>Notes:</strong> ${booking.notes}
                </div>
              ` : ''}
              <div class="booking-actions">
                <button class="btn btn-secondary" onclick="app.rescheduleBooking('${booking.timestamp}')">
                  <i class="fas fa-clock"></i> Reschedule
                </button>
                <button class="btn btn-danger" onclick="app.cancelBooking('${booking.timestamp}')">
                  <i class="fas fa-times"></i> Cancel
                </button>
              </div>
            </div>
          `).join('');
        }
      }
    }
  
    trackOrder(orderId) {
      utils.showToast(`Tracking order #${orderId}...`, 'info');
      // In a real app, this would redirect to tracking page
    }
  
    reorder(orderId) {
      const orders = JSON.parse(localStorage.getItem('victorBikes_orders') || '[]');
      const order = orders.find(o => o.orderId === orderId);
      
      if (order) {
        order.items.forEach(item => {
          cart.addToCart(item.id, item.quantity);
        });
        
        utils.showToast('Items added to cart!', 'success');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1000);
      }
    }
  
    rescheduleBooking(timestamp) {
      utils.showToast('Reschedule feature coming soon!', 'info');
    }
  
    cancelBooking(timestamp) {
      if (confirm('Are you sure you want to cancel this booking?')) {
        const bookings = JSON.parse(localStorage.getItem('victorBikes_bookings') || '[]');
        const updatedBookings = bookings.filter(booking => booking.timestamp !== timestamp);
        localStorage.setItem('victorBikes_bookings', JSON.stringify(updatedBookings));
        
        utils.showToast('Booking cancelled successfully', 'success');
        this.loadUserDashboard();
      }
    }
    
  }
  
  // Initialize app
  const app = new App();
  // Bank Transfer Payment Handling
class BankTransfer {
  constructor() {
    this.bankDetails = {
      bank: 'Opay',
      accountName: 'Victor Ejike',
      accountNumber: '8062463468'
    };
  }

  showBankDetails(orderId, amount) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
        <div class="bank-transfer-instructions">
          <h2>Bank Transfer Instructions</h2>
          <div class="order-summary">
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Amount:</strong> ${utils.formatCurrency(amount)}</p>
          </div>
          
          <div class="bank-info-card">
            <h3>Transfer to:</h3>
            <div class="bank-detail">
              <span class="label">Bank Name:</span>
              <span class="value">${this.bankDetails.bank}</span>
            </div>
            <div class="bank-detail">
              <span class="label">Account Name:</span>
              <span class="value">${this.bankDetails.accountName}</span>
            </div>
            <div class="bank-detail">
              <span class="label">Account Number:</span>
              <span class="value">${this.bankDetails.accountNumber}</span>
              <button class="copy-btn" onclick="utils.copyToClipboard('${this.bankDetails.accountNumber}')">
                <i class="fas fa-copy"></i>
              </button>
            </div>
          </div>
          
          <div class="instructions">
            <h4>Instructions:</h4>
            <ol>
              <li>Transfer the exact amount to the account above</li>
              <li>Use your Order ID (${orderId}) as payment reference</li>
              <li>After transferring, upload your proof of payment below</li>
              <li>We'll confirm your payment within 24 hours</li>
            </ol>
          </div>
          
          <div class="upload-section">
            <h4>Upload Proof of Payment</h4>
            <input type="file" id="paymentProof" accept="image/*,.pdf">
            <button class="btn btn-primary" onclick="bankTransfer.submitProof('${orderId}')">
              <i class="fas fa-upload"></i> Submit Proof
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
  }

  submitProof(orderId) {
    const fileInput = document.getElementById('paymentProof');
    if (!fileInput.files[0]) {
      utils.showToast('Please select a file', 'error');
      return;
    }

    // In a real app, upload to server
    utils.showToast('Proof submitted! We will verify your payment shortly.', 'success');
    
    // Update order status
    const orders = JSON.parse(localStorage.getItem('victorBikes_orders') || '[]');
    const orderIndex = orders.findIndex(o => o.orderId === orderId);
    
    if (orderIndex !== -1) {
      orders[orderIndex].status = 'payment_pending';
      orders[orderIndex].paymentProof = 'submitted';
      localStorage.setItem('victorBikes_orders', JSON.stringify(orders));
    }

    // Close modal after delay
    setTimeout(() => {
      const modal = document.querySelector('.modal.active');
      if (modal) modal.remove();
      document.body.style.overflow = 'auto';
    }, 2000);
  }
}

const bankTransfer = new BankTransfer();