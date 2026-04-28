import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function BookingDetailScreen({ route, navigation }) {
  const { booking, role } = route.params;

  const isGuestManager = role === "guest_manager";

  const handleStatusUpdate = (status) => {
    Alert.alert("Update Status", `Mark booking as ${status}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Confirm",
        onPress: () => {
          // Add actual API call here
          Alert.alert("Success", "Status updated (Mock)");
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {booking.guest_name.charAt(0)}
            </Text>
          </View>
          <Text style={styles.guestName}>{booking.guest_name}</Text>
          <Text style={styles.bookingId}>Booking #{booking.id}</Text>
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Reservation Details</Text>

          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={20} color="#64748b" />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Dates</Text>
              <Text style={styles.detailValue}>
                {booking.checkin_date} to {booking.checkout_date}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="people-outline" size={20} color="#64748b" />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Guests & Room</Text>
              <Text style={styles.detailValue}>
                {booking.total_guests} Guests • {booking.category}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="call-outline" size={20} color="#64748b" />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Contact</Text>
              <Text style={styles.detailValue}>{booking.mobile}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#64748b"
            />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Current Status</Text>
              <Text
                style={[
                  styles.detailValue,
                  { textTransform: "capitalize" },
                ]}
              >
                {booking.status}
              </Text>
            </View>
          </View>
        </View>

        {!isGuestManager ? (
          <View style={styles.actionsContainer}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>

            <TouchableOpacity
              style={[styles.actionButton, styles.confirmButton]}
              onPress={() => handleStatusUpdate("confirmed")}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="#fff"
                style={styles.btnIcon}
              />
              <Text style={styles.actionText}>Confirm Booking</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => handleStatusUpdate("cancelled")}
            >
              <Ionicons
                name="close-circle-outline"
                size={20}
                color="#ef4444"
                style={styles.btnIcon}
              />
              <Text style={[styles.actionText, { color: "#ef4444" }]}>
                Cancel Booking
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.actionsContainer}>
            <Text style={styles.sectionTitle}>Guest Management</Text>

            <TouchableOpacity
              style={[styles.actionButton, styles.updateButton]}
              onPress={() => handleStatusUpdate("updated")}
            >
              <Ionicons
                name="create-outline"
                size={20}
                color="#fff"
                style={styles.btnIcon}
              />
              <Text style={styles.actionText}>Update Details</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.checkinButton]}
              onPress={() => handleStatusUpdate("checked-in")}
            >
              <Ionicons
                name="log-in-outline"
                size={20}
                color="#fff"
                style={styles.btnIcon}
              />
              <Text style={styles.actionText}>Check-In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.checkoutButton]}
              onPress={() => handleStatusUpdate("checked-out")}
            >
              <Ionicons
                name="log-out-outline"
                size={20}
                color="#fff"
                style={styles.btnIcon}
              />
              <Text style={styles.actionText}>Check-Out</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    padding: 16,
  },
  headerCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#e0f2fe",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0284c7",
  },
  guestName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  bookingId: {
    fontSize: 14,
    color: "#64748b",
  },
  detailsCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  detailTextContainer: {
    marginLeft: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1e293b",
  },
  actionsContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  btnIcon: {
    marginRight: 8,
  },
  confirmButton: {
    backgroundColor: "#0f3d2e",
  },
  updateButton: {
    backgroundColor: "#0ea5e9",
  },
  checkinButton: {
    backgroundColor: "#16a34a",
  },
  checkoutButton: {
    backgroundColor: "#ea580c",
  },
  actionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fee2e2",
  },
});
