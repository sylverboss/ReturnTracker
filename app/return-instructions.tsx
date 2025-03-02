import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, Share2, ExternalLink, CircleCheck as CheckCircle, MapPin } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

// Mock data for return instructions
const returnInstructions = {
  retailer: 'Amazon',
  orderNumber: '#AMZN-123456',
  daysLeft: 5,
  steps: [
    {
      id: 1,
      title: 'Print Return Label',
      description: 'Download and print the prepaid return shipping label.',
      completed: false,
    },
    {
      id: 2,
      title: 'Package Item',
      description: 'Place item in original packaging or similar box.',
      completed: false,
    },
    {
      id: 3,
      title: 'Drop Off Package',
      description: 'Take to nearest UPS location within 5 days.',
      completed: false,
    }
  ],
  notes: [
    {
      id: 1,
      text: 'Item must be in original condition with all tags attached',
      type: 'warning'
    },
    {
      id: 2,
      text: 'Keep proof of return until refund is processed',
      type: 'info'
    },
    {
      id: 3,
      text: 'Refund will be processed within 3-5 business days',
      type: 'success'
    }
  ],
  dropOffLocations: [
    {
      id: 1,
      name: 'UPS Store',
      address: '123 Main St, New York, NY 10001',
      distance: '0.5 miles',
      hours: 'Open until 7:00 PM'
    },
    {
      id: 2,
      name: 'UPS Access Point',
      address: '456 Broadway, New York, NY 10012',
      distance: '1.2 miles',
      hours: 'Open until 9:00 PM'
    },
    {
      id: 3,
      name: 'UPS Customer Center',
      address: '789 Park Ave, New York, NY 10021',
      distance: '2.3 miles',
      hours: 'Open until 8:00 PM'
    }
  ]
};

export default function ReturnInstructionsScreen() {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  const handleBack = () => {
    router.back();
  };
  
  const handleShare = () => {
    // In a real app, this would share the return instructions
    alert('Sharing return instructions...');
  };
  
  const toggleStepCompletion = (stepId: number) => {
    if (completedSteps.includes(stepId)) {
      setCompletedSteps(completedSteps.filter(id => id !== stepId));
    } else {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };
  
  const handleFindLocation = () => {
    // In a real app, this would open a map with drop-off locations
    alert('Opening map with drop-off locations...');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Return Instructions</Text>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Share2 size={20} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Retailer Info */}
        <Animated.View 
          entering={FadeInDown.delay(100).springify()}
          style={styles.retailerCard}
        >
          <View style={styles.retailerInfo}>
            <View style={styles.retailerLogo}>
              <Image 
                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png' }} 
                style={styles.logoImage} 
                resizeMode="contain"
              />
            </View>
            <View>
              <Text style={styles.retailerName}>{returnInstructions.retailer}</Text>
              <Text style={styles.orderNumber}>{returnInstructions.orderNumber}</Text>
              <View style={styles.daysLeftTag}>
                <Text style={styles.daysLeftText}>
                  {returnInstructions.daysLeft} days left
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.returnPortalButton}>
            <Text style={styles.returnPortalText}>Return Portal</Text>
            <ExternalLink size={16} color="#3B82F6" />
          </TouchableOpacity>
        </Animated.View>

        {/* Return Steps */}
        <Animated.View 
          entering={FadeInDown.delay(200).springify()}
          style={styles.stepsCard}
        >
          <Text style={styles.sectionTitle}>Return Steps</Text>
          
          {returnInstructions.steps.map((step, index) => (
            <TouchableOpacity 
              key={step.id}
              style={styles.stepItem}
              onPress={() => toggleStepCompletion(step.id)}
            >
              <View style={styles.stepNumberContainer}>
                {completedSteps.includes(step.id) ? (
                  <View style={styles.stepCompleted}>
                    <CheckCircle size={20} color="#FFFFFF" />
                  </View>
                ) : (
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{step.id}</Text>
                  </View>
                )}
                {index < returnInstructions.steps.length - 1 && (
                  <View style={styles.stepConnector} />
                )}
              </View>
              <View style={styles.stepContent}>
                <Text style={[
                  styles.stepTitle,
                  completedSteps.includes(step.id) && styles.stepTitleCompleted
                ]}>
                  {step.title}
                </Text>
                <Text style={styles.stepDescription}>{step.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Important Notes */}
        <Animated.View 
          entering={FadeInDown.delay(300).springify()}
          style={styles.notesCard}
        >
          <Text style={styles.sectionTitle}>Important Notes</Text>
          
          {returnInstructions.notes.map(note => (
            <View 
              key={note.id}
              style={[
                styles.noteItem,
                note.type === 'warning' && styles.noteWarning,
                note.type === 'info' && styles.noteInfo,
                note.type === 'success' && styles.noteSuccess,
              ]}
            >
              <Text style={styles.noteText}>{note.text}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Drop-off Locations */}
        <Animated.View 
          entering={FadeInDown.delay(400).springify()}
          style={styles.locationsCard}
        >
          <View style={styles.locationHeader}>
            <Text style={styles.sectionTitle}>Nearby Drop-off Locations</Text>
            <TouchableOpacity 
              style={styles.findLocationButton}
              onPress={handleFindLocation}
            >
              <MapPin size={16} color="#3B82F6" />
              <Text style={styles.findLocationText}>Find All</Text>
            </TouchableOpacity>
          </View>
          
          {returnInstructions.dropOffLocations.map(location => (
            <View key={location.id} style={styles.locationItem}>
              <View style={styles.locationDetails}>
                <Text style={styles.locationName}>{location.name}</Text>
                <Text style={styles.locationAddress}>{location.address}</Text>
                <View style={styles.locationMeta}>
                  <Text style={styles.locationDistance}>{location.distance}</Text>
                  <Text style={styles.locationHours}>{location.hours}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.directionsButton}>
                <Text style={styles.directionsText}>Directions</Text>
              </TouchableOpacity>
            </View>
          ))}
        </Animated.View>

        {/* Action Button */}
        <Animated.View 
          entering={FadeInDown.delay(500).springify()}
          style={styles.actionContainer}
        >
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/return-details?id=1')}
          >
            <Text style={styles.actionButtonText}>Mark as Returned</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Bottom padding */}
        <View style={{ height: 40 }} />
      </ScrollView>
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
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  retailerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    margin: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  retailerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  retailerLogo: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoImage: {
    width: 40,
    height: 40,
  },
  retailerName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  orderNumber: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  daysLeftTag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  daysLeftText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#D97706',
  },
  returnPortalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  returnPortalText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
    marginRight: 4,
  },
  stepsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepNumberContainer: {
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#4B5563',
  },
  stepCompleted: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepConnector: {
    width: 2,
    height: 30,
    backgroundColor: '#E5E7EB',
    marginVertical: 4,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  stepTitleCompleted: {
    color: '#22C55E',
    textDecorationLine: 'line-through',
  },
  stepDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 18,
  },
  notesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  noteItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  noteWarning: {
    backgroundColor: '#FEF3C7',
  },
  noteInfo: {
    backgroundColor: '#EFF6FF',
  },
  noteSuccess: {
    backgroundColor: '#DCFCE7',
  },
  noteText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  locationsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  findLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  findLocationText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
    marginLeft: 4,
  },
  locationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  locationDetails: {
    flex: 1,
  },
  locationName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  locationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationDistance: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
    marginRight: 8,
  },
  locationHours: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  directionsButton: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  directionsText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
  actionContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});