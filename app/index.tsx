import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function Index() {
  const { user, isLoading } = useAuth();

  // If loading, show a loading screen
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  // If user is authenticated, redirect to the main app
  if (user) {
    console.log("User is authenticated, redirecting...");
    
    // Check if user has completed onboarding
    if (user.onboardingCompleted) {
      return <Redirect href="/(tabs)" />;
    } else {
      // Redirect to profile completion page instead of onboarding carousel
      return <Redirect href="/profile-completion" />;
    }
  }

  // If user is not authenticated, redirect to auth flow
  return <Redirect href="/(auth)/login" />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
});