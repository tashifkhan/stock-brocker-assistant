# Authentication System Documentation

## Overview
This document describes the authentication workflow implemented for the Stock Broker Assistant application, integrating with the FastAPI backend authentication APIs.

## Features Implemented

### 1. **User Registration**
- New users can register with email, password, and full name
- Email verification required before login
- Password validation (minimum 8 characters)
- Automatic redirect to login after successful registration
- Email verification link sent upon registration

### 2. **User Login**
- Email and password authentication
- JWT token-based authentication
- Automatic token storage in localStorage
- User data persistence across sessions
- Email verification check before allowing login

### 3. **Protected Routes**
- All main application routes require authentication
- Admin-only routes (e.g., /admin) require admin privileges
- Automatic redirect to login for unauthenticated users
- Loading state during authentication check

### 4. **Password Management**
- **Forgot Password**: Request password reset link via email
- **Reset Password**: Reset password using token from email link
- **Change Password**: Authenticated users can change password in settings

### 5. **Email Verification**
- Verification link sent upon registration
- Token-based email verification
- Automatic redirect to login after verification
- Resend verification email option

### 6. **User Session Management**
- User profile displayed in header
- Logout functionality
- User menu with profile and settings access
- Token automatically included in all API requests

## File Structure

```
frontend/src/
├── contexts/
│   └── AuthContext.tsx           # Auth state management and provider
├── components/
│   ├── Layout.tsx                # Main layout with auth-aware header
│   └── ProtectedRoute.tsx        # Route guard component
├── pages/
│   ├── Login.tsx                 # Login page
│   ├── Register.tsx              # Registration page
│   ├── ForgotPassword.tsx        # Forgot password page
│   ├── ResetPassword.tsx         # Reset password page
│   ├── VerifyEmail.tsx           # Email verification page
│   └── Settings.tsx              # Settings page (with password change)
├── lib/
│   └── api.ts                    # API client with auth functions
└── App.tsx                       # Root component with routing
```

## API Endpoints Used

### Authentication Endpoints
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user profile
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token
- `GET /auth/verify-email` - Verify email with token
- `POST /auth/resend-verification` - Resend verification email
- `POST /auth/change-password` - Change password (authenticated)

## Authentication Flow

### Registration Flow
1. User fills registration form (email, password, full name)
2. Frontend validates password strength and confirmation match
3. API creates user account
4. Verification email sent to user
5. User redirected to login page
6. User clicks verification link in email
7. Email verified, user can now login

### Login Flow
1. User enters email and password
2. Frontend sends credentials to `/auth/login`
3. Backend validates and returns JWT token
4. Frontend fetches user data from `/auth/me`
5. Token and user data stored in localStorage
6. User redirected to dashboard
7. All subsequent API calls include Bearer token

### Password Reset Flow
1. User clicks "Forgot Password" on login page
2. User enters email address
3. Reset link sent to email
4. User clicks reset link with token
5. User enters new password
6. Password updated in database
7. User redirected to login page

## Components

### AuthContext
Provides authentication state and functions to the entire app:
- `user`: Current user object
- `token`: JWT authentication token
- `isLoading`: Loading state during initialization
- `isAuthenticated`: Boolean indicating auth status
- `login(email, password)`: Login function
- `register(email, password, fullName)`: Registration function
- `logout()`: Logout function
- `updateUser(user)`: Update user data

### ProtectedRoute
Wraps routes that require authentication:
```tsx
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

// For admin-only routes
<ProtectedRoute requireAdmin>
  <AdminDashboard />
</ProtectedRoute>
```

### Layout Component
- Displays user avatar and name in header
- Provides user dropdown menu
- Logout functionality
- Wraps all protected pages

## Usage Examples

### Using Auth Context in Components
```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, logout, isAuthenticated } = useAuth();
  
  return (
    <div>
      {isAuthenticated && (
        <p>Welcome, {user?.full_name}!</p>
      )}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Making Authenticated API Calls
All API calls automatically include the auth token:
```tsx
import { marketApi } from '@/lib/api';

// Token automatically included
const data = await marketApi.getDaily();
```

### Protecting a New Route
```tsx
// In App.tsx
<Route
  path="/new-protected-page"
  element={
    <ProtectedRoute>
      <NewProtectedPage />
    </ProtectedRoute>
  }
/>
```

## Security Features

1. **JWT Token Storage**: Tokens stored in localStorage (consider httpOnly cookies for production)
2. **Token Auto-Inclusion**: All API calls automatically include Bearer token
3. **Password Validation**: Minimum 8 characters required
4. **Email Verification**: Users must verify email before login
5. **Protected Routes**: Unauthenticated users redirected to login
6. **Admin Protection**: Admin routes require admin privilege
7. **Session Persistence**: Auth state persists across page refreshes

## Environment Variables

```env
VITE_API_URL=http://localhost:8000
```

## Backend Requirements

The backend must provide the following:
1. JWT token generation with HS256 algorithm
2. Email verification system
3. Password reset token generation
4. User role management (admin flag)
5. Password hashing (bcrypt or similar)

## Future Enhancements

1. **Refresh Tokens**: Implement refresh token mechanism
2. **Remember Me**: Optional persistent login
3. **Social Login**: Google, GitHub, LinkedIn integration
4. **2FA**: Two-factor authentication support
5. **Session Management**: View and manage active sessions
6. **Password Strength Meter**: Visual password strength indicator
7. **Rate Limiting**: Client-side rate limiting for login attempts
8. **HttpOnly Cookies**: Move tokens to httpOnly cookies for better security

## Testing the Authentication

### Manual Testing Steps

1. **Registration**:
   - Navigate to `/register`
   - Fill form and submit
   - Check email for verification link
   - Click verification link
   - Verify redirect to login

2. **Login**:
   - Navigate to `/login`
   - Enter credentials
   - Verify redirect to dashboard
   - Check user info in header

3. **Protected Routes**:
   - Logout
   - Try accessing `/dashboard` directly
   - Verify redirect to login

4. **Password Reset**:
   - Click "Forgot Password"
   - Enter email
   - Check email for reset link
   - Click link and reset password
   - Login with new password

5. **Change Password**:
   - Login
   - Navigate to `/settings`
   - Go to Security tab
   - Change password
   - Logout and login with new password

## Troubleshooting

### Common Issues

1. **"Email not verified" error**:
   - Check spam folder for verification email
   - Use resend verification option

2. **Token expired errors**:
   - Tokens expire after 30 minutes
   - User needs to login again

3. **CORS errors**:
   - Ensure backend CORS is configured for frontend URL
   - Check `allow_origins` in backend CORS middleware

4. **Verification link not working**:
   - Link expires after 24 hours
   - Request new verification email

## Support

For issues or questions:
- Check backend logs for API errors
- Verify environment variables are set correctly
- Ensure MongoDB is running for backend
- Check browser console for frontend errors
