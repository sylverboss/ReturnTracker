/**
 * Utility functions for formatting data
 */

/**
 * Format a price number to currency string
 * @param amount Number or string representing the price
 * @returns Formatted price string
 */
export function formatPrice(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined) return '$0.00';
  
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  return '$' + numAmount.toFixed(2);
}

/**
 * Format a phone number
 * @param phone Phone number string
 * @returns Formatted phone number
 */
export function formatPhoneNumber(phone?: string | null): string {
  if (!phone) return '';
  
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone;
}

/**
 * Convert order items into a summary string
 * @param products Array of return products
 * @returns Summary string with count and names
 */
export function getProductSummary(products?: any[] | null): string {
  if (!products || products.length === 0) return 'No products';
  
  const firstProduct = products[0];
  const productName = firstProduct.product_name || 'Product';
  
  if (products.length === 1) {
    return productName;
  }
  
  // Show more detailed summary for multiple products
  if (products.length <= 3) {
    // If 2-3 products, list them all
    return products
      .map(p => p.product_name || 'Product')
      .join(', ');
  }
  
  // If more than 3 products, show first two and count
  const firstTwo = products.slice(0, 2).map(p => p.product_name || 'Product').join(', ');
  return `${firstTwo} +${products.length - 2} more`;
}

/**
 * Calculate total price from products array
 * @param products Array of return products
 * @returns Total price
 */
export function calculateTotalPrice(products?: any[] | null): number {
  if (!products || products.length === 0) return 0;
  
  return products.reduce((sum, product) => {
    const price = typeof product.price === 'string' 
      ? parseFloat(product.price) 
      : (product.price || 0);
    
    const quantity = product.quantity || 1;
    
    return sum + (price * quantity);
  }, 0);
}