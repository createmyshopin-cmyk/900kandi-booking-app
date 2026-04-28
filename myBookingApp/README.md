# LuxeStay Booking Admin App 📱

A professional React Native admin application built with Expo for managing hotel bookings with role-based access control.

## 🎯 Features

- ✅ **Authentication System**: Secure login with AsyncStorage token management
- ✅ **Role-Based Access Control**: Three user roles with different permissions
  - **Admin**: Full access to all features and data
  - **Reservation Manager**: Can view bookings and modify status
  - **Guest Manager**: Limited view, guest information only
- ✅ **Booking Management**: View and manage all guest bookings
- ✅ **Pull-to-Refresh**: Easy way to sync latest bookings
- ✅ **Search Functionality**: Filter bookings by guest name or ID
- ✅ **Responsive Design**: Beautiful, modern UI optimized for mobile
- ✅ **Error Handling**: Comprehensive error states and user feedback
- ✅ **Loading States**: Smooth loading spinners and animations

## 🏗️ Project Structure

```
src/
├── screens/              # Screen components
│   ├── LoginScreen.js       # Login interface
│   ├── DashboardScreen.js   # Main dashboard
│   ├── BookingListScreen.js # Bookings list with search
│   └── BookingDetailScreen.js # Booking details view
├── components/           # Reusable components
│   └── BookingCard.js       # Booking list item card
├── services/             # API integration
│   └── api.js              # Axios instance with interceptors
├── utils/                # Utility functions
│   └── helpers.js          # Date formatting, role checks, etc.
└── config/               # Configuration
    └── env.js              # Environment variables

```

## 🔧 Tech Stack

- **React Native** - Cross-platform mobile framework
- **Expo** - Development and deployment platform
- **React Navigation** - Screen navigation
- **Axios** - HTTP client for API calls
- **AsyncStorage** - Secure local data storage
- **Expo Vector Icons** - Beautiful icon library

## 📦 Dependencies

All dependencies are already installed in `package.json`. Key packages:

```json
{
  "expo": "~54.0.33",
  "react": "19.1.0",
  "react-native": "0.81.5",
  "@react-navigation/native": "^7.2.2",
  "@react-navigation/native-stack": "^7.14.12",
  "axios": "^1.15.2",
  "@react-native-async-storage/async-storage": "2.2.0",
  "@expo/vector-icons": "^15.0.3"
}
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Configure API Base URL

Edit `/src/config/env.js` and set your CodeIgniter API endpoint:

```javascript
const ENV = {
  API_BASE_URL: "http://your-api.com/api",
  // ... other config
};
```

### 3. Run the App

**Android:**

```bash
npm run android
```

**iOS:**

```bash
npm run ios
```

**Web:**

```bash
npm run web
```

**Development Server:**

```bash
npm start
```

Then press:

- `a` for Android emulator
- `i` for iOS simulator
- `w` for web browser

## 🔐 Authentication

### Login Flow

1. User enters email and password
2. App calls `/login` API endpoint
3. Backend returns token and user role
4. Token and role are stored in AsyncStorage
5. User navigated to Dashboard

### Test Accounts (Mock Mode)

For development/testing without backend:

| Email                | Password | Role                |
| -------------------- | -------- | ------------------- |
| admin@test.com       | any      | admin               |
| reservation@test.com | any      | reservation_manager |
| guest@test.com       | any      | guest_manager       |

_Note: In mock mode, any password works. Change `FEATURES.MOCK_API` to `false` in `/src/config/env.js` when backend is ready._

## 📊 API Endpoints

The app expects these endpoints from your CodeIgniter backend:

### Login

```http
POST /login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}

Response:
{
  "token": "abc123xyz",
  "user": {
    "id": 1,
    "name": "Admin User",
    "role": "admin"
  }
}
```

### Get Bookings

```http
GET /admin/bookings?role=admin
Authorization: Bearer {token}

Response:
[
  {
    "id": 101,
    "guest_name": "John Doe",
    "mobile": "9876543210",
    "category": "Premium Suite",
    "total_guests": 2,
    "checkin_date": "2026-05-10",
    "checkout_date": "2026-05-15",
    "status": "confirmed"
  },
  ...
]
```

### Get Booking Detail

```http
GET /admin/bookings/{bookingId}
Authorization: Bearer {token}
```

### Update Booking Status

```http
PUT /admin/bookings/{bookingId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "confirmed"
}
```

## 👥 Role-Based Features

### Admin Role ✅

- View all booking details
- See guest mobile numbers
- View booking status
- Update booking status
- Delete bookings (icon shown)
- Full admin access

### Reservation Manager Role 📋

- View all booking details
- See guest mobile numbers
- View booking status
- Update booking status
- Cannot delete bookings

### Guest Manager Role 👤

- View basic booking info only
- Cannot see mobile numbers
- Cannot see or modify status
- Limited to: ID, Name, Guests, Category, Dates

## 🎨 UI Components

### BookingCard Component

Displays a single booking with role-based visibility:

```javascript
<BookingCard
  booking={bookingData}
  role={userRole}
  onPress={() => navigateToDetail()}
