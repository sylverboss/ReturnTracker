import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ChevronLeft, Mail, ArrowRight, CircleCheck as CheckCircle, Lock, Eye, EyeOff } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { createLogger } from '../../lib/logging';

// Initialize logger
const logger = createLogger('ForgotPasswordScreen');

export default function ForgotPasswordScreen() {
  const params = useLocalSearchParams();
  const { token, error: errorParam } = params;
  
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // New state for password reset
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  
  const { resetPassword } = useAuth();

  // Check if we have a token in the URL params
  useEffect(() => {
    if (token) {
      logger.info('Password reset token detected');
      setIsResetMode(true);
    }
    
    if (errorParam) {
      setGeneralError(
        errorParam === 'confirmation' 
          ? 'There was an issue confirming your email. Please try again.'
          : 'There was an issue processing your request. Please try again.'
      );
    }
  }, [token, errorParam]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = (confirmPassword: string) => {
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      return false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const getErrorMessage = (error: any) => {
    const message = error?.message || String(error);
    
    if (message.includes('User not found')) {
      return 'No account found with this email.';
    } else if (message.includes('Invalid email')) {
      return 'Invalid email address format.';
    } else if (message.includes('rate limit')) {
      return 'Too many password reset attempts. Please try again later.';
    } else if (message.includes('network')) {
      return 'Network error. Please check your connection.';
    } else if (message.includes('invalid token')) {
      return 'Invalid or expired reset token. Please request a new password reset.';
    }
    
    return message || 'An error occurred. Please try again.';
  };

  const handleSendResetEmail = async () => {
    // Clear any previous errors
    setGeneralError('');
    
    if (!validateEmail(email)) {
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email);
      setIsSuccess(true);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setGeneralError(errorMessage);
      logger.error('Password reset error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    // Clear any previous errors
    setGeneralError('');
    
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (!isPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    setIsLoading(true);
    try {
      logger.info('Resetting password with token');
      
      // Use the token to update the password
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) {
        throw error;
      }
      
      logger.info('Password reset successful');
      setResetSuccess(true);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setGeneralError(errorMessage);
      logger.error('Password reset error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Render password reset form if in reset mode
  if (isResetMode) {
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
            {/* Header */}
            <View style={styles.headerContainer}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => router.replace('/(auth)/login')}
              >
                <ChevronLeft size={24} color="#1F2937" />
              </TouchableOpacity>
              <Animated.Text 
                entering={FadeInDown.delay(100).springify()}
                style={styles.headerTitle}
              >
                Create New Password
              </Animated.Text>
              <View style={{ width: 24 }} />
            </View>

            {!resetSuccess ? (
              <>
                <Animated.Text 
                  entering={FadeInDown.delay(150).springify()}
                  style={styles.subtitle}
                >
                  Enter your new password below
                </Animated.Text>

                {/* General Error Message */}
                {generalError ? (
                  <Animated.View 
                    entering={FadeInDown.delay(160).springify()}
                    style={styles.generalErrorContainer}
                  >
                    <Text style={styles.generalErrorText}>{generalError}</Text>
                  </Animated.View>
                ) : null}

                {/* Form */}
                <Animated.View 
                  entering={FadeInDown.delay(200).springify()}
                  style={styles.formContainer}
                >
                  {/* Password Field */}
                  <View style={[
                    styles.inputContainer,
                    passwordError ? styles.inputContainerError : null
                  ]}>
                    <View style={styles.inputIconContainer}>
                      <Lock size={20} color={passwordError ? "#EF4444" : "#6B7280"} />
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="New Password"
                      value={password}
                      onChangeText={(text) => {
                        setPassword(text);
                        if (passwordError) validatePassword(text);
                        if (confirmPassword) validateConfirmPassword(confirmPassword);
                        if (generalError) setGeneralError('');
                      }}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      returnKeyType="next"
                    />
                    <TouchableOpacity 
                      style={styles.passwordToggle}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff size={20} color="#6B7280" />
                      ) : (
                        <Eye size={20} color="#6B7280" />
                      )}
                    </TouchableOpacity>
                  </View>
                  {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

                  {/* Confirm Password Field */}
                  <View style={[
                    styles.inputContainer,
                    confirmPasswordError ? styles.inputContainerError : null
                  ]}>
                    <View style={styles.inputIconContainer}>
                      <Lock size={20} color={confirmPasswordError ? "#EF4444" : "#6B7280"} />
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChangeText={(text) => {
                        setConfirmPassword(text);
                        if (confirmPasswordError) validateConfirmPassword(text);
                        if (generalError) setGeneralError('');
                      }}
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize="none"
                      returnKeyType="done"
                      onSubmitEditing={handlePasswordReset}
                    />
                    <TouchableOpacity 
                      style={styles.passwordToggle}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} color="#6B7280" />
                      ) : (
                        <Eye size={20} color="#6B7280" />
                      )}
                    </TouchableOpacity>
                  </View>
                  {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
                </Animated.View>

                {/* Reset Button */}
                <Animated.View 
                  entering={FadeInDown.delay(300).springify()}
                  style={styles.buttonContainer}
                >
                  <TouchableOpacity 
                    style={styles.resetButton}
                    onPress={handlePasswordReset}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <>
                        <Text style={styles.resetButtonText}>Update Password</Text>
                        <ArrowRight size={20} color="#FFFFFF" />
                      </>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              </>
            ) : (
              <Animated.View 
                entering={FadeInDown.delay(100).springify()}
                style={styles.successContainer}
              >
                <View style={styles.successIconContainer}>
                  <CheckCircle size={60} color="#22C55E" />
                </View>
                <Text style={styles.successTitle}>Password Updated</Text>
                <Text style={styles.successMessage}>
                  Your password has been successfully updated. You can now log in with your new password.
                </Text>
                <TouchableOpacity 
                  style={styles.backToLoginButton}
                  onPress={() => router.replace('/(auth)/login')}
                >
                  <Text style={styles.backToLoginText}>Back to Login</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // Default view - request password reset email
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
          {/* Header */}
          <View style={styles.headerContainer}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ChevronLeft size={24} color="#1F2937" />
            </TouchableOpacity>
            <Animated.Text 
              entering={FadeInDown.delay(100).springify()}
              style={styles.headerTitle}
            >
              Reset Password
            </Animated.Text>
            <View style={{ width: 24 }} />
          </View>

          {!isSuccess ? (
            <>
              <Animated.Text 
                entering={FadeInDown.delay(150).springify()}
                style={styles.subtitle}
              >
                Enter your email address and we'll send you a link to reset your password
              </Animated.Text>

              {/* General Error Message */}
              {generalError ? (
                <Animated.View 
                  entering={FadeInDown.delay(160).springify()}
                  style={styles.generalErrorContainer}
                >
                  <Text style={styles.generalErrorText}>{generalError}</Text>
                </Animated.View>
              ) : null}

              {/* Form */}
              <Animated.View 
                entering={FadeInDown.delay(200).springify()}
                style={styles.formContainer}
              >
                <View style={[
                  styles.inputContainer,
                  emailError ? styles.inputContainerError : null
                ]}>
                  <View style={styles.inputIconContainer}>
                    <Mail size={20} color={emailError ? "#EF4444" : "#6B7280"} />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (emailError) validateEmail(text);
                      if (generalError) setGeneralError('');
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    returnKeyType="done"
                    onSubmitEditing={handleSendResetEmail}
                  />
                </View>
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
              </Animated.View>

              {/* Reset Button */}
              <Animated.View 
                entering={FadeInDown.delay(300).springify()}
                style={styles.buttonContainer}
              >
                <TouchableOpacity 
                  style={styles.resetButton}
                  onPress={handleSendResetEmail}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <Text style={styles.resetButtonText}>Reset Password</Text>
                      <ArrowRight size={20} color="#FFFFFF" />
                    </>
                  )}
                </TouchableOpacity>
              </Animated.View>
            </>
          ) : (
            <Animated.View 
              entering={FadeInDown.delay(100).springify()}
              style={styles.successContainer}
            >
              <View style={styles.successIconContainer}>
                <CheckCircle size={60} color="#22C55E" />
              </View>
              <Text style={styles.successTitle}>Check Your Email</Text>
              <Text style={styles.successMessage}>
                We've sent a password reset link to {email}
              </Text>
              <TouchableOpacity 
                style={styles.backToLoginButton}
                onPress={() => router.replace('/(auth)/login')}
              >
                <Text style={styles.backToLoginText}>Back to Login</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  generalErrorContainer: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  generalErrorText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#EF4444',
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
    height: 56,
    paddingHorizontal: 16,
  },
  inputContainerError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  inputIconContainer: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  passwordToggle: {
    padding: 8,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#EF4444',
    marginTop: -12,
    marginBottom: 16,
    marginLeft: 4,
  },
  buttonContainer: {
    marginBottom: 30,
  },
  resetButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  resetButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginRight: 8,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  successIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  backToLoginButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  backToLoginText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});