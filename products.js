// Products Data and Functions
class Products {
    constructor() {
      this.products = this.getProductsData();
      this.services = this.getServicesData();
      this.categories = this.getCategories();
      this.init();
    }
  
    init() {
      this.loadProducts();
      this.setupFilters();
    }
  
    getProductsData() {
      return [
        {
          id: 'bike-001',
          title: 'Mountain Bike Pro 27.5"',
          category: 'bikes',
          price: 85000,
          description: 'Full suspension mountain bike with 21-speed Shimano gears, perfect for rugged terrain.',
          image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=60',
          stock: 5,
          rating: 4.5,
          features: ['Full suspension', '21-speed Shimano', 'Disc brakes', 'Lightweight alloy frame']
        },
        {
          id: 'bike-002',
          title: 'Road Bike Elite Carbon',
          category: 'bikes',
          price: 120000,
          description: 'Lightweight carbon frame road bike for speed enthusiasts and professional cyclists.',
          image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=800&q=60',
          stock: 3,
          rating: 4.8,
          features: ['Carbon frame', 'Ultegra groupset', 'Aero wheels', 'Weight: 7.5kg']
        },
        {
          id: 'bike-003',
          title: 'Kids Bicycle 20"',
          category: 'bikes',
          price: 32000,
          description: 'Sturdy children bike with training wheels option, perfect for learning to ride.',
          image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=800&q=60',
          stock: 8,
          rating: 4.2,
          features: ['Adjustable seat', 'Training wheels included', 'Front basket', 'Bell included']
        },
        {
          id: 'electric-001',
          title: 'Electric Scooter Pro',
          category: 'electric',
          price: 95000,
          description: 'Foldable electric scooter with 25km range, perfect for urban commuting.',
          image: 'https://images.unsplash.com/photo-1569078449085-7d5d8c657b5d?auto=format&fit=crop&w=800&q=60',
          stock: 4,
          rating: 4.3,
          features: ['25km range', 'Foldable design', 'LED display', 'Max speed: 25km/h']
        },
        {
          id: 'electric-002',
          title: 'E-Bike Commuter',
          category: 'electric',
          price: 185000,
          description: 'Electric bicycle with pedal assist, 50km battery range, perfect for daily commuting.',
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=60',
          stock: 2,
          rating: 4.7,
          features: ['50km range', 'Pedal assist', 'Removable battery', '7-speed gear']
        },
        {
          id: 'part-001',
          title: 'Shimano Gear Set 21-speed',
          category: 'parts',
          price: 28000,
          description: 'Complete gear set for mountain bikes, including shifters, derailleurs, and cassette.',
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=60',
          stock: 15,
          rating: 4.4,
          features: ['21-speed', 'Shimano quality', 'Easy installation', 'Compatible with most bikes']
        },
        {
          id: 'part-002',
          title: 'Hydraulic Disc Brake Set',
          category: 'parts',
          price: 36000,
          description: 'Front + rear disc brake set with pads, offering superior stopping power.',
          image: 'https://images.unsplash.com/photo-1600180758897-9f8f7b9c3f9e?auto=format&fit=crop&w=800&q=60',
          stock: 12,
          rating: 4.6,
          features: ['Hydraulic system', 'Included pads', 'Easy adjustment', 'Weather resistant']
        },
        {
          id: 'part-003',
          title: 'Victor Elite Seatpost 350mm',
          category: 'parts',
          price: 12000,
          description: 'Lightweight alloy seatpost, available in 27.2 / 31.6 mm options.',
          image: 'https://images.unsplash.com/photo-1509395062183-67c5ad6faff9?auto=format&fit=crop&w=800&q=60',
          stock: 20,
          rating: 4.1,
          features: ['Lightweight alloy', '350mm length', 'Multiple sizes', 'Quick release']
        },
        {
          id: 'acc-001',
          title: 'Bike Helmet (Adult)',
          category: 'accessories',
          price: 6500,
          description: 'Safety certified helmet with adjustable fit and ventilation system.',
          image: 'https://images.unsplash.com/photo-1534531173927-aeb928d54385?auto=format&fit=crop&w=800&q=60',
          stock: 25,
          rating: 4.5,
          features: ['Safety certified', 'Adjustable fit', 'Ventilation', 'Multiple colors']
        },
        {
          id: 'acc-002',
          title: 'Bike Lock Heavy Duty',
          category: 'accessories',
          price: 4500,
          description: 'Steel U-lock with anti-theft guarantee, secure your bike anywhere.',
          image: 'https://images.unsplash.com/photo-1587031505983-41e583689e9c?auto=format&fit=crop&w=800&q=60',
          stock: 30,
          rating: 4.3,
          features: ['Steel construction', 'Anti-theft', 'Weather proof', 'Easy to carry']
        },
        {
          id: 'acc-003',
          title: 'Saddle Bag (Waterproof)',
          category: 'accessories',
          price: 3500,
          description: 'Medium waterproof saddle bag for tools, phone, and essentials.',
          image: 'https://images.unsplash.com/photo-1558981285-8a6d0d7c6a51?auto=format&fit=crop&w=800&q=60',
          stock: 40,
          rating: 4.0,
          features: ['Waterproof', 'Multiple compartments', 'Reflective strips', 'Easy mounting']
        },
        {
          id: 'acc-004',
          title: 'Bike Repair Kit',
          category: 'accessories',
          price: 5500,
          description: 'Complete repair kit with tools, patch kit, and mini pump.',
          image: 'https://images.unsplash.com/photo-1618164431597-b30f509b7c85?auto=format&fit=crop&w=800&q=60',
          stock: 18,
          rating: 4.6,
          features: ['15 tools included', 'Patch kit', 'Mini pump', 'Portable case']
        }
      ];
    }
  
