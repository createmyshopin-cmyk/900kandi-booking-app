/**
 * Mock API for Travelvoo Admin Dashboard
 * This will be replaced with real CodeIgniter fetch calls later.
 */

const API_BASE = "http://localhost:8080/admin";

// Initialize mock data in localStorage if it doesn't exist
const initMockData = () => {
  if (!localStorage.getItem('luxestay_bookings')) {
    const MOCK_BOOKINGS = [
      { id: 101, guest_name: "John Doe", mobile: "9876543210", checkin_date: "2026-05-01", checkout_date: "2026-05-03", guests: 2, status: "pending", created_at: "2026-04-25T10:30:00Z" },
      { id: 102, guest_name: "Alice Smith", mobile: "9123456789", checkin_date: "2026-05-02", checkout_date: "2026-05-05", guests: 4, status: "confirmed", created_at: "2026-04-26T14:15:00Z" },
      { id: 103, guest_name: "Bob Johnson", mobile: "9988776655", checkin_date: "2026-04-28", checkout_date: "2026-04-30", guests: 1, status: "cancelled", created_at: "2026-04-27T09:00:00Z" },
      { id: 104, guest_name: "Emma Davis", mobile: "9871234560", checkin_date: "2026-05-10", checkout_date: "2026-05-12", guests: 2, status: "pending", created_at: "2026-04-27T16:45:00Z" },
      { id: 105, guest_name: "Michael Wilson", mobile: "9001122334", checkin_date: "2026-04-28", checkout_date: "2026-04-29", guests: 3, status: "confirmed", created_at: "2026-04-28T08:20:00Z" },
    ];
    localStorage.setItem('luxestay_bookings', JSON.stringify(MOCK_BOOKINGS));
  }

  if (!localStorage.getItem('luxestay_guest_checkins')) {
    const MOCK_CHECKINS = [
      { id: 1, booking_id: 101, name: "John Doe", phone: "9876543210", location: "Bangalore", instagram: "@johndoe", profession: "Software Engineer", id_proof: null, created_at: "2026-05-01T10:30:00Z" },
      { id: 2, booking_id: null, name: "Sarah Connor", phone: "9123123123", location: "Mumbai", instagram: "@sarah.c", profession: "Designer", id_proof: null, created_at: "2026-05-02T12:00:00Z" },
    ];
    localStorage.setItem('luxestay_guest_checkins', JSON.stringify(MOCK_CHECKINS));
  }

  if (!localStorage.getItem('luxestay_stays')) {
    const MOCK_STAYS = [
      { id: 1, name: "Premium A Frame", price: 5000, capacity: 4, available_slots: 5, description: "Luxurious A-frame cabin with mountain views." },
      { id: 2, name: "Tent Stay", price: 2000, capacity: 2, available_slots: 10, description: "Comfortable canvas tents with basic amenities." },
    ];
    localStorage.setItem('luxestay_stays', JSON.stringify(MOCK_STAYS));
  }

  if (!localStorage.getItem('luxestay_blocked_dates')) {
    localStorage.setItem('luxestay_blocked_dates', JSON.stringify([]));
  }
};
initMockData();

const getDb = () => JSON.parse(localStorage.getItem('luxestay_bookings')) || [];
const saveDb = (data) => localStorage.setItem('luxestay_bookings', JSON.stringify(data));

const getCheckinsDb = () => JSON.parse(localStorage.getItem('luxestay_guest_checkins')) || [];

