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
          // Check if user has a profile in the profiles table
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.user.id)
            .single();
            
          console.log("Profile check result:", profile, error);
          
          if (!profile || error) {
            // No profile exists yet, direct to profile completion
            console.log("Navigating to profile completion");
            router.replace('/profile-completion');
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