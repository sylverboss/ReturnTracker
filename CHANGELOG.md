# Changelog

## [2.0.0] - 2025-01-28

### Changed
- Migrated from Firebase to Supabase for authentication and data storage
- Implemented Supabase authentication with email/password and Google sign-in
- Created Supabase profiles table with migration script
- Updated all authentication-related components to use Supabase
- Improved error handling for Supabase authentication

### Added
- Added Supabase client configuration with secure storage
- Added helper functions for Supabase authentication
- Created database migration for profiles table
- Added row-level security policies for user data

### Removed
- Removed all Firebase dependencies and configuration
- Removed Firebase-specific error handling

## [1.1.1] - 2025-01-28

### Fixed
- Fixed invalid style property in signup screen where borderColor had an incorrect value
- Corrected the googleButton style in the signup screen to use proper CSS syntax

## [1.1.0] - 2025-01-28

### Fixed
- Fixed authentication flow issue where login was not redirecting to dashboard
- Added proper navigation after successful authentication
- Enhanced logging throughout authentication process for better debugging
- Added loading indicator in the root index.tsx to show loading state during authentication
- Fixed useEffect dependency in login and signup screens to properly handle navigation after authentication

### Changed
- Improved error handling and logging in AuthContext
- Enhanced user experience with better loading states during authentication
- Updated login and signup screens to use useEffect for navigation after authentication

## [1.0.9] - 2025-01-28

### Added
- Enhanced Firebase authentication with comprehensive error handling
- Added detailed error messages for all authentication operations
- Implemented visual feedback for form validation
- Added FirebaseError type checking for better error handling
- Created comprehensive documentation for Firebase authentication

### Changed
- Improved login form with better error handling and validation
- Enhanced signup form with real-time validation feedback
- Updated password reset flow with better error messages
- Improved Google authentication integration
- Enhanced UI feedback during authentication operations

### Fixed
- Fixed error handling in authentication forms
- Improved form validation with real-time feedback
- Enhanced error messages for better user experience
- Fixed password confirmation validation
- Improved error state management in forms

## [1.0.8] - 2025-01-28

### Added
- Updated Google authentication configuration with actual client ID
- Added proper Expo authentication configuration for Google Sign-In
- Set app scheme to "com.returntrackr" for deep linking and authentication

### Changed
- Simplified Google authentication configuration by using Expo's authentication system
- Removed unnecessary redirect URI configurations
- Removed client secret from client-side code for security
- Updated app.json scheme for proper deep linking

### Fixed
- Fixed Google authentication by using proper Expo configuration
- Improved security by removing client secret from client-side code

## [1.0.7] - 2025-01-30

### Added
- Integrated actual Google OAuth client ID for authentication
- Added proper error handling for Google Sign-In process
- Added detailed logging for authentication errors
- Added redirect URI configuration for different platforms
- Added scopes configuration for Google authentication

### Changed
- Updated Google authentication configuration with real credentials
- Improved error handling in the Google Sign-In flow
- Enhanced logging for authentication-related issues
- Updated documentation with Google authentication setup guide

### Fixed
- Fixed "Error 400: invalid_request" during Google authentication
- Fixed redirect URI configuration for Expo authentication
- Improved error reporting for authentication failures

## [1.0.6] - 2025-01-29

### Added
- Added Google authentication for both sign-up and sign-in flows
- Implemented "Continue with Google" buttons on login and signup screens
- Added necessary Expo Auth Session packages for Google authentication

### Changed
- Improved positioning of the skip button in onboarding screens
- Moved skip button next to progress indicator for better visibility
- Enhanced UI of authentication screens with clearer visual hierarchy
- Updated button styles to include icons for better visual cues

## [1.0.5] - 2025-01-28

### Added
- Added pre-signup onboarding carousel to showcase app features before sign up
- Implemented "Skip to Sign Up" option in the pre-signup flow

### Changed
- Modified authentication flow to show onboarding carousel right after selecting sign up
- Updated navigation links to include the new pre-signup screen

## [1.0.4] - 2025-01-28

### Fixed
- Fixed image loading issues in onboarding screens
- Replaced static image imports with dynamic icon components
- Removed references to non-existent image files
- Updated asset preloading to only include available assets

## [1.0.3] - 2025-01-28

### Added
- Implemented Firebase authentication system with email/password login
- Created user signup flow with form validation
- Added password reset functionality
- Implemented user profile storage in Firestore
- Created beautiful onboarding carousel with 3 screens
- Added authentication context for global auth state management

