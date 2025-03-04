import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import * as Linking from 'expo-linking';
import { handleAuthLink } from '../app/middleware/auth-link-handler';
import { createLogger } from '../lib/logging';

const logger = createLogger('DeepLinkDebugTool');

// Only show in development
const isDevelopment = process.env.NODE_ENV !== 'production';

export default function DeepLinkDebugTool() {
  const [isVisible, setIsVisible] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [linkHistory, setLinkHistory] = useState<string[]>([]);
  const [currentLink, setCurrentLink] = useState<string | null>(null);
  const [parsedLink, setParsedLink] = useState<any>(null);

  // Listen for links
  useEffect(() => {
    if (!isDevelopment) return;

    const subscription = Linking.addEventListener('url', (event) => {
      const { url } = event;
      setCurrentLink(url);
      setLinkHistory((prev) => [url, ...prev.slice(0, 9)]);
      
      try {
        const parsed = Linking.parse(url);
        setParsedLink(parsed);
      } catch (e) {
        logger.error('Error parsing URL:', e);
      }
    });

    Linking.getInitialURL().then((url) => {
      if (url) {
        setCurrentLink(url);
        setLinkHistory((prev) => [url, ...prev.slice(0, 9)]);
        
        try {
          const parsed = Linking.parse(url);
          setParsedLink(parsed);
        } catch (e) {
          logger.error('Error parsing initial URL:', e);
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const testCustomLink = async () => {
    if (!customUrl) return;
    
    logger.info('Testing custom URL:', customUrl);
    try {
      // First try to handle it with our auth handler
      const wasHandled = await handleAuthLink(customUrl);
      logger.info('Was handled by auth handler:', wasHandled);
      
      if (!wasHandled) {
        // If not handled, try to open it directly
        const supported = await Linking.canOpenURL(customUrl);
        if (supported) {
          await Linking.openURL(customUrl);
          logger.info('Opened URL directly:', customUrl);
        } else {
          logger.warn('Cannot open URL:', customUrl);
        }
      }
    } catch (e) {
      logger.error('Error testing link:', e);
    }
  };

  // Not visible in production or if explicitly hidden
  if (!isDevelopment || !isVisible) {
    return (
      <TouchableOpacity
        style={styles.debugButton}
        onPress={() => setIsVisible(true)}
      >
        <Text style={styles.debugButtonText}>🔍</Text>
      </TouchableOpacity>
    );
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => setIsVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Deep Link Debug</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsVisible(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.currentLinkContainer}>
            <Text style={styles.sectionTitle}>Current Link</Text>
            <Text style={styles.currentLink}>{currentLink || 'No link detected'}</Text>
          </View>

          {parsedLink && (
            <View style={styles.parsedLinkContainer}>
              <Text style={styles.sectionTitle}>Parsed Link</Text>
              <ScrollView style={styles.parsedLinkScroll}>
                <Text style={styles.parsedLinkText}>
                  {`Hostname: ${parsedLink.hostname || 'N/A'}\nPath: ${parsedLink.path || 'N/A'}\nQuery Params: ${JSON.stringify(parsedLink.queryParams, null, 2)}`}
                </Text>
              </ScrollView>
            </View>
          )}

          <View style={styles.testLinkContainer}>
            <Text style={styles.sectionTitle}>Test Custom Link</Text>
            <TextInput
              style={styles.linkInput}
              value={customUrl}
              onChangeText={setCustomUrl}
              placeholder="Enter URL to test (e.g., com.returntrackr://login)"
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              style={styles.testButton}
              onPress={testCustomLink}
            >
              <Text style={styles.testButtonText}>Test Link</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.historyContainer}>
            <Text style={styles.sectionTitle}>Link History</Text>
            <ScrollView style={styles.historyScroll}>
              {linkHistory.length > 0 ? (
                linkHistory.map((link, index) => (
                  <TouchableOpacity
                    key={`${link}-${index}`}
                    style={styles.historyItem}
                    onPress={() => {
                      setCustomUrl(link);
                    }}
                  >
                    <Text style={styles.historyText} numberOfLines={1}>
                      {link}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.emptyHistory}>No links in history</Text>
              )}
            </ScrollView>
          </View>

          <View style={styles.helpContainer}>
            <Text style={styles.helpTitle}>Debug Commands</Text>
            <Text style={styles.helpText}>
              • ADB: adb shell am start -a android.intent.action.VIEW -d "com.returntrackr://login"
            </Text>
            <Text style={styles.helpText}>
              • iOS: xcrun simctl openurl booted "com.returntrackr://login"
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  debugButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  debugButtonText: {
    fontSize: 24,
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '90%',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#1f2937',
  },
  currentLinkContainer: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  currentLink: {
    padding: 10,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    color: '#1f2937',
    fontSize: 14,
  },
  parsedLinkContainer: {
    marginBottom: 15,
  },
  parsedLinkScroll: {
    maxHeight: 100,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    padding: 10,
  },
  parsedLinkText: {
    fontSize: 14,
    color: '#1f2937',
  },
  testLinkContainer: {
    marginBottom: 15,
  },
  linkInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    fontSize: 14,
    color: '#1f2937',
  },
  testButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 6,
    padding: 10,
    alignItems: 'center',
  },
  testButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  historyContainer: {
    marginBottom: 15,
  },
  historyScroll: {
    maxHeight: 120,
  },
  historyItem: {
    padding: 10,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    marginBottom: 5,
  },
  historyText: {
    fontSize: 14,
    color: '#1f2937',
  },
  emptyHistory: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 14,
    padding: 10,
  },
  helpContainer: {
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    padding: 10,
  },
  helpTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  helpText: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 5,
  },
});