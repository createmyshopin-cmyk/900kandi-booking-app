/**
 * Bookings Page Controller
 */
const Bookings = {
  data: [],
  filteredData: [],
  role: localStorage.getItem('role') || 'admin', // Fallback to admin for dev
  
  async init() {
    this.bindEvents();
    await this.loadData();
  },

  bindEvents() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      let timeout = null;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          this.handleFilter(e.target.value);
        }, 500); // 500ms debounce
      });
    }

    document.getElementById('status-filter')?.addEventListener('change', (e) => this.handleFilter(null, e.target.value));
  },

  async loadData(searchQuery = '') {
    this.showLoading(true);
    try {
      this.data = await API.getBookings(searchQuery);
      this.filteredData = [...this.data];
      // Apply status filter locally if one is selected
      const statusFilter = document.getElementById('status-filter')?.value || 'all';
      if (statusFilter !== 'all') {
        this.filteredData = this.data.filter(b => b.status === statusFilter);
      }
      this.renderTable();
    } catch (e) {
      UI.showToast('Failed to load bookings', 'error');
    } finally {
      this.showLoading(false);
    }
  },

  showLoading(show) {
    const loading = document.getElementById('bookings-loading');
    const tableContainer = document.querySelector('.overflow-x-auto');
    const emptyState = document.getElementById('bookings-empty');
    
    if (!loading) return;

    if (show) {
      loading.classList.remove('hidden');
      tableContainer.classList.add('hidden');
      emptyState.classList.add('hidden');
    } else {
      loading.classList.add('hidden');
      tableContainer.classList.remove('hidden');
    }
  },

  handleFilter(searchQuery = null, status = null) {
    if (searchQuery !== null) {
      // Trigger API fetch if search query is updated
      this.loadData(searchQuery);
    } else {
      // Just local status filter update
      const currentSearch = document.getElementById('search-input')?.value || '';
      const statusFilter = status || 'all';
      
      this.filteredData = this.data.filter(b => {
        return statusFilter === 'all' || b.status === statusFilter;
      });
      this.renderTable();
    }
  },

  renderTable() {
    const tbody = document.getElementById('bookings-table-body');
    const emptyState = document.getElementById('bookings-empty');
    const tableContainer = document.querySelector('.overflow-x-auto');
    
    if (!tbody) return;

    if (this.filteredData.length === 0) {
      tableContainer.classList.add('hidden');
      emptyState.classList.remove('hidden');
      emptyState.classList.add('flex');
      return;
    }

    tableContainer.classList.remove('hidden');
    emptyState.classList.add('hidden');
    emptyState.classList.remove('flex');

    // Table Header configuration based on role
    const thead = document.querySelector('#bookings-table thead tr');
    if (thead) {
      if (this.role === 'guest_manager') {
        thead.innerHTML = `
          <th class="p-4 font-semibold text-gray-600 text-left w-20">ID</th>
          <th class="p-4 font-semibold text-gray-600 text-left">Guest Name</th>
          <th class="p-4 font-semibold text-gray-600 text-left">Dates</th>
          <th class="p-4 font-semibold text-gray-600 text-left">Guests</th>
          <th class="p-4 font-semibold text-gray-600 text-left">Category</th>
          <th class="p-4 font-semibold text-gray-600 text-right">Actions</th>
        `;
      } else {
        thead.innerHTML = `
          <th class="p-4 font-semibold text-gray-600 text-left w-20">ID</th>
          <th class="p-4 font-semibold text-gray-600 text-left">Guest</th>
          <th class="p-4 font-semibold text-gray-600 text-left">Mobile</th>
          <th class="p-4 font-semibold text-gray-600 text-left">Dates</th>
          <th class="p-4 font-semibold text-gray-600 text-left">Guests</th>
          <th class="p-4 font-semibold text-gray-600 text-left">Status</th>
          <th class="p-4 font-semibold text-gray-600 text-left hidden md:table-cell">Booked On</th>
          <th class="p-4 font-semibold text-gray-600 text-right">Actions</th>
        `;
      }
    }

    tbody.innerHTML = this.filteredData.map(b => {
      if (this.role === 'guest_manager') {
        return `
          <tr class="hover:bg-gray-50 transition-colors group">
            <td class="p-4 font-mono text-xs text-gray-500">#${b.id}</td>
            <td class="p-4"><p class="font-bold text-gray-900">${b.guest_name}</p></td>
            <td class="p-4">
              <p class="text-gray-900">${UI.formatDate(b.checkin_date)}</p>
              <p class="text-xs text-gray-500">to ${UI.formatDate(b.checkout_date)}</p>
            </td>
            <td class="p-4 text-gray-600">${b.total_guests || b.guests} Guests</td>
            <td class="p-4 text-gray-600">${b.category}</td>
            <td class="p-4 text-right space-x-2">
              <button onclick="Bookings.viewBooking(${b.id})" class="text-accent hover:text-primary transition-colors p-2 rounded-lg hover:bg-green-50" title="Edit Dates">
                <i class='bx bx-calendar-edit text-xl'></i>
              </button>
            </td>
          </tr>
        `;
      }

      return `
        <tr class="hover:bg-gray-50 transition-colors group">
          <td class="p-4 font-mono text-xs text-gray-500">#${b.id}</td>
          <td class="p-4">
            <p class="font-bold text-gray-900">${b.guest_name}</p>
          </td>
          <td class="p-4 text-gray-600">${b.mobile}</td>
          <td class="p-4">
            <p class="text-gray-900">${UI.formatDate(b.checkin_date)}</p>
            <p class="text-xs text-gray-500">to ${UI.formatDate(b.checkout_date)}</p>
          </td>
          <td class="p-4 text-gray-600">${b.total_guests || b.guests} Guests</td>
          <td class="p-4">${UI.getStatusBadge(b.status)}</td>
          <td class="p-4 text-gray-500 text-xs hidden md:table-cell">${UI.formatDate(b.created_at)}</td>
          <td class="p-4 text-right space-x-2">
            <button onclick="Bookings.viewBooking(${b.id})" class="text-accent hover:text-primary transition-colors p-2 rounded-lg hover:bg-green-50" title="View Details">
              <i class='bx bx-show text-xl'></i>
            </button>
            ${this.role === 'admin' ? `
            <button onclick="Bookings.deleteBooking(${b.id})" class="text-red-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50" title="Delete Booking">
              <i class='bx bx-trash text-xl'></i>
            </button>` : ''}
          </td>
        </tr>
      `;
    }).join('');
  },

  viewBooking(id) {
    const booking = this.data.find(b => b.id === id);
    if (!booking) return;

    let modalHTML = `
      <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
        <h2 class="text-xl font-bold text-gray-800">Booking #${booking.id}</h2>
        <button onclick="UI.closeModal()" class="text-gray-400 hover:text-gray-800 transition-colors">
          <i class='bx bx-x text-2xl'></i>
        </button>
      </div>
      
      <div class="p-6 space-y-6">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-2xl font-black text-gray-900">${booking.guest_name}</h3>
            ${this.role !== 'guest_manager' ? `<p class="text-gray-500 flex items-center gap-1 mt-1"><i class='bx bx-phone'></i> ${booking.mobile}</p>` : ''}
          </div>
          ${this.role !== 'guest_manager' ? UI.getStatusBadge(booking.status) : ''}
        </div>

        <div class="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
          <div>
            <p class="text-xs text-gray-500 uppercase font-semibold mb-1">Check-in</p>
            <input type="date" id="edit-checkin-${booking.id}" value="${booking.checkin_date}" class="w-full bg-white border border-gray-200 rounded p-1 font-bold text-gray-800">
          </div>
          <div>
            <p class="text-xs text-gray-500 uppercase font-semibold mb-1">Check-out</p>
            <input type="date" id="edit-checkout-${booking.id}" value="${booking.checkout_date}" class="w-full bg-white border border-gray-200 rounded p-1 font-bold text-gray-800">
          </div>
          <div>
            <p class="text-xs text-gray-500 uppercase font-semibold mb-1">Total Guests</p>
            <p class="font-bold text-gray-800 flex items-center gap-1"><i class='bx bx-user'></i> ${booking.total_guests || booking.guests}</p>
          </div>
          ${this.role !== 'guest_manager' ? `
          <div>
            <p class="text-xs text-gray-500 uppercase font-semibold mb-1">Booked On</p>
            <p class="font-bold text-gray-800">${UI.formatDate(booking.created_at)}</p>
          </div>
          ` : ''}
        </div>

        <!-- Action Buttons -->
        <div class="border-t border-gray-100 pt-6 flex gap-3 flex-wrap">
          <button onclick="Bookings.updateDates(${booking.id})" class="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 py-3 rounded-xl font-bold transition-colors shadow-sm min-w-[140px]">Update Dates</button>
          
          ${(this.role === 'admin' || this.role === 'reservation_manager') && booking.status !== 'confirmed' ? 
            `<button onclick="Bookings.updateStatus(${booking.id}, 'confirmed')" class="flex-1 bg-accent hover:bg-primary text-white py-3 rounded-xl font-bold transition-colors shadow-sm min-w-[140px]">Confirm</button>` : ''
          }
          ${(this.role === 'admin' || this.role === 'reservation_manager') && booking.status !== 'cancelled' ? 
            `<button onclick="Bookings.updateStatus(${booking.id}, 'cancelled')" class="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-3 rounded-xl font-bold transition-colors shadow-sm min-w-[140px]">Cancel</button>` : ''
          }
          ${(this.role === 'admin' || this.role === 'guest_manager') && booking.status !== 'checked-in' ? 
            `<button onclick="Bookings.updateStatus(${booking.id}, 'checked-in')" class="flex-1 bg-green-100 hover:bg-green-200 text-green-700 py-3 rounded-xl font-bold transition-colors shadow-sm min-w-[140px]">Check In</button>` : ''
          }
          ${(this.role === 'admin' || this.role === 'guest_manager') && booking.status !== 'checked-out' ? 
            `<button onclick="Bookings.updateStatus(${booking.id}, 'checked-out')" class="flex-1 bg-orange-100 hover:bg-orange-200 text-orange-700 py-3 rounded-xl font-bold transition-colors shadow-sm min-w-[140px]">Check Out</button>` : ''
          }
        </div>
      </div>
    `;

    UI.showModal(modalHTML);
  },

  async updateStatus(id, newStatus) {
    if (this.role === 'guest_manager' && !['checked-in', 'checked-out'].includes(newStatus)) {
      UI.showToast('You only have permission to Check-in and Check-out', 'error');
      return;
    }
    try {
      await API.updateBookingStatus(id, newStatus, this.role);
      UI.showToast(`Booking marked as ${newStatus}`);
      UI.closeModal();
      await this.loadData();
    } catch (e) {
      UI.showToast('Failed to update status', 'error');
    }
  },

  async updateDates(id) {
    const checkin = document.getElementById(`edit-checkin-${id}`).value;
    const checkout = document.getElementById(`edit-checkout-${id}`).value;
    try {
      await API.updateBookingDates(id, checkin, checkout, this.role);
      UI.showToast(`Booking dates updated successfully`);
      UI.closeModal();
      await this.loadData();
    } catch (e) {
      UI.showToast('Failed to update dates', 'error');
    }
  },

  deleteBooking(id) {
    const modalHTML = `
      <div class="p-8 text-center">
        <div class="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
          <i class='bx bx-trash text-3xl'></i>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">Delete Booking?</h3>
        <p class="text-gray-500 mb-6">Are you sure you want to delete booking #${id}? This action cannot be undone.</p>
        
        <div class="mb-8">
          <label class="block text-sm font-semibold text-gray-700 mb-2 text-left">Enter 4-Digit Admin PIN</label>
          <input type="password" id="delete-pin" placeholder="****" maxlength="4" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-center tracking-widest focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-2xl">
        </div>

        <div class="flex gap-3">
          <button onclick="UI.closeModal()" class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-bold transition-colors">Cancel</button>
          <button onclick="Bookings.confirmDelete(${id})" class="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold transition-colors shadow-md">Yes, Delete</button>
        </div>
      </div>
    `;
    UI.showModal(modalHTML);
  },

  async confirmDelete(id) {
    const pinInput = document.getElementById('delete-pin');
    if (!pinInput || pinInput.value !== '1234') {
      UI.showToast('Incorrect 4-digit password. Deletion cancelled.', 'error');
      pinInput.value = '';
      pinInput.focus();
      return;
    }

    try {
      await API.deleteBooking(id);
      UI.showToast('Booking deleted successfully');
      UI.closeModal();
      await this.loadData();
    } catch (e) {
      UI.showToast('Failed to delete booking', 'error');
    }
  },

  exportCSV() {
    if (this.data.length === 0) {
      UI.showToast('No data to export', 'info');
      return;
    }

    const headers = ['ID', 'Guest Name', 'Mobile', 'Check-in', 'Check-out', 'Guests', 'Status', 'Created At'];
    
    const rows = this.filteredData.map(b => [
      b.id,
      `"${b.guest_name}"`, // Quote strings to prevent comma issues
      `"${b.mobile}"`,
      b.checkin_date,
      b.checkout_date,
      b.guests,
      b.status,
      b.created_at
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `bookings_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    UI.showToast('Export downloaded successfully');
  }
};
