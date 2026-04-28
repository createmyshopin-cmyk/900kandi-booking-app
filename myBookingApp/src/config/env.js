/**
 * Environment configuration
 * Change BASE_URL to your CodeIgniter API endpoint
 */

const ENV = {
  // API Configuration
  API_BASE_URL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080",

  // App Configuration
  APP_NAME: "LuxeStay Admin",
  APP_VERSION: "1.0.0",

  // Roles
  ROLES: {
    ADMIN: "admin",
    RESERVATION_MANAGER: "reservation_manager",
    GUEST_MANAGER: "guest_manager",
  },

  // Status values
  BOOKING_STATUS: {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    CANCELLED: "cancelled",
  },

  // Feature flags
  FEATURES: {
    MOCK_API: true, // Set to false when backend is ready
    ENABLE_LOGGING: true,
  },

  // AsyncStorage keys
  STORAGE_KEYS: {
    USER_TOKEN: "userToken",
    USER_ROLE: "userRole",
    USER_DATA: "userData",
  },
};

export default ENV;
