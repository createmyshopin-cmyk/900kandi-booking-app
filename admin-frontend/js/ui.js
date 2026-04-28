/**
 * Global UI Controller
 */
const UI = {
  currentRoute: null,
  
  init() {
    this.bindEvents();
    this.initSocket();
  },

  initSocket() {
    // Initialize Socket.io connection to Node server
    this.socket = io('http://localhost:3000');

    this.socket.on('connect', () => {
      console.log('Connected to realtime server');
    });

    this.socket.on('new-booking', (data) => {
      // Play sound if you have one or just show toast
      this.showToast(`New Booking Received: ${data.guest_name}`, 'info');

      // Refresh data if we are on Dashboard or Bookings page
      if (this.currentRoute === 'dashboard') {
        this.initDashboard();
      } else if (this.currentRoute === 'bookings') {
        Bookings.loadData();
      }
    });

    this.socket.on('booking-updated', (data) => {
      // Optionally show toast for updates (if not triggered by this user)
      // this.showToast(`Booking #${data.id} updated to ${data.status}`, 'info');
      
      // Refresh data if on relevant pages
      if (this.currentRoute === 'dashboard') {
        this.initDashboard();
      } else if (this.currentRoute === 'bookings') {
        Bookings.loadData();
      }
    });
  },

  bindEvents() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    const toggleMenu = () => {
      sidebar.classList.toggle('-translate-x-full');
      overlay.classList.toggle('hidden');
    };

    menuToggle?.addEventListener('click', toggleMenu);
    overlay?.addEventListener('click', toggleMenu);

    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const route = e.currentTarget.getAttribute('data-route');
        if (route) {
          this.navigateTo(route);
          if (window.innerWidth < 768) toggleMenu(); // Close menu on mobile
        }
      });
    });

    // Close modal on outside click
    const modalContainer = document.getElementById('modal-container');
    modalContainer?.addEventListener('click', (e) => {
      if (e.target === modalContainer) {
        this.closeModal();
      }
    });
  },

  async navigateTo(route) {
    if (this.currentRoute === route) return;
    
    const contentArea = document.getElementById('app-content');
    const pageTitle = document.getElementById('page-title');
    
    // Set loading state
    contentArea.innerHTML = `<div class="flex items-center justify-center h-full text-primary"><i class='bx bx-loader-alt animate-spin text-4xl'></i></div>`;
    
    this.updateActiveNav(route);
    this.currentRoute = route;
    
    try {
      // In a real app, you might fetch HTML from server. 
      // For Vite dev server, fetching raw HTML files works perfectly.
      const response = await fetch(`pages/${route}.html`);
      if (!response.ok) throw new Error('Page not found');
      
      const html = await response.text();
      contentArea.innerHTML = html;
      
      // Update Title
      pageTitle.textContent = route.charAt(0).toUpperCase() + route.slice(1);
      
      // Initialize page specific scripts
      if (route === 'dashboard') {
        this.initDashboard();
      } else if (route === 'bookings') {
        Bookings.init();
      } else if (route === 'analytics') {
        Analytics.init();
      } else if (route === 'settings') {
        Settings.init();
      } else if (route === 'guest-checkins') {
        GuestCheckins.init();
      } else if (route === 'stays') {
        Stays.init();
      }
      
    } catch (error) {
      console.error(error);
      contentArea.innerHTML = `<div class="flex flex-col items-center justify-center h-full text-gray-500"><i class='bx bx-error-alt text-5xl mb-4'></i><p>Failed to load page.</p></div>`;
      this.showToast('Error loading page', 'error');
    }
  },

  updateActiveNav(route) {
    document.querySelectorAll('.nav-link').forEach(link => {
      const linkRoute = link.getAttribute('data-route');
      if (linkRoute === route) {
        link.classList.remove('text-gray-400', 'hover:bg-gray-800');
        link.classList.add('bg-accent', 'text-white');
      } else {
        link.classList.add('text-gray-400', 'hover:bg-gray-800');
        link.classList.remove('bg-accent', 'text-white');
      }
    });
  },

  async initDashboard() {
    try {
      const stats = await API.getStats();
      document.getElementById('stat-total-bookings').textContent = stats.totalBookings;
      document.getElementById('stat-today-checkins').textContent = stats.todayCheckins;
      document.getElementById('stat-tomorrow-checkins').textContent = stats.tomorrowCheckins;
      document.getElementById('stat-total-guests').textContent = stats.totalGuests;

      const bookings = await API.getBookings();
      const today = new Date().toISOString().split('T')[0];
      const tomorrowDate = new Date();
      tomorrowDate.setDate(tomorrowDate.getDate() + 1);
      const tomorrow = tomorrowDate.toISOString().split('T')[0];

      const todayGuests = bookings.filter(b => b.checkin_date === today && b.status !== 'cancelled');
      const tomorrowGuests = bookings.filter(b => b.checkin_date === tomorrow && b.status !== 'cancelled');

      const renderList = (data, elementId, emptyText) => {
        const tbody = document.getElementById(elementId);
        if (!tbody) return;
        if (data.length === 0) {
          tbody.innerHTML = `<tr><td class="p-8 text-center text-gray-500 italic">${emptyText}</td></tr>`;
          return;
        }
        tbody.innerHTML = data.map(b => `
          <tr class="hover:bg-gray-50 transition-colors">
            <td class="p-4">
              <p class="font-bold text-gray-900">${b.guest_name}</p>
              <p class="text-xs text-gray-500 flex items-center gap-1 mt-1"><i class='bx bx-phone'></i> ${b.mobile}</p>
            </td>
            <td class="p-4 text-right">
              ${this.getStatusBadge(b.status)}
            </td>
          </tr>
        `).join('');
      };

      renderList(todayGuests, 'today-guests-list', 'No guests checking in today');
      renderList(tomorrowGuests, 'tomorrow-guests-list', 'No guests checking in tomorrow');
    } catch (e) {
      this.showToast('Failed to load dashboard data', 'error');
    }
  },

  showModal(contentHTML) {
    const container = document.getElementById('modal-container');
    const content = document.getElementById('modal-content');
    
    content.innerHTML = contentHTML;
    
    container.classList.remove('hidden');
    // Trigger reflow
    void container.offsetWidth;
    
    container.classList.remove('opacity-0');
    content.classList.remove('scale-95');
  },

  closeModal() {
    const container = document.getElementById('modal-container');
    const content = document.getElementById('modal-content');
    
    container.classList.add('opacity-0');
    content.classList.add('scale-95');
    
    setTimeout(() => {
      container.classList.add('hidden');
      content.innerHTML = '';
    }, 300); // match transition duration
  },

  showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    
    const colors = {
      success: 'bg-gray-900 text-white',
      error: 'bg-red-500 text-white',
      info: 'bg-blue-500 text-white'
    };
    
    const icons = {
      success: 'bx-check-circle',
      error: 'bx-x-circle',
      info: 'bx-info-circle'
    };

    toast.className = `flex items-center gap-3 px-6 py-4 rounded-xl shadow-xl transition-all duration-300 transform translate-y-10 opacity-0 ${colors[type]}`;
    toast.innerHTML = `
      <i class='bx ${icons[type]} text-xl'></i>
      <span class="font-medium text-sm">${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Animate in
    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-10', 'opacity-0');
    });
    
    // Auto remove
    setTimeout(() => {
      toast.classList.add('translate-y-10', 'opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  getStatusBadge(status) {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    const style = styles[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    return `<span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${style}">${status}</span>`;
  },

  formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
};
