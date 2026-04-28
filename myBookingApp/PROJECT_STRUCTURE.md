# Project Structure Guide 📁

Complete visual guide to the LuxeStay Booking Admin App structure.

## Directory Tree

```
myBookingApp/
│
├── 📄 App.js                          # Main navigation container
├── 📄 index.js                        # App entry point
├── 📄 app.json                        # Expo configuration
├── 📄 package.json                    # NPM dependencies
├── 📄 package-lock.json              # Dependency lock file
│
├── 📁 src/                           # Source code
│   │
│   ├── 📁 screens/                   # Full-screen components
│   │   ├── 📄 LoginScreen.js         # Login page (124 lines)
│   │   │   ├── Email input
│   │   │   ├── Password input with toggle
│   │   │   ├── Email validation
│   │   │   ├── Mock auth
│   │   │   ├── API integration
│   │   │   ├── Test account hints
│   │   │   └── Loading state
│   │   │
│   │   ├── 📄 DashboardScreen.js     # Home page (76 lines)
│   │   │   ├── Welcome message
│   │   │   ├── Quick stats
│   │   │   ├── Navigation menu
│   │   │   ├── Logout button
│   │   │   └── Role display
│   │   │
│   │   ├── 📄 BookingListScreen.js   # Bookings list (380 lines)
│   │   │   ├── FlatList display
│   │   │   ├── Search functionality
│   │   │   ├── Pull-to-refresh
│   │   │   ├── Loading states
│   │   │   ├── Error handling
│   │   │   ├── Empty states
│   │   │   ├── API integration
│   │   │   └── Results counter
│   │   │
│   │   └── 📄 BookingDetailScreen.js # Detail page (245 lines)
│   │       ├── Guest avatar
│   │       ├── Booking info
│   │       ├── Role-based visibility
│   │       ├── Action buttons
│   │       └── Status updates
│   │
│   ├── 📁 components/                # Reusable components
│   │   └── 📄 BookingCard.js         # Booking card component (148 lines)
│   │       ├── Guest name
│   │       ├── Booking ID
│   │       ├── Check-in/out dates
│   │       ├── Guest count
│   │       ├── Mobile number (conditional)
│   │       ├── Status badge (conditional)
│   │       └── Role-based rendering
│   │
│   ├── 📁 services/                  # API & data services
│   │   └── 📄 api.js                 # Axios API client (78 lines)
│   │       ├── Base configuration
│   │       ├── Request interceptor
│   │       ├── Response interceptor
│   │       ├── loginApi()
│   │       ├── getBookings()
│   │       ├── getBookingDetail()
│   │       ├── updateBookingStatus()
│   │       └── Error handling
│   │
│   ├── 📁 utils/                     # Utility functions
│   │   └── 📄 helpers.js             # Helper functions (247 lines)
│   │       ├── formatDate()
│   │       ├── getStatusColor()
│   │       ├── getStatusBgColor()
│   │       ├── canViewMobileNumber()
│   │       ├── canModifyBookings()
│   │       ├── canDeleteBookings()
│   │       ├── getRoleDisplayName()
│   │       ├── calculateNights()
│   │       ├── isValidEmail()
│   │       ├── isValidPhone()
│   │       ├── formatPhone()
│   │       ├── getStatusBadgeText()
│   │       ├── isDateInPast()
│   │       └── log() [15+ functions]
│   │
│   ├── 📁 config/                    # Configuration
│   │   └── 📄 env.js                 # Environment config (45 lines)
│   │       ├── API_BASE_URL
│   │       ├── App constants
│   │       ├── Roles definition
│   │       ├── Status types
│   │       ├── Feature flags
│   │       └── AsyncStorage keys
│   │
│   └── 📁 assets/                    # Images, fonts, etc.
│       ├── fonts/
│       ├── images/
│       └── icons/
│
├── 📁 node_modules/                  # Dependencies (auto-generated)
│
├── 📄 README.md                      # Main documentation (500+ lines)
│   ├── Features overview
│   ├── Project structure
│   ├── Tech stack
│   ├── Getting started
│   ├── Configuration
│   ├── API endpoints
│   ├── Role-based features
│   ├── Components guide
│   ├── State management
│   ├── Troubleshooting
│   └── Resources
│
├── 📄 QUICKSTART.md                  # Quick setup (200+ lines)
│   ├── Prerequisites
│   ├── Installation steps
│   ├── Test accounts
│   ├── Switching to real API
│   ├── Project structure
│   ├── Common tasks
│   ├── Debugging tips
│   ├── Troubleshooting
│   └── Testing checklist
│
├── 📄 DEVELOPMENT.md                 # Developer guide (400+ lines)
│   ├── Code style
│   ├── Naming conventions
│   ├── Import organization
│   ├── File structure
│   ├── Data flow patterns
│   ├── Component props
│   ├── State management
│   ├── Error handling
│   ├── Testing guidelines
│   ├── Comments & docs
│   ├── Performance tips
│   ├── Security practices
│   ├── Mobile considerations
│   └── Code cleanup
│
├── 📄 API_SPECIFICATION.md           # Backend API spec (400+ lines)
│   ├── API overview
│   ├── Authentication endpoint
│   ├── Bookings endpoints
│   ├── Data types
│   ├── Status codes
│   ├── Authorization rules
│   ├── Rate limiting
│   ├── CORS headers
│   ├── Error handling
│   ├── Implementation checklist
│   ├── Testing guide
│   └── Frontend integration
│
├── 📄 IMPLEMENTATION_COMPLETE.md    # Completion summary (300+ lines)
│   ├── What's implemented
│   ├── Tech stack
│   ├── File structure
│   ├── Feature breakdown
│   ├── Code statistics
│   ├── Testing checklist
│   ├── Configuration guide
│   ├── Development workflow
│   ├── Backend integration points
│   ├── Common issues
│   └── Future enhancements
│
├── 📄 SETUP_CHECKLIST.md            # Verification checklist (250+ lines)
│   ├── Pre-flight checklist
│   ├── First run checklist
│   ├── Feature verification
│   ├── Error handling tests
│   ├── Performance tests
│   ├── Production readiness
│   └── Troubleshooting
│
├── 📄 verify-setup.js               # Setup verification script (140 lines)
│   ├── Checks required files
│   ├── Verifies packages
│   ├── Checks node_modules
│   ├── Validates configuration
│   └── Summary report
│
├── 📄 .gitignore                     # Git ignore rules
├── 📁 .expo/                        # Expo configuration (auto)
├── 📁 .git/                         # Git repository (auto)
└── 📄 PROJECT_STRUCTURE.md          # This file

```

