// Cart Management
class Cart {
    constructor() {
      this.items = this.loadCart();
      this.init();
    }
  
    init() {
      this.setupCartEvents();
      this.updateCartUI();
    }
  
    loadCart() {
      const savedCart = localStorage.getItem('victorBikes_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    }
  
    saveCart() {
      localStorage.setItem('victorBikes_cart', JSON.stringify(this.items));
    }
  
    addToCart(productId, quantity = 1) {
      const product = products.getProductById(productId);
      
      if (!product) {
        utils.showToast('Product not found!', 'error');
        return;
      }
  
      // Check if product is already in cart
      const existingItem = this.items.find(item => item.id === productId);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        this.items.push({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          category: product.category,
          quantity: quantity
        });
      }
  
      this.saveCart();
      this.updateCartUI();
      this.showCart();
      utils.showToast(`${product.title} added to cart!`, 'success');
    }
  
    removeFromCart(productId) {
      this.items = this.items.filter(item => item.id !== productId);
      this.saveCart();
      this.updateCartUI();
      utils.showToast('Item removed from cart', 'info');
    }
  
    updateQuantity(productId, newQuantity) {
      const item = this.items.find(item => item.id === productId);
      
      if (item) {
        if (newQuantity <= 0) {
          this.removeFromCart(productId);
        } else {
          item.quantity = newQuantity;
          this.saveCart();
          this.updateCartUI();
        }
      }
    }
  
    clearCart() {
      this.items = [];
      this.saveCart();
      this.updateCartUI();
      utils.showToast('Cart cleared', 'info');
    }
  
    getCartTotal() {
      return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
  
    getItemCount() {
      return this.items.reduce((count, item) => count + item.quantity, 0);
    }
  
    updateCartUI() {
      const cartCount = document.getElementById('cartCount');
      const cartItems = document.getElementById('cartItems');
      const cartTotal = document.getElementById('cartTotal');
  
      if (cartCount) {
        cartCount.textContent = this.getItemCount();
      }
  
      if (cartItems) {
        if (this.items.length === 0) {
          cartItems.innerHTML = `
            <div class="empty-cart">
              <i class="fas fa-shopping-cart"></i>
              <p>Your cart is empty</p>
              <a href="#products" class="btn btn-primary">Shop Now</a>
            </div>
          `;
        } else {
          cartItems.innerHTML = this.items.map(item => this.createCartItemHTML(item)).join('');
          
          // Add event listeners to quantity buttons
          cartItems.querySelectorAll('.qty-btn').forEach(button => {
            button.addEventListener('click', (e) => {
              const productId = e.currentTarget.dataset.id;
              const action = e.currentTarget.dataset.action;
              const item = this.items.find(item => item.id === productId);
              
              if (item) {
                if (action === 'increase') {
                  this.updateQuantity(productId, item.quantity + 1);
                } else if (action === 'decrease') {
                  this.updateQuantity(productId, item.quantity - 1);
                }
              }
            });
          });
  
          // Add event listeners to remove buttons
          cartItems.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
              const productId = e.currentTarget.dataset.id;
              this.removeFromCart(productId);
            });
          });
        }
      }
  
      if (cartTotal) {
        cartTotal.textContent = utils.formatCurrency(this.getCartTotal());
      }
    }
  
    createCartItemHTML(item) {
      return `
        <div class="cart-item" data-id="${item.id}">
          <img src="${item.image}" alt="${item.title}" class="cart-item-image">
          <div class="cart-item-details">
            <h4 class="cart-item-title">${item.title}</h4>
            <div class="cart-item-meta">
              <span class="cart-item-price">${utils.formatCurrency(item.price)}</span>
              <span class="cart-item-category">${item.category}</span>
            </div>
            <div class="cart-item-controls">
              <button class="qty-btn" data-id="${item.id}" data-action="decrease">
                <i class="fas fa-minus"></i>
              </button>
              <span class="cart-item-quantity">${item.quantity}</span>
              <button class="qty-btn" data-id="${item.id}" data-action="increase">
                <i class="fas fa-plus"></i>
              </button>
              <button class="remove-item" data-id="${item.id}">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }
  
    setupCartEvents() {
      const cartBtn = document.getElementById('cartBtn');
      const closeCart = document.getElementById('closeCart');
      const cartOverlay = document.getElementById('cartOverlay');
      const clearCartBtn = document.getElementById('clearCartBtn');
      const checkoutBtn = document.getElementById('checkoutBtn');
  
      if (cartBtn) {
        cartBtn.addEventListener('click', () => this.showCart());
      }
  
      if (closeCart) {
        closeCart.addEventListener('click', () => this.hideCart());
      }
  
      if (cartOverlay) {
        cartOverlay.addEventListener('click', () => this.hideCart());
      }
  
      if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
          if (this.items.length > 0) {
            if (confirm('Are you sure you want to clear your cart?')) {
              this.clearCart();
            }
          }
        });
      }
  
      if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => this.checkout());
      }
    }
  
    showCart() {
      const cartSidebar = document.getElementById('cartSidebar');
      const cartOverlay = document.getElementById('cartOverlay');
      
      if (cartSidebar) {
        cartSidebar.classList.add('active');
      }
      
      if (cartOverlay) {
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }
  
    hideCart() {
      const cartSidebar = document.getElementById('cartSidebar');
      const cartOverlay = document.getElementById('cartOverlay');
      
      if (cartSidebar) {
        cartSidebar.classList.remove('active');
      }
      
      if (cartOverlay) {
        cartOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    }
  
   // Add this to the checkout function in cart.js
checkout() {
  if (this.items.length === 0) {
    utils.showToast('Your cart is empty!', 'error');
    return;
  }

  // Check if user is logged in
  if (!auth.isLoggedIn()) {
    utils.showToast('Please login to continue checkout', 'warning');
    setTimeout(() => {
      window.location.href = 'login.html?redirect=checkout';
    }, 1000);
    return;
  }

  // Show payment options
  this.showPaymentOptions();
}

showPaymentOptions() {
  const modal = document.createElement('div');
  modal.className = 'payment-modal active';
  modal.innerHTML = `
    <div class="modal-overlay"></div>
    <div class="modal-content">
      <button class="modal-close" onclick="this.closest('.payment-modal').remove()">&times;</button>
      <div class="payment-options">
        <h2>Select Payment Method</h2>
        <p>Total: ${utils.formatCurrency(this.getCartTotal())}</p>
        
        <div class="payment-methods">
          <button class="payment-method-btn" onclick="cart.payWithFlutterwave()">
            <i class="fas fa-credit-card"></i>
            <div>
              <h4>Flutterwave</h4>
              <p>Pay with card, bank transfer, or mobile money</p>
            </div>
          </button>
          
          <button class="payment-method-btn" onclick="cart.payWithBankTransfer()">
            <i class="fas fa-university"></i>
            <div>
              <h4>Bank Transfer</h4>
              <p>Transfer to our Opay account</p>
            </div>
          </button>
          
          <button class="payment-method-btn" onclick="cart.payOnDelivery()">
            <i class="fas fa-truck"></i>
            <div>
              <h4>Pay on Delivery</h4>
              <p>Pay when your order arrives</p>
            </div>
          </button>
        </div>
        
        <div class="bank-details" style="display: none;" id="bankDetails">
          <h4>Bank Transfer Details</h4>
          <div class="bank-info">
            <p><strong>Bank:</strong> Opay</p>
            <p><strong>Account Name:</strong> Victor Ejike</p>
            <p><strong>Account Number:</strong> 8062463468</p>
          </div>
          <button class="btn btn-primary" onclick="cart.confirmBankTransfer()">
            I have made the transfer
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
}

