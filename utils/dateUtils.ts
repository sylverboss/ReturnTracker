/**
 * Utility functions for date handling
 */
import { createLogger } from '../lib/logging';

// Create logger for date utilities
const logger = createLogger('dateUtils');

/**
 * Calculate the number of days left until a deadline
 * @param dateString ISO date string of the deadline
 * @returns Number of days left (0 if date is in the past)
 */
export function calculateDaysLeft(dateString?: string | null): number {
  if (!dateString) {
    logger.debug('No date string provided, returning 0 days left');
    return 0;
  }
  
  logger.debug(`Calculating days left for date: ${dateString}`);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize time to start of day
  
  const targetDate = new Date(dateString);
  targetDate.setHours(0, 0, 0, 0); // Normalize time to start of day
  
  logger.debug(`Today: ${today.toISOString()}, Target date: ${targetDate.toISOString()}`);
  
  const differenceMs = targetDate.getTime() - today.getTime();
  const days = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
  
  logger.debug(`Difference in days: ${days}`);
  
  return days > 0 ? days : 0;
}

/**
 * Format a date string to a human-readable format
 * @param dateString ISO date string
 * @returns Formatted date string
 */
export function formatDate(dateString?: string | null): string {
  if (!dateString) {
    logger.debug('No date string provided for formatting, returning default text');
    return 'No date';
  }
  
  logger.debug(`Formatting date: ${dateString}`);
  
  const date = new Date(dateString);
  const formatted = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  logger.debug(`Formatted date: ${formatted}`);
  return formatted;
}

/**
 * Check if a return is overdue based on its deadline
 * @param dateString ISO date string of the deadline
 * @returns Boolean indicating if the return is overdue
 */
export function isOverdue(dateString?: string | null): boolean {
  if (!dateString) {
    logger.debug('No date string provided for overdue check, returning false');
    return false;
  }
  
  logger.debug(`Checking if date is overdue: ${dateString}`);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize time to start of day
  
  const targetDate = new Date(dateString);
  targetDate.setHours(0, 0, 0, 0); // Normalize time to start of day
  
  const isOverdueResult = today > targetDate;
  logger.debug(`Is overdue result: ${isOverdueResult}`);
  
  return isOverdueResult;
}