---

## 📊 Statistics

### Code Files

| File                   | Type      | Lines     | Purpose           |
| ---------------------- | --------- | --------- | ----------------- |
| LoginScreen.js         | Screen    | 124       | Authentication    |
| DashboardScreen.js     | Screen    | 76        | Home page         |
| BookingListScreen.js   | Screen    | 380       | Booking list      |
| BookingDetailScreen.js | Screen    | 245       | Detail view       |
| BookingCard.js         | Component | 148       | Card component    |
| api.js                 | Service   | 78        | API client        |
| helpers.js             | Utils     | 247       | Utility functions |
| env.js                 | Config    | 45        | Configuration     |
| **Total Code**         |           | **1,343** |                   |

### Documentation

| File                       | Size       | Purpose      |
| -------------------------- | ---------- | ------------ |
| README.md                  | 500+       | Main docs    |
| QUICKSTART.md              | 200+       | Quick setup  |
| DEVELOPMENT.md             | 400+       | Dev guide    |
| API_SPECIFICATION.md       | 400+       | API spec     |
| IMPLEMENTATION_COMPLETE.md | 300+       | Summary      |
| SETUP_CHECKLIST.md         | 250+       | Verification |
| **Total Docs**             | **2,050+** |              |

### Total Project

- **Lines of Code**: 1,343
- **Lines of Docs**: 2,050+
- **Total**: 3,393+ lines
- **Screens**: 4
- **Components**: 1 (+ variations)
- **API Functions**: 4
- **Helper Functions**: 15+

---

## 🗺️ Data Flow

### Authentication Flow

```
LoginScreen
  ↓
  handleLogin()
    ↓
    loginApi() [POST /login]
      ↓
      (Success) → Save token & role → Navigate to Dashboard
      (Error) → Show Alert → Stay on Login
```

### Booking Display Flow

