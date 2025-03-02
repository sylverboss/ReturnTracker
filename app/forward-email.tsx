import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, Copy, CheckCircle } from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useState } from 'react';

export default function ForwardEmailScreen() {
  const [copied, setCopied] = useState(false);
  const emailAddress = 'returns@trackr.app';

  const handleCopy = () => {
    // In a real app, this would copy to clipboard
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBack = () => {
    router.back();
  };

  const handleAddToContacts = () => {
    // In a real app, this would add to contacts
    // For now, just show a success message
    alert('Added to contacts!');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Forward Your Email</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {/* Email Icon */}
        <Animated.View 
          entering={FadeIn.delay(200).springify()}
          style={styles.emailIconContainer}
        >
          <View style={styles.emailIcon}>
            <Text style={styles.emailIconText}>📧</Text>
          </View>
        </Animated.View>

        {/* Instructions */}
        <Animated.View 
          entering={FadeInDown.delay(300).springify()}
          style={styles.instructionsContainer}
        >
          <Text style={styles.instructionsTitle}>
            Forward your purchase confirmation email to:
          </Text>
          
          <View style={styles.emailAddressContainer}>
            <Text style={styles.emailAddress}>{emailAddress}</Text>
            <TouchableOpacity 
              style={styles.copyButton}
              onPress={handleCopy}
            >
              {copied ? (
                <CheckCircle size={20} color="#22C55E" />
              ) : (
                <Copy size={20} color="#3B82F6" />
              )}
              <Text style={[styles.copyText, copied && styles.copiedText]}>
                {copied ? 'Copied!' : 'Copy'}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Quick Tips */}
        <Animated.View 
          entering={FadeInDown.delay(400).springify()}
          style={styles.tipsContainer}
        >
          <Text style={styles.tipsTitle}>Quick Tips</Text>
          
          <View style={styles.tipItem}>
            <View style={styles.checkmark}>
              <CheckCircle size={16} color="#22C55E" />
            </View>
            <Text style={styles.tipText}>
              Forward the original purchase confirmation email
            </Text>
          </View>
          
          <View style={styles.tipItem}>
            <View style={styles.checkmark}>
              <CheckCircle size={16} color="#22C55E" />
            </View>
            <Text style={styles.tipText}>
              Make sure the email contains order details and return policy
            </Text>
          </View>
          
          <View style={styles.tipItem}>
            <View style={styles.checkmark}>
              <CheckCircle size={16} color="#22C55E" />
            </View>
            <Text style={styles.tipText}>
              We'll automatically extract return deadline and policy
            </Text>
          </View>
        </Animated.View>

        {/* Add to Contacts Button */}
        <Animated.View 
          entering={FadeInDown.delay(500).springify()}
          style={styles.addToContactsContainer}
        >
          <TouchableOpacity 
            style={styles.addToContactsButton}
            onPress={handleAddToContacts}
          >
            <Text style={styles.addToContactsText}>Add to Contacts</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Manual Entry Option */}
        <Animated.View 
          entering={FadeInDown.delay(600).springify()}
          style={styles.manualEntryContainer}
        >
          <TouchableOpacity 
            style={styles.manualEntryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.manualEntryText}>Manual Entry Instead</Text>
          </TouchableOpacity>
        </Animated.View>
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
  },
  emailIconContainer: {
    marginVertical: 30,
  },
  emailIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emailIconText: {
    fontSize: 40,
  },
  instructionsContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  instructionsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#4B5563',
    marginBottom: 16,
    textAlign: 'center',
  },
  emailAddressContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  emailAddress: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  copyText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
    marginLeft: 4,
  },
  copiedText: {
    color: '#22C55E',
  },
  tipsContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
  },
  tipsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  checkmark: {
    marginRight: 8,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 20,
  },
  addToContactsContainer: {
    width: '100%',
    marginBottom: 16,
  },
  addToContactsButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addToContactsText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  manualEntryContainer: {
    width: '100%',
  },
  manualEntryButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  manualEntryText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
});