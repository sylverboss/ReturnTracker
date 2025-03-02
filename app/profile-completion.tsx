import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { supabase } from '../lib/supabase';

export default function ProfileCompletion() {
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleProfileCompletion = async () => {
        if (!name.trim()) {
            Alert.alert("Error", "Please enter your name");
            return;
        }
        
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                data: { 
                    name, 
                    bio, 
                    profileCompleted: true 
                }
            });

            if (error) throw error;
            
            Alert.alert(
                "Profile Updated",
                "Your profile has been successfully updated!",
                [
                    { text: "Continue", onPress: () => router.replace('/(tabs)') }
                ]
            );
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert("Error", "Failed to update profile. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <Animated.View entering={FadeInDown.delay(100).duration(500)}>
                        <Text style={styles.title}>Complete Your Profile</Text>
                        <Text style={styles.subtitle}>Tell us a bit about yourself</Text>
                    </Animated.View>
                    
                    <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.formContainer}>
                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Your name"
                            value={name}
                            onChangeText={setName}
                        />
                        
                        <Text style={styles.label}>Bio</Text>
                        <TextInput
                            style={[styles.input, styles.bioInput]}
                            placeholder="Tell us about yourself"
                            value={bio}
                            onChangeText={setBio}
                            multiline
                            numberOfLines={4}
                        />
                    </Animated.View>
                    
                    <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.buttonContainer}>
                        <TouchableOpacity 
                            style={styles.button}
                            onPress={handleProfileCompletion}
                            disabled={isLoading}
                        >
                            <Text style={styles.buttonText}>
                                {isLoading ? "Updating..." : "Complete Profile"}
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
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
    formContainer: {
        marginBottom: 32,
    },
    label: {
        fontSize: 14,
        fontFamily: 'Inter-Medium',
        color: '#4B5563',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        fontFamily: 'Inter-Regular',
        marginBottom: 20,
    },
    bioInput: {
        height: 120,
        textAlignVertical: 'top',
    },
    buttonContainer: {
        marginTop: 'auto',
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
}); 