const GuestCheckins = {
  data: [],
  filteredData: [],
  role: localStorage.getItem('role') || 'admin',

  async init() {
    if (this.role === 'guest_manager') {
      const content = document.getElementById('app-content');
      content.innerHTML = `
        <div class="h-full flex flex-col items-center justify-center text-center p-6">
          <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-6">
            <i class='bx bx-lock-alt text-4xl'></i>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p class="text-gray-500 max-w-md">Your current role (Guest Manager) does not have permission to view sensitive guest check-in data.</p>
        </div>
      `;
      return;
    }
    
    this.renderLayout();
    this.bindEvents();
    await this.loadData();
  },

  renderLayout() {
    const content = document.getElementById('app-content');
    content.innerHTML = `
      <div class="max-w-7xl mx-auto space-y-6">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Guest Check-ins</h2>
            <p class="text-gray-500 text-sm mt-1">Manage public guest check-in submissions</p>
          </div>
          
          <div class="flex w-full md:w-auto gap-3">
            <div class="relative flex-1 md:w-64">
              <i class='bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'></i>
              <input type="text" id="checkins-search" placeholder="Search guests..." class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm">
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left" id="checkins-table">
              <thead class="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                <tr>
                  <th class="p-4 font-semibold text-gray-600 text-left w-20">ID</th>
                  <th class="p-4 font-semibold text-gray-600 text-left">Guest Name</th>
                  <th class="p-4 font-semibold text-gray-600 text-left">Phone</th>
                  <th class="p-4 font-semibold text-gray-600 text-left hidden md:table-cell">Location</th>
                  <th class="p-4 font-semibold text-gray-600 text-left hidden lg:table-cell">Profession</th>
                  <th class="p-4 font-semibold text-gray-600 text-left">Checked In On</th>
                  <th class="p-4 font-semibold text-gray-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody id="checkins-table-body" class="divide-y divide-gray-100">
                <!-- Rows injected here -->
              </tbody>
            </table>
          </div>
          
          <div id="checkins-loading" class="p-12 flex justify-center hidden">
            <i class='bx bx-loader-alt animate-spin text-3xl text-gray-400'></i>
          </div>

          <div id="checkins-empty" class="p-12 flex-col items-center justify-center text-center hidden">
            <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4">
              <i class='bx bx-user-x text-3xl'></i>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-1">No check-ins found</h3>
            <p class="text-gray-500 text-sm">There are no guest check-ins matching your criteria.</p>
          </div>
        </div>
      </div>
    `;
  },

  bindEvents() {
    const searchInput = document.getElementById('checkins-search');
    if (searchInput) {
      let timeout = null;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          this.handleFilter(e.target.value);
        }, 500); // 500ms debounce
      });
    }
  },

  async loadData(searchQuery = '') {
    this.showLoading(true);
    try {
      this.data = await API.getGuestCheckins(searchQuery);
      this.filteredData = [...this.data];
      this.renderTable();
    } catch (e) {
      UI.showToast('Failed to load guest check-ins', 'error');
    } finally {
      this.showLoading(false);
    }
  },

  showLoading(show) {
    const loading = document.getElementById('checkins-loading');
    const tableContainer = document.querySelector('#checkins-table').parentElement;
    const emptyState = document.getElementById('checkins-empty');
    
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

  handleFilter(searchQuery = '') {
    // Trigger API fetch for server-side search
    this.loadData(searchQuery);
  },

  renderTable() {
    const tbody = document.getElementById('checkins-table-body');
    const emptyState = document.getElementById('checkins-empty');
    const tableContainer = document.querySelector('#checkins-table').parentElement;
    
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

    tbody.innerHTML = this.filteredData.map(b => `
      <tr class="hover:bg-gray-50 transition-colors group">
        <td class="p-4 font-mono text-xs text-gray-500">#${b.id}</td>
        <td class="p-4">
          <p class="font-bold text-gray-900">${b.name}</p>
          ${b.booking_id ? `<span class="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-full border border-blue-200">Booking #${b.booking_id}</span>` : ''}
        </td>
        <td class="p-4 text-gray-600">${b.phone}</td>
        <td class="p-4 text-gray-600 hidden md:table-cell">${b.location || '-'}</td>
        <td class="p-4 text-gray-600 hidden lg:table-cell">${b.profession || '-'}</td>
        <td class="p-4 text-gray-500 text-xs">${UI.formatDate(b.created_at)}</td>
        <td class="p-4 text-right space-x-2">
          <button onclick="GuestCheckins.viewDetails(${b.id})" class="text-accent hover:text-primary transition-colors p-2 rounded-lg hover:bg-green-50" title="View Details">
            <i class='bx bx-show text-xl'></i>
          </button>
        </td>
      </tr>
    `).join('');
  },

  viewDetails(id) {
    const checkin = this.data.find(b => b.id === id);
    if (!checkin) return;

    const modalHTML = `
      <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
        <h2 class="text-xl font-bold text-gray-800">Check-in Details</h2>
        <button onclick="UI.closeModal()" class="text-gray-400 hover:text-gray-800 transition-colors">
          <i class='bx bx-x text-2xl'></i>
        </button>
      </div>
      
      <div class="p-6 space-y-6">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-2xl font-black text-gray-900">${checkin.name}</h3>
            <p class="text-gray-500 flex items-center gap-1 mt-1"><i class='bx bx-phone'></i> ${checkin.phone}</p>
          </div>
          ${checkin.booking_id ? `<span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-bold rounded-full border border-blue-200">Linked to Booking #${checkin.booking_id}</span>` : ''}
        </div>

        <div class="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
          <div>
            <p class="text-xs text-gray-500 uppercase font-semibold mb-1">Location</p>
            <p class="font-bold text-gray-800">${checkin.location || 'Not provided'}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 uppercase font-semibold mb-1">Profession</p>
            <p class="font-bold text-gray-800">${checkin.profession || 'Not provided'}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 uppercase font-semibold mb-1">Instagram</p>
            ${checkin.instagram ? `<a href="https://instagram.com/${checkin.instagram.replace('@', '')}" target="_blank" class="font-bold text-primary hover:underline flex items-center gap-1"><i class='bx bxl-instagram'></i> ${checkin.instagram}</a>` : '<p class="font-bold text-gray-800">Not provided</p>'}
          </div>
          <div>
            <p class="text-xs text-gray-500 uppercase font-semibold mb-1">Checked In On</p>
            <p class="font-bold text-gray-800">${UI.formatDate(checkin.created_at)}</p>
          </div>
        </div>
      </div>
    `;

    UI.showModal(modalHTML);
  }
};
