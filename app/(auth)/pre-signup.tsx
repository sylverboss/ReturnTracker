import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { ArrowRight, Clock, Package, DollarSign, ChevronLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Onboarding data
const onboardingData = [
  {
    id: '1',
    title: 'Never Miss a Return Deadline',
    description: 'Get timely alerts and countdown timers for all your return windows. No more missed opportunities to get your money back.',
    icon: Clock,
    colors: ['#3B82F6', '#2563EB'],
  },
  {
    id: '2',
    title: 'Store Proofs of Return',
    description: 'Keep all your return receipts, tracking numbers, and confirmation emails in one secure place.',
    icon: Package,
    colors: ['#8B5CF6', '#7C3AED'],
  },
  {
    id: '3',
    title: 'Save Money',
    description: "Track how much you've saved by returning items and visualize your savings over time.",
    icon: DollarSign,
    colors: ['#10B981', '#059669'],
  },
];

export default function PreSignupScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const progressValue = useSharedValue(0);
  
  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleGetStarted();
    }
  };

  const handleGetStarted = () => {
    router.push('/(auth)/signup');
  };

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    if (index !== currentIndex) {
      setCurrentIndex(index);
      progressValue.value = withTiming(index / (onboardingData.length - 1));
    }
  };

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${(progressValue.value * 100)}%`,
    };
  });

  const renderItem = ({ item }: { item: typeof onboardingData[0] }) => {
    const Icon = item.icon;
    
    return (
      <View style={styles.slide}>
        <LinearGradient
          colors={item.colors}
          style={styles.iconBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Icon size={80} color="#FFFFFF" />
        </LinearGradient>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.footer}>
        <View style={styles.footerTopRow}>
          <View style={styles.progressContainer}>
            <View style={styles.progressBackground} />
            <Animated.View style={[styles.progressFill, progressStyle]} />
          </View>
          
          <Animated.View 
            entering={FadeIn.delay(300)}
          >
            <TouchableOpacity 
              style={styles.skipButton}
              onPress={handleGetStarted}
            >
              <Text style={styles.skipText}>Skip to Sign Up</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <TouchableOpacity 
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {currentIndex === onboardingData.length - 1 ? 'Create Account' : 'Next'}
          </Text>
          <ArrowRight size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 10,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    width,
    paddingHorizontal: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBackground: {
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  footerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressContainer: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
    flex: 1,
    marginRight: 16,
  },
  progressBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F3F4F6',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  skipText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
  nextButton: {
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
  nextButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginRight: 8,
  },
});