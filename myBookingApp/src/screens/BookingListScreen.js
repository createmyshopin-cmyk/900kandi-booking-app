import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  RefreshControl,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getBookings } from '../services/api';
import BookingCard from '../components/BookingCard';

export default function BookingListScreen({ navigation }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('admin');
  const [error, setError] = useState(null);

  // Fetch bookings from API or use mock data
  const fetchBookings = useCallback(async (showRefreshControl = false) => {
    try {
      if (showRefreshControl) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Get user role from storage
      const userRole = await AsyncStorage.getItem('userRole');
      setRole(userRole || 'admin');

      // Try to fetch from API
      try {
        const data = await getBookings(userRole);
        setBookings(Array.isArray(data) ? data : data.data || []);
      } catch (apiError) {
        // Fallback to mock data for development
        console.log('Using mock data:', apiError?.message);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Mock booking data
        setBookings([
          {
            id: 101,
            guest_name: 'John Doe',
            mobile: '9876543210',
            category: 'Premium Suite',
            total_guests: 2,
            checkin_date: '2026-05-10',
            checkout_date: '2026-05-15',
            status: 'confirmed',
            created_at: '2026-04-20',
          },
          {
            id: 102,
            guest_name: 'Jane Smith',
            mobile: '9123456780',
            category: 'Standard Room',
            total_guests: 4,
            checkin_date: '2026-05-12',
            checkout_date: '2026-05-14',
            status: 'pending',
            created_at: '2026-04-21',
          },
          {
            id: 103,
            guest_name: 'Alice Johnson',
            mobile: '9988776655',
            category: 'Villa',
            total_guests: 6,
            checkin_date: '2026-05-15',
            checkout_date: '2026-05-20',
            status: 'cancelled',
            created_at: '2026-04-22',
          },
          {
            id: 104,
            guest_name: 'Michael Brown',
            mobile: '9871122334',
            category: 'Standard Room',
            total_guests: 1,
            checkin_date: '2026-05-18',
            checkout_date: '2026-05-19',
            status: 'confirmed',
            created_at: '2026-04-23',
          },
          {
            id: 105,
            guest_name: 'Emma Davis',
            mobile: '9001122334',
            category: 'Premium Suite',
            total_guests: 2,
            checkin_date: '2026-05-22',
            checkout_date: '2026-05-25',
            status: 'pending',
            created_at: '2026-04-24',
          },
        ]);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load bookings. Please try again.');
      Alert.alert('Error', 'Failed to load bookings. Please pull down to retry.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Handle pull-to-refresh
  const onRefresh = useCallback(() => {
    fetchBookings(true);
  }, [fetchBookings]);

  // Filter bookings based on search
  const filteredBookings = bookings.filter(booking =>
    booking.guest_name.toLowerCase().includes(search.toLowerCase()) ||
    booking.id.toString().includes(search)
  );

  // Render booking card
  const renderBookingItem = ({ item }) => (
    <BookingCard
      booking={item}
      role={role}
      onPress={() => navigation.navigate('BookingDetail', { booking: item, role })}
    />
  );

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="calendar-outline" size={64} color="#cbd5e1" />
      <Text style={styles.emptyTitle}>No bookings found</Text>
      <Text style={styles.emptyText}>
        {search ? 'Try adjusting your search' : 'Pull down to refresh'}
      </Text>
    </View>
  );

  // Render loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0f3d2e" />
          <Text style={styles.loadingText}>Loading bookings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Bookings</Text>
          <Text style={styles.headerSubtitle}>
            {role.replace(/_/g, ' ').toUpperCase()}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="settings-outline" size={24} color="#0f3d2e" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#94a3b8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or booking ID..."
          placeholderTextColor="#cbd5e1"
          value={search}
          onChangeText={setSearch}
        />
        {search ? (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color="#94a3b8" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Bookings List */}
      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => fetchBookings()}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredBookings}
          keyExtractor={item => item.id.toString()}
          renderItem={renderBookingItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#0f3d2e']}
              tintColor="#0f3d2e"
            />
          }
          ListEmptyComponent={renderEmptyState}
          scrollEnabled={true}
        />
      )}

      {/* Results Count */}
      {filteredBookings.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Showing {filteredBookings.length} of {bookings.length} bookings
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    fontWeight: '500',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1e293b',
  },
  listContent: {
    paddingVertical: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    marginTop: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#0f3d2e',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  footerText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    fontWeight: '500',
  },
});
          <ActivityIndicator size="large" color="#0f3d2e" />
        </View>
      ) : (
        <FlatList
          data={filteredBookings}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={styles.emptyText}>No bookings found</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1e293b',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  guestName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 6,
  },
  dateText: {
    color: '#64748b',
    fontSize: 14,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 16,
  }
});
