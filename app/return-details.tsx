import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Share2, MoveVertical as MoreVertical, ArrowRight, MapPin, Package, Calendar, DollarSign } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

// Mock data for return details
const returnDetails = {
  id: '1',
  retailer: 'Nike',
  product: 'Air Max 270',
  orderNumber: '#NKE-8392741',
  price: 129.99,
  daysLeft: 2,
  image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  status: 'pending',
  returnDeadline: '2025-01-29',
  purchaseDate: '2025-01-15',
  returnPolicy: '14 days from purchase date',
  returnMethod: 'In-store or mail',
  returnFee: 'Free',
  returnAddress: '123 Nike Way, Portland, OR 97201',
  returnInstructions: 'Items must be in original condition with all tags attached.',
  returnPortalUrl: 'https://nike.com/returns',
  returnLabel: 'https://example.com/return-label.pdf',
  refundMethod: 'Original payment method',
  refundTimeline: '7-10 business days after return is processed',
  customerService: '1-800-806-6453',
  notes: 'Keep proof of return until refund is processed.'
};

export default function ReturnDetailsScreen() {
  const params = useLocalSearchParams();
  const id = params.id as string;
  
  // In a real app, we would fetch the return details based on the ID
  // For now, we'll use the mock data
  
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleBack = () => {
    router.back();
  };
  
  const handleShare = () => {
    // In a real app, this would share the return details
    alert('Sharing return details...');
  };
  
  const handleViewInstructions = () => {
    router.push('/return-instructions');
  };
  
  // Get urgency color based on days left
  const getUrgencyColor = (daysLeft) => {
    if (daysLeft <= 3) return ['#FF4D4D', '#FF9494'];
    if (daysLeft <= 7) return ['#FFBB0E', '#FFE07D'];
    return ['#4CAF50', '#A5D6A7'];
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Return Details</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
            <Share2 size={20} color="#1F2937" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MoreVertical size={20} color="#1F2937" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Card */}
        <Animated.View 
          entering={FadeInDown.delay(100).springify()}
          style={styles.productCard}
        >
          <View style={styles.productHeader}>
            <View style={styles.retailerContainer}>
              <Text style={styles.retailerName}>{returnDetails.retailer}</Text>
              <Text style={styles.orderNumber}>{returnDetails.orderNumber}</Text>
            </View>
            <LinearGradient
              colors={getUrgencyColor(returnDetails.daysLeft)}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.daysLeftBadge}
            >
              <Text style={styles.daysLeftText}>
                {returnDetails.daysLeft} {returnDetails.daysLeft === 1 ? 'day' : 'days'} left
              </Text>
            </LinearGradient>
          </View>
          
          <View style={styles.productContent}>
            <Image 
              source={{ uri: returnDetails.image }} 
              style={styles.productImage} 
            />
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{returnDetails.product}</Text>
              <Text style={styles.productPrice}>${returnDetails.price}</Text>
              
              <View style={styles.returnPortalContainer}>
                <TouchableOpacity 
                  style={styles.returnPortalButton}
                  onPress={() => {/* Open return portal */}}
                >
                  <Text style={styles.returnPortalText}>Return Portal</Text>
                  <ArrowRight size={16} color="#3B82F6" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Return Details */}
        <Animated.View 
          entering={FadeInDown.delay(200).springify()}
          style={styles.detailsCard}
        >
          <Text style={styles.sectionTitle}>Return Details</Text>
          
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <View style={[styles.detailIconContainer, { backgroundColor: '#EFF6FF' }]}>
                <Calendar size={20} color="#3B82F6" />
              </View>
              <View>
                <Text style={styles.detailLabel}>Purchase Date</Text>
                <Text style={styles.detailValue}>Jan 15, 2025</Text>
              </View>
            </View>
            
            <View style={styles.detailItem}>
              <View style={[styles.detailIconContainer, { backgroundColor: '#FEF3C7' }]}>
                <Calendar size={20} color="#D97706" />
              </View>
              <View>
                <Text style={styles.detailLabel}>Return Deadline</Text>
                <Text style={styles.detailValue}>Jan 29, 2025</Text>
              </View>
            </View>
            
            <View style={styles.detailItem}>
              <View style={[styles.detailIconContainer, { backgroundColor: '#F0FDF4' }]}>
                <DollarSign size={20} color="#22C55E" />
              </View>
              <View>
                <Text style={styles.detailLabel}>Refund Amount</Text>
                <Text style={styles.detailValue}>${returnDetails.price}</Text>
              </View>
            </View>
            
            <View style={styles.detailItem}>
              <View style={[styles.detailIconContainer, { backgroundColor: '#EFF6FF' }]}>
                <Package size={20} color="#3B82F6" />
              </View>
              <View>
                <Text style={styles.detailLabel}>Return Method</Text>
                <Text style={styles.detailValue}>{returnDetails.returnMethod}</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Return Policy */}
        <Animated.View 
          entering={FadeInDown.delay(300).springify()}
          style={styles.policyCard}
        >
          <Text style={styles.sectionTitle}>Return Policy</Text>
          
          <View style={styles.policyItem}>
            <Text style={styles.policyLabel}>Policy Duration</Text>
            <Text style={styles.policyValue}>{returnDetails.returnPolicy}</Text>
          </View>
          
          <View style={styles.policyItem}>
            <Text style={styles.policyLabel}>Return Fee</Text>
            <Text style={styles.policyValue}>{returnDetails.returnFee}</Text>
          </View>
          
          <View style={styles.policyItem}>
            <Text style={styles.policyLabel}>Refund Method</Text>
            <Text style={styles.policyValue}>{returnDetails.refundMethod}</Text>
          </View>
          
          <View style={styles.policyItem}>
            <Text style={styles.policyLabel}>Refund Timeline</Text>
            <Text style={styles.policyValue}>{returnDetails.refundTimeline}</Text>
          </View>
          
          {isExpanded && (
            <>
              <View style={styles.policyItem}>
                <Text style={styles.policyLabel}>Return Address</Text>
                <Text style={styles.policyValue}>{returnDetails.returnAddress}</Text>
              </View>
              
              <View style={styles.policyItem}>
                <Text style={styles.policyLabel}>Customer Service</Text>
                <Text style={styles.policyValue}>{returnDetails.customerService}</Text>
              </View>
              
              <View style={styles.policyItem}>
                <Text style={styles.policyLabel}>Notes</Text>
                <Text style={styles.policyValue}>{returnDetails.notes}</Text>
              </View>
            </>
          )}
          
          <TouchableOpacity 
            style={styles.expandButton}
            onPress={() => setIsExpanded(!isExpanded)}
          >
            <Text style={styles.expandButtonText}>
              {isExpanded ? 'Show Less' : 'Show More'}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View 
          entering={FadeInDown.delay(400).springify()}
          style={styles.actionsContainer}
        >
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleViewInstructions}
          >
            <Text style={styles.primaryButtonText}>View Return Instructions</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => {/* Download return label */}}
          >
            <Text style={styles.secondaryButtonText}>Download Return Label</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.outlineButton}
            onPress={() => {/* Find drop-off locations */}}
          >
            <MapPin size={16} color="#3B82F6" />
            <Text style={styles.outlineButtonText}>Find Drop-off Locations</Text>
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
  headerActions: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    margin: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  retailerContainer: {
    flex: 1,
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
  },
  daysLeftBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  daysLeftText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  productContent: {
    flexDirection: 'row',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  returnPortalContainer: {
    marginTop: 'auto',
  },
  returnPortalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  returnPortalText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
    marginRight: 4,
  },
  detailsCard: {
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
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  policyCard: {
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
  policyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  policyLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    flex: 1,
  },
  policyValue: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    flex: 1,
    textAlign: 'right',
  },
  expandButton: {
    alignSelf: 'center',
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  expandButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
  actionsContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
  },
  outlineButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
  },
  outlineButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
    marginLeft: 8,
  },
});