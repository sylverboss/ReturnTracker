import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, EyeOff, ArrowRight, Mail, Lock, LogIn } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [showConfirmationSuccess, setShowConfirmationSuccess] = useState(false);
  const [confirmedEmail, setConfirmedEmail] = useState('');
  
  const passwordRef = useRef<TextInput>(null);
  const { signIn, signInWithGoogle, user } = useAuth();
  const router = useRouter();

  // Check for confirmed email or URL parameters
 // Check for confirmed email or URL parameters
useEffect(() => {
  const checkEmailConfirmation = async () => {
    try {
      // Check for URL parameters (web)
      if (Platform.OS === 'web') {
        const url = new URL(window.location.href);
        const confirmedParam = url.searchParams.get('confirmed');
        const emailParam = url.searchParams.get('email');
        
        if (confirmedParam === 'true' && emailParam) {
          setShowConfirmationSuccess(true);
          setConfirmedEmail(emailParam);
          setEmail(emailParam);
          
          // Auto-login after confirmation if we have the email
          if (emailParam) {
            // Don't auto-redirect here - let the AuthStateListener handle it
            // after successful login
            return;
          }
        }
      }
      
      // Check if we have email in router params (mobile)
      if (router.params?.confirmed === 'true' && router.params?.email) {
        setShowConfirmationSuccess(true);
        setConfirmedEmail(router.params.email as string);
        setEmail(router.params.email as string);
        return;
      }
      
      // Check if the current session is newly confirmed
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email_confirmed_at) {
        // If email was confirmed recently (within the last minute)
        const confirmedAt = new Date(session.user.email_confirmed_at);
        const now = new Date();
        const diffInSeconds = (now.getTime() - confirmedAt.getTime()) / 1000;
        
        if (diffInSeconds < 60) {
          setShowConfirmationSuccess(true);
          setConfirmedEmail(session.user.email || '');
          setEmail(session.user.email || '');
        }
      }
    } catch (error) {
      console.error("Error checking email confirmation:", error);
    }
  };
  
  checkEmailConfirmation();
}, []);
  
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
    
    if (message.includes('Invalid login credentials')) {
      return 'Invalid email or password.';
    } else if (message.includes('Invalid email')) {
      return 'Invalid email address format.';
    } else if (message.includes('User not found')) {
      return 'No account found with this email.';
    } else if (message.includes('rate limit')) {
      return 'Too many failed login attempts. Please try again later.';
    } else if (message.includes('network')) {
      return 'Network error. Please check your connection.';
    }
    
    return message || 'An error occurred during login.';
  };

  const handleLogin = async () => {
    // Clear any previous errors
    setGeneralError('');
    
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
  
    if (!isEmailValid || !isPasswordValid) {
      return;
    }
  
    setIsLoading(true);
    try {
      console.log("Attempting to sign in with email and password");
      await signIn(email, password);
      console.log("Sign in successful, navigation should happen via useEffect");
      // Navigation is handled by the useEffect hook that watches the user state
    } catch (error) {
      console.error("Login error:", error);
      
      // Special handling for the profile error we're seeing
      if (error.code === 'PGRST116') {
        // This means authentication succeeded but profile fetch failed
        // This is actually expected for new users
        console.log("User authenticated but no profile - this is normal for new users");
        // AuthStateListener will handle the redirect, so we can just return
        return;
      }
      
      const errorMessage = getErrorMessage(error);
      setGeneralError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGeneralError('');
    setIsGoogleLoading(true);
    try {
      console.log("Attempting to sign in with Google");
      const result = await signInWithGoogle();
      
      if (!result) {
        // User cancelled the sign-in
        console.log("Google sign-in was cancelled by user");
        setIsGoogleLoading(false);
        return;
      }
      
      console.log("Google sign in initiated, navigation should happen via useEffect");
      // Navigation is handled by the useEffect hook that watches the user state
    } catch (error) {
      console.error("Google login error:", error);
      const errorMessage = getErrorMessage(error);
      setGeneralError(errorMessage);
      setIsGoogleLoading(false);
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
          {/* Header */}
          <Animated.View 
            entering={FadeInDown.delay(100).springify()}
            style={styles.header}
          >
            <LinearGradient
              colors={['#3B82F6', '#2563EB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoBackground}
            >
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>RT</Text>
              </View>
            </LinearGradient>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue tracking your returns</Text>
          </Animated.View>

          {/* Confirmation Success Message */}
          {showConfirmationSuccess ? (
            <Animated.View 
              entering={FadeInDown.delay(125).springify()}
              style={styles.confirmationContainer}
            >
              <View style={styles.confirmationIconContainer}>
                <Text style={styles.confirmationIcon}>✓</Text>
              </View>
              <Text style={styles.confirmationTitle}>Email Confirmed!</Text>
              <Text style={styles.confirmationText}>
                Your account for <Text style={styles.confirmationEmail}>{confirmedEmail}</Text> has been successfully verified. Please sign in to continue.
              </Text>
            </Animated.View>
          ) : null}

          {/* General Error Message */}
          {generalError && !showConfirmationSuccess ? (
            <Animated.View 
              entering={FadeInDown.delay(125).springify()}
              style={styles.generalErrorContainer}
            >
              <Text style={styles.generalErrorText}>{generalError}</Text>
            </Animated.View>
          ) : null}

          {/* Google Sign In Button */}
          <Animated.View 
            entering={FadeInDown.delay(150).springify()}
            style={styles.googleButtonContainer}
          >
            <TouchableOpacity 
              style={styles.googleButton}
              onPress={handleGoogleLogin}
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
            entering={FadeInDown.delay(175).springify()}
            style={styles.dividerContainer}
          >
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.divider} />
          </Animated.View>

          {/* Login Form */}
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
                onSubmitEditing={handleLogin}
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

            <Link href="/(auth)/forgot-password" asChild>
              <TouchableOpacity style={styles.forgotPasswordButton}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </Link>
          </Animated.View>

          {/* Login Button */}
          <Animated.View 
            entering={FadeInDown.delay(300).springify()}
            style={styles.buttonContainer}
          >
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <LogIn size={20} color="#FFFFFF" />
                  <Text style={styles.loginButtonText}>Sign In with Email</Text>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* Sign Up Link */}
          <Animated.View 
            entering={FadeInUp.delay(400).springify()}
            style={styles.signupContainer}
          >
            <Text style={styles.signupText}>Don't have an account?</Text>
            <Link href="/(auth)/pre-signup" asChild>
              <TouchableOpacity>
                <Text style={styles.signupLink}>Sign Up</Text>
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
  confirmationContainer: {
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#D1FAE5',
    alignItems: 'center',
  },
  confirmationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  confirmationIcon: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  confirmationTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#065F46',
    marginBottom: 8,
    textAlign: 'center',
  },
  confirmationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#065F46',
    textAlign: 'center',
    lineHeight: 20,
  },
  confirmationEmail: {
    fontFamily: 'Inter-SemiBold',
    color: '#047857',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  logoBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: '80%',
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
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
  buttonContainer: {
    marginBottom: 30,
  },
  loginButton: {
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
  loginButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingVertical: 20,
  },
  signupText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginRight: 4,
  },
  signupLink: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
  },
});