    getServicesData() {
      return [
        {
          id: 'service-001',
          title: 'Basic Bike Tune-up',
          category: 'services',
          price: 5000,
          description: 'Includes brake adjustment, gear tuning, lubrication, and safety check.',
          duration: '1-2 hours',
          includes: [
            'Brake adjustment',
            'Gear tuning',
            'Chain lubrication',
            'Tire pressure check',
            'Safety inspection'
          ]
        },
        {
          id: 'service-002',
          title: 'Full Service Package',
          category: 'services',
          price: 15000,
          description: 'Complete overhaul including parts replacement, deep clean, and performance tuning.',
          duration: '3-4 hours',
          includes: [
            'Complete disassembly',
            'Deep cleaning',
            'Parts inspection',
            'Replace worn parts',
            'Performance tuning',
            'Test ride'
          ]
        },
        {
          id: 'service-003',
          title: 'Electric Bike Service',
          category: 'services',
          price: 10000,
          description: 'Specialized service for electric bikes and scooters, including battery check.',
          duration: '2-3 hours',
          includes: [
            'Battery diagnostic',
            'Motor inspection',
            'Electrical system check',
            'Brake adjustment',
            'Performance test'
          ]
        },
        {
          id: 'service-004',
          title: 'Emergency Repair',
          category: 'services',
          price: 3000,
          description: 'Quick fix for urgent issues like flat tires, broken chains, or brake failures.',
          duration: '30-60 mins',
          includes: [
            'Flat tire repair',
            'Chain repair',
            'Brake adjustment',
            'Quick safety check'
          ]
        }
      ];
    }
  
    getCategories() {
      return [
        { id: 'all', name: 'All Products', icon: 'fas fa-box' },
        { id: 'bikes', name: 'Complete Bikes', icon: 'fas fa-bicycle' },
        { id: 'electric', name: 'Electric Vehicles', icon: 'fas fa-bolt' },
        { id: 'parts', name: 'Bike Parts', icon: 'fas fa-cog' },
        { id: 'accessories', name: 'Accessories', icon: 'fas fa-toolbox' },
        { id: 'services', name: 'Services', icon: 'fas fa-tools' }
      ];
    }
  
