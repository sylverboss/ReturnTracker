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

  // If user is authenticated, redirect to the appropriate screen
  if (user) {
    console.log("User is authenticated, redirecting...");
    
    // Check if user has a name/displayName set - if not, they need to complete their profile
    const needsProfileCompletion = !user.name && !user.displayName;
    
    if (needsProfileCompletion) {
      console.log("User needs to complete profile");
      return <Redirect href="/profile-completion" />;
    } else if (!user.onboardingCompleted) {
      console.log("User needs to complete onboarding");
      return <Redirect href="/onboarding" />;
    } else {
      console.log("User is fully onboarded, going to main app");
      return <Redirect href="/(tabs)" />;
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