// Create a new file at app/middleware/auth-link-handler.ts

import { supabase } from '../../lib/supabase';
import { router } from 'expo-router';
import { createLogger } from '../../lib/logging';

const logger = createLogger('AuthLinkHandler');

/**
 * Middleware to handle authentication deep links
 * This function can process various URL formats including Supabase URLs and custom app deep links
 * 
 * @param url The URL to process
 * @returns boolean indicating if the URL was handled
 */
export async function handleAuthLink(url: string): Promise<boolean> {
  logger.info('Processing URL:', url);
  
  // Extract token and type regardless of URL format
  const token = url.match(/token=([^&]+)/)?.[1];
  const type = url.match(/type=([^&]+)/)?.[1];
  
  // Check for authentication-related parameters
  if (token) {
    logger.info(`Found token in URL, type: ${type || 'unknown'}`);
    
    if (type === 'signup') {
      // Handle email confirmation
      logger.info('Processing email confirmation token');
      
      try {
        // Attempt to verify the token
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'email',
        });
        
        if (error) {
          logger.error('Error confirming email:', error);
          // Navigate to login with error
          router.replace('/(auth)/login?error=confirmation');
        } else {
          logger.info('Email confirmed successfully');
          // Navigate to login with success message
          router.replace('/(auth)/login?confirmed=true');
        }
        return true;
      } catch (error) {
        logger.error('Error verifying signup token:', error);
        router.replace('/(auth)/login?error=verification');
        return true;
      }
    } else if (type === 'recovery' || url.includes('reset-password') || url.includes('forgot-password')) {
      // Handle password reset
      logger.info('Processing password reset token');
      router.replace(`/(auth)/forgot-password?token=${token}`);
      return true;
    } else if (type === 'invite') {
      // Handle team/organization invitations if your app has that feature
      logger.info('Processing invitation token');
      router.replace(`/(auth)/login?invite=${token}`);
      return true;
    }
  } 
  
  // Handle success states without tokens
  if (url.includes('confirmed=true')) {
    logger.info('Handling confirmation success redirect');
    router.replace('/(auth)/login?confirmed=true');
    return true;
  }
  
  if (url.includes('reset-success=true')) {
    logger.info('Handling password reset success redirect');
    router.replace('/(auth)/login?reset=success');
    return true;
  }
  
  // URL wasn't handled by this middleware
  logger.info('URL not recognized as an auth link');
  return false;
}