payWithFlutterwave() {
  const user = auth.getCurrentUser();
  const total = this.getCartTotal();
  
  // Flutterwave configuration
  const flutterwaveConfig = {
    public_key: "FLWPUBK_TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxx", // Replace with your public key
    tx_ref: "VB" + Date.now(),
    amount: total,
    currency: "NGN",
    payment_options: "card, banktransfer, ussd",
    customer: {
      email: user.email,
      phone_number: user.phone,
      name: user.name
    },
    customizations: {
      title: "Victor Bikes",
      description: `Payment for ${this.items.length} item(s)`,
      logo: "https://victorbikes.com/logo.png"
    },
    callback: function(response) {
      cart.handleFlutterwaveCallback(response);
    },
    onclose: function() {
      utils.showToast('Payment cancelled', 'info');
    }
  };

  // Initialize Flutterwave
  FlutterwaveCheckout(flutterwaveConfig);
}

handleFlutterwaveCallback(response) {
  if (response.status === 'successful') {
    // Create payment record
    const payment = {
      id: response.transaction_id,
      orderId: 'VB' + Date.now().toString().slice(-8),
      amount: response.amount,
      currency: response.currency,
      status: 'successful',
      method: 'flutterwave',
      reference: response.tx_ref,
      customerEmail: response.customer.email,
      date: new Date().toISOString()
    };

    // Save payment
    const payments = JSON.parse(localStorage.getItem('victorBikes_payments') || '[]');
    payments.push(payment);
    localStorage.setItem('victorBikes_payments', JSON.stringify(payments));

    // Create order
    this.createOrder(payment.orderId, 'flutterwave');
    
    utils.showToast('Payment successful! Order confirmed.', 'success');
  } else {
    utils.showToast('Payment failed. Please try again.', 'error');
  }
}

payWithBankTransfer() {
  document.getElementById('bankDetails').style.display = 'block';
}

confirmBankTransfer() {
  // Create pending payment record
  const payment = {
    id: 'BT' + Date.now().toString().slice(-8),
    orderId: 'VB' + Date.now().toString().slice(-8),
    amount: this.getCartTotal(),
    currency: 'NGN',
    status: 'pending',
    method: 'bank_transfer',
    reference: 'Bank Transfer - Awaiting confirmation',
    date: new Date().toISOString()
  };

  // Save payment
  const payments = JSON.parse(localStorage.getItem('victorBikes_payments') || '[]');
  payments.push(payment);
  localStorage.setItem('victorBikes_payments', JSON.stringify(payments));

  // Create order with pending status
  this.createOrder(payment.orderId, 'bank_transfer', 'pending');
  
  utils.showToast('Order placed! Please complete the bank transfer.', 'success');
}

payOnDelivery() {
  this.createOrder('VB' + Date.now().toString().slice(-8), 'cash_on_delivery', 'pending');
  utils.showToast('Order placed! You will pay on delivery.', 'success');
}

createOrder(orderId, paymentMethod, status = 'completed') {
  const user = auth.getCurrentUser();
  
  const orderData = {
    orderId,
    items: this.items,
    total: this.getCartTotal(),
    customer: {
      name: user.name,
      email: user.email,
      phone: user.phone
    },
    paymentMethod,
    orderDate: new Date().toISOString(),
    status: status
  };

  // Save order
  const orders = JSON.parse(localStorage.getItem('victorBikes_orders') || '[]');
  orders.push(orderData);
  localStorage.setItem('victorBikes_orders', JSON.stringify(orders));

  // Clear cart
  this.clearCart();
  
  // Hide cart
  this.hideCart();

  // Show confirmation
  setTimeout(() => {
    utils.showToast(`Order #${orderId} confirmed!`, 'success');
  }, 500);
}
}
  
  // Initialize cart
  const cart = new Cart();

  