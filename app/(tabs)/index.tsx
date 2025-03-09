import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Platform, 
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import Animated, { 
  FadeInDown, 
  FadeInRight, 
  useAnimatedStyle, 
  useSharedValue
} from 'react-native-reanimated';
import { Search, Bell, ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Import types, services and utilities
import { Return, ReturnStatus, ReturnStatistics, FilterTab } from '../../types/returns';
import { getReturnsByStatus, getReturnStatistics } from '../../services/returnService';
import { calculateDaysLeft } from '../../utils/dateUtils';
import { formatPrice, getProductSummary, calculateTotalPrice } from '../../utils/formatUtils';
import { supabase } from '../../lib/supabase';

// Default placeholder image for products
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/70';

export default function HomeScreen() {
  const router = useRouter();
  
  // State variables
  const [returns, setReturns] = useState<Return[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<ReturnStatus | 'all'>('all');
  const [statistics, setStatistics] = useState<ReturnStatistics | null>(null);
  
  // Animated values
  const headerHeight = useSharedValue(Platform.OS === 'ios' ? 120 : 100);
  
  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);
  
  // Fetch data on mount and when filter changes
  useEffect(() => {
    fetchData();
  }, [activeFilter]);
  
  // Check if user is authenticated
  const checkAuth = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace('/(auth)/login');
      }
    } catch (err) {
      console.error('Authentication check failed:', err);
    }
  };
  
  // Fetch all necessary data
  const fetchData = async () => {
    if (isRefreshing) return; // Prevent multiple simultaneous fetches
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch returns based on active filter
      const returnsData = await getReturnsByStatus(activeFilter);
      setReturns(returnsData);
      
      // Fetch statistics only if not already loaded or if refreshing
      if (!statistics || isRefreshing) {
        const statsData = await getReturnStatistics();
        setStatistics(statsData);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  
  // Handle pull-to-refresh
  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchData();
  }, [activeFilter]);
  
  // Retry after error
  const handleRetry = () => {
    fetchData();
  };
  
  // Process return action - navigate to select items to return
  const handleProcessReturn = (returnId: string) => {
    // Route to a page where users can select which items to return from the bundle
    router.push(`/add-return?id=${returnId}`);
  };
  
  // Generate filter tabs based on statistics
  const filterTabs: FilterTab[] = useMemo(() => {
    if (!statistics) {
      return [
        { id: 'all', label: 'All Returns', count: 0 },
        { id: 'pending', label: 'Pending', count: 0 },
        { id: 'in_progress', label: 'In Progress', count: 0 },
        { id: 'completed', label: 'Completed', count: 0 }
      ];
    }
    
    return [
      { id: 'all', label: 'All Returns', count: statistics.totalReturns },
      { id: 'pending', label: 'Pending', count: statistics.pendingReturns },
      { id: 'in_progress', label: 'In Progress', count: statistics.inProgressReturns },
      { id: 'completed', label: 'Completed', count: statistics.completedReturns }
    ];
  }, [statistics]);
  
  // Get urgency color based on days left
  const getUrgencyColor = (daysLeft: number) => {
    if (daysLeft <= 3) return ['#FF4D4D', '#FF9494'];
    if (daysLeft <= 7) return ['#FFBB0E', '#FFE07D'];
    return ['#4CAF50', '#A5D6A7'];
  };
  
  // This function is no longer needed as we're now showing individual product cards
  // Each product card uses its own product_image_url
  
  // Animated header style
  const headerStyle = useAnimatedStyle(() => {
    return {
      height: headerHeight.value,
      paddingTop: Platform.OS === 'ios' ? 50 : 40,
      opacity: 1,
    };
  });
  
  // Loading screen
  if (isLoading && !isRefreshing) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={['top']}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading your returns...</Text>
      </SafeAreaView>
    );
  }
  
  // Error screen
  if (error && !isRefreshing) {
    return (
      <SafeAreaView style={styles.errorContainer} edges={['top']}>
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <Animated.View style={[styles.header, headerStyle]}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>ReturnTrackr</Text>
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
        refreshControl={
          <RefreshControl 
            refreshing={isRefreshing} 
            onRefresh={onRefresh}
            colors={['#3B82F6']}
            tintColor="#3B82F6"
          />
        }
      >
        {returns.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No returns found</Text>
            <Text style={styles.emptyStateText}>
              {activeFilter === 'all' 
                ? "You don't have any returns yet. Add a return to get started." 
                : `You don't have any ${activeFilter.replace('_', ' ')} returns.`}
            </Text>
            <Link href="/add-return" asChild>
              <TouchableOpacity style={styles.addReturnButton}>
                <Text style={styles.addReturnButtonText}>Add Return</Text>
              </TouchableOpacity>
            </Link>
          </View>
        ) : (
          returns.flatMap((item, returnIndex) => {
            const daysLeft = calculateDaysLeft(item.return_deadline);
            const totalPrice = calculateTotalPrice(item.order_items?.products);
            
            // If no products or empty products array, show one card for the whole return
            if (!item.order_items?.products || item.order_items.products.length === 0) {
              const imageUrl = PLACEHOLDER_IMAGE;
              
              return (
                <Animated.View 
                  key={`${item.id}-empty`}
                  entering={FadeInRight.delay(200 + returnIndex * 100).springify()}
                  style={styles.returnCardContainer}
                >
                  <Link href={`/return-details?id=${item.id}`} asChild>
                    <TouchableOpacity>
                      <View style={styles.returnCard}>
                        <View style={styles.returnCardLeft}>
                          <Image 
                            source={{ uri: imageUrl }} 
                            style={styles.productImage}
                            defaultSource={require('../../assets/images/icon.png')}
                          />
                        </View>
                        <View style={styles.returnCardContent}>
                          <View style={styles.returnCardHeader}>
                            <Text style={styles.retailerName}>{item.retailer_name}</Text>
                            {daysLeft > 0 && item.status !== 'completed' && (
                              <LinearGradient
                                colors={getUrgencyColor(daysLeft)}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.daysLeftBadge}
                              >
                                <Text style={styles.daysLeftText}>
                                  {daysLeft} {daysLeft === 1 ? 'day' : 'days'} left
                                </Text>
                              </LinearGradient>
                            )}
                            {item.status === 'completed' && (
                              <View style={styles.completedBadge}>
                                <Text style={styles.completedText}>Completed</Text>
                              </View>
                            )}
                            {daysLeft === 0 && item.status !== 'completed' && (
                              <View style={styles.expiredBadge}>
                                <Text style={styles.expiredText}>Expired</Text>
                              </View>
                            )}
                          </View>
                          <Text style={styles.productItemText}>No product details</Text>
                          {item.order_number && (
                            <Text style={styles.orderNumber}>#{item.order_number}</Text>
                          )}
                          <View style={styles.returnCardFooter}>
                            <Text style={styles.priceText}>{formatPrice(0)}</Text>
                            
                            {/* Show different actions based on status */}
                            {item.status === 'pending' && (
                              <TouchableOpacity 
                                style={styles.processButton}
                                onPress={() => handleProcessReturn(item.id)}
                              >
                                <Text style={styles.processButtonText}>Select Items</Text>
                              </TouchableOpacity>
                            )}
                            
                            {(item.status === 'in_progress' || item.status === 'shipped') && (
                              <TouchableOpacity style={styles.trackButton}>
                                <Text style={styles.trackButtonText}>Track Return</Text>
                              </TouchableOpacity>
                            )}
                            
                            {item.status === 'completed' && (
                              <View style={styles.refundBadge}>
                                <Text style={styles.refundText}>
                                  Refunded: {formatPrice(item.refund_amount)}
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </Link>
                </Animated.View>
              );
            }
            
            // Create a card for each product in the order_items
            return item.order_items.products.map((product, productIndex) => {
              const imageUrl = product.product_image_url || PLACEHOLDER_IMAGE;
              const productPrice = product.price * (product.quantity || 1);
              
              return (
                <Animated.View 
                  key={`${item.id}-${productIndex}`}
                  entering={FadeInRight.delay(200 + (returnIndex * 100) + (productIndex * 50)).springify()}
                  style={styles.returnCardContainer}
                >
                  <Link href={`/return-details?id=${item.id}`} asChild>
                    <TouchableOpacity>
                      <View style={styles.returnCard}>
                        <View style={styles.returnCardLeft}>
                          <Image 
                            source={{ uri: imageUrl }} 
                            style={styles.productImage}
                            defaultSource={require('../../assets/images/icon.png')}
                          />
                        </View>
                        <View style={styles.returnCardContent}>
                          <View style={styles.returnCardHeader}>
                            <Text style={styles.retailerName}>{item.retailer_name}</Text>
                            {daysLeft > 0 && item.status !== 'completed' && (
                              <LinearGradient
                                colors={getUrgencyColor(daysLeft)}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.daysLeftBadge}
                              >
                                <Text style={styles.daysLeftText}>
                                  {daysLeft} {daysLeft === 1 ? 'day' : 'days'} left
                                </Text>
                              </LinearGradient>
                            )}
                            {item.status === 'completed' && (
                              <View style={styles.completedBadge}>
                                <Text style={styles.completedText}>Completed</Text>
                              </View>
                            )}
                            {daysLeft === 0 && item.status !== 'completed' && (
                              <View style={styles.expiredBadge}>
                                <Text style={styles.expiredText}>Expired</Text>
                              </View>
                            )}
                          </View>
                          <View style={styles.productInfoContainer}>
                            <View style={styles.productItemsContainer}>
                              <Text style={styles.productItemText} numberOfLines={1}>
                                {product.product_name || 'Product'} 
                                {product.quantity > 1 ? ` (x${product.quantity})` : ''}
                              </Text>
                            </View>
                          </View>
                          
                          {item.order_number && (
                            <Text style={styles.orderNumber}>#{item.order_number}</Text>
                          )}
                          <View style={styles.returnCardFooter}>
                            <Text style={styles.priceText}>{formatPrice(productPrice)}</Text>
                            
                            {/* Show different actions based on status */}
                            {item.status === 'pending' && (
                              <TouchableOpacity 
                                style={styles.processButton}
                                onPress={() => handleProcessReturn(item.id)}
                              >
                                <Text style={styles.processButtonText}>Select Items</Text>
                              </TouchableOpacity>
                            )}
                            
                            {(item.status === 'in_progress' || item.status === 'shipped') && (
                              <TouchableOpacity style={styles.trackButton}>
                                <Text style={styles.trackButtonText}>Track Return</Text>
                              </TouchableOpacity>
                            )}
                            
                            {item.status === 'completed' && (
                              <View style={styles.refundBadge}>
                                <Text style={styles.refundText}>
                                  Refunded: {formatPrice(item.refund_amount)}
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </Link>
                </Animated.View>
              );
            });
          })
        )}

        {/* Money Saved Card */}
        {statistics && (
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
                  <Text style={styles.moneySavedAmount}>{formatPrice(statistics.totalSaved)}</Text>
                  <Text style={styles.moneySavedSubtext}>
                    from {statistics.completedReturns} successful {statistics.completedReturns === 1 ? 'return' : 'returns'}
                  </Text>
                </View>
                <Link href="/analytics" asChild>
                  <TouchableOpacity style={styles.viewAnalyticsButton}>
                    <Text style={styles.viewAnalyticsText}>View Analytics</Text>
                    <ArrowRight size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </Link>
              </View>
            </LinearGradient>
          </Animated.View>
        )}

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
  // Main container styles
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
    minHeight: 120,
  },
  returnCardLeft: {
    marginRight: 15,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    marginTop: 4,
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
  productInfoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  productItemsContainer: {
    flex: 1,
    marginRight: 8,
  },
  productItemText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#4B5563',
    marginBottom: 3,
  },
  itemCountBadge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  itemCountText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#4B5563',
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
  
  // Loading state styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#4B5563',
  },
  
  // Error state styles
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  
  // Empty state styles
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  addReturnButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addReturnButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  
  // Status badges
  completedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#10B981',
  },
  completedText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  expiredBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#6B7280',
  },
  expiredText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  trackButton: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  trackButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
  refundBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  refundText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
  },
});