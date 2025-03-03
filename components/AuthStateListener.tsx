import React, { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { router } from 'expo-router';

export function AuthStateListener() {
  useEffect(() => {
    const subscription = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_IN' && session) {
        // Check if this is the first login after email confirmation
        const { data: user } = await supabase.auth.getUser();
        console.log("User signed in:", user);
        
        if (user) {
          try {
            // Check if user has a profile in the profiles table
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('id, onboarding_completed')
              .eq('id', user.user.id)
              .single();
            
            // If error is because no rows were found, it means
            // the profile doesn't exist yet
            if (error && error.code === 'PGRST116') {
              console.log("No profile exists yet, navigating to profile completion");
              router.replace('/profile-completion');
              return;
            }
            
            // If we get here, a profile exists
            console.log("Profile check result:", profile);
            
            if (profile && !profile.onboarding_completed) {
              // Profile exists but onboarding not completed
              console.log("Profile exists but onboarding not completed");
              router.replace('/profile-completion');
            } else if (profile && profile.onboarding_completed) {
              // Profile exists and onboarding completed
              console.log("Profile exists and onboarding completed");
              router.replace('/(tabs)');
            }
          } catch (error) {
            console.error("Error checking profile:", error);
          }
        }
      }
    });

    return () => {
      subscription.data.subscription.unsubscribe();
    };
  }, []);

  return null;
}