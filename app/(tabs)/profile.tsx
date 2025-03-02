import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Settings, Bell, CreditCard, CircleHelp as HelpCircle, LogOut, ChevronRight, Mail } from 'lucide-react-native';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  const { user, signOut } = useAuth();
  
  const handleSignOut = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Sign Out",
          onPress: async () => {
            try {
              await signOut();
              // Navigation will be handled by the index.tsx redirect
            } catch (error) {
              Alert.alert("Error", "Failed to sign out. Please try again.");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Settings size={20} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <Animated.View 
          entering={FadeInDown.delay(100).springify()}
          style={styles.profileCard}
        >
          <View style={styles.profileInfo}>
            <Image 
              source={{ uri: user?.photoURL || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80' }} 
              style={styles.profileImage} 
            />
            <View style={styles.profileDetails}>
              <Text style={styles.profileName}>{user?.displayName || 'User'}</Text>
              <Text style={styles.profileEmail}>{user?.email || 'user@example.com'}</Text>
              <TouchableOpacity style={styles.editProfileButton}>
                <Text style={styles.editProfileText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Subscription Card */}
        <Animated.View 
          entering={FadeInDown.delay(200).springify()}
          style={styles.subscriptionCard}
        >
          <View style={styles.subscriptionHeader}>
            <Text style={styles.subscriptionTitle}>Premium Subscription</Text>
            <View style={styles.subscriptionBadge}>
              <Text style={styles.subscriptionBadgeText}>Active</Text>
            </View>
          </View>
          <Text style={styles.subscriptionDetails}>Your subscription renews on Jan 15, 2026</Text>
          <TouchableOpacity style={styles.manageSubscriptionButton}>
            <Text style={styles.manageSubscriptionText}>Manage Subscription</Text>
            <ChevronRight size={16} color="#3B82F6" />
          </TouchableOpacity>
        </Animated.View>

        {/* Settings Sections */}
        <Animated.View 
          entering={FadeInDown.delay(300).springify()}
          style={styles.settingsSection}
        >
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <View style={[styles.settingIconContainer, { backgroundColor: '#EFF6FF' }]}>
                <Bell size={20} color="#3B82F6" />
              </View>
              <View>
                <Text style={styles.settingLabel}>Push Notifications</Text>
                <Text style={styles.settingDescription}>Receive return deadline reminders</Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#E5E7EB', true: '#BFDBFE' }}
              thumbColor={notificationsEnabled ? '#3B82F6' : '#9CA3AF'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <View style={[styles.settingIconContainer, { backgroundColor: '#EFF6FF' }]}>
                <Mail size={20} color="#3B82F6" />
              </View>
              <View>
                <Text style={styles.settingLabel}>Email Notifications</Text>
                <Text style={styles.settingDescription}>Receive email updates and reminders</Text>
              </View>
            </View>
            <Switch
              value={emailNotificationsEnabled}
              onValueChange={setEmailNotificationsEnabled}
              trackColor={{ false: '#E5E7EB', true: '#BFDBFE' }}
              thumbColor={emailNotificationsEnabled ? '#3B82F6' : '#9CA3AF'}
            />
          </View>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(400).springify()}
          style={styles.settingsSection}
        >
          <Text style={styles.sectionTitle}>Payment</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <View style={[styles.settingIconContainer, { backgroundColor: '#F0FDF4' }]}>
                <CreditCard size={20} color="#22C55E" />
              </View>
              <View>
                <Text style={styles.settingLabel}>Payment Methods</Text>
                <Text style={styles.settingDescription}>Manage your payment options</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <View style={[styles.settingIconContainer, { backgroundColor: '#F0FDF4' }]}>
                <CreditCard size={20} color="#22C55E" />
              </View>
              <View>
                <Text style={styles.settingLabel}>Billing History</Text>
                <Text style={styles.settingDescription}>View your past transactions</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(500).springify()}
          style={styles.settingsSection}
        >
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <View style={[styles.settingIconContainer, { backgroundColor: '#FEF3C7' }]}>
                <HelpCircle size={20} color="#D97706" />
              </View>
              <View>
                <Text style={styles.settingLabel}>Help Center</Text>
                <Text style={styles.settingDescription}>Get help with your returns</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <View style={[styles.settingIconContainer, { backgroundColor: '#FEF3C7' }]}>
                <Mail size={20} color="#D97706" />
              </View>
              <View>
                <Text style={styles.settingLabel}>Contact Support</Text>
                <Text style={styles.settingDescription}>Email our support team</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </Animated.View>

        {/* Logout Button */}
        <Animated.View 
          entering={FadeInDown.delay(600).springify()}
          style={styles.logoutContainer}
        >
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleSignOut}
          >
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* App Version */}
        <Text style={styles.versionText}>ReturnTracker v1.0.3</Text>

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
  settingsButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    margin: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 8,
  },
  editProfileButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
  },
  editProfileText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#4B5563',
  },
  subscriptionCard: {
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
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  subscriptionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginRight: 10,
  },
  subscriptionBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  subscriptionBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#16A34A',
  },
  subscriptionDetails: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 12,
  },
  manageSubscriptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  manageSubscriptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
    marginRight: 4,
  },
  settingsSection: {
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
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  logoutContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#EF4444',
    marginLeft: 8,
  },
  versionText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 10,
  },
});