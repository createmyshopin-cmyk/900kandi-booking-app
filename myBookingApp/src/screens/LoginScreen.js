import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { loginApi } from '../services/api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      // Try real API first
      try {
        const response = await loginApi(email, password);
        await AsyncStorage.setItem('userToken', response.token);
        await AsyncStorage.setItem('userRole', response.user.role);
        navigation.replace('Dashboard');
      } catch (apiError) {
        // Fallback to mock auth for development
        console.log('API error, using mock auth:', apiError);
        
        let assignedRole = 'admin'; // default
        const lowerEmail = email.toLowerCase();

        if (lowerEmail === 'admin@test.com') {
          assignedRole = 'admin';
        } else if (lowerEmail === 'reservation@test.com') {
          assignedRole = 'reservation_manager';
        } else if (lowerEmail === 'guest@test.com') {
          assignedRole = 'guest_manager';
        }

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        await AsyncStorage.setItem('userToken', 'dummy-auth-token-' + Date.now());
        await AsyncStorage.setItem('userRole', assignedRole);

        navigation.replace('Dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', 'Invalid credentials or network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        {/* Logo/Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>LuxeStay</Text>
          <Text style={styles.subtitle}>Admin Booking Manager</Text>
        </View>

        {/* Email Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="admin@example.com"
            placeholderTextColor="#cbd5e1"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Enter your password"
              placeholderTextColor="#cbd5e1"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              editable={!loading}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              <Text style={styles.togglePassword}>
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        {/* Test Accounts Info */}
        <View style={styles.hintBox}>
          <Text style={styles.hintTitle}>📝 Test Accounts:</Text>
          <View style={styles.hintItem}>
            <Text style={styles.hintLabel}>Admin:</Text>
            <Text style={styles.hintText}>admin@test.com</Text>
          </View>
          <View style={styles.hintItem}>
            <Text style={styles.hintLabel}>Manager:</Text>
            <Text style={styles.hintText}>reservation@test.com</Text>
          </View>
          <View style={styles.hintItem}>
            <Text style={styles.hintLabel}>Guest Mgr:</Text>
            <Text style={styles.hintText}>guest@test.com</Text>
          </View>
          <Text style={styles.hintNote}>Password can be anything (mock mode)</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  formContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0f3d2e',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1e293b',
    backgroundColor: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingRight: 12,
  },
  passwordInput: {
    borderWidth: 0,
    flex: 1,
  },
  togglePassword: {
    fontSize: 18,
  },
  button: {
    backgroundColor: '#0f3d2e',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#0f3d2e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  hintBox: {
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 16,
    marginTop: 32,
    borderLeftWidth: 4,
    borderLeftColor: '#22c55e',
  },
  hintTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#166534',
    marginBottom: 12,
  },
  hintItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  hintLabel: {
    fontSize: 12,
    color: '#166534',
    fontWeight: '600',
    minWidth: 70,
  },
  hintText: {
    fontSize: 12,
    color: '#166534',
    fontWeight: '500',
    marginLeft: 8,
  },
  hintNote: {
    fontSize: 11,
    color: '#16a34a',
    fontStyle: 'italic',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#dcfce7',
  },
});
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0f3d2e',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#f1f5f9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#1e293b',
  },
  button: {
    backgroundColor: '#0f3d2e',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  hintBox: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  hintTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#475569',
    marginBottom: 8,
  },
  hintText: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 4,
  }
});
