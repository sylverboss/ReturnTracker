# Supabase Authentication in ReturnTracker

## Overview

ReturnTracker uses Supabase for authentication and user management, providing a secure and scalable authentication system. The implementation includes email/password authentication, Google authentication, user profile management, and a complete authentication flow with sign-up, sign-in, password reset, and onboarding.

## Architecture

### Supabase Configuration

The app uses Supabase for authentication and database storage:

- **Authentication**: Email/password and Google authentication
- **User Data Storage**: Supabase database with a `profiles` table
- **Persistence**: SecureStore (native) or AsyncStorage (web) for maintaining authentication state across app restarts

### Authentication Context

The authentication system is built around a React Context that provides authentication state and methods throughout the app:

```typescript
const AuthContext = createContext<AuthContextType | undefined>(undefined);
```

This context exposes:

- **User state**: Current authenticated user information
- **Loading state**: Indicates if authentication operations are in progress
- **Authentication methods**: Sign up, sign in, sign in with Google, sign out, reset password
- **Profile methods**: Update user profile, complete onboarding

## User Data Model

### Supabase Auth User

- `id`: Unique identifier
- `email`: User's email address
- `user_metadata`: Contains additional user information like full_name and avatar_url

### Extended User Profile in Profiles Table

- `id`: References auth.users(id)
- `display_name`: User's display name
- `avatar_url`: URL to user's profile picture
- `email`: User's email address
- `onboarding_completed`: Boolean indicating if user has completed onboarding
- `created_at`: Timestamp of account creation
- `updated_at`: Timestamp of last profile update

## Authentication Flow

1. **App Initialization**:
   - Check for existing authentication session
   - If authenticated, fetch additional user data from profiles table
   - Redirect to appropriate screen based on authentication and onboarding status

2. **Sign Up Flow**:
   - User clicks "Sign Up" on the login screen
   - User is shown a feature carousel highlighting app benefits
   - User can either continue through the carousel or skip directly to the sign-up form
   - User can choose to sign up with Google or email/password
   - For email/password: Collect user information (name, email, password)
   - For Google: Authenticate with Google and retrieve user information
   - Create profile record in the profiles table
   - Redirect to post-registration onboarding

3. **Sign In**:
   - User can choose to sign in with Google or email/password
   - For email/password: Authenticate with email and password
   - For Google: Authenticate with Google OAuth
   - Fetch user profile from profiles table
   - Redirect to main app or onboarding based on onboarding status

4. **Password Reset**:
   - Send password reset email
   - Display confirmation screen
   - Provide link back to login

5. **Post-Registration Onboarding**:
   - Display carousel of app features (if not already shown during sign-up)
   - Mark onboarding as completed in profiles table
   - Redirect to main app

6. **Sign Out**:
   - Clear authentication state
   - Redirect to login screen

## Google Authentication

The app uses Expo Auth Session for Google authentication:

```typescript
const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
  clientId: Platform.OS === 'web' ? webClientId : undefined,
  iosClientId: iosClientId,
  androidClientId: androidClientId,
  expoClientId: webClientId,
  webClientId: webClientId,
  scopes: ['profile', 'email'],
});
```

The authentication flow for Google sign-in:

1. User taps "Continue with Google" button
2. `promptAsync()` is called to initiate the Google authentication flow
3. User is redirected to Google's authentication page
4. After successful authentication, the response is handled in a useEffect hook
5. The ID token from Google is used to sign in with Supabase
6. User profile is created or updated in the profiles table

## Security

### Row Level Security

Supabase Row Level Security (RLS) ensures that users can only access their own data:

```sql
-- Users can read their own profile
CREATE POLICY "Users can read their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);
```

### Secure Storage

Authentication tokens are stored securely:

- On native platforms: Expo SecureStore
- On web: AsyncStorage

## Form Validation

All authentication forms include client-side validation:

- **Email**: Must be a valid email format
- **Password**: Minimum 6 characters
- **Name**: Cannot be empty
- **Password Confirmation**: Must match password

## UI Components

### Login Screen

- Google sign-in button
- Email and password inputs with validation
- Show/hide password toggle
- "Forgot Password" link
- Sign-in button with loading state
- Link to pre-signup carousel

### Pre-Signup Carousel

- Three screens highlighting key app features
- Progress indicator
- "Skip to Sign Up" option positioned next to progress bar
- Next/Create Account button

### Sign Up Screen

- Google sign-up button
- Name, email, and password inputs with validation
- Password confirmation with validation
- Terms and conditions notice
- Create account button with loading state
- Link to login screen

### Forgot Password Screen

- Email input with validation
- Reset password button with loading state
- Success screen with confirmation message
- Link back to login screen

### Post-Registration Onboarding

- Three screens highlighting key app features (if not shown during sign-up)
- Progress indicator
- Skip option positioned next to progress bar
- Next/Get Started button

## Error Handling

- Form validation errors displayed inline
- Authentication errors displayed as alerts
- Network errors handled with appropriate user feedback

## Best Practices

1. **Security**:
   - Never store sensitive information in client-side storage
   - Implement proper validation on both client and server
   - Use HTTPS for all network requests
   - Use Row Level Security to protect user data

2. **User Experience**:
   - Provide clear feedback for all user actions
   - Implement loading states for asynchronous operations
   - Offer password visibility toggle for better usability
   - Show app benefits before asking for sign-up information
   - Provide multiple authentication options (email/password and Google)

3. **Performance**:
   - Minimize authentication state changes
   - Cache user data appropriately
   - Implement efficient database queries

4. **Maintenance**:
   - Keep Supabase SDKs updated
   - Monitor authentication failures
   - Implement analytics to track user engagement

## Future Enhancements

1. **Additional Social Authentication**: Add Apple login option
2. **Multi-factor Authentication**: Implement 2FA for enhanced security
3. **Email Verification**: Require email verification before full access
4. **Account Deletion**: Allow users to delete their accounts
5. **Session Management**: Allow users to view and manage active sessions