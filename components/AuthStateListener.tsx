import React, { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigationContext } from '../context/NavigationContext';
import { Alert, Platform } from 'react-native';
import { router } from 'expo-router';

export function AuthStateListener() {
  const navigation = useNavigationContext();

  useEffect(() => {
    const subscription = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_IN' && session) {
        const { data: userData } = await supabase.auth.getUser();
        
        if (userData && userData.user) {
          // Check if this is the first sign-in after email verification
          const isFirstLogin = !userData.user.user_metadata.profileCompleted;
          
          // Check if the user just confirmed their email
          const justConfirmed = userData.user.email_confirmed_at && 
            (new Date().getTime() - new Date(userData.user.email_confirmed_at).getTime() < 300000); // Within 5 minutes
          
          if (justConfirmed) {
            // Show confirmation message
            if (Platform.OS !== 'web') {
              Alert.alert(
                "Email Verified",
                "Your email has been successfully verified. Let's complete your profile.",
                [{ text: "Continue", onPress: () => navigation.navigate('ProfileCompletion') }]
              );
            } else {
              // On web, we'll use the email-confirmed page
              router.replace('/email-confirmed');
            }
          } else if (isFirstLogin) {
            console.log("First login after verification, navigating to profile completion");
            navigation.navigate('ProfileCompletion');
          }
        }
      } else if (event === 'USER_UPDATED') {
        console.log("User updated");
      } else if (event === 'PASSWORD_RECOVERY') {
        // Handle password recovery flow
        console.log("Password recovery initiated");
      }
    });

    return () => {
      subscription.data.subscription.unsubscribe();
    };
  }, [navigation]);

  return null; // This component doesn't render anything
} 