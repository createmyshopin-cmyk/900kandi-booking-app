# Development Guidelines 📋

Best practices and conventions for the LuxeStay Booking Admin App.

## 🎯 Code Style

### Naming Conventions

**Components**: PascalCase

```javascript
// ✅ Correct
export default function BookingCard() {}

// ❌ Wrong
export default function bookingCard() {}
```

**Functions**: camelCase

```javascript
// ✅ Correct
const handleLoginPress = () => {};
const fetchBookings = async () => {};

// ❌ Wrong
const HandleLoginPress = () => {};
const fetch_bookings = async () => {};
```

**Constants**: UPPER_SNAKE_CASE

```javascript
// ✅ Correct
const MAX_RETRIES = 3;
const API_TIMEOUT = 10000;

// ❌ Wrong
const maxRetries = 3;
const apiTimeout = 10000;
```

**Variables**: camelCase

```javascript
// ✅ Correct
const [userRole, setUserRole] = useState("");
let bookingList = [];

// ❌ Wrong
const [UserRole, setUserRole] = useState("");
let booking_list = [];
```

### Import Organization

Order imports as follows:

```javascript
// 1. React imports
import React, { useState, useEffect } from "react";

// 2. React Native components
import { View, Text, StyleSheet } from "react-native";

// 3. External packages
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 4. Local imports (services, utils, components)
import { getBookings } from "../services/api";
import { formatDate } from "../utils/helpers";
import BookingCard from "../components/BookingCard";
```

## 📁 File Structure

### Screens

- One screen per file
- Filename matches exported component name
- Include header and all styling in same file
- Keep screens focused on layout and navigation

```javascript
// ✅ src/screens/BookingListScreen.js
export default function BookingListScreen({ navigation }) {
  // Component logic
}
```

### Components

- Reusable UI elements
- Accept props for customization
- Include PropTypes or TypeScript types (future)
- Keep styling in same file

```javascript
// ✅ src/components/BookingCard.js
export default function BookingCard({ booking, role, onPress }) {
  // Component logic
}
```

### Services

- API calls only
- Request/response handling
- Error throwing
- No UI logic

```javascript
// ✅ src/services/api.js
export const getBookings = async (role) => {
  const response = await api.get("/admin/bookings", { params: { role } });
  return response.data;
};
```

### Utils

- Pure utility functions
- No state or side effects
- Reusable across app
- Well documented

```javascript
// ✅ src/utils/helpers.js
export const formatDate = (dateString) => {
  // Pure function, no side effects
  return new Date(dateString).toLocaleDateString();
};
```

## 🔒 Data Flow

```
User Input (Button, TextInput)
    ↓
Event Handler (handlePress, onChange)
    ↓
State Update (setState, useState hook)
    ↓
Optional: API Call (via service)
    ↓
Update State with Response
    ↓
Re-render Component with New State
```

### Good Data Flow Pattern

```javascript
export default function BookingListScreen() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Fetch function
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await getBookings(); // ← Service call
      setBookings(data); // ← State update
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Effect hook
  useEffect(() => {
    fetchBookings();
  }, []);

  // 3. Render
  return (
    <FlatList
      data={bookings}
      renderItem={({ item }) => (
        <BookingCard
          booking={item}
          onPress={() => handlePress(item)} // ← Event handler
        />
      )}
    />
  );
}
```

## 🎨 Component Props

### Required vs Optional

```javascript
// ✅ Be explicit
function BookingCard({ booking, role, onPress }) {
  // Use the props
}

// ❌ Using props you don't need
function BookingCard(props) {
  // Accessing deeply nested: props.data.booking.info
}
```

### Prop Validation

```javascript
// ✅ Document expected shapes
function BookingCard({
  booking, // { id, guest_name, status, ... }
  role, // 'admin' | 'reservation_manager' | 'guest_manager'
  onPress, // (booking) => void
}) {
  // Implementation
}
```

## 🔄 State Management

### When to Use useState

- Simple component state (form inputs, toggles)
- Local UI state (expanded/collapsed, loading)

```javascript
const [email, setEmail] = useState("");
const [isExpanded, setIsExpanded] = useState(false);
const [loading, setLoading] = useState(false);
```

### When NOT to Use useState

- Derived data (compute from existing state)
- Large shared state (consider Context API or Redux)

```javascript
// ❌ Don't do this
const [bookingCount, setBookingCount] = useState(0);
// ... later
setBookingCount(bookings.length);

// ✅ Do this instead
const bookingCount = bookings.length;
```

## 🎯 Error Handling

### API Errors

```javascript
try {
  const data = await getBookings();
  setBookings(data);
} catch (error) {
  // Log for debugging
  console.error("Fetch error:", error);

  // Show user-friendly message
  Alert.alert("Error", "Failed to load bookings. Please try again.");

  // Update UI state if needed
  setError("Failed to load bookings");
}
```

