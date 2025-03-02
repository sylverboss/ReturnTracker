import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, CheckCircle } from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown, useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { useEffect, useState } from 'react';

export default function ReturnProcessingScreen() {
  const [isProcessed, setIsProcessed] = useState(false);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    // Simulate processing time
    rotation.value = withRepeat(
      withTiming(360, { duration: 2000, easing: Easing.linear }), 
      -1
    );
    
    // Simulate completion after 3 seconds
    const timer = setTimeout(() => {
      setIsProcessed(true);
      rotation.value = 0;
      scale.value = withTiming(1.2, { duration: 300 }, () => {
        scale.value = withTiming(1, { duration: 300 });
      });
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleViewDetails = () => {
    router.push('/return-details?id=1');
  };

  const circleStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotation.value}deg` },
      ],
    };
  });

  const checkmarkStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
      ],
    };
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Return Processing</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {!isProcessed ? (
          <>
            {/* Processing Animation */}
            <Animated.View 
              style={[styles.processingCircle, circleStyle]}
            >
              <View style={styles.processingInnerCircle} />
            </Animated.View>
            
            <Animated.View 
              entering={FadeIn.delay(200)}
              style={styles.processingTextContainer}
            >
              <Text style={styles.processingTitle}>Processing Your Return</Text>
              <Text style={styles.processingText}>
                We're extracting return information from your purchase details...
              </Text>
            </Animated.View>
          </>
        ) : (
          <>
            {/* Success Animation */}
            <Animated.View style={[styles.successCircle, checkmarkStyle]}>
              <CheckCircle size={60} color="#FFFFFF" />
            </Animated.View>
            
            <Animated.View 
              entering={FadeInDown.delay(200).springify()}
              style={styles.successTextContainer}
            >
              <Text style={styles.successTitle}>Return Successfully Added!</Text>
              <Text style={styles.successText}>
                We've processed your return information
              </Text>
            </Animated.View>
            
            {/* Return Details */}
            <Animated.View 
              entering={FadeInDown.delay(400).springify()}
              style={styles.returnDetailsCard}
            >
              <View style={styles.returnDetailRow}>
                <Text style={styles.returnDetailLabel}>Retailer</Text>
                <Text style={styles.returnDetailValue}>Amazon</Text>
              </View>
              
              <View style={styles.returnDetailRow}>
                <Text style={styles.returnDetailLabel}>Order #</Text>
                <Text style={styles.returnDetailValue}>AMZN123456789</Text>
              </View>
              
              <View style={styles.returnDetailRow}>
                <Text style={styles.returnDetailLabel}>Purchase Date</Text>
                <Text style={styles.returnDetailValue}>Jan 15, 2025</Text>
              </View>
              
              <View style={styles.returnDetailRow}>
                <Text style={styles.returnDetailLabel}>Return Deadline</Text>
                <Text style={styles.returnDetailValue}>Jan 29, 2025</Text>
              </View>
              
              <View style={styles.returnDetailRow}>
                <Text style={styles.returnDetailLabel}>Items Detected</Text>
                <Text style={styles.returnDetailValue}>2 items</Text>
              </View>
            </Animated.View>
            
            {/* Action Buttons */}
            <Animated.View 
              entering={FadeInDown.delay(600).springify()}
              style={styles.actionsContainer}
            >
              <TouchableOpacity 
                style={styles.viewDetailsButton}
                onPress={handleViewDetails}
              >
                <Text style={styles.viewDetailsText}>View Return Details</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.editInfoButton}
                onPress={() => router.push('/add-return')}
              >
                <Text style={styles.editInfoText}>Edit Information</Text>
              </TouchableOpacity>
            </Animated.View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  processingCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#3B82F6',
    borderTopColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  processingInnerCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3B82F6',
  },
  processingTextContainer: {
    alignItems: 'center',
  },
  processingTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  processingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: '80%',
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  successTextContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  successTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  successText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  returnDetailsCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
  },
  returnDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  returnDetailLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  returnDetailValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  actionsContainer: {
    width: '100%',
  },
  viewDetailsButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  viewDetailsText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  editInfoButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  editInfoText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
});