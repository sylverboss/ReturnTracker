/**
 * Utility functions for date handling
 */

/**
 * Calculate the number of days left until a deadline
 * @param dateString ISO date string of the deadline
 * @returns Number of days left (0 if date is in the past)
 */
export function calculateDaysLeft(dateString?: string | null): number {
  if (!dateString) return 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize time to start of day
  
  const targetDate = new Date(dateString);
  targetDate.setHours(0, 0, 0, 0); // Normalize time to start of day
  
  const differenceMs = targetDate.getTime() - today.getTime();
  const days = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
  
  return days > 0 ? days : 0;
}

/**
 * Format a date string to a human-readable format
 * @param dateString ISO date string
 * @returns Formatted date string
 */
export function formatDate(dateString?: string | null): string {
  if (!dateString) return 'No date';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Check if a return is overdue based on its deadline
 * @param dateString ISO date string of the deadline
 * @returns Boolean indicating if the return is overdue
 */
export function isOverdue(dateString?: string | null): boolean {
  if (!dateString) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize time to start of day
  
  const targetDate = new Date(dateString);
  targetDate.setHours(0, 0, 0, 0); // Normalize time to start of day
  
  return today > targetDate;
}