import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Get environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Custom storage implementation for Supabase
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Helper function to get the current user
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error getting current user:', error);
    return null;
  }
  return data.user;
};

// Helper function to get the current session
export const getCurrentSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting current session:', error);
    return null;
  }
  return data.session;
};

// Configure the redirect URL for email confirmations
export const getRedirectUrl = () => {
  if (Platform.OS === 'web') {
    // For web, use the current origin
    return `${window.location.origin}/email-confirmed`;
  } else {
    // For mobile, use the app scheme
    return 'com.returntrackr://email-confirmed';
  }
};

// Log the current configuration for debugging
console.log(`Email confirmation will redirect to: ${getRedirectUrl()}`);

// Export a function to directly sign up users with proper configuration
export const signUpUser = async (email: string, password: string, displayName: string = '') => {
  console.log(`Attempting to sign up user with email: ${email}`);
  console.log(`Using redirect URL: ${getRedirectUrl()}`);
  
  try {
    // Log the exact request we're sending to Supabase
    console.log('Sending signup request with:', {
      email,
      password: password ? '[REDACTED]' : 'MISSING',
      options: {
        emailRedirectTo: getRedirectUrl(),
        data: {
          displayName: displayName || '',
          profileCompleted: false
        }
      }
    });
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: getRedirectUrl(),
        data: {
          displayName: displayName || '',
          profileCompleted: false
        }
      }
    });
    
    if (error) {
      console.error('Supabase signup error details:', error);
      throw error;
    }
    
    console.log('Signup successful, response:', data);
    return { data };
  } catch (error) {
    console.error('Error in signUpUser function:', error);
    throw error;
  }
};