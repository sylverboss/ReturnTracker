# Authentication System in ReturnTracker

## Overview

ReturnTracker uses Firebase Authentication for user management, providing a secure and scalable authentication system. The implementation includes email/password authentication, Google authentication, user profile management, and a complete authentication flow with sign-up, sign-in, password reset, and onboarding.

## Architecture

### Firebase Configuration

The app uses Firebase for authentication and Firestore for storing user data:

- **Authentication**: Email/password and Google authentication
- **User Data Storage**: Firestore database with a `users` collection
- **Persistence**: AsyncStorage for maintaining authentication state across app restarts

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

### Firebase Auth User

- `uid`: Unique identifier
- `email`: User's email address
- `displayName`: User's display name
- `photoURL`: URL to user's profile picture (optional)

### Extended User Profile in Firestore

- All Firebase Auth user properties
- `onboardingCompleted`: Boolean indicating if user has completed onboarding
- `createdAt`: Timestamp of account creation
- Additional user preferences and settings as needed

## Authentication Flow

1. **App Initialization**:
   - Check for existing authentication session
   - If authenticated, fetch additional user data from Firestore
   - Redirect to appropriate screen based on authentication and onboarding status

2. **Sign Up Flow**:
   - User clicks "Sign Up" on the login screen
   - User is shown a feature carousel highlighting app benefits
   - User can either continue through the carousel or skip directly to the sign-up form
   - User can choose to sign up with Google or email/password
   - For email/password: Collect user information (name, email, password)
   - For Google: Authenticate with Google and retrieve user information
   - Create Firestore user document
   - Redirect to post-registration onboarding

3. **Sign In**:
   - User can choose to sign in with Google or email/password
   - For email/password: Authenticate with email and password
   - For Google: Authenticate with Google OAuth
   - Fetch user profile from Firestore
   - Redirect to main app or onboarding based on onboarding status

4. **Password Reset**:
   - Send password reset email
   - Display confirmation screen
   - Provide link back to login

5. **Post-Registration Onboarding**:
   - Display carousel of app features (if not already shown during sign-up)
   - Mark onboarding as completed in Firestore
   - Redirect to main app

6. **Sign Out**:
   - Clear authentication state
   - Redirect to login screen

## Google Authentication

The app uses Expo Auth Session for Google authentication:

```typescript
const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
  clientId: Platform.OS === 'web' 
    ? 'web-client-id.apps.googleusercontent.com'
    : 'native-client-id.apps.googleusercontent.com',
  androidClientId: 'android-client-id.apps.googleusercontent.com',
  iosClientId: 'ios-client-id.apps.googleusercontent.com',
});
```

The authentication flow for Google sign-in:

1. User taps "Continue with Google" button
2. `promptAsync()` is called to initiate the Google authentication flow
3. User is redirected to Google's authentication page
4. After successful authentication, the response is handled in a useEffect hook
5. The ID token from Google is used to create a Firebase credential
6. User is signed in to Firebase using the credential
7. User data is stored in Firestore (if it's a new user)

## Security Rules

Firestore security rules ensure that users can only access their own data:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, update: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow delete: if false;
    }
  }
}
```

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

2. **User Experience**:
   - Provide clear feedback for all user actions
   - Implement loading states for asynchronous operations
   - Offer password visibility toggle for better usability
   - Show app benefits before asking for sign-up information
   - Provide multiple authentication options (email/password and Google)

3. **Performance**:
   - Minimize authentication state changes
   - Cache user data appropriately
   - Implement efficient Firestore queries

4. **Maintenance**:
   - Keep Firebase SDKs updated
   - Monitor authentication failures
   - Implement analytics to track user engagement

## Future Enhancements

1. **Additional Social Authentication**: Add Apple and Facebook login options
2. **Multi-factor Authentication**: Implement 2FA for enhanced security
3. **Email Verification**: Require email verification before full access
4. **Account Deletion**: Allow users to delete their accounts
5. **Session Management**: Allow users to view and manage active sessions