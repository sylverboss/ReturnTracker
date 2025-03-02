import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { ChevronLeft, Eye, EyeOff, ArrowRight, Mail, Lock, User, LogIn } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [signupComplete, setSignupComplete] = useState(false);
  
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  
  const { signUp, signInWithGoogle, user } = useAuth();

  // Effect to handle successful authentication
  useEffect(() => {
    if (user) {
      console.log("User is authenticated, redirecting...");
      if (user.onboardingCompleted) {
        router.replace('/(tabs)');
      } else {
        router.replace('/onboarding');
      }
    }
  }, [user]);

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

  const getErrorMessage = (error: any) => {
    const message = error?.message || String(error);
    
    if (message.includes('email already in use')) {
      return 'This email is already in use. Please try another email or sign in.';
    } else if (message.includes('Invalid email')) {
      return 'Invalid email address format.';
    } else if (message.includes('weak password')) {
      return 'Password is too weak. Please use a stronger password.';
    } else if (message.includes('network')) {
      return 'Network error. Please check your connection.';
    }
    
    return message || 'An error occurred during sign up.';
  };

  const handleSignUp = async () => {
    // Reset errors
    setEmailError('');
    setPasswordError('');
    setGeneralError('');
    
    // Validate inputs
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (!isEmailValid || !isPasswordValid) {
      return;
    }
    
    setIsLoading(true);
    try {
      console.log(`Attempting to sign up with email: ${email}`);
      
      // Use the signUp function from AuthContext
      const data = await signUp(email, password, '');
      
      console.log("Sign up successful, email verification sent");
      setSignupComplete(true);
      
      // Show confirmation alert
      Alert.alert(
        "Verification Email Sent",
        "Please check your email and click the verification link to complete your registration.",
        [
          { text: "OK", onPress: () => router.replace('/(auth)/login') }
        ]
      );
      
    } catch (error: any) {
      console.error("Detailed signup error:", error);
      
      // More detailed error handling
      if (error.message?.includes("Anonymous sign-ins are disabled")) {
        setGeneralError("Email and password are required for sign up. Please check your inputs.");
      } else if (error.message?.includes("User already registered")) {
        setGeneralError("This email is already registered. Please log in instead.");
      } else if (error.message?.includes("invalid email")) {
        setEmailError("Please enter a valid email address");
      } else if (error.message?.includes("password")) {
        setPasswordError(error.message || "Password doesn't meet requirements");
      } else {
        setGeneralError(error.message || "An error occurred during sign up");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setGeneralError('');
    setIsGoogleLoading(true);
    try {
      console.log("Attempting to sign up with Google");
      await signInWithGoogle();
      console.log("Google sign up initiated, navigation should happen via useEffect");
      // Navigation is handled by the useEffect hook that watches the user state
    } catch (error) {
      console.error("Google signup error:", error);
      const errorMessage = getErrorMessage(error);
      setGeneralError(errorMessage);
      setIsGoogleLoading(false);
    }
  };

  if (signupComplete) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.completionContainer}>
          <Animated.View entering={FadeInDown.delay(100).duration(500)}>
            <Text style={styles.completionTitle}>Check Your Email</Text>
          </Animated.View>
          
          <Animated.View entering={FadeInDown.delay(200).duration(500)}>
            <Text style={styles.completionText}>
              We've sent a verification link to {email}. Please check your inbox and click the link to verify your account.
            </Text>
          </Animated.View>
          
          <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.signupButton}
              onPress={() => router.replace('/(auth)/login')}
            >
              <Text style={styles.signupButtonText}>Return to Login</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

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
              Create Account
            </Animated.Text>
            <View style={{ width: 24 }} />
          </View>

          <Animated.Text 
            entering={FadeInDown.delay(150).springify()}
            style={styles.subtitle}
          >
            Sign up to start tracking your returns and never miss a deadline
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

          {/* Google Sign Up Button */}
          <Animated.View 
            entering={FadeInDown.delay(175).springify()}
            style={styles.googleButtonContainer}
          >
            <TouchableOpacity 
              style={styles.googleButton}
              onPress={handleGoogleSignup}
              disabled={isGoogleLoading}
            >
              {isGoogleLoading ? (
                <ActivityIndicator color="#1F2937" />
              ) : (
                <>
                  <View style={styles.googleIconContainer}>
                    <Text style={styles.googleIcon}>G</Text>
                  </View>
                  <Text style={styles.googleButtonText}>Continue with Google</Text>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* Divider */}
          <Animated.View 
            entering={FadeInDown.delay(185).springify()}
            style={styles.dividerContainer}
          >
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.divider} />
          </Animated.View>

          {/* Signup Form */}
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
                ref={emailRef}
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
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                blurOnSubmit={false}
              />
            </View>
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

            <View style={[
              styles.inputContainer,
              passwordError ? styles.inputContainerError : null
            ]}>
              <View style={styles.inputIconContainer}>
                <Lock size={20} color={passwordError ? "#EF4444" : "#6B7280"} />
              </View>
              <TextInput
                ref={passwordRef}
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) validatePassword(text);
                  if (generalError) setGeneralError('');
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={handleSignUp}
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
          </Animated.View>

          {/* Signup Button */}
          <Animated.View 
            entering={FadeInDown.delay(300).springify()}
            style={styles.buttonContainer}
          >
            <TouchableOpacity 
              style={styles.signupButton}
              onPress={handleSignUp}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <LogIn size={20} color="#FFFFFF" />
                  <Text style={styles.signupButtonText}>Create Account</Text>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* Terms and Conditions */}
          <Animated.Text 
            entering={FadeInDown.delay(350).springify()}
            style={styles.termsText}
          >
            By signing up, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Animated.Text>

          {/* Login Link */}
          <Animated.View 
            entering={FadeInUp.delay(400).springify()}
            style={styles.loginContainer}
          >
            <Text style={styles.loginText}>Already have an account?</Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </Link>
          </Animated.View>
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
    marginBottom: 24,
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
  googleButtonContainer: {
    marginBottom: 20,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  googleIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  googleIcon: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#EA4335',
  },
  googleButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginHorizontal: 10,
  },
  formContainer: {
    marginBottom: 20,
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
    marginBottom: 20,
  },
  signupButton: {
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
  signupButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  termsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  termsLink: {
    color: '#3B82F6',
    fontFamily: 'Inter-Medium',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  loginText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  loginLink: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
  completionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  completionTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  completionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
});