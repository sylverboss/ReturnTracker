# Google Authentication Setup Guide for ReturnTracker

## Overview

This document provides instructions for setting up Google Authentication in the ReturnTracker app. Google Authentication allows users to sign in using their Google accounts, providing a convenient and secure authentication option.

## Prerequisites

Before setting up Google Authentication, ensure you have:

1. A Google Cloud Platform account
2. Access to the Google Cloud Console
3. The ReturnTracker app codebase

## Google Cloud Console Setup

### Step 1: Create a Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your Project ID for future reference

### Step 2: Configure OAuth Consent Screen

1. In the Google Cloud Console, navigate to **APIs & Services > OAuth consent screen**
2. Select the appropriate user type (External or Internal)
3. Fill in the required information:
   - App name: ReturnTracker
   - User support email: Your support email
   - Developer contact information: Your contact email
4. Add the following scopes:
   - `./auth/userinfo.email`
   - `./auth/userinfo.profile`
5. Save and continue

### Step 3: Create OAuth Client IDs

1. Navigate to **APIs & Services > Credentials**
2. Click **Create Credentials** and select **OAuth client ID**
3. For Web application:
   - Name: ReturnTracker Web
   - Authorized JavaScript origins: Add your web domain(s) and `https://auth.expo.io`
   - No need to add redirect URIs for Expo managed apps
4. Click **Create** and note the Client ID

## App Configuration

### Step 1: Update app.json

1. Set the app scheme to a unique identifier for your app:
   ```json
   {
     "expo": {
       "scheme": "com.returntrackr"
     }
   }
   ```

### Step 2: Configure AuthContext.tsx

1. Update the Google authentication configuration with your client ID:
   ```typescript
   const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
     clientId: "YOUR_WEB_CLIENT_ID",
     expoClientId: "YOUR_WEB_CLIENT_ID",
     webClientId: "YOUR_WEB_CLIENT_ID",
     scopes: ['profile', 'email'],
   });
   ```

2. IMPORTANT: Never include your client secret in client-side code

### Step 3: Install Required Dependencies

Ensure you have the following dependencies installed:

```bash
npm install expo-auth-session expo-web-browser expo-random
```

## Testing Authentication

### Development Testing

1. Run your app in development mode
2. Test the Google Sign-In button
3. You should be redirected to Google's authentication page
4. After successful authentication, you should be redirected back to your app

### Common Issues and Solutions

#### 1. Redirect URI Mismatch

**Problem**: Google returns an error about redirect URI mismatch

**Solution**: 
- For Expo managed apps, you don't need to manually configure redirect URIs
- Ensure your app scheme is set correctly in app.json
- Make sure you're using the correct client ID

#### 2. Authentication Not Working on Physical Device

**Problem**: Authentication works in Expo Go but not on a physical device

**Solution**:
- Ensure you've configured the app scheme correctly
- Check that you're using the correct client ID
- Verify that the Google Cloud Console project has the correct configuration

#### 3. Authentication Not Working on Web

**Problem**: Authentication works on mobile but not on web

**Solution**:
- Ensure you've added your web domain to the authorized JavaScript origins in the Google Cloud Console
- Verify that you're using the correct web client ID
- Check browser console for any errors

## Security Best Practices

1. **Never store client secrets in client-side code**
   - The client secret should only be used in server-side code

2. **Use appropriate scopes**
   - Only request the scopes you need (profile and email are usually sufficient)

3. **Implement proper token validation**
   - Validate ID tokens on your backend if you're using a custom backend

4. **Set up proper Firebase security rules**
   - Ensure your Firestore security rules protect user data

## Troubleshooting

If you encounter issues with Google authentication:

1. Check the console logs for detailed error messages
2. Verify your Google Cloud Console configuration
3. Ensure your app scheme is set correctly in app.json
4. Confirm you're using the correct client ID
5. Make sure all required dependencies are installed

## Additional Resources

- [Expo Auth Session Documentation](https://docs.expo.dev/versions/latest/sdk/auth-session/)
- [Google Identity Platform Documentation](https://developers.google.com/identity)
- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)