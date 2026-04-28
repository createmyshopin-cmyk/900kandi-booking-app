# Quick Start Guide 🚀

Get the LuxeStay Booking Admin App running in 5 minutes!

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Android emulator / iOS simulator (or physical device)

## Step 1: Install Dependencies

```bash
cd myBookingApp
npm install
```

## Step 2: Start Development Server

```bash
npm start
```

You should see a QR code in the terminal. Options:

- Press `a` - Open in Android emulator
- Press `i` - Open in iOS simulator
- Press `w` - Open in web browser
- Scan QR code with Expo Go app (physical device)

## Step 3: Login

Use one of these test accounts (password: any):

```
📧 admin@test.com          → Full Admin Access
📧 reservation@test.com    → Reservation Manager
📧 guest@test.com         → Guest Manager (Limited)
```

## Step 4: Explore

1. ✅ View dashboard with stats
2. ✅ Go to Bookings to see list
3. ✅ Search by guest name
4. ✅ Pull down to refresh
5. ✅ Tap booking to see details
6. ✅ Notice role-based field visibility

## 🔧 Switching to Real API

### 1. Update API URL

Edit `/src/config/env.js`:

```javascript
const ENV = {
  API_BASE_URL: "https://your-api.com/api", // ← Change this
  FEATURES: {
    MOCK_API: false, // ← Disable mock mode
  },
};
```

### 2. Backend API Requirements

Your CodeIgniter backend should provide:

```
POST   /login                    → Login endpoint
GET    /admin/bookings           → Get bookings list
GET    /admin/bookings/{id}      → Get single booking
PUT    /admin/bookings/{id}      → Update booking
DELETE /admin/bookings/{id}      → Delete booking
```

See `README.md` for full API format specification.

## 📂 Project Structure Quick Reference

```
myBookingApp/
├── src/
│   ├── screens/               # Main app screens
│   ├── components/            # Reusable UI components
│   ├── services/              # API calls
│   ├── utils/                 # Helper functions
│   └── config/                # Settings
├── assets/                    # Images, fonts
├── App.js                     # Navigation setup
├── package.json               # Dependencies
└── README.md                  # Full documentation
```

## 🎯 Common Tasks

### Add New Booking Field

1. **Update API service** (`src/services/api.js`):

   ```javascript
   // Add field to mock data or ensure backend returns it
   ```

2. **Update BookingCard** (`src/components/BookingCard.js`):

   ```javascript
   <View style={styles.cardBody}>
     <Ionicons name="icon-name" size={16} color="#64748b" />
     <Text style={styles.infoText}>{booking.new_field}</Text>
   </View>
   ```

3. **Update BookingDetailScreen** (`src/screens/BookingDetailScreen.js`):
   ```javascript
   <View style={styles.detailRow}>
     <Text style={styles.detailLabel}>New Field</Text>
     <Text style={styles.detailValue}>{booking.new_field}</Text>
   </View>
   ```

### Create New Role

1. **Add role in `/src/config/env.js`**:

   ```javascript
   ROLES: {
     NEW_ROLE: 'new_role',
   }
   ```

2. **Update helper functions** (`src/utils/helpers.js`):

   ```javascript
   export const canViewMobileNumber = (role) => {
     return role === ENV.ROLES.ADMIN || role === ENV.ROLES.NEW_ROLE;
   };
   ```

3. **Update BookingCard visibility logic**:
   ```javascript
   const showMobileNumber = canViewMobileNumber(role);
   ```

### Debug API Issues

1. **Enable detailed logging**:

   ```javascript
   // In src/config/env.js
   FEATURES: {
     ENABLE_LOGGING: true,
   }
   ```

2. **Check network tab**:
   - Open Expo DevTools
   - Go to Network tab
   - Make API call
   - Review request/response

3. **Test API directly**:
   ```bash
   # In terminal
   curl -X GET http://localhost:8080/admin/bookings \
     -H "Authorization: Bearer token123"
   ```

## 🐛 Troubleshooting

### "Cannot find module" Error

```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### App crashes on login

1. Check API URL in `/src/config/env.js`
2. Verify mock mode is enabled
3. Check test account credentials
4. Review console errors: `npm start` and look at terminal

### Slow API responses

1. Check network connection
2. Verify backend is running
3. Review API timeout in `src/services/api.js` (timeout: 10000)

### Role not changing after login

1. Check user role is returned in login API response
2. Verify AsyncStorage is working
3. Hard reload: Kill app and restart

## 📱 Testing on Physical Device

### With USB Cable:

```bash
# Android
npm run android

# iOS
npm run ios
```

### Wirelessly:

1. `npm start`
2. Open Expo Go app
3. Scan QR code shown in terminal

## 💡 Tips & Tricks

- **Hard reload**: In Expo, press `r` to reload
- **Debug**: Use `console.log()`, then check terminal
- **Network issues**: Try VPN or check firewall
- **Slow builds**: Increase RAM for emulator or use physical device
- **Clear cache**: `expo start --clear` or `npm start -- --clear`

## 🎓 Learning Resources

Stuck on something? Check these docs:

- React Native: https://reactnative.dev/docs
- Expo: https://docs.expo.dev
- React Hooks: https://react.dev/reference/react
- Navigation: https://reactnavigation.org/docs

## ✅ Testing Checklist

Before submitting to QA:

- [ ] Able to login with test account
- [ ] Bookings list shows data
- [ ] Can search by name
- [ ] Pull-to-refresh works
- [ ] Can tap booking to view details
- [ ] Mobile number hidden for guest_manager
- [ ] Status hidden for guest_manager
- [ ] Logout clears data
- [ ] No console errors

## 🚀 Ready to Deploy?

1. Set real API URL
2. Disable `MOCK_API`
3. Test with real backend
4. Update app version in `package.json`
5. Build for production:
   ```bash
   expo build:android
   expo build:ios
   ```

## 📞 Need Help?

- Check [README.md](./README.md) for detailed docs
- Review console errors in terminal
- Check network requests in Expo DevTools
- Verify test account credentials

**Happy coding! 🎉**
