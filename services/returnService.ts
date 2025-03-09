/**
 * Services for handling return-related data operations
 */
import { supabase } from '../lib/supabase';
import { Return, ReturnStatus, ReturnStatistics } from '../types/returns';

/**
 * Fetch all returns for the current user
 * @returns Promise with array of returns
 */
export async function getReturns(): Promise<Return[]> {
  const { data, error } = await supabase
    .from('returns')
    .select('*')
    .order('return_deadline', { ascending: true });
    
  if (error) {
    console.error('Error fetching returns:', error);
    throw error;
  }
  
  return data || [];
}

/**
 * Fetch returns filtered by status
 * @param status Return status to filter by, or 'all' for all returns
 * @returns Promise with filtered array of returns
 */
export async function getReturnsByStatus(status: ReturnStatus | 'all'): Promise<Return[]> {
  if (status === 'all') {
    return getReturns();
  }
  
  const { data, error } = await supabase
    .from('returns')
    .select('*')
    .eq('status', status)
    .order('return_deadline', { ascending: true });
    
  if (error) {
    console.error(`Error fetching returns with status ${status}:`, error);
    throw error;
  }
  
  return data || [];
}

/**
 * Fetch detailed information for a specific return
 * @param returnId ID of the return to fetch
 * @returns Promise with return details
 */
export async function getReturnDetails(returnId: string): Promise<Return> {
  const { data, error } = await supabase
    .from('returns')
    .select(`
      *,
      return_items(*),
      return_images(*)
    `)
    .eq('id', returnId)
    .single();
    
  if (error) {
    console.error(`Error fetching return details for ${returnId}:`, error);
    throw error;
  }
  
  return data;
}

/**
 * Create return items from a return's product list
 * @param returnId ID of the parent return
 * @param selectedProductIndices Indices of the selected products from order_items.products
 * @returns Promise with the created return items
 */
export async function createReturnItems(
  returnId: string, 
  selectedProductIndices: number[]
): Promise<any> {
  try {
    // First, get the return details to access the products
    const returnData = await getReturnDetails(returnId);
    
    if (!returnData.order_items?.products) {
      throw new Error('No products found in this return');
    }
    
    // Filter the products based on selected indices
    const selectedProducts = selectedProductIndices.map(
      index => returnData.order_items.products[index]
    );
    
    // Create a return item entry for each selected product
    const returnItems = [];
    
    for (const product of selectedProducts) {
      const { data, error } = await supabase
        .from('return_items')
        .insert({
          return_id: returnId,
          name: product.product_name,
          description: product.sub_vendor ? `Sold by ${product.sub_vendor}` : undefined,
          quantity: product.quantity,
          price: product.price,
          item_img_url: product.product_image_url,
          // Default refund amount to item price × quantity
          refund_amount: product.price * product.quantity
        })
        .select();
        
      if (error) {
        console.error('Error creating return item:', error);
        throw error;
      }
      
      returnItems.push(data[0]);
    }
    
    // Update the return status to in_progress
    const { error } = await supabase
      .from('returns')
      .update({ status: 'in_progress' })
      .eq('id', returnId);
      
    if (error) {
      console.error('Error updating return status:', error);
      throw error;
    }
    
    return returnItems;
  } catch (error) {
    console.error('Error in createReturnItems:', error);
    throw error;
  }
}

/**
 * Get statistics about returns
 * @returns Promise with return statistics
 */
export async function getReturnStatistics(): Promise<ReturnStatistics> {
  // Get all returns to calculate statistics
  const { data: returns, error } = await supabase
    .from('returns')
    .select('*');
    
  if (error) {
    console.error('Error fetching returns for statistics:', error);
    throw error;
  }
  
  if (!returns || returns.length === 0) {
    // Return default values if no returns
    return {
      totalSaved: 0,
      totalReturns: 0,
      completedReturns: 0,
      pendingReturns: 0,
      inProgressReturns: 0,
      expiredReturns: 0
    };
  }
  
  // Calculate statistics
  const completedReturns = returns.filter(r => r.status === 'completed');
  const pendingReturns = returns.filter(r => r.status === 'pending');
  const inProgressReturns = returns.filter(r => 
    ['in_progress', 'shipped', 'delivered'].includes(r.status as ReturnStatus)
  );
  const expiredReturns = returns.filter(r => r.status === 'expired');
  
  // Calculate total saved (sum of refund_amount for completed returns)
  const totalSaved = completedReturns.reduce(
    (sum, current) => sum + Number(current.refund_amount || 0), 
    0
  );
  
  return {
    totalSaved,
    totalReturns: returns.length,
    completedReturns: completedReturns.length,
    pendingReturns: pendingReturns.length,
    inProgressReturns: inProgressReturns.length,
    expiredReturns: expiredReturns.length
  };
}