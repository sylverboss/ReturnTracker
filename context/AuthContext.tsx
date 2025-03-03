import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, getCurrentUser, getCurrentSession } from '../lib/supabase';
import { Session, User, AuthError } from '@supabase/supabase-js';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { createLogger } from '../lib/logging';
import { makeRedirectUri } from 'expo-auth-session';

// Ensure web browser redirect is handled
WebBrowser.maybeCompleteAuthSession();

// Initialize logger
const logger = createLogger('AuthContext');

// Define user type
interface AppUser {
  id: string;
  email: string | null;
  name: string | null;
  displayName: string | null;
  photoURL?: string | null;
  onboardingCompleted: boolean;
  isPremium: boolean;
  premiumExpiresAt?: string | null;
  preferences?: Record<string, any>;
  language?: string;
  locale?: string;
}

// Define context type
interface AuthContextType {
  user: AppUser | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<AppUser>) => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  // Get environment variables for Google Auth
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '';
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || '';
  const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || '';

  // Google Auth configuration
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    expoClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    scopes: ['profile', 'email'],
    redirectUri: Platform.select({
      web: 'https://orlbgscpjczraksivjrg.supabase.co/auth/v1/callback',
      default: makeRedirectUri({
        scheme: 'com.returntrackr',
        path: 'google-auth'
      }),
    }),
  });

  // Add debug logging
  useEffect(() => {
    console.log('Google Auth Configuration:', {
      clientId: Platform.select({
        android: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
        ios: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
        web: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      }),
      platform: Platform.OS,
    });
  }, []);

  // Handle Google Sign-in response
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      (async () => {
        try {
          setIsLoading(true);
          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: id_token,
          });
          
          if (error) throw error;
          // Session will be handled by the auth state change listener
        } catch (error) {
          console.error('Error signing in with Google:', error);
          setIsLoading(false);
          throw error; // Re-throw to be caught by the calling function
        }
      })();
    } else if (response?.type === 'dismiss') {
      console.log('User cancelled Google sign-in');
      setIsLoading(false);
    } else if (response?.type === 'error') {
      console.error('Google Sign-In Error:', response.error);
      setIsLoading(false);
      throw new Error(`Google sign-in error: ${response.error}`);
    }
  }, [response]);

  // Set up auth state listener
  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // Initial session check
    const checkSession = async () => {
      try {
        const currentSession = await getCurrentSession();
        setSession(currentSession);
        
        if (currentSession) {
          await fetchUserProfile(currentSession.user);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setUser(null);
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event);
        setSession(newSession);
        
        if (newSession) {
          await fetchUserProfile(newSession.user);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  // Fetch user profile from Supabase
const fetchUserProfile = async (authUser: User) => {
  try {
    console.log("Fetching user profile for:", authUser.id);
    
    // Get user profile from profiles table
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();
    
    // Check if the error is just "no rows found" (profile doesn't exist yet)
    if (error) {
      if (error.code === 'PGRST116') {
        // This is expected for new users, set user with minimal data
        // and let profile completion handle the rest
        console.log("No profile found for user, will redirect to profile completion");
        setUser({
          id: authUser.id,
          email: authUser.email || null,
          name: null,
          displayName: null,
          onboardingCompleted: false,
          photoURL: null,
          isPremium: false,
          language: 'en',
          locale: 'en-US',
          preferences: {}
        });
      } else {
        // This is an unexpected error
        console.error("Error fetching profile:", error);
        throw error;
      }
    } else if (profile) {
      // Profile exists, use it
      console.log("User profile found:", profile);
      setUser({
        id: authUser.id,
        email: authUser.email || null,
        name: profile.name || null,
        displayName: profile.display_name || null,
        onboardingCompleted: profile.onboarding_completed || false,
        photoURL: profile.avatar_url || null,
        isPremium: profile.is_premium || false,
        premiumExpiresAt: profile.premium_expires_at || null,
        preferences: profile.preferences || {},
        language: profile.language || 'en',
        locale: profile.locale || 'en-US'
      });
    }
  } catch (error) {
    console.error("Error in fetchUserProfile:", error);
    setIsLoading(false);
    throw error;
  } finally {
    setIsLoading(false);
  }
};

  // Sign up function
  const signUp = async (email: string, password: string) => {
    logger.info("Signing up user:", email);
    setIsLoading(true);
    try {
      // Create user in Supabase Auth with email confirmation
      logger.debug("Proceeding with signup");
      // Create the redirect URL with query parameters to indicate confirmation
      const redirectUrl = Platform.select({
        web: typeof window !== 'undefined' 
          ? `${window.location.origin}/(auth)/login?confirmed=true&email=${encodeURIComponent(email)}`
          : undefined,
        default: `com.returntrackr://login?confirmed=true&email=${encodeURIComponent(email)}`,
      });
      
      logger.debug("Using email redirect URL:", redirectUrl);
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            profileCompleted: false,
          },
        },
      });

      logger.debug("Sign-up response:", authData ? "Data received" : "No data", 
                 authError ? "Error received" : "No error");
      
      if (authError) {
        logger.error("Supabase auth error:", authError);
        throw authError;
      }

      if (authData?.user?.identities?.length === 0) {
        // This means the user already exists but hasn't confirmed their email
        throw new Error("This email is already registered but not confirmed. Please check your email for the confirmation link or try to sign in.");
      }

      // User created successfully, check if email confirmation is required
      if (authData?.user && !authData.user.email_confirmed_at) {
        logger.info("Sign up successful, email confirmation required");
        // No alert here - will handle UI in the signup component
      } else {
        logger.info("Sign up successful, no email confirmation required");
        // No alert here - will handle UI in the signup component
      }
      
      return authData;
    } catch (error) {
      logger.error("Sign up error:", error);
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    console.log("Signing in user:", email);
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      console.log("Sign in successful");
      // User will be set by the auth state change listener
    } catch (error) {
      console.error("Sign in error:", error);
      setIsLoading(false);
      throw error;
    }
  };

  // Google sign in function
  const signInWithGoogle = async () => {
    if (!request) {
      console.error('Google authentication request not ready');
      throw new Error('Google authentication request not ready');
    }

    try {
      console.log("Initiating Google sign-in");
      const { type, params } = await promptAsync();
      
      if (type === 'success') {
        const { id_token } = params;
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: id_token,
        });
        
        if (error) throw error;
        return data;
      } else if (type === 'dismiss') {
        console.log('User cancelled Google sign-in');
        return null;
      } else {
        throw new Error(`Google sign-in failed: ${type}`);
      }
    } catch (error) {
      console.error('Error initiating Google sign-in:', error);
      throw error;
    }
  };

  // Sign out function
  const signOut = async () => {
    console.log("Signing out user");
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log("Sign out successful");
      // User will be set to null by the auth state change listener
    } catch (error) {
      console.error("Sign out error:", error);
      setIsLoading(false);
      throw error;
    }
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    try {
      console.log("Sending password reset email to:", email);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      console.log("Password reset email sent");
    } catch (error) {
      console.error("Password reset error:", error);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (data: Partial<AppUser>) => {
    if (!user) throw new Error('No user is signed in');
    
    console.log("Updating user profile for:", user.id);
    setIsLoading(true);
    try {
      // Convert from our app's user model to Supabase's profile model
      const profileData: any = {};
      
      if (data.name !== undefined) {
        profileData.name = data.name;
      }
      
      if (data.displayName !== undefined) {
        profileData.display_name = data.displayName;
      }
      
      if (data.photoURL !== undefined) {
        profileData.avatar_url = data.photoURL;
      }
      
      if (data.onboardingCompleted !== undefined) {
        profileData.onboarding_completed = data.onboardingCompleted;
      }
      
      if (data.isPremium !== undefined) {
        profileData.is_premium = data.isPremium;
      }
      
      if (data.premiumExpiresAt !== undefined) {
        profileData.premium_expires_at = data.premiumExpiresAt;
      }
      
      if (data.preferences !== undefined) {
        profileData.preferences = data.preferences;
      }
      
      if (data.language !== undefined) {
        profileData.language = data.language;
      }
      
      if (data.locale !== undefined) {
        profileData.locale = data.locale;
      }
      
      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);
      
      if (error) throw error;
      
      console.log("User profile updated");
      
      // Update local user state
      setUser({ ...user, ...data });
    } catch (error) {
      console.error("Update user profile error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Complete onboarding
  const completeOnboarding = async () => {
    if (!user) throw new Error('No user is signed in');
    
    console.log("Completing onboarding for user:", user.id);
    setIsLoading(true);
    try {
      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', user.id);
      
      if (error) throw error;
      
      console.log("Onboarding completed");
      
      // Update local user state
      setUser({ ...user, onboardingCompleted: true });
    } catch (error) {
      console.error("Complete onboarding error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateUserProfile,
    completeOnboarding
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}