```
BookingListScreen
  ↓
  fetchBookings()
    ↓
    getBookings() [GET /admin/bookings]
      ↓
      (Success) → Update state → FlatList renders
      (Error) → Show error state → Allow retry
      ↓
      renderItem() → BookingCard component
        ↓
        Role-based visibility applied
```

### Detail Navigation Flow

```
BookingCard (onPress)
  ↓
  navigate('BookingDetail', { booking, role })
    ↓
    BookingDetailScreen mounts
      ↓
      Route params used for display
      ↓
      Show all data or limited based on role
```

---

## 🎯 Key Directories

### `/src/screens/` - Page Components

- One screen = one file
- Handles navigation
- Contains page-level state
- Manages API calls

### `/src/components/` - Reusable Components

- Smaller UI pieces
- Accept props
- Styled locally
- No navigation logic

### `/src/services/` - API Layer

- API client setup
- Endpoint functions
- Error handling
- Request/response processing

### `/src/utils/` - Helper Functions

- Pure functions
- No side effects
- Reusable logic
- Formatting, validation, etc.

### `/src/config/` - Settings

- Environment variables
- Constants
- Feature flags
- API configuration

---

## 🔄 Component Relationships

```
App.js (Navigation)
│
├── LoginScreen
│   └── loginApi() [from api.js]
│
├── DashboardScreen
│   └── Links to BookingList
│
└── BookingListScreen
    ├── getBookings() [from api.js]
    ├── BookingCard (component)
    │   └── Role checks [from helpers.js]
    └── BookingDetailScreen
        ├── updateBookingStatus() [from api.js]
        └── Helper functions [from helpers.js]
```

---

## 📱 Screen Transitions

```
┌─────────────────┐
│   LoginScreen   │
└────────┬────────┘
         │ (on login)
         ↓
┌─────────────────┐
│ DashboardScreen │
└────────┬────────┘
         │ (tap Bookings)
         ↓
┌────────────────────┐
│ BookingListScreen  │
└────────┬───────────┘
         │ (tap booking)
         ↓
┌────────────────────┐
│BookingDetailScreen │
└────────┬───────────┘
         │ (back)
         ↓
┌────────────────────┐
│ BookingListScreen  │
└────────────────────┘
```

---

## 💾 Data Models

### User Object

```javascript
{
  id: number,
  name: string,
  email: string,
  role: 'admin' | 'reservation_manager' | 'guest_manager'
}
```

### Booking Object

```javascript
{
  id: number,
  guest_name: string,
  guest_email: string,
  mobile: string,
  category: string,
  total_guests: number,
  checkin_date: string (YYYY-MM-DD),
  checkout_date: string (YYYY-MM-DD),
  status: 'pending' | 'confirmed' | 'cancelled',
  created_at: string (ISO 8601),
  updated_at: string (ISO 8601)
}
```

### Auth Token

```javascript
{
  token: string (JWT),
  user: User object
}
```

---

## 🔐 File Permissions

### Public Files (Can Share)

- README.md
- QUICKSTART.md
- DEVELOPMENT.md
- API_SPECIFICATION.md
- SETUP_CHECKLIST.md

### Team Files (Internal)

- All .js files
- IMPLEMENTATION_COMPLETE.md
- verify-setup.js

### Sensitive Files (Do NOT commit)

- .env files with real credentials
- API keys
- Passwords
- Secret tokens

---

## 🚀 Deployment Paths

### For Development

1. Keep MOCK_API enabled
2. Use localhost API
3. Use test accounts

### For Testing

1. Connect to test backend
2. Use test data
3. Run full checklist

### For Production

1. Disable MOCK_API
2. Set production API URL
3. Use real backend
4. Sign app
5. Submit to stores

---

## 📚 Documentation Map

```
README.md ← Start here for overview
    ├── QUICKSTART.md ← Quick setup instructions
    ├── DEVELOPMENT.md ← For developers
    ├── API_SPECIFICATION.md ← For backend team
    ├── SETUP_CHECKLIST.md ← Before going live
    └── IMPLEMENTATION_COMPLETE.md ← Technical summary
```

---

## ✅ All Files Present

Run this to verify:

```bash
node verify-setup.js
```

Should show all files are present and configured correctly.

---

**Last Updated**: April 28, 2026
**Version**: 1.0.0
**Status**: Complete & Ready ✅
