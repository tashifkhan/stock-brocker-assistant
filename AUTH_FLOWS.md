# Authentication Flow Diagrams

## 📋 Table of Contents
1. [Registration Flow](#registration-flow)
2. [Login Flow](#login-flow)
3. [Password Reset Flow](#password-reset-flow)
4. [Protected Route Flow](#protected-route-flow)
5. [API Request Flow](#api-request-flow)

---

## Registration Flow

```mermaid
graph TD
    A[User visits /register] --> B[Fill registration form]
    B --> C{Form valid?}
    C -->|No| D[Show validation errors]
    D --> B
    C -->|Yes| E[POST /auth/register]
    E --> F{Success?}
    F -->|No| G[Show error message]
    G --> B
    F -->|Yes| H[Show success message]
    H --> I[Backend sends verification email]
    I --> J[Redirect to /login]
    J --> K[User checks email]
    K --> L[Click verification link]
    L --> M[GET /auth/verify-email?token=xxx]
    M --> N{Valid token?}
    N -->|No| O[Show error]
    N -->|Yes| P[Mark email as verified]
    P --> Q[Show success + redirect to login]
```

**Key Points:**
- Email verification required before login
- Verification link expires in 24 hours
- Can resend verification if needed

---

## Login Flow

```mermaid
graph TD
    A[User visits /login] --> B[Enter credentials]
    B --> C{Valid format?}
    C -->|No| D[Show validation]
    D --> B
    C -->|Yes| E[POST /auth/login]
    E --> F{Valid credentials?}
    F -->|No| G[Show error]
    G --> B
    F -->|Yes| H{Email verified?}
    H -->|No| I[Show 'Email not verified']
    I --> B
    H -->|Yes| J[Receive JWT token]
    J --> K[GET /auth/me with token]
    K --> L[Receive user data]
    L --> M[Store token in localStorage]
    M --> N[Store user in localStorage]
    N --> O[Update AuthContext]
    O --> P[Redirect to /dashboard]
```

**Key Points:**
- OAuth2 password flow used
- JWT token returned
- Token stored in localStorage
- User data cached locally
- Session persists across refreshes

---

## Password Reset Flow

```mermaid
graph TD
    A[User clicks 'Forgot Password'] --> B[Visit /forgot-password]
    B --> C[Enter email address]
    C --> D[POST /auth/forgot-password]
    D --> E[Show success message]
    E --> F[Backend sends reset email]
    F --> G[User checks email]
    G --> H[Click reset link]
    H --> I[Visit /reset-password?token=xxx]
    I --> J[Enter new password]
    J --> K{Passwords match?}
    K -->|No| L[Show error]
    L --> J
    K -->|Yes| M[POST /auth/reset-password]
    M --> N{Valid token?}
    N -->|No| O[Show error]
    N -->|Yes| P[Password updated]
    P --> Q[Show success]
    Q --> R[Redirect to /login]
```

**Key Points:**
- Reset link expires in 1 hour
- New password must be 8+ characters
- Old password is invalidated
- User must login with new password

---

## Protected Route Flow

```mermaid
graph TD
    A[User navigates to protected route] --> B[ProtectedRoute component]
    B --> C{isLoading?}
    C -->|Yes| D[Show loading spinner]
    C -->|No| E{isAuthenticated?}
    E -->|No| F[Redirect to /login]
    E -->|Yes| G{requireAdmin?}
    G -->|No| H[Render page]
    G -->|Yes| I{user.is_admin?}
    I -->|No| J[Redirect to /]
    I -->|Yes| H
```

**Key Points:**
- All app routes wrapped in ProtectedRoute
- Auth check happens before rendering
- Admin routes require is_admin flag
- Unauthenticated users redirected to login

---

## API Request Flow

```mermaid
graph TD
    A[Component calls API function] --> B[api.ts apiCall function]
    B --> C[Get token from localStorage]
    C --> D{Token exists?}
    D -->|Yes| E[Add Authorization header]
    D -->|No| F[No auth header]
    E --> G[Make fetch request]
    F --> G
    G --> H{Response OK?}
    H -->|No| I{401 Unauthorized?}
    I -->|Yes| J[User needs to re-login]
    I -->|No| K[Throw error with message]
    H -->|Yes| L[Parse JSON response]
    L --> M[Return data to component]
```

**Key Points:**
- Token automatically injected
- Works for all API endpoints
- 401 errors indicate expired token
- No manual token management needed

---

## Component Architecture

```
App.tsx (Root)
├── AuthProvider (Context)
│   ├── State: user, token, isLoading, isAuthenticated
│   └── Functions: login, register, logout
│
├── Public Routes
│   ├── /login → Login.tsx
│   ├── /register → Register.tsx
│   ├── /forgot-password → ForgotPassword.tsx
│   ├── /reset-password → ResetPassword.tsx
│   └── /verify-email → VerifyEmail.tsx
│
└── Layout (Protected)
    ├── Header
    │   ├── Logo
    │   ├── Notifications
    │   └── UserMenu
    │       ├── Avatar (user initials)
    │       ├── Full Name
    │       ├── Email
    │       └── Logout
    │
    └── ProtectedRoute Wrapper
        ├── /dashboard → Dashboard.tsx
        ├── /financial-data → FinancialData.tsx
        ├── /editorial → Editorial.tsx
        ├── /broker-reports → BrokerReports.tsx
        ├── /market-summary → MarketSummary.tsx
        ├── /filings-alerts → FilingsAlerts.tsx
        ├── /settings → Settings.tsx
        └── /admin → AdminDashboard.tsx (requireAdmin)
```

---

## State Management

```
AuthContext State
├── user: User | null
│   ├── id: string
│   ├── email: string
│   ├── full_name: string
│   ├── is_active: boolean
│   ├── is_verified: boolean
│   ├── is_admin: boolean
│   └── created_at: string
│
├── token: string | null
├── isLoading: boolean
└── isAuthenticated: boolean (computed)

LocalStorage
├── auth_token: string (JWT)
└── auth_user: string (JSON serialized User)
```

---

## Security Flow

```mermaid
graph TD
    A[User Action] --> B{Requires Auth?}
    B -->|No| C[Execute]
    B -->|Yes| D{Token exists?}
    D -->|No| E[Redirect to login]
    D -->|Yes| F{Token valid?}
    F -->|No| E
    F -->|Yes| G{Admin required?}
    G -->|No| C
    G -->|Yes| H{User is admin?}
    H -->|No| I[Redirect to dashboard]
    H -->|Yes| C
```

---

## Data Flow

```
User Login
    ↓
Frontend: Login Form
    ↓
POST /auth/login (OAuth2 form)
    ↓
Backend: Validate credentials
    ↓
Backend: Check email verified
    ↓
Backend: Generate JWT token
    ↓
Frontend: Receive token
    ↓
Frontend: GET /auth/me (with token)
    ↓
Backend: Validate token
    ↓
Backend: Return user data
    ↓
Frontend: Store token + user
    ↓
Frontend: Update AuthContext
    ↓
Frontend: Redirect to dashboard
    ↓
All API calls include token
```

---

## Token Lifecycle

```
Token Creation
    ↓
Login successful
    ↓
JWT signed with SECRET_KEY
    ↓
Expires in 30 minutes
    ↓
Stored in localStorage
    ↓
Auto-injected in API calls
    ↓
Used for authentication
    ↓
Token expires (30 min)
    ↓
401 Unauthorized
    ↓
User must re-login
    ↓
New token generated
```

---

## Error Handling

```mermaid
graph TD
    A[API Call] --> B{Network Error?}
    B -->|Yes| C[Show connection error]
    B -->|No| D{Response OK?}
    D -->|No| E{Status Code?}
    E -->|401| F[Token expired - redirect login]
    E -->|403| G[Forbidden - show error]
    E -->|400| H[Validation error - show message]
    E -->|500| I[Server error - show message]
    D -->|Yes| J[Parse response]
    J --> K{Success?}
    K -->|Yes| L[Return data]
    K -->|No| M[Show error message]
```

---

## Forms Validation

```
Registration Form
├── Full Name
│   └── Required
├── Email
│   ├── Required
│   └── Valid email format
├── Password
│   ├── Required
│   └── Min 8 characters
└── Confirm Password
    ├── Required
    └── Must match password

Login Form
├── Email
│   ├── Required
│   └── Valid email format
└── Password
    └── Required

Change Password Form
├── Current Password
│   └── Required
├── New Password
│   ├── Required
│   └── Min 8 characters
└── Confirm Password
    ├── Required
    └── Must match new password
```

---

## Session Management

```
Session Start (Login)
    ↓
Token stored: localStorage['auth_token']
User stored: localStorage['auth_user']
    ↓
AuthContext updated
    ↓
Session Active
    ├── All API calls authenticated
    ├── Protected routes accessible
    └── User info displayed
    ↓
Session End (Logout)
    ↓
Clear localStorage['auth_token']
Clear localStorage['auth_user']
    ↓
AuthContext reset
    ↓
Redirect to /login
```

---

## Email Flows

**Registration Email:**
```
User registers
    ↓
Backend generates verification token
    ↓
Email sent with link: /verify-email?token=xxx
    ↓
User clicks link
    ↓
Token validated
    ↓
Email marked as verified
    ↓
User can login
```

**Password Reset Email:**
```
User requests reset
    ↓
Backend generates reset token
    ↓
Email sent with link: /reset-password?token=xxx
    ↓
User clicks link
    ↓
User enters new password
    ↓
Token validated
    ↓
Password updated
    ↓
User can login with new password
```

---

## Mobile/Responsive Considerations

```
All auth pages are fully responsive:
- Forms adapt to small screens
- Buttons are touch-friendly
- Text is readable on mobile
- Cards fit mobile viewports
- No horizontal scrolling
- Proper spacing for touch targets
```

---

## Performance Optimizations

```
Authentication Context
├── useEffect for initial load
├── Minimal re-renders
└── Efficient state updates

Protected Routes
├── Loading state prevents flashing
├── Auth check before render
└── Cached user data

API Calls
├── Token retrieved once per call
├── No redundant auth checks
└── Efficient error handling
```

This visual documentation helps understand the complete authentication system at a glance!
