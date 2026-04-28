import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  getStatusColor,
  getStatusBgColor,
  canViewMobileNumber,
  getStatusBadgeText,
} from "../utils/helpers";

export default function BookingCard({ booking, role, onPress }) {
  // Determine what data to show based on role
  const showMobileNumber = canViewMobileNumber(role);
  const showStatus = role === "admin" || role === "reservation_manager" || role === "guest_manager";

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <Text style={styles.guestName}>{booking.guest_name}</Text>
        {showStatus && (
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusBgColor(booking.status) },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(booking.status) },
              ]}
            >
              {getStatusBadgeText(booking.status)}
            </Text>
          </View>
        )}
      </View>

      {/* Booking ID and Category */}
      <View style={styles.cardBody}>
        <Ionicons name="ticket-outline" size={16} color="#64748b" />
        <Text style={styles.infoText}>
          Booking ID: {booking.id} • {booking.category}
        </Text>
      </View>

      {/* Check-in/Check-out Dates */}
      <View style={styles.cardBody}>
        <Ionicons name="calendar-outline" size={16} color="#64748b" />
        <Text style={styles.infoText}>
          {booking.checkin_date} → {booking.checkout_date}
        </Text>
      </View>

      {/* Guests Count */}
      <View style={styles.cardBody}>
        <Ionicons name="people-outline" size={16} color="#64748b" />
        <Text style={styles.infoText}>
          {booking.total_guests} Guest{booking.total_guests !== 1 ? "s" : ""}
        </Text>
      </View>

      {/* Mobile Number - Only for admin and reservation_manager */}
      {showMobileNumber && (
        <View style={styles.cardBody}>
          <Ionicons name="call-outline" size={16} color="#64748b" />
          <Text style={styles.infoText}>{booking.mobile}</Text>
        </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#0f3d2e",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  guestName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  cardBody: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: "#475569",
    marginLeft: 10,
    flex: 1,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  tapText: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "500",
  },
});
