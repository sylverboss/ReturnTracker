import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SplashScreenProps {
  onAnimationComplete?: () => void;
}

export default function SplashScreen({ onAnimationComplete }: SplashScreenProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  const rotation = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequence of animations
    Animated.sequence([
      // First animate the logo
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5)),
        }),
        Animated.timing(rotation, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.cubic),
        }),
      ]),
      
      // Then animate the text
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      
      // Wait a bit before finishing
      Animated.delay(800),
    ]).start(() => {
      // Call the callback when animation is complete
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    });
  }, [opacity, scale, rotation, textOpacity, onAnimationComplete]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#3B82F6', '#2563EB']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity,
            transform: [{ scale }, { rotate: spin }],
          },
        ]}
      >
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>RT</Text>
        </View>
      </Animated.View>
      
      <Animated.Text
        style={[
          styles.appName,
          {
            opacity: textOpacity,
            transform: [{ translateY: textOpacity.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }) }],
          },
        ]}
      >
        ReturnTracker
      </Animated.Text>
      
      <Animated.Text
        style={[
          styles.tagline,
          {
            opacity: textOpacity.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0, 0, 1],
            }),
          },
        ]}
      >
        Never miss a return deadline
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  logoText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
});