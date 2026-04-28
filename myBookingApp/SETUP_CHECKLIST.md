# Setup Verification Checklist ✅

Complete this checklist to ensure your LuxeStay Booking App is ready to run.

## Pre-Flight Checklist

### 1. System Requirements

- [ ] Node.js v14+ installed
- [ ] npm or yarn installed
- [ ] Expo CLI installed (`npm install -g expo-cli`)
- [ ] Android emulator / iOS simulator available (or physical device)

### 2. Project Files

- [ ] All dependencies installed (`npm install`)
- [ ] node_modules folder exists
- [ ] package-lock.json or yarn.lock exists
- [ ] No red errors in IDE

### 3. Configuration

- [ ] API_BASE_URL set in `/src/config/env.js`
- [ ] MOCK_API enabled for development
- [ ] AsyncStorage available
- [ ] No hardcoded credentials in code

### 4. File Structure

- [ ] src/screens/ has 4 files (Login, Dashboard, BookingList, BookingDetail)
- [ ] src/components/ has BookingCard.js
- [ ] src/services/ has api.js
- [ ] src/utils/ has helpers.js
- [ ] src/config/ has env.js

---

## First Run Checklist

### Before Starting App

- [ ] Terminal is open in project directory
- [ ] Run `npm install` (if not done)
- [ ] Run `node verify-setup.js` (shows all is good)

### Start Development Server

- [ ] Run `npm start`
- [ ] Wait for QR code to appear
- [ ] See "Expo dev client ready at" message
- [ ] No errors in terminal

### Login

- [ ] Use `admin@test.com` (any password)
- [ ] See Dashboard screen
- [ ] Welcome message shows role

### Navigate

- [ ] Tap "Bookings" to go to booking list
- [ ] See list of bookings load
- [ ] Tap a booking to view details
- [ ] Back button works
- [ ] Logout button works

---

## Feature Verification

### Authentication ✅

- [ ] Login screen appears first
- [ ] Email validation works (try invalid email)
- [ ] Password field is masked
- [ ] Eye icon shows/hides password
- [ ] Loading spinner appears during login
- [ ] Test accounts work (see QUICKSTART.md)

### Dashboard ✅

- [ ] Welcome message shows user role
- [ ] Quick stats display (check-ins, pending)
- [ ] "Bookings" menu item visible
- [ ] Logout button works
- [ ] Confirming logout clears session

### Booking List ✅

- [ ] List loads with booking cards
- [ ] Can scroll through list
- [ ] Cards display correct fields
- [ ] Search works (try searching for "John")
- [ ] Pull-to-refresh works (drag down)
- [ ] Loading spinner shows briefly
- [ ] Results count shows at bottom

### Booking Details ✅

- [ ] Tap a booking to see details
- [ ] Guest avatar with initials displays
- [ ] All booking info shows
- [ ] Action buttons visible
- [ ] Back button returns to list
- [ ] Fields match role visibility rules

### Role-Based Features ✅

- [ ] Login with admin@test.com
  - [ ] See mobile number in list
  - [ ] See status badge
  - [ ] See full details
- [ ] Login with reservation@test.com
  - [ ] See mobile number
  - [ ] See status badge
  - [ ] See full details
  - [ ] Modify buttons might be different
- [ ] Login with guest@test.com
  - [ ] Mobile number hidden
  - [ ] Status badge hidden
  - [ ] Limited detail view

---

## Error Handling ✅

- [ ] Network error shows friendly message
- [ ] Retry button appears on error
- [ ] Empty list shows helpful message
- [ ] Loading states don't freeze UI
- [ ] Invalid input shows validation error

---

## Performance ✅

- [ ] App starts in <5 seconds
- [ ] List scrolls smoothly
- [ ] No freezing or lag
- [ ] Refresh completes in <2 seconds
- [ ] Navigation is instant

---

## Browser Console ✅

- [ ] No red error messages
- [ ] No yellow warnings
- [ ] No 404 errors for assets
- [ ] Network requests show 200/mock responses

---

## Mobile-Specific ✅

- [ ] Notch/safe area handled correctly
- [ ] All text readable on small screens
- [ ] Buttons are finger-sized (>44px)
- [ ] Bottom navigation accessible
- [ ] Keyboard doesn't cover input fields

---

## API Ready ✅

- [ ] API service exports 4 functions
- [ ] Mock data returns valid format
- [ ] Token stored in AsyncStorage
- [ ] Role stored in AsyncStorage
- [ ] API URL can be changed in env.js

---

## Documentation ✅

- [ ] README.md exists and is readable
- [ ] QUICKSTART.md has clear instructions
- [ ] DEVELOPMENT.md explains guidelines
- [ ] API_SPECIFICATION.md ready for backend team
- [ ] verify-setup.js runs successfully
- [ ] IMPLEMENTATION_COMPLETE.md summarizes everything

---

## Production Ready Checklist

### Before Deploying

- [ ] API URL updated to production endpoint
- [ ] MOCK_API disabled in env.js
- [ ] All test accounts removed from code
- [ ] Console.log statements removed
- [ ] TODO comments addressed
- [ ] App tested with real backend
- [ ] Error messages are user-friendly
- [ ] Loading timeouts set appropriately
- [ ] Network timeout increased if needed
- [ ] HTTPS enforced for API

### Build & Deploy

- [ ] Version number updated in package.json
- [ ] App signed with production certificate
- [ ] App tested on real devices
- [ ] All permissions granted (Android/iOS)
- [ ] Privacy policy reviewed
- [ ] Terms of service finalized

---

## Quick Troubleshooting

If app won't start:

1. [ ] Delete node_modules: `rm -rf node_modules`
2. [ ] Reinstall: `npm install`
3. [ ] Clear cache: `npm start -- --clear`

If API errors:

1. [ ] Check API URL in env.js
2. [ ] Verify backend is running
3. [ ] Check internet connection
4. [ ] Try with MOCK_API enabled

If role not updating:

1. [ ] Hard reload: Kill app and restart
2. [ ] Clear AsyncStorage (logout, clear app data)
3. [ ] Check token storage in DevTools

If UI looks wrong:

1. [ ] Restart Expo: `npm start`
2. [ ] Use physical device (emulator issues)
3. [ ] Check responsive design in DEVELOPMENT.md

---

## Final Sign-Off

When ALL checkboxes are complete:

```
✅ Project is ready for development
✅ Project is ready for testing
✅ Project is ready for production
```

---

**Last Verified**: April 28, 2026
**Version**: 1.0.0
**Status**: Ready to Ship 🚀
