import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import Animated, { FadeInDown, FadeInRight, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Search, Bell, Filter, ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Mock data for returns
const mockReturns = [
  {
    id: '1',
    retailer: 'Nike',
    product: 'Air Max 270',
    orderNumber: '#1234567890',
    price: 129.99,
    daysLeft: 3,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    status: 'pending'
  },
  {
    id: '2',
    retailer: "Levi's",
    product: '501 Jeans',
    orderNumber: '#9876543210',
    price: 89.99,
    daysLeft: 4,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1026&q=80',
    status: 'pending'
  },
  {
    id: '3',
    retailer: 'Amazon',
    product: 'Echo Dot',
    orderNumber: '#AMZN123456',
    price: 49.99,
    daysLeft: 7,
    image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80',
    status: 'pending'
  },
  {
    id: '4',
    retailer: 'Apple',
    product: 'AirPods Pro',
    orderNumber: '#AP987654321',
    price: 249.99,
    daysLeft: 10,
    image: 'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    status: 'in-progress'
  }
];

// Filter tabs
const filterTabs = [
  { id: 'all', label: 'All Returns', count: 6 },
  { id: 'pending', label: 'Pending', count: 3 },
  { id: 'in-progress', label: 'In Progress', count: 2 },
  { id: 'completed', label: 'Completed', count: 1 }
];

export default function HomeScreen() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredReturns, setFilteredReturns] = useState(mockReturns);
  const scrollY = useSharedValue(0);
  const headerHeight = useSharedValue(Platform.OS === 'ios' ? 120 : 100);
  
  // Filter returns based on active filter
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredReturns(mockReturns);
    } else {
      setFilteredReturns(mockReturns.filter(item => item.status === activeFilter));
    }
  }, [activeFilter]);

  // Animated header style
  const headerStyle = useAnimatedStyle(() => {
    return {
      height: headerHeight.value,
      paddingTop: Platform.OS === 'ios' ? 50 : 40,
      opacity: 1,
    };
  });

  // Get urgency color based on days left
  const getUrgencyColor = (daysLeft) => {
    if (daysLeft <= 3) return ['#FF4D4D', '#FF9494'];
    if (daysLeft <= 7) return ['#FFBB0E', '#FFE07D'];
    return ['#4CAF50', '#A5D6A7'];
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Animated Header */}
      <Animated.View style={[styles.header, headerStyle]}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>ReturnTracker</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Search size={24} color="#1F2937" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Bell size={24} color="#1F2937" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* Filter Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.filterContainer}
      >
        {filterTabs.map((tab, index) => (
          <Animated.View 
            key={tab.id}
            entering={FadeInDown.delay(100 + index * 100).springify()}
          >
            <TouchableOpacity
              style={[
                styles.filterTab,
                activeFilter === tab.id && styles.activeFilterTab
              ]}
              onPress={() => setActiveFilter(tab.id)}
            >
              <Text 
                style={[
                  styles.filterTabText,
                  activeFilter === tab.id && styles.activeFilterTabText
                ]}
              >
                {tab.label} ({tab.count})
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>

      {/* Returns List */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredReturns.map((item, index) => (
          <Animated.View 
            key={item.id}
            entering={FadeInRight.delay(200 + index * 100).springify()}
            style={styles.returnCardContainer}
          >
            <Link href={`/return-details?id=${item.id}`} asChild>
              <TouchableOpacity>
                <View style={styles.returnCard}>
                  <View style={styles.returnCardLeft}>
                    <Image 
                      source={{ uri: item.image }} 
                      style={styles.productImage} 
                    />
                  </View>
                  <View style={styles.returnCardContent}>
                    <View style={styles.returnCardHeader}>
                      <Text style={styles.retailerName}>{item.retailer}</Text>
                      <LinearGradient
                        colors={getUrgencyColor(item.daysLeft)}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.daysLeftBadge}
                      >
                        <Text style={styles.daysLeftText}>
                          {item.daysLeft} {item.daysLeft === 1 ? 'day' : 'days'} left
                        </Text>
                      </LinearGradient>
                    </View>
                    <Text style={styles.productName}>{item.product}</Text>
                    <Text style={styles.orderNumber}>{item.orderNumber}</Text>
                    <View style={styles.returnCardFooter}>
                      <Text style={styles.priceText}>${item.price}</Text>
                      <TouchableOpacity style={styles.processButton}>
                        <Text style={styles.processButtonText}>Process Return</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </Link>
          </Animated.View>
        ))}

        {/* Money Saved Card */}
        <Animated.View 
          entering={FadeInDown.delay(600).springify()}
          style={styles.moneySavedCard}
        >
          <LinearGradient
            colors={['#3B82F6', '#2563EB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.moneySavedGradient}
          >
            <View style={styles.moneySavedContent}>
              <View>
                <Text style={styles.moneySavedLabel}>Money Saved This Year</Text>
                <Text style={styles.moneySavedAmount}>$519.96</Text>
                <Text style={styles.moneySavedSubtext}>from 6 successful returns</Text>
              </View>
              <TouchableOpacity style={styles.viewAnalyticsButton}>
                <Text style={styles.viewAnalyticsText}>View Analytics</Text>
                <ArrowRight size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Email Forwarding Reminder */}
        <Animated.View 
          entering={FadeInDown.delay(700).springify()}
          style={styles.emailReminderCard}
        >
          <View style={styles.emailReminderContent}>
            <Text style={styles.emailReminderTitle}>Quick Tip</Text>
            <Text style={styles.emailReminderText}>
              Forward your purchase confirmation emails to{' '}
              <Text style={styles.emailHighlight}>returns@trackr.app</Text> to automatically track returns.
            </Text>
            <Link href="/forward-email" asChild>
              <TouchableOpacity style={styles.learnMoreButton}>
                <Text style={styles.learnMoreText}>Learn More</Text>
                <ArrowRight size={16} color="#3B82F6" />
              </TouchableOpacity>
            </Link>
          </View>
        </Animated.View>

        {/* Bottom padding */}
        <View style={{ height: 100 }} />
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
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    zIndex: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  filterContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: 10,
    minHeight: 36, // Hauteur minimum pour éviter le découpage du texte
    justifyContent: 'center', // Centrer verticalement le texte
    alignItems: 'center', // Centrer horizontalement le texte
  },
  activeFilterTab: {
    backgroundColor: '#3B82F6',
  },
  filterTabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    textAlignVertical: 'center', // S'assurer que le texte est centré verticalement
    includeFontPadding: false, // Éviter le padding automatique de la police
  },
  activeFilterTabText: {
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  returnCardContainer: {
    marginBottom: 15,
  },
  returnCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  returnCardLeft: {
    marginRight: 15,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  returnCardContent: {
    flex: 1,
  },
  returnCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  retailerName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  daysLeftBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  daysLeftText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  productName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#4B5563',
    marginBottom: 2,
  },
  orderNumber: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 8,
  },
  returnCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  processButton: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  processButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
  moneySavedCard: {
    marginVertical: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  moneySavedGradient: {
    borderRadius: 16,
  },
  moneySavedContent: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moneySavedLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 4,
  },
  moneySavedAmount: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  moneySavedSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.8,
  },
  viewAnalyticsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewAnalyticsText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    marginRight: 4,
  },
  emailReminderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  emailReminderContent: {
    padding: 20,
  },
  emailReminderTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  emailReminderText: {
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
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  learnMoreText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
    marginRight: 4,
  },
});