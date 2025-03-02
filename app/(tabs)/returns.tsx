import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { Search, Filter, Calendar, ArrowRight } from 'lucide-react-native';
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
    status: 'pending',
    returnDeadline: '2025-01-29',
    purchaseDate: '2025-01-15'
  },
  {
    id: '2',
    retailer: "Levi's",
    product: '501 Jeans',
    orderNumber: '#9876543210',
    price: 89.99,
    daysLeft: 4,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1026&q=80',
    status: 'pending',
    returnDeadline: '2025-01-30',
    purchaseDate: '2025-01-16'
  },
  {
    id: '3',
    retailer: 'Amazon',
    product: 'Echo Dot',
    orderNumber: '#AMZN123456',
    price: 49.99,
    daysLeft: 7,
    image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80',
    status: 'pending',
    returnDeadline: '2025-02-02',
    purchaseDate: '2025-01-19'
  },
  {
    id: '4',
    retailer: 'Apple',
    product: 'AirPods Pro',
    orderNumber: '#AP987654321',
    price: 249.99,
    daysLeft: 10,
    image: 'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    status: 'in-progress',
    returnDeadline: '2025-02-05',
    purchaseDate: '2025-01-22'
  },
  {
    id: '5',
    retailer: 'Samsung',
    product: 'Galaxy Watch',
    orderNumber: '#SM78901234',
    price: 299.99,
    daysLeft: 12,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80',
    status: 'in-progress',
    returnDeadline: '2025-02-07',
    purchaseDate: '2025-01-24'
  },
  {
    id: '6',
    retailer: 'Adidas',
    product: 'Ultraboost 22',
    orderNumber: '#AD45678901',
    price: 179.99,
    daysLeft: 0,
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    status: 'completed',
    returnDeadline: '2025-01-26',
    purchaseDate: '2025-01-12'
  }
];

// Filter tabs
const filterTabs = [
  { id: 'all', label: 'All Returns' },
  { id: 'pending', label: 'Pending' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'completed', label: 'Completed' }
];

export default function ReturnsScreen() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredReturns, setFilteredReturns] = useState(mockReturns);

  // Filter returns based on active filter
  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    
    if (filterId === 'all') {
      setFilteredReturns(mockReturns);
    } else {
      setFilteredReturns(mockReturns.filter(item => item.status === filterId));
    }
  };

  // Get urgency color based on days left
  const getUrgencyColor = (daysLeft) => {
    if (daysLeft <= 3) return ['#FF4D4D', '#FF9494'];
    if (daysLeft <= 7) return ['#FFBB0E', '#FFE07D'];
    return ['#4CAF50', '#A5D6A7'];
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#FFBB0E';
      case 'in-progress':
        return '#3B82F6';
      case 'completed':
        return '#4CAF50';
      default:
        return '#64748B';
    }
  };

  // Format status text
  const formatStatus = (status) => {
    switch (status) {
      case 'in-progress':
        return 'In Progress';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Returns</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Search size={20} color="#1F2937" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Filter size={20} color="#1F2937" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Calendar size={20} color="#1F2937" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.filterTabs}
        >
          {filterTabs.map((tab, index) => (
            <Animated.View 
              key={tab.id}
              entering={FadeInDown.delay(100 + index * 50).springify()}
            >
              <TouchableOpacity
                style={[
                  styles.filterTab,
                  activeFilter === tab.id && styles.activeFilterTab
                ]}
                onPress={() => handleFilterChange(tab.id)}
              >
                <Text 
                  style={[
                    styles.filterTabText,
                    activeFilter === tab.id && styles.activeFilterTabText
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ScrollView>
      </View>

      {/* Returns List */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredReturns.map((item, index) => (
          <Animated.View 
            key={item.id}
            entering={FadeInRight.delay(200 + index * 100).springify()}
          >
            <Link href={`/return-details?id=${item.id}`} asChild>
              <TouchableOpacity style={styles.returnCard}>
                <View style={styles.returnCardHeader}>
                  <View style={styles.returnCardLeft}>
                    <Image 
                      source={{ uri: item.image }} 
                      style={styles.productImage} 
                    />
                  </View>
                  <View style={styles.returnCardInfo}>
                    <View style={styles.returnCardTop}>
                      <Text style={styles.retailerName}>{item.retailer}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
                        <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
                        <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                          {formatStatus(item.status)}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.productName}>{item.product}</Text>
                    <Text style={styles.orderNumber}>{item.orderNumber}</Text>
                  </View>
                </View>
                
                <View style={styles.returnCardFooter}>
                  <View style={styles.returnCardDetails}>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Purchase Date</Text>
                      <Text style={styles.detailValue}>{item.purchaseDate.split('-')[2]}/{item.purchaseDate.split('-')[1]}/{item.purchaseDate.split('-')[0].slice(2)}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Return Deadline</Text>
                      <Text style={styles.detailValue}>{item.returnDeadline.split('-')[2]}/{item.returnDeadline.split('-')[1]}/{item.returnDeadline.split('-')[0].slice(2)}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Refund Amount</Text>
                      <Text style={styles.detailValue}>${item.price}</Text>
                    </View>
                  </View>
                  
                  {item.status !== 'completed' && (
                    <View style={styles.returnCardActions}>
                      {item.daysLeft > 0 ? (
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
                      ) : (
                        <View style={[styles.daysLeftBadge, { backgroundColor: '#E5E7EB' }]}>
                          <Text style={[styles.daysLeftText, { color: '#6B7280' }]}>
                            Expired
                          </Text>
                        </View>
                      )}
                      
                      <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>
                          {item.status === 'pending' ? 'Process Return' : 'View Details'}
                        </Text>
                        <ArrowRight size={16} color="#3B82F6" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </Link>
          </Animated.View>
        ))}

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  headerActions: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  filterTabsContainer: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  filterTabs: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: 10,
  },
  activeFilterTab: {
    backgroundColor: '#3B82F6',
  },
  filterTabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  activeFilterTabText: {
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  returnCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  returnCardHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  returnCardLeft: {
    marginRight: 12,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  returnCardInfo: {
    flex: 1,
  },
  returnCardTop: {
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
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
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
  },
  returnCardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  returnCardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  returnCardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
    marginRight: 4,
  },
});