### User Input Validation

```javascript
const handleLogin = () => {
  // Validate before API call
  if (!email) {
    Alert.alert("Error", "Email is required");
    return;
  }

  if (!isValidEmail(email)) {
    Alert.alert("Error", "Invalid email format");
    return;
  }

  // Proceed with login
  performLogin();
};
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] Tested on Android emulator
- [ ] Tested on iOS simulator
- [ ] Tested on physical device (if possible)
- [ ] Tested with different screen sizes
- [ ] Tested with poor network conditions
- [ ] Tested all user roles

### Edge Cases to Consider

- Empty data lists
- Network failures
- Very long text (names, descriptions)
- Different time zones
- Different languages (future)

## 📝 Comments and Documentation

### When to Comment

```javascript
// ✅ Good - explains WHY, not WHAT
// Using callback ref to focus input after render
const inputRef = useRef(null);

// ❌ Bad - states the obvious
// Create a ref
const inputRef = useRef(null);
```

### Function Documentation

```javascript
/**
 * Fetch bookings from API and update state
 * Handles loading and error states
 *
 * @param {string} role - User role for filtering
 * @returns {Promise<void>}
 */
const fetchBookings = async (role) => {
  // Implementation
};
```

## 🚀 Performance Tips

### Avoid Unnecessary Re-renders

```javascript
// ❌ Creates new function on every render
<BookingCard onPress={() => navigate("Details")} />;

// ✅ Use useCallback to memoize
const handlePress = useCallback(() => navigate("Details"), [navigate]);
<BookingCard onPress={handlePress} />;
```

### Lazy Load Large Lists

```javascript
// ✅ FlatList renders only visible items
<FlatList
  data={bookings}
  renderItem={renderItem}
  initialNumToRender={10}
  maxToRenderPerBatch={10}
/>
```

### Avoid Inline Objects/Arrays

```javascript
// ❌ Creates new object every render
<View style={{ marginTop: 10, color: "#fff" }} />;

// ✅ Define outside or use StyleSheet
const styles = StyleSheet.create({
  container: { marginTop: 10, color: "#fff" },
});
```

## 🔐 Security Best Practices

### Never Store Sensitive Data Unencrypted

```javascript
// ❌ Don't do this
await AsyncStorage.setItem("password", password);

// ✅ Only store tokens
await AsyncStorage.setItem("userToken", token);
```

### Never Log Sensitive Information

```javascript
// ❌ Wrong
console.log("Credentials:", { email, password });

// ✅ Right
console.log("Login attempt for:", email);
```

### Always Validate Input

```javascript
// ✅ Good
if (!isValidEmail(email) || password.length < 6) {
  return;
}
```

## 📱 Mobile-Specific Considerations

### Handle Safe Areas

```javascript
// ✅ Accounts for notches and home buttons
<SafeAreaView style={styles.container} edges={["bottom"]}>
  {/* Content */}
</SafeAreaView>
```

### Responsive Design

```javascript
// ✅ Flexible, adapts to screen size
<View style={{ flex: 1, padding: 16 }}>
  <View style={{ flex: 1 }} />  {/* Flexible width */}
  <View style={{ width: '100%' }} />
</View>

// ❌ Fixed sizes (bad)
<View style={{ width: 320 }} />
```

### Handle Different Orientations

```javascript
// Use layout shift to adapt to orientation changes
useEffect(() => {
  const subscription = Dimensions.addEventListener("change", ({ window }) => {
    setWindowWidth(window.width);
  });

  return () => subscription?.remove();
}, []);
```

## 🧹 Code Cleanup

### Before Committing

- [ ] Remove console.log statements (except errors)
- [ ] Remove commented-out code
- [ ] No unused imports
- [ ] No TODO comments left behind
- [ ] All strings are in constants or utils
- [ ] All magic numbers are in constants

### Regular Refactoring

- [ ] Extract long components (>200 lines)
- [ ] Extract repeated logic to utils
- [ ] Update comments to match code
- [ ] Review and simplify complex logic

## 🐛 Debugging

### Using React Developer Tools

```bash
# Open developer menu in Expo
Cmd+D (iOS) or Cmd+M (Android)
# Or Ctrl+Shift+Z on Android

# Then select "Open React DevTools"
```

### Network Debugging

```javascript
// Add interceptor to log all requests
api.interceptors.request.use((config) => {
  console.log("📤 Request:", config.method.toUpperCase(), config.url);
  return config;
});

// Log all responses
api.interceptors.response.use((response) => {
  console.log("📥 Response:", response.status, response.data);
  return response;
});
```

## 📚 Resources

- [React Native Best Practices](https://reactnative.dev/docs/performance)
- [Expo Best Practices](https://docs.expo.dev/guides/performance)
- [JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html)

---

**Last Updated**: April 28, 2026
**Version**: 1.0
