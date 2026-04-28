const Stays = {
  staysData: [],
  blockedDates: [],
  allBookings: [],
  currentDate: new Date(),

  async init() {
    await this.loadData();
    this.renderStays();
    this.renderBlockedDates();
    this.renderCalendar();
  },

  async loadData() {
    this.staysData = await API.getStays();
    this.blockedDates = await API.getBlockedDates();
    this.allBookings = await API.getBookings();
  },

  renderStays() {
    const grid = document.getElementById('stays-grid');
    if (!grid) return;

    if (this.staysData.length === 0) {
      grid.innerHTML = `<div class="col-span-full text-center p-8 text-gray-500 bg-white rounded-2xl border border-gray-100">No stays configured yet.</div>`;
      return;
    }

    grid.innerHTML = this.staysData.map(stay => `
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
        <div class="h-40 bg-gray-100 relative">
          <img src="https://images.unsplash.com/photo-1587061949409-02df41d5e562?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" class="w-full h-full object-cover" alt="Stay Image">
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div class="absolute bottom-3 left-4 text-white">
            <h3 class="font-bold text-lg">${stay.name}</h3>
            <p class="text-xs opacity-90">${stay.capacity} Guests Max</p>
          </div>
        </div>
        <div class="p-5 flex-1 flex flex-col">
          <div class="flex justify-between items-center mb-3">
            <span class="px-2.5 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-lg border border-green-200">
              ${stay.available_slots} Slots Available
            </span>
            <span class="font-bold text-gray-900">₹${stay.price}/night</span>
          </div>
          <p class="text-sm text-gray-500 mb-4 flex-1 line-clamp-2">${stay.description}</p>
          <div class="flex gap-2 mt-auto">
            <button onclick="Stays.openEditStayModal(${stay.id})" class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-xl font-medium transition-colors text-sm">Edit</button>
            <button onclick="Stays.deleteStay(${stay.id})" class="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-xl font-medium transition-colors text-sm"><i class='bx bx-trash'></i></button>
          </div>
        </div>
      </div>
    `).join('');
  },

  renderBlockedDates() {
    const tbody = document.getElementById('blocked-dates-body');
    if (!tbody) return;

    if (this.blockedDates.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="p-6 text-center text-gray-500 italic">No dates are currently blocked.</td></tr>`;
      return;
    }

    tbody.innerHTML = this.blockedDates.map(block => {
      const stay = this.staysData.find(s => s.id == block.stay_id);
      return `
      <tr class="hover:bg-gray-50">
        <td class="p-4 font-bold text-gray-800">${stay ? stay.name : 'All Stays'}</td>
        <td class="p-4 text-gray-600">${UI.formatDate(block.start_date)}</td>
        <td class="p-4 text-gray-600">${UI.formatDate(block.end_date)}</td>
        <td class="p-4 text-gray-500">${block.reason}</td>
        <td class="p-4 text-right">
          <button onclick="Stays.deleteBlock(${block.id})" class="text-red-400 hover:text-red-600 p-2"><i class='bx bx-trash text-xl'></i></button>
        </td>
      </tr>
    `}).join('');
  },

  changeMonth(offset) {
    this.currentDate.setMonth(this.currentDate.getMonth() + offset);
    this.renderCalendar();
  },

  renderCalendar() {
    const grid = document.getElementById('calendar-grid');
    const monthYear = document.getElementById('calendar-month-year');
    if(!grid) return;

    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    monthYear.textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let html = `
      <div class="bg-gray-50 text-center py-2 font-bold text-xs text-gray-500 uppercase">Sun</div>
      <div class="bg-gray-50 text-center py-2 font-bold text-xs text-gray-500 uppercase">Mon</div>
      <div class="bg-gray-50 text-center py-2 font-bold text-xs text-gray-500 uppercase">Tue</div>
      <div class="bg-gray-50 text-center py-2 font-bold text-xs text-gray-500 uppercase">Wed</div>
      <div class="bg-gray-50 text-center py-2 font-bold text-xs text-gray-500 uppercase">Thu</div>
      <div class="bg-gray-50 text-center py-2 font-bold text-xs text-gray-500 uppercase">Fri</div>
      <div class="bg-gray-50 text-center py-2 font-bold text-xs text-gray-500 uppercase">Sat</div>
    `;

    for (let i = 0; i < firstDay; i++) {
      html += `<div class="bg-gray-50/50 min-h-[100px] p-2"></div>`;
    }

    const todayStr = new Date().toISOString().split('T')[0];

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isToday = dateStr === todayStr;
      const isPast = dateStr < todayStr;

      const dateBookings = this.allBookings.filter(b => b.checkin_date <= dateStr && b.checkout_date > dateStr && b.status !== 'cancelled');
      const dateBlocks = this.blockedDates.filter(b => b.start_date <= dateStr && b.end_date >= dateStr);
      
      let pendingCount = 0;
      let confirmedCount = 0;
      let checkInCount = 0;
      
      let staysInfo = [];

      dateBookings.forEach(b => {
        if(b.status === 'pending') pendingCount++;
        else if(b.status === 'confirmed') confirmedCount++;
        else if(b.status === 'checked-in') checkInCount++;
        staysInfo.push(`<div class="text-[10px] leading-tight truncate ${b.status === 'pending' ? 'text-blue-700 font-medium' : 'text-green-700 font-bold'}">• ${b.category || 'Stay'} (${b.guest_name})</div>`);
      });

      dateBlocks.forEach(b => {
        const sName = b.stay_id === 'all' ? 'All Stays' : (this.staysData.find(s=>s.id == b.stay_id)?.name || 'Stay');
        staysInfo.push(`<div class="text-[10px] leading-tight text-gray-600 truncate font-semibold">× ${sName} (Blocked)</div>`);
      });

      const totalSlots = this.staysData.reduce((sum, s) => sum + parseInt(s.available_slots), 0);
      const usedSlots = dateBookings.length + (dateBlocks.some(b => b.stay_id === 'all') ? totalSlots : dateBlocks.length);

      const isSoldOut = usedSlots >= totalSlots && totalSlots > 0;
      const hasBlocks = dateBlocks.length > 0;

      let bgColor = 'bg-white';
      if (isPast) bgColor = 'bg-gray-100 opacity-60'; // Past dates grayed out
      else if (isSoldOut) bgColor = 'bg-red-50';
      else if (hasBlocks) bgColor = 'bg-gray-50';
      else if (checkInCount > 0 || confirmedCount > 0) bgColor = 'bg-green-50/30';
      else if (pendingCount > 0) bgColor = 'bg-blue-50/30';

      html += `
        <div class="${bgColor} min-h-[100px] p-2 flex flex-col gap-1 border-t border-l border-transparent ${!isPast ? 'hover:border-gray-300 transition-colors cursor-pointer' : 'cursor-not-allowed'} " ${!isPast ? `onclick="Stays.showDateDetails('${dateStr}')"` : ''}>
          <div class="flex justify-between items-start">
            <span class="font-bold text-sm ${isToday ? 'bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center' : 'text-gray-700'}">${day}</span>
            ${isSoldOut && !isPast ? `<span class="text-[9px] font-bold text-red-600 uppercase bg-red-100 px-1 rounded">Sold Out</span>` : ''}
          </div>
          <div class="flex-1 overflow-y-auto custom-scrollbar space-y-1 mt-1 max-h-[80px]">
            ${staysInfo.join('')}
          </div>
        </div>
      `;
    }

    const remainingCells = 42 - (firstDay + daysInMonth);
    for (let i = 0; i < remainingCells; i++) {
      if(firstDay + daysInMonth + i <= 35 && remainingCells > 7) {
        if(i >= remainingCells - 7) break; 
      }
      html += `<div class="bg-gray-50/50 min-h-[100px] p-2"></div>`;
    }

    grid.innerHTML = html;
  },

  showDateDetails(dateStr) {
    const dateBookings = this.allBookings.filter(b => b.checkin_date <= dateStr && b.checkout_date > dateStr && b.status !== 'cancelled');
    const dateBlocks = this.blockedDates.filter(b => b.start_date <= dateStr && b.end_date >= dateStr);
    
    let html = `<div class="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 class="text-xl font-bold">Details for ${UI.formatDate(dateStr)}</h2>
        <button onclick="UI.closeModal()"><i class='bx bx-x text-2xl'></i></button>
      </div>
      <div class="p-6 space-y-6">`;
      
    if(dateBookings.length === 0 && dateBlocks.length === 0) {
       html += `<p class="text-gray-500 text-center py-4 italic">No bookings, enquiries, or blocks for this date.</p>`;
    }

    if(dateBookings.length > 0) {
      html += `<div><h3 class="font-bold text-gray-800 mb-3 border-b pb-2">Bookings / Enquiries</h3><div class="space-y-3">`;
      html += dateBookings.map(b => `
        <div class="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
          <div>
            <p class="font-bold text-gray-900 text-lg">${b.guest_name}</p>
            <p class="text-sm text-gray-500 mt-0.5">${b.category || 'Any Stay'} • <i class='bx bx-user'></i> ${b.total_guests || b.guests} Guests</p>
          </div>
          ${UI.getStatusBadge(b.status)}
        </div>
      `).join('');
      html += `</div></div>`;
    }

    if(dateBlocks.length > 0) {
      html += `<div><h3 class="font-bold text-gray-800 mb-3 border-b pb-2">Blocked Stays</h3><div class="space-y-3">`;
      html += dateBlocks.map(b => {
        const sName = b.stay_id === 'all' ? 'All Stays' : (this.staysData.find(s=>s.id == b.stay_id)?.name || 'Unknown Stay');
        return `
        <div class="flex justify-between items-center bg-red-50 p-4 rounded-xl border border-red-100">
          <div>
            <p class="font-bold text-gray-900">${sName}</p>
            <p class="text-sm text-gray-500 mt-0.5">Reason: ${b.reason}</p>
          </div>
          <span class="px-3 py-1 bg-red-200 text-red-800 text-xs font-bold rounded-full">BLOCKED</span>
        </div>
      `}).join('');
      html += `</div></div>`;
    }

    html += `</div>`;
    UI.showModal(html);
  },

  openAddStayModal() {
    const modalHTML = `
      <div class="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 class="text-xl font-bold">Add New Stay Category</h2>
        <button onclick="UI.closeModal()"><i class='bx bx-x text-2xl'></i></button>
      </div>
      <form onsubmit="Stays.saveStay(event)" class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-semibold mb-1">Name</label>
          <input type="text" id="stay-name" required class="w-full border border-gray-200 rounded-xl p-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none">
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold mb-1">Price (₹)</label>
            <input type="number" id="stay-price" required class="w-full border border-gray-200 rounded-xl p-2.5 focus:border-primary focus:ring-1 outline-none">
          </div>
          <div>
            <label class="block text-sm font-semibold mb-1">Capacity</label>
            <input type="number" id="stay-capacity" required class="w-full border border-gray-200 rounded-xl p-2.5 outline-none focus:border-primary focus:ring-1">
          </div>
        </div>
        <div>
          <label class="block text-sm font-semibold mb-1">Total Slots</label>
          <input type="number" id="stay-slots" required class="w-full border border-gray-200 rounded-xl p-2.5 outline-none focus:border-primary focus:ring-1">
        </div>
        <div>
          <label class="block text-sm font-semibold mb-1">Description</label>
          <textarea id="stay-desc" required class="w-full border border-gray-200 rounded-xl p-2.5 outline-none focus:border-primary focus:ring-1" rows="3"></textarea>
        </div>
        <button type="submit" class="w-full bg-primary hover:bg-accent text-white py-3 rounded-xl font-bold transition-colors shadow-md mt-4">Save Stay</button>
      </form>
    `;
    UI.showModal(modalHTML);
  },

  openEditStayModal(id) {
    const stay = this.staysData.find(s => s.id == id);
    if (!stay) return;
    const modalHTML = `
      <div class="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 class="text-xl font-bold">Edit Stay</h2>
        <button onclick="UI.closeModal()"><i class='bx bx-x text-2xl'></i></button>
      </div>
      <form onsubmit="Stays.updateStay(event, ${id})" class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-semibold mb-1">Name</label>
          <input type="text" id="stay-name" value="${stay.name}" required class="w-full border border-gray-200 rounded-xl p-2.5 focus:border-primary outline-none">
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold mb-1">Price (₹)</label>
            <input type="number" id="stay-price" value="${stay.price}" required class="w-full border border-gray-200 rounded-xl p-2.5 outline-none focus:border-primary">
          </div>
          <div>
            <label class="block text-sm font-semibold mb-1">Capacity</label>
            <input type="number" id="stay-capacity" value="${stay.capacity}" required class="w-full border border-gray-200 rounded-xl p-2.5 outline-none focus:border-primary">
          </div>
        </div>
        <div>
          <label class="block text-sm font-semibold mb-1">Available Slots</label>
          <input type="number" id="stay-slots" value="${stay.available_slots}" required class="w-full border border-gray-200 rounded-xl p-2.5 outline-none focus:border-primary">
        </div>
        <div>
          <label class="block text-sm font-semibold mb-1">Description</label>
          <textarea id="stay-desc" required class="w-full border border-gray-200 rounded-xl p-2.5 outline-none focus:border-primary" rows="3">${stay.description}</textarea>
        </div>
        <button type="submit" class="w-full bg-primary hover:bg-accent text-white py-3 rounded-xl font-bold transition-colors shadow-md mt-4">Update Stay</button>
      </form>
    `;
    UI.showModal(modalHTML);
  },

  openBlockDateModal() {
    const options = this.staysData.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    const modalHTML = `
      <div class="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 class="text-xl font-bold">Block Dates</h2>
        <button onclick="UI.closeModal()"><i class='bx bx-x text-2xl'></i></button>
      </div>
      <form onsubmit="Stays.saveBlockDate(event)" class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-semibold mb-1">Select Stay</label>
          <select id="block-stay" class="w-full border border-gray-200 rounded-xl p-2.5 outline-none focus:border-primary">
            <option value="all">All Stays</option>
            ${options}
          </select>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold mb-1">Start Date</label>
            <input type="date" id="block-start" min="${new Date().toISOString().split('T')[0]}" required class="w-full border border-gray-200 rounded-xl p-2.5 outline-none focus:border-primary">
          </div>
          <div>
            <label class="block text-sm font-semibold mb-1">End Date</label>
            <input type="date" id="block-end" min="${new Date().toISOString().split('T')[0]}" required class="w-full border border-gray-200 rounded-xl p-2.5 outline-none focus:border-primary">
          </div>
        </div>
        <div>
          <label class="block text-sm font-semibold mb-1">Reason (Optional)</label>
          <input type="text" id="block-reason" placeholder="e.g., Maintenance" class="w-full border border-gray-200 rounded-xl p-2.5 outline-none focus:border-primary">
        </div>
        <button type="submit" class="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold transition-colors mt-4">Confirm Block</button>
      </form>
    `;
    UI.showModal(modalHTML);
  },

  async saveStay(e) {
    e.preventDefault();
    const data = {
      id: Date.now(),
      name: document.getElementById('stay-name').value,
      price: document.getElementById('stay-price').value,
      capacity: document.getElementById('stay-capacity').value,
      available_slots: document.getElementById('stay-slots').value,
      description: document.getElementById('stay-desc').value,
    };
    await API.addStay(data);
    UI.closeModal();
    UI.showToast('Stay added successfully');
    this.init();
  },

  async updateStay(e, id) {
    e.preventDefault();
    const data = {
      name: document.getElementById('stay-name').value,
      price: document.getElementById('stay-price').value,
      capacity: document.getElementById('stay-capacity').value,
      available_slots: document.getElementById('stay-slots').value,
      description: document.getElementById('stay-desc').value,
    };
    await API.updateStay(id, data);
    UI.closeModal();
    UI.showToast('Stay updated successfully');
    this.init();
  },

  async deleteStay(id) {
    if(confirm('Are you sure you want to delete this stay?')) {
      await API.deleteStay(id);
      UI.showToast('Stay deleted');
      this.init();
    }
  },

  async saveBlockDate(e) {
    e.preventDefault();
    const data = {
      id: Date.now(),
      stay_id: document.getElementById('block-stay').value,
      start_date: document.getElementById('block-start').value,
      end_date: document.getElementById('block-end').value,
      reason: document.getElementById('block-reason').value || 'Blocked',
    };
    await API.addBlockedDate(data);
    UI.closeModal();
    UI.showToast('Dates blocked successfully');
    this.init();
  },

  async deleteBlock(id) {
    if(confirm('Unblock these dates?')) {
      await API.deleteBlockedDate(id);
      UI.showToast('Dates unblocked');
      this.init();
    }
  }
};