    loadProducts(filter = 'all', searchQuery = '') {
      const productsGrid = document.getElementById('productsGrid');
      const servicesGrid = document.getElementById('servicesGrid');
      
      if (!productsGrid && !servicesGrid) return;
  
      let filteredProducts = this.products;
      
      // Apply category filter
      if (filter !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === filter);
      }
      
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredProducts = filteredProducts.filter(product =>
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
        );
      }
  
      // Load products to grid
      if (productsGrid) {
        if (filteredProducts.length === 0) {
          productsGrid.innerHTML = `
            <div class="no-products">
              <i class="fas fa-search"></i>
              <h3>No products found</h3>
              <p>Try adjusting your search or filter</p>
            </div>
          `;
        } else {
          productsGrid.innerHTML = filteredProducts.map(product => this.createProductCard(product)).join('');
        }
      }
  
      // Load services to grid
      if (servicesGrid) {
        servicesGrid.innerHTML = this.services.map(service => this.createServiceCard(service)).join('');
      }
    }
  
    createProductCard(product) {
      return `
        <div class="product-card" data-id="${product.id}">
          <img src="${product.image}" alt="${product.title}" class="product-image">
          <div class="product-content">
            <div class="product-meta">
              <span class="product-category">${product.category}</span>
              <div class="product-rating">
                <i class="fas fa-star"></i>
                <span>${product.rating}</span>
              </div>
            </div>
            <h3 class="product-title">${utils.formatProductName(product.title)}</h3>
            <p class="product-description">${product.description.substring(0, 80)}...</p>
            <div class="product-footer">
              <div class="product-price">${utils.formatCurrency(product.price)}</div>
              <div class="product-actions">
                <button class="btn btn-primary" onclick="cart.addToCart('${product.id}')">
                  <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
                <button class="btn btn-secondary" onclick="products.showProductDetail('${product.id}')">
                  <i class="fas fa-eye"></i> View
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  
    createServiceCard(service) {
      return `
        <div class="service-card" data-id="${service.id}">
          <div class="service-icon">
            <i class="fas fa-tools"></i>
          </div>
          <h3 class="service-title">${service.title}</h3>
          <p class="service-description">${service.description}</p>
          <div class="service-meta">
            <span class="service-duration">
              <i class="fas fa-clock"></i> ${service.duration}
            </span>
            <span class="service-price">${utils.formatCurrency(service.price)}</span>
          </div>
          <ul class="service-features">
            ${service.includes.map(item => `<li><i class="fas fa-check"></i> ${item}</li>`).join('')}
          </ul>
          <button class="btn btn-primary" onclick="products.bookService('${service.id}')">
            <i class="fas fa-calendar-alt"></i> Book Now
          </button>
        </div>
      `;
    }
  
    setupFilters() {
      const filtersContainer = document.getElementById('categoryFilters');
      const searchInput = document.getElementById('searchInput');
      
      if (filtersContainer) {
        filtersContainer.innerHTML = this.categories.map(category => `
          <button class="filter-btn" data-category="${category.id}">
            <i class="${category.icon}"></i> ${category.name}
          </button>
        `).join('');
  
        // Add click event to filter buttons
        filtersContainer.querySelectorAll('.filter-btn').forEach(button => {
          button.addEventListener('click', () => {
            const category = button.dataset.category;
            
            // Update active button
            filtersContainer.querySelectorAll('.filter-btn').forEach(btn => {
              btn.classList.remove('active');
            });
            button.classList.add('active');
            
            // Load filtered products
            this.loadProducts(category, searchInput ? searchInput.value : '');
          });
        });
  
        // Set first button as active
        const firstButton = filtersContainer.querySelector('.filter-btn');
        if (firstButton) firstButton.classList.add('active');
      }
  
      // Setup search input
      if (searchInput) {
        const debouncedSearch = utils.debounce(() => {
          const activeFilter = document.querySelector('.filter-btn.active');
          const filter = activeFilter ? activeFilter.dataset.category : 'all';
          this.loadProducts(filter, searchInput.value);
        }, 300);
  
        searchInput.addEventListener('input', debouncedSearch);
      }
    }
  
    showProductDetail(productId) {
      const product = this.products.find(p => p.id === productId);
      if (!product) return;
  
      // Create modal for product detail
      const modal = document.createElement('div');
      modal.className = 'product-modal';
      modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
          <button class="modal-close">&times;</button>
          <div class="product-detail">
            <div class="product-detail-image">
              <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="product-detail-info">
              <h2>${product.title}</h2>
              <div class="product-detail-meta">
                <span class="category">${product.category}</span>
                <span class="rating">
                  <i class="fas fa-star"></i> ${product.rating}
                </span>
                <span class="stock">${product.stock} in stock</span>
              </div>
              <p class="product-detail-description">${product.description}</p>
              <div class="product-detail-features">
                <h4>Features:</h4>
                <ul>
                  ${product.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
                </ul>
              </div>
              <div class="product-detail-price">
                <span>${utils.formatCurrency(product.price)}</span>
                <div class="product-detail-actions">
                  <button class="btn btn-primary" onclick="cart.addToCart('${product.id}')">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                  </button>
                  <button class="btn btn-secondary" onclick="cart.buyNow('${product.id}')">
                    <i class="fas fa-bolt"></i> Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
  
      document.body.appendChild(modal);
      document.body.style.overflow = 'hidden';
  
      // Close modal
      modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.remove();
        document.body.style.overflow = 'auto';
      });
  
      modal.querySelector('.modal-overlay').addEventListener('click', () => {
        modal.remove();
        document.body.style.overflow = 'auto';
      });
    }
  
    bookService(serviceId) {
      const service = this.services.find(s => s.id === serviceId);
      if (!service) return;
  
      // Create booking modal
      const modal = document.createElement('div');
      modal.className = 'booking-modal';
      modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
          <button class="modal-close">&times;</button>
          <div class="booking-form">
            <h2>Book Service: ${service.title}</h2>
            <p class="service-price">${utils.formatCurrency(service.price)}</p>
            <p class="service-description">${service.description}</p>
            
            <form id="bookingForm">
              <div class="form-group">
                <label for="bookingName">Full Name</label>
                <input type="text" id="bookingName" required>
              </div>
              <div class="form-group">
                <label for="bookingPhone">Phone Number</label>
                <input type="tel" id="bookingPhone" required>
              </div>
              <div class="form-group">
                <label for="bookingDate">Preferred Date</label>
                <input type="date" id="bookingDate" required>
              </div>
              <div class="form-group">
                <label for="bookingTime">Preferred Time</label>
                <select id="bookingTime" required>
                  <option value="">Select time</option>
                  <option value="9am-11am">9:00 AM - 11:00 AM</option>
                  <option value="11am-1pm">11:00 AM - 1:00 PM</option>
                  <option value="1pm-3pm">1:00 PM - 3:00 PM</option>
                  <option value="3pm-5pm">3:00 PM - 5:00 PM</option>
                </select>
              </div>
              <div class="form-group">
                <label for="bookingNotes">Additional Notes</label>
                <textarea id="bookingNotes" rows="3"></textarea>
              </div>
              <div class="form-actions">
                <button type="submit" class="btn btn-primary">
                  <i class="fas fa-calendar-check"></i> Confirm Booking
                </button>
                <button type="button" class="btn btn-secondary modal-close">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      `;
  
      document.body.appendChild(modal);
      document.body.style.overflow = 'hidden';
  
      // Set minimum date to today
      const dateInput = modal.querySelector('#bookingDate');
      const today = new Date().toISOString().split('T')[0];
      dateInput.min = today;
  
      // Handle form submission
      const form = modal.querySelector('#bookingForm');
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.submitBooking(form, service);
      });
  
      // Close modal
      modal.querySelectorAll('.modal-close').forEach(button => {
        button.addEventListener('click', () => {
          modal.remove();
          document.body.style.overflow = 'auto';
        });
      });
  
      modal.querySelector('.modal-overlay').addEventListener('click', () => {
        modal.remove();
        document.body.style.overflow = 'auto';
      });
    }
  
    submitBooking(form, service) {
      const formData = new FormData(form);
      const bookingData = {
        service: service.title,
        price: service.price,
        name: formData.get('bookingName'),
        phone: formData.get('bookingPhone'),
        date: formData.get('bookingDate'),
        time: formData.get('bookingTime'),
        notes: formData.get('bookingNotes'),
        timestamp: new Date().toISOString()
      };
  
      // Save booking to localStorage
      const bookings = JSON.parse(localStorage.getItem('victorBikes_bookings') || '[]');
      bookings.push(bookingData);
      localStorage.setItem('victorBikes_bookings', JSON.stringify(bookings));
  
      // Show success message
      utils.showToast(`Service booking confirmed! We'll call you at ${bookingData.phone} to confirm.`, 'success');
      
      // Close modal
      const modal = document.querySelector('.booking-modal');
      if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
      }
    }
  
    getProductById(id) {
      return this.products.find(product => product.id === id);
    }
  
    getServiceById(id) {
      return this.services.find(service => service.id === id);
    }
  
    getProductsByCategory(category) {
      return this.products.filter(product => product.category === category);
    }
  
    searchProducts(query) {
      const searchTerm = query.toLowerCase();
      return this.products.filter(product =>
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      );
    }
  }
  
  // Initialize products
  const products = new Products();