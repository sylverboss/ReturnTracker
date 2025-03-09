import { useCallback, useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Asset } from 'expo-asset';
import { Image, Linking, View } from 'react-native';
import { IconProvider } from '../components/IconProvider';
import CustomSplashScreen from '../components/SplashScreen';
import { AuthProvider } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { createLogger } from '../lib/logging';
import { handleAuthLink } from './middleware/auth-link-handler';
import DeepLinkDebugTool from '../components/DeepLinkDebugTool';
import LoggingDebugTool from '../components/LoggingDebugTool';

// Initialize logger
const logger = createLogger('RootLayout');

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Preload assets function
const preloadAssets = async () => {
  // Preload images if needed
  const imageAssets = [
    require('../assets/images/icon.png'),
    require('../assets/images/favicon.png'),
  ];
  
  const loadImages = imageAssets.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
  
  await Promise.all(loadImages);
};

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

// Main layout component
function MainLayout() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // Handle deep links for authentication
  useEffect(() => {
    // Define the URL handler function
    const handleURL = async (event: { url: string }) => {
      const url = event.url;
      logger.info('Received deep link URL:', url);
      
      try {
        // Use the flexible auth link handler
        const wasHandled = await handleAuthLink(url);
        
        if (!wasHandled) {
          // If the URL wasn't handled as an auth link, you can handle other deep links here
          logger.info('URL not handled as auth link, checking for other deep link types');
          
          // Example: Handle other types of deep links
          if (url.includes('product/')) {
            const productId = url.split('product/')[1]?.split(/[?#]/)[0];
            if (productId) {
              router.push(`/product/${productId}`);
            }
          }
        }
      } catch (error) {
        logger.error('Error processing URL:', error);
      }
    };

    // Add event listener for deep links
    const subscription = Linking.addEventListener('url', handleURL);

    // Check for initial URL (app opened via deep link)
    Linking.getInitialURL().then((url) => {
      if (url) {
        logger.info('App opened with URL:', url);
        handleURL({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, [router]);

  // Protected route logic
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === 'onboarding';
    const inProfileCompletion = segments[0] === 'profile-completion';

    if (!user && !inAuthGroup && segments[0] !== undefined) {
      // If no user and not in auth group, redirect to login
      router.replace('/(auth)/login');
    } else if (user && !user.name && !user.displayName && !inProfileCompletion && !inAuthGroup) {
      // If user needs to complete profile
      logger.info("User needs to complete profile");
      router.replace('/profile-completion');
    } else if (user && !user.onboardingCompleted && !inOnboardingGroup && !inProfileCompletion && !inAuthGroup) {
      // If user has profile but needs to complete onboarding
      logger.info("User needs to complete onboarding");
      router.replace('/onboarding');
    } else if (user && user.onboardingCompleted && inAuthGroup) {
      // If user is fully authenticated and in auth group, redirect to main app
      logger.info("User is fully authenticated, redirecting to main app");
      router.replace('/(tabs)');
    }
  }, [user, segments, isLoading, router]);

  return (
    <IconProvider>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="profile-completion" options={{ animation: 'slide_from_right', gestureEnabled: false }} />
            <Stack.Screen name="onboarding" options={{ animation: 'slide_from_right', gestureEnabled: false }} />
            <Stack.Screen name="add-return" options={{ presentation: 'modal' }} />
            <Stack.Screen name="return-details" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="return-instructions" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="return-processing" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
          
          {/* Add debug tools in development */}
          {process.env.NODE_ENV !== 'production' && (
            <>
              <DeepLinkDebugTool />
              <LoggingDebugTool />
            </>
          )}
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </IconProvider>
  );
}

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [splashAnimationComplete, setSplashAnimationComplete] = useState(false);
  
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
    'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
    'Inter-SemiBold': require('../assets/fonts/Inter-SemiBold.ttf'),
    'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load assets, API calls, etc.
        await preloadAssets();
      } catch (e) {
        console.warn('Error loading assets:', e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onSplashAnimationComplete = useCallback(() => {
    setSplashAnimationComplete(true);
  }, []);

  useEffect(() => {
    if ((fontsLoaded || fontError) && appIsReady && splashAnimationComplete) {
      // Hide the native splash screen
      SplashScreen.hideAsync();
      window.frameworkReady?.();
    }
  }, [fontsLoaded, fontError, appIsReady, splashAnimationComplete]);

  // If the app is not ready or fonts are still loading, show our custom splash screen
  if (!appIsReady || (!fontsLoaded && !fontError) || !splashAnimationComplete) {
    // Hide the native splash screen once our assets are ready
    if (appIsReady && (fontsLoaded || fontError)) {
      SplashScreen.hideAsync();
    }
    
    return <CustomSplashScreen onAnimationComplete={onSplashAnimationComplete} />;
  }

  // If there was an error loading fonts, we can still render the app
  // with system fonts as fallback
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}