import { Platform } from 'react-native';
import { makeRedirectUri } from 'expo-auth-session';
import { createLogger } from '../lib/logging';
import Constants from 'expo-constants';

// Initialize logger
const logger = createLogger('PlatformAuthUtils');

/**
 * Platform-specific authentication utilities
 */
export const PlatformAuthUtils = {
  /**
   * Get the appropriate redirect URL for authentication based on the platform
   * @param path The path to redirect to
   * @param params Optional query parameters
   * @returns The platform-specific redirect URL
   */
  getAuthRedirectUrl: (path: string, params: Record<string, string> = {}): string => {
    // Build query string from params
    const queryString = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    
    const queryPart = queryString ? `?${queryString}` : '';
    
    logger.debug(`Creating redirect URL for platform: ${Platform.OS}, path: ${path}`);
    
    if (Platform.OS === 'web') {
      // For web platform
      try {
        const redirectUrl = `${window.location.origin}/${path}${queryPart}`;
        logger.debug(`Created web redirect URL: ${redirectUrl}`);
        return redirectUrl;
      } catch (error) {
        logger.error("Error creating web redirect URL:", error);
        // Fallback to a default URL if window.location is not available
        return `https://returntrackr.app/${path}${queryPart}`;
      }
    } else {
      // For native platforms (iOS, Android)
      // Use a URL scheme that will open your app via deep linking
      // Important: Make sure this matches your app.json scheme
      const redirectUrl = `com.returntrackr://${path}${queryPart}`;
      logger.debug(`Created native redirect URL: ${redirectUrl}`);
      return redirectUrl;
    }
  },
  
  /**
   * Get the appropriate Google auth redirect URI based on the platform
   * @returns The platform-specific Google auth redirect URI
   */
  getGoogleAuthRedirectUri: (): string => {
    return Platform.select({
      web: 'https://orlbgscpjczraksivjrg.supabase.co/auth/v1/callback',
      default: makeRedirectUri({
        scheme: 'com.returntrackr',
        path: 'google-auth'
      }),
    }) || '';
  },
  
  /**
   * Get the appropriate password reset redirect URL based on the platform
   * @returns The platform-specific password reset redirect URL
   */
  getPasswordResetRedirectUrl: (): string => {
    if (Platform.OS === 'web') {
      try {
        const redirectUrl = `${window.location.origin}/reset-password`;
        logger.debug(`Created web password reset URL: ${redirectUrl}`);
        return redirectUrl;
      } catch (error) {
        logger.error("Error creating password reset URL:", error);
        return `https://returntrackr.app/reset-password`;
      }
    } else {
      const redirectUrl = `com.returntrackr://forgot-password`;
      logger.debug(`Created native password reset URL: ${redirectUrl}`);
      return redirectUrl;
    }
  }
};