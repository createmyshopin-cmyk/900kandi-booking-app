/**
 * Mock API for Travelvoo Admin Dashboard
 * This will be replaced with real CodeIgniter fetch calls later.
 */

const API_BASE = "http://localhost:8080/admin";

// Initialize mock data in localStorage if it doesn't exist
const initMockData = () => {
  if (!localStorage.getItem('luxestay_bookings')) {
    const MOCK_DATA = [
      { id: 101, guest_name: "John Doe", mobile: "9876543210", checkin_date: "2026-05-01", checkout_date: "2026-05-03", guests: 2, status: "pending", created_at: "2026-04-25T10:30:00Z" },
      { id: 102, guest_name: "Alice Smith", mobile: "9123456789", checkin_date: "2026-05-02", checkout_date: "2026-05-05", guests: 4, status: "confirmed", created_at: "2026-04-26T14:15:00Z" },
      { id: 103, guest_name: "Bob Johnson", mobile: "9988776655", checkin_date: "2026-04-28", checkout_date: "2026-04-30", guests: 1, status: "cancelled", created_at: "2026-04-27T09:00:00Z" },
      { id: 104, guest_name: "Emma Davis", mobile: "9871234560", checkin_date: "2026-05-10", checkout_date: "2026-05-12", guests: 2, status: "pending", created_at: "2026-04-27T16:45:00Z" },
      { id: 105, guest_name: "Michael Wilson", mobile: "9001122334", checkin_date: "2026-04-28", checkout_date: "2026-04-29", guests: 3, status: "confirmed", created_at: "2026-04-28T08:20:00Z" },
    ];
    localStorage.setItem('luxestay_bookings', JSON.stringify(MOCK_DATA));
  }
};
initMockData();

const getDb = () => JSON.parse(localStorage.getItem('luxestay_bookings')) || [];
const saveDb = (data) => localStorage.setItem('luxestay_bookings', JSON.stringify(data));

const API = {
  getRole() {
    return localStorage.getItem('role') || 'admin';
  },

  async getBookings(searchQuery = '') {
    const role = this.getRole();
    const res = await fetch(`${API_BASE}/bookings?role=${role}&search=${encodeURIComponent(searchQuery)}`);
    if (!res.ok) throw new Error('Failed to fetch bookings');
    return res.json();
  },

  async getBooking(id) {
    const res = await fetch(`${API_BASE}/bookings/${id}`);
    if (!res.ok) throw new Error('Booking not found');
    return res.json();
  },

  async updateBookingStatus(id, status, roleParam = null) {
    const role = roleParam || this.getRole();
    const res = await fetch(`${API_BASE}/bookings/update-status/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, role })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.messages?.error || 'Failed to update status');
    }
    return res.json();
  },

  async updateBookingDates(id, checkin_date, checkout_date, roleParam = null) {
    const role = roleParam || this.getRole();
    const res = await fetch(`${API_BASE}/bookings/update-dates/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ checkin_date, checkout_date, role })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.messages?.error || 'Failed to update dates');
    }
    return res.json();
  },

  async deleteBooking(id) {
    const role = this.getRole();
    const res = await fetch(`${API_BASE}/bookings/delete/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    if (!res.ok) throw new Error('Failed to delete booking');
    return res.json();
  },

  async getStats() {
    // For now we'll fetch all bookings and calc stats locally
    // In production, create a dedicated /stats endpoint in CI4
    const bookings = await this.getBookings();
    const today = new Date().toISOString().split('T')[0];
    return {
      totalBookings: bookings.length,
      todayBookings: bookings.filter(b => (b.created_at || '').startsWith(today)).length,
      upcomingCheckins: bookings.filter(b => b.checkin_date >= today && b.status !== 'cancelled').length,
      totalGuests: bookings.filter(b => b.status !== 'cancelled').reduce((sum, b) => sum + parseInt(b.total_guests || b.guests || 0), 0)
    };
  },

  async getGuestCheckins(searchQuery = '') {
    const role = this.getRole();
    const res = await fetch(`${API_BASE}/bookings/guest-checkins?role=${role}&search=${encodeURIComponent(searchQuery)}`);
    if (!res.ok) throw new Error('Failed to fetch guest check-ins');
    return res.json();
  }
};
