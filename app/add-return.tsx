import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { X, Search, Calendar, ChevronRight } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

// Mock retailers data
const retailers = [
  { id: '1', name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png' },
  { id: '2', name: 'Walmart', logo: 'https://cdn.worldvectorlogo.com/logos/walmart.svg' },
  { id: '3', name: 'Target', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Target_Corporation_logo_%28vector%29.svg/1200px-Target_Corporation_logo_%28vector%29.svg.png' },
  { id: '4', name: 'Nike', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png' },
  { id: '5', name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1667px-Apple_logo_black.svg.png' },
  { id: '6', name: "Levi's", logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Levi%27s_logo.svg/2560px-Levi%27s_logo.svg.png' },
];

export default function AddReturnScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const [orderDate, setOrderDate] = useState('');
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  
  // Filter retailers based on search query
  const filteredRetailers = searchQuery 
    ? retailers.filter(retailer => 
        retailer.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : retailers;

  const handleRetailerSelect = (retailer) => {
    setSelectedRetailer(retailer);
  };

  const handleContinue = () => {
    // Navigate to the return processing screen
    router.push('/return-processing');
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <X size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Return</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Retailer Selection */}
        <Animated.View 
          entering={FadeInUp.delay(100).springify()}
          style={styles.section}
        >
          <Text style={styles.sectionLabel}>Retailer</Text>
          
          {!selectedRetailer ? (
            <>
              <View style={styles.searchContainer}>
                <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search retailer"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              
              <View style={styles.retailerGrid}>
                {filteredRetailers.map((retailer) => (
                  <TouchableOpacity
                    key={retailer.id}
                    style={styles.retailerItem}
                    onPress={() => handleRetailerSelect(retailer)}
                  >
                    <Image 
                      source={{ uri: retailer.logo }} 
                      style={styles.retailerLogo} 
                      resizeMode="contain"
                    />
                    <Text style={styles.retailerName}>{retailer.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          ) : (
            <TouchableOpacity 
              style={styles.selectedRetailer}
              onPress={() => setSelectedRetailer(null)}
            >
              <Image 
                source={{ uri: selectedRetailer.logo }} 
                style={styles.selectedRetailerLogo} 
                resizeMode="contain"
              />
              <Text style={styles.selectedRetailerName}>{selectedRetailer.name}</Text>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Order Details */}
        {selectedRetailer && (
          <>
            <Animated.View 
              entering={FadeInUp.delay(200).springify()}
              style={styles.section}
            >
              <Text style={styles.sectionLabel}>Order Date</Text>
              <TouchableOpacity style={styles.datePickerButton}>
                <TextInput
                  style={styles.input}
                  placeholder="dd/mm/yyyy"
                  value={orderDate}
                  onChangeText={setOrderDate}
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                />
                <Calendar size={20} color="#6B7280" />
              </TouchableOpacity>
            </Animated.View>

            <Animated.View 
              entering={FadeInUp.delay(300).springify()}
              style={styles.section}
            >
              <Text style={styles.sectionLabel}>Product Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter product name"
                value={productName}
                onChangeText={setProductName}
                placeholderTextColor="#9CA3AF"
              />
            </Animated.View>

            <Animated.View 
              entering={FadeInUp.delay(400).springify()}
              style={styles.section}
            >
              <Text style={styles.sectionLabel}>Price</Text>
              <View style={styles.priceInputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.priceInput}
                  placeholder="0.00"
                  value={price}
                  onChangeText={setPrice}
                  placeholderTextColor="#9CA3AF"
                  keyboardType="decimal-pad"
                />
              </View>
            </Animated.View>
          </>
        )}

        {/* Email Forwarding Option */}
        <Animated.View 
          entering={FadeInUp.delay(500).springify()}
          style={styles.emailForwardingCard}
        >
          <Text style={styles.emailForwardingTitle}>Faster Method Available</Text>
          <Text style={styles.emailForwardingText}>
            Forward your purchase confirmation email to{' '}
            <Text style={styles.emailHighlight}>returns@trackr.app</Text> and we'll automatically extract all the details.
          </Text>
          <TouchableOpacity 
            style={styles.forwardEmailButton}
            onPress={() => router.push('/forward-email')}
          >
            <Text style={styles.forwardEmailButtonText}>Forward Email Instead</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* Continue Button */}
      {selectedRetailer && productName && orderDate && price && (
        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}
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
  closeButton: {
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
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#4B5563',
    marginBottom: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  retailerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  retailerItem: {
    width: '30%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  retailerLogo: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  retailerName: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#4B5563',
    textAlign: 'center',
  },
  selectedRetailer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
  },
  selectedRetailerLogo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  selectedRetailerName: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    height: 48,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    height: 48,
  },
  currencySymbol: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginRight: 4,
  },
  priceInput: {
    flex: 1,
    height: 48,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  emailForwardingCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
    marginBottom: 20,
  },
  emailForwardingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  emailForwardingText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  emailHighlight: {
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
  },
  forwardEmailButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  forwardEmailButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
  bottomContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  continueButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});