/>
```

**Props:**

- `booking` (object): Booking data
- `role` (string): User role for visibility control
- `onPress` (function): Navigate to detail screen

### Screens

1. **LoginScreen**: Clean login form with test account hints
2. **DashboardScreen**: Overview stats and navigation menu
3. **BookingListScreen**: Searchable list with pull-to-refresh
4. **BookingDetailScreen**: Full booking details and actions

## 🔑 Key Functions

### API Service (`/src/services/api.js`)

```javascript
// Login
const response = await loginApi(email, password);

// Get bookings
const bookings = await getBookings(role);

// Get single booking
const booking = await getBookingDetail(bookingId);

// Update status
const result = await updateBookingStatus(bookingId, "confirmed");
```

### Helper Functions (`/src/utils/helpers.js`)

```javascript
// Role checks
canViewMobileNumber(role); // Returns boolean
canModifyBookings(role); // Returns boolean
canDeleteBookings(role); // Returns boolean

// Formatting
formatDate(dateString); // '2026-05-10' → 'May 10, 2026'
formatPhone(phone); // '9876543210' → '(987) 654-3210'
getStatusColor(status); // 'confirmed' → '#22c55e'

// Validation
isValidEmail(email); // Basic email validation
isValidPhone(phone); // Phone number validation
```

## 🔄 State Management

Currently uses React hooks:

- `useState` - Local component state
- `useEffect` - Side effects and API calls
- `useCallback` - Memoized functions

For larger apps, consider Redux or Context API.

## 🌐 Network Requests

### Axios Interceptors

**Request Interceptor:**

- Automatically attaches Bearer token to all requests

**Response Interceptor:**

- Handles 401 (Unauthorized) errors
- Clears token and navigates to login

### Error Handling

```javascript
try {
  const data = await getBookings();
  // Handle success
} catch (error) {
  // error.message or error.response.data
}
```

## 💾 AsyncStorage Keys

- `userToken` - Authentication token
- `userRole` - User's assigned role
- `userData` - User profile data (reserved for future)

_Tip: Clear storage for logout:_

```javascript
await AsyncStorage.removeItem("userToken");
await AsyncStorage.removeItem("userRole");
```

## 🎯 Configuration

### Environment Variables (`/src/config/env.js`)

```javascript
const ENV = {
  API_BASE_URL: "http://your-api.com/api", // Change this!
  APP_NAME: "LuxeStay Admin",
  FEATURES: {
    MOCK_API: true, // Set to false for production
    ENABLE_LOGGING: true, // Console logs
  },
};
```

### Colors & Styling

Primary color: `#0f3d2e` (dark teal)

Status colors:

- Confirmed: `#22c55e` (green)
- Pending: `#eab308` (yellow)
- Cancelled: `#ef4444` (red)

## 📱 Testing

### Manual Testing Checklist

- [ ] Login with each role
- [ ] View bookings list
- [ ] Search bookings
- [ ] Pull-to-refresh
- [ ] Tap booking to view details
- [ ] Check role-based visibility
- [ ] Test logout

### Mock Data

Modify booking data in `BookingListScreen.js` `fetchBookings()` function:

```javascript
setBookings([
  {
    id: 101,
    guest_name: "John Doe",
    mobile: "9876543210",
    category: "Premium Suite",
    total_guests: 2,
    checkin_date: "2026-05-10",
    checkout_date: "2026-05-15",
    status: "confirmed",
  },
  // Add more...
]);
```

## 🚨 Troubleshooting

### App Won't Start

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start -- --clear
```

### API Errors

- Check `API_BASE_URL` in `/src/config/env.js`
- Verify backend is running
- Check network connection
- Review API response format

### AsyncStorage Not Working

- Clear app data
- Restart development server
- Check permissions (Android/iOS)

## 🔒 Security Checklist

- [ ] Use HTTPS for API calls in production
- [ ] Never commit real API keys
- [ ] Use environment variables
- [ ] Implement token refresh
- [ ] Validate user input
- [ ] Use secure storage (not plain AsyncStorage for sensitive data)
- [ ] Implement request timeouts
- [ ] Add rate limiting

## 📝 Future Enhancements

- [ ] Offline support with local database
- [ ] Push notifications for new bookings
- [ ] Booking creation/editing UI
- [ ] Guest messaging system
- [ ] Advanced analytics dashboard
- [ ] Photo gallery for rooms/bookings
- [ ] Payment tracking
- [ ] Multi-language support

## 📚 Resources

- [React Native Documentation](https://reactnative.dev)
- [Expo Documentation](https://docs.expo.dev)
- [React Navigation](https://reactnavigation.org)
- [Axios Documentation](https://axios-http.com)

## 📄 License

Private project for LuxeStay Resort

## 👨‍💻 Support

For issues or feature requests, contact the development team.

---

**Last Updated:** April 28, 2026
**Version:** 1.0.0
