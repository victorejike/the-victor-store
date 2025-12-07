// Utility Functions
class Utils {
    constructor() {
      this.init();
    }
  
    init() {
      // Initialize utility functions
    }
  
    // Format currency
    formatCurrency(amount) {
      return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN'
      }).format(amount);
    }
  
    // Show toast notification
    showToast(message, type = 'info', duration = 5000) {
      const toastContainer = document.getElementById('toastContainer') || this.createToastContainer();
      
      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      toast.innerHTML = `
        <div class="toast-content">
          <strong>${type.charAt(0).toUpperCase() + type.slice(1)}:</strong>
          <span>${message}</span>
        </div>
      `;
  
      toastContainer.appendChild(toast);
  
      // Auto remove after duration
      setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
      }, duration);
  
      // Add click to dismiss
      toast.addEventListener('click', () => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
      });
    }
  
    createToastContainer() {
      const container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
      return container;
    }
  
    // Validate email
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }
  
    // Validate Nigerian phone number
    validatePhone(phone) {
      const re = /^(\+234|0)[789][01]\d{8}$/;
      return re.test(phone.replace(/\s/g, ''));
    }
  
    // Debounce function
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }
  
    // Format date
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  
    // Generate unique ID
    generateId() {
      return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
  
    // Check if user is on mobile
    isMobile() {
      return window.innerWidth <= 768;
    }
  
    // Smooth scroll to element
    scrollToElement(elementId) {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  
    // Format product name
    formatProductName(name) {
      return name.length > 50 ? name.substring(0, 47) + '...' : name;
    }
  
    // Calculate discount percentage
    calculateDiscount(originalPrice, salePrice) {
      return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
    }
  
    // Sanitize input
    sanitizeInput(input) {
      const div = document.createElement('div');
      div.textContent = input;
      return div.innerHTML;
    }
  
    // Load script dynamically
    loadScript(src, callback) {
      const script = document.createElement('script');
      script.src = src;
      script.onload = callback;
      document.head.appendChild(script);
    }
  
    // Load CSS dynamically
    loadCSS(href) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    }
  
    // Get URL parameters
    getUrlParams() {
      const params = {};
      const queryString = window.location.search.substring(1);
      const pairs = queryString.split('&');
      
      for (const pair of pairs) {
        const [key, value] = pair.split('=');
        if (key) {
          params[decodeURIComponent(key)] = decodeURIComponent(value || '');
        }
      }
      
      return params;
    }
  
    // Set URL parameter
    setUrlParam(key, value) {
      const url = new URL(window.location);
      url.searchParams.set(key, value);
      window.history.pushState({}, '', url);
    }
  
    // Remove URL parameter
    removeUrlParam(key) {
      const url = new URL(window.location);
      url.searchParams.delete(key);
      window.history.pushState({}, '', url);
    }
  
    // Copy to clipboard
    copyToClipboard(text) {
      return navigator.clipboard.writeText(text);
    }
  
    // Share content
    shareContent(title, text, url) {
      if (navigator.share) {
        return navigator.share({
          title,
          text,
          url: url || window.location.href
        });
      }
      return Promise.reject('Web Share API not supported');
    }
  
    // Get current geolocation
    getLocation() {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject('Geolocation not supported');
          return;
        }
        
        navigator.geolocation.getCurrentPosition(
          position => resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }),
          error => reject(error.message)
        );
      });
    }
  
    // Open WhatsApp chat
    openWhatsApp(phone, message = '') {
      const formattedPhone = phone.replace(/\D/g, '');
      const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    }
  
    // Make phone call
    makePhoneCall(phone) {
      window.location.href = `tel:${phone}`;
    }
  
    // Open email client
    sendEmail(email, subject = '', body = '') {
      const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = url;
    }
  }
  
  // Initialize utils
  const utils = new Utils();