import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Calendar, ArrowUpRight, TrendingUp, DollarSign, Package, Clock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Mock data for analytics
const monthlyData = [
  { month: 'Jan', amount: 120 },
  { month: 'Feb', amount: 80 },
  { month: 'Mar', amount: 200 },
  { month: 'Apr', amount: 150 },
  { month: 'May', amount: 300 },
  { month: 'Jun', amount: 250 },
  { month: 'Jul', amount: 180 },
  { month: 'Aug', amount: 220 },
  { month: 'Sep', amount: 280 },
  { month: 'Oct', amount: 350 },
  { month: 'Nov', amount: 400 },
  { month: 'Dec', amount: 320 },
];

const timeFrames = [
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
  { id: 'year', label: 'Year' },
  { id: 'all', label: 'All Time' },
];

const retailerStats = [
  { retailer: 'Amazon', returns: 12, amount: 520.45, successRate: 95 },
  { retailer: 'Nike', returns: 8, amount: 430.99, successRate: 100 },
  { retailer: 'Apple', returns: 5, amount: 1250.75, successRate: 80 },
  { retailer: "Levi's", returns: 4, amount: 320.50, successRate: 100 },
  { retailer: 'Walmart', returns: 3, amount: 150.25, successRate: 67 },
];

export default function AnalyticsScreen() {
  const [activeTimeFrame, setActiveTimeFrame] = useState('year');
  const maxAmount = Math.max(...monthlyData.map(item => item.amount));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics</Text>
        <TouchableOpacity style={styles.calendarButton}>
          <Calendar size={20} color="#1F2937" />
          <Text style={styles.calendarButtonText}>2025</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Time Frame Selector */}
        <View style={styles.timeFrameContainer}>
          {timeFrames.map((timeFrame, index) => (
            <Animated.View 
              key={timeFrame.id}
              entering={FadeInDown.delay(100 + index * 50).springify()}
            >
              <TouchableOpacity
                style={[
                  styles.timeFrameButton,
                  activeTimeFrame === timeFrame.id && styles.activeTimeFrameButton
                ]}
                onPress={() => setActiveTimeFrame(timeFrame.id)}
              >
                <Text 
                  style={[
                    styles.timeFrameButtonText,
                    activeTimeFrame === timeFrame.id && styles.activeTimeFrameButtonText
                  ]}
                >
                  {timeFrame.label}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Money Saved Card */}
        <Animated.View 
          entering={FadeInDown.delay(300).springify()}
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
                <Text style={styles.moneySavedLabel}>Total Money Saved</Text>
                <View style={styles.moneySavedRow}>
                  <Text style={styles.moneySavedAmount}>$2,672.94</Text>
                  <View style={styles.percentageTag}>
                    <TrendingUp size={12} color="#FFFFFF" />
                    <Text style={styles.percentageText}>+24%</Text>
                  </View>
                </View>
                <Text style={styles.moneySavedSubtext}>from 32 successful returns</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Stats Cards */}
        <View style={styles.statsCardsContainer}>
          <Animated.View 
            entering={FadeInDown.delay(400).springify()}
            style={[styles.statsCard, { backgroundColor: '#EFF6FF' }]}
          >
            <View style={[styles.statsIconContainer, { backgroundColor: '#DBEAFE' }]}>
              <Package size={20} color="#3B82F6" />
            </View>
            <Text style={styles.statsValue}>32</Text>
            <Text style={styles.statsLabel}>Total Returns</Text>
          </Animated.View>
          
          <Animated.View 
            entering={FadeInDown.delay(500).springify()}
            style={[styles.statsCard, { backgroundColor: '#F0FDF4' }]}
          >
            <View style={[styles.statsIconContainer, { backgroundColor: '#DCFCE7' }]}>
              <DollarSign size={20} color="#22C55E" />
            </View>
            <Text style={styles.statsValue}>$83.53</Text>
            <Text style={styles.statsLabel}>Avg. Return Value</Text>
          </Animated.View>
          
          <Animated.View 
            entering={FadeInDown.delay(600).springify()}
            style={[styles.statsCard, { backgroundColor: '#FEF2F2' }]}
          >
            <View style={[styles.statsIconContainer, { backgroundColor: '#FEE2E2' }]}>
              <Clock size={20} color="#EF4444" />
            </View>
            <Text style={styles.statsValue}>88%</Text>
            <Text style={styles.statsLabel}>Success Rate</Text>
          </Animated.View>
        </View>

        {/* Chart Section */}
        <Animated.View 
          entering={FadeInDown.delay(700).springify()}
          style={styles.chartSection}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Monthly Returns</Text>
          </View>
          
          <View style={styles.chartContainer}>
            {monthlyData.map((item, index) => (
              <View key={index} style={styles.chartBarContainer}>
                <View style={styles.chartBarWrapper}>
                  <View 
                    style={[
                      styles.chartBar, 
                      { 
                        height: `${(item.amount / maxAmount) * 100}%`,
                        backgroundColor: item.amount > 300 ? '#3B82F6' : '#94A3B8'
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.chartLabel}>{item.month}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Top Retailers */}
        <Animated.View 
          entering={FadeInDown.delay(800).springify()}
          style={styles.retailersSection}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Retailers</Text>
          </View>
          
          {retailerStats.map((retailer, index) => (
            <View key={index} style={styles.retailerItem}>
              <View style={styles.retailerInfo}>
                <Text style={styles.retailerName}>{retailer.retailer}</Text>
                <Text style={styles.retailerReturns}>{retailer.returns} returns</Text>
              </View>
              <View style={styles.retailerStats}>
                <Text style={styles.retailerAmount}>${retailer.amount.toFixed(2)}</Text>
                <View 
                  style={[
                    styles.successRateBadge, 
                    { backgroundColor: retailer.successRate >= 90 ? '#DCFCE7' : '#FEF3C7' }
                  ]}
                >
                  <Text 
                    style={[
                      styles.successRateText, 
                      { color: retailer.successRate >= 90 ? '#16A34A' : '#D97706' }
                    ]}
                  >
                    {retailer.successRate}%
                  </Text>
                </View>
              </View>
            </View>
          ))}
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
  calendarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  calendarButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    marginLeft: 6,
  },
  timeFrameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  timeFrameButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  activeTimeFrameButton: {
    backgroundColor: '#3B82F6',
  },
  timeFrameButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  activeTimeFrameButtonText: {
    color: '#FFFFFF',
  },
  moneySavedCard: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  moneySavedGradient: {
    borderRadius: 16,
  },
  moneySavedContent: {
    padding: 20,
  },
  moneySavedLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 4,
  },
  moneySavedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  moneySavedAmount: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginRight: 10,
  },
  percentageTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  percentageText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  moneySavedSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.8,
  },
  statsCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statsCard: {
    width: (width - 50) / 3,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  statsIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statsValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  statsLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  chartSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionHeader: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 150,
    marginTop: 10,
  },
  chartBarContainer: {
    flex: 1,
    alignItems: 'center',
  },
  chartBarWrapper: {
    height: 120,
    width: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  chartBar: {
    width: '100%',
    borderRadius: 4,
  },
  chartLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginTop: 6,
  },
  retailersSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  retailerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  retailerInfo: {
    flex: 1,
  },
  retailerName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  retailerReturns: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  retailerStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  retailerAmount: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginRight: 10,
  },
  successRateBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  successRateText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
});