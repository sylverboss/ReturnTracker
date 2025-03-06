import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function ProfileCompletion() {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, completeOnboarding, updateUserProfile } = useAuth(); // Get the current user and functions from context

  const handleProfileCompletion = async () => {
    if (!name) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
  
    setIsLoading(true); // Set loading state to true
    try {
      // First update the user profile in context but don't mark onboarding as completed yet
      await updateUserProfile({
        name: name,
        displayName: name,
        onboardingCompleted: false, // Keep this false so user goes to onboarding next
        bio: bio, // Store bio in dedicated bio field
        isPremium: false,
        language: 'en',
        locale: 'en-US'
      });
  
      // Show success message briefly
      Alert.alert('Profile Complete', 'Now let\'s introduce you to ReturnTrackr!', [
        { 
          text: 'Continue',
          onPress: () => {
            // Redirect to the onboarding flow
            router.replace('/onboarding');
          }
        }
      ]);
    } catch (error) {
      console.error('Error completing profile:', error);
      Alert.alert('Error', error.message || 'Failed to complete profile');
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Complete Your Profile</Text>
        <Text style={styles.subtitle}>Let's get to know you better</Text>
        
        <View style={styles.form}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Your name"
            value={name}
            onChangeText={setName}
          />
          
          <Text style={styles.label}>Bio (Optional)</Text>
          <TextInput
            style={[styles.input, styles.bioInput]}
            placeholder="Tell us about yourself"
            value={bio}
            onChangeText={setBio}
            multiline
          />
          
          <TouchableOpacity 
            style={styles.button}
            onPress={handleProfileCompletion}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Saving...' : 'Complete Profile'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 32,
  },
  form: {
    gap: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#4B5563',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  bioInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
}); 