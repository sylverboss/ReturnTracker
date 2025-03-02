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

// Only log in development
if (__DEV__) {
  console.log("Supabase URL:", process.env.EXPO_PUBLIC_SUPABASE_URL);
  console.log("Supabase Key (first few chars):", 
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ? 
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY.substring(0, 5) + '...' : 
    'undefined');
}

// Hardcoded values as fallbacks if env vars aren't working
const FALLBACK_URL = "https://orlbgscpjczraksivjrg.supabase.co";
// Do not put the actual key in production code, this is just for demo/development
const FALLBACK_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ybGJnc2NwamN6cmFrc2l2anJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5NDM5ODcsImV4cCI6MjA1NjUxOTk4N30.ND-G_qY3kFoUiSk2mPmUzjVRTD1z0ZQXzHNZVa2CwSk";

// Create Supabase client
export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL || FALLBACK_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_KEY,
  {
    auth: {
      storage: Platform.OS === 'web' ? localStorage : AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: Platform.OS === 'web',
      flowType: 'pkce',
      debug: false, // Disable debug logs
    },
  }
);

// Helper function to get the current user
export const getCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Helper function to get the current session
export const getCurrentSession = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Error getting current session:', error);
    return null;
  }
};