# Authentication Quick Start Guide

## Quick Setup

The authentication system is now fully integrated! Here's how to use it:

## Running the Application

### Backend
```bash
cd backend
# Make sure MongoDB is running
docker compose -f mongo-compose.yaml up -d

# Install dependencies (if needed)
poetry install

# Run the backend
python main.py
```

Backend will run on: `http://localhost:8000`

### Frontend
```bash
cd frontend
# Install dependencies (if needed)
npm install  # or bun install

# Run the frontend
npm run dev  # or bun run dev
```

Frontend will run on: `http://localhost:5173`

## Testing Authentication

### 1. Create a Test Account
1. Navigate to `http://localhost:5173/register`
2. Fill in the registration form:
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Password: `testpassword123`
   - Confirm Password: `testpassword123`
3. Click "Create account"
4. Check the backend console for the verification email link
5. Copy and paste the verification URL into your browser

### 2. Login
1. Navigate to `http://localhost:5173/login`
2. Enter your credentials:
   - Email: `test@example.com`
   - Password: `testpassword123`
3. Click "Sign in"
4. You'll be redirected to the dashboard

### 3. Explore Protected Features
Once logged in, you can:
- Access all dashboard pages
- View your profile in the header
- Change your password in Settings → Security
- Logout from the user menu

## Key Files to Know

### Frontend Structure
```
src/
├── contexts/AuthContext.tsx       # Auth state management
├── components/
│   ├── ProtectedRoute.tsx         # Protects routes
│   └── Layout.tsx                 # Main layout with auth
├── pages/
│   ├── Login.tsx                  # Login page
│   ├── Register.tsx               # Sign up page
│   └── Settings.tsx               # Change password
└── lib/api.ts                     # API calls (auto-auth)
```

### Backend Integration
All API calls automatically include the JWT token:
```typescript
import { marketApi } from '@/lib/api';

// Token is automatically included!
const data = await marketApi.getDaily();
```

## Authentication Features

✅ User Registration with Email Verification  
✅ Login with JWT Tokens  
✅ Protected Routes  
✅ Password Reset via Email  
✅ Change Password (Authenticated)  
✅ User Profile Display  
✅ Admin-Only Routes  
✅ Automatic Token Management  
✅ Session Persistence  

## Pages Available

### Public Pages (No Auth Required)
- `/login` - Login page
- `/register` - Registration page
- `/forgot-password` - Request password reset
- `/reset-password` - Reset password with token
- `/verify-email` - Email verification

### Protected Pages (Auth Required)
- `/` - Dashboard
- `/financial-data` - Financial data analysis
- `/editorial` - Editorial tools
- `/broker-reports` - Broker reports
- `/market-summary` - Market summary
- `/filings-alerts` - Filings alerts
- `/settings` - User settings
- `/admin` - Admin dashboard (admin only)

## 🛠️ Common Tasks

### Add a New Protected Route
In `App.tsx`:
```tsx
<Route
  path="/my-new-page"
  element={
    <ProtectedRoute>
      <MyNewPage />
    </ProtectedRoute>
  }
/>
```

### Access User Info in Components
```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) return null;
  
  return <div>Hello, {user.full_name}!</div>;
}
```

### Make Authenticated API Calls
Just use the existing API functions - auth is automatic:
```tsx
import { authApi } from '@/lib/api';

// This automatically includes the token
const userData = await authApi.getMe();
```

## Troubleshooting

### "Email not verified" Error
- Check backend console for verification link
- Or use the "Resend verification" option on login page

### Can't Login
- Make sure backend is running on port 8000
- Check that MongoDB is running
- Verify user is registered and email is verified

### CORS Errors
Backend CORS is configured for:
- `http://localhost:5173`
- `http://localhost:8080`
- `http://127.0.0.1:5173`
- `http://127.0.0.1:8080`

### Token Expired
- Tokens expire after 30 minutes
- Simply login again to get a new token

## Email Configuration

By default, email links are printed to the backend console. To configure actual email sending, check the backend's email service configuration.

## Next Steps

1. ✅ Start both backend and frontend
2. ✅ Register a test account
3. ✅ Verify email (check backend console)
4. ✅ Login and explore
5. ✅ Try changing password in Settings
6. ✅ Try logout and login again

## Tips

- Keep backend console open to see verification/reset links
- All pages except auth pages require login
- Admin routes require `is_admin: true` in user document
- Tokens are stored in localStorage
- Auth state persists across page refreshes