### Changed
- Updated app navigation flow to handle authentication state
- Improved form validation with inline error messages
- Enhanced user experience with animated transitions between auth screens

### Fixed
- Fixed authentication state persistence across app restarts
- Improved error handling for authentication operations

## [1.0.2] - 2025-01-27

### Added
- Added custom splash screen with animated logo and text
- Created IconProvider component for optimized icon loading
- Added Asset preloading for improved startup performance

### Changed
- Improved font loading with better error handling and fallbacks
- Enhanced app initialization process with proper asset preloading
- Optimized splash screen transition with smooth animations

### Fixed
- Fixed font loading issues with proper error handling
- Improved app startup performance with optimized resource loading
- Added graceful fallback for font loading failures

## [1.0.1] - 2025-01-26

### Added
- Created placeholder font files to fix font loading issues
- Implemented Return Details screen with comprehensive UI
- Implemented Return Instructions screen with step-by-step guidance
- Added drop-off location finder in Return Instructions screen

### Fixed
- Fixed font loading issues by adding placeholder font files
- Resolved app startup errors related to missing font files

## [1.0.0] - 2025-01-25

### Added
- Initial release of ReturnTracker app
- Implemented tab-based navigation with Home, Returns, Add, Analytics, and Profile tabs
- Created Home screen with return tracking dashboard
- Added Returns screen with filtering capabilities
- Implemented Analytics screen with charts and statistics
- Created Profile screen with user settings
- Added Add Return screen with retailer selection
- Implemented Return Processing screen with animations
- Added Forward Email screen for email-based return detection

## [2.0.1] - 2025-03-01

### Fixed
- Fixed Google authentication configuration to properly handle client IDs across platforms
- Added proper platform-specific client ID handling
- Added debug logging for Google authentication configuration
- Updated app.json with required OAuth configuration

## [2.0.2] - 2025-03-01

### Fixed
- Fixed Google authentication redirect URI configuration
- Added proper scheme handling for OAuth redirects
- Updated Android intent filters for OAuth flow
- Fixed authorization error in Google sign-in flow

## [2.0.3] - 2025-03-01

### Fixed
- Improved handling of Google sign-in dismissal
- Added graceful error handling for cancelled authentication
- Enhanced user feedback during authentication process
- Fixed loading state management for Google sign-in

## [2.0.4] - 2025-03-02

### Fixed
- Fixed database error during user signup with Supabase
- Improved user metadata handling in database trigger function
- Enhanced error handling for user creation process
- Added support for different metadata formats from various authentication providers

## [2.0.5] - 2025-03-03

### Fixed
- Aligned frontend user model with database schema
- Fixed type errors in authentication context
- Updated profile creation and fetching logic to match database structure
- Enhanced user profile update function to handle all profile fields
- Improved error handling in profile management functions

## [2.0.6] - 2025-03-04

### Fixed
- Added missing fields to profiles table (display_name, avatar_url, onboarding_completed)
- Added proper JSON validation for preferences column
- Improved user creation trigger function to handle all required fields
- Updated Google authentication flow to follow Supabase best practices
- Fixed potential issues with profile creation during signup

## [Unreleased]
### Added
- New sign-up flow requesting only email and password.
- Profile completion page for first-time login after email confirmation.
- Created AuthStateListener component to handle navigation after authentication.
- Added email verification handling with user-friendly feedback.
- Implemented proper loading state management during sign-up process.
- Added email confirmation success page with app deep linking.
- Implemented automatic app opening after email verification on mobile.
- Added detailed error logging for authentication issues.

### Changed
- Updated Supabase auth logic to redirect to profile completion page.
- Removed name field from sign-up page.
- Moved navigation logic from supabase.ts to a proper React component.
- Improved user experience with clear feedback after sign-up.
- Enhanced profile completion page with proper React Native components.
- Optimized email verification flow with better user guidance.
- Centralized authentication configuration in supabase.ts.
- Improved error handling with more specific error messages.

### Fixed
- Fixed issue where the app would get stuck on the sign-up screen after successful sign-up.
- Resolved loading spinner not stopping after sign-up completion.
- Added proper navigation after email verification.
- Improved deep linking configuration for better cross-platform experience.
- Fixed "Anonymous sign-ins are disabled" error by properly configuring sign-up options.
- Added email redirect configuration to ensure proper app opening after verification.
- Resolved inconsistencies between authentication providers and redirect URLs.