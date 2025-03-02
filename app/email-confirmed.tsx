import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { CheckCircle2 } from 'lucide-react-native';
import { supabase } from '../lib/supabase';

export default function EmailConfirmedScreen() {
  const params = useLocalSearchParams();
  const [countdown, setCountdown] = useState(5);
  
  // Get the email from params if available
  const email = params.email as string || '';

  useEffect(() => {
    // Check if we have a session already
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // We have a session, navigate to profile completion
        if (Platform.OS !== 'web') {
          router.replace('/profile-completion');
        } else {
          // On web, show a countdown before redirecting
          const timer = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(timer);
                router.replace('/profile-completion');
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
          
          return () => clearInterval(timer);
        }
      } else {
        // No session, redirect to login
        if (Platform.OS !== 'web') {
          router.replace('/(auth)/login');
        } else {
          // On web, show a countdown before redirecting to login
          const timer = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(timer);
                router.replace('/(auth)/login');
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
          
          return () => clearInterval(timer);
        }
      }
    };
    
    checkSession();
  }, []);

  const handleOpenApp = () => {
    if (Platform.OS === 'web') {
      // On web, we can try to open the app using a deep link
      Linking.openURL('com.returntrackr://login');
    } else {
      // Already in the app, just navigate
      router.replace('/(auth)/login');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <Animated.View 
          entering={FadeInDown.delay(100).duration(500)}
          style={styles.iconContainer}
        >
          <CheckCircle2 size={80} color="#10B981" />
        </Animated.View>
        
        <Animated.Text 
          entering={FadeInDown.delay(200).duration(500)}
          style={styles.title}
        >
          Email Confirmed!
        </Animated.Text>
        
        <Animated.Text 
          entering={FadeInDown.delay(300).duration(500)}
          style={styles.message}
        >
          Your email has been successfully verified. You can now sign in to your account.
          {email ? ` We've verified ${email}.` : ''}
        </Animated.Text>
        
        <Animated.View 
          entering={FadeInDown.delay(400).duration(500)}
          style={styles.buttonContainer}
        >
          <TouchableOpacity 
            style={styles.button}
            onPress={handleOpenApp}
          >
            <Text style={styles.buttonText}>
              {Platform.OS === 'web' ? 'Open App' : 'Continue to Login'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
        
        {Platform.OS === 'web' && (
          <Animated.Text 
            entering={FadeInDown.delay(500).duration(500)}
            style={styles.redirectText}
          >
            Redirecting in {countdown} seconds...
          </Animated.Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  redirectText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
}); 