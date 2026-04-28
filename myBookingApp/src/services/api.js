import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// In production, replace with your actual CodeIgniter API base URL
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
});

// Request interceptor for API calls
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors (e.g., clear storage and logout)
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userRole");
      // Logic to trigger logout navigation would be handled in the UI
    }
    return Promise.reject(error);
  },
);

// Export API methods
export const loginApi = async (email, password) => {
  try {
    const response = await api.post("/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getBookings = async (role = null) => {
  try {
    const params = role ? { role } : {};
    const response = await api.get("/admin/bookings", { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getBookingDetail = async (bookingId) => {
  try {
    const response = await api.get(`/admin/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateBookingStatus = async (bookingId, status) => {
  try {
    const response = await api.put(`/admin/bookings/${bookingId}`, {
      status,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default api;