const API = {
  getRole() {
    return localStorage.getItem('role') || 'admin';
  },

  async getBookings(searchQuery = '') {
    const role = this.getRole();
    try {
      const res = await fetch(`${API_BASE}/bookings?role=${role}&search=${encodeURIComponent(searchQuery)}`);
      if (!res.ok) throw new Error('Failed to fetch bookings');
      return await res.json();
    } catch (e) {
      console.warn('Falling back to mock bookings data:', e);
      let data = getDb();
      if (searchQuery) {
        data = data.filter(b => b.guest_name.toLowerCase().includes(searchQuery.toLowerCase()));
      }
      return data;
    }
  },

  async getBooking(id) {
    try {
      const res = await fetch(`${API_BASE}/bookings/${id}`);
      if (!res.ok) throw new Error('Booking not found');
      return await res.json();
    } catch (e) {
      console.warn('Falling back to mock data:', e);
      return getDb().find(b => b.id == id);
    }
  },

  async updateBookingStatus(id, status, roleParam = null) {
    const role = roleParam || this.getRole();
    try {
      const res = await fetch(`${API_BASE}/bookings/update-status/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, role })
      });
      if (!res.ok) throw new Error('Failed to update status');
      return await res.json();
    } catch (e) {
      console.warn('Falling back to mock data mutation:', e);
      const data = getDb();
      const index = data.findIndex(b => b.id == id);
      if (index !== -1) {
        data[index].status = status;
        saveDb(data);
      }
      return { success: true };
    }
  },

  async updateBookingDates(id, checkin_date, checkout_date, roleParam = null) {
    const role = roleParam || this.getRole();
    try {
      const res = await fetch(`${API_BASE}/bookings/update-dates/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkin_date, checkout_date, role })
      });
      if (!res.ok) throw new Error('Failed to update dates');
      return await res.json();
    } catch (e) {
      console.warn('Falling back to mock data mutation:', e);
      const data = getDb();
      const index = data.findIndex(b => b.id == id);
      if (index !== -1) {
        data[index].checkin_date = checkin_date;
        data[index].checkout_date = checkout_date;
        saveDb(data);
      }
      return { success: true };
    }
  },

  async deleteBooking(id) {
    const role = this.getRole();
    try {
      const res = await fetch(`${API_BASE}/bookings/delete/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      if (!res.ok) throw new Error('Failed to delete booking');
      return await res.json();
    } catch (e) {
      console.warn('Falling back to mock data mutation:', e);
      const data = getDb();
      const filtered = data.filter(b => b.id != id);
      saveDb(filtered);
      return { success: true };
    }
  },

  async getStats() {
    const bookings = await this.getBookings();
    const today = new Date().toISOString().split('T')[0];
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrow = tomorrowDate.toISOString().split('T')[0];
    
    return {
      totalBookings: bookings.length,
      todayCheckins: bookings.filter(b => b.checkin_date === today && b.status !== 'cancelled').length,
      tomorrowCheckins: bookings.filter(b => b.checkin_date === tomorrow && b.status !== 'cancelled').length,
      totalGuests: bookings.filter(b => b.status !== 'cancelled').reduce((sum, b) => sum + parseInt(b.total_guests || b.guests || 0), 0)
    };
  },

  async getGuestCheckins(searchQuery = '') {
    const role = this.getRole();
    try {
      const res = await fetch(`${API_BASE}/bookings/guest-checkins?role=${role}&search=${encodeURIComponent(searchQuery)}`);
      if (!res.ok) throw new Error('Failed to fetch guest check-ins');
      return await res.json();
    } catch (e) {
      console.warn('Falling back to mock guest checkins data:', e);
      let data = getCheckinsDb();
      if (searchQuery) {
        data = data.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
      }
      return data;
    }
  },

  // Stays API
  async getStays() {
    return JSON.parse(localStorage.getItem('luxestay_stays')) || [];
  },

  async addStay(stay) {
    const stays = await this.getStays();
    stays.push(stay);
    localStorage.setItem('luxestay_stays', JSON.stringify(stays));
  },

  async updateStay(id, data) {
    const stays = await this.getStays();
    const index = stays.findIndex(s => s.id == id);
    if(index > -1) {
      stays[index] = { ...stays[index], ...data };
      localStorage.setItem('luxestay_stays', JSON.stringify(stays));
    }
  },

  async deleteStay(id) {
    let stays = await this.getStays();
    stays = stays.filter(s => s.id != id);
    localStorage.setItem('luxestay_stays', JSON.stringify(stays));
  },

  // Blocked Dates API
  async getBlockedDates() {
    return JSON.parse(localStorage.getItem('luxestay_blocked_dates')) || [];
  },

  async addBlockedDate(data) {
    const blocks = await this.getBlockedDates();
    blocks.push(data);
    localStorage.setItem('luxestay_blocked_dates', JSON.stringify(blocks));
  },

  async deleteBlockedDate(id) {
    let blocks = await this.getBlockedDates();
    blocks = blocks.filter(b => b.id != id);
    localStorage.setItem('luxestay_blocked_dates', JSON.stringify(blocks));
  }
};
