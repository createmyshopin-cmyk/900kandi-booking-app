/**
 * Utility functions for the booking app
 */

import ENV from "../config/env";

/**
 * Format date to readable format
 * @param {string} dateString - Date string (YYYY-MM-DD)
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  if (!dateString) return "";

  const options = { year: "numeric", month: "short", day: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", options);
};

/**
 * Get status color based on booking status
 * @param {string} status - Booking status
 * @returns {string} Color code
 */
export const getStatusColor = (status) => {
  const colors = {
    [ENV.BOOKING_STATUS.CONFIRMED]: "#22c55e",
    [ENV.BOOKING_STATUS.PENDING]: "#eab308",
    [ENV.BOOKING_STATUS.CANCELLED]: "#ef4444",
  };
  return colors[status] || "#94a3b8";
};

/**
 * Get status background color
 * @param {string} status - Booking status
 * @returns {string} Color code with opacity
 */
export const getStatusBgColor = (status) => {
  return getStatusColor(status) + "20";
};

/**
 * Check if user has permission to view sensitive data
 * @param {string} userRole - User role
 * @returns {boolean} True if can view mobile number
 */
export const canViewMobileNumber = (userRole) => {
  return (
    userRole === ENV.ROLES.ADMIN || userRole === ENV.ROLES.RESERVATION_MANAGER
  );
};

/**
 * Check if user can modify bookings
 * @param {string} userRole - User role
 * @returns {boolean} True if can modify
 */
export const canModifyBookings = (userRole) => {
  return (
    userRole === ENV.ROLES.ADMIN ||
    userRole === ENV.ROLES.RESERVATION_MANAGER ||
    userRole === ENV.ROLES.GUEST_MANAGER
  );
};

/**
 * Check if user can delete bookings
 * @param {string} userRole - User role
 * @returns {boolean} True if can delete
 */
export const canDeleteBookings = (userRole) => {
  return userRole === ENV.ROLES.ADMIN;
};

/**
 * Get role display name
 * @param {string} role - User role
 * @returns {string} Display name
 */
export const getRoleDisplayName = (role) => {
  const names = {
    [ENV.ROLES.ADMIN]: "Administrator",
    [ENV.ROLES.RESERVATION_MANAGER]: "Reservation Manager",
    [ENV.ROLES.GUEST_MANAGER]: "Guest Manager",
  };
  return names[role] || role;
};

/**
 * Calculate number of nights between dates
 * @param {string} checkinDate - Check-in date (YYYY-MM-DD)
 * @param {string} checkoutDate - Check-out date (YYYY-MM-DD)
 * @returns {number} Number of nights
 */
export const calculateNights = (checkinDate, checkoutDate) => {
  if (!checkinDate || !checkoutDate) return 0;

  const checkin = new Date(checkinDate);
  const checkout = new Date(checkoutDate);
  const diffTime = Math.abs(checkout - checkin);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} True if valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (basic)
 * @param {string} phone - Phone number
 * @returns {boolean} True if valid
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[0-9\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
};

/**
 * Format phone number
 * @param {string} phone - Phone number
 * @returns {string} Formatted phone number
 */
export const formatPhone = (phone) => {
  if (!phone) return "";

  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, "");

  // Format as (XXX) XXX-XXXX
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  return phone;
};

/**
 * Get booking status badge text
 * @param {string} status - Booking status
 * @returns {string} Badge text
 */
export const getStatusBadgeText = (status) => {
  const text = {
    [ENV.BOOKING_STATUS.CONFIRMED]: "Confirmed",
    [ENV.BOOKING_STATUS.PENDING]: "Pending",
    [ENV.BOOKING_STATUS.CANCELLED]: "Cancelled",
  };
  return text[status] || status;
};

/**
 * Check if date is in the past
 * @param {string} dateString - Date string (YYYY-MM-DD)
 * @returns {boolean} True if date is past
 */
export const isDateInPast = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  return date < today;
};

/**
 * Log message (respects ENABLE_LOGGING flag)
 * @param {string} message - Log message
 * @param {any} data - Optional data to log
 */
export const log = (message, data = null) => {
  if (ENV.FEATURES.ENABLE_LOGGING) {
    if (data) {
      console.log(`[LuxeStay] ${message}`, data);
    } else {
      console.log(`[LuxeStay] ${message}`);
    }
  }
};
