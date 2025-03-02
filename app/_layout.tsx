import { useCallback, useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Asset } from 'expo-asset';
import { Image, View } from 'react-native';
import { IconProvider } from '../components/IconProvider';
import CustomSplashScreen from '../components/SplashScreen';
import { AuthProvider } from '../context/AuthContext';

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
      <IconProvider>
        <SafeAreaProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="onboarding" options={{ animation: 'slide_from_right', gestureEnabled: false }} />
              <Stack.Screen name="add-return" options={{ presentation: 'modal' }} />
              <Stack.Screen name="return-details" options={{ animation: 'slide_from_right' }} />
              <Stack.Screen name="return-instructions" options={{ animation: 'slide_from_right' }} />
              <Stack.Screen name="return-processing" options={{ animation: 'slide_from_right' }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </IconProvider>
    </AuthProvider